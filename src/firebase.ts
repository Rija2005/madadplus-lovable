
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInAnonymously, User } from "firebase/auth";
import { getFirestore, enableMultiTabIndexedDbPersistence } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getMessaging, onMessage } from "firebase/messaging";
import { toast } from "@/components/ui/use-toast";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const messaging = getMessaging(app);
const googleAuthProvider = new GoogleAuthProvider();

let authInitialized = false;

// --- Centralized Authentication Check ---
// This promise resolves when authentication is confirmed.
export const ensureAuth = (): Promise<User> => {
  return new Promise((resolve) => {
    if (authInitialized && auth.currentUser) {
      return resolve(auth.currentUser);
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      authInitialized = true;
      if (user) {
        resolve(user);
        unsubscribe();
      } else {
        signInAnonymously(auth)
          .then((userCredential) => {
            resolve(userCredential.user);
            unsubscribe();
          })
          .catch((error) => {
            console.error("Anonymous sign-in failed:", error);
            toast({
              title: "Authentication Error",
              description: "Could not connect to the service. Please refresh the page.",
              variant: "destructive",
            });
            // Note: In a real-world app, you might want to reject the promise here.
            // However, for this use case, we'll keep retrying on next call.
          });
      }
    });
  });
};


// Enable Firestore offline persistence
enableMultiTabIndexedDbPersistence(db).catch((err) => {
  if (err.code === "failed-precondition") {
    // This is a common warning when multiple tabs are open, not a critical error.
  } else if (err.code === "unimplemented") {
    console.warn(
      "The current browser does not support all of the features required to enable persistence."
    );
  }
});

// Handle incoming messages while the app is in the foreground
onMessage(messaging, (payload) => {
  console.log("Foreground message received. ", payload);
  toast({
    title: payload.notification?.title || "New Notification",
    description: payload.notification?.body,
  });
});

export { app, auth, db, storage, messaging, googleAuthProvider };
