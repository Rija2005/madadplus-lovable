import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Shield, 
  Camera, 
  Mic, 
  MapPin,
  Upload,
  AlertTriangle,
  Eye,
  EyeOff,
  FileText,
  Clock,
  CheckCircle,
  User,
  Calendar
} from 'lucide-react';

interface Report {
  id: string;
  type: 'crime' | 'incident' | 'safety';
  title: string;
  description: string;
  location: string;
  timestamp: Date;
  status: 'submitted' | 'under_review' | 'resolved';
  isAnonymous: boolean;
  hasEvidence: boolean;
}

const ReportsPage = () => {
  const [activeTab, setActiveTab] = useState<'new' | 'history'>('new');
  const [reportType, setReportType] = useState<string>('');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [evidenceFiles, setEvidenceFiles] = useState<File[]>([]);

  // Mock user reports
  const userReports: Report[] = [
    {
      id: '1',
      type: 'crime',
      title: 'Suspicious Activity',
      description: 'Unusual behavior observed near ATM',
      location: 'Mall Road, Lahore',
      timestamp: new Date('2024-01-15T10:30:00'),
      status: 'under_review',
      isAnonymous: true,
      hasEvidence: true
    },
    {
      id: '2',
      type: 'incident',
      title: 'Traffic Light Malfunction',
      description: 'Traffic signal not working properly',
      location: 'Liberty Chowk, Lahore',
      timestamp: new Date('2024-01-14T16:45:00'),
      status: 'resolved',
      isAnonymous: false,
      hasEvidence: false
    }
  ];

  const reportTypes = [
    {
      id: 'theft',
      title: 'Theft/Robbery',
      titleUrdu: 'چوری/ڈکیتی',
      description: 'Stolen property, pickpocketing, robbery',
      icon: Shield,
      category: 'crime'
    },
    {
      id: 'violence',
      title: 'Violence/Assault',
      titleUrdu: 'تشدد/حملہ',
      description: 'Physical violence, assault, fighting',
      icon: AlertTriangle,
      category: 'crime'
    },
    {
      id: 'suspicious',
      title: 'Suspicious Activity',
      titleUrdu: 'مشکوک سرگرمی',
      description: 'Unusual behavior, suspicious persons',
      icon: Eye,
      category: 'crime'
    },
    {
      id: 'traffic',
      title: 'Traffic Incident',
      titleUrdu: 'ٹریفک واقعہ',
      description: 'Road accidents, traffic violations',
      icon: AlertTriangle,
      category: 'incident'
    },
    {
      id: 'public_safety',
      title: 'Public Safety',
      titleUrdu: 'عوامی حفاظت',
      description: 'Safety hazards, broken infrastructure',
      icon: Shield,
      category: 'safety'
    },
    {
      id: 'other',
      title: 'Other',
      titleUrdu: 'دیگر',
      description: 'Other incidents or concerns',
      icon: FileText,
      category: 'incident'
    }
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      setEvidenceFiles([...evidenceFiles, ...newFiles]);
    }
  };

  const handleSubmitReport = () => {
    // In a real app, this would submit to backend
    console.log('Submitting report:', {
      type: reportType,
      description,
      location,
      isAnonymous,
      evidenceFiles
    });
    
    // Reset form
    setReportType('');
    setDescription('');
    setLocation('');
    setEvidenceFiles([]);
    
    // Show success message (would use toast in real app)
    alert('Report submitted successfully! Reference ID: #REP' + Math.random().toString(36).substr(2, 9).toUpperCase());
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted': return 'secondary';
      case 'under_review': return 'warning';
      case 'resolved': return 'success';
      default: return 'secondary';
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Crime & Incident Reporting</h1>
        <p className="text-muted-foreground">
          جرم اور واقعہ کی رپورٹنگ • Anonymous reporting for community safety
        </p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-8">
        <Button
          variant={activeTab === 'new' ? 'default' : 'outline'}
          onClick={() => setActiveTab('new')}
          className="flex-1"
        >
          <FileText className="w-4 h-4 mr-2" />
          New Report
        </Button>
        <Button
          variant={activeTab === 'history' ? 'default' : 'outline'}
          onClick={() => setActiveTab('history')}
          className="flex-1"
        >
          <Clock className="w-4 h-4 mr-2" />
          My Reports
        </Button>
      </div>

      {/* New Report Form */}
      {activeTab === 'new' && (
        <div className="space-y-8">
          {/* Privacy Notice */}
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Shield className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-primary mb-2">Your Privacy is Protected</h3>
                  <p className="text-sm text-muted-foreground">
                    All reports can be submitted anonymously. Your identity is protected and only shared 
                    with authorities if you choose to provide it. Reports are encrypted and handled securely.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Report Type Selection */}
          <Card>
            <CardHeader>
              <CardTitle>What would you like to report?</CardTitle>
              <CardDescription>Select the type of incident or crime you want to report</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {reportTypes.map((type) => (
                  <Card
                    key={type.id}
                    className={`cursor-pointer transition-all duration-300 hover:shadow-primary ${
                      reportType === type.id ? 'ring-2 ring-primary bg-primary/5' : ''
                    }`}
                    onClick={() => setReportType(type.id)}
                  >
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
                          <type.icon className="w-6 h-6 text-primary" />
                        </div>
                        <h3 className="font-semibold mb-1">{type.title}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{type.titleUrdu}</p>
                        <p className="text-xs text-muted-foreground">{type.description}</p>
                        <Badge variant="outline" className="mt-2 text-xs">
                          {type.category}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Report Details Form */}
          {reportType && (
            <Card>
              <CardHeader>
                <CardTitle>Report Details</CardTitle>
                <CardDescription>Provide as much detail as possible to help authorities respond appropriately</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Anonymous Toggle */}
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    {isAnonymous ? (
                      <EyeOff className="w-5 h-5 text-success" />
                    ) : (
                      <Eye className="w-5 h-5 text-warning" />
                    )}
                    <div>
                      <p className="font-medium">
                        {isAnonymous ? 'Anonymous Report' : 'Identified Report'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {isAnonymous 
                          ? 'Your identity will not be shared with anyone' 
                          : 'Authorities may contact you for follow-up'
                        }
                      </p>
                    </div>
                  </div>
                  <Button
                    variant={isAnonymous ? 'success' : 'outline'}
                    onClick={() => setIsAnonymous(!isAnonymous)}
                  >
                    {isAnonymous ? 'Keep Anonymous' : 'Make Anonymous'}
                  </Button>
                </div>

                {/* Location */}
                <div>
                  <Label htmlFor="location">Location *</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <Input
                      id="location"
                      placeholder="Enter location or nearby landmark"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="flex-1"
                    />
                    <Button variant="outline" size="sm">
                      Use GPS
                    </Button>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe what happened in detail. Include time, people involved, what you saw or heard..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="mt-1 min-h-[120px]"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Be as specific as possible. This information helps authorities respond appropriately.
                  </p>
                </div>

                {/* Evidence Upload */}
                <div>
                  <Label>Evidence (Optional)</Label>
                  <div className="mt-2 space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="relative">
                        <input
                          type="file"
                          id="photo-upload"
                          accept="image/*"
                          multiple
                          onChange={handleFileUpload}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <Button variant="outline" className="w-full h-24 flex-col gap-2">
                          <Camera className="w-6 h-6" />
                          <span className="text-sm">Photos</span>
                        </Button>
                      </div>
                      
                      <div className="relative">
                        <input
                          type="file"
                          id="video-upload"
                          accept="video/*"
                          multiple
                          onChange={handleFileUpload}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <Button variant="outline" className="w-full h-24 flex-col gap-2">
                          <Upload className="w-6 h-6" />
                          <span className="text-sm">Videos</span>
                        </Button>
                      </div>
                      
                      <div className="relative">
                        <input
                          type="file"
                          id="audio-upload"
                          accept="audio/*"
                          multiple
                          onChange={handleFileUpload}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <Button variant="outline" className="w-full h-24 flex-col gap-2">
                          <Mic className="w-6 h-6" />
                          <span className="text-sm">Audio</span>
                        </Button>
                      </div>
                    </div>

                    {evidenceFiles.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Uploaded Files:</p>
                        {evidenceFiles.map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                            <span className="text-sm">{file.name}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setEvidenceFiles(files => files.filter((_, i) => i !== index))}
                            >
                              Remove
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <Button
                    onClick={handleSubmitReport}
                    className="w-full"
                    size="lg"
                    variant="default"
                    disabled={!reportType || !description || !location}
                  >
                    <Shield className="w-5 h-5 mr-2" />
                    Submit Report
                  </Button>
                  <p className="text-xs text-muted-foreground text-center mt-2">
                    By submitting, you confirm that the information provided is accurate to the best of your knowledge.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Report History */}
      {activeTab === 'history' && (
        <div className="space-y-6">
          {userReports.length === 0 ? (
            <Card>
              <CardContent className="pt-12 pb-12 text-center">
                <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Reports Yet</h3>
                <p className="text-muted-foreground mb-6">
                  You haven't submitted any reports. Help keep your community safe by reporting incidents.
                </p>
                <Button onClick={() => setActiveTab('new')}>
                  Create First Report
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {userReports.map((report) => (
                <Card key={report.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-lg mb-1">{report.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>{report.location}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{report.timestamp.toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            {report.isAnonymous ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <User className="w-4 h-4" />
                            )}
                            <span>{report.isAnonymous ? 'Anonymous' : 'Identified'}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={getStatusColor(report.status)} className="mb-2">
                          {report.status.replace('_', ' ')}
                        </Badge>
                        <p className="text-xs text-muted-foreground">#{report.id}</p>
                      </div>
                    </div>
                    
                    <p className="text-muted-foreground mb-4">{report.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {report.type}
                        </Badge>
                        {report.hasEvidence && (
                          <Badge variant="secondary" className="text-xs">
                            Has Evidence
                          </Badge>
                        )}
                      </div>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReportsPage;