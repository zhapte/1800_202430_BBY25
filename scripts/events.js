function loadEvents() {
    const eventTableBody = document.getElementById("eventTableBody");
    eventTableBody.innerHTML = ""; // Clear existing rows

    db.collection("customevents").get().then((snapshot) => {
        snapshot.forEach((doc) => {
            const event = doc.data();
            const edate = new Date(event.date);
            // Create a new row
            edate.setDate(edate.getDate() + 1);
            console.log(edate);
            if (edate >= new Date()) {
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
                    <td>${event.date}</td>
                    <td>$${event.contribution}</td?
                `;

                row.addEventListener("click", () => {
                    window.location.href = `events.html?docId=${doc.id}&database=customevents`;
                });

                eventTableBody.appendChild(row);
            }
        });
    }).catch((error) => {
        console.error("Error fetching events: ", error);
    });
}
loadEvents();

function goBack() {
    // Check if there's a previous page in the browser history
    if (window.history.length > 1) {
        window.history.back(); // Go back to the previous page
    // } else {
    //     // Fallback: Redirect to a default page (e.g., Event List)
    //     window.location.href = "eventlist.html";
    // }
}
}