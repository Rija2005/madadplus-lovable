import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
  Car,
  Search,
  Star,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

// ✅ Firebase imports
import { db } from '@/firebase'; 
import { collection, getDocs } from 'firebase/firestore';

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

// Fallback hospital data
const fallbackHospitals: HospitalData[] = [
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

const HospitalConnect = () => {
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSpecialty, setFilterSpecialty] = useState<string>('all');
  const [hospitals, setHospitals] = useState<HospitalData[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  // ✅ Fetch hospitals from Firebase with fallback
  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "hospitals"));
        if (querySnapshot.empty) {
          setHospitals(fallbackHospitals);
        } else {
          const hospitalData = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as HospitalData[];
          setHospitals(hospitalData);
        }
      } catch (error) {
        console.error("Error fetching hospitals, using fallback data:", error);
        setHospitals(fallbackHospitals);
      }
    };
    fetchHospitals();
  }, []);

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

      {/* 🔍 Search and Filters */}
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

      {/* 📊 Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6 text-center">
            <Hospital className="w-8 h-8 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold">{filteredHospitals.length}</p>
            <p className="text-sm text-muted-foreground">Nearby Hospitals</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6 text-center">
            <CheckCircle className="w-8 h-8 text-success mx-auto mb-2" />
            <p className="text-2xl font-bold">
              {filteredHospitals.filter(h => h.emergencyStatus === 'available').length}
            </p>
            <p className="text-sm text-muted-foreground">Available</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6 text-center">
            <Activity className="w-8 h-8 text-warning mx-auto mb-2" />
            <p className="text-2xl font-bold">
              {filteredHospitals.reduce((sum, h) => sum + h.availableBeds, 0)}
            </p>
            <p className="text-sm text-muted-foreground">Available Beds</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6 text-center">
            <Clock className="w-8 h-8 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold">18</p>
            <p className="text-sm text-muted-foreground">Avg Wait (mins)</p>
          </CardContent>
        </Card>
      </div>

      {/* 🏥 Hospital List */}
      {viewMode === 'list' && (
        <div className="space-y-6">
          {filteredHospitals.map((hospital) => {
            const StatusIcon = getStatusIcon(hospital.emergencyStatus);
            return (
              <Card key={hospital.id} className="hover:shadow-primary transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Info */}
                    <div className="flex-1 flex gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Hospital className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between mb-2">
                          <div>
                            <h3 className="text-xl font-semibold">{hospital.name}</h3>
                            <p className="text-sm text-muted-foreground">{hospital.nameUrdu}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <StatusIcon className={`w-5 h-5 text-${getStatusColor(hospital.emergencyStatus)}`} />
                            <Badge variant={getStatusColor(hospital.emergencyStatus)}>
                              {hospital.emergencyStatus}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                          <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {hospital.address}</span>
                          <span className="flex items-center gap-1"><Navigation className="w-4 h-4" /> {hospital.distance}</span>
                          <span className="flex items-center gap-1"><Star className="w-4 h-4 text-warning fill-current" /> {hospital.rating}</span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Beds:</span>
                            <span className={`ml-2 font-medium ${
                              hospital.availableBeds > 20 ? 'text-success' :
                              hospital.availableBeds > 0 ? 'text-warning' : 'text-destructive'
                            }`}>
                              {hospital.availableBeds}/{hospital.totalBeds}
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Wait:</span>
                            <span className="ml-2 font-medium">{hospital.waitTime}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 lg:min-w-[200px]">
                      <Button onClick={() => handleGetDirections(hospital)}>
                        <Navigation className="w-4 h-4 mr-2" /> Get Directions
                      </Button>
                      <Button variant="outline" onClick={() => handleCallHospital(hospital)}>
                        <Phone className="w-4 h-4 mr-2" /> Call Hospital
                      </Button>
                      {hospital.hasAmbulance && (
                        <Button variant="emergency" size="sm" onClick={() => handleRequestAmbulance(hospital)}>
                          <Car className="w-4 h-4 mr-2" /> Request Ambulance
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

      {/* 🚨 Emergency Contact */}
      <Card className="mt-8 bg-emergency/5 border-emergency/20">
        <CardContent className="pt-6 text-center">
          <AlertCircle className="w-8 h-8 text-emergency mx-auto mb-2" />
          <h3 className="font-semibold text-emergency mb-2">Emergency Contacts</h3>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="emergency" onClick={() => window.location.href = 'tel:1122'}>
              <Phone className="w-4 h-4 mr-2" /> Rescue 1122
            </Button>
            <Button variant="outline" onClick={() => navigate('/ambulance')}>
              <Phone className="w-4 h-4 mr-2" /> Ambulance Direct
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HospitalConnect;
