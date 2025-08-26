import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

function getBaseUrl(): string {
  // Production'da backend servisining URL'ini ishlatamiz
  if (import.meta.env.PROD) {
    return "https://realnews-backend.onrender.com";
  }
  // Development'da local server
  return "";
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const baseUrl = getBaseUrl();
  const fullUrl = baseUrl + url;
  
  const res = await fetch(fullUrl, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    // Build URL from query key
    let url = "";
    let queryParams = new URLSearchParams();
    
    for (let i = 0; i < queryKey.length; i++) {
      const part = queryKey[i];
      
      if (typeof part === "string") {
        if (url) {
          url += "/" + part;
        } else {
          url = part;
        }
      } else if (typeof part === "object" && part !== null) {
        // Handle query parameters
        Object.entries(part).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            queryParams.append(key, String(value));
          }
        });
      }
    }
    
    // Add query parameters to URL
    const queryString = queryParams.toString();
    const baseUrl = getBaseUrl();
    const finalUrl = queryString ? `${baseUrl}${url}?${queryString}` : `${baseUrl}${url}`;
    
    const res = await fetch(finalUrl, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
