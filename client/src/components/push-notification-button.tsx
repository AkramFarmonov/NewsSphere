import { Bell, BellOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { usePushNotifications } from "@/hooks/use-push-notifications";
import { useState, useEffect } from "react";

export function PushNotificationButton() {
  const [showDialog, setShowDialog] = useState(false);
  const [hasAutoShown, setHasAutoShown] = useState(false);
  const {
    isSupported,
    permission,
    isSubscribed,
    isLoading,
    error,
    requestPermission,
    unsubscribe
  } = usePushNotifications();

  // 1 daqiqadan keyin avtomatik popup
  useEffect(() => {
    // Agar qo'llab-quvvatlanmasa yoki allaqachon obuna bo'lgan bo'lsa, timer ishlatmaymiz
    if (!isSupported || isSubscribed || permission === 'granted' || hasAutoShown) {
      return;
    }

    const timer = setTimeout(() => {
      setShowDialog(true);
      setHasAutoShown(true);
    }, 60 * 1000); // 1 daqiqa = 60 sekund

    return () => clearTimeout(timer);
  }, [isSupported, isSubscribed, permission, hasAutoShown]);

  // Brauzer qo'llab-quvvatlamasa, hech narsa ko'rsatmaymiz
  if (!isSupported) {
    return null;
  }

  const handleSubscribe = async () => {
    const success = await requestPermission();
    if (success) {
      setShowDialog(false);
      setHasAutoShown(true); // Muvaffaqiyatli obuna bo'lgandan keyin boshqa popup ko'rsatmaymiz
    }
  };

  const handleUnsubscribe = async () => {
    await unsubscribe();
  };

  // Agar allaqachon obuna bo'lgan bo'lsa, obunani bekor qilish tugmasini ko'rsatamiz
  if (isSubscribed && permission === 'granted') {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={handleUnsubscribe}
        disabled={isLoading}
        className="flex items-center"
        data-testid="button-unsubscribe-notifications"
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <BellOff className="h-4 w-4" />
        )}
      </Button>
    );
  }

  // Agar ruxsat berilmagan bo'lsa yoki obuna bo'lmagan bo'lsa
  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center"
          data-testid="button-enable-notifications"
        >
          <Bell className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Push Bildirishnomalar
          </DialogTitle>
          <DialogDescription>
            Eng so'nggi yangiliklar va shoshilinch xabarlardan xabardor bo'ling
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            <p className="mb-2">Bildirishnomalarni yoqish orqali siz:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>🚨 Shoshilinch yangiliklar haqida darhol xabardor bo'lasiz</li>
              <li>📱 Muhim voqealarni o'tkazib yubormaysiz</li>
              <li>⚡ Eng tez yangiliklar manbaiga aylaning</li>
            </ul>
          </div>

          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-2">
            <Button
              onClick={handleSubscribe}
              disabled={isLoading}
              className="w-full"
              data-testid="button-subscribe-notifications"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Obuna bo'lmoqda...
                </>
              ) : (
                <>
                  <Bell className="mr-2 h-4 w-4" />
                  Bildirishnomalarni yoqish
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setShowDialog(false);
                setHasAutoShown(true); // "Keyinroq" tugmasini bosgandan keyin qayta ko'rsatmaymiz
              }}
              className="w-full"
              data-testid="button-cancel-notifications"
            >
              Keyinroq
            </Button>
          </div>

          <div className="text-xs text-muted-foreground">
            <p>
              💡 <strong>Eslatma:</strong> Bildirishnomalarni istalgan vaqtda sozlamalarda o'chirib qo'yishingiz mumkin.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}