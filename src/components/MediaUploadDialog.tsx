import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  submitEmergencyReport,
  callAmbulance,
  ReportForSubmission,
} from "@/services/backendHooks";
import { Upload, X, Loader2, Video, Camera, Ambulance } from "lucide-react";

interface MediaUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reportType: string;
}

export const MediaUploadDialog = ({
  open,
  onOpenChange,
  reportType,
}: MediaUploadDialogProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [coordinates, setCoordinates] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // 🧭 Auto-fetch current location when opened
  useEffect(() => {
    if (open) {
      setTitle("");
      setDescription("");
      setFiles([]);
      setPreviews([]);
      setCoordinates(null);

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const { latitude, longitude } = pos.coords;
            setCoordinates({ latitude, longitude });
          },
          () => {
            toast({
              title: "Location Error",
              description: "Unable to fetch location. Please enable location access.",
              variant: "destructive",
            });
          }
        );
      }
    }
  }, [open]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...selectedFiles]);

      selectedFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviews((prev) => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
    setPreviews(previews.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!title || !coordinates) {
      toast({
        title: "Missing Information",
        description: "Please add a title and allow location access.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    const reportData: ReportForSubmission = {
      title,
      description,
      location: {
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
      },
      type: reportType,
      priority: "high",
      isAnonymous: false,
    };

    try {
      const result = await submitEmergencyReport(reportData);
      if (result.success && result.reportId) {
        toast({
          title: "Report Submitted",
          description: `Report ID: ${result.reportId}. Dispatching ambulance...`,
        });

        const ambResult = await callAmbulance(result.reportId);
        if (ambResult.success) {
          toast({
            title: "Ambulance Dispatched",
            description: `Ambulance ID: ${ambResult.ambulanceId}`,
          });
        } else {
          toast({
            title: "Dispatch Failed",
            description: ambResult.error || "Unable to dispatch ambulance.",
            variant: "destructive",
          });
        }

        setFiles([]);
        setPreviews([]);
        setTitle("");
        setDescription("");
        onOpenChange(false);
      } else {
        toast({
          title: "Submission Failed",
          description: result.error || "Unknown error. Try again later.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to submit media report.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Submit Media Report
          </DialogTitle>
          <DialogDescription>
            Attach photos or videos — your location will be sent automatically.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            placeholder="Report Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Textarea
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          {/* File Upload */}
          <div
            className="border-2 border-dashed rounded-md p-6 text-center cursor-pointer hover:bg-muted"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-muted-foreground">
              Click to upload photos or videos
            </p>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              multiple
              accept="image/*,video/*"
              className="hidden"
            />
          </div>

          {/* Preview Section */}
          <div className="grid grid-cols-3 gap-2">
            {previews.map((src, i) => (
              <div key={i} className="relative">
                {files[i].type.startsWith("video") ? (
                  <video
                    src={src}
                    controls
                    className="w-full h-24 rounded-md object-cover"
                  />
                ) : (
                  <img
                    src={src}
                    alt={`Preview ${i}`}
                    className="w-full h-24 rounded-md object-cover"
                  />
                )}
                <Button
                  size="icon"
                  variant="destructive"
                  className="absolute top-1 right-1 h-6 w-6"
                  onClick={() => removeFile(i)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading || files.length === 0}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Ambulance className="mr-2 h-4 w-4" />
                Submit & Call Ambulance
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
