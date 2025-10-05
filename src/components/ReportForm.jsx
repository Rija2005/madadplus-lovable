import React, { useState, useEffect } from 'react';
import { collection, addDoc, doc, updateDoc } from "firebase/firestore";
// Import your initialized db and auth objects
import { db, auth } from '../firebase';
import { onAuthStateChanged } from "firebase/auth";

function ReportForm() {
  const [description, setDescription] = useState('');
  const [reportId, setReportId] = useState(null);
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
    });
    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);


  const handleCreateReport = async (e) => {
    e.preventDefault();
    if (!description) return;

    // Ensure a user is signed in before creating a report
    if (!user) {
        setError("You must be logged in to submit a report.");
        return;
    }

    try {
      // This adds a new document to the "reports" collection
      const docRef = await addDoc(collection(db, "reports"), {
        description: description,
        status: "submitted", // Initial status
        createdAt: new Date(),
        // This is crucial for your onReportUpdate function to work!
        userId: user.uid 
      });
      
      console.log("Report created with ID: ", docRef.id);
      setReportId(docRef.id); // Save the ID for later
      setDescription(''); // Clear the textarea
      setError(''); // Clear any previous errors
      
      // Your onReportCreate function will now automatically trigger in the backend!
      
    } catch (error) {
      console.error("Error adding document: ", error);
      setError("Failed to create report.");
    }
  };

  const handleUpdateStatus = async (newStatus) => {
    if (!reportId) return;
    
    try {
      const reportRef = doc(db, "reports", reportId);
      
      await updateDoc(reportRef, {
        status: newStatus
      });
      
      console.log("Report status updated!");
      
      // Your onReportUpdate function will now automatically trigger!

    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  return (
    <div>
      <h2>Submit a Report</h2>
      
      {!user ? (
        <p>Please log in to submit a report.</p>
      ) : (
        <form onSubmit={handleCreateReport}>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the emergency"
            rows={4}
            style={{ width: '100%' }}
          />
          <button type="submit">Submit Report</button>
        </form>
      )}

      {error && <p style={{color: 'red'}}>{error}</p>}
      
      {reportId && (
        <div style={{marginTop: '20px'}}>
          <h3>Update Last Report</h3>
          <p>Report ID: {reportId}</p>
          <button onClick={() => handleUpdateStatus('in-progress')}>
            Mark as In Progress
          </button>
          <button onClick={() => handleUpdateStatus('resolved')} style={{marginLeft: '10px'}}>
            Mark as Resolved
          </button>
        </div>
      )}
    </div>
  );
}

export default ReportForm;
