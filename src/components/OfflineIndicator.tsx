
import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { WifiOff, Wifi, RefreshCw } from 'lucide-react';
import { useIsOnline, syncOfflineReports } from '@/services/backendHooks';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';

export const OfflineIndicator = () => {
  const isOnline = useIsOnline();
  const [offlineQueue, setOfflineQueue] = useState(0);
  const [syncing, setSyncing] = useState(false);
  const { language } = useLanguage();

  useEffect(() => {
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

    if (isOnline && offlineQueue > 0) {
      handleSync();
    }

    return () => {
      clearInterval(interval);
    };
  }, [isOnline, offlineQueue]);

  const handleSync = async () => {
    if (!isOnline || offlineQueue === 0 || syncing) return;

    setSyncing(true);
    try {
      const result = await syncOfflineReports();
      
      if (result.synced > 0) {
        toast.success(language === 'en' ? 'Reports Synced' : 'رپورٹس مطابقت پذیر',
          {
            description: language === 'en' 
              ? `Successfully synced ${result.synced} report(s)`
              : `کامیابی سے ${result.synced} رپورٹ(یں) مطابقت پذیر`,
          }
        );
        setOfflineQueue(0);
      }

      if (result.failed > 0) {
        toast.error(language === 'en' ? 'Sync Failed' : 'مطابقت ناکام',
          {
            description: language === 'en'
              ? `Failed to sync ${result.failed} report(s)`
              : `${result.failed} رپورٹ(یں) مطابقت ناکام`,
          }
        );
      }
    } catch (error) {
      toast.error(language === 'en' ? 'Sync Error' : 'مطابقت کی خرابی',
        {
          description: language === 'en'
            ? 'Failed to sync offline reports'
            : 'آف لائن رپورٹس کی مطابقت ناکام',
        }
      );
    } finally {
      setSyncing(false);
    }
  };

  if (isOnline && offlineQueue === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-6 left-6 z-40 max-w-sm">
      <Card className={isOnline ? 'bg-primary/5 border-primary/20' : 'bg-warning/5 border-warning/20'}>
        <CardContent className="pt-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              isOnline ? 'bg-success/10' : 'bg-warning/10'
            }`}>
              {isOnline ? (
                <Wifi className="w-5 h-5 text-success" />
              ) : (
                <WifiOff className="w-5 h-5 text-warning" />
              )}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Badge variant={isOnline ? 'success' : 'warning'}>
                  {isOnline 
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
                {isOnline
                  ? (language === 'en' 
                      ? 'Connected to server'
                      : 'سرور سے منسلک')
                  : (language === 'en'
                      ? 'Reports will be sent when online'
                      : 'آن لائن ہونے پر رپورٹس بھیجی جائیں گی')
                }
              </p>
            </div>

            {isOnline && offlineQueue > 0 && (
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
