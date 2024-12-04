function getDocIdFromURL() {
    //listen from the previous page for the database and the event id
    //correct database collection and event id gets passed
    const urlParams = new URLSearchParams(window.location.search);
    const database = urlParams.get("database");
    const docId = urlParams.get("docId");
    //event id and database collection based on whichpage was directed from
    return { docId, database };
}

// Display event information based on docId
function displayeventinfo() {
    // get the database collection and database
    const { docId, database } = getDocIdFromURL();
    if (!docId) {
        console.error("No document ID found in URL");
        return;
    }
    //go into th right database for the event for the information to display
    const eventRef = db.collection(database).doc(docId);
    eventRef.get().then(eventdoc => {
        if (eventdoc.exists) {
            const data = eventdoc.data();

            // Update the event details on the HTML page
            const participants = data.participant || [];
            var currentpart = parseInt(participants.length) + 1;
            document.getElementById("eventtitle").innerText = data.name || "No Title";
            document.getElementById("eventsize").innerText = "Group Size: " + currentpart + "/" + (data.groupSize || "N/A");
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
    //get the information of the database collection and event id
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
                        //push the user id into the parcipants array
                        eventRef.update({
                            participant: participants
                        }).then(() => {
                            currentUser = db.collection("users").doc(user.uid)
                            currentUser.get()
                                .then(userDoc => {
                                    //update the money in the user profile to reflect the event is joined.
                                    let moneyAmount = userDoc.data().money;
                                    let totala = parseFloat(moneyAmount) - parseFloat(contribution);
                                    totala = totala.toFixed(2);
                                    currentUser.update({
                                        money: totala,
                                    }).then(function () {
                                        //swwet alert to display based on which
                                        if (database == "customevents") {
                                            Swal.fire({
                                                title: "Event Joined",
                                                text: "You Joined the Event",
                                                icon: "success"
                                            }).then(function () {
                                                location.reload();
                                            })
                                        } else {
                                            Swal.fire({
                                                title: "Money Donated",
                                                text: "You made the community better",
                                                icon: "success"
                                            }).then(function () {
                                                location.reload();
                                            })
                                        }
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

//function to check if the event is full with allthe participant
function checksize() {
    const { docId, database } = getDocIdFromURL();
    const eventRef = db.collection(database).doc(docId.trim());
    eventRef.get().then(eventDoc => {
        //get the array of partcipant
        const participants = eventDoc.data().participant || [];
        var currentpart = parseInt(participants.length);
        //subtract 1 from the groupize since the owner would be considered a participant
        var size = parseInt(eventDoc.data().groupSize) - 1;

        if (currentpart >= size) {
            //disable if the event is full
            currentpart += 1;
            document.getElementById("joinbutton").disabled = true;
            document.getElementById("eventsize").innerText = "Group Size: " + currentpart + "/" + (eventDoc.data().groupSize || "N/A") + " Already Full.";
        }
    })
}
checksize();

function checkisparticipate() {
    //get the database collection and event id
    const { docId, database } = getDocIdFromURL();
    const eventRef = db.collection(database).doc(docId.trim());
    eventRef.get().then(eventDoc => {
        const participants = eventDoc.data().participant || [];

        // Check if the user is authenticated
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                if (user.uid == eventDoc.data().eventOwner) {
                    //check if the current user is th owner then change the button text
                    document.getElementById("joinbutton").disabled = true;
                    document.getElementById("deletebutton").classList.remove("hidden");
                    document.getElementById("deletebutton").classList.add("btn-danger");
                    document.getElementById("deletebutton").innerHTML = "Delete";
                    document.getElementById("joinbutton").innerHTML = "You are the Owner";
                }
                if (participants.includes(user.uid)) {
                    //check if the current user is a participant of the event then change the button tex
                    
                    document.getElementById("joinbutton").disabled = true;
                    document.getElementById("deletebutton").classList.remove("hidden");
                    document.getElementById("deletebutton").classList.add("btn-warning");
                    document.getElementById("deletebutton").innerHTML = "Quit";
                    document.getElementById("joinbutton").innerHTML = "Already Joined";
                }
            } else {
                console.log("No user is logged in");
            }
        });

    })
}
checkisparticipate();

function deleteorquit() {
    //get the event id and database collection
    const { docId, database } = getDocIdFromURL();
    const eventRef = db.collection(database).doc(docId.trim());
    eventRef.get().then(eventDoc => {
        //get the participant array in the event record
        const participants = eventDoc.data().participant || [];
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                if (user.uid == eventDoc.data().eventOwner) {
                    //sweet alert to ask user confirmation
                    Swal.fire({
                        title: "Are you sure?",
                        text: "You won't be able to revert this!",
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#3085d6",
                        cancelButtonColor: "#d33",
                        confirmButtonText: "Yes, delete it!"
                    }).then((result) => {
                        if (result.isConfirmed) {
                            //delete the event if the action is performed by the event owner.
                            db.collection(database).doc(docId).delete()
                                .then(() => {
                                    Swal.fire({
                                        title: "Deleted!",
                                        text: "Your Event has been deleted.",
                                        icon: "success"
                                    }).then(() => {
                                        //since event no longer exists go back to the eventlist 
                                        window.location.assign("eventlist.html");
                                    });
                                })

                        }
                    });

                }
                if (participants.includes(user.uid)) {
                    //get the index of the user in the participant
                    const index = participants.indexOf(user.uid);
                    //remove the participant from the participant array
                    participants.splice(index, 1);
                    //sweet alert to ask user for confirmation
                    Swal.fire({
                        title: "Are you sure?",
                        text: "You Will no longer be part of this event",
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#3085d6",
                        cancelButtonColor: "#d33",
                        confirmButtonText: "Yes, Leave!"
                    }).then((result) => {
                        //update the participant in to database
                        if (result.isConfirmed) {
                            eventRef.update({
                                participant: participants
                            }).then(() => {
                                    Swal.fire({
                                        title: "Left the Event",
                                        text: "You Left the Event.",
                                        icon: "success"
                                    }).then(() => {
                                        //reload the page
                                        location.reload();
                                    });
                                })
                        }
                    });
                }
            }
        })
    })
}

