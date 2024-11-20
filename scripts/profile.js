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
                            let bottles = userDoc.data().bottles;

                            //if the data fields are not empty, then write them in to the form.
                            if (userName != null) {
                                document.getElementById("nameInput").value = userName;
                                document.getElementById("nameoutput").innerText = userName;
                            }
                            if (userSchool != null) {
                                document.getElementById("schoolInput").value = userSchool;
                                document.getElementById("schooloutput").innerText = userSchool;
                            }
                            if (userCity != null) {
                                document.getElementById("cityInput").value = userCity;
                                document.getElementById("cityoutput").innerText = userCity;
                            }
                            if (moneyAmount != null) {
                                document.getElementById("moneyInput").value = moneyAmount;
                                document.getElementById("moneyoutput").innerText = moneyAmount;
                            }
                            if(bottles != null){
                                document.getElementById("bottlereturned").innerText = bottles + " bottles returned";
                            }
                            var x = document.getElementsByClassName("infoinput");
                            for (var i = 0; i < x.length; i++) {
                                x[i].classList.add("hidden");
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
    var x = document.getElementsByClassName("infoinput");
    for (var i = 0; i < x.length; i++) {
        x[i].classList.remove("hidden");
    }

    var y = document.getElementsByClassName("outputinfo");
    for (var i = 0; i < y.length; i++) {
        y[i].classList.add("hidden");
    }
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
    var x = document.getElementsByClassName("infoinput");
    for (var i = 0; i < x.length; i++) {
        x[i].classList.add("hidden");
    }
    var y = document.getElementsByClassName("outputinfo");
    for (var i = 0; i < y.length; i++) {
        y[i].classList.remove("hidden");
    }
    populateUserInfo();
}

function gonext(){
    saveUserInfo();
    window.location.assign("main.html");
}