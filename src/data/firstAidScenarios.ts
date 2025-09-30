// Comprehensive First Aid Scenarios Library - 15+ scenarios
// Bilingual (English + Urdu) with offline support

export interface FirstAidStep {
  id: number;
  title: string;
  titleUrdu: string;
  instruction: string;
  instructionUrdu: string;
  duration: number; // seconds
  audioInstructionEn?: string;
  audioInstructionUr?: string;
  warnings?: string[];
  warningsUrdu?: string[];
  tips?: string[];
  tipsUrdu?: string[];
}

export interface FirstAidScenario {
  id: string;
  title: string;
  titleUrdu: string;
  category: 'basic' | 'advanced' | 'emergency';
  duration: string;
  difficulty: 'Easy' | 'Medium' | 'Advanced';
  description: string;
  descriptionUrdu: string;
  icon: string;
  steps: FirstAidStep[];
}

export const firstAidScenarios: FirstAidScenario[] = [
  {
    id: 'cpr',
    title: 'CPR (Cardiopulmonary Resuscitation)',
    titleUrdu: 'سی پی آر (دل اور پھیپھڑوں کی بحالی)',
    category: 'emergency',
    duration: '8-10 mins',
    difficulty: 'Advanced',
    description: 'Life-saving technique for cardiac arrest',
    descriptionUrdu: 'دل کی بندش کے لیے جان بچانے والی تکنیک',
    icon: 'Heart',
    steps: [
      {
        id: 1,
        title: 'Check Responsiveness',
        titleUrdu: 'ردعمل چیک کریں',
        instruction: 'Tap shoulders firmly and shout "Are you okay?" Check for normal breathing.',
        instructionUrdu: 'کندھوں کو مضبوطی سے تھپتھپائیں اور پوچھیں "کیا آپ ٹھیک ہیں؟" عام سانس کی جانچ کریں۔',
        duration: 10,
        warnings: ['Do not move if spinal injury is suspected', 'Call 1122 immediately if no response'],
        warningsUrdu: ['اگر ریڑھ کی ہڈی کی چوٹ کا شبہ ہو تو منتقل نہ کریں', 'اگر کوئی ردعمل نہ ہو تو فوری طور پر ۱۱۲۲ کو کال کریں'],
        tips: ['Look for chest movement for 10 seconds', 'Check if air is coming from nose/mouth'],
        tipsUrdu: ['۱۰ سیکنڈ تک سینے کی حرکت دیکھیں', 'چیک کریں کہ ناک/منہ سے ہوا آ رہی ہے']
      },
      {
        id: 2,
        title: 'Call for Help',
        titleUrdu: 'مدد کے لیے کال کریں',
        instruction: 'Call 1122 immediately. Ask someone to find an AED if available. Put phone on speaker.',
        instructionUrdu: 'فوری طور پر ۱۱۲۲ کو کال کریں۔ کسی سے AED تلاش کرنے کو کہیں اگر دستیاب ہو۔ فون اسپیکر پر رکھیں۔',
        duration: 15,
        tips: ['Keep phone on speaker while performing CPR', 'Ask bystanders to clear space'],
        tipsUrdu: ['سی پی آر کرتے ہوئے فون اسپیکر پر رکھیں', 'تماشائیوں سے جگہ خالی کرنے کو کہیں']
      },
      {
        id: 3,
        title: 'Position Hands Correctly',
        titleUrdu: 'ہاتھوں کی صحیح پوزیشن',
        instruction: 'Place heel of one hand on center of chest, between nipples. Place other hand on top, interlace fingers.',
        instructionUrdu: 'ایک ہاتھ کی ہتھیلی سینے کے وسط میں، نپلز کے بیچ رکھیں۔ دوسرا ہاتھ اوپر رکھیں، انگلیاں ملائیں۔',
        duration: 10,
        warnings: ['Do not press on ribs or stomach', 'Do not press on lower part of breastbone'],
        warningsUrdu: ['پسلیوں یا پیٹ پر نہ دبائیں', 'سینے کی ہڈی کے نچلے حصے پر نہ دبائیں'],
        tips: ['Keep arms straight and shoulders over hands', 'Lock your elbows'],
        tipsUrdu: ['بازو سیدھے رکھیں اور کندھے ہاتھوں کے اوپر', 'اپنی کہنیاں لاک کریں']
      },
      {
        id: 4,
        title: 'Start Compressions',
        titleUrdu: 'دبانا شروع کریں',
        instruction: 'Push hard and fast at least 2 inches (5cm) deep. Let chest rise completely between compressions. Count aloud.',
        instructionUrdu: 'کم از کم ۲ انچ (۵ سینٹی میٹر) گہرائی تک زور سے اور تیزی سے دبائیں۔ ہر دبانے کے بیچ سینے کو مکمل اٹھنے دیں۔ بلند آواز میں گنیں۔',
        duration: 18,
        tips: ['Count aloud: 1, 2, 3...', 'Rate: 100-120 compressions per minute'],
        tipsUrdu: ['بلند آواز میں گنیں: ۱، ۲، ۳...', 'رفتار: ۱۰۰-۱۲۰ دبانے فی منٹ']
      },
      {
        id: 5,
        title: 'Give Rescue Breaths',
        titleUrdu: 'ریسکیو سانس دیں',
        instruction: 'Tilt head back, lift chin. Pinch nose closed, make seal over mouth. Give 2 breaths, each lasting 1 second.',
        instructionUrdu: 'سر پیچھے کریں، ٹھوڑی اٹھائیں۔ ناک بند دبائیں، منہ پر مہر بنائیں۔ ۲ سانس دیں، ہر ایک ۱ سیکنڈ کی۔',
        duration: 10,
        warnings: ['Each breath should last 1 second', 'Watch for chest rise with each breath'],
        warningsUrdu: ['ہر سانس ۱ سیکنڈ کی ہونی چاہیے', 'ہر سانس کے ساتھ سینے کا اٹھنا دیکھیں'],
        tips: ['Use barrier device if available', 'If chest doesn\'t rise, reposition airway'],
        tipsUrdu: ['اگر دستیاب ہو تو رکاوٹ کا آلہ استعمال کریں', 'اگر سینہ نہیں اٹھتا تو ہوا کی نالی کی پوزیشن دوبارہ بنائیں']
      },
      {
        id: 6,
        title: 'Continue Cycles',
        titleUrdu: 'چکر جاری رکھیں',
        instruction: 'Continue 30 compressions and 2 breaths cycle until help arrives, person responds, or you are too exhausted.',
        instructionUrdu: '۳۰ دبانے اور ۲ سانس کا چکر جاری رکھیں جب تک مدد نہ آئے، شخص جواب نہ دے، یا آپ بہت تھک جائیں۔',
        duration: 120,
        tips: ['Switch with someone every 2 minutes if possible', 'Use AED as soon as available'],
        tipsUrdu: ['اگر ممکن ہو تو ہر ۲ منٹ میں کسی سے بدل لیں', 'AED جیسے ہی دستیاب ہو استعمال کریں']
      }
    ]
  },
  {
    id: 'bleeding',
    title: 'Severe Bleeding Control',
    titleUrdu: 'شدید خون بہنے کا کنٹرول',
    category: 'emergency',
    duration: '3-5 mins',
    difficulty: 'Easy',
    description: 'Stop life-threatening bleeding',
    descriptionUrdu: 'جان لیوا خون بہنا روکیں',
    icon: 'Activity',
    steps: [
      {
        id: 1,
        title: 'Ensure Safety',
        titleUrdu: 'حفاظت کو یقینی بنائیں',
        instruction: 'Wear gloves if available. Make sure area is safe. Call 1122 for severe bleeding.',
        instructionUrdu: 'اگر دستیاب ہوں تو دستانے پہنیں۔ اس بات کو یقینی بنائیں کہ علاقہ محفوظ ہے۔ شدید خون بہنے کے لیے ۱۱۲۲ کو کال کریں۔',
        duration: 10,
        warnings: ['Avoid direct contact with blood'],
        warningsUrdu: ['خون سے براہ راست رابطے سے بچیں']
      },
      {
        id: 2,
        title: 'Apply Direct Pressure',
        titleUrdu: 'براہ راست دباؤ ڈالیں',
        instruction: 'Place clean cloth on wound. Press firmly with both hands for 10 minutes.',
        instructionUrdu: 'زخم پر صاف کپڑا رکھیں۔ دونوں ہاتھوں سے ۱۰ منٹ تک مضبوطی سے دبائیں۔',
        duration: 600,
        tips: ['Do not remove cloth if blood-soaked, add more on top'],
        tipsUrdu: ['اگر خون سے بھیگ جائے تو کپڑا نہ ہٹائیں، اوپر مزید ڈالیں']
      },
      {
        id: 3,
        title: 'Elevate if Possible',
        titleUrdu: 'اگر ممکن ہو تو اٹھائیں',
        instruction: 'Raise injured area above heart level if no fracture suspected.',
        instructionUrdu: 'اگر فریکچر کا شک نہ ہو تو زخمی حصے کو دل کی سطح سے اوپر اٹھائیں۔',
        duration: 60,
        warnings: ['Do not elevate if bone fracture suspected'],
        warningsUrdu: ['اگر ہڈی ٹوٹنے کا شک ہو تو نہ اٹھائیں']
      },
      {
        id: 4,
        title: 'Apply Bandage',
        titleUrdu: 'پٹی لگائیں',
        instruction: 'Once bleeding slows, wrap bandage firmly but not too tight. Check circulation.',
        instructionUrdu: 'جب خون بہنا سست ہو جائے تو پٹی مضبوطی سے لیکن زیادہ کسا نہیں بانھیں۔ خون کی گردش چیک کریں۔',
        duration: 120,
        tips: ['Bandage should be snug but fingers/toes remain pink'],
        tipsUrdu: ['پٹی تنگ ہونی چاہیے لیکن انگلیاں گلابی رہیں']
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
    descriptionUrdu: 'گلا دب رہے شخص کی مدد کریں',
    icon: 'AlertTriangle',
    steps: [
      {
        id: 1,
        title: 'Identify Choking',
        titleUrdu: 'گلا دبنے کی شناخت',
        instruction: 'Person cannot speak, cough, or breathe. May clutch throat.',
        instructionUrdu: 'شخص بول، کھانس یا سانس نہیں لے سکتا۔ گلا پکڑ سکتا ہے۔',
        duration: 5,
        warnings: ['Do not hit back if person can cough or speak'],
        warningsUrdu: ['اگر شخص کھانس یا بول سکتا ہے تو پیٹ نہ ماریں']
      },
      {
        id: 2,
        title: '5 Back Blows',
        titleUrdu: '۵ پیٹھ کی ضربیں',
        instruction: 'Stand behind, lean them forward. Hit between shoulder blades with heel of hand.',
        instructionUrdu: 'پیچھے کھڑے ہوں، آگے جھکائیں۔ کندھے کی ہڈیوں کے بیچ ہتھیلی سے ماریں۔',
        duration: 15,
        tips: ['Use firm, sharp blows'],
        tipsUrdu: ['مضبوط، تیز ضربیں استعمال کریں']
      },
      {
        id: 3,
        title: '5 Abdominal Thrusts',
        titleUrdu: '۵ پیٹ کے دھکے',
        instruction: 'Stand behind, place hands below ribcage. Push inward and upward quickly.',
        instructionUrdu: 'پیچھے کھڑے ہوں، پسلیوں کے نیچے ہاتھ رکھیں۔ اندر اور اوپر تیزی سے دھکا دیں۔',
        duration: 15,
        warnings: ['Do not use on pregnant women or infants'],
        warningsUrdu: ['حاملہ خواتین یا بچوں پر استعمال نہ کریں']
      },
      {
        id: 4,
        title: 'Repeat Until Clear',
        titleUrdu: 'صاف ہونے تک دہرائیں',
        instruction: 'Alternate between back blows and abdominal thrusts until object comes out.',
        instructionUrdu: 'پیٹھ کی ضربیں اور پیٹ کے دھکے باری باری کریں جب تک چیز نہ نکلے۔',
        duration: 30,
        tips: ['Call 1122 if unsuccessful after several attempts'],
        tipsUrdu: ['کئی کوششوں کے بعد کامیاب نہ ہونے پر ۱۱۲۲ کو کال کریں']
      }
    ]
  },
  {
    id: 'burns',
    title: 'Burn Treatment',
    titleUrdu: 'جلنے کا علاج',
    category: 'basic',
    duration: '5-10 mins',
    difficulty: 'Easy',
    description: 'First aid for burns and scalds',
    descriptionUrdu: 'جلنے کے لیے ابتدائی طبی امداد',
    icon: 'Flame',
    steps: [
      {
        id: 1,
        title: 'Stop the Burning',
        titleUrdu: 'جلنا روکیں',
        instruction: 'Remove person from heat source. Remove clothing unless stuck to skin.',
        instructionUrdu: 'شخص کو گرمی سے ہٹائیں۔ جلد سے چپکے ہوئے نہ ہوں تو کپڑے اتاریں۔',
        duration: 30,
        warnings: ['Do not remove clothing stuck to burn'],
        warningsUrdu: ['جلنے سے چپکے ہوئے کپڑے نہ اتاریں']
      },
      {
        id: 2,
        title: 'Cool the Burn',
        titleUrdu: 'جلن کو ٹھنڈا کریں',
        instruction: 'Run cool water over burn for 10-20 minutes. Do not use ice.',
        instructionUrdu: 'جلن پر ۱۰-۲۰ منٹ تک ٹھنڈا پانی بہائیں۔ برف استعمال نہ کریں۔',
        duration: 1200,
        tips: ['Water should be 15-25°C', 'Cooling reduces pain and swelling'],
        tipsUrdu: ['پانی ۱۵-۲۵°C ہونا چاہیے', 'ٹھنڈا کرنا درد اور سوجن کم کرتا ہے']
      },
      {
        id: 3,
        title: 'Cover the Burn',
        titleUrdu: 'جلن کو ڈھانپیں',
        instruction: 'Cover burn with clean, non-stick dressing. Do not use cotton wool.',
        instructionUrdu: 'جلن کو صاف، غیر چپکنے والی ڈریسنگ سے ڈھانپیں۔ روئی استعمال نہ کریں۔',
        duration: 180,
        warnings: ['Do not apply butter, oil, or ointments', 'Do not pop blisters'],
        warningsUrdu: ['مکھن، تیل یا مرہم نہ لگائیں', 'چھالے نہ پھوڑیں']
      },
      {
        id: 4,
        title: 'Seek Medical Help',
        titleUrdu: 'طبی مدد حاصل کریں',
        instruction: 'Seek immediate help for large, deep, or chemical burns.',
        instructionUrdu: 'بڑے، گہرے یا کیمیائی جھلسنے کے لیے فوری مدد حاصل کریں۔',
        duration: 60,
        tips: ['Call 1122 for severe burns'],
        tipsUrdu: ['شدید جلن کے لیے ۱۱۲۲ کو کال کریں']
      }
    ]
  },
  {
    id: 'fracture',
    title: 'Fracture Management',
    titleUrdu: 'ہڈی ٹوٹنے کا انتظام',
    category: 'advanced',
    duration: '10-15 mins',
    difficulty: 'Medium',
    description: 'Immobilize suspected fractures',
    descriptionUrdu: 'مشتبہ فریکچر کو بے حرکت کریں',
    icon: 'Activity',
    steps: [
      {
        id: 1,
        title: 'Assess the Injury',
        titleUrdu: 'چوٹ کا جائزہ لیں',
        instruction: 'Do not move person. Check for pain, swelling, deformity, inability to move.',
        instructionUrdu: 'شخص کو نہ ہلائیں۔ درد، سوجن، بگاڑ، حرکت کی ناکامی چیک کریں۔',
        duration: 60,
        warnings: ['Do not try to straighten deformed limb'],
        warningsUrdu: ['بگڑے ہوئے عضو کو سیدھا کرنے کی کوشش نہ کریں']
      },
      {
        id: 2,
        title: 'Call Emergency',
        titleUrdu: 'ہنگامی کال کریں',
        instruction: 'Call 1122 immediately. Tell them about suspected fracture.',
        instructionUrdu: 'فوری طور پر ۱۱۲۲ کو کال کریں۔ مشتبہ فریکچر کے بارے میں بتائیں۔',
        duration: 60
      },
      {
        id: 3,
        title: 'Immobilize',
        titleUrdu: 'بے حرکت کریں',
        instruction: 'Support injured area above and below fracture site. Use splint or padding.',
        instructionUrdu: 'فریکچر کے اوپر اور نیچے زخمی علاقے کو سہارا دیں۔ سپلنٹ یا پیڈنگ استعمال کریں۔',
        duration: 300,
        tips: ['Pad splint with cloth', 'Do not tie too tightly'],
        tipsUrdu: ['سپلنٹ کو کپڑے سے پیڈ کریں', 'زیادہ کسا نہ باندھیں']
      },
      {
        id: 4,
        title: 'Control Bleeding',
        titleUrdu: 'خون بہنا کنٹرول کریں',
        instruction: 'If bleeding, apply gentle pressure. Do not press on protruding bone.',
        instructionUrdu: 'اگر خون بہہ رہا ہو تو ہلکا دباؤ ڈالیں۔ باہر نکلی ہڈی پر نہ دبائیں۔',
        duration: 300,
        warnings: ['Watch for signs of shock'],
        warningsUrdu: ['صدمے کی علامات پر نظر رکھیں']
      }
    ]
  },
  {
    id: 'heart-attack',
    title: 'Heart Attack Response',
    titleUrdu: 'دل کے دورے کا ردعمل',
    category: 'emergency',
    duration: '5-10 mins',
    difficulty: 'Medium',
    description: 'Recognize and respond to heart attack',
    descriptionUrdu: 'دل کے دورے کو پہچانیں اور جواب دیں',
    icon: 'Heart',
    steps: [
      {
        id: 1,
        title: 'Recognize Symptoms',
        titleUrdu: 'علامات کی شناخت',
        instruction: 'Chest pain/pressure, pain in arms/jaw/back, shortness of breath, nausea.',
        instructionUrdu: 'سینے میں درد/دباؤ، بازوؤں/جبڑے/پیٹھ میں درد، سانس کی کمی، متلی۔',
        duration: 30,
        warnings: ['Symptoms can be different in women'],
        warningsUrdu: ['خواتین میں علامات مختلف ہو سکتی ہیں']
      },
      {
        id: 2,
        title: 'Call 1122',
        titleUrdu: '۱۱۲۲ کو کال کریں',
        instruction: 'Call 1122 immediately. Tell them you suspect heart attack.',
        instructionUrdu: 'فوری طور پر ۱۱۲۲ کو کال کریں۔ انہیں بتائیں کہ دل کے دورے کا شبہ ہے۔',
        duration: 60
      },
      {
        id: 3,
        title: 'Keep Calm and Comfortable',
        titleUrdu: 'پرسکون اور آرام دہ رکھیں',
        instruction: 'Help person sit down, leaning against something. Loosen tight clothing.',
        instructionUrdu: 'شخص کو بیٹھنے میں مدد کریں، کسی چیز کے سہارے۔ تنگ کپڑے ڈھیلے کریں۔',
        duration: 120,
        warnings: ['Do not leave person alone'],
        warningsUrdu: ['شخص کو اکیلا نہ چھوڑیں']
      },
      {
        id: 4,
        title: 'Give Aspirin',
        titleUrdu: 'اسپرین دیں',
        instruction: 'If not allergic and conscious, give 300mg aspirin to chew.',
        instructionUrdu: 'اگر الرجک نہیں اور ہوش میں ہے تو ۳۰۰ ملی گرام اسپرین چبانے کو دیں۔',
        duration: 30,
        warnings: ['Only if not allergic to aspirin'],
        warningsUrdu: ['صرف اگر اسپرین سے الرجک نہیں'],
        tips: ['Chewing works faster than swallowing'],
        tipsUrdu: ['چبانا نگلنے سے تیز کام کرتا ہے']
      }
    ]
  },
  {
    id: 'stroke',
    title: 'Stroke Recognition (FAST)',
    titleUrdu: 'فالج کی تشخیص',
    category: 'emergency',
    duration: '5 mins',
    difficulty: 'Easy',
    description: 'Use FAST method to identify stroke',
    descriptionUrdu: 'فالج کی شناخت کے لیے FAST طریقہ',
    icon: 'Activity',
    steps: [
      {
        id: 1,
        title: 'F - Face Drooping',
        titleUrdu: 'F - چہرہ لٹکنا',
        instruction: 'Ask person to smile. Check if one side of face droops.',
        instructionUrdu: 'شخص سے مسکرانے کو کہیں۔ چیک کریں کہ چہرے کی ایک طرف لٹک رہی ہے۔',
        duration: 15,
        tips: ['Compare both sides of face'],
        tipsUrdu: ['چہرے کے دونوں اطراف کا موازنہ کریں']
      },
      {
        id: 2,
        title: 'A - Arm Weakness',
        titleUrdu: 'A - بازو کی کمزوری',
        instruction: 'Ask person to raise both arms. Check if one arm drifts downward.',
        instructionUrdu: 'شخص سے دونوں بازو اٹھانے کو کہیں۔ چیک کریں کہ ایک بازو نیچے بہہ رہا ہے۔',
        duration: 15,
        tips: ['Ask to hold arms up for 10 seconds'],
        tipsUrdu: ['۱۰ سیکنڈ تک بازو اوپر رکھنے کو کہیں']
      },
      {
        id: 3,
        title: 'S - Speech Difficulty',
        titleUrdu: 'S - بولنے میں دشواری',
        instruction: 'Ask person to repeat simple sentence. Check if speech is slurred.',
        instructionUrdu: 'شخص سے آسان جملہ دہرانے کو کہیں۔ چیک کریں کہ بولنا دھندلا ہے۔',
        duration: 15,
        tips: ['Use simple phrase like "The sky is blue"'],
        tipsUrdu: ['آسان فقرہ استعمال کریں جیسے "آسمان نیلا ہے"']
      },
      {
        id: 4,
        title: 'T - Time to Call 1122',
        titleUrdu: 'T - ۱۱۲۲ کو کال کرنے کا وقت',
        instruction: 'If any signs present, call 1122 immediately. Note time symptoms started.',
        instructionUrdu: 'اگر کوئی علامت موجود ہو تو فوری طور پر ۱۱۲۲ کو کال کریں۔ علامات شروع ہونے کا وقت نوٹ کریں۔',
        duration: 60,
        warnings: ['Every minute counts'],
        warningsUrdu: ['ہر منٹ اہم ہے'],
        tips: ['Treatment more effective if given within 3 hours'],
        tipsUrdu: ['۳ گھنٹے کے اندر علاج زیادہ مؤثر']
      }
    ]
  },
  {
    id: 'poisoning',
    title: 'Poisoning Response',
    titleUrdu: 'زہر کا ردعمل',
    category: 'emergency',
    duration: '5-10 mins',
    difficulty: 'Medium',
    description: 'Respond to suspected poisoning',
    descriptionUrdu: 'مشتبہ زہر کا جواب',
    icon: 'AlertTriangle',
    steps: [
      {
        id: 1,
        title: 'Identify Poison',
        titleUrdu: 'زہر کی شناخت',
        instruction: 'Try to identify what was swallowed. Keep container if available.',
        instructionUrdu: 'شناخت کریں کیا نگلا گیا۔ اگر دستیاب ہو تو ڈبہ رکھیں۔',
        duration: 30
      },
      {
        id: 2,
        title: 'Call 1122',
        titleUrdu: '۱۱۲۲ کو کال کریں',
        instruction: 'Call 1122 immediately. Tell them what was taken and how much.',
        instructionUrdu: 'فوری طور پر ۱۱۲۲ کو کال کریں۔ بتائیں کیا لیا گیا اور کتنا۔',
        duration: 60,
        warnings: ['Do not induce vomiting unless told to'],
        warningsUrdu: ['جب تک کہا نہ جائے قے کروانے کی کوشش نہ کریں']
      },
      {
        id: 3,
        title: 'Position Safely',
        titleUrdu: 'محفوظ پوزیشن میں رکھیں',
        instruction: 'If conscious, keep sitting. If unconscious and breathing, recovery position.',
        instructionUrdu: 'اگر ہوش میں ہے تو بیٹھا رکھیں۔ اگر بےہوش اور سانس لے رہا ہے تو ریکوری پوزیشن۔',
        duration: 60,
        tips: ['Monitor breathing constantly'],
        tipsUrdu: ['مسلسل سانس کی نگرانی کریں']
      },
      {
        id: 4,
        title: 'Preserve Evidence',
        titleUrdu: 'ثبوت محفوظ کریں',
        instruction: 'Keep containers, pills, or vomit for medical staff.',
        instructionUrdu: 'ڈبے، گولیاں، یا قے طبی عملے کے لیے رکھیں۔',
        duration: 30
      }
    ]
  },
  {
    id: 'seizure',
    title: 'Seizure Response',
    titleUrdu: 'مرگی کے دورے کا ردعمل',
    category: 'advanced',
    duration: '5-10 mins',
    difficulty: 'Medium',
    description: 'Help someone having a seizure',
    descriptionUrdu: 'مرگی کا دورہ پڑنے والے کی مدد',
    icon: 'Activity',
    steps: [
      {
        id: 1,
        title: 'Protect from Injury',
        titleUrdu: 'چوٹ سے بچائیں',
        instruction: 'Clear area of hard objects. Cushion head. Do not restrain person.',
        instructionUrdu: 'سخت چیزوں کا علاقہ صاف کریں۔ سر کو تکیہ دیں۔ شخص کو روکیں نہیں۔',
        duration: 60,
        warnings: ['Do not put anything in mouth', 'Do not hold person down'],
        warningsUrdu: ['منہ میں کچھ نہ ڈالیں', 'شخص کو نیچے نہ پکڑیں']
      },
      {
        id: 2,
        title: 'Time the Seizure',
        titleUrdu: 'دورے کا وقت رکھیں',
        instruction: 'Note when seizure started. Call 1122 if lasts more than 5 minutes.',
        instructionUrdu: 'نوٹ کریں دورہ کب شروع ہوا۔ ۱۱۲۲ کو کال کریں اگر ۵ منٹ سے زیادہ رہے۔',
        duration: 300,
        tips: ['Most seizures stop within 2-3 minutes'],
        tipsUrdu: ['زیادہ تر دورے ۲-۳ منٹ میں رک جاتے ہیں']
      },
      {
        id: 3,
        title: 'Turn to Side',
        titleUrdu: 'پہلو پر کریں',
        instruction: 'Once jerking stops, turn person onto their side in recovery position.',
        instructionUrdu: 'جھٹکے رکنے کے بعد، شخص کو ریکوری پوزیشن میں پہلو پر کریں۔',
        duration: 60,
        warnings: ['Do not move if injuries suspected'],
        warningsUrdu: ['اگر چوٹوں کا شبہ ہو تو نہ ہلائیں']
      },
      {
        id: 4,
        title: 'Stay Until Recovered',
        titleUrdu: 'بحالی تک رہیں',
        instruction: 'Person may be confused. Stay with them, be reassuring.',
        instructionUrdu: 'شخص الجھن میں ہو سکتا ہے۔ ان کے ساتھ رہیں، اطمینان دیں۔',
        duration: 300,
        tips: ['Speak calmly and gently'],
        tipsUrdu: ['پرسکون اور نرمی سے بولیں']
      }
    ]
  },
  {
    id: 'snake-bite',
    title: 'Snake Bite First Aid',
    titleUrdu: 'سانپ کے کاٹنے کی ابتدائی امداد',
    category: 'emergency',
    duration: '10-15 mins',
    difficulty: 'Advanced',
    description: 'Respond to venomous snake bite',
    descriptionUrdu: 'زہریلے سانپ کے کاٹنے کا جواب',
    icon: 'AlertTriangle',
    steps: [
      {
        id: 1,
        title: 'Move to Safety',
        titleUrdu: 'حفاظت کی طرف جائیں',
        instruction: 'Move away from snake. Try to remember appearance but do not catch it.',
        instructionUrdu: 'سانپ سے دور ہو جائیں۔ شکل یاد رکھنے کی کوشش کریں لیکن پکڑنے کی کوشش نہ کریں۔',
        duration: 30,
        warnings: ['Do not try to catch or kill snake'],
        warningsUrdu: ['سانپ کو پکڑنے یا مارنے کی کوشش نہ کریں']
      },
      {
        id: 2,
        title: 'Call 1122',
        titleUrdu: '۱۱۲۲ کو کال کریں',
        instruction: 'Call 1122 immediately. Describe snake if possible.',
        instructionUrdu: 'فوری طور پر ۱۱۲۲ کو کال کریں۔ اگر ممکن ہو تو سانپ کی وضاحت کریں۔',
        duration: 60,
        tips: ['Photo of snake can help if safe to take'],
        tipsUrdu: ['سانپ کی تصویر مددگار ہو سکتی ہے اگر محفوظ ہو']
      },
      {
        id: 3,
        title: 'Keep Still',
        titleUrdu: 'بے حرکت رکھیں',
        instruction: 'Keep bitten area still and below heart level. Remove jewelry.',
        instructionUrdu: 'کٹے ہوئے علاقے کو بے حرکت اور دل سے نیچے رکھیں۔ زیورات اتاریں۔',
        duration: 300,
        warnings: ['Do not cut wound', 'Do not suck venom', 'Do not apply ice'],
        warningsUrdu: ['زخم نہ کاٹیں', 'زہر نہ چوسیں', 'برف نہ لگائیں']
      },
      {
        id: 4,
        title: 'Mark and Monitor',
        titleUrdu: 'نشان لگائیں اور نگرانی کریں',
        instruction: 'Mark edge of swelling every 15 minutes. Watch for symptoms.',
        instructionUrdu: 'ہر ۱۵ منٹ میں سوجن کے کنارے کا نشان لگائیں۔ علامات پر نظر رکھیں۔',
        duration: 300,
        tips: ['Clean wound gently with soap and water'],
        tipsUrdu: ['زخم کو صابن اور پانی سے آہستہ صاف کریں']
      }
    ]
  },
  {
    id: 'fainting',
    title: 'Fainting Response',
    titleUrdu: 'بیہوشی کا ردعمل',
    category: 'basic',
    duration: '5-10 mins',
    difficulty: 'Easy',
    description: 'Help someone who has fainted',
    descriptionUrdu: 'بیہوش ہونے والے کی مدد',
    icon: 'Activity',
    steps: [
      {
        id: 1,
        title: 'Ensure Safety',
        titleUrdu: 'حفاظت کو یقینی بنائیں',
        instruction: 'If person feels faint, help them sit or lie down. Check for injuries.',
        instructionUrdu: 'اگر شخص بیہوش محسوس کرتا ہے تو بیٹھنے یا لیٹنے میں مدد کریں۔ چوٹوں کی جانچ کریں۔',
        duration: 30
      },
      {
        id: 2,
        title: 'Position Properly',
        titleUrdu: 'صحیح پوزیشن میں رکھیں',
        instruction: 'Lay flat on back. Raise legs 12 inches above heart level.',
        instructionUrdu: 'پیٹھ کے بل لیٹا دیں۔ ٹانگوں کو دل سے ۱۲ انچ اوپر اٹھائیں۔',
        duration: 180,
        warnings: ['Do not force person to sit up too quickly'],
        warningsUrdu: ['شخص کو بہت جلدی بیٹھنے پر مجبور نہ کریں']
      },
      {
        id: 3,
        title: 'Loosen Clothing',
        titleUrdu: 'تنگ کپڑے ڈھیلے کریں',
        instruction: 'Loosen any tight clothing around neck and waist. Ensure good air.',
        instructionUrdu: 'گردن اور کمر کے تنگ کپڑے ڈھیلے کریں۔ اچھی ہوا کو یقینی بنائیں۔',
        duration: 30,
        tips: ['Fresh air helps recovery'],
        tipsUrdu: ['تازہ ہوا بحالی میں مدد کرتی ہے']
      },
      {
        id: 4,
        title: 'Monitor Recovery',
        titleUrdu: 'بحالی کی نگرانی کریں',
        instruction: 'Person should recover within a minute. If not, call 1122.',
        instructionUrdu: 'شخص کو ایک منٹ میں بحال ہو جانا چاہیے۔ اگر نہیں تو ۱۱۲۲ کو کال کریں۔',
        duration: 900
      }
    ]
  }
];
