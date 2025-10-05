const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Firebase Admin and Gemini AI
admin.initializeApp();
// It is recommended to set the Gemini API key in your environment variables
// For example: firebase functions:config:set gemini.key="YOUR_API_KEY"
const genAI = new GoogleGenerativeAI(functions.config().gemini.key);

const db = admin.firestore();

/**
 * Cloud Function to be triggered when a new report is created in Firestore.
 * It analyzes the report's description using the Gemini API and updates the report
 * with an AI-generated category.
 */
exports.onReportCreate = functions.firestore
  .document("reports/{reportId}")
  .onCreate(async (snap, context) => {
    const report = snap.data();
    const { description } = report;

    if (!description) {
      console.log("No description found in the report. Skipping AI analysis.");
      return null;
    }

    console.log(`Analyzing report: ${context.params.reportId}`);

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const prompt = `Analyze the following emergency report and provide a single, relevant category. Choose from: Fire, Accident, Health, Crime, Natural Disaster, Other. Report description: "${description}"`;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const category = response.text().trim();

      const aiAnalysis = {
        category: category || "Other", // Default to other if parsing fails
      };

      // Update the report document with the new AI-generated category
      return snap.ref.update({ aiAnalysis });

    } catch (error) {
      console.error("Error during Gemini API analysis:", error);
      // Optionally update the report with an error status
      return snap.ref.update({ aiAnalysis: { error: "Analysis failed." } });
    }
  });

/**
 * Cloud Function to be triggered when a report document is updated.
 * Specifically, it checks if the 'status' field has changed and sends a 
 * push notification to the user who created the report.
 */
exports.onReportUpdate = functions.firestore
  .document("reports/{reportId}")
  .onUpdate(async (change, context) => {
    const before = change.before.data();
    const after = change.after.data();

    // Proceed only if the status has actually changed
    if (before.status === after.status) {
      console.log("Status unchanged. No notification will be sent.");
      return null;
    }

    const userId = after.userId;
    if (!userId) {
      console.log("Report is missing a userId. Cannot send notification.");
      return null;
    }

    console.log(`Status changed for report ${context.params.reportId}. Sending notification to user ${userId}.`);

    // Get the user's document to find their FCM token
    const userDocRef = db.collection("users").doc(userId);
    const userDoc = await userDocRef.get();

    if (!userDoc.exists) {
      console.error(`User document for userId ${userId} not found.`);
      return null;
    }

    const fcmToken = userDoc.data().fcmToken; // Assuming the token is stored here

    if (!fcmToken) {
      console.log(`FCM token for user ${userId} not found. Cannot send notification.`);
      return null;
    }

    // Construct the notification payload
    const payload = {
      notification: {
        title: "Your Report Status Has Changed",
        body: `The status of your report is now "${after.status}".`,
        clickAction: `https://<YOUR-APP-DOMAIN>/my-reports/${context.params.reportId}` // Optional: deep link
      },
      token: fcmToken,
    };

    // Send the push notification
    try {
      await admin.messaging().send(payload);
      console.log("Successfully sent push notification.");
    } catch (error) {
      console.error("Error sending push notification:", error);
    }
    
    return null;
  });
