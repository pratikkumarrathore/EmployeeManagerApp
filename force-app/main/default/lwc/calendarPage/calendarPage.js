import { LightningElement } from 'lwc';

export default class CalendarPage extends LightningElement {
    currentDate = new Date();
    currentMonth = this.currentDate.getMonth();
    currentYear = this.currentDate.getFullYear();

    // LWC Lifecycle hook to run code once the component is inserted into the DOM
    renderedCallback() {
        // Initial call to generate the calendar
        this.generateCalendar(this.currentMonth, this.currentYear);
    }

    // Function to generate the calendar for the selected month and year
    generateCalendar(month, year) {
        // Query the calendar elements using LWC's template syntax
        const calendarBody = this.template.querySelector('.calendar-body');
        const monthAndYear = this.template.querySelector('.monthAndYear');

        // Clear existing cells
        calendarBody.innerHTML = '';

        // Define month names and days in the month
        const months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        const daysInMonth = [31, this.isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

        // Display month and year
        monthAndYear.textContent = `${months[month]} ${year}`;

        // Get the first day of the month
        const firstDay = new Date(year, month).getDay();

        // Create the rows for the calendar
        let date = 1;
        for (let i = 0; i < 6; i++) { // 6 rows for the weeks
            let row = document.createElement('tr');

            // Create each cell for the week
            for (let j = 0; j < 7; j++) {
                if (i === 0 && j < firstDay) {
                    // Empty cells before the first day of the month
                    let cell = document.createElement('td');
                    let cellText = document.createTextNode('');
                    cell.appendChild(cellText);
                    row.appendChild(cell);
                } else if (date > daysInMonth[month]) {
                    // Stop creating cells when the days of the month are exhausted
                    break;
                } else {
                    // Create cells with the date
                    let cell = document.createElement('td');
                    let cellText = document.createTextNode(date);
                    cell.appendChild(cellText);

                    // Highlight the current date
                    if (
                        date === this.currentDate.getDate() &&
                        month === this.currentDate.getMonth() &&
                        year === this.currentDate.getFullYear()
                    ) {
                        cell.classList.add('current-date');
                    }

                    row.appendChild(cell);
                    date++;
                }
            }

            calendarBody.appendChild(row); // Append the row to the calendar body
        }
    }

    // Check if the year is a leap year
    isLeapYear(year) {
        return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
    }

    // Handler for previous month button
    handlePrevMonth() {
        this.currentMonth = this.currentMonth === 0 ? 11 : this.currentMonth - 1;
        this.currentYear = this.currentMonth === 11 ? this.currentYear - 1 : this.currentYear;
        this.generateCalendar(this.currentMonth, this.currentYear);
    }

    // Handler for next month button
    handleNextMonth() {
        this.currentMonth = this.currentMonth === 11 ? 0 : this.currentMonth + 1;
        this.currentYear = this.currentMonth === 0 ? this.currentYear + 1 : this.currentYear;
        this.generateCalendar(this.currentMonth, this.currentYear);
    }
}
