
function hello(){
    var eventRef = db.collection("hikes");

    eventRef.add({
        code: "bby02",
        name: "custom event",
        last_updated: firebase.firestore.FieldValue.serverTimestamp()
    })

}
