import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  MapPin, 
  Clock, 
  Phone, 
  Star,
  Navigation,
  Heart,
  User,
  Ambulance,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

interface AmbulanceData {
  id: string;
  driverName: string;
  vehicleNumber: string;
  rating: number;
  eta: string;
  distance: string;
  equipment: string[];
  status: 'available' | 'busy' | 'offline';
  location: { lat: number; lng: number };
}

const AmbulanceDispatch = () => {
  const [currentStep, setCurrentStep] = useState<'request' | 'selecting' | 'booking' | 'tracking'>('request');
  const [selectedAmbulance, setSelectedAmbulance] = useState<AmbulanceData | null>(null);
  const [userLocation, setUserLocation] = useState<string>('');
  const [emergencyType, setEmergencyType] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  // Mock ambulance data
  const availableAmbulances: AmbulanceData[] = [
    {
      id: '1',
      driverName: 'Ahmed Khan',
      vehicleNumber: 'LHR-1122-A',
      rating: 4.8,
      eta: '5 mins',
      distance: '1.2 km',
      equipment: ['Oxygen', 'Defibrillator', 'ICU'],
      status: 'available',
      location: { lat: 31.5497, lng: 74.3436 }
    },
    {
      id: '2',
      driverName: 'Muhammad Ali',
      vehicleNumber: 'LHR-1122-B',
      rating: 4.9,
      eta: '8 mins',
      distance: '2.1 km',
      equipment: ['Oxygen', 'Basic Aid'],
      status: 'available',
      location: { lat: 31.5204, lng: 74.3587 }
    },
    {
      id: '3',
      driverName: 'Hassan Ahmed',
      vehicleNumber: 'LHR-1122-C',
      rating: 4.7,
      eta: '12 mins',
      distance: '3.8 km',
      equipment: ['Oxygen', 'Defibrillator', 'ICU', 'Ventilator'],
      status: 'available',
      location: { lat: 31.5825, lng: 74.3294 }
    }
  ];

  const emergencyTypes = [
    'Medical Emergency',
    'Accident',
    'Heart Attack',
    'Stroke',
    'Pregnancy/Birth',
    'Breathing Problem',
    'Other'
  ];

  useEffect(() => {
    // Simulate getting user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation(`${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`);
        },
        () => {
          setUserLocation('Location access denied');
        }
      );
    }
  }, []);

  const handleRequestAmbulance = () => {
    if (emergencyType && description) {
      setCurrentStep('selecting');
    }
  };

  const handleSelectAmbulance = (ambulance: AmbulanceData) => {
    setSelectedAmbulance(ambulance);
    setCurrentStep('booking');
  };

  const handleConfirmBooking = () => {
    setCurrentStep('tracking');
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[
        { step: 'request', label: 'Request', icon: Heart },
        { step: 'selecting', label: 'Select', icon: Ambulance },
        { step: 'booking', label: 'Confirm', icon: CheckCircle },
        { step: 'tracking', label: 'Track', icon: Navigation }
      ].map((item, index) => (
        <div key={item.step} className="flex items-center">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            currentStep === item.step ? 'bg-primary text-primary-foreground' :
            ['selecting', 'booking', 'tracking'].indexOf(currentStep) > index ? 'bg-success text-success-foreground' :
            'bg-muted text-muted-foreground'
          }`}>
            <item.icon className="w-5 h-5" />
          </div>
          <span className="ml-2 text-sm font-medium">{item.label}</span>
          {index < 3 && (
            <div className={`w-8 h-0.5 mx-4 ${
              ['selecting', 'booking', 'tracking'].indexOf(currentStep) > index ? 'bg-success' : 'bg-muted'
            }`} />
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Ambulance Dispatch</h1>
        <p className="text-muted-foreground">ایمبولینس ڈسپیچ • Quick medical transport booking</p>
      </div>

      {renderStepIndicator()}

      {/* Step 1: Request Form */}
      {currentStep === 'request' && (
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-6 h-6 text-emergency" />
              Emergency Details
            </CardTitle>
            <CardDescription>
              Please provide information about the emergency
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="location">Current Location</Label>
              <div className="flex items-center gap-2 mt-1">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <Input
                  id="location"
                  value={userLocation}
                  onChange={(e) => setUserLocation(e.target.value)}
                  placeholder="Enter your location or use GPS"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="emergency-type">Emergency Type</Label>
              <select
                id="emergency-type"
                className="w-full mt-1 rounded-md border border-input bg-background px-3 py-2"
                value={emergencyType}
                onChange={(e) => setEmergencyType(e.target.value)}
              >
                <option value="">Select emergency type</option>
                {emergencyTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Brief description of the emergency..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1"
              />
            </div>

            <div className="flex items-center gap-2 p-4 bg-emergency/10 rounded-lg">
              <AlertCircle className="w-5 h-5 text-emergency" />
              <p className="text-sm text-emergency">
                For life-threatening emergencies, call 1122 directly
              </p>
            </div>

            <Button 
              onClick={handleRequestAmbulance}
              className="w-full" 
              size="lg"
              variant="emergency"
              disabled={!emergencyType || !description}
            >
              <Ambulance className="w-5 h-5 mr-2" />
              Find Available Ambulances
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Ambulance Selection */}
      {currentStep === 'selecting' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Available Ambulances Near You</CardTitle>
              <CardDescription>Select the most suitable ambulance for your emergency</CardDescription>
            </CardHeader>
          </Card>

          <div className="grid gap-4">
            {availableAmbulances.map((ambulance) => (
              <Card 
                key={ambulance.id}
                className="cursor-pointer hover:shadow-primary transition-all duration-300"
                onClick={() => handleSelectAmbulance(ambulance)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <Ambulance className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{ambulance.driverName}</h3>
                        <p className="text-sm text-muted-foreground">{ambulance.vehicleNumber}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-warning fill-current" />
                            <span className="text-sm font-medium">{ambulance.rating}</span>
                          </div>
                          <Badge variant="secondary">{ambulance.status}</Badge>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className="font-semibold text-success">{ambulance.eta}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Navigation className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{ambulance.distance}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm text-muted-foreground mb-2">Available Equipment:</p>
                    <div className="flex flex-wrap gap-2">
                      {ambulance.equipment.map((item) => (
                        <Badge key={item} variant="outline" className="text-xs">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: Booking Confirmation */}
      {currentStep === 'booking' && selectedAmbulance && (
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Confirm Booking</CardTitle>
            <CardDescription>Review your ambulance booking details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Ambulance className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">{selectedAmbulance.driverName}</h3>
                  <p className="text-sm text-muted-foreground">{selectedAmbulance.vehicleNumber}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">ETA:</span>
                  <span className="ml-2 font-medium text-success">{selectedAmbulance.eta}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Distance:</span>
                  <span className="ml-2 font-medium">{selectedAmbulance.distance}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Rating:</span>
                  <span className="ml-2 font-medium">{selectedAmbulance.rating} ⭐</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Status:</span>
                  <Badge variant="secondary" className="ml-2">{selectedAmbulance.status}</Badge>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium">Emergency Type:</span>
                <span className="ml-2 text-sm">{emergencyType}</span>
              </div>
              <div>
                <span className="text-sm font-medium">Location:</span>
                <span className="ml-2 text-sm">{userLocation}</span>
              </div>
              <div>
                <span className="text-sm font-medium">Description:</span>
                <p className="mt-1 text-sm text-muted-foreground">{description}</p>
              </div>
            </div>

            <div className="flex gap-4">
              <Button variant="outline" onClick={() => setCurrentStep('selecting')} className="flex-1">
                Back to Selection
              </Button>
              <Button variant="emergency" onClick={handleConfirmBooking} className="flex-1">
                <CheckCircle className="w-4 h-4 mr-2" />
                Confirm Booking
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Tracking */}
      {currentStep === 'tracking' && selectedAmbulance && (
        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-success/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-success" />
                </div>
                <h2 className="text-2xl font-bold text-success">Ambulance Confirmed!</h2>
                <p className="text-muted-foreground">Your ambulance is on the way</p>
              </div>

              <div className="bg-primary/5 p-6 rounded-lg mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">{selectedAmbulance.driverName}</h3>
                    <p className="text-muted-foreground">{selectedAmbulance.vehicleNumber}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-success">{selectedAmbulance.eta}</p>
                    <p className="text-sm text-muted-foreground">Estimated arrival</p>
                  </div>
                </div>

                <div className="w-full bg-muted rounded-full h-2 mb-4">
                  <div className="bg-success h-2 rounded-full" style={{ width: '65%' }}></div>
                </div>

                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Dispatched</span>
                  <span>En Route</span>
                  <span>Arriving</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="flex-1">
                  <Phone className="w-4 h-4 mr-2" />
                  Call Driver
                </Button>
                <Button variant="outline" className="flex-1">
                  <MapPin className="w-4 h-4 mr-2" />
                  Track Location
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>What to Expect</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-medium text-primary">1</span>
                  </div>
                  <p>The ambulance crew will call you when they're 2 minutes away</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-medium text-primary">2</span>
                  </div>
                  <p>Be ready with any relevant medical documents or medications</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-medium text-primary">3</span>
                  </div>
                  <p>The paramedic will assess the situation and provide initial care</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AmbulanceDispatch;