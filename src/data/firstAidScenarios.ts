export interface FirstAidStep {
  id: number;
  instruction: string;
  instructionUrdu: string;
  warning?: string;
  warningUrdu?: string;
}

export interface FirstAidScenario {
  id: string;
  title: string;
  titleUrdu: string;
  description: string;
  descriptionUrdu: string;
  icon: string;
  category: 'critical' | 'urgent' | 'standard';
  estimatedTime: string;
  estimatedTimeUrdu: string;
  steps: FirstAidStep[];
  audioInstructions?: {
    en?: string;
    ur?: string;
  };
}

export const firstAidScenarios: FirstAidScenario[] = [
  {
    id: 'cpr',
    title: 'CPR (Cardiopulmonary Resuscitation)',
    titleUrdu: 'سی پی آر (دل پھیپھڑوں کی بحالی)',
    description: 'Life-saving technique for cardiac arrest',
    descriptionUrdu: 'دل کے رک جانے پر جان بچانے کی تکنیک',
    icon: 'Heart',
    category: 'critical',
    estimatedTime: '2-3 minutes',
    estimatedTimeUrdu: '۲-۳ منٹ',
    steps: [
      {
        id: 1,
        instruction: 'Check for responsiveness. Tap shoulders and shout "Are you okay?"',
        instructionUrdu: 'ہوش کی جانچ کریں۔ کندھے تھپتھپائیں اور پوچھیں "کیا آپ ٹھیک ہیں؟"'
      },
      {
        id: 2,
        instruction: 'Call emergency services (1122) immediately',
        instructionUrdu: 'فوری طور پر ایمرجنسی سروس (۱۱۲۲) کو کال کریں'
      },
      {
        id: 3,
        instruction: 'Position the person on their back on a firm surface',
        instructionUrdu: 'شخص کو سخت سطح پر پیٹھ کے بل لٹا دیں'
      },
      {
        id: 4,
        instruction: 'Tilt head back, lift chin to open airway',
        instructionUrdu: 'سر پیچھے کریں، ٹھوڑی اٹھا کر سانس کی نالی کھولیں'
      },
      {
        id: 5,
        instruction: 'Place heel of one hand on center of chest, between nipples',
        instructionUrdu: 'ایک ہاتھ کی ایڑی سینے کے بیچ میں، نپلز کے درمیان رکھیں'
      },
      {
        id: 6,
        instruction: 'Place other hand on top, interlocking fingers',
        instructionUrdu: 'دوسرا ہاتھ اوپر رکھیں، انگلیاں آپس میں ملا کر'
      },
      {
        id: 7,
        instruction: 'Push hard and fast at least 2 inches deep, 100-120 compressions per minute',
        instructionUrdu: 'کم از کم ۲ انچ گہرائی تک زور سے اور تیزی سے دبائیں، ۱۰۰-۱۲۰ فی منٹ',
        warning: 'Do not stop CPR until emergency services arrive',
        warningUrdu: 'ایمرجنسی سروس آنے تک CPR بند نہ کریں'
      }
    ]
  },
  {
    id: 'severe-bleeding',
    title: 'Severe Bleeding Control',
    titleUrdu: 'شدید خون بہنے کا کنٹرول',
    description: 'Stop life-threatening bleeding',
    descriptionUrdu: 'جان لیوا خون بہنا رکنا',
    icon: 'Droplets',
    category: 'critical',
    estimatedTime: '1-2 minutes',
    estimatedTimeUrdu: '۱-۲ منٹ',
    steps: [
      {
        id: 1,
        instruction: 'Apply direct pressure with clean cloth or bandage',
        instructionUrdu: 'صاف کپڑے یا پٹی سے براہ راست دباؤ ڈالیں'
      },
      {
        id: 2,
        instruction: 'Maintain constant pressure - do not remove cloth even if soaked',
        instructionUrdu: 'مسلسل دباؤ برقرار رکھیں - خون سے بھیگ جانے پر بھی کپڑا نہ ہٹائیں'
      },
      {
        id: 3,
        instruction: 'Elevate the injured area above heart level if possible',
        instructionUrdu: 'اگر ممکن ہو تو زخمی حصے کو دل کی سطح سے اوپر اٹھائیں'
      },
      {
        id: 4,
        instruction: 'Add more bandages on top if bleeding continues',
        instructionUrdu: 'اگر خون بہنا جاری رہے تو اوپر سے مزید پٹیاں لگائیں'
      },
      {
        id: 5,
        instruction: 'Call emergency services (1122) immediately',
        instructionUrdu: 'فوری طور پر ایمرجنسی سروس (۱۱۲۲) کو کال کریں'
      }
    ]
  },
  {
    id: 'choking',
    title: 'Choking Relief',
    titleUrdu: 'گلا گھٹنے کا علاج',
    description: 'Clear blocked airway',
    descriptionUrdu: 'بند سانس کی نالی صاف کرنا',
    icon: 'Wind',
    category: 'critical',
    estimatedTime: '1-2 minutes',
    estimatedTimeUrdu: '۱-۲ منٹ',
    steps: [
      {
        id: 1,
        instruction: 'Ask "Are you choking?" Check if person can speak or cough',
        instructionUrdu: 'پوچھیں "کیا آپ کا گلا گھٹ رہا ہے؟" دیکھیں کہ شخص بول یا کھانس سکتا ہے'
      },
      {
        id: 2,
        instruction: 'Stand behind the person and place arms around their waist',
        instructionUrdu: 'شخص کے پیچھے کھڑے ہو کر بازو کمر کے گرد لپیٹیں'
      },
      {
        id: 3,
        instruction: 'Make a fist with one hand and place it above the navel',
        instructionUrdu: 'ایک ہاتھ سے مٹھی بنائیں اور ناف کے اوپر رکھیں'
      },
      {
        id: 4,
        instruction: 'Grasp fist with other hand and thrust upward and inward',
        instructionUrdu: 'دوسرے ہاتھ سے مٹھی پکڑیں اور اوپر اور اندر کی طرف زور سے دھکا دیں'
      },
      {
        id: 5,
        instruction: 'Repeat until object is expelled or person becomes unconscious',
        instructionUrdu: 'تب تک دہرائیں جب تک چیز نہ نکلے یا شخص بے ہوش نہ ہو جائے'
      }
    ]
  },
  {
    id: 'heart-attack',
    title: 'Heart Attack',
    titleUrdu: 'دل کا دورہ',
    description: 'Immediate response to heart attack symptoms',
    descriptionUrdu: 'دل کے دورے کی علامات کا فوری ردعمل',
    icon: 'Heart',
    category: 'critical',
    estimatedTime: '2-3 minutes',
    estimatedTimeUrdu: '۲-۳ منٹ',
    steps: [
      {
        id: 1,
        instruction: 'Call emergency services (1122) immediately',
        instructionUrdu: 'فوری طور پر ایمرجنسی سروس (۱۱۲۲) کو کال کریں'
      },
      {
        id: 2,
        instruction: 'Help person sit down and rest',
        instructionUrdu: 'شخص کو بیٹھنے اور آرام کرنے میں مدد کریں'
      },
      {
        id: 3,
        instruction: 'Loosen tight clothing around neck and chest',
        instructionUrdu: 'گردن اور سینے کے گرد تنگ کپڑے ڈھیلے کریں'
      },
      {
        id: 4,
        instruction: 'Give aspirin if available and person is not allergic',
        instructionUrdu: 'اگر دستیاب ہو اور شخص کو الرجی نہ ہو تو ایسپرین دیں'
      },
      {
        id: 5,
        instruction: 'Monitor breathing and prepare for CPR if needed',
        instructionUrdu: 'سانس کی نگرانی کریں اور ضرورت پڑنے پر CPR کے لیے تیار رہیں'
      }
    ]
  },
  {
    id: 'fracture',
    title: 'Fracture Management',
    titleUrdu: 'ہڈی ٹوٹنے کا انتظام',
    description: 'Stabilize broken bones',
    descriptionUrdu: 'ٹوٹی ہڈیوں کو مستحکم کرنا',
    icon: 'Bone',
    category: 'urgent',
    estimatedTime: '3-5 minutes',
    estimatedTimeUrdu: '۳-۵ منٹ',
    steps: [
      {
        id: 1,
        instruction: 'Do not move the person unless in immediate danger',
        instructionUrdu: 'فوری خطرے میں نہ ہو تو شخص کو نہ ہلائیں'
      },
      {
        id: 2,
        instruction: 'Control any bleeding with direct pressure',
        instructionUrdu: 'براہ راست دباؤ سے خون بہنا کنٹرول کریں'
      },
      {
        id: 3,
        instruction: 'Immobilize the injured area with splints or padding',
        instructionUrdu: 'زخمی حصے کو سپلنٹ یا پیڈنگ سے غیر متحرک کریں'
      },
      {
        id: 4,
        instruction: 'Apply ice wrapped in cloth to reduce swelling',
        instructionUrdu: 'سوجن کم کرنے کے لیے کپڑے میں لپٹی برف لگائیں'
      },
      {
        id: 5,
        instruction: 'Seek medical attention immediately',
        instructionUrdu: 'فوری طور پر طبی امداد حاصل کریں'
      }
    ]
  },
  {
    id: 'burns',
    title: 'Burn Treatment',
    titleUrdu: 'جلنے کا علاج',
    description: 'First aid for thermal burns',
    descriptionUrdu: 'حرارتی جلن کی ابتدائی طبی امداد',
    icon: 'Flame',
    category: 'urgent',
    estimatedTime: '3-5 minutes',
    estimatedTimeUrdu: '۳-۵ منٹ',
    steps: [
      {
        id: 1,
        instruction: 'Remove person from heat source if safe to do so',
        instructionUrdu: 'اگر محفوظ ہو تو شخص کو حرارت کے ذریعے سے دور کریں'
      },
      {
        id: 2,
        instruction: 'Cool the burn with cool (not cold) running water for 10-20 minutes',
        instructionUrdu: 'جلے ہوئے حصے کو ٹھنڈے (برفیلے نہیں) بہتے پانی سے ۱۰-۲۰ منٹ ٹھنڈا کریں'
      },
      {
        id: 3,
        instruction: 'Remove jewelry and loose clothing from burned area',
        instructionUrdu: 'جلے ہوئے حصے سے زیورات اور ڈھیلے کپڑے ہٹائیں'
      },
      {
        id: 4,
        instruction: 'Cover with clean, dry cloth or sterile bandage',
        instructionUrdu: 'صاف، خشک کپڑے یا جراثیم سے پاک پٹی سے ڈھکیں'
      },
      {
        id: 5,
        instruction: 'Do not apply ice, butter, or home remedies',
        instructionUrdu: 'برف، مکھن، یا گھریلو نسخے استعمال نہ کریں',
        warning: 'For severe burns, call 1122 immediately',
        warningUrdu: 'شدید جلن کے لیے فوری طور پر ۱۱۲۲ کال کریں'
      }
    ]
  },
  {
    id: 'stroke',
    title: 'Stroke Recognition',
    titleUrdu: 'فالج کی تشخیص',
    description: 'Identify and respond to stroke symptoms',
    descriptionUrdu: 'فالج کی علامات کی شناخت اور ردعمل',
    icon: 'Brain',
    category: 'critical',
    estimatedTime: '1-2 minutes',
    estimatedTimeUrdu: '۱-۲ منٹ',
    steps: [
      {
        id: 1,
        instruction: 'Use FAST test: Face drooping, Arm weakness, Speech difficulty, Time to call',
        instructionUrdu: 'FAST ٹیسٹ استعمال کریں: چہرہ لٹکنا، بازو کمزوری، بولنے میں دشواری، کال کا وقت'
      },
      {
        id: 2,
        instruction: 'Call emergency services (1122) immediately if any signs present',
        instructionUrdu: 'کوئی بھی علامت ہو تو فوری طور پر ایمرجنسی سروس (۱۱۲۲) کال کریں'
      },
      {
        id: 3,
        instruction: 'Note the time symptoms first appeared',
        instructionUrdu: 'علامات پہلی بار ظاہر ہونے کا وقت نوٹ کریں'
      },
      {
        id: 4,
        instruction: 'Keep person calm and lying down with head slightly elevated',
        instructionUrdu: 'شخص کو پرسکون رکھیں اور سر تھوڑا اونچا کر کے لٹا دیں'
      },
      {
        id: 5,
        instruction: 'Do not give food, water, or medication',
        instructionUrdu: 'کھانا، پانی، یا دوا نہ دیں'
      }
    ]
  },
  {
    id: 'allergic-reaction',
    title: 'Allergic Reaction',
    titleUrdu: 'الرجک ردعمل',
    description: 'Manage severe allergic reactions',
    descriptionUrdu: 'شدید الرجک ردعمل کا انتظام',
    icon: 'AlertTriangle',
    category: 'urgent',
    estimatedTime: '2-3 minutes',
    estimatedTimeUrdu: '۲-۳ منٹ',
    steps: [
      {
        id: 1,
        instruction: 'Remove or avoid the allergen if known',
        instructionUrdu: 'اگر معلوم ہو تو الرجن کو ہٹائیں یا اس سے بچیں'
      },
      {
        id: 2,
        instruction: 'If person has epinephrine auto-injector, help them use it',
        instructionUrdu: 'اگر شخص کے پاس ایپی نیفرین انجیکٹر ہے تو استعمال میں مدد کریں'
      },
      {
        id: 3,
        instruction: 'Call emergency services (1122) for severe reactions',
        instructionUrdu: 'شدید ردعمل کے لیے ایمرجنسی سروس (۱۱۲۲) کال کریں'
      },
      {
        id: 4,
        instruction: 'Keep person calm and help them sit upright',
        instructionUrdu: 'شخص کو پرسکون رکھیں اور سیدھا بیٹھنے میں مدد کریں'
      },
      {
        id: 5,
        instruction: 'Monitor breathing and be prepared to start CPR',
        instructionUrdu: 'سانس کی نگرانی کریں اور CPR شروع کرنے کے لیے تیار رہیں'
      }
    ]
  },
  {
    id: 'seizure',
    title: 'Seizure Response',
    titleUrdu: 'مرگی کا دورہ',
    description: 'Safe response to seizures',
    descriptionUrdu: 'مرگی کے دورے کا محفوظ ردعمل',
    icon: 'Zap',
    category: 'urgent',
    estimatedTime: '2-5 minutes',
    estimatedTimeUrdu: '۲-۵ منٹ',
    steps: [
      {
        id: 1,
        instruction: 'Stay calm and time the seizure',
        instructionUrdu: 'پرسکون رہیں اور دورے کا وقت نوٹ کریں'
      },
      {
        id: 2,
        instruction: 'Clear area of dangerous objects',
        instructionUrdu: 'خطرناک اشیاء کو علاقے سے ہٹا دیں'
      },
      {
        id: 3,
        instruction: 'Do not restrain the person or put anything in their mouth',
        instructionUrdu: 'شخص کو روکیں نہیں اور منہ میں کچھ نہ ڈالیں'
      },
      {
        id: 4,
        instruction: 'Turn person on side when seizure ends to help breathing',
        instructionUrdu: 'دورہ ختم ہونے پر سانس میں مدد کے لیے شخص کو کروٹ پر کریں'
      },
      {
        id: 5,
        instruction: 'Call 1122 if seizure lasts more than 5 minutes',
        instructionUrdu: 'اگر دورہ ۵ منٹ سے زیادہ ہو تو ۱۱۲۲ کال کریں'
      }
    ]
  },
  {
    id: 'poisoning',
    title: 'Poisoning Response',
    titleUrdu: 'زہر کا ردعمل',
    description: 'Emergency response to poisoning',
    descriptionUrdu: 'زہر کا ہنگامی ردعمل',
    icon: 'Skull',
    category: 'critical',
    estimatedTime: '1-2 minutes',
    estimatedTimeUrdu: '۱-۲ منٹ',
    steps: [
      {
        id: 1,
        instruction: 'Call emergency services (1122) and poison control immediately',
        instructionUrdu: 'فوری طور پر ایمرجنسی سروس (۱۱۲۲) اور پوائزن کنٹرول کال کریں'
      },
      {
        id: 2,
        instruction: 'Try to identify the poison and keep container if available',
        instructionUrdu: 'زہر کی شناخت کی کوشش کریں اور دستیاب ہو تو کنٹینر رکھیں'
      },
      {
        id: 3,
        instruction: 'If person is conscious, rinse mouth with water',
        instructionUrdu: 'اگر شخص ہوش میں ہے تو منہ پانی سے صاف کریں'
      },
      {
        id: 4,
        instruction: 'Do not induce vomiting unless instructed by emergency services',
        instructionUrdu: 'ایمرجنسی سروس کی ہدایت کے بغیر قے نہ کروائیں'
      },
      {
        id: 5,
        instruction: 'Monitor breathing and consciousness until help arrives',
        instructionUrdu: 'مدد آنے تک سانس اور ہوش کی نگرانی کریں'
      }
    ]
  }
];