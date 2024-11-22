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

    const eventRef = db.collection(database).doc(docId);
    eventRef.get().then(eventdoc => {
        if (eventdoc.exists) {
            const data = eventdoc.data();

            // Update the event details on the HTML page
            const participants = data.participant || [];
            var currentpart = parseInt(participants.length) + 1;
            document.getElementById("eventtitle").innerText = data.name || "No Title";
            document.getElementById("eventsize").innerText = "Group Size: " + currentpart + "/"+ (data.groupSize || "N/A");
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
                    const contribution = eventDoc.data().contribution;
                    if (!participants.includes(user.uid)) {
                        participants.push(user.uid);
                        eventRef.update({
                            participant: participants
                        }).then(() => {
                            currentUser = db.collection("users").doc(user.uid)
                            currentUser.get()
                                .then(userDoc => {
                                    let moneyAmount = userDoc.data().money;
                                    let totala = parseFloat(moneyAmount) - parseFloat(contribution);
                                    totala = totala.toFixed(2);
                                    currentUser.update({
                                        money: totala,
                                    }).then(function () {
                                        console.log("Money deducted to profile");
                                        window.location.assign("eventlist.html");
                                    })
                                });
                        }).catch(error => {
                            console.error("Error updating participants:", error);
                        });
                    } 
                } else {
                    console.log("No user is logged in");
                }
            });
        }
    }).catch(error => {
        console.error("Error fetching event for joining:", error);
    });
}
 
function checksize() {
    const {docId, database} = getDocIdFromURL();
    const eventRef = db.collection(database).doc(docId.trim());
    eventRef.get().then(eventDoc => {
        const participants = eventDoc.data().participant || [];
        var currentpart = parseInt(participants.length);
        var size = parseInt(eventDoc.data().groupSize) - 1;

        if(currentpart >= size){
            currentpart += 1;
            document.getElementById("joinbutton").disabled = true;
            document.getElementById("eventsize").innerText = "Group Size: " + currentpart + "/" + (eventDoc.data().groupSize || "N/A") + " Already Full.";
        }
    })
}
checksize();

function checkisparticipate(){
    const { docId, database } = getDocIdFromURL();
    const eventRef = db.collection(database).doc(docId.trim());
    eventRef.get().then(eventDoc => {
        const participants = eventDoc.data().participant || [];

        // Check if the user is authenticated
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                if(user.uid == eventDoc.data().eventOwner){
                    document.getElementById("joinbutton").disabled = true;
                    document.getElementById("joinbutton").innerHTML = "You are the Owner";
                }
                if (participants.includes(user.uid)) {
                    document.getElementById("joinbutton").disabled = true;
                    document.getElementById("joinbutton").innerHTML = "Already Joined";
                }
            } else {
                console.log("No user is logged in");
            }
        });

    })
}
checkisparticipate();

