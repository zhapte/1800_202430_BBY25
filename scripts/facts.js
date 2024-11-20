var total;
var bottleCount
function calculateTotal() {
    // code wrote by Pari
    const bottleCountInput = document.getElementById("bottleCount").value;

    // Ensure the input is a valid number
    bottleCount = parseInt(bottleCountInput, 10);
    
    if (isNaN(bottleCount) || bottleCount < 0) {
        document.getElementById("result").innerText = "Please enter a valid number of bottles.";
        return;
    }
    
    const pricePerBottle = 0.10; // 10 cents per bottle
    total = bottleCount * pricePerBottle;
    document.getElementById("submit").classList.remove("hidden");
    // Display result with 2 decimal places
    document.getElementById("result").innerText = `Total: $${total.toFixed(2)}`;
}

function addtoprofile(){
    firebase.auth().onAuthStateChanged(user => {
        // Check if user is signed in:
        if (user) {

            //go to the correct user document by referencing to the user uid
            currentUser = db.collection("users").doc(user.uid)
            //get the document for current user.
            currentUser.get()
                .then(userDoc => {
                    let moneyAmount = userDoc.data().money;
                    let bottles = userDoc.data().bottles;
                    let totala = parseFloat(moneyAmount) + parseFloat(total)
                    totala = totala.toFixed(2);
                    bottles += bottleCount;
                    currentUser.update({
                        money: totala,
                        bottles: bottles
                    }).then(function () {
                        console.log("Money added to profile");
                        window.location.assign("profile.html");      
                    })
                })
        } else {
            // No user is signed in.
            console.log("No user is signed in");
        }
    });
}





function loadItems() {
    const itemList = document.getElementById("itemList"); 
    itemList.innerHTML = ""; 
    db.collection("Facts").get().then((facts) => {
        facts.forEach((doc) => {
            const item = doc.data();
            
            const listItem = document.createElement("li");
            listItem.classList.add("item");
            listItem.innerHTML = `
                <img src="${item.pic}" alt="${item.alt}" class="rimg" />
                <div class="text-container">
                    <div class="head">${item.name}</div>
                    <div class="sub">${item.tip}</div>
                </div>
            `;
            itemList.appendChild(listItem);
        });
    })
}
loadItems()