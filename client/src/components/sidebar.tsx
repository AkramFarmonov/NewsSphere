import { useState } from "react";
import { Link } from "wouter";
import { Flame, Cloud, Mail, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTrendingArticles } from "@/hooks/use-news";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import NewsCard from "./news-card";

export default function Sidebar() {
  const { data: trendingArticles = [], isLoading } = useTrendingArticles(5);
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const newsletterMutation = useMutation({
    mutationFn: (email: string) => apiRequest("POST", "/api/newsletter/subscribe", { email }),
    onSuccess: () => {
      toast({
        title: "Muvaffaqiyatli!",
        description: "Siz muvaffaqiyatli obuna bo'ldingiz!",
      });
      setEmail("");
    },
    onError: (error: any) => {
      const message = error.message.includes("409") 
        ? "Bu email manzili allaqachon obuna bo'lgan"
        : "Obuna bo'lishda xatolik yuz berdi";
      toast({
        title: "Xatolik",
        description: message,
        variant: "destructive",
      });
    },
  });

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      newsletterMutation.mutate(email.trim());
    }
  };

  return (
    <aside className="lg:col-span-1" data-testid="sidebar">
      
      {/* Trending News */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8" data-testid="trending-news">
        <h3 className="text-xl font-bold mb-4 text-primary flex items-center">
          <Flame className="mr-2 text-red-500 w-5 h-5" />
          Mashhur yangiliklar
        </h3>
        
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start space-x-3 pb-4 border-b border-gray-100 last:border-b-0">
                <div className="bg-gray-200 rounded-full w-6 h-6 flex-shrink-0 animate-pulse"></div>
                <div className="flex-1">
                  <div className="bg-gray-200 h-4 rounded mb-2 animate-pulse"></div>
                  <div className="bg-gray-200 h-3 rounded w-2/3 animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {trendingArticles.map((article, index) => (
              <div key={article.id} className="flex items-start space-x-3 pb-4 border-b border-gray-100 last:border-b-0" data-testid={`trending-item-${index + 1}`}>
                <span className={`rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 text-white ${
                  index === 0 ? 'bg-accent' : 'bg-gray-400'
                }`}>
                  {index + 1}
                </span>
                <div className="flex-1">
                  <Link href={`/article/${article.slug}`}>
                    <h4 className="font-medium text-sm hover:text-accent cursor-pointer transition-colors mb-1" data-testid={`trending-title-${index + 1}`}>
                      {article.title}
                    </h4>
                  </Link>
                  <div className="flex items-center text-xs text-gray-500">
                    <span data-testid={`trending-source-${index + 1}`}>{article.sourceName}</span>
                    <span className="mx-1">•</span>
                    <span>{new Date(article.publishedAt).toLocaleDateString("uz-UZ")}</span>
                  </div>
                </div>
              </div>
            ))}
            
            {trendingArticles.length === 0 && (
              <p className="text-gray-500 text-sm">Hozircha mashhur yangiliklar mavjud emas</p>
            )}
          </div>
        )}
      </div>

      {/* Weather Widget */}
      <div className="bg-gradient-to-br from-blue-400 to-blue-600 text-white rounded-xl p-6 mb-8" data-testid="weather-widget">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Cloud className="mr-2 w-5 h-5" />
          Ob-havo
        </h3>
        <div className="text-center">
          <div className="text-3xl font-bold mb-2" data-testid="current-temperature">+5°C</div>
          <div className="text-blue-100 mb-4" data-testid="weather-description">Toshkent, bulutli</div>
          <div className="grid grid-cols-3 gap-2 text-sm">
            <div className="text-center">
              <div className="text-blue-100">Bugun</div>
              <div className="font-medium" data-testid="weather-today">+7°C</div>
            </div>
            <div className="text-center">
              <div className="text-blue-100">Ertaga</div>
              <div className="font-medium" data-testid="weather-tomorrow">+3°C</div>
            </div>
            <div className="text-center">
              <div className="text-blue-100">Indinga</div>
              <div className="font-medium" data-testid="weather-dayafter">+1°C</div>
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter Subscription */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8" data-testid="newsletter-widget">
        <h3 className="text-lg font-semibold mb-4 text-primary flex items-center">
          <Mail className="mr-2 w-5 h-5" />
          Yangiliklarni elektron pochtaga olish
        </h3>
        <p className="text-gray-600 text-sm mb-4">
          Eng muhim yangiliklarni har kuni elektron pochtangizga olishni xohlaysizmi?
        </p>
        <form onSubmit={handleNewsletterSubmit}>
          <Input
            type="email"
            placeholder="Email manzilingiz"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mb-3"
            required
            data-testid="input-newsletter-email"
          />
          <Button 
            type="submit" 
            className="w-full bg-accent text-white hover:bg-blue-700"
            disabled={newsletterMutation.isPending}
            data-testid="button-newsletter-subscribe"
          >
            {newsletterMutation.isPending ? "Yuborilmoqda..." : "Obuna bo'lish"}
          </Button>
        </form>
      </div>

      {/* Social Media Links */}
      <div className="bg-white rounded-xl shadow-sm p-6" data-testid="social-media-widget">
        <h3 className="text-lg font-semibold mb-4 text-primary flex items-center">
          <Share2 className="mr-2 w-5 h-5" />
          Ijtimoiy tarmoqlarda kuzating
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <a 
            href="#" 
            className="flex items-center justify-center py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            data-testid="link-telegram"
          >
            <i className="fab fa-telegram mr-2"></i>Telegram
          </a>
          <a 
            href="#" 
            className="flex items-center justify-center py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
            data-testid="link-facebook"
          >
            <i className="fab fa-facebook mr-2"></i>Facebook
          </a>
          <a 
            href="#" 
            className="flex items-center justify-center py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors text-sm"
            data-testid="link-instagram"
          >
            <i className="fab fa-instagram mr-2"></i>Instagram
          </a>
          <a 
            href="#" 
            className="flex items-center justify-center py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
            data-testid="link-youtube"
          >
            <i className="fab fa-youtube mr-2"></i>YouTube
          </a>
        </div>
      </div>

    </aside>
  );
}
