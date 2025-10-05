
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Copy, Phone } from 'lucide-react';

interface DesktopCallModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  phoneNumber: string;
}

export const DesktopCallModal = ({ open, onOpenChange, phoneNumber }: DesktopCallModalProps) => {
  const { toast } = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(phoneNumber).then(() => {
      toast({ title: 'Copied!', description: 'Phone number copied to clipboard.' });
    }, () => {
      toast({ title: 'Error', description: 'Could not copy number.', variant: 'destructive' });
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Call on Desktop</DialogTitle>
          <DialogDescription>
            You can use a connected phone or a desktop calling app.
          </DialogDescription>
        </DialogHeader>
        <div className="my-4 p-4 bg-muted rounded-lg flex items-center justify-between">
            <p className="text-lg font-mono">{phoneNumber}</p>
            <Button size="icon" variant="outline" onClick={handleCopy}>
                <Copy className="h-4 w-4" />
            </Button>
        </div>
        <a href={`tel:${phoneNumber}`} className="w-full">
            <Button className="w-full">
                <Phone className="mr-2 h-4 w-4" />
                Open Calling App
            </Button>
        </a>
      </DialogContent>
    </Dialog>
  );
};
