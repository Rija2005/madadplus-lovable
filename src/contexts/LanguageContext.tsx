import React, { createContext, useContext, useState, useEffect } from 'react';

interface LanguageContextType {
  language: 'en' | 'ur';
  setLanguage: (lang: 'en' | 'ur') => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation dictionary
const translations = {
  en: {
    // Navigation
    'nav.emergency': 'Emergency',
    'nav.ambulance': 'Ambulance',
    'nav.hospitals': 'Hospitals',
    'nav.firstAid': 'First Aid',
    'nav.reports': 'Reports',
    'nav.callEmergency': 'Call 1122',
    'nav.emergencyCall': 'Emergency Call 1122',
    
    // Header
    'header.title': 'Madad+',
    'header.subtitle': 'Emergency Response',
    'header.description': 'Pakistan\'s Unified Emergency Response Platform',
    'header.welcome': 'Welcome',
    
    // Emergency Categories
    'emergency.medical': 'Medical Emergency',
    'emergency.fire': 'Fire Emergency',
    'emergency.crime': 'Crime/Security',
    'emergency.traffic': 'Traffic/Road',
    
    // Quick Actions
    'action.callAmbulance': 'Call Ambulance',
    'action.findHospitals': 'Find Hospitals',
    'action.firstAidGuide': 'First Aid Guide',
    
    // Common
    'common.submit': 'Submit',
    'common.cancel': 'Cancel',
    'common.loading': 'Loading...',
    'common.location': 'Location',
    'common.description': 'Description',
    'common.time': 'Time',
    'common.status': 'Status',
    'common.available': 'Available',
    'common.unavailable': 'Unavailable',
    'common.emergency': 'Emergency',
    'common.report': 'Report',
    
    // First Aid
    'firstAid.title': 'First Aid Assistant',
    'firstAid.subtitle': 'Emergency Medical Guidance',
    'firstAid.cpr': 'CPR (Cardiopulmonary Resuscitation)',
    'firstAid.bleeding': 'Severe Bleeding Control',
    'firstAid.choking': 'Choking Relief',
    'firstAid.fracture': 'Fracture Management',
    'firstAid.burns': 'Burn Treatment',
    'firstAid.poisoning': 'Poisoning Response',
    'firstAid.heartAttack': 'Heart Attack',
    'firstAid.stroke': 'Stroke Recognition',
    'firstAid.allergicReaction': 'Allergic Reaction',
    'firstAid.seizure': 'Seizure Response',
    
    // Dashboard
    'dashboard.title': 'Emergency Dashboard',
    'dashboard.subtitle': 'Monitor and manage emergency reports',
    
    // Offline
    'offline.mode': 'Offline Mode',
    'offline.online': 'Online',
    'offline.queued': 'queued',
    'offline.willSync': 'Reports will be sent when online',
    'offline.connected': 'Connected to server',
    
    // Ambulance
    'ambulance.title': 'Ambulance Dispatch',
    'ambulance.subtitle': 'Quick medical transport booking',
    'ambulance.nearYou': 'Available Ambulances Near You',
    'ambulance.selectSuitable': 'Select the most suitable ambulance',
    'ambulance.confirmed': 'Ambulance Confirmed!',
    'ambulance.onTheWay': 'Your ambulance is on the way',
    
    // Hospital
    'hospital.title': 'Hospital Connect',
    'hospital.subtitle': 'Find nearby medical facilities',
    'hospital.nearby': 'Nearby Hospitals',
    'hospital.available': 'Available',
    'hospital.busy': 'Busy',
    'hospital.full': 'Full',
    
    // Reports
    'reports.title': 'Crime & Incident Reporting',
    'reports.subtitle': 'Anonymous reporting for community safety',
    'reports.new': 'New Report',
    'reports.history': 'My Reports',
    'reports.anonymous': 'Anonymous Report',
  },
  ur: {
    // Navigation
    'nav.emergency': 'ہنگامی',
    'nav.ambulance': 'ایمبولینس',
    'nav.hospitals': 'ہسپتال',
    'nav.firstAid': 'طبی امداد',
    'nav.reports': 'رپورٹس',
    'nav.callEmergency': '۱۱۲۲ کال کریں',
    'nav.emergencyCall': 'ہنگامی کال ۱۱۲۲',
    
    // Header
    'header.title': 'مدد+',
    'header.subtitle': 'ہنگامی ردعمل',
    'header.description': 'پاکستان کا متحد ہنگامی ردعمل پلیٹ فارم',
    'header.welcome': 'خوش آمدید',
    
    // Emergency Categories
    'emergency.medical': 'طبی ہنگامی',
    'emergency.fire': 'آگ کی ہنگامی',
    'emergency.crime': 'جرم/سیکیورٹی',
    'emergency.traffic': 'ٹریفک/سڑک',
    
    // Quick Actions
    'action.callAmbulance': 'ایمبولینس بلائیں',
    'action.findHospitals': 'ہسپتال تلاش کریں',
    'action.firstAidGuide': 'طبی امداد گائیڈ',
    
    // Common
    'common.submit': 'جمع کریں',
    'common.cancel': 'منسوخ',
    'common.loading': 'لوڈ ہو رہا ہے...',
    'common.location': 'مقام',
    'common.description': 'تفصیل',
    'common.time': 'وقت',
    'common.status': 'حالت',
    'common.available': 'دستیاب',
    'common.unavailable': 'غیر دستیاب',
    'common.emergency': 'ہنگامی',
    'common.report': 'رپورٹ',
    
    // First Aid
    'firstAid.title': 'طبی امداد اسسٹنٹ',
    'firstAid.subtitle': 'ہنگامی طبی رہنمائی',
    'firstAid.cpr': 'سی پی آر (دل پھیپھڑوں کی بحالی)',
    'firstAid.bleeding': 'شدید خون بہنے کا کنٹرول',
    'firstAid.choking': 'گلا گھٹنے کا علاج',
    'firstAid.fracture': 'ہڈی ٹوٹنے کا انتظام',
    'firstAid.burns': 'جلنے کا علاج',
    'firstAid.poisoning': 'زہر کا ردعمل',
    'firstAid.heartAttack': 'دل کا دورہ',
    'firstAid.stroke': 'فالج کی تشخیص',
    'firstAid.allergicReaction': 'الرجک ردعمل',
    'firstAid.seizure': 'مرگی کا دورہ',
    
    // Dashboard
    'dashboard.title': 'ہنگامی ڈیش بورڈ',
    'dashboard.subtitle': 'ہنگامی رپورٹس کی نگرانی اور انتظام',
    
    // Offline
    'offline.mode': 'آف لائن موڈ',
    'offline.online': 'آن لائن',
    'offline.queued': 'قطار میں',
    'offline.willSync': 'آن لائن ہونے پر رپورٹس بھیجی جائیں گی',
    'offline.connected': 'سرور سے منسلک',
    
    // Ambulance
    'ambulance.title': 'ایمبولینس ڈسپیچ',
    'ambulance.subtitle': 'تیز طبی ٹرانسپورٹ بکنگ',
    'ambulance.nearYou': 'آپ کے قریب دستیاب ایمبولینس',
    'ambulance.selectSuitable': 'سب سے موزوں ایمبولینس منتخب کریں',
    'ambulance.confirmed': 'ایمبولینس تصدیق شدہ!',
    'ambulance.onTheWay': 'آپ کی ایمبولینس راستے میں ہے',
    
    // Hospital
    'hospital.title': 'ہسپتال کنکٹ',
    'hospital.subtitle': 'قریبی طبی سہولات تلاش کریں',
    'hospital.nearby': 'قریبی ہسپتال',
    'hospital.available': 'دستیاب',
    'hospital.busy': 'مصروف',
    'hospital.full': 'بھرا ہوا',
    
    // Reports
    'reports.title': 'جرم اور واقعہ کی رپورٹنگ',
    'reports.subtitle': 'کمیونٹی کی حفاظت کے لیے گمنام رپورٹنگ',
    'reports.new': 'نئی رپورٹ',
    'reports.history': 'میری رپورٹس',
    'reports.anonymous': 'گمنام رپورٹ',
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<'en' | 'ur'>('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('madadgar-language') as 'en' | 'ur';
    if (savedLanguage) {
      setLanguage(savedLanguage);
      document.documentElement.dir = savedLanguage === 'ur' ? 'rtl' : 'ltr';
      document.documentElement.lang = savedLanguage;
    }
  }, []);

  const handleSetLanguage = (lang: 'en' | 'ur') => {
    setLanguage(lang);
    localStorage.setItem('madadgar-language', lang);
    // Update document direction for RTL/LTR
    document.documentElement.dir = lang === 'ur' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};