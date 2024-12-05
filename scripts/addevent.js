//code sourced from Carly's demo
function addnewevent() {
    //select only the database collection cutom eventssince this is the only database for user to use.
    var eventRef = db.collection("customevents");
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            //calculate the the per person contrubution based on the group size
            //and the total goal fo the even then save it in a variable contribution to use later to update the database.
            var size = parseFloat(document.getElementById('eventsize').value);
            var dollar = parseFloat(document.getElementById('eventgoal').value);
            var contribution = dollar / size;
            //update the information on the input field to the database by using add
            //a new document is created in the database.
            eventRef.add({
                eventOwner: user.uid,//user id to store.
                goal: document.getElementById('eventgoal').value,//total goal for the event.
                name: document.getElementById('eventtitle').value,//name of the event.
                groupSize: document.getElementById('eventsize').value,//group size for the people to join the event.
                eventdes: document.getElementById('eventdes').value,//some short description of the event.
                date: document.getElementById('eventdate').value,//date of the event from a date selector.
                contribution: contribution.toFixed(2),//perperson contribution for the event to use later when user pitch in the event. 
                last_updated: firebase.firestore.FieldValue.serverTimestamp()
            }).then(function () {
                console.log("event added to database");
                //after the event is crated this part of the function would be able to 
                //deduct the money from the user profile.
                currentUser = db.collection("users").doc(user.uid)
                currentUser.get()
                    .then(userDoc => {
                        let moneyAmount = userDoc.data().money;
                        let totala = parseFloat(moneyAmount) - parseFloat(contribution);//subtract the money from user profile with the per person contribution
                        totala = totala.toFixed(2);
                        //update the user profile after the caculation is complete.
                        currentUser.update({
                            money: totala,
                        }).then(function () {
                            //once everything is finished a sweet alter popup would appear giving user feedback.
                            Swal.fire({
                                title: "Event Created",
                                text: "You Created Your event",
                                icon: "success"
                            }).then(function () {
                                //redirect the user back to the event list page.
                                window.location.assign("eventlist.html");
                            });
                        })
                    });
            })
        }
    })
}


//this section of the code came from Carly's tech tips.
//this fucntion make sure that all input field have a valid input befor the submit button would be enabled.
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
