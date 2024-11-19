
   
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

// Get references to the form, inputs, and submit button
const form = document.getElementById('eventInput');
const inputs = Array.from(form.querySelectorAll('input[required]'));
const submitButton = document.getElementById('submitButton');

function checkFormValidity() {
    // Check if all inputs are valid
    const allValid = inputs.every(input => input.value.trim() !== '' && input.checkValidity());
    // Enable or disable the submit button
    submitButton.disabled = !allValid;
}


inputs.forEach(input => {
    input.addEventListener('input', checkFormValidity);
});