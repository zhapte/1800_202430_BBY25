function getDocIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const database = urlParams.get("database");
    const docId = urlParams.get("docId");
    return { docId, database};
}

// Display event information based on docId
function displayeventinfo() {
    const {docId, database} = getDocIdFromURL();
    if (!docId) {
        console.error("No document ID found in URL");
        return;
    }
    console.log(docId);
    console.log(database);
    const eventRef = db.collection(database).doc(docId);
    eventRef.get().then(eventdoc => {
        if (eventdoc.exists) {
            const data = eventdoc.data();

            // Update the event details on the HTML page
            document.getElementById("eventtitle").innerText = data.name || "No Title";
            document.getElementById("eventsize").innerText = "Group Size: " + (data.groupSize || "N/A");
            document.getElementById("goalamount").innerText = "Total Goal: " + (data.goal || "N/A");
            document.getElementById("eventdetail").innerText = "The Event: " + (data.eventdes || "No Description");

            // Retrieve owner info and display
            const userRef = db.collection("users").doc(data.eventOwner);
            userRef.get().then(userDoc => {
                if (userDoc.exists) {
                    document.getElementById("eventowner").innerText = "Owner: " + (userDoc.data().name || "Unknown");
                } else {
                    console.log("Owner document not found");
                }
            }).catch(error => {
                console.error("Error fetching owner details:", error);
            });
        } else {
            console.log("Event document does not exist");
        }
    }).catch(error => {
        console.error("Error fetching event details:", error);
    });
}


displayeventinfo();


function join() {
    const { docId, database } = getDocIdFromURL();
    if (!docId) {
        console.error("No document ID found in URL");
        return;
    }

    // Reference the event document in Firestore
    const eventRef = db.collection(database).doc(docId.trim());
    eventRef.get().then(eventDoc => {
        if (eventDoc.exists) {
            const participants = eventDoc.data().participant || []; 

            // Check if the user is authenticated
            firebase.auth().onAuthStateChanged(user => {
                if (user) {
                    
                    if (!participants.includes(user.uid)) {
                        participants.push(user.uid); // Add user to the participant list

                        // Update participant list in Firestore
                        eventRef.update({
                            participant: participants
                        }).then(() => {
                            console.log("User added to event participants");
                            window.location.assign("main.html");
                        }).catch(error => {
                            console.error("Error updating participants:", error);
                        });
                    } else {
                        console.log("User is already a participant");
                    }
                } else {
                    console.log("No user is logged in");
                }
            });
        } else {
            console.log("Event document does not exist");
        }
    }).catch(error => {
        console.error("Error fetching event for joining:", error);
    });
}
