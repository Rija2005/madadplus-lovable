import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TextReportDialog } from '@/components/ReportDialog';
import { VoiceReportDialog } from '@/components/VoiceReportDialog';
import { MediaUploadDialog } from '@/components/MediaUploadDialog';
import { 
  Phone, 
  Ambulance, 
  Hospital, 
  Heart,
  Shield,
  Flame,
  Car,
  AlertTriangle,
  Camera,
  Mic,
  FileText,
  MapPin,
  Clock
} from 'lucide-react';
import heroBackground from '@/assets/hero-background.jpg';

const EmergencyHome = () => {
  const [reportType, setReportType] = useState<string | null>(null);
  const [reportMethod, setReportMethod] = useState<'text' | 'voice' | 'photo' | null>(null);

  const emergencyCategories = [
    {
      id: 'medical',
      title: 'Medical Emergency',
      titleUrdu: 'طبی ہنگامی',
      description: 'Health emergencies, injuries, accidents',
      descriptionUrdu: 'صحت کی ہنگامی حالت، زخم، حادثات',
      icon: Heart,
      color: 'emergency',
      bgColor: 'bg-emergency/10',
      examples: ['Heart Attack', 'Accident', 'Unconscious', 'Severe Pain']
    },
    {
      id: 'fire',
      title: 'Fire Emergency',
      titleUrdu: 'آگ کی ہنگامی',
      description: 'Fire, gas leak, explosion',
      descriptionUrdu: 'آگ، گیس لیک، دھماکہ',
      icon: Flame,
      color: 'warning',
      bgColor: 'bg-warning/10',
      examples: ['Building Fire', 'Gas Leak', 'Explosion', 'Smoke']
    },
    {
      id: 'crime',
      title: 'Crime/Security',
      titleUrdu: 'جرم/سیکیورٹی',
      description: 'Theft, violence, suspicious activity',
      descriptionUrdu: 'چوری، تشدد، مشکوک سرگرمی',
      icon: Shield,
      color: 'destructive',
      bgColor: 'bg-destructive/10',
      examples: ['Theft', 'Violence', 'Suspicious Person', 'Break-in']
    },
    {
      id: 'traffic',
      title: 'Traffic/Road',
      titleUrdu: 'ٹریفک/سڑک',
      description: 'Road accidents, traffic issues',
      descriptionUrdu: 'سڑک حادثات، ٹریفک مسائل',
      icon: Car,
      color: 'primary',
      bgColor: 'bg-primary/10',
      examples: ['Car Accident', 'Road Block', 'Traffic Jam', 'Vehicle Issue']
    }
  ];

  const quickActions = [
    {
      title: 'Call Ambulance',
      titleUrdu: 'ایمبولینس بلائیں',
      description: 'Book emergency transport',
      descriptionUrdu: 'ہنگامی ٹرانسپورٹ بک کریں',
      icon: Ambulance,
      href: '/ambulance',
      variant: 'emergency' as const
    },
    {
      title: 'Find Hospitals',
      titleUrdu: 'ہسپتال تلاش کریں',
      description: 'Nearby medical facilities',
      descriptionUrdu: 'قریبی طبی سہولات',
      icon: Hospital,
      href: '/hospitals',
      variant: 'success' as const
    },
    {
      title: 'First Aid Guide',
      titleUrdu: 'طبی امداد گائیڈ',
      description: 'Emergency medical help',
      descriptionUrdu: 'ہنگامی طبی مدد',
      icon: Heart,
      href: '/first-aid',
      variant: 'warning' as const
    }
  ];

  const reportMethods = [
    { id: 'text', icon: FileText, label: 'Text Report', labelUrdu: 'متنی رپورٹ' },
    { id: 'voice', icon: Mic, label: 'Voice Message', labelUrdu: 'صوتی پیغام' },
    { id: 'photo', icon: Camera, label: 'Photo/Video', labelUrdu: 'تصویر/ویڈیو' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        className="relative py-20 px-4 text-center bg-gradient-hero bg-cover bg-center"
        style={{ backgroundImage: `url(${heroBackground})` }}
      >
        <div className="absolute inset-0 bg-gradient-primary/90"></div>
        <div className="relative max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-primary-foreground mb-4">
            Madad+
          </h1>
          <p className="text-xl md:text-2xl text-primary-foreground/90 mb-8">
            Pakistan's Unified Emergency Response Platform
          </p>
          <p className="text-lg text-primary-foreground/80 mb-10">
            خوش آمدید • پاکستان کا متحد ہنگامی ردعمل پلیٹ فارم
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button variant="emergency" size="lg" className="text-lg px-8 py-4">
              <Phone className="w-6 h-6 mr-2" />
              Emergency Call 1122
            </Button>
            <Button variant="hero" size="lg" className="text-lg px-8 py-4">
              <AlertTriangle className="w-6 h-6 mr-2" />
              Report Incident
            </Button>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Quick Actions */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Quick Emergency Actions</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {quickActions.map((action) => (
              <Link key={action.title} to={action.href}>
                <Card className="hover:shadow-primary transition-all duration-300 h-full">
                  <CardHeader className="text-center pb-4">
                    <div className={`w-16 h-16 mx-auto rounded-full bg-${action.variant}/10 flex items-center justify-center mb-4`}>
                      <action.icon className={`w-8 h-8 text-${action.variant}`} />
                    </div>
                    <CardTitle className="text-xl">{action.title}</CardTitle>
                    <CardDescription className="text-sm text-muted-foreground">
                      {action.titleUrdu}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-foreground">{action.description}</p>
                    <p className="text-sm text-muted-foreground mt-1">{action.descriptionUrdu}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Emergency Categories */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Report Emergency</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {emergencyCategories.map((category) => (
              <Card 
                key={category.id}
                className={`cursor-pointer transition-all duration-300 hover:shadow-primary ${
                  reportType === category.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setReportType(category.id)}
              >
                <CardHeader className="text-center pb-4">
                  <div className={`w-16 h-16 mx-auto rounded-full ${category.bgColor} flex items-center justify-center mb-4`}>
                    <category.icon className={`w-8 h-8 text-${category.color}`} />
                  </div>
                  <CardTitle className="text-lg">{category.title}</CardTitle>
                  <CardDescription className="text-sm">{category.titleUrdu}</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-sm text-muted-foreground mb-3">{category.description}</p>
                  <div className="flex flex-wrap gap-1 justify-center">
                    {category.examples.slice(0, 2).map((example) => (
                      <Badge key={example} variant="secondary" className="text-xs">
                        {example}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Report Methods */}
          {reportType && (
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="text-center">How would you like to report?</CardTitle>
                <CardDescription className="text-center">
                  آپ کیسے رپورٹ کرنا چاہیں گے؟
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {reportMethods.map((method) => (
                    <Button
                      key={method.id}
                      variant="outline"
                      className="h-24 flex-col gap-2"
                      onClick={() => setReportMethod(method.id as any)}
                    >
                      <method.icon className="w-6 h-6" />
                      <span className="text-sm">{method.label}</span>
                      <span className="text-xs text-muted-foreground">{method.labelUrdu}</span>
                    </Button>
                  ))}
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>Location will be automatically detected</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>Emergency services will be notified immediately</span>
                  </div>
                </div>

                <Button variant="emergency" className="w-full mt-6" size="lg">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  Submit Emergency Report
                </Button>
              </CardContent>
            </Card>
          )}
        </section>

        {/* Status Indicators */}
        <section>
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Available Ambulances</p>
                    <p className="text-2xl font-bold text-success">24</p>
                  </div>
                  <Ambulance className="w-8 h-8 text-success" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Hospitals</p>
                    <p className="text-2xl font-bold text-primary">18</p>
                  </div>
                  <Hospital className="w-8 h-8 text-primary" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Response Time</p>
                    <p className="text-2xl font-bold text-warning">8 min</p>
                  </div>
                  <Clock className="w-8 h-8 text-warning" />
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>

      {/* Report Dialogs */}
      <TextReportDialog 
        open={reportMethod === 'text'} 
        onOpenChange={(open) => !open && setReportMethod(null)}
        reportType={reportType || 'medical'}
      />
      <VoiceReportDialog 
        open={reportMethod === 'voice'} 
        onOpenChange={(open) => !open && setReportMethod(null)}
        reportType={reportType || 'medical'}
      />
      <MediaUploadDialog 
        open={reportMethod === 'photo'} 
        onOpenChange={(open) => !open && setReportMethod(null)}
        reportType={reportType || 'medical'}
      />
    </div>
  );
};

export default EmergencyHome;