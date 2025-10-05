import {onDocumentCreated, onDocumentUpdated} from "firebase-functions/v2/firestore";
import {setGlobalOptions} from "firebase-functions/v2";
import * as admin from "firebase-admin";
import {GoogleGenerativeAI} from "@google/generative-ai";
import {defineString} from "firebase-functions/params";

// Initialize Firebase Admin
admin.initializeApp();

// Set the region for all functions in this file
setGlobalOptions({region: "asia-south1"});

// Define the Gemini API Key as a secret parameter
const geminiApiKey = defineString("GEMINI_API_KEY");

/**
 * Initializes the Gemini AI client.
 * This is structured to safely handle cases where the API key might not be set.
 */
function getGenAIClient() {
  const key = geminiApiKey.value();
  if (!key) {
    console.error("Gemini API key secret is not set. Please set it using `firebase functions:secrets:set GEMINI_API_KEY`");
    return null;
  }
  return new GoogleGenerativeAI(key);
}

const db = admin.firestore();

/**
 * Gen 2 Cloud Function to be triggered when a new report is created.
 * It analyzes the report's description and updates it with a category.
 */
export const onReportCreate = onDocumentCreated("reports/{reportId}", async (event) => {
  const genAI = getGenAIClient();
  if (!genAI) {
    return; // Stop execution if client is not available
  }

  const snap = event.data;
  if (!snap) {
    console.log("No data associated with the event.");
    return;
  }

  const report = snap.data();
  const {description} = report;

  if (!description) {
    console.log("No description, skipping AI analysis.");
    return;
  }

  console.log(`Analyzing report: ${event.params.reportId}`);

  try {
    const model = genAI.getGenerativeModel({model: "gemini-pro"});
    const prompt = `Analyze this emergency report and provide one category from: Fire, Accident, Health, Crime, Natural Disaster, Other. Description: "${description}"`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const category = response.text().trim();

    await snap.ref.update({aiAnalysis: {category: category || "Other"}});
  } catch (error) {
    console.error("Error during Gemini API analysis:", error);
    await snap.ref.update({aiAnalysis: {error: "Analysis failed."}});
  }
});

/**
 * Gen 2 Cloud Function to be triggered when a report is updated.
 * Sends a push notification to the user if the status has changed.
 */
export const onReportUpdate = onDocumentUpdated("reports/{reportId}", async (event) => {
  const snap = event.data;
  if (!snap) {
    console.log("No data associated with the event.");
    return;
  }

  const before = snap.before.data();
  const after = snap.after.data();

  if (before.status === after.status) {
    console.log("Status unchanged. No notification needed.");
    return;
  }

  const userId = after.userId;
  if (!userId) {
    console.log("Report is missing a userId. Cannot send notification.");
    return;
  }

  const userDoc = await db.collection("users").doc(userId).get();
  if (!userDoc.exists) {
    console.error(`User document for userId ${userId} not found.`);
    return;
  }

  const fcmToken = userDoc.data()?.fcmToken;
  if (!fcmToken) {
    console.log(`FCM token for user ${userId} not found.`);
    return;
  }

  const payload = {
    notification: {
      title: "Report Status Updated",
      body: `Your report status is now "${after.status}".`,
    },
    token: fcmToken,
  };

  try {
    await admin.messaging().send(payload);
    console.log("Push notification sent successfully.");
  } catch (error) {
    console.error("Error sending push notification:", error);
  }
});
