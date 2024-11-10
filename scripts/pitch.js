
function displayeventinfo(){
    let event = db.collection("customevents").doc("U02uDbdS6buMtNXGEWp6");
    event.get().then(eventdoc => {
        let title = eventdoc.data().name;
        let owner = eventdoc.data().eventOwner;
        let goal = eventdoc.data().goal;
        let size = eventdoc.data().groupSize;
        let des = eventdoc.data().eventdes;


        document.getElementById("eventtitle").innerText = title;
        document.getElementById("eventsize").innerText = "Group Size: " + size;
        document.getElementById("goalamount").innerText = "Total Goal: " + goal;
        document.getElementById("eventdetail").innerText = "The Event: " + des;

        let user = db.collection("users").doc(owner)
        user.get().then(username => {
            document.getElementById("eventowner").innerText = "Owner: " + username.data().name;
        })

    })

}
displayeventinfo();

function join(){
    var eventRef = db.collection("customevents").doc("U02uDbdS6buMtNXGEWp6");
    eventRef.get().then(event => {
        let part = event.data().participant;
        if(part == null){
            firebase.auth().onAuthStateChanged(user => {
                if (user) {
                    eventRef.update({
                        participant:user.uid
                    }).then(function () {
                        console.log("event added to database");
        
                        window.location.assign("main.html");       //re-direct to main.html after event added
                    })
                } else {
                    console.log("No user is logged in."); // Log a message when no user is logged in
                }
            })
        }else {
            firebase.auth().onAuthStateChanged(user => {
                
                if (user) {
                    eventRef.update({
                        participant:part +"," + user.uid
                    }).then(function () {
                        console.log("event added to database");
        
                        window.location.assign("main.html");       //re-direct to main.html after event added
                    })
                } else {
                    console.log("No user is logged in."); // Log a message when no user is logged in
                }
            })
        }
    })

    

}