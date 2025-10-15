
import { useState, useEffect } from "react";
import { db, storage, ensureAuth } from "../firebase";
import { getFunctions, httpsCallable } from "firebase/functions";
import { collection, onSnapshot, addDoc, serverTimestamp, getDocs, query, updateDoc, doc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { toast } from "sonner";

// --- Centralized Error Logger ---
const logError = (functionName: string, error: any, hint: string) => {
  console.error(
    `[${functionName}] Backend Error:`,
    `\n  - Type: ${error.code || 'Unknown'}`,
    `\n  - Message: ${error.message}`,
    `\n  - Hint: ${hint}`,
    `\n  - Full Error:`,
    error
  );
};


// Custom hook to fetch a collection from Firestore in real-time
export const useCollection = (collectionName: string) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getCollection = async () => {
      const user = await ensureAuth(); // Ensure user is authenticated before fetching data
      const q = query(collection(db, collectionName));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        // Note: In a real multi-user app, you'd likely filter by userId here.
        setData(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        setLoading(false);
      }, (error) => {
        logError("useCollection", error, "Check Firestore rules for read permissions or network connectivity.");
        toast.error(`Error fetching ${collectionName}.`);
        setLoading(false);
      });
      return unsubscribe;
    };

    const unsubPromise = getCollection();

    return () => {
      unsubPromise.then(unsub => unsub && unsub());
    };
  }, [collectionName]);

  return { data, loading };
};

// Custom hook to check if the user is online
export const useIsOnline = () => {
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);

        return () => {
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
        };
    }, []);

    return isOnline;
};

// Submits an emergency report to Firestore or queues it if offline
export const submitEmergencyReport = async (report: any): Promise<{ success: boolean; reportId?: string; error?: string }> => {
  try {
    const user = await ensureAuth(); // Ensure user is authenticated

    const reportWithTimestamp = {
        ...report,
        location: {
            latitude: report.location?.latitude ?? null,
            longitude: report.location?.longitude ?? null,
        },
        userId: user.uid,
        timestamp: serverTimestamp(),
        status: 'submitted'
    };

    // Handle offline case
    if (!navigator.onLine) {
        const queue = JSON.parse(localStorage.getItem('madadgar-offline-queue') || '[]');
        const tempId = `offline-${Date.now()}`;
        const offlineReport = { ...reportWithTimestamp, id: tempId, timestamp: new Date().toISOString(), status: 'queued' };
        queue.push(offlineReport);
        localStorage.setItem('madadgar-offline-queue', JSON.stringify(queue));
        toast.info("You are offline. Report queued successfully.");
        return { success: true, reportId: tempId };
    }

    // Handle online case
    const docRef = await addDoc(collection(db, 'reports'), reportWithTimestamp);
    return { success: true, reportId: docRef.id };
  } catch (error: any) {
    logError("submitEmergencyReport", error, "Check Firestore rules for write permissions on the 'reports' collection.");
    return { success: false, error: error.message };
  }
};

// Syncs offline-queued reports to Firestore
export const syncOfflineReports = async (): Promise<{ synced: number; failed: number }> => {
    const queue = JSON.parse(localStorage.getItem('madadgar-offline-queue') || '[]');
    if (queue.length === 0) {
        return { synced: 0, failed: 0 };
    }

    let synced = 0;
    let failed = 0;

    for (const report of queue) {
        try {
            const { id, ...reportToSync } = report; // Exclude temporary offline ID
            const user = await ensureAuth(); // Ensure user is authenticated
            const reportWithTimestamp = { ...reportToSync, userId: user.uid, timestamp: serverTimestamp(), status: 'submitted' };
            await addDoc(collection(db, 'reports'), reportWithTimestamp);
            synced++;
        } catch (error: any) {
            logError("syncOfflineReports", error, `Failed to sync report with temp ID: ${report.id}. Check Firestore rules and network.`)
            failed++;
        }
    }

    if (failed === 0) {
        localStorage.removeItem('madadgar-offline-queue');
    }

    return { synced, failed };
};

// Instead of dispatching, this function now triggers the success notification and push message.
export const callAmbulance = async (reportId: string): Promise<{ success: boolean; ambulanceId?: string; error?: string }> => {
    if (!reportId) {
        return { success: false, error: "Report ID is required." };
    }
    try {
        const user = await ensureAuth();
        toast.success("✅ Your report has been submitted successfully. Our emergency team will review it shortly.");

        const reportData = {
            reportId,
            userId: user.uid,
            dispatchTime: serverTimestamp(),
            status: "received",
            message: "Report received — we’re working on it!"
        };
        await addDoc(collection(db, "ambulanceReports"), reportData);

        return { success: true };
    } catch (error: any) {
        logError("callAmbulance", error, "Check Firestore rules for write permissions on 'ambulanceReports' and ensure the Cloud Function 'onReportReceived' is deployed correctly.");
        toast.error("Failed to send report confirmation.");
        return { success: false, error: "Failed to trigger report notification." };
    }
};


// Transcribes voice audio using a Firebase Cloud Function
export const transcribeVoice = async (audioBlob: Blob): Promise<{ success: boolean; transcription?: string; error?: string }> => {
  if (!audioBlob) {
    return { success: false, error: "Audio blob is required for transcription." };
  }

  let storageRef: any; // Define storageRef here to be accessible in the catch block

  try {
    const user = await ensureAuth();
    const uniqueId = Date.now();
    const filePath = `voice-uploads/${user.uid}/${uniqueId}.wav`;
    storageRef = ref(storage, filePath);

    toast.info("Transcribing voice...", { description: "Your audio is being processed." });
    await uploadBytes(storageRef, audioBlob);

    const functions = getFunctions();
    const transcribeAudio = httpsCallable(functions, 'transcribeAudio');
    const result = await transcribeAudio({ filePath });
    
    const data = result.data as { transcription?: string; text?: string; };
    const transcription = data.transcription || data.text;

    if (typeof transcription !== 'string' || !transcription.trim()) {
      throw new Error(`Invalid transcription response: ${JSON.stringify(result.data)}`);
    }

    toast.success("Transcription complete!");
    deleteObject(storageRef).catch(err => logError("transcribeVoice (cleanup)", err, "Check Storage rules for delete permissions."));
    return { success: true, transcription };

  } catch (error: any) {
    logError("transcribeVoice", error, "Check Storage rules for write permissions, Cloud Function 'transcribeAudio' logs, and CORS settings.");
    toast.error("Transcription Failed", { description: "Could not process audio. Please try again." });
    if (storageRef) {
      deleteObject(storageRef).catch(err => logError("transcribeVoice (error cleanup)", err, "Check Storage rules for delete permissions."));
    }
    return { success: false, error: error.message };
  }
};

// Fetches all emergency reports from Firestore
export const getEmergencyReports = async (): Promise<{ success: boolean; reports?: any[]; error?: string }> => {
  try {
    const user = await ensureAuth();
    const q = query(collection(db, "reports"));
    const snapshot = await getDocs(q);
    const reports = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return { success: true, reports };
  } catch (error: any) {
    logError("getEmergencyReports", error, "Check Firestore rules for read permissions on the 'reports' collection.");
    toast.error("Failed to fetch reports.");
    return { success: false, error: error.message };
  }
};

// Updates the status of an emergency report
export const updateReportStatus = async (reportId: string, status: string): Promise<{ success: boolean; error?: string }> => {
  if (!reportId || !status) {
    return { success: false, error: "Report ID and status are required." };
  }
  try {
    await ensureAuth();
    const reportRef = doc(db, "reports", reportId);
    await updateDoc(reportRef, { status });
    return { success: true };
  } catch (error: any) {
    logError("updateReportStatus", error, "Check Firestore rules for update permissions on the 'reports' collection.");
    return { success: false, error: "Failed to update report status." };
  }
};

// Listens for real-time updates on ambulance dispatches
export const listenToLiveAmbulances = (callback: (ambulances: any[]) => void) => {
  const listen = async () => {
    try {
        const user = await ensureAuth();
        const q = query(collection(db, "ambulanceDispatches"));
        return onSnapshot(q, (snapshot) => {
            const ambulances = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            callback(ambulances);
        }, (error) => {
            logError("listenToLiveAmbulances (onSnapshot)", error, "Check Firestore rules for read permissions on 'ambulanceDispatches'.");
            toast.error("Failed to get live ambulance data.");
        });
    } catch(error: any) {
        logError("listenToLiveAmbulances (setup)", error, "Could not set up the listener. Check authentication.");
    }
  };

  const unsubPromise = listen();

  return () => {
    unsubPromise.then(unsub => unsub && unsub());
  };
};
