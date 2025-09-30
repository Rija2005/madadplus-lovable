import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { submitEmergencyReport, EmergencyReport } from '@/services/backendHooks';
import { FileText, MapPin, AlertTriangle, Loader2 } from 'lucide-react';

interface ReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reportType: string;
  initialDescription?: string;
}

export const TextReportDialog = ({ open, onOpenChange, reportType, initialDescription }: ReportDialogProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState(initialDescription || '');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!title || !description) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    const report: EmergencyReport = {
      type: reportType as any,
      title,
      description,
      location: {
        address: location || 'Location auto-detected'
      },
      timestamp: new Date(),
      status: 'submitted',
      priority: 'high',
      isAnonymous: false
    };

    const result = await submitEmergencyReport(report);
    setLoading(false);

    if (result.success) {
      toast({
        title: "Report Submitted!",
        description: `Report ID: ${result.reportId}. Emergency services have been notified.`,
        variant: "default"
      });
      setTitle('');
      setDescription('');
      setLocation('');
      onOpenChange(false);
    } else {
      toast({
        title: "Submission Failed",
        description: result.error || "Please try again",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Text Report
          </DialogTitle>
          <DialogDescription>
            Provide details about the emergency
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Emergency Title *</Label>
            <Input
              id="title"
              placeholder="Brief title of emergency"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="location">Location</Label>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <Input
                id="location"
                placeholder="Auto-detected or enter manually"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Detailed description of the emergency..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
            />
          </div>

          <div className="flex items-center gap-2 p-3 bg-warning/10 rounded-lg text-sm">
            <AlertTriangle className="w-4 h-4 text-warning" />
            <span>Emergency services will be notified immediately</span>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button 
              variant="emergency" 
              onClick={handleSubmit} 
              className="flex-1"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Report'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
