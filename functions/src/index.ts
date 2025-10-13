
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

// --- Centralized Cloud Function Error Logger ---
const logFunctionError = (functionName: string, error: any, contextInfo: string, hint: string) => {
  functions.logger.error(
    `[${functionName}] Backend Function Error:`,
    `\n  - Context: ${contextInfo}`,
    `\n  - Type: ${error.code || 'Unknown'}`,
    `\n  - Message: ${error.message}`,
    `\n  - Hint: ${hint}`,
    `\n  - Full Error:`,
    error
  );
};


/**
 * Cloud Function to send a push notification to a user when their report is successfully received.
 * This is triggered when a new document is created in the 'ambulanceReports' collection.
 */
export const onReportReceived = functions.firestore
  .document("ambulanceReports/{reportId}")
  .onCreate(async (snapshot, context) => {
    const { reportId } = context.params;
    const reportData = snapshot.data();

    if (!reportData || !reportData.userId) {
      functions.logger.warn(`[onReportReceived] Aborting: Report data or userId is missing for reportId: ${reportId}.`);
      return;
    }

    const { userId, message } = reportData;
    const notificationMessage = message || "Report received — we’re working on it!";

    try {
      // Get the user's FCM token from the 'fcmTokens' collection
      const fcmTokenDoc = await admin.firestore().collection("fcmTokens").doc(userId).get();

      if (!fcmTokenDoc.exists || !fcmTokenDoc.data()?.token) {
        functions.logger.warn(`[onReportReceived] Aborting: FCM token not found or is invalid for user: ${userId}.`);
        return;
      }

      const token = fcmTokenDoc.data()?.token;

      // Construct the notification message
      const payload = {
        notification: {
          title: "✅ Report Submitted Successfully",
          body: notificationMessage,
        },
        token: token,
      };

      functions.logger.log(`[onReportReceived] Sending notification to user: ${userId} for report: ${reportId}`);

      // Send the notification to the user's device
      const response = await admin.messaging().send(payload);
      functions.logger.log("[onReportReceived] Successfully sent message:", response);

    } catch (error: any) {
      logFunctionError(
        "onReportReceived",
        error,
        `Sending notification for reportId: ${reportId} to userId: ${userId}`,
        "Check the validity of the FCM token, and ensure the Firebase Messaging API is enabled."
      );

      // Optional: Clean up invalid tokens
      if (error.code === 'messaging/registration-token-not-registered') {
        await admin.firestore().collection("fcmTokens").doc(userId).delete();
        functions.logger.log(`[onReportReceived] Deleted invalid FCM token for user: ${userId}`);
      }
    }
  });
