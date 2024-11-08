// Function to load events from Firestore
function loadEvents() {
    const eventTableBody = document.getElementById("eventTableBody");
    eventTableBody.innerHTML = ""; // Clear existing rows

    db.collection("customevents").get().then((populate) => {
        populate.forEach((doc) => {
            const event = doc.data();

            // Create a new row
            const row = document.createElement("tr");
            row.classList.add("clickable-row");

            // Populate row with event data
            row.innerHTML = `
                <td>${event.name}</td>
                <td>${event.groupSize}</td>
                <td>${event.goal}</td>
                <td>${event.eventdes}</td>
            `;

            // Add click event listener to row to redirect to events.html
            row.addEventListener("click", () => {
                window.location.href = "events.html";
            });

            eventTableBody.appendChild(row);
        });
    }).catch((error) => {
        console.error("Error fetching events: ", error);
    });
}

// Load events on page load
window.onload = loadEvents;


