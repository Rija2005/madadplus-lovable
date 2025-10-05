import { db, auth } from '@/firebase';
import {
  addDoc,
  collection,
  serverTimestamp,
  doc,
  updateDoc,
  getDocs,
  query,
  onSnapshot,
} from 'firebase/firestore';

// ---------------------------------
// Types
// ---------------------------------

export interface EmergencyReport {
  id: string;
  userId: string;
  title: string;
  description: string;
  location: { 
    address?: string;
    latitude?: number;
    longitude?: number;
  }; 
  timestamp: any; // Firestore Timestamp
  status: 'submitted' | 'acknowledged' | 'resolved';
  type: string;
  priority: string;
  isAnonymous: boolean;
}

export type ReportForSubmission = Omit<EmergencyReport, 'id' | 'timestamp' | 'status' | 'userId'>;

// ---------------------------------
// Core Firestore Functions
// ---------------------------------

/**
 * Submits a new emergency report to Firestore.
 * Attaches the current user's ID to the report.
 */
export const submitEmergencyReport = async (reportData: ReportForSubmission): Promise<{ success: boolean; reportId?: string; error?: string }> => {
  const user = auth.currentUser;
  if (!user) {
    return { success: false, error: "Authentication required." };
  }

  try {
    const docRef = await addDoc(collection(db, 'reports'), {
      ...reportData,
      userId: user.uid,
      timestamp: serverTimestamp(),
      status: 'submitted',
    });
    return { success: true, reportId: docRef.id };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
};

/**
 * Creates an ambulance request linked to an existing report.
 * This simulates dispatching and returns a mock ambulance ID.
 */
export const callAmbulance = async (reportId: string): Promise<{ success: boolean; ambulanceId?: string; error?: string }> => {
    const user = auth.currentUser;
    if (!user) {
        return { success: false, error: "Authentication required." };
    }

    try {
        const ambulanceRef = await addDoc(collection(db, 'ambulances'), {
            reportId,
            userId: user.uid,
            status: 'dispatched',
            dispatchTime: serverTimestamp(),
            location: { latitude: 0, longitude: 0 } // Mock initial location
        });
        
        // Mark the report as acknowledged
        await updateDoc(doc(db, 'reports', reportId), {
            status: 'acknowledged'
        });

        return { success: true, ambulanceId: ambulanceRef.id };

    } catch (error) {
        return { success: false, error: (error as Error).message };
    }
};

/**
 * Updates an ambulance's location in Firestore.
 * In a real app, this would be called by the driver's device.
 */
export const updateAmbulanceLocation = async (ambulanceId: string, location: { latitude: number; longitude: number }): Promise<{ success: boolean; error?: string }> => {
    try {
        await updateDoc(doc(db, 'ambulances', ambulanceId), { location });
        return { success: true };
    } catch (error) {
        return { success: false, error: (error as Error).message };
    }
};

/**
 * Simulates transcribing an audio file.
 * Returns a placeholder string.
 */
export const transcribeVoice = async (audioBlob: Blob): Promise<string> => {
  // In a real implementation, this would call a cloud service (e.g., Google Speech-to-Text)
  console.log("Transcribing audio blob:", audioBlob);
  return new Promise(resolve => setTimeout(() => resolve("The patient is unconscious and bleeding from the head."), 1500));
};

/**
 * Checks if the browser is currently online.
 */
export const isOnline = () => navigator.onLine;

/**
 * Listens for network status changes and calls a callback.
 * Returns a function to remove the event listeners.
 */
export const onNetworkChange = (callback: (online: boolean) => void) => {
  const handleOnline = () => callback(true);
  const handleOffline = () => callback(false);

  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);

  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
};


// ---------------------------------
// Admin & Real-time Functions
// ---------------------------------

export const getEmergencyReports = async (): Promise<EmergencyReport[]> => {
    const q = query(collection(db, "reports"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as EmergencyReport));
};

export const updateReportStatus = async (reportId: string, status: EmergencyReport['status']): Promise<boolean> => {
    try {
        await updateDoc(doc(db, "reports", reportId), { status });
        return true;
    } catch {
        return false;
    }
};
/**
 * Syncs any reports stored locally while offline.
 * Currently acts as a placeholder until offline storage is implemented.
 */
export const syncOfflineReports = async (): Promise<{ success: boolean; message: string }> => {
  try {
    console.log("🔄 Syncing offline reports...");
    // TODO: In future, this would read from IndexedDB or localStorage
    // and re-upload pending reports to Firestore.

    await new Promise((resolve) => setTimeout(resolve, 1000)); // simulate delay
    return { success: true, message: "No offline reports to sync (demo mode)." };
  } catch (error) {
    console.error("Error syncing offline reports:", error);
    return { success: false, message: (error as Error).message };
  }
};


export const listenToLiveAmbulances = (callback: (ambulances: any[]) => void) => {
  const q = query(collection(db, "ambulances"));
  return onSnapshot(q, (snapshot) => {
    const ambulances = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(ambulances);
  });
};
