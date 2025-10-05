import React, { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  submitEmergencyReport,
  EmergencyReport,
  transcribeVoice,
  callAmbulance,
} from "@/services/backendHooks";
import {
  Mic,
  Square,
  Play,
  Pause,
  Loader2,
  Trash2,
  Send,
  Ambulance,
} from "lucide-react";

export interface VoiceReportDialogProps {
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
  reportType: string;
}

export const VoiceReportDialog: React.FC<VoiceReportDialogProps> = ({
  open,
  onOpenChange,
  reportType,
}) => {
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState("");
  const [playing, setPlaying] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [location, setLocation] = useState("");
  const [coordinates, setCoordinates] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const { toast } = useToast();

  // 📍 Fetch location on open
  useEffect(() => {
    if (open && !coordinates) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const { latitude, longitude } = pos.coords;
            setCoordinates({ latitude, longitude });
            setLocation(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
          },
          () => setLocation("Location unavailable")
        );
      }
    }
  }, [open]);

  // 🎙 Start recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach((t) => t.stop());
      };

      mediaRecorder.start();
      setRecording(true);
      toast({
        title: "Recording Started",
        description: "Speak clearly about the emergency",
      });
    } catch {
      toast({
        title: "Microphone Access Denied",
        description: "Please allow microphone access to record",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      setRecording(false);
      toast({
        title: "Recording Stopped",
        description: "You can now play or transcribe your message",
      });
    }
  };

  const playAudio = () => {
    if (audioUrl && !playing) {
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      audio.play();
      setPlaying(true);
      audio.onended = () => setPlaying(false);
    } else if (audioRef.current && playing) {
      audioRef.current.pause();
      setPlaying(false);
    }
  };

  const deleteRecording = () => {
    setAudioBlob(null);
    setAudioUrl("");
    setTranscription("");
    setPlaying(false);
    audioRef.current?.pause();
  };

  const handleTranscribe = async () => {
    if (!audioBlob) return;
    setTranscribing(true);
    const result = await transcribeVoice(audioBlob);
    setTranscribing(false);
    setTranscription(result);
    toast({
      title: "Transcription Complete",
      description: "Voice converted to text successfully",
    });
  };

  const handleSubmit = async () => {
    if (!audioBlob && !transcription) {
      toast({
        title: "No Recording",
        description: "Please record a voice message first",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);

    const report: Omit<EmergencyReport, "id" | "timestamp" | "status" | "userId"> = {
      type: reportType,
      title: "Voice Report",
      description: transcription || "Voice message attached",
      priority: "high",
      isAnonymous: false,
      location: {
        latitude: coordinates?.latitude,
        longitude: coordinates?.longitude,
        address: location || "Auto-detected location",
      },
    };

    const result = await submitEmergencyReport(report);
    setSubmitting(false);

    if (result.success && result.reportId) {
      toast({
        title: "Report Submitted",
        description: `Report ID: ${result.reportId}. Emergency services notified.`,
      });

      const ambResult = await callAmbulance(result.reportId);
      if (ambResult.success) {
        toast({
          title: "Ambulance Dispatched 🚑",
          description: `Ambulance ID: ${ambResult.ambulanceId}`,
        });
      }

      deleteRecording();
      onOpenChange(false);
    } else {
      toast({
        title: "Submission Failed",
        description: result.error || "Please try again",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mic className="w-5 h-5" />
            Voice Report
          </DialogTitle>
          <DialogDescription>
            Record your emergency message
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* 🎤 Record Controls */}
          <div className="flex flex-col items-center gap-4 py-6">
            {!audioBlob ? (
              <Button
                size="lg"
                variant={recording ? "destructive" : "default"}
                onClick={recording ? stopRecording : startRecording}
                className="w-32 h-32 rounded-full"
              >
                {recording ? (
                  <Square className="w-12 h-12" />
                ) : (
                  <Mic className="w-12 h-12" />
                )}
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  size="lg"
                  variant="outline"
                  onClick={playAudio}
                  className="w-20 h-20 rounded-full"
                >
                  {playing ? (
                    <Pause className="w-8 h-8" />
                  ) : (
                    <Play className="w-8 h-8" />
                  )}
                </Button>
                <Button
                  size="lg"
                  variant="destructive"
                  onClick={deleteRecording}
                  className="w-20 h-20 rounded-full"
                >
                  <Trash2 className="w-8 h-8" />
                </Button>
              </div>
            )}
            <p className="text-sm text-muted-foreground text-center">
              {recording
                ? "Recording... Tap to stop"
                : audioBlob
                ? "Recording saved. Play or transcribe"
                : "Tap to start recording"}
            </p>
          </div>

          {/* 🔤 Transcription */}
          {audioBlob && !transcription && (
            <Button
              variant="outline"
              onClick={handleTranscribe}
              disabled={transcribing}
              className="w-full"
            >
              {transcribing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Transcribing...
                </>
              ) : (
                "Convert to Text"
              )}
            </Button>
          )}

          {transcription && (
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm font-medium mb-2">Transcription:</p>
              <p className="text-sm">{transcription}</p>
            </div>
          )}

          {/* 📨 Submit */}
          {audioBlob && (
            <div className="flex gap-2">
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
                disabled={submitting}
                className="flex-1"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Submit & Dispatch
                    <Ambulance className="w-4 h-4 ml-1" />
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
