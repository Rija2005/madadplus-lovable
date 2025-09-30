import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { WifiOff, Wifi, RefreshCw } from 'lucide-react';
import { syncOfflineReports, isOnline, onNetworkChange } from '@/services/backendHooks';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

export const OfflineIndicator = () => {
  const [online, setOnline] = useState(isOnline());
  const [offlineQueue, setOfflineQueue] = useState(0);
  const [syncing, setSyncing] = useState(false);
  const { toast } = useToast();
  const { language } = useLanguage();

  useEffect(() => {
    // Check offline queue size
    const checkQueue = () => {
      try {
        const queue = JSON.parse(localStorage.getItem('madadgar-offline-queue') || '[]');
        setOfflineQueue(queue.length);
      } catch (e) {
        console.error('Error checking queue:', e);
      }
    };

    checkQueue();
    const interval = setInterval(checkQueue, 5000);

    // Monitor network status
    const cleanup = onNetworkChange((isOnline) => {
      setOnline(isOnline);
      if (isOnline && offlineQueue > 0) {
        // Auto-sync when coming back online
        handleSync();
      }
    });

    return () => {
      clearInterval(interval);
      cleanup();
    };
  }, [offlineQueue]);

  const handleSync = async () => {
    if (!online || offlineQueue === 0 || syncing) return;

    setSyncing(true);
    try {
      const result = await syncOfflineReports();
      
      if (result.synced > 0) {
        toast({
          title: language === 'en' ? 'Reports Synced' : 'رپورٹس مطابقت پذیر',
          description: language === 'en' 
            ? `Successfully synced ${result.synced} report(s)`
            : `کامیابی سے ${result.synced} رپورٹ(یں) مطابقت پذیر`,
          variant: 'default',
        });
        setOfflineQueue(0);
      }

      if (result.failed > 0) {
        toast({
          title: language === 'en' ? 'Sync Failed' : 'مطابقت ناکام',
          description: language === 'en'
            ? `Failed to sync ${result.failed} report(s)`
            : `${result.failed} رپورٹ(یں) مطابقت ناکام`,
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: language === 'en' ? 'Sync Error' : 'مطابقت کی خرابی',
        description: language === 'en'
          ? 'Failed to sync offline reports'
          : 'آف لائن رپورٹس کی مطابقت ناکام',
        variant: 'destructive',
      });
    } finally {
      setSyncing(false);
    }
  };

  // Don't show if online and queue is empty
  if (online && offlineQueue === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-6 left-6 z-40 max-w-sm">
      <Card className={online ? 'bg-primary/5 border-primary/20' : 'bg-warning/5 border-warning/20'}>
        <CardContent className="pt-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              online ? 'bg-success/10' : 'bg-warning/10'
            }`}>
              {online ? (
                <Wifi className="w-5 h-5 text-success" />
              ) : (
                <WifiOff className="w-5 h-5 text-warning" />
              )}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Badge variant={online ? 'success' : 'warning'}>
                  {online 
                    ? (language === 'en' ? 'Online' : 'آن لائن')
                    : (language === 'en' ? 'Offline Mode' : 'آف لائن موڈ')
                  }
                </Badge>
                {offlineQueue > 0 && (
                  <Badge variant="secondary">
                    {offlineQueue} {language === 'en' ? 'queued' : 'قطار میں'}
                  </Badge>
                )}
              </div>
              
              <p className="text-xs text-muted-foreground mt-1">
                {online
                  ? (language === 'en' 
                      ? 'Connected to server'
                      : 'سرور سے منسلک')
                  : (language === 'en'
                      ? 'Reports will be sent when online'
                      : 'آن لائن ہونے پر رپورٹس بھیجی جائیں گی')
                }
              </p>
            </div>

            {online && offlineQueue > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleSync}
                disabled={syncing}
                className="ml-2"
              >
                <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
