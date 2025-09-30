// Text-to-Speech utility using Web Speech API
// Works offline and supports multiple languages

class TextToSpeechManager {
  private synth: SpeechSynthesis;
  private utterance: SpeechSynthesisUtterance | null = null;

  constructor() {
    this.synth = window.speechSynthesis;
  }

  speak(text: string, language: 'en' | 'ur' = 'en', onEnd?: () => void) {
    // Cancel any ongoing speech
    this.cancel();

    this.utterance = new SpeechSynthesisUtterance(text);
    
    // Set language
    this.utterance.lang = language === 'en' ? 'en-US' : 'ur-PK';
    
    // Set voice properties
    this.utterance.rate = 0.9; // Slightly slower for clarity
    this.utterance.pitch = 1;
    this.utterance.volume = 1;

    // Try to find the best voice
    const voices = this.synth.getVoices();
    const preferredVoice = voices.find(voice => 
      voice.lang.startsWith(language === 'en' ? 'en' : 'ur')
    );
    
    if (preferredVoice) {
      this.utterance.voice = preferredVoice;
    }

    if (onEnd) {
      this.utterance.onend = onEnd;
    }

    this.synth.speak(this.utterance);
  }

  pause() {
    if (this.synth.speaking && !this.synth.paused) {
      this.synth.pause();
    }
  }

  resume() {
    if (this.synth.paused) {
      this.synth.resume();
    }
  }

  cancel() {
    if (this.synth.speaking) {
      this.synth.cancel();
    }
  }

  isSpeaking(): boolean {
    return this.synth.speaking;
  }

  isPaused(): boolean {
    return this.synth.paused;
  }
}

// Export singleton instance
export const ttsManager = new TextToSpeechManager();

// Initialize voices (some browsers need this)
if (typeof window !== 'undefined' && window.speechSynthesis) {
  window.speechSynthesis.onvoiceschanged = () => {
    window.speechSynthesis.getVoices();
  };
}
