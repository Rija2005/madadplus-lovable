
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Phone,
  Ambulance,
  Hospital,
  Heart,
  Shield,
  Flame,
  Car,
  AlertTriangle,
  Camera,
  Mic,
  FileText,
  MapPin,
  Clock,
} from "lucide-react";
import ReportDialog from "@/components/ReportDialog";
import { VoiceReportDialog } from "@/components/VoiceReportDialog";
import { MediaUploadDialog } from "@/components/MediaUploadDialog";


import heroBackground from "@/assets/hero-background.jpg";

// Firebase imports
import { auth, db } from "../firebase";
import { signInAnonymously } from "firebase/auth";
import {
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

export const EmergencyHome = () => {
  const [reportType, setReportType] = useState<string | null>(null);
  const [reportMethod, setReportMethod] = useState<
    "text" | "voice" | "photo" | null
  >(null);

  // 🔐 Auto sign-in user anonymously
  useEffect(() => {
    if (!auth.currentUser) {
      signInAnonymously(auth).catch((err) =>
        console.error("Anonymous sign-in failed:", err)
      );
    }
  }, []);

  // 🚨 Handle submit to Firestore
  const handleSubmitReport = async () => {
    if (!reportType || !reportMethod) {
      alert("Please select type and method");
      return;
    }
    try {
      await addDoc(collection(db, "reports"), {
        type: reportType,
        method: reportMethod,
        createdAt: serverTimestamp(),
      });
      alert("✅ Emergency Report Submitted!");
      setReportMethod(null);
      setReportType(null);
    } catch (err) {
      console.error(err);
      alert("❌ Failed to submit report");
    }
  };

  // Emergency categories
// Emergency categories
const emergencyCategories = [
  { 
    icon: Flame, 
    title: <>Fire Emergency <span className="text-sm text-gray-500">(آگ لگ گئی ہے)</span></>, 
    type: "fire", 
    color: "bg-red-100" 
  },
  { 
    icon: Shield, 
    title: <>Crime / Police Help <span className="text-sm text-gray-500">(جرم/پولیس مدد)</span></>, 
    type: "crime", 
    color: "bg-blue-100" 
  },
  { 
    icon: Heart, 
    title: <>Medical Emergency <span className="text-sm text-gray-500">(طبی ایمرجنسی)</span></>, 
    type: "medical", 
    color: "bg-green-100" 
  },
  { 
    icon: Car, 
    title: <>Accident <span className="text-sm text-gray-500">(حادثہ)</span></>, 
    type: "accident", 
    color: "bg-yellow-100" 
  },
];

  // Quick actions
  const quickActions = [
    { icon: Phone, title: "Rescue 1122", href: "tel:1122", color: "bg-red-500" },
    {
      icon: Ambulance,
      title: "Request Ambulance",
      href: "/ambulance",
      color: "bg-green-500",
    },
    {
      icon: Hospital,
      title: "Hospitals",
      href: "/hospitals",
      color: "bg-blue-500",
    },
  ];

  const reportMethods = [
      { id: 'text', icon: FileText, title: 'Text' },
      { id: 'voice', icon: Mic, title: 'Voice' },
      { id: 'photo', icon: Camera, title: 'Photo/Video' },
  ];

  return (
    <div className="min-h-screen">
      {/* 🌟 Hero Section */}
      <div
        className="relative h-[40vh] flex items-center justify-center text-center text-white"
        style={{
          backgroundImage: `url(${heroBackground})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 max-w-2xl px-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-2">Madad+</h1>
  <p className="text-lg md:text-xl">
    Your Emergency Assistant for Instant Help{" "}
    <span className="text-sm text-gray-500">(مدد کے لیے آپ کا ایمرجنسی اسسٹنٹ)</span>
  </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* 🚀 Quick Actions */}
        <div className="grid grid-cols-3 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.title}
              to={action.href}
              className={`flex flex-col items-center justify-center p-4 rounded-lg text-white shadow-md hover:shadow-lg transition-all ${action.color}`}

            >
              <div
                className={`p-3 rounded-full ${action.color} text-white mb-2`}
              >
                <action.icon className="w-6 h-6" />
              </div>
              <span className="text-sm text-center">{action.title}</span>
            </Link>
          ))}
        </div>

        {/* 🆘 Emergency Categories */}
        <div className="grid grid-cols-2 gap-4">
          {emergencyCategories.map((category) => (
            <Card
              key={category.type}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setReportType(category.type)}
            >
              <CardHeader className="flex flex-row items-center gap-4">
                <div className={`p-3 rounded-full ${category.color}`}>
                  <category.icon className="w-6 h-6" />
                </div>
                <CardTitle>{category.title}</CardTitle>
              </CardHeader>
            </Card>
          ))}
        </div>

        {/* ✍ Report Methods */}
        {reportType && (
          <div className="grid grid-cols-3 gap-4">
            {reportMethods.map((method) => (
              <Card
                key={method.id}
                className="cursor-pointer hover:shadow-lg transition-shadow h-full"
                onClick={() => setReportMethod(method.id as 'text' | 'voice' | 'photo')}
              >
                <CardHeader className="flex flex-col items-center text-center">
                  <method.icon className="w-8 h-8 mb-2" />
                  <CardTitle>{method.title}</CardTitle>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}

        {/* Render Controlled Dialogs */}
        <ReportDialog
          open={reportMethod === 'text'}
          onOpenChange={(isOpen) => !isOpen && setReportMethod(null)}
        />
        <VoiceReportDialog
          open={reportMethod === 'voice'}
          onOpenChange={(isOpen) => !isOpen && setReportMethod(null)}
          reportType={reportType!}
        />
        <MediaUploadDialog
          open={reportMethod === 'photo'}
          onOpenChange={(isOpen) => !isOpen && setReportMethod(null)}
          reportType={reportType!}
        />

        {/* 🚨 Submit Button */}
        {reportType && reportMethod && (
          <Button
            variant="emergency"
            className="w-full mt-6"
            size="lg"
            onClick={handleSubmitReport}
          >
            <AlertTriangle className="w-5 h-5 mr-2" />
            Submit Emergency Report
          </Button>
        )}

        {/* 📊 Status Indicators */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
              <CardDescription>Current emergency stats</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span>Rescue Teams</span>
                <Badge variant="outline">Active</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Response Time</span>
                <Badge variant="secondary">
                  <Clock className="w-4 h-4 mr-1" /> 5 min
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Location</CardTitle>
              <CardDescription>Detected via GPS</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              <span>Karachi, Pakistan</span>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
