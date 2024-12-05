function loadEvents() {
    const eventTableBody = document.getElementById("eventTableBody");
    eventTableBody.innerHTML = ""; // Clear existing rows

    // code sourced from a combination of Carly's demo and Aaron's example
    //uses for each loop to get every document in the city event and populate the table on the page.
    db.collection("cityevents").get().then((snapshot) => {
        snapshot.forEach((doc) => {
            const event = doc.data();
            const row = document.createElement("tr");

            row.classList.add("clickable-row");


            row.setAttribute("data-id", event.name);

            // Populate row with event data
            //map each data to the specific table.
            row.innerHTML = `
                <td>${event.name}</td>
                <td>${event.groupSize}</td>
                <td>${event.goal}</td>
                <td>${event.eventdes}</td>
                <td>$${event.contribution}</td>
            `;


            row.addEventListener("click", () => {
                //adde event listener tothe rows so that when it is clicked it will be passed to the detail page.
                window.location.href = `events.html?docId=${doc.id}&database=cityevents`;
            });
            //row aaded to the table.
            eventTableBody.appendChild(row);
        });
    }).catch((error) => {
        console.error("Error fetching events: ", error);
    });
}
loadEvents();

// function goBack() {
//     // Check if there's a previous page in the browser history
//     if (window.history.length > 1) {
//         window.history.back(); // Go back to the previous page
//     // } else {
//     //     // Fallback: Redirect to a default page (e.g., Event List)
//     //     window.location.href = "eventlist.html";
//     // }
// }
// }