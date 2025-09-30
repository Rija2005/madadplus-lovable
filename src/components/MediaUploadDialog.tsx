import { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { submitEmergencyReport, EmergencyReport } from '@/services/backendHooks';
import { Camera, Upload, X, Loader2, Image, Video } from 'lucide-react';

interface MediaUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reportType: string;
}

export const MediaUploadDialog = ({ open, onOpenChange, reportType }: MediaUploadDialogProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    
    if (selectedFiles.length + files.length > 5) {
      toast({
        title: "Too Many Files",
        description: "Maximum 5 files allowed",
        variant: "destructive"
      });
      return;
    }

    const newFiles = [...files, ...selectedFiles];
    setFiles(newFiles);

    // Create previews
    const newPreviews = [...previews];
    selectedFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push(reader.result as string);
        setPreviews([...newPreviews]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    setFiles(newFiles);
    setPreviews(newPreviews);
  };

  const handleSubmit = async () => {
    if (!title || files.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please provide a title and upload at least one file",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    const report: EmergencyReport = {
      type: reportType as any,
      title,
      description: description || 'Media attached',
      location: {
        address: 'Location auto-detected'
      },
      media: {
        photos: files.filter(f => f.type.startsWith('image/')),
        videos: files.filter(f => f.type.startsWith('video/'))
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
        description: `Report ID: ${result.reportId}. Media uploaded successfully.`,
        variant: "default"
      });
      setTitle('');
      setDescription('');
      setFiles([]);
      setPreviews([]);
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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Camera className="w-5 h-5" />
            Photo/Video Report
          </DialogTitle>
          <DialogDescription>
            Upload photos or videos of the emergency
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="media-title">Title *</Label>
            <Input
              id="media-title"
              placeholder="Brief title of emergency"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="media-description">Description</Label>
            <Textarea
              id="media-description"
              placeholder="Additional details (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          {/* File Upload Area */}
          <div>
            <Label>Media Files (Max 5)</Label>
            <div 
              className="mt-2 border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground mb-2">
                Click to upload photos or videos
              </p>
              <p className="text-xs text-muted-foreground">
                Supports: JPG, PNG, MP4, MOV (Max 50MB per file)
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                multiple
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          </div>

          {/* File Previews */}
          {previews.length > 0 && (
            <div className="grid grid-cols-3 gap-4">
              {previews.map((preview, index) => (
                <div key={index} className="relative group">
                  <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                    {files[index].type.startsWith('image/') ? (
                      <img 
                        src={preview} 
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Video className="w-8 h-8 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(index);
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                  <div className="absolute bottom-2 left-2">
                    {files[index].type.startsWith('image/') ? (
                      <Image className="w-4 h-4 text-white drop-shadow-lg" />
                    ) : (
                      <Video className="w-4 h-4 text-white drop-shadow-lg" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="emergency"
              onClick={handleSubmit}
              disabled={loading || files.length === 0}
              className="flex-1"
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
