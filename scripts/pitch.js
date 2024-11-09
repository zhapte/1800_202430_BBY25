
function displayeventinfo() {
    const eventId = getEventIdFromUrl();
    if (!eventId) {
        console.error("No event ID provided in the URL.");
        return;
    }

    let event = db.collection("customevents").doc(eventId);
    event.get().then(eventdoc => {
        if (!eventdoc.exists) {
            console.error("Event not found.");
            return;
        }

        let title = eventdoc.data().name;
        let owner = eventdoc.data().eventOwner;
        let goal = eventdoc.data().goal;
        let size = eventdoc.data().groupSize;
        let des = eventdoc.data().eventdes;

        document.getElementById("eventtitle").innerText = title;
        document.getElementById("eventsize").innerText = "Group Size: " + size;
        document.getElementById("goalamount").innerText = "Total Goal: " + goal;
        document.getElementById("eventdetail").innerText = "The Event: " + des;

        let user = db.collection("users").doc(owner);
        user.get().then(username => {
            document.getElementById("eventowner").innerText = "Owner: " + username.data().name;
        });
    }).catch((error) => {
        console.error("Error fetching event details: ", error);
    });
}

// Call displayeventinfo on page load
window.onload = displayeventinfo;


function join() {
    const eventId = getEventIdFromUrl();
    if (!eventId) {
        console.error("No event ID provided in the URL.");
        return;
    }

    var eventRef = db.collection("customevents").doc(eventId);
    eventRef.get().then(event => {
        let part = event.data().participant;
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                const updatedParticipants = part ? `${part},${user.uid}` : user.uid;
                eventRef.update({ participant: updatedParticipants }).then(() => {
                    console.log("event added to database");
                    window.location.assign("main.html"); // Redirect after joining
                });
            } else {
                console.log("No user is logged in.");
            }
        });
    });
}