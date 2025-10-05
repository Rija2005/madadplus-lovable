import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, AlertTriangle, Ambulance, MapPin } from "lucide-react";
import { submitEmergencyReport, callAmbulance } from "@/services/backendHooks";

interface ReportDialogProps {
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

// ✅ Dropdown options for emergency types
const emergencyTypes = [
  'Medical Emergency',
  'Accident',
  'Heart Attack',
  'Stroke',
  'Pregnancy/Birth',
  'Breathing Problem',
  'Other'
];

const ReportDialog: React.FC<ReportDialogProps> = ({ open, onOpenChange }) => {
  const [loading, setLoading] = useState(false);
  const [reportType, setReportType] = useState("");
  const [report, setReport] = useState("");
  const [location, setLocation] = useState("");
  const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const { toast } = useToast();

  // ✅ Auto-fetch current location when dialog opens
  useEffect(() => {
    if (open) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const { latitude, longitude } = pos.coords;
            setCoords({ latitude, longitude });
            setLocation(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
          },
          () => {
            setLocation("Location unavailable");
            toast({ title: "Location Access Denied", description: "Please allow location access.", variant: "destructive" });
          }
        );
      }
    }
  }, [open, toast]);

  const handleSubmit = async () => {
    if (!reportType || !report || !location) {
      toast({
        title: "Missing Fields",
        description: "Please select an emergency type, describe the situation, and provide your location.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const reportData = {
        type: reportType,
        title: `Emergency - ${reportType}`,
        description: report,
        priority: "high",
        isAnonymous: false,
        location: {
          address: location,
          latitude: coords?.latitude,
          longitude: coords?.longitude,
        },
      };

      const result = await submitEmergencyReport(reportData);

      if (result.success && result.reportId) {
        toast({ title: "Report Submitted", description: "Your emergency report has been received." });

        const ambResult = await callAmbulance(result.reportId);
        if (ambResult.success) {
          toast({ title: "Ambulance Dispatched", description: `Ambulance ID: ${ambResult.ambulanceId}` });
        } else {
          toast({ title: "Dispatch Failed", description: ambResult.error || "Unable to dispatch ambulance.", variant: "destructive" });
        }

        setReportType("");
        setReport("");
        setLocation("");
        onOpenChange(false);
      } else {
        toast({ title: "Submission Failed", description: result.error || "Try again later.", variant: "destructive" });
      }
    } catch (error) {
      console.error("Error submitting report:", error);
      toast({ title: "Error", description: "Something went wrong. Please try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            Report an Emergency
          </DialogTitle>
          <DialogDescription>
            Provide details about the emergency. Your location is auto-detected.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="emergencyType">Emergency Type</Label>
            <Select onValueChange={setReportType} value={reportType}>
              <SelectTrigger id="emergencyType">
                <SelectValue placeholder="Select emergency type" />
              </SelectTrigger>
              <SelectContent>
                {emergencyTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="report">Report Details</Label>
            <Textarea
              id="report"
              placeholder="Describe the situation..."
              value={report}
              onChange={(e) => setReport(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="location">Location (Auto-Detected)</Label>
            <div className="flex gap-2">
              <Input
                id="location"
                placeholder="Detecting location..."
                value={location}
                readOnly
              />
              <MapPin className="h-5 w-5 mt-2 text-muted-foreground" />
            </div>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 text-white"
          >
            {loading ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...</>
            ) : (
              <><Ambulance className="mr-2 h-4 w-4" /> Submit & Call Ambulance</>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReportDialog;
