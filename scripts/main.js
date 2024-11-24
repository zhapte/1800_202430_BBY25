let eventNames = [];
let currentIndex = 0;

function initializeButtons() {
    const display = document.getElementById("eventDisplay");
    const nextButton = document.getElementById("nextButton");
    const prevButton = document.getElementById("prevButton");

    // Display the first name if the array is not empty
    if (eventNames.length > 0) {
        display.innerText = eventNames[currentIndex];
    } else {
        display.innerText = "No events available.";
    }

    // Add click event for "Next" button
    nextButton.addEventListener("click", () => {
        if (eventNames.length > 0) {
            currentIndex = (currentIndex + 1) % eventNames.length; // Cycle to the next index
            display.innerText = eventNames[currentIndex];
        }
    });

    // Add click event for "Previous" button
    prevButton.addEventListener("click", () => {
        if (eventNames.length > 0) {
            currentIndex = (currentIndex - 1 + eventNames.length) % eventNames.length; // Cycle to the previous index
            display.innerText = eventNames[currentIndex];
        }
    });
}

// Fetch the event names and initialize the buttons
function fetchEventNames() {
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            const userId = user.uid;

            // Fetch events
            db.collection("customevents").get().then((snapshot) => {
                snapshot.forEach((doc) => {
                    const eventData = doc.data();
                    const participants = eventData.participant || [];
                    if (userId === eventData.eventOwner || participants.includes(userId)) {
                        eventNames.push(eventData.name);
                    }
                });

                initializeButtons(); // Initialize the buttons after fetching names
            }).catch((error) => {
                console.error("Error fetching events:", error);
            });
        } else {
            console.log("No user is logged in");
        }
    });
}

// Call the function on page load
window.onload = fetchEventNames;
