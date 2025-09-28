// Backend integration hooks - Firebase/Supabase ready
// These functions provide clean interfaces for future backend integration

export interface EmergencyReport {
  id?: string;
  type: 'medical' | 'fire' | 'crime' | 'traffic' | 'other';
  title: string;
  description: string;
  location: {
    latitude?: number;
    longitude?: number;
    address: string;
  };
  media?: {
    photos?: File[];
    videos?: File[];
    audio?: File[];
  };
  voiceTranscription?: string;
  timestamp: Date;
  status: 'submitted' | 'acknowledged' | 'dispatched' | 'resolved';
  priority: 'low' | 'medium' | 'high' | 'critical';
  isAnonymous: boolean;
  reporterInfo?: {
    name?: string;
    phone?: string;
    email?: string;
  };
}

export interface AmbulanceLocation {
  id: string;
  latitude: number;
  longitude: number;
  isAvailable: boolean;
  eta?: number; // minutes
  driverInfo: {
    name: string;
    phone: string;
    vehicle: string;
  };
}

export interface AmbulanceRequest {
  id?: string;
  patientInfo: {
    name: string;
    age?: number;
    condition: string;
    phone: string;
  };
  pickupLocation: {
    latitude: number;
    longitude: number;
    address: string;
  };
  destination?: {
    latitude: number;
    longitude: number;
    address: string;
  };
  status: 'requested' | 'assigned' | 'en_route' | 'arrived' | 'completed';
  assignedAmbulance?: string;
  timestamp: Date;
  estimatedArrival?: Date;
}

export interface Hospital {
  id: string;
  name: string;
  nameUrdu: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
    addressUrdu: string;
  };
  contact: {
    phone: string;
    emergency: string;
  };
  status: 'available' | 'full' | 'limited';
  departments: string[];
  distance?: number; // km from user
}

// Emergency Reporting Hooks
export const submitEmergencyReport = async (report: EmergencyReport): Promise<{ success: boolean; reportId?: string; error?: string }> => {
  try {
    // TODO: Integrate with Firebase/Supabase
    console.log('Submitting emergency report:', report);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // For now, store in localStorage for demo
    const reports = JSON.parse(localStorage.getItem('madadgar-reports') || '[]');
    const newReport = { ...report, id: Date.now().toString() };
    reports.push(newReport);
    localStorage.setItem('madadgar-reports', JSON.stringify(reports));
    
    return { success: true, reportId: newReport.id };
  } catch (error) {
    return { success: false, error: 'Failed to submit report' };
  }
};

export const getEmergencyReports = async (): Promise<EmergencyReport[]> => {
  try {
    // TODO: Integrate with Firebase/Supabase
    console.log('Fetching emergency reports');
    
    // For now, get from localStorage
    const reports = JSON.parse(localStorage.getItem('madadgar-reports') || '[]');
    return reports;
  } catch (error) {
    console.error('Failed to fetch reports:', error);
    return [];
  }
};

// Ambulance Service Hooks
export const requestAmbulance = async (request: AmbulanceRequest): Promise<{ success: boolean; requestId?: string; error?: string }> => {
  try {
    // TODO: Integrate with Firebase/Supabase Realtime Database
    console.log('Requesting ambulance:', request);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const requestId = Date.now().toString();
    
    // For demo, store in localStorage
    const requests = JSON.parse(localStorage.getItem('madadgar-ambulance-requests') || '[]');
    const newRequest = { ...request, id: requestId, status: 'requested' as const };
    requests.push(newRequest);
    localStorage.setItem('madadgar-ambulance-requests', JSON.stringify(requests));
    
    return { success: true, requestId };
  } catch (error) {
    return { success: false, error: 'Failed to request ambulance' };
  }
};

export const trackAmbulanceLocation = async (requestId: string): Promise<AmbulanceLocation | null> => {
  try {
    // TODO: Integrate with Firebase Realtime Database for live tracking
    console.log('Tracking ambulance for request:', requestId);
    
    // Mock ambulance location
    const mockLocation: AmbulanceLocation = {
      id: 'amb-' + requestId,
      latitude: 31.5204 + (Math.random() - 0.5) * 0.01,
      longitude: 74.3587 + (Math.random() - 0.5) * 0.01,
      isAvailable: false,
      eta: Math.floor(Math.random() * 15) + 5,
      driverInfo: {
        name: 'Muhammad Ahmed',
        phone: '+92 300 1234567',
        vehicle: 'AMB-001'
      }
    };
    
    return mockLocation;
  } catch (error) {
    console.error('Failed to track ambulance:', error);
    return null;
  }
};

export const getNearbyAmbulances = async (latitude: number, longitude: number): Promise<AmbulanceLocation[]> => {
  try {
    // TODO: Integrate with Firebase/Supabase for real ambulance locations
    console.log('Getting nearby ambulances for:', { latitude, longitude });
    
    // Mock nearby ambulances
    const mockAmbulances: AmbulanceLocation[] = [
      {
        id: 'amb-001',
        latitude: latitude + 0.005,
        longitude: longitude + 0.003,
        isAvailable: true,
        driverInfo: {
          name: 'Ali Hassan',
          phone: '+92 300 1111111',
          vehicle: 'AMB-001'
        }
      },
      {
        id: 'amb-002',
        latitude: latitude - 0.008,
        longitude: longitude + 0.007,
        isAvailable: true,
        driverInfo: {
          name: 'Fatima Sheikh',
          phone: '+92 300 2222222',
          vehicle: 'AMB-002'
        }
      }
    ];
    
    return mockAmbulances;
  } catch (error) {
    console.error('Failed to get nearby ambulances:', error);
    return [];
  }
};

// Hospital Service Hooks
export const getNearbyHospitals = async (latitude: number, longitude: number): Promise<Hospital[]> => {
  try {
    // TODO: Integrate with Firebase/Supabase
    console.log('Getting nearby hospitals for:', { latitude, longitude });
    
    // Mock hospital data
    const mockHospitals: Hospital[] = [
      {
        id: 'hosp-001',
        name: 'Services Hospital',
        nameUrdu: 'سروسز ہسپتال',
        location: {
          latitude: 31.5656,
          longitude: 74.3242,
          address: 'Ghaus-e-Azam Road, Lahore',
          addressUrdu: 'غوث اعظم روڈ، لاہور'
        },
        contact: {
          phone: '+92 42 99231391',
          emergency: '+92 42 99231392'
        },
        status: 'available',
        departments: ['Emergency', 'Cardiology', 'Surgery', 'ICU'],
        distance: 2.5
      },
      {
        id: 'hosp-002',
        name: 'Mayo Hospital',
        nameUrdu: 'میو ہسپتال',
        location: {
          latitude: 31.5925,
          longitude: 74.3095,
          address: 'Nila Gumbad Road, Lahore',
          addressUrdu: 'نیلا گنبد روڈ، لاہور'
        },
        contact: {
          phone: '+92 42 99213344',
          emergency: '+92 42 99213345'
        },
        status: 'limited',
        departments: ['Emergency', 'General Medicine', 'Pediatrics'],
        distance: 3.2
      }
    ];
    
    return mockHospitals;
  } catch (error) {
    console.error('Failed to get nearby hospitals:', error);
    return [];
  }
};

// Voice-to-Text Hook
export const transcribeVoice = async (audioFile: File): Promise<{ success: boolean; transcription?: string; error?: string }> => {
  try {
    // TODO: Integrate with Firebase Cloud Functions or Web Speech API
    console.log('Transcribing voice:', audioFile.name);
    
    // Mock transcription for demo
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockTranscriptions = [
      'There is a car accident on Main Street near the mall. Two vehicles involved.',
      'Medical emergency at home. Person is unconscious and not breathing properly.',
      'Fire in building on Commercial Avenue. Smoke coming from second floor.',
      'Suspicious activity in the park. Someone acting strangely near children area.'
    ];
    
    const transcription = mockTranscriptions[Math.floor(Math.random() * mockTranscriptions.length)];
    
    return { success: true, transcription };
  } catch (error) {
    return { success: false, error: 'Failed to transcribe voice' };
  }
};

// Offline Queue Management
export const queueOfflineReport = (report: EmergencyReport): void => {
  try {
    const queue = JSON.parse(localStorage.getItem('madadgar-offline-queue') || '[]');
    queue.push({ ...report, queued: true, queuedAt: new Date().toISOString() });
    localStorage.setItem('madadgar-offline-queue', JSON.stringify(queue));
    console.log('Report queued for offline sync');
  } catch (error) {
    console.error('Failed to queue offline report:', error);
  }
};

export const syncOfflineReports = async (): Promise<{ synced: number; failed: number }> => {
  try {
    const queue = JSON.parse(localStorage.getItem('madadgar-offline-queue') || '[]');
    
    if (queue.length === 0) {
      return { synced: 0, failed: 0 };
    }
    
    let synced = 0;
    let failed = 0;
    
    for (const report of queue) {
      const result = await submitEmergencyReport(report);
      if (result.success) {
        synced++;
      } else {
        failed++;
      }
    }
    
    // Clear successfully synced reports
    if (synced > 0) {
      localStorage.removeItem('madadgar-offline-queue');
    }
    
    console.log(`Sync complete: ${synced} synced, ${failed} failed`);
    return { synced, failed };
  } catch (error) {
    console.error('Failed to sync offline reports:', error);
    const queue = JSON.parse(localStorage.getItem('madadgar-offline-queue') || '[]');
    return { synced: 0, failed: queue.length };
  }
};

// Network status monitoring
export const isOnline = (): boolean => {
  return navigator.onLine;
};

export const onNetworkChange = (callback: (online: boolean) => void): (() => void) => {
  const handleOnline = () => callback(true);
  const handleOffline = () => callback(false);
  
  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);
  
  // Return cleanup function
  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
};