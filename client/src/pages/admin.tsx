import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { updateSEOTags } from "@/lib/seo";
import { 
  Settings, 
  Rss, 
  FileText, 
  BarChart3, 
  Users, 
  RefreshCw, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  EyeOff,
  Star,
  StarOff
} from "lucide-react";
import type { Article, Category, RssFeed, Newsletter } from "@shared/schema";

interface AdminStats {
  totalArticles: number;
  totalCategories: number;
  totalFeeds: number;
  totalSubscribers: number;
}

export default function AdminPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [newArticle, setNewArticle] = useState({
    title: "",
    description: "",
    content: "",
    imageUrl: "",
    sourceUrl: "",
    sourceName: "",
    categoryId: "",
    isBreaking: false,
    isFeatured: false
  });
  const [newFeed, setNewFeed] = useState({
    url: "",
    name: "",
    categoryId: ""
  });
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Queries
  const { data: articles = [] } = useQuery<Article[]>({
    queryKey: ["/api/articles", { limit: 100 }]
  });

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"]
  });

  const { data: feeds = [] } = useQuery<RssFeed[]>({
    queryKey: ["/api/admin/rss-feeds"]
  });

  const { data: newsletters = [] } = useQuery<Newsletter[]>({
    queryKey: ["/api/admin/newsletters"]
  });

  // Mutations
  const fetchRssMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/admin/fetch-rss"),
    onSuccess: () => {
      toast({
        title: "Muvaffaqiyatli!",
        description: "RSS feedlar muvaffaqiyatli yangilandi",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/articles"] });
    },
    onError: () => {
      toast({
        title: "Xatolik",
        description: "RSS feedlarni yangilashda xatolik yuz berdi",
        variant: "destructive",
      });
    }
  });

  const createArticleMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/admin/articles", data),
    onSuccess: () => {
      toast({
        title: "Muvaffaqiyatli!",
        description: "Yangi maqola qo'shildi",
      });
      setNewArticle({
        title: "",
        description: "",
        content: "",
        imageUrl: "",
        sourceUrl: "",
        sourceName: "",
        categoryId: "",
        isBreaking: false,
        isFeatured: false
      });
      queryClient.invalidateQueries({ queryKey: ["/api/articles"] });
    },
    onError: () => {
      toast({
        title: "Xatolik",
        description: "Maqolani qo'shishda xatolik yuz berdi",
        variant: "destructive",
      });
    }
  });

  const createFeedMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/admin/rss-feeds", data),
    onSuccess: () => {
      toast({
        title: "Muvaffaqiyatli!",
        description: "Yangi RSS feed qo'shildi",
      });
      setNewFeed({ url: "", name: "", categoryId: "" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/rss-feeds"] });
    },
    onError: () => {
      toast({
        title: "Xatolik",
        description: "RSS feed qo'shishda xatolik yuz berdi",
        variant: "destructive",
      });
    }
  });

  const toggleArticleFeaturedMutation = useMutation({
    mutationFn: (data: { id: string; featured: boolean }) => 
      apiRequest("PATCH", `/api/admin/articles/${data.id}/featured`, { isFeatured: data.featured }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/articles"] });
    }
  });

  const toggleArticleBreakingMutation = useMutation({
    mutationFn: (data: { id: string; breaking: boolean }) => 
      apiRequest("PATCH", `/api/admin/articles/${data.id}/breaking`, { isBreaking: data.breaking }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/articles"] });
    }
  });

  useEffect(() => {
    updateSEOTags({
      title: "Admin Panel - RealNews",
      description: "RealNews admin paneli - maqolalar, kategoriyalar va RSS feedlarni boshqarish",
      type: "website"
    });
  }, []);

  const stats: AdminStats = {
    totalArticles: articles.length,
    totalCategories: categories.length,
    totalFeeds: feeds.length,
    totalSubscribers: newsletters.length
  };

  const filteredArticles = selectedCategory && selectedCategory !== "all"
    ? articles.filter(article => article.categoryId === selectedCategory)
    : articles;

  const handleCreateArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newArticle.title || !newArticle.categoryId) {
      toast({
        title: "Xatolik",
        description: "Sarlavha va kategoriya majburiy",
        variant: "destructive",
      });
      return;
    }

    const slug = newArticle.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim();

    createArticleMutation.mutate({
      ...newArticle,
      slug,
      publishedAt: new Date(),
      isBreaking: newArticle.isBreaking ? "true" : "false",
      isFeatured: newArticle.isFeatured ? "true" : "false"
    });
  };

  const handleCreateFeed = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFeed.url || !newFeed.name || !newFeed.categoryId) {
      toast({
        title: "Xatolik",
        description: "Barcha maydonlar majburiy",
        variant: "destructive",
      });
      return;
    }

    createFeedMutation.mutate(newFeed);
  };

  return (
    <div className="container mx-auto px-4 max-w-7xl py-8" data-testid="admin-page">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">Admin Panel</h1>
        <p className="text-gray-600">RealNews platformasini boshqarish</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Jami Maqolalar</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="total-articles">{stats.totalArticles}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Kategoriyalar</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="total-categories">{stats.totalCategories}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">RSS Feedlar</CardTitle>
            <Rss className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="total-feeds">{stats.totalFeeds}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Obunachilar</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="total-subscribers">{stats.totalSubscribers}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="articles" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="articles">Maqolalar</TabsTrigger>
          <TabsTrigger value="rss">RSS Feedlar</TabsTrigger>
          <TabsTrigger value="create">Yaratish</TabsTrigger>
          <TabsTrigger value="settings">Sozlamalar</TabsTrigger>
        </TabsList>

        {/* Articles Management */}
        <TabsContent value="articles">
          <Card>
            <CardHeader>
              <CardTitle>Maqolalarni Boshqarish</CardTitle>
              <CardDescription>
                Mavjud maqolalarni ko'rish va tahrirlash
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-64">
                    <SelectValue placeholder="Kategoriya bo'yicha filtrlash" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Barcha kategoriyalar</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                {filteredArticles.map((article) => (
                  <div key={article.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium mb-1">{article.title}</h4>
                      <p className="text-sm text-gray-600 mb-2">{article.description?.substring(0, 100)}...</p>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{categories.find(c => c.id === article.categoryId)?.name}</Badge>
                        {article.isBreaking === "true" && <Badge variant="destructive">Tezkor</Badge>}
                        {article.isFeatured === "true" && <Badge variant="default">Asosiy</Badge>}
                        <span className="text-xs text-gray-500">{article.views} ko'rishlar</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleArticleFeaturedMutation.mutate({
                          id: article.id,
                          featured: article.isFeatured !== "true"
                        })}
                        data-testid={`toggle-featured-${article.id}`}
                      >
                        {article.isFeatured === "true" ? <Star className="h-4 w-4 text-yellow-500" /> : <StarOff className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleArticleBreakingMutation.mutate({
                          id: article.id,
                          breaking: article.isBreaking !== "true"
                        })}
                        data-testid={`toggle-breaking-${article.id}`}
                      >
                        {article.isBreaking === "true" ? <Eye className="h-4 w-4 text-red-500" /> : <EyeOff className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* RSS Management */}
        <TabsContent value="rss">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>RSS Feedlarni Boshqarish</CardTitle>
                  <CardDescription>RSS feedlarni ko'rish va yangilash</CardDescription>
                </div>
                <Button 
                  onClick={() => fetchRssMutation.mutate()}
                  disabled={fetchRssMutation.isPending}
                  data-testid="button-fetch-rss"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  {fetchRssMutation.isPending ? "Yangilanmoqda..." : "RSS Yangilash"}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {feeds.map((feed) => (
                  <div key={feed.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{feed.name}</h4>
                      <p className="text-sm text-gray-600">{feed.url}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline">
                          {categories.find(c => c.id === feed.categoryId)?.name}
                        </Badge>
                        <Badge variant={feed.isActive === "true" ? "default" : "secondary"}>
                          {feed.isActive === "true" ? "Faol" : "Nofaol"}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      {feed.lastFetchedAt 
                        ? `Oxirgi yangilanish: ${new Date(feed.lastFetchedAt).toLocaleDateString("uz-UZ")}`
                        : "Hali yangilanmagan"
                      }
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Create Content */}
        <TabsContent value="create">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Create Article */}
            <Card>
              <CardHeader>
                <CardTitle>Yangi Maqola Yaratish</CardTitle>
                <CardDescription>Qo'lda yangi maqola qo'shish</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateArticle} className="space-y-4">
                  <Input
                    placeholder="Maqola sarlavhasi"
                    value={newArticle.title}
                    onChange={(e) => setNewArticle(prev => ({ ...prev, title: e.target.value }))}
                    required
                    data-testid="input-article-title"
                  />
                  
                  <Textarea
                    placeholder="Qisqacha tavsif"
                    value={newArticle.description}
                    onChange={(e) => setNewArticle(prev => ({ ...prev, description: e.target.value }))}
                    data-testid="textarea-article-description"
                  />
                  
                  <Textarea
                    placeholder="Maqola matni"
                    value={newArticle.content}
                    onChange={(e) => setNewArticle(prev => ({ ...prev, content: e.target.value }))}
                    rows={6}
                    data-testid="textarea-article-content"
                  />
                  
                  <Input
                    placeholder="Rasm URL manzili"
                    value={newArticle.imageUrl}
                    onChange={(e) => setNewArticle(prev => ({ ...prev, imageUrl: e.target.value }))}
                    data-testid="input-article-image"
                  />
                  
                  <Input
                    placeholder="Manba URL manzili"
                    value={newArticle.sourceUrl}
                    onChange={(e) => setNewArticle(prev => ({ ...prev, sourceUrl: e.target.value }))}
                    data-testid="input-article-source-url"
                  />
                  
                  <Input
                    placeholder="Manba nomi"
                    value={newArticle.sourceName}
                    onChange={(e) => setNewArticle(prev => ({ ...prev, sourceName: e.target.value }))}
                    data-testid="input-article-source-name"
                  />
                  
                  <Select 
                    value={newArticle.categoryId} 
                    onValueChange={(value) => setNewArticle(prev => ({ ...prev, categoryId: value }))}
                  >
                    <SelectTrigger data-testid="select-article-category">
                      <SelectValue placeholder="Kategoriyani tanlang" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={newArticle.isFeatured}
                        onCheckedChange={(checked) => setNewArticle(prev => ({ ...prev, isFeatured: checked }))}
                        data-testid="switch-article-featured"
                      />
                      <span className="text-sm">Asosiy maqola</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={newArticle.isBreaking}
                        onCheckedChange={(checked) => setNewArticle(prev => ({ ...prev, isBreaking: checked }))}
                        data-testid="switch-article-breaking"
                      />
                      <span className="text-sm">Tezkor yangilik</span>
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    disabled={createArticleMutation.isPending}
                    data-testid="button-create-article"
                  >
                    {createArticleMutation.isPending ? "Yaratilmoqda..." : "Maqola Yaratish"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Create RSS Feed */}
            <Card>
              <CardHeader>
                <CardTitle>Yangi RSS Feed Qo'shish</CardTitle>
                <CardDescription>Yangi yangilik manbai qo'shish</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateFeed} className="space-y-4">
                  <Input
                    placeholder="Feed URL manzili"
                    value={newFeed.url}
                    onChange={(e) => setNewFeed(prev => ({ ...prev, url: e.target.value }))}
                    required
                    data-testid="input-feed-url"
                  />
                  
                  <Input
                    placeholder="Feed nomi"
                    value={newFeed.name}
                    onChange={(e) => setNewFeed(prev => ({ ...prev, name: e.target.value }))}
                    required
                    data-testid="input-feed-name"
                  />
                  
                  <Select 
                    value={newFeed.categoryId} 
                    onValueChange={(value) => setNewFeed(prev => ({ ...prev, categoryId: value }))}
                  >
                    <SelectTrigger data-testid="select-feed-category">
                      <SelectValue placeholder="Kategoriyani tanlang" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Button 
                    type="submit" 
                    disabled={createFeedMutation.isPending}
                    data-testid="button-create-feed"
                  >
                    {createFeedMutation.isPending ? "Qo'shilmoqda..." : "Feed Qo'shish"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Settings */}
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Tizim Sozlamalari</CardTitle>
              <CardDescription>Platformaning asosiy sozlamalari</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium mb-2">RSS Feed Sozlamalari</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    RSS feedlar har 30 daqiqada avtomatik ravishda yangilanadi
                  </p>
                  <Button 
                    onClick={() => fetchRssMutation.mutate()}
                    disabled={fetchRssMutation.isPending}
                    data-testid="button-manual-rss-fetch"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Qo'lda Yangilash
                  </Button>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Newsletter Obunachilar</h4>
                  <p className="text-sm text-gray-600">
                    Jami {newsletters.length} obunachi mavjud
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}