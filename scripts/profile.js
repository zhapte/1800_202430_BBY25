var currentUser;               
//points to the document of the user who is logged in
//this data would be used for all the fucntions in this js file.
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
                    //populate both the p data and the input field so that both field have data
                    //show the p tag or the input tag depending on what action the user is doing
                    //input for endering and modify data
                    //p to display data for users to see
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
                    if (bottles != null) {
                        document.getElementById("bottlereturned").innerText = bottles + " bottles returned";
                    }
                    //when the page loads add the "hidden" class to the inpt fields so that only p is shown.
                    var x = document.getElementsByClassName("infoinput");
                    for (var i = 0; i < x.length; i++) {
                        x[i].classList.add("hidden");
                    }
                })
        } else {
            // No user is signed in.
            console.log("No user is signed in");
        }
    });
}

//the function is used to toggle between entering data and displaying data.
//This fucntion is used to hide the p tags and change it to input tags so that 
//users can use it to enter the information they desire.
function editUserInfo() {
    //Enable the form fields
    document.getElementById('personalInfoFields').disabled = false;
    //hidden class is removed from the input tags
    var x = document.getElementsByClassName("infoinput");
    for (var i = 0; i < x.length; i++) {
        x[i].classList.remove("hidden");
    }
    //hidden class is then added to the p tags.
    var y = document.getElementsByClassName("outputinfo");
    for (var i = 0; i < y.length; i++) {
        y[i].classList.add("hidden");
    }
}
//call the function to run it 
//called when the js file is first loaded on the page.
//generally called when the page first loads
populateUserInfo();


//function to take what is input in the input tag and then update it to the database.
//function is called when the save button is clicked on the profile page
function saveUserInfo() {
    //all the data is collected from the input field
    //the name of the user
    userName = document.getElementById('nameInput').value;
    //the school of the user
    userSchool = document.getElementById('schoolInput').value;
    //city the user lives in
    userCity = document.getElementById('cityInput').value;
    //money user have made through recycling
    userMoney = document.getElementById('moneyInput').value;
    //fucntion to update the database.
    currentUser.update({
        name: userName,
        school: userSchool,
        city: userCity,
        money: userMoney
    })
        .then(() => {
            // once database is updated input field is then disabled.
            document.getElementById('personalInfoFields').disabled = true;
            //add hidden class to the input fields.
            var x = document.getElementsByClassName("infoinput");
            for (var i = 0; i < x.length; i++) {
                x[i].classList.add("hidden");
            }
            //remove the hidden tag from the p tags.
            var y = document.getElementsByClassName("outputinfo");
            for (var i = 0; i < y.length; i++) {
                y[i].classList.remove("hidden");
            }
            //call the function to reload data from database.
            populateUserInfo();
        })
    
}


//function works similar to save but is only available the first time the user logs in
//the function would be called from a first time profile page and take the user to the main page.
function gonext() {
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
            //once the database is successfuly updated then takes the user to the main page.
            window.location.assign("main.html");
        })

}