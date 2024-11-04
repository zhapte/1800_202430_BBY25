function sayHello() {
    
}
sayHello();

const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
let currentMonth = 9; // October
let currentYear = 2024;

function updateCalendar() {
    document.getElementById("month-year").innerText = `${monthNames[currentMonth]} ${currentYear}`;
    
    // Clear the current grid slots
    const calendarGrid = document.getElementById("calendar-grid");
    calendarGrid.innerHTML = `
        <div class="day-label">Sunday</div>
        <div class="day-label">Monday</div>
        <div class="day-label">Tuesday</div>
        <div class="day-label">Wednesday</div>
        <div class="day-label">Thursday</div>
        <div class="day-label">Friday</div>
        <div class="day-label">Saturday</div>
    `;

    // Get the number of days in the month
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    // Start day of the week (0 = Sunday, 1 = Monday, etc.)
    const startDay = new Date(currentYear, currentMonth, 1).getDay();

    // Add empty slots for days before the start day
    for (let i = 0; i < startDay; i++) {
        calendarGrid.innerHTML += '<div class="time-slot"></div>';
    }

    // Add day slots for each day in the month
    for (let day = 1; day <= daysInMonth; day++) {
        calendarGrid.innerHTML += `<div class="time-slot">${day}</div>`;
    }
}

function prevMonth() {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    updateCalendar();
}

function nextMonth() {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    updateCalendar();
}

// Initialize calendar on page load
document.addEventListener("DOMContentLoaded", updateCalendar);