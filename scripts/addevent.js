  function addnewevent(){
    var eventRef = db.collection("customevents");
    //code sourced from Carly's demo
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            var size = parseFloat(document.getElementById('eventsize').value);
            var dollar = parseFloat(document.getElementById('eventgoal').value);
            var contribution = dollar / size;

            eventRef.add({
                eventOwner: user.uid,
                goal: document.getElementById('eventgoal').value,
                name: document.getElementById('eventtitle').value ,
                groupSize: document.getElementById('eventsize').value,
                eventdes: document.getElementById('eventdes').value,
                date: document.getElementById('eventdate').value,
                contribution: contribution.toFixed(2),
                last_updated: firebase.firestore.FieldValue.serverTimestamp()
            }).then(function () {
                console.log("event added to database");
                currentUser = db.collection("users").doc(user.uid)
                currentUser.get()
                    .then(userDoc => {
                    let moneyAmount = userDoc.data().money;
                    let totala = parseFloat(moneyAmount) - parseFloat(contribution);
                    totala = totala.toFixed(2);
                    currentUser.update({
                        money: totala,
                    }).then(function () {
                        console.log("Money added to profile");
                        window.location.assign("eventlist.html");       
                    })
                });
            
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
// function goBack() {
//     // Check if there's a previous page in the browser history
//     if (window.history.length > 1) {
//         window.history.back(); // Go back to the previous page
//     // } else {
//     //     // Fallback: Redirect to a default page (e.g., Event List)
//     //     window.location.href = "eventlist.html";
//     // }
// }
// }