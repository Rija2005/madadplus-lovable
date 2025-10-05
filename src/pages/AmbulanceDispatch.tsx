// // ✅ AmbulanceDispatch.tsx
// import { useState, useEffect } from 'react';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Textarea } from '@/components/ui/textarea';
// import { 
//   MapPin, 
//   Clock, 
//   Phone, 
//   Star,
//   Navigation,
//   Heart,
//   Ambulance,
//   AlertCircle,
//   CheckCircle
// } from 'lucide-react';
// import { useToast } from '@/hooks/use-toast';
// import { db, auth } from '@/firebase';
// import { collection, onSnapshot, addDoc, serverTimestamp, getDoc, doc } from 'firebase/firestore';
// import { onAuthStateChanged, User } from 'firebase/auth';

// // --- Interfaces ---
// interface AmbulanceData {
//   id: string;
//   driverName: string;
//   vehicleNumber: string;
//   rating: number;
//   eta: string;
//   distance: string;
//   equipment: string[];
//   status: 'available' | 'busy' | 'offline';
//   location: { lat: number; lng: number };
// }

// interface DriverData {
//   id: string;
//   name: string;
//   phone: string;
//   vehicleNumber: string;
// }

// // --- Local fallback ambulances ---
// const fallbackAmbulances: AmbulanceData[] = [
//   {
//     id: '1',
//     driverName: 'Ahmed Khan',
//     vehicleNumber: 'LHR-1122-A',
//     rating: 4.8,
//     eta: '5 mins',
//     distance: '1.2 km',
//     equipment: ['Oxygen', 'Defibrillator', 'ICU'],
//     status: 'available',
//     location: { lat: 31.5497, lng: 74.3436 }
//   },
//   {
//     id: '2',
//     driverName: 'Muhammad Ali',
//     vehicleNumber: 'LHR-1122-B',
//     rating: 4.9,
//     eta: '8 mins',
//     distance: '2.1 km',
//     equipment: ['Oxygen', 'Basic Aid'],
//     status: 'available',
//     location: { lat: 31.5204, lng: 74.3587 }
//   },
//   {
//     id: '3',
//     driverName: 'Hassan Ahmed',
//     vehicleNumber: 'LHR-1122-C',
//     rating: 4.7,
//     eta: '12 mins',
//     distance: '3.8 km',
//     equipment: ['Oxygen', 'Defibrillator', 'ICU', 'Ventilator'],
//     status: 'available',
//     location: { lat: 31.5825, lng: 74.3294 }
//   }
// ];

// const emergencyTypes = [
//   'Medical Emergency',
//   'Accident',
//   'Heart Attack',
//   'Stroke',
//   'Pregnancy/Birth',
//   'Breathing Problem',
//   'Other'
// ];

// export default function AmbulanceDispatch() {
//   const [currentStep, setCurrentStep] = useState<'request' | 'selecting' | 'booking' | 'tracking'>('request');
//   const [ambulances, setAmbulances] = useState<AmbulanceData[]>(fallbackAmbulances);
//   const [selectedAmbulance, setSelectedAmbulance] = useState<AmbulanceData | null>(null);
//   const [userLocation, setUserLocation] = useState<string>('');
//   const [emergencyType, setEmergencyType] = useState<string>('');
//   const [description, setDescription] = useState<string>('');
//   const [user, setUser] = useState<User | null>(null);
//   const [driver, setDriver] = useState<DriverData | null>(null);
//   const { toast } = useToast();

//   // ✅ Get logged-in user
//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
//     return () => unsubscribe();
//   }, []);

//   // ✅ Auto-get GPS location
//   useEffect(() => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (pos) => {
//           const { latitude, longitude } = pos.coords;
//           setUserLocation(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
//         },
//         () => toast({ title: "Location Error", description: "Could not retrieve location.", variant: "destructive" })
//       );
//     }
//   }, [toast]);

//   // ✅ Fetch live ambulances (fallback if Firestore fails)
//   useEffect(() => {
//     const q = collection(db, "ambulances");
//     const unsubscribe = onSnapshot(
//       q,
//       (snap) => {
//         if (!snap.empty) {
//           const liveAmbulances = snap.docs.map(d => ({ id: d.id, ...d.data() })) as AmbulanceData[];
//           setAmbulances(liveAmbulances.filter(a => a.status === 'available'));
//         } else {
//           // If Firestore is reachable but has no data, use fallback
//           setAmbulances(fallbackAmbulances);
//         }
//       },
//       (err) => {
//         console.error("Firestore live error:", err);
//         // If Firestore is unreachable, use fallback and notify user
//         setAmbulances(fallbackAmbulances);
//         toast({ title: "Live Data Error", description: "Using fallback ambulance list.", variant: "destructive" });
//       }
//     );
//     return () => unsubscribe();
//   }, [toast]);

//   // ✅ Handle request step
//   const handleRequestAmbulance = async () => {
//     if (emergencyType && description && user) {
//       try {
//         await addDoc(collection(db, "ambulanceReports"), {
//           userId: user.uid,
//           emergencyType,
//           description,
//           location: userLocation,
//           status: "pending",
//           createdAt: serverTimestamp(),
//         });
//         setCurrentStep('selecting');
//       } catch (error) {
//         console.error("Error submitting report:", error);
//         toast({ title: "Report Failed", description: "Your report was saved locally and will be submitted when the network is back.", variant: "destructive" });
//         // With offline persistence, this will be queued, so we can optimistically move to the next step
//         setCurrentStep('selecting');
//       }
//     } else {
//       toast({ title: "Missing Info", description: "Please fill all fields.", variant: "destructive" });
//     }
//   };

//   // ✅ Select ambulance
//   const handleSelectAmbulance = (ambulance: AmbulanceData) => {
//     setSelectedAmbulance(ambulance);
//     setCurrentStep('booking');
//   };

//   // ✅ Confirm booking
//   const handleConfirmBooking = async () => {
//     if (!selectedAmbulance || !user) return;

//     try {
//       await addDoc(collection(db, "ambulanceBookings"), {
//         userId: user.uid,
//         ambulanceId: selectedAmbulance.id,
//         driverName: selectedAmbulance.driverName,
//         vehicleNumber: selectedAmbulance.vehicleNumber,
//         status: "confirmed",
//         createdAt: serverTimestamp(),
//       });

//       const driverDoc = await getDoc(doc(db, "drivers", selectedAmbulance.id));
//       if (driverDoc.exists()) {
//         setDriver({ id: driverDoc.id, ...driverDoc.data() } as DriverData);
//       } else {
//         setDriver({
//           id: selectedAmbulance.id,
//           name: selectedAmbulance.driverName,
//           vehicleNumber: selectedAmbulance.vehicleNumber,
//           phone: "1122",
//         });
//         toast({ title: "Driver Info Missing", description: "Using fallback phone number (1122).", variant: "destructive" });
//       }

//       setCurrentStep('tracking');
//     } catch (error) {
//       console.error("Booking error:", error);
//       toast({ title: "Booking Failed", description: "Your booking was saved locally and will be submitted when the network is back.", variant: "destructive" });
//       // Optimistically move to the next step
//       setCurrentStep('tracking');
//     }
//   };

//   // ✅ Call driver
//   const handleCallDriver = () => {
//     if (driver && driver.phone) {
//       toast({ title: "Calling Driver", description: `Connecting to ${driver.name}...` });
//       window.location.href = `tel:${driver.phone}`;
//     } else {
//       toast({ title: "No Phone Found", description: "Driver phone unavailable.", variant: "destructive" });
//     }
//   };

//   // --- UI ---
//   return (
//     <div className="max-w-4xl mx-auto px-4 py-8">
//       <div className="text-center mb-8">
//         <h1 className="text-3xl font-bold mb-2">Ambulance Dispatch</h1>
//         <p className="text-muted-foreground">ایمبولینس ڈسپیچ • Quick medical transport booking</p>
//       </div>

//       {currentStep === 'request' && (
//         <Card className="max-w-2xl mx-auto">
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <Heart className="w-6 h-6 text-emergency" />
//               Emergency Details
//             </CardTitle>
//             <CardDescription>Provide details about the emergency</CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div>
//               <Label htmlFor="type">Emergency Type</Label>
//               <select
//                 id="type"
//                 className="w-full border px-3 py-2 rounded-md mt-1"
//                 value={emergencyType}
//                 onChange={(e) => setEmergencyType(e.target.value)}
//               >
//                 <option value="">Select type</option>
//                 {emergencyTypes.map((type) => (
//                   <option key={type} value={type}>{type}</option>
//                 ))}
//               </select>
//             </div>

//             <Textarea
//               placeholder="Brief description..."
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//             />

//             <Input value={userLocation} readOnly />

//             <Button 
//               onClick={handleRequestAmbulance}
//               disabled={!emergencyType || !description || !user}
//               className="w-full"
//             >
//               <Ambulance className="w-4 h-4 mr-2" /> Find Ambulances
//             </Button>
//           </CardContent>
//         </Card>
//       )}

//       {currentStep === 'selecting' && (
//         <div className="grid gap-4">
//           {ambulances.map((amb) => (
//             <Card 
//               key={amb.id} 
//               onClick={() => handleSelectAmbulance(amb)} 
//               className="cursor-pointer hover:bg-muted/50"
//             >
//               <CardContent className="p-4 flex justify-between items-center">
//                 <div>
//                   <h3 className="font-semibold flex items-center gap-2"><Ambulance className="w-4 h-4"/> {amb.driverName}</h3>
//                   <p className="text-sm text-muted-foreground">{amb.vehicleNumber}</p>
//                   <p className="text-xs text-muted-foreground">Equip: {amb.equipment.join(', ')}</p>
//                 </div>
//                 <div className="text-right">
//                   <p className="font-semibold text-success">{amb.eta}</p>
//                   <p className="flex items-center justify-end text-sm"><Star className="w-4 h-4 text-yellow-500 mr-1"/>{amb.rating}</p>
//                   <p className="text-xs text-muted-foreground">{amb.distance}</p>
//                 </div>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       )}

//       {currentStep === 'booking' && selectedAmbulance && (
//         <Card className="max-w-2xl mx-auto">
//           <CardHeader><CardTitle>Confirm Booking</CardTitle></CardHeader>
//           <CardContent className="space-y-3">
//             <p><b>Driver:</b> {selectedAmbulance.driverName}</p>
//             <p><b>Vehicle:</b> {selectedAmbulance.vehicleNumber}</p>
//             <p><b>ETA:</b> {selectedAmbulance.eta}</p>
//             <Button className="w-full" onClick={handleConfirmBooking}>Confirm Booking</Button>
//           </CardContent>
//         </Card>
//       )}

//       {currentStep === 'tracking' && selectedAmbulance && (
//         <Card className="max-w-2xl mx-auto">
//           <CardHeader><CardTitle>Ambulance Confirmed!</CardTitle></CardHeader>
//           <CardContent className="space-y-3">
//             <p>Your ambulance is on the way 🚑</p>
//             <p><b>Driver:</b> {driver?.name || selectedAmbulance.driverName}</p>
//             <p><b>Vehicle:</b> {driver?.vehicleNumber || selectedAmbulance.vehicleNumber}</p>
//             <Button className="w-full" onClick={handleCallDriver}>
//               <Phone className="w-4 h-4 mr-2" /> Call Driver
//             </Button>
//           </CardContent>
//         </Card>
//       )}
//     </div>
//   );
// }
// src/pages/AmbulanceDispatch.tsx
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
  Ambulance,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { db, auth } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { onAuthStateChanged, User } from 'firebase/auth';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

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

const mapContainerStyle = {
  width: '100%',
  height: '300px',
};

const AmbulanceDispatch = () => {
  const [currentStep, setCurrentStep] = useState<'request' | 'selecting' | 'booking' | 'tracking'>('request');
  const [selectedAmbulance, setSelectedAmbulance] = useState<AmbulanceData | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [emergencyType, setEmergencyType] = useState('');
  const [description, setDescription] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Google Maps Loader
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY!,
  });

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
      location: { lat: 31.5497, lng: 74.3436 },
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
      location: { lat: 31.5204, lng: 74.3587 },
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
      location: { lat: 31.5825, lng: 74.3294 },
    },
  ];

  const emergencyTypes = [
    'Medical Emergency',
    'Accident',
    'Heart Attack',
    'Stroke',
    'Pregnancy/Birth',
    'Breathing Problem',
    'Other',
  ];

  // Get current user
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsub();
  }, []);

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => setErrorMessage('⚠️ Location access denied.')
      );
    }
  }, []);

  const handleRequestAmbulance = () => {
    if (emergencyType && description) {
      setCurrentStep('selecting');
      setErrorMessage(null);
    } else {
      setErrorMessage('Please fill all required fields.');
    }
  };

  const handleSelectAmbulance = (ambulance: AmbulanceData) => {
    setSelectedAmbulance(ambulance);
    setCurrentStep('booking');
  };

  const handleConfirmBooking = async () => {
    try {
      if (!user) throw new Error('You must be signed in to confirm a booking.');
      if (!selectedAmbulance || !userLocation) throw new Error('Missing data for booking.');

      await addDoc(collection(db, 'ambulanceBookings'), {
        userId: user.uid,
        driverName: selectedAmbulance.driverName,
        vehicleNumber: selectedAmbulance.vehicleNumber,
        emergencyType,
        description,
        userLocation,
        driverLocation: selectedAmbulance.location,
        status: 'confirmed',
        createdAt: serverTimestamp(),
      });

      setErrorMessage(null);
      setCurrentStep('tracking');
    } catch (err: any) {
      console.error('Error confirming booking:', err);
      setErrorMessage(`Error confirming booking: ${err.message}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Ambulance Dispatch</h1>
        <p className="text-muted-foreground">ایمبولینس ڈسپیچ • Quick medical transport booking</p>
      </div>

      {errorMessage && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">{errorMessage}</div>
      )}

      {/* Step 1: Request Form */}
      {currentStep === 'request' && (
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Emergency Details</CardTitle>
            <CardDescription>Provide information about your emergency</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label>Current Location</Label>
              <Input
                value={
                  userLocation
                    ? `${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)}`
                    : 'Fetching location...'
                }
                disabled
              />
            </div>

            <div>
              <Label>Emergency Type</Label>
              <select
                className="w-full mt-1 rounded-md border px-3 py-2"
                value={emergencyType}
                onChange={(e) => setEmergencyType(e.target.value)}
              >
                <option value="">Select emergency type</option>
                {emergencyTypes.map((type) => (
                  <option key={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <Label>Description</Label>
              <Textarea
                placeholder="Describe the situation..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <Button onClick={handleRequestAmbulance} className="w-full" size="lg" variant="emergency">
              <Ambulance className="w-5 h-5 mr-2" />
              Find Available Ambulances
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Ambulance Selection */}
      {currentStep === 'selecting' && (
        <div className="grid gap-4">
          {availableAmbulances.map((a) => (
            <Card
              key={a.id}
              className="cursor-pointer hover:shadow-lg transition"
              onClick={() => handleSelectAmbulance(a)}
            >
              <CardContent className="p-6 flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">{a.driverName}</h3>
                  <p className="text-sm text-muted-foreground">{a.vehicleNumber}</p>
                  <div className="flex gap-2 mt-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span>{a.rating}</span>
                    <Badge>{a.status}</Badge>
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-success">{a.eta}</p>
                  <p className="text-sm">{a.distance}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Step 3: Booking Confirmation */}
      {currentStep === 'booking' && selectedAmbulance && (
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Confirm Booking</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold">{selectedAmbulance.driverName}</h3>
                <p className="text-sm text-muted-foreground">{selectedAmbulance.vehicleNumber}</p>
              </div>
              <Badge>{selectedAmbulance.status}</Badge>
            </div>

            <Button onClick={handleConfirmBooking} className="w-full" variant="emergency">
              Confirm Booking
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Tracking */}
      {currentStep === 'tracking' && selectedAmbulance && (
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>Track Ambulance</CardTitle>
            <CardDescription>Your ambulance is en route</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoaded && userLocation && (
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={userLocation}
                zoom={13}
              >
                <Marker position={userLocation} label="You" />
                <Marker position={selectedAmbulance.location} label="Ambulance" />
              </GoogleMap>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AmbulanceDispatch;
