import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { 
  MapPin, 
  Phone, 
  Clock,
  Navigation,
  Hospital,
  Activity,
  Users,
  Car,
  Search,
  Filter,
  Star,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

interface HospitalData {
  id: string;
  name: string;
  nameUrdu: string;
  address: string;
  distance: string;
  rating: number;
  totalBeds: number;
  availableBeds: number;
  emergencyStatus: 'available' | 'busy' | 'full';
  specialties: string[];
  phone: string;
  hasAmbulance: boolean;
  hasICU: boolean;
  hasEmergency: boolean;
  waitTime: string;
}

const HospitalConnect = () => {
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSpecialty, setFilterSpecialty] = useState<string>('all');
  const navigate = useNavigate();
  const { toast } = useToast();

  // Mock hospital data
  const hospitals: HospitalData[] = [
    {
      id: '1',
      name: 'Shaukat Khanum Memorial Hospital',
      nameUrdu: 'شوکت خانم میموریل ہسپتال',
      address: 'Johar Town, Lahore',
      distance: '2.1 km',
      rating: 4.9,
      totalBeds: 300,
      availableBeds: 45,
      emergencyStatus: 'available',
      specialties: ['Oncology', 'Surgery', 'Emergency'],
      phone: '+92-42-3590-5000',
      hasAmbulance: true,
      hasICU: true,
      hasEmergency: true,
      waitTime: '15 mins'
    },
    {
      id: '2',
      name: 'Services Hospital Lahore',
      nameUrdu: 'سروسز ہسپتال لاہور',
      address: 'Ghaus-e-Azam, Lahore',
      distance: '3.5 km',
      rating: 4.2,
      totalBeds: 800,
      availableBeds: 12,
      emergencyStatus: 'busy',
      specialties: ['General Medicine', 'Surgery', 'Cardiology'],
      phone: '+92-42-99201740',
      hasAmbulance: true,
      hasICU: true,
      hasEmergency: true,
      waitTime: '45 mins'
    },
    {
      id: '3',
      name: 'Mayo Hospital',
      nameUrdu: 'مایو ہسپتال',
      address: 'Anarkali, Lahore',
      distance: '4.2 km',
      rating: 4.0,
      totalBeds: 1200,
      availableBeds: 0,
      emergencyStatus: 'full',
      specialties: ['General Medicine', 'Surgery', 'Emergency'],
      phone: '+92-42-99213141',
      hasAmbulance: true,
      hasICU: true,
      hasEmergency: true,
      waitTime: '90+ mins'
    },
    {
      id: '4',
      name: 'Hameed Latif Hospital',
      nameUrdu: 'حمید لطیف ہسپتال',
      address: 'Garden Town, Lahore',
      distance: '1.8 km',
      rating: 4.5,
      totalBeds: 400,
      availableBeds: 28,
      emergencyStatus: 'available',
      specialties: ['Cardiology', 'Neurology', 'Emergency'],
      phone: '+92-42-35774442',
      hasAmbulance: true,
      hasICU: true,
      hasEmergency: true,
      waitTime: '20 mins'
    }
  ];

  const specialties = ['all', 'Emergency', 'Cardiology', 'Surgery', 'Oncology', 'Neurology', 'General Medicine'];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'success';
      case 'busy': return 'warning';
      case 'full': return 'destructive';
      default: return 'secondary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available': return CheckCircle;
      case 'busy': return Clock;
      case 'full': return AlertCircle;
      default: return Hospital;
    }
  };

  const filteredHospitals = hospitals.filter(hospital => {
    const matchesSearch = hospital.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         hospital.nameUrdu.includes(searchQuery);
    const matchesSpecialty = filterSpecialty === 'all' || 
                            hospital.specialties.includes(filterSpecialty);
    return matchesSearch && matchesSpecialty;
  });

  const handleGetDirections = (hospital: HospitalData) => {
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hospital.address)}`;
    window.open(mapsUrl, '_blank');
    toast({
      title: "Opening Google Maps",
      description: `Getting directions to ${hospital.name}`
    });
  };

  const handleCallHospital = (hospital: HospitalData) => {
    window.location.href = `tel:${hospital.phone}`;
    toast({
      title: "Calling Hospital",
      description: `Connecting to ${hospital.name}`
    });
  };

  const handleRequestAmbulance = (hospital: HospitalData) => {
    toast({
      title: "Redirecting to Ambulance",
      description: `Requesting ambulance to ${hospital.name}`
    });
    setTimeout(() => {
      navigate('/ambulance');
    }, 1000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Hospital Connect</h1>
        <p className="text-muted-foreground">ہسپتال کنکٹ • Find nearby medical facilities</p>
      </div>

      {/* Search and Filters */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search hospitals by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <select
                value={filterSpecialty}
                onChange={(e) => setFilterSpecialty(e.target.value)}
                className="px-3 py-2 rounded-md border border-input bg-background"
              >
                {specialties.map((specialty) => (
                  <option key={specialty} value={specialty}>
                    {specialty === 'all' ? 'All Specialties' : specialty}
                  </option>
                ))}
              </select>
              
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                onClick={() => setViewMode('list')}
              >
                List
              </Button>
              <Button
                variant={viewMode === 'map' ? 'default' : 'outline'}
                onClick={() => setViewMode('map')}
              >
                Map
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Hospital className="w-8 h-8 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold">{filteredHospitals.length}</p>
              <p className="text-sm text-muted-foreground">Nearby Hospitals</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <CheckCircle className="w-8 h-8 text-success mx-auto mb-2" />
              <p className="text-2xl font-bold">
                {filteredHospitals.filter(h => h.emergencyStatus === 'available').length}
              </p>
              <p className="text-sm text-muted-foreground">Available</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Activity className="w-8 h-8 text-warning mx-auto mb-2" />
              <p className="text-2xl font-bold">
                {filteredHospitals.reduce((sum, h) => sum + h.availableBeds, 0)}
              </p>
              <p className="text-sm text-muted-foreground">Available Beds</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Clock className="w-8 h-8 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold">18</p>
              <p className="text-sm text-muted-foreground">Avg Wait (mins)</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Hospital List */}
      {viewMode === 'list' && (
        <div className="space-y-6">
          {filteredHospitals.map((hospital) => {
            const StatusIcon = getStatusIcon(hospital.emergencyStatus);
            
            return (
              <Card key={hospital.id} className="hover:shadow-primary transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Hospital Info */}
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Hospital className="w-6 h-6 text-primary" />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="text-xl font-semibold">{hospital.name}</h3>
                              <p className="text-sm text-muted-foreground">{hospital.nameUrdu}</p>
                            </div>
                            
                            <div className="flex items-center gap-2 ml-4">
                              <StatusIcon className={`w-5 h-5 text-${getStatusColor(hospital.emergencyStatus)}`} />
                              <Badge variant={getStatusColor(hospital.emergencyStatus)}>
                                {hospital.emergencyStatus}
                              </Badge>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              <span>{hospital.address}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Navigation className="w-4 h-4" />
                              <span>{hospital.distance}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-warning fill-current" />
                              <span>{hospital.rating}</span>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap gap-2 mb-3">
                            {hospital.specialties.slice(0, 3).map((specialty) => (
                              <Badge key={specialty} variant="outline" className="text-xs">
                                {specialty}
                              </Badge>
                            ))}
                            {hospital.specialties.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{hospital.specialties.length - 3} more
                              </Badge>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">Available Beds:</span>
                              <span className={`ml-2 font-medium ${
                                hospital.availableBeds > 20 ? 'text-success' :
                                hospital.availableBeds > 0 ? 'text-warning' : 'text-destructive'
                              }`}>
                                {hospital.availableBeds}/{hospital.totalBeds}
                              </span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Wait Time:</span>
                              <span className="ml-2 font-medium">{hospital.waitTime}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {hospital.hasICU && <Badge variant="secondary" className="text-xs">ICU</Badge>}
                              {hospital.hasAmbulance && <Badge variant="secondary" className="text-xs">Ambulance</Badge>}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex flex-col gap-2 lg:min-w-[200px]">
                      <Button 
                        variant="default" 
                        className="w-full"
                        onClick={() => handleGetDirections(hospital)}
                      >
                        <Navigation className="w-4 h-4 mr-2" />
                        Get Directions
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => handleCallHospital(hospital)}
                      >
                        <Phone className="w-4 h-4 mr-2" />
                        Call Hospital
                      </Button>
                      {hospital.hasAmbulance && (
                        <Button 
                          variant="emergency" 
                          size="sm" 
                          className="w-full"
                          onClick={() => handleRequestAmbulance(hospital)}
                        >
                          <Car className="w-4 h-4 mr-2" />
                          Request Ambulance
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Map View Placeholder */}
      {viewMode === 'map' && (
        <Card>
          <CardContent className="p-8 text-center">
            <MapPin className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Interactive Map Coming Soon</h3>
            <p className="text-muted-foreground mb-6">
              The map view will show hospital locations, bed availability, and real-time status updates.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
              <div className="p-4 bg-success/10 rounded-lg">
                <CheckCircle className="w-8 h-8 text-success mx-auto mb-2" />
                <p className="text-sm font-medium">Available Hospitals</p>
                <p className="text-xs text-muted-foreground">Green markers</p>
              </div>
              <div className="p-4 bg-warning/10 rounded-lg">
                <Clock className="w-8 h-8 text-warning mx-auto mb-2" />
                <p className="text-sm font-medium">Busy Hospitals</p>
                <p className="text-xs text-muted-foreground">Yellow markers</p>
              </div>
              <div className="p-4 bg-destructive/10 rounded-lg">
                <AlertCircle className="w-8 h-8 text-destructive mx-auto mb-2" />
                <p className="text-sm font-medium">Full Hospitals</p>
                <p className="text-xs text-muted-foreground">Red markers</p>
              </div>
            </div>
            <Button variant="outline" onClick={() => setViewMode('list')} className="mt-6">
              Back to List View
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Emergency Contact */}
      <Card className="mt-8 bg-emergency/5 border-emergency/20">
        <CardContent className="pt-6">
          <div className="text-center">
            <AlertCircle className="w-8 h-8 text-emergency mx-auto mb-2" />
            <h3 className="font-semibold text-emergency mb-2">Emergency Contacts</h3>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="emergency"
                onClick={() => window.location.href = 'tel:1122'}
              >
                <Phone className="w-4 h-4 mr-2" />
                Rescue 1122
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate('/ambulance')}
              >
                <Phone className="w-4 h-4 mr-2" />
                Ambulance Direct
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HospitalConnect;