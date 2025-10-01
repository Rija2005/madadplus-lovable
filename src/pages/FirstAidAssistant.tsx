import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { ttsManager } from '@/utils/textToSpeech';
import { 
  Heart, 
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Phone,
  Clock,
  CheckCircle,
  AlertTriangle,
  Mic,
  Users,
  Activity,
  Flame
} from 'lucide-react';

interface FirstAidGuide {
  id: string;
  title: string;
  titleUrdu: string;
  category: 'basic' | 'advanced' | 'emergency';
  duration: string;
  difficulty: 'Easy' | 'Medium' | 'Advanced';
  description: string;
  icon: any;
  steps: FirstAidStep[];
}

interface FirstAidStep {
  id: number;
  title: string;
  titleUrdu: string;
  instruction: string;
  instructionUrdu: string;
  duration: number; // in seconds
  audioInstruction?: string;
  warnings?: string[];
  tips?: string[];
}

const FirstAidAssistant = () => {
  const [selectedGuide, setSelectedGuide] = useState<FirstAidGuide | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [language, setLanguage] = useState<'en' | 'ur'>('en');
  const [stepProgress, setStepProgress] = useState(0);
  const { toast } = useToast();

  // Auto-play audio when step changes and voice is enabled
  useEffect(() => {
    if (selectedGuide && isVoiceEnabled) {
      const currentStepData = selectedGuide.steps[currentStep];
      const text = language === 'en' ? currentStepData.instruction : currentStepData.instructionUrdu;
      
      // Small delay to allow UI to update
      setTimeout(() => {
        ttsManager.speak(text, language, () => setIsPlaying(false));
        setIsPlaying(true);
      }, 500);
    }

    return () => {
      ttsManager.cancel();
      setIsPlaying(false);
    };
  }, [currentStep, selectedGuide, language, isVoiceEnabled]);

  const firstAidGuides: FirstAidGuide[] = [
    {
      id: 'cpr',
      title: 'CPR (Cardiopulmonary Resuscitation)',
      titleUrdu: 'سی پی آر (دل اور پھیپھڑوں کی بحالی)',
      category: 'emergency',
      duration: '8-10 mins',
      difficulty: 'Advanced',
      description: 'Life-saving technique for cardiac arrest',
      icon: Heart,
      steps: [
        {
          id: 1,
          title: 'Check Responsiveness',
          titleUrdu: 'ردعمل چیک کریں',
          instruction: 'Tap shoulders and shout "Are you okay?" Check for normal breathing.',
          instructionUrdu: 'کندھوں کو تھپتھپائیں اور پوچھیں "کیا آپ ٹھیک ہیں؟" عام سانس کی جانچ کریں۔',
          duration: 10,
          warnings: ['Do not move if spinal injury is suspected'],
          tips: ['Look for chest movement for 10 seconds']
        },
        {
          id: 2,
          title: 'Call for Help',
          titleUrdu: 'مدد کے لیے کال کریں',
          instruction: 'Call 1122 immediately. Ask someone to find an AED if available.',
          instructionUrdu: 'فوری طور پر ۱۱۲۲ کو کال کریں۔ کسی سے AED تلاش کرنے کو کہیں اگر دستیاب ہو۔',
          duration: 15,
          tips: ['Put phone on speaker while performing CPR']
        },
        {
          id: 3,
          title: 'Position Hands',
          titleUrdu: 'ہاتھوں کی پوزیشن',
          instruction: 'Place heel of one hand on center of chest, between nipples. Place other hand on top.',
          instructionUrdu: 'ایک ہاتھ کی ہتھیلی سینے کے وسط میں، نپلز کے بیچ رکھیں۔ دوسرا ہاتھ اوپر رکھیں۔',
          duration: 10,
          warnings: ['Do not press on ribs or stomach'],
          tips: ['Keep arms straight and shoulders over hands']
        },
        {
          id: 4,
          title: 'Start Compressions',
          titleUrdu: 'دبانا شروع کریں',
          instruction: 'Push hard and fast at least 2 inches deep. Let chest rise completely between compressions.',
          instructionUrdu: 'کم از کم ۲ انچ گہرائی تک زور سے اور تیزی سے دبائیں۔ ہر دبانے کے بیچ سینے کو مکمل اٹھنے دیں۔',
          duration: 18,
          tips: ['Count aloud: 1, 2, 3...', 'Rate: 100-120 compressions per minute']
        },
        {
          id: 5,
          title: 'Give Rescue Breaths',
          titleUrdu: 'ریسکیو سانس دیں',
          instruction: 'Tilt head back, lift chin. Pinch nose, make seal over mouth. Give 2 breaths.',
          instructionUrdu: 'سر پیچھے کریں، ٹھوڑی اٹھائیں۔ناک دبائیں، منہ پر مہر بنائیں۔ ۲ سانس دیں۔',
          duration: 10,
          warnings: ['Each breath should last 1 second'],
          tips: ['Watch for chest rise with each breath']
        },
        {
          id: 6,
          title: 'Continue Cycles',
          titleUrdu: 'چکر جاری رکھیں',
          instruction: 'Continue 30 compressions and 2 breaths until help arrives or person responds.',
          instructionUrdu: '۳۰ دبانے اور ۲ سانس کا سلسلہ جاری رکھیں جب تک مدد نہ آئے یا شخص جواب نہ دے۔',
          duration: 120,
          tips: ['Switch with someone every 2 minutes if possible']
        }
      ]
    },
    {
      id: 'choking',
      title: 'Choking (Heimlich Maneuver)',
      titleUrdu: 'گلا دبنا (ہیملک طریقہ)',
      category: 'emergency',
      duration: '2-3 mins',
      difficulty: 'Medium',
      description: 'Help someone who is choking',
      icon: AlertTriangle,
      steps: [
        {
          id: 1,
          title: 'Identify Choking',
          titleUrdu: 'گلا دبنے کی شناخت',
          instruction: 'Person cannot speak, cough, or breathe. May clutch throat.',
          instructionUrdu: 'شخص بول، کھانس یا سانس نہیں لے سکتا۔ گلا پکڑ سکتا ہے۔',
          duration: 5,
          warnings: ['Do not hit back if person can cough or speak']
        },
        {
          id: 2,
          title: '5 Back Blows',
          titleUrdu: '۵ پیٹ کی ضربیں',
          instruction: 'Stand behind person, lean them forward. Hit between shoulder blades with heel of hand.',
          instructionUrdu: 'شخص کے پیچھے کھڑے ہوں، انہیں آگے جھکائیں۔ کندھے کی ہڈیوں کے بیچ ہتھیلی سے ماریں۔',
          duration: 15,
          tips: ['Use firm, sharp blows']
        },
        {
          id: 3,
          title: '5 Abdominal Thrusts',
          titleUrdu: '۵ پیٹ کے دھکے',
          instruction: 'Stand behind, place hands below ribcage. Push inward and upward quickly.',
          instructionUrdu: 'پیچھے کھڑے ہوں، پسلیوں کے نیچے ہاتھ رکھیں۔ اندر اور اوپر کی طرف تیزی سے دھکا دیں۔',
          duration: 15,
          warnings: ['Do not use on pregnant women or infants']
        },
        {
          id: 4,
          title: 'Repeat Until Clear',
          titleUrdu: 'صاف ہونے تک دہرائیں',
          instruction: 'Alternate between back blows and abdominal thrusts until object comes out.',
          instructionUrdu: 'پیٹ کی ضربیں اور پیٹ کے دھکے باری باری کریں جب تک چیز نہ نکلے۔',
          duration: 30,
          tips: ['Call 1122 if unsuccessful after several attempts']
        }
      ]
    },
    {
      id: 'bleeding',
      title: 'Severe Bleeding Control',
      titleUrdu: 'شدید خون بہنے کا کنٹرول',
      category: 'basic',
      duration: '3-5 mins',
      difficulty: 'Easy',
      description: 'Stop severe bleeding from wounds',
      icon: Activity,
      steps: [
        {
          id: 1,
          title: 'Ensure Safety',
          titleUrdu: 'حفاظت کو یقینی بنائیں',
          instruction: 'Wear gloves if available. Make sure area is safe.',
          instructionUrdu: 'اگر دستیاب ہوں تو دستانے پہنیں۔ اس بات کو یقینی بنائیں کہ علاقہ محفوظ ہے۔',
          duration: 5,
          warnings: ['Avoid direct contact with blood']
        },
        {
          id: 2,
          title: 'Apply Direct Pressure',
          titleUrdu: 'براہ راست دباؤ ڈالیں',
          instruction: 'Place clean cloth on wound. Press firmly with both hands.',
          instructionUrdu: 'زخم پر صاف کپڑا رکھیں۔ دونوں ہاتھوں سے مضبوطی سے دبائیں۔',
          duration: 60,
          tips: ['Do not remove cloth if it becomes blood-soaked, add more on top']
        },
        {
          id: 3,
          title: 'Elevate if Possible',
          titleUrdu: 'اگر ممکن ہو تو اٹھائیں',
          instruction: 'Raise injured area above heart level if no fracture suspected.',
          instructionUrdu: 'اگر فریکچر کا شک نہ ہو تو زخمی حصے کو دل کی سطح سے اوپر اٹھائیں۔',
          duration: 5,
          warnings: ['Do not elevate if bone fracture is suspected']
        },
        {
          id: 4,
          title: 'Apply Bandage',
          titleUrdu: 'پٹی لگائیں',
          instruction: 'Wrap bandage firmly but not too tight. Check circulation.',
          instructionUrdu: 'پٹی کو مضبوطی سے لیکن زیادہ کسی نہیں بانھیں۔ خون کی گردش چیک کریں۔',
          duration: 30,
          tips: ['Bandage should be snug but fingers/toes should remain pink']
        }
      ]
    },
    {
      id: 'burns',
      title: 'Burn Treatment',
      titleUrdu: 'جلنے کا علاج',
      category: 'basic',
      duration: '5-7 mins',
      difficulty: 'Easy',
      description: 'Treat minor and major burns',
      icon: Flame,
      steps: [
        {
          id: 1,
          title: 'Stop the Burning',
          titleUrdu: 'جلنا بند کریں',
          instruction: 'Remove person from heat source. Remove hot clothing unless stuck to skin.',
          instructionUrdu: 'شخص کو گرمی کے ذریعے سے ہٹائیں۔ گرم کپڑے ہٹائیں جب تک کہ جلد سے چپکے نہ ہوں۔',
          duration: 10,
          warnings: ['Do not apply ice directly', 'Do not break blisters']
        },
        {
          id: 2,
          title: 'Cool the Burn',
          titleUrdu: 'جلن کو ٹھنڈا کریں',
          instruction: 'Hold burn under cool (not cold) running water for 10-20 minutes.',
          instructionUrdu: 'جلے ہوئے حصے کو ٹھنڈے (بہت ٹھنڈے نہیں) بہتے پانی کے نیچے ۱۰-۲۰ منٹ تک رکھیں۔',
          duration: 120,
          tips: ['Use cool water, never ice']
        },
        {
          id: 3,
          title: 'Cover the Burn',
          titleUrdu: 'جلن کو ڈھانپیں',
          instruction: 'Cover with sterile, non-stick bandage or clean cloth. Seek medical help for severe burns.',
          instructionUrdu: 'جراثیم سے پاک، نہ چپکنے والی پٹی یا صاف کپڑے سے ڈھانپیں۔ شدید جلن کے لیے طبی مدد حاصل کریں۔',
          duration: 30,
          warnings: ['Do not apply butter or ointments']
        }
      ]
    },
    {
      id: 'fracture',
      title: 'Fracture Management',
      titleUrdu: 'ہڈی ٹوٹنے کا انتظام',
      category: 'advanced',
      duration: '5-8 mins',
      difficulty: 'Medium',
      description: 'Handle broken bones safely',
      icon: AlertTriangle,
      steps: [
        {
          id: 1,
          title: 'Do Not Move',
          titleUrdu: 'حرکت نہ کریں',
          instruction: 'Keep person still. Do not move injured area. Call emergency services.',
          instructionUrdu: 'شخص کو ساکن رکھیں۔ زخمی حصے کو نہ ہلائیں۔ ہنگامی خدمات کو کال کریں۔',
          duration: 15,
          warnings: ['Do not try to realign bone', 'Do not test if bone is broken']
        },
        {
          id: 2,
          title: 'Immobilize',
          titleUrdu: 'متحرک کریں',
          instruction: 'If help is delayed, splint the area. Use rigid support above and below injury.',
          instructionUrdu: 'اگر مدد میں تاخیر ہو تو علاقے کو پٹی سے باندھیں۔ زخم کے اوپر اور نیچے سخت سہارا استعمال کریں۔',
          duration: 60,
          tips: ['Use rolled newspapers, sticks, or boards as splints']
        },
        {
          id: 3,
          title: 'Control Swelling',
          titleUrdu: 'سوجن کو کنٹرول کریں',
          instruction: 'Apply ice pack wrapped in cloth. Elevate if possible without moving bone.',
          instructionUrdu: 'کپڑے میں لپٹی برف لگائیں۔ اگر ممکن ہو تو ہڈی کو حرکت دیے بغیر اٹھائیں۔',
          duration: 10,
          warnings: ['Never apply ice directly to skin']
        }
      ]
    },
    {
      id: 'heart-attack',
      title: 'Heart Attack Response',
      titleUrdu: 'دل کے دورے کا ردعمل',
      category: 'emergency',
      duration: '3-5 mins',
      difficulty: 'Advanced',
      description: 'Recognize and respond to heart attack',
      icon: Heart,
      steps: [
        {
          id: 1,
          title: 'Recognize Symptoms',
          titleUrdu: 'علامات کو پہچانیں',
          instruction: 'Chest pain/pressure, pain in arm/jaw/back, shortness of breath, nausea, cold sweat.',
          instructionUrdu: 'سینے میں درد/دباؤ، بازو/جبڑے/پیٹھ میں درد، سانس کی قلت، متلی، ٹھنڈا پسینہ۔',
          duration: 10,
          warnings: ['Symptoms can be different in women']
        },
        {
          id: 2,
          title: 'Call Emergency',
          titleUrdu: 'ایمرجنسی کال کریں',
          instruction: 'Call 1122 immediately. Do not wait. Time is critical.',
          instructionUrdu: 'فوری طور پر ۱۱۲۲ کو کال کریں۔ انتظار نہ کریں۔ وقت اہم ہے۔',
          duration: 10,
          tips: ['Have someone call while you help the person']
        },
        {
          id: 3,
          title: 'Help Person Rest',
          titleUrdu: 'شخص کو آرام کریں',
          instruction: 'Have person sit or lie down. Loosen tight clothing. Keep calm and reassuring.',
          instructionUrdu: 'شخص کو بیٹھائیں یا لٹائیں۔ تنگ کپڑے ڈھیلے کریں۔ پرسکون اور یقین دلانے والے رہیں۔',
          duration: 30,
          tips: ['Give aspirin if available and no allergies']
        },
        {
          id: 4,
          title: 'Monitor Until Help Arrives',
          titleUrdu: 'مدد آنے تک نگرانی کریں',
          instruction: 'Stay with person. Be ready to perform CPR if they lose consciousness.',
          instructionUrdu: 'شخص کے ساتھ رہیں۔ اگر بے ہوش ہوں تو سی پی آر کرنے کے لیے تیار رہیں۔',
          duration: 120,
          warnings: ['Do not give food or water']
        }
      ]
    },
    {
      id: 'drowning',
      title: 'Drowning Response',
      titleUrdu: 'ڈوبنے کا ردعمل',
      category: 'emergency',
      duration: '5-8 mins',
      difficulty: 'Advanced',
      description: 'Rescue and revive drowning victim',
      icon: Activity,
      steps: [
        {
          id: 1,
          title: 'Safe Rescue',
          titleUrdu: 'محفوظ بچاؤ',
          instruction: 'Only enter water if trained. Reach with object, throw rope, or use boat.',
          instructionUrdu: 'صرف تربیت یافتہ ہونے پر پانی میں داخل ہوں۔ کسی چیز سے پہنچیں، رسی پھینکیں، یا کشتی استعمال کریں۔',
          duration: 30,
          warnings: ['Your safety comes first - do not become victim']
        },
        {
          id: 2,
          title: 'Check Responsiveness',
          titleUrdu: 'ردعمل چیک کریں',
          instruction: 'Once safe, check if person is breathing and responsive.',
          instructionUrdu: 'محفوظ ہونے کے بعد، چیک کریں کہ آیا شخص سانس لے رہا ہے اور جواب دے رہا ہے۔',
          duration: 10,
          tips: ['Call 1122 immediately']
        },
        {
          id: 3,
          title: 'Begin CPR',
          titleUrdu: 'سی پی آر شروع کریں',
          instruction: 'If not breathing, start CPR immediately. 30 compressions, 2 breaths.',
          instructionUrdu: 'اگر سانس نہیں لے رہے تو فوری طور پر سی پی آر شروع کریں۔ ۳۰ دبانے، ۲ سانس۔',
          duration: 120,
          warnings: ['Continue until help arrives or person breathes']
        }
      ]
    },
    {
      id: 'electric-shock',
      title: 'Electric Shock Response',
      titleUrdu: 'بجلی کے جھٹکے کا ردعمل',
      category: 'emergency',
      duration: '3-5 mins',
      difficulty: 'Medium',
      description: 'Help electric shock victim safely',
      icon: AlertTriangle,
      steps: [
        {
          id: 1,
          title: 'Turn Off Power',
          titleUrdu: 'بجلی بند کریں',
          instruction: 'Do not touch person. Turn off power source first or use non-conducting object to separate.',
          instructionUrdu: 'شخص کو نہ چھوئیں۔ پہلے بجلی کا ذریعہ بند کریں یا نہ چلنے والی چیز استعمال کر کے الگ کریں۔',
          duration: 10,
          warnings: ['Never touch with bare hands while power is on']
        },
        {
          id: 2,
          title: 'Call Emergency',
          titleUrdu: 'ایمرجنسی کال کریں',
          instruction: 'Call 1122 immediately, even if person seems fine.',
          instructionUrdu: 'فوری طور پر ۱۱۲۲ کو کال کریں، چاہے شخص ٹھیک نظر آئے۔',
          duration: 10,
          tips: ['Electric shock can cause internal injuries']
        },
        {
          id: 3,
          title: 'Check and Care',
          titleUrdu: 'چیک اور دیکھ بھال کریں',
          instruction: 'Check breathing. If not breathing, begin CPR. Cover burns with sterile dressing.',
          instructionUrdu: 'سانس چیک کریں۔ اگر سانس نہیں لے رہے تو سی پی آر شروع کریں۔ جلنے کو جراثیم سے پاک ڈریسنگ سے ڈھانپیں۔',
          duration: 60,
          warnings: ['Do not move person unless necessary']
        }
      ]
    },
    {
      id: 'unconscious',
      title: 'Unconscious Person Care',
      titleUrdu: 'بے ہوش شخص کی دیکھ بھال',
      category: 'emergency',
      duration: '3-5 mins',
      difficulty: 'Medium',
      description: 'Handle unconscious person',
      icon: AlertTriangle,
      steps: [
        {
          id: 1,
          title: 'Check Response',
          titleUrdu: 'ردعمل چیک کریں',
          instruction: 'Tap shoulders, shout loudly. Check if person responds.',
          instructionUrdu: 'کندھوں کو تھپتھپائیں، زور سے پکاریں۔ چیک کریں کہ آیا شخص جواب دیتا ہے۔',
          duration: 10,
          warnings: ['Do not shake if spinal injury suspected']
        },
        {
          id: 2,
          title: 'Open Airway',
          titleUrdu: 'ہوا کا راستہ کھولیں',
          instruction: 'Tilt head back, lift chin. Check for normal breathing for 10 seconds.',
          instructionUrdu: 'سر پیچھے کریں، ٹھوڑی اٹھائیں۔ ۱۰ سیکنڈ تک عام سانس کی جانچ کریں۔',
          duration: 10,
          tips: ['Look for chest rise, listen for breathing']
        },
        {
          id: 3,
          title: 'Recovery Position',
          titleUrdu: 'بحالی کی پوزیشن',
          instruction: 'If breathing normally, place in recovery position. Call 1122.',
          instructionUrdu: 'اگر عام طور پر سانس لے رہے ہیں تو بحالی کی پوزیشن میں رکھیں۔ ۱۱۲۲ کو کال کریں۔',
          duration: 30,
          tips: ['This prevents choking on vomit']
        }
      ]
    },
    {
      id: 'snake-bite',
      title: 'Snake Bite Treatment',
      titleUrdu: 'سانپ کے کاٹنے کا علاج',
      category: 'advanced',
      duration: '5-7 mins',
      difficulty: 'Medium',
      description: 'Treat venomous snake bites',
      icon: AlertTriangle,
      steps: [
        {
          id: 1,
          title: 'Move to Safety',
          titleUrdu: 'حفاظت کی طرف منتقل ہوں',
          instruction: 'Move away from snake. Try to remember snake appearance for medical team.',
          instructionUrdu: 'سانپ سے دور ہوں۔ طبی ٹیم کے لیے سانپ کی شکل یاد رکھنے کی کوشش کریں۔',
          duration: 10,
          warnings: ['Do not try to catch or kill snake']
        },
        {
          id: 2,
          title: 'Keep Calm and Still',
          titleUrdu: 'پرسکون اور ساکن رہیں',
          instruction: 'Keep bitten area below heart level. Minimize movement to slow venom spread.',
          instructionUrdu: 'کاٹے گئے حصے کو دل کی سطح سے نیچے رکھیں۔ زہر کے پھیلاؤ کو سست کرنے کے لیے حرکت کم کریں۔',
          duration: 30,
          tips: ['Remove tight clothing and jewelry near bite']
        },
        {
          id: 3,
          title: 'Call Emergency',
          titleUrdu: 'ایمرجنسی کال کریں',
          instruction: 'Call 1122 immediately. Get to hospital as fast as possible for anti-venom.',
          instructionUrdu: 'فوری طور پر ۱۱۲۲ کو کال کریں۔ اینٹی وینم کے لیے جتنی جلدی ممکن ہو ہسپتال پہنچیں۔',
          duration: 10,
          warnings: ['Do not apply tourniquet', 'Do not cut wound', 'Do not suck venom']
        }
      ]
    },
    {
      id: 'heat-stroke',
      title: 'Heat Stroke Treatment',
      titleUrdu: 'لو لگنے کا علاج',
      category: 'emergency',
      duration: '5-7 mins',
      difficulty: 'Medium',
      description: 'Treat severe heat exhaustion',
      icon: Flame,
      steps: [
        {
          id: 1,
          title: 'Move to Cool Area',
          titleUrdu: 'ٹھنڈے علاقے میں منتقل ہوں',
          instruction: 'Get person to shaded or air-conditioned area immediately.',
          instructionUrdu: 'فوری طور پر شخص کو سایہ دار یا ایئر کنڈیشنڈ علاقے میں لے جائیں۔',
          duration: 10,
          warnings: ['Heat stroke is life-threatening']
        },
        {
          id: 2,
          title: 'Cool the Body',
          titleUrdu: 'جسم کو ٹھنڈا کریں',
          instruction: 'Remove excess clothing. Apply cool wet cloths. Fan continuously.',
          instructionUrdu: 'اضافی کپڑے ہٹائیں۔ ٹھنڈے گیلے کپڑے لگائیں۔ مسلسل پنکھا کریں۔',
          duration: 60,
          tips: ['Apply ice packs to neck, armpits, groin']
        },
        {
          id: 3,
          title: 'Give Fluids',
          titleUrdu: 'سیال دیں',
          instruction: 'If conscious, give cool water to sip. Call 1122 immediately.',
          instructionUrdu: 'اگر ہوش میں ہوں تو ٹھنڈا پانی گھونٹ گھونٹ کر دیں۔ فوری طور پر ۱۱۲۲ کو کال کریں۔',
          duration: 30,
          warnings: ['Do not give fluids if unconscious']
        }
      ]
    }
  ];

  const handleStartGuide = (guide: FirstAidGuide) => {
    setSelectedGuide(guide);
    setCurrentStep(0);
    setStepProgress(0);
    setIsPlaying(false);
  };

  const handlePlayPause = () => {
    if (!selectedGuide) return;

    const currentStepData = selectedGuide.steps[currentStep];
    const text = language === 'en' ? currentStepData.instruction : currentStepData.instructionUrdu;

    if (isPlaying) {
      ttsManager.cancel();
      setIsPlaying(false);
    } else {
      ttsManager.speak(text, language, () => setIsPlaying(false));
      setIsPlaying(true);
    }
  };

  const handleNextStep = () => {
    if (selectedGuide && currentStep < selectedGuide.steps.length - 1) {
      ttsManager.cancel();
      setCurrentStep(currentStep + 1);
      setStepProgress(0);
      setIsPlaying(false);
    } else if (selectedGuide && currentStep === selectedGuide.steps.length - 1) {
      toast({
        title: "Guide Completed!",
        description: "You've finished all steps. Great job!",
        variant: "default"
      });
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      ttsManager.cancel();
      setCurrentStep(currentStep - 1);
      setStepProgress(0);
      setIsPlaying(false);
    }
  };

  const handleReset = () => {
    ttsManager.cancel();
    setSelectedGuide(null);
    setCurrentStep(0);
    setStepProgress(0);
    setIsPlaying(false);
  };

  const toggleVoice = () => {
    const newState = !isVoiceEnabled;
    setIsVoiceEnabled(newState);
    
    if (!newState) {
      ttsManager.cancel();
      setIsPlaying(false);
    }

    toast({
      title: newState ? "Voice Enabled" : "Voice Disabled",
      description: newState ? "Audio instructions will play automatically" : "Audio instructions turned off"
    });
  };

  const handleEmergencyCall = () => {
    window.location.href = 'tel:1122';
    toast({
      title: "Calling Emergency Services",
      description: "Connecting to 1122..."
    });
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'emergency': return 'emergency';
      case 'advanced': return 'warning';
      case 'basic': return 'success';
      default: return 'secondary';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'success';
      case 'Medium': return 'warning';
      case 'Advanced': return 'destructive';
      default: return 'secondary';
    }
  };

  if (selectedGuide) {
    const currentStepData = selectedGuide.steps[currentStep];
    const progressPercentage = ((currentStep + 1) / selectedGuide.steps.length) * 100;

    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">
              {language === 'en' ? selectedGuide.title : selectedGuide.titleUrdu}
            </h1>
            <p className="text-muted-foreground">
              Step {currentStep + 1} of {selectedGuide.steps.length}
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={toggleVoice}
              className={isVoiceEnabled ? 'bg-primary/10' : ''}
            >
              {isVoiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </Button>
            <Button variant="outline" size="sm" onClick={() => {
              ttsManager.cancel();
              setLanguage(language === 'en' ? 'ur' : 'en');
            }}>
              {language === 'en' ? 'اردو' : 'EN'}
            </Button>
            <Button variant="outline" size="sm" onClick={handleReset}>
              Back to Guides
            </Button>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Progress</span>
            <span>{Math.round(progressPercentage)}% Complete</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Current Step */}
          <div className="lg:col-span-2">
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">
                    {language === 'en' ? currentStepData.title : currentStepData.titleUrdu}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {currentStepData.duration}s
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-lg mb-6">
                  {language === 'en' ? currentStepData.instruction : currentStepData.instructionUrdu}
                </p>

                {/* Audio Controls */}
                <div className="flex items-center gap-4 mb-6 p-4 bg-muted/50 rounded-lg">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handlePlayPause}
                    disabled={!isVoiceEnabled}
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </Button>
                  <div className="flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">
                      {isPlaying ? 'Playing audio instructions...' : 'Click to hear instructions'}
                    </span>
                  </div>
                </div>

                {/* Warnings */}
                {currentStepData.warnings && currentStepData.warnings.length > 0 && (
                  <div className="mb-4 p-4 bg-warning/10 border border-warning/20 rounded-lg">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-warning mb-2">Important Warnings:</p>
                        <ul className="text-sm space-y-1">
                          {currentStepData.warnings.map((warning, index) => (
                            <li key={index}>• {warning}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tips */}
                {currentStepData.tips && currentStepData.tips.length > 0 && (
                  <div className="mb-6 p-4 bg-primary/10 border border-primary/20 rounded-lg">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-primary mb-2">Helpful Tips:</p>
                        <ul className="text-sm space-y-1">
                          {currentStepData.tips.map((tip, index) => (
                            <li key={index}>• {tip}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation */}
                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    onClick={handlePrevStep}
                    disabled={currentStep === 0}
                    className="flex-1"
                  >
                    Previous Step
                  </Button>
                  <Button
                    variant="default"
                    onClick={handleNextStep}
                    disabled={currentStep === selectedGuide.steps.length - 1}
                    className="flex-1"
                  >
                    {currentStep === selectedGuide.steps.length - 1 ? 'Complete' : 'Next Step'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Emergency Contact */}
            <Card className="bg-emergency/5 border-emergency/20">
              <CardContent className="pt-6">
                <div className="text-center">
                  <AlertTriangle className="w-8 h-8 text-emergency mx-auto mb-2" />
                  <h3 className="font-semibold text-emergency mb-2">Emergency?</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    If this is a life-threatening emergency, call immediately
                  </p>
                  <Button variant="emergency" className="w-full" onClick={handleEmergencyCall}>
                    <Phone className="w-4 h-4 mr-2" />
                    Call 1122
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Steps Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">All Steps</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {selectedGuide.steps.map((step, index) => (
                    <div
                      key={step.id}
                      className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                        index === currentStep ? 'bg-primary/10 border border-primary/20' :
                        index < currentStep ? 'bg-success/10' : 'bg-muted/30'
                      }`}
                      onClick={() => setCurrentStep(index)}
                    >
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                        index === currentStep ? 'bg-primary text-primary-foreground' :
                        index < currentStep ? 'bg-success text-success-foreground' :
                        'bg-muted text-muted-foreground'
                      }`}>
                        {index < currentStep ? <CheckCircle className="w-4 h-4" /> : index + 1}
                      </div>
                      <span className="text-sm font-medium">
                        {language === 'en' ? step.title : step.titleUrdu}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Guide Selection View
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">First Aid Assistant</h1>
        <p className="text-muted-foreground">
          طبی امداد اسسٹنٹ • Voice-guided emergency medical assistance
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <Card className="bg-emergency/5 border-emergency/20">
          <CardContent className="pt-6 text-center">
            <Phone className="w-8 h-8 text-emergency mx-auto mb-2" />
            <h3 className="font-semibold text-emergency mb-2">Emergency Call</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Life-threatening emergency
            </p>
            <Button 
              variant="emergency" 
              className="w-full"
              onClick={handleEmergencyCall}
            >
              Call 1122
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 text-center">
            <Mic className="w-8 h-8 text-primary mx-auto mb-2" />
            <h3 className="font-semibold mb-2">Voice Commands</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Say "Start CPR" to begin
            </p>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => {
                toast({
                  title: "Voice Commands Ready",
                  description: "Say 'Start' followed by guide name to begin",
                  variant: "default"
                });
              }}
            >
              Enable Voice
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 text-center">
            <Users className="w-8 h-8 text-primary mx-auto mb-2" />
            <h3 className="font-semibold mb-2">Group Training</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Practice with others
            </p>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => {
                toast({
                  title: "Group Training Mode",
                  description: "Connect multiple devices to practice together",
                  variant: "default"
                });
              }}
            >
              Start Session
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* First Aid Guides */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {firstAidGuides.map((guide) => (
          <Card key={guide.id} className="hover:shadow-primary transition-all duration-300">
            <CardHeader>
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg bg-${getCategoryColor(guide.category)}/10 flex items-center justify-center`}>
                  <guide.icon className={`w-6 h-6 text-${getCategoryColor(guide.category)}`} />
                </div>
                <div className="flex gap-2">
                  <Badge variant={getCategoryColor(guide.category)}>
                    {guide.category}
                  </Badge>
                  <Badge variant={getDifficultyColor(guide.difficulty)}>
                    {guide.difficulty}
                  </Badge>
                </div>
              </div>
              <CardTitle className="text-lg">{guide.title}</CardTitle>
              <CardDescription className="text-sm">{guide.titleUrdu}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">{guide.description}</p>
              <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{guide.duration}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Activity className="w-4 h-4" />
                  <span>{guide.steps.length} steps</span>
                </div>
              </div>
              <Button 
                onClick={() => handleStartGuide(guide)}
                className="w-full"
                variant="default"
              >
                <Play className="w-4 h-4 mr-2" />
                Start Guide
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Offline Notice */}
      <Card className="mt-12 bg-success/5 border-success/20">
        <CardContent className="pt-6">
          <div className="text-center">
            <CheckCircle className="w-8 h-8 text-success mx-auto mb-2" />
            <h3 className="font-semibold text-success mb-2">Works Offline</h3>
            <p className="text-sm text-muted-foreground">
              All first aid guides and voice instructions are available offline for emergencies
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FirstAidAssistant;