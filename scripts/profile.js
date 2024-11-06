var currentUser;               //points to the document of the user who is logged in
function populateUserInfo() {
            firebase.auth().onAuthStateChanged(user => {
                // Check if user is signed in:
                if (user) {

                    //go to the correct user document by referencing to the user uid
                    currentUser = db.collection("users").doc(user.uid)
                    //get the document for current user.
                    currentUser.get()
                        .then(userDoc => {
                            //get the data fields of the user
                            let userName = userDoc.data().name;
                            let userSchool = userDoc.data().school;
                            let userCity = userDoc.data().city;
                            let moneyAmount = userDoc.data().money;

                            //if the data fields are not empty, then write them in to the form.
                            if (userName != null) {
                                document.getElementById("nameInput").value = userName;
                            }
                            if (userSchool != null) {
                                document.getElementById("schoolInput").value = userSchool;
                            }
                            if (userCity != null) {
                                document.getElementById("cityInput").value = userCity;
                            }
                            if (moneyAmount != null) {
                                document.getElementById("moneyInput").value = moneyAmount;
                            }
                        })
                } else {
                    // No user is signed in.
                    console.log ("No user is signed in");
                }
            });
        }

function editUserInfo() {
    //Enable the form fields
    document.getElementById('personalInfoFields').disabled = false;
}
//call the function to run it 
populateUserInfo();

function saveUserInfo() {
    userName = document.getElementById('nameInput').value;       
    userSchool = document.getElementById('schoolInput').value;     
    userCity = document.getElementById('cityInput').value;      
    userMoney = document.getElementById('moneyInput').value;
    currentUser.update({
        name: userName,
        school: userSchool,
        city: userCity,
        money: userMoney
    })
    .then(() => {
        console.log("Document successfully updated!");
    })
    document.getElementById('personalInfoFields').disabled = true;
}