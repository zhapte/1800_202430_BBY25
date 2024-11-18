
   
function addnewevent(){
    var eventRef = db.collection("customevents");
    //code sourced from Carly's demo
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            eventRef.add({
                eventID: "bby01",
                eventOwner: user.uid,
                goal: document.getElementById('eventgoal').value,
                name: document.getElementById('eventtitle').value ,
                groupSize: document.getElementById('eventsize').value,
                eventdes: document.getElementById('eventdes').value,
                date: document.getElementById('eventdate').value,
                last_updated: firebase.firestore.FieldValue.serverTimestamp()
            }).then(function () {
                console.log("event added to database");

                window.location.assign("main.html");       //re-direct to main.html after event added
            })
        } else {
            console.log("No user is logged in."); // Log a message when no user is logged in
        }
    })
}

function test(){
    var currentUser; 
}
