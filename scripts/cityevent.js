function loadEvents() {
    const eventTableBody = document.getElementById("eventTableBody");
    eventTableBody.innerHTML = ""; // Clear existing rows


    db.collection("cityevents").get().then((snapshot) => {
        snapshot.forEach((doc) => {

            const event = doc.data();


            // Create a new row
            const row = document.createElement("tr");

            row.classList.add("clickable-row");


            row.setAttribute("data-id", event.name);

            // Populate row with event data
            row.innerHTML = `
                <td>${event.name}</td>
                <td>${event.groupSize}</td>
                <td>${event.goal}</td>
                <td>${event.eventdes}</td>
            `;


            row.addEventListener("click", () => {
                window.location.href = `events.html?docId=${doc.id}`;
            });

            eventTableBody.appendChild(row);
        });
    }).catch((error) => {
        console.error("Error fetching events: ", error);
    });
}
loadEvents();