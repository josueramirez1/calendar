import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  addMonths,
  subMonths,
} from "date-fns";

// Selectors
const datePicker = document.querySelector(".date-picker");
const datePickerHeader = document.querySelector(".current-month");
const datePickerBtn = document.querySelector(".date-picker-button");
const datePickerGrid = document.querySelector(".date-picker-grid-dates");
const nextMontBtn = document.querySelector(".next-month-button");
const prevMontBtn = document.querySelector(".prev-month-button");
// DATES TO USE
let dates = Array.from(document.querySelectorAll(".date"));
let currentDate = new Date();
let month = format(currentDate, "MMMM");
let year = format(currentDate, "yyyy");
let firstDayOfMonth = startOfMonth(currentDate);
let firstDayOfNextMonthIndex = startOfMonth(addMonths(firstDayOfMonth, 1));
let firstDayOfMonthIndex = firstDayOfMonth.getDay();
let lastDayOfMonth = endOfMonth(currentDate);
let formattedLastDayOfMonth = format(lastDayOfMonth, "d");
let prevLastDayOfMonth = endOfMonth(subMonths(lastDayOfMonth, 1));
let formattedPrevLastDayOfMonth = parseInt(format(prevLastDayOfMonth, "d"));
let monthCount = 0;
let defaultFormattedDate = currentDate.getDay();

let activeCalendarDays = eachDayOfInterval({
  start: firstDayOfMonth,
  end: lastDayOfMonth,
}).map((day) => {
  return format(day, "d");
});

let activeCalwBtn = activeCalendarDays.map((active) => {
  let button = document.createElement("button");
  button.classList.add("date");
  button.textContent = active;
  return button;
});

displayCalendar();
datePicker.classList.remove("show");
datePickerBtn.textContent = format(currentDate, `MMMM do, yyyy`);
datePickerHeader.textContent = format(currentDate, `MMMM - yyyy`);
dates.forEach((box, index) => {
  if (index === defaultFormattedDate) {
    box.classList.add("selected");
  }
});

// EVENT LISTENER /////////////////

document.addEventListener("click", (e) => {
  if (e.target.matches(".date-picker-button")) {
    datePicker.classList.toggle("show");
  }

  if (e.target.matches(".date")) {
    dates.forEach((box) => {
      box.classList.remove("selected");
    });
    selectingDay(e);
  }
});

nextMontBtn.addEventListener("click", (e) => {
  // This variable is updated by one month in order to be used to find the first and last days of the month in question. The header is also updated.
  monthCount++;
  currentDate = addMonths(new Date(), monthCount);
  datePickerHeader.textContent = format(currentDate, `MMMM - yyyy`);
  firstDayOfMonth = startOfMonth(currentDate);
  lastDayOfMonth = endOfMonth(currentDate);

  activeCalendarDays = eachDayOfInterval({
    start: firstDayOfMonth,
    end: lastDayOfMonth,
  }).map((day) => {
    return format(day, "d");
  });

  activeCalwBtn = activeCalendarDays.map((active) => {
    let button = document.createElement("button");
    button.classList.add("date");
    button.textContent = active;
    return button;
  });
  // This variable lets me find the index of the first day of the month (What day of the week the month started on(Ex. "3" would mean Tuesday and so on))
  firstDayOfMonthIndex = firstDayOfMonth.getDay();
  displayCalendar();
});
prevMontBtn.addEventListener("click", (e) => {
  // This variable is updated by one month in order to be used to find the first and last days of the month in question. The header is also updated.
  monthCount--;
  currentDate = addMonths(new Date(), monthCount);
  datePickerHeader.textContent = format(currentDate, `MMMM - yyyy`);

  firstDayOfMonth = startOfMonth(currentDate);
  lastDayOfMonth = endOfMonth(currentDate);

  activeCalendarDays = eachDayOfInterval({
    start: firstDayOfMonth,
    end: lastDayOfMonth,
  }).map((day) => {
    return format(day, "d");
  });

  let activeCalwBtn = activeCalendarDays.map((active) => {
    let button = document.createElement("button");
    button.classList.add("date");
    button.textContent = active;
    return button;
  });
  // This variable lets me find the index of the first day of the month (What day of the week the month started on(Ex. "3" would mean Tuesday and so on))
  firstDayOfMonthIndex = firstDayOfMonth.getDay();

  displayCalendar();
});

// HELPER FUNCTION ////////////////

function selectingDay(e) {
  month = format(currentDate, `MMMM`);
  year = format(currentDate, `yyyy`);

  if (
    e.target.matches(".date") &&
    !e.target.matches(".date-picker-other-month-date")
  ) {
    e.target.classList.add("selected");
    let capturedDate = e.target.textContent;
    let newDatePickerHeaderBtnDate = convertToOrdinal(capturedDate);
    datePickerBtn.textContent = `${month} ${newDatePickerHeaderBtnDate}, ${year}`;
  }
}

function convertToOrdinal(num) {
  if (num === "1" || num === "21" || num === "31") {
    return num + "st";
  } else if (num === "2" || num === "22") {
    return num + "nd";
  } else if (num === "3" || num === "23") {
    return num + "rd";
  } else return num + "th";
}

function displayCalendar() {
  datePickerGrid.textContent = "";
  let pastDayCounter = formattedPrevLastDayOfMonth;
  prevLastDayOfMonth = endOfMonth(subMonths(lastDayOfMonth, 1));
  firstDayOfNextMonthIndex = startOfMonth(addMonths(firstDayOfMonth, 1));
  formattedPrevLastDayOfMonth = parseInt(format(prevLastDayOfMonth, "d"));

  formattedLastDayOfMonth = format(lastDayOfMonth, "d");

  for (let i = 1; i <= firstDayOfMonthIndex; i++) {
    let button = document.createElement("button");
    button.classList.add("date", "date-picker-other-month-date");
    button.textContent = pastDayCounter - (firstDayOfMonthIndex - 1);
    datePickerGrid.appendChild(button);
    pastDayCounter++;
  }

  activeCalwBtn.forEach((day, index) => {
    datePickerGrid.appendChild(day);
  });

  for (let i = firstDayOfNextMonthIndex.getDay(); i < 7; i++) {
    let button = document.createElement("button");
    button.classList.add("date");
    button.classList.add("date-picker-other-month-date");
    button.textContent =
      firstDayOfNextMonthIndex.getDate() -
      firstDayOfNextMonthIndex.getDay() +
      i;

    datePickerGrid.append(button);
  }

  dates = Array.from(document.querySelectorAll(".date"));
}
