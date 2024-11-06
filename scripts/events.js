// Function to load events from Firestore
function loadEvents() {
    const eventTableBody = document.getElementById("eventTableBody");
    eventTableBody.innerHTML = ""; // Clear existing rows

    db.collection("events").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const event = doc.data();

            // Create a new row
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${event.title}</td>
                <td>${event.groupSize}</td>
                <td>${event.goal}</td>
                <td>${event.info}</td>
            `;
            eventTableBody.appendChild(row);
        });
    }).catch((error) => {
        console.error("Error fetching events: ", error);
    });
}

// Load events on page load
window.onload = loadEvents;
