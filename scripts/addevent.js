
function hello(){
    var eventRef = db.collection("customevents");

    eventRef.add({
        eventID: "bby01",
        name: "custom event",
        last_updated: firebase.firestore.FieldValue.serverTimestamp()
    }).then(function () {
        console.log("New user added to firestore");
        window.location.assign("main.html");       //re-direct to main.html after event added
    })

}
