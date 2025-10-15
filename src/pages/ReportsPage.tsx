import { useState, useEffect, useRef } from "react";
import { db, storage, auth } from "@/firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  where,
  serverTimestamp
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { onAuthStateChanged, User } from "firebase/auth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

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
  User as UserIcon,
  Calendar,
} from "lucide-react";

// Read API key from environment variables
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

interface Report {
  id: string;
  type: string;
  title: string;
  description: string;
  location: string;
  timestamp: Date;
  status: string;
  isAnonymous: boolean;
  hasEvidence: boolean;
  evidenceUrls?: string[];
}

const ReportsPage = () => {
  const [activeTab, setActiveTab] = useState<"new" | "history">("new");
  const [reportType, setReportType] = useState<string>("");
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [evidenceFiles, setEvidenceFiles] = useState<File[]>([]);
  const [userReports, setUserReports] = useState<Report[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();
  const locationFetched = useRef(false);

  // ✅ Get current user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // ✅ Fetch user-specific reports
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "reports"),
      where("userId", "==", user.uid),
      orderBy("timestamp", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const reports: Report[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate(),
      })) as Report[];
      setUserReports(reports);
    });

    return () => unsubscribe();
  }, [user]);

  const fetchAddress = async (latitude: number, longitude: number) => {
    if (!GOOGLE_MAPS_API_KEY) {
      console.error("Google Maps API key is missing. Please set VITE_GOOGLE_MAPS_API_KEY in your .env file.");
      toast({
        title: "Configuration Error",
        description: "Google Maps API key is not configured.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_API_KEY}`
      );
      if (!response.ok) throw new Error("Network response was not ok");

      const data = await response.json();
      if (data.status === "OK" && data.results[0]) {
        setLocation(data.results[0].formatted_address);
      } else {
        throw new Error(`Geocoding failed: ${data.status} - ${data.error_message || 'No results found.'}`);
      }
    } catch (error) {
      console.error("Geocoding API Error:", error);
      toast({
        title: "Unable to fetch address",
        description: "Please check your API key and internet connection.",
        variant: "destructive",
      });
    }
  };

  const handleLocationClick = () => {
    if (location || locationFetched.current) return;

    locationFetched.current = true;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          fetchAddress(pos.coords.latitude, pos.coords.longitude);
        },
        () => {
          toast({
            title: "Location access denied",
            description: "Please enable GPS.",
            variant: "destructive",
          });
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    }
  };

  useEffect(() => {
    if (activeTab === 'new') {
        handleLocationClick();
    }
  }, [activeTab]);


  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      setEvidenceFiles([...evidenceFiles, ...newFiles]);
    }
  };

  const handleSubmitReport = async () => {
    if (!user) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to submit a report.",
        variant: "destructive",
      });
      return;
    }

    try {
      const evidenceUrls: string[] = [];

      for (const file of evidenceFiles) {
        const fileRef = ref(storage, `reports/${user.uid}/${Date.now()}-${file.name}`);
        await uploadBytes(fileRef, file);
        const url = await getDownloadURL(fileRef);
        evidenceUrls.push(url);
      }

      await addDoc(collection(db, "reports"), {
        userId: user.uid,
        type: reportType,
        description,
        location,
        isAnonymous,
        evidenceUrls,
        hasEvidence: evidenceUrls.length > 0,
        status: "submitted",
        timestamp: serverTimestamp(),
      });

      setReportType("");
      setDescription("");
      setLocation("");
      setEvidenceFiles([]);

      toast({
        title: "Report Submitted",
        description: "Your report has been successfully submitted.",
      });
      setActiveTab("history");

    } catch (error) {
      console.error("Error submitting report:", error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your report.",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "submitted":
        return "secondary";
      case "under_review":
        return "warning";
      case "resolved":
        return "success";
      default:
        return "secondary";
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

      <div className="flex space-x-1 mb-8">
        <Button
          variant={activeTab === "new" ? "default" : "outline"}
          onClick={() => setActiveTab("new")}
          className="flex-1"
        >
          <FileText className="w-4 h-4 mr-2" />
          New Report
        </Button>
        <Button
          variant={activeTab === "history" ? "default" : "outline"}
          onClick={() => setActiveTab("history")}
          className="flex-1"
        >
          <Clock className="w-4 h-4 mr-2" />
          My Reports
        </Button>
      </div>

      {activeTab === "new" && (
        <Card>
          <CardHeader>
            <CardTitle>Submit a New Report</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="reportType">Report Type</Label>
                <Input id="reportType" value={reportType} onChange={(e) => setReportType(e.target.value)} placeholder="e.g., Theft, Vandalism" />
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input id="location" value={location} onFocus={handleLocationClick} onChange={(e) => setLocation(e.target.value)} placeholder="Detecting location..." />
              </div>
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Provide details..." />
            </div>
            <div>
              <Label>Evidence (Optional)</Label>
              <Input type="file" multiple onChange={handleFileUpload} />
            </div>
            <div className="flex items-center space-x-2">
              <Input type="checkbox" id="anonymous" checked={isAnonymous} onChange={(e) => setIsAnonymous(e.target.checked)} />
              <Label htmlFor="anonymous">Submit Anonymously</Label>
            </div>
            <Button
              onClick={handleSubmitReport}
              className="w-full"
              size="lg"
              disabled={!reportType || !description || !location || !user}
            >
              <Shield className="w-5 h-5 mr-2" />
              Submit Securely
            </Button>
          </CardContent>
        </Card>
      )}

      {activeTab === "history" && (
        <div className="space-y-4">
          {userReports.length > 0 ? (
            userReports.map((report) => (
              <Card key={report.id}>
                <CardContent className="p-4">
                  <p>{report.description}</p>
                  <Badge variant={getStatusColor(report.status)}>{report.status}</Badge>
                </CardContent>
              </Card>
            ))
          ) : (
            <p>No reports found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ReportsPage;
