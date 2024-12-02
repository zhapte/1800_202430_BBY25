//code sourced from Carly's demo
function addnewevent() {
    var eventRef = db.collection("customevents");
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            var size = parseFloat(document.getElementById('eventsize').value);
            var dollar = parseFloat(document.getElementById('eventgoal').value);
            var contribution = dollar / size;

            eventRef.add({
                eventOwner: user.uid,
                goal: document.getElementById('eventgoal').value,
                name: document.getElementById('eventtitle').value,
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
                            Swal.fire({
                                title: "Event Created",
                                text: "You Created Your event",
                                icon: "success"
                            }).then(function () {
                                window.location.assign("eventlist.html");
                            });
                        })
                    });
            })
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
