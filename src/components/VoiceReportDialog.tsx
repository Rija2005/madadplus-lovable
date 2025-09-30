import { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { submitEmergencyReport, EmergencyReport, transcribeVoice } from '@/services/backendHooks';
import { Mic, Square, Play, Pause, Loader2, Trash2, Send } from 'lucide-react';

interface VoiceReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reportType: string;
}

export const VoiceReportDialog = ({ open, onOpenChange, reportType }: VoiceReportDialogProps) => {
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [playing, setPlaying] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  
  const { toast } = useToast();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setRecording(true);
      
      toast({
        title: "Recording Started",
        description: "Speak clearly about the emergency"
      });
    } catch (error) {
      toast({
        title: "Microphone Access Denied",
        description: "Please allow microphone access to record",
        variant: "destructive"
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      setRecording(false);
      toast({
        title: "Recording Stopped",
        description: "You can now play or transcribe your message"
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
    setAudioUrl('');
    setTranscription('');
    setPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  const handleTranscribe = async () => {
    if (!audioBlob) return;

    setTranscribing(true);
    const file = new File([audioBlob], 'voice-report.webm', { type: 'audio/webm' });
    const result = await transcribeVoice(file);
    setTranscribing(false);

    if (result.success && result.transcription) {
      setTranscription(result.transcription);
      toast({
        title: "Transcription Complete",
        description: "Voice converted to text successfully"
      });
    } else {
      toast({
        title: "Transcription Failed",
        description: result.error || "Please try again",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = async () => {
    if (!audioBlob && !transcription) {
      toast({
        title: "No Recording",
        description: "Please record a voice message first",
        variant: "destructive"
      });
      return;
    }

    setSubmitting(true);

    const report: EmergencyReport = {
      type: reportType as any,
      title: 'Voice Report',
      description: transcription || 'Voice message attached',
      voiceTranscription: transcription,
      location: {
        address: 'Location auto-detected'
      },
      timestamp: new Date(),
      status: 'submitted',
      priority: 'high',
      isAnonymous: false
    };

    const result = await submitEmergencyReport(report);
    setSubmitting(false);

    if (result.success) {
      toast({
        title: "Report Submitted!",
        description: `Report ID: ${result.reportId}. Emergency services notified.`,
        variant: "default"
      });
      deleteRecording();
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
            <Mic className="w-5 h-5" />
            Voice Report
          </DialogTitle>
          <DialogDescription>
            Record your emergency message
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Recording Controls */}
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
              {recording ? "Recording... Tap to stop" : 
               audioBlob ? "Recording saved. Play or transcribe" :
               "Tap to start recording"}
            </p>
          </div>

          {/* Transcribe Button */}
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
                'Convert to Text'
              )}
            </Button>
          )}

          {/* Transcription Display */}
          {transcription && (
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm font-medium mb-2">Transcription:</p>
              <p className="text-sm">{transcription}</p>
            </div>
          )}

          {/* Submit Button */}
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
                    Submit
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
