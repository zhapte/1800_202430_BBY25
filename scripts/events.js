function loadEvents() {
    const eventTableBody = document.getElementById("eventTableBody");
    eventTableBody.innerHTML = ""; // Clear existing rows

    // Mapping event names to specific document IDs
    const eventIds = {
        "test future 1": "68oySrB5qAuTCFRSTPWx",
        "test future 2": "ixPlpDRL5QyWV2mRthxD",
        "future event 3": "KEpmtt4xH1fRd6kdOmPl",
        "test past": "tL1xGPrWkfD81bYWTd7g"
    };

    db.collection("customevents").get().then((snapshot) => {
        snapshot.forEach((doc) => {
            const event = doc.data();
            const eventId = eventIds[event.name]; 

            // If no ID is found, skip this event
            if (!eventId) return;

            // Create a new row
            const row = document.createElement("tr");

            row.classList.add("clickable-row");


            row.setAttribute("data-id", eventId);

            // Populate row with event data
            row.innerHTML = `
                <td>${event.name}</td>
                <td>${event.groupSize}</td>
                <td>${event.goal}</td>
                <td>${event.eventdes}</td>
            `;


            row.addEventListener("click", () => {
                window.location.href = `events.html?docId=${eventId}`;
            });

            eventTableBody.appendChild(row);
        });
    }).catch((error) => {
        console.error("Error fetching events: ", error);
    });
}
loadEvents();