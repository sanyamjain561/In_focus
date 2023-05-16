const cover = document.querySelector(".cover");
const addForm = document.querySelector(".add");
const search = document.querySelector(".search input");
const list = document.querySelector(".todos");
const heading = document.querySelector(".top-content");
const quotes = document.querySelector(".quotes");
const quoteButton = document.querySelector(".button-quote");
const pomoMinutes = document.querySelector(".pomoMinutes");
const pomoSeconds = document.querySelector(".pomoSeconds");
const breakMinutes = document.querySelector(".breakMinutes");
const breakSeconds = document.querySelector(".breakSeconds");
const startPomo = document.querySelector(".startPomo");
const pausePomo = document.querySelector(".pausePomo");
const startBreak = document.querySelector(".startBreak");
const pauseBreak = document.querySelector(".pauseBreak");
const reset = document.querySelector(".reset");
const totalPomo = document.querySelector(".totalPomo");
const totalTime = document.querySelector(".totaltime");
const focusButton = document.querySelector(".focus");
const breakButton = document.querySelector(".break");
const addNew = document.querySelector(".add-button");
const newTodo = document.querySelector(".form-control");

let today = new Date();
let time = "";
let currentHour = today.getHours();
let counter = 0;
let listArray = [];

//getting new Quotes
const getQuotes = async () => {
  const data = await fetch("https://type.fit/api/quotes");
  const quote = await data.json();
  return quote;
};
//Quote template
const generateQuoteTemplate = (data) => {
  let quoteId = Math.round(Math.random() * 1000);
  const newquote = `${data[quoteId].text}`;
  quotes.innerHTML = newquote;
};
//Todo list Template
const generateTemplate = (todo) => {
  const html = `<li class="list-group-item bg-light-box list-items hvr-grow">
  <span>${todo}</span>
       &nbsp <i class="far fa-trash-alt delete"></i>
      </li>`;
  list.innerHTML += html;
};
//Data Templates
const generateDataTemplate = (counter, hours = 0) => {
  totalPomo.innerText = `Total Pomos: ${counter}`;
  totalTime.innerText = `Total Time : ${hours} hrs`;
};
//Modal Template
const ModalTemplate = () => {
  const modal = `<div class="modal">Hello</div>`;
  cover.innerHTML = modal;
};
//changing greeting according to user time-zone
if (currentHour < 12) {
  time = "Good Morning";
} else if (currentHour >= 12 && currentHour < 16) {
  time = "Good Afternoon";
} else if (currentHour >= 16 && currentHour < 19) {
  time = "Good Evening";
} else if (currentHour >= 19) {
  time = "Good Night";
}
const html = `<h1 class="top-heading"> ${time} Sharad !</h1>`;
heading.innerHTML += html;

//getting random quotes
const newQuotes = () => {
  getQuotes()
    .then((data) => {
      generateQuoteTemplate(data);
    })
    .catch((err) => {
      console.log(err);
    });
};
newQuotes();

//PomoTimer
const focusTimer = () => {
  if (pomoMinutes.innerText == 0 && pomoSeconds.innerText == 0) {
    clearInterval(startTimer);
    counter++;
    let totalHours = ((counter * 25) / 60).toFixed(2);
    localStorage.setItem("counter", counter);
    localStorage.setItem("totalHours", totalHours);
    generateDataTemplate(counter, totalHours);
    resetPomo();
  } else if (pomoSeconds.innerText != 0) {
    pomoSeconds.innerText--;
  } else if (pomoMinutes.innerText != 0 && pomoSeconds.innerText == 0) {
    pomoMinutes.innerText--;
    pomoSeconds.innerText = 59;
  }
};

//breakTimer
const breakTimer = () => {
  if (breakMinutes.innerText == 0 && breakSeconds.innerText == 0) {
    clearInterval(breaktimer);
    resetBreak();
  } else if (breakSeconds.innerText != 0) {
    breakSeconds.innerText--;
  } else if (breakMinutes.innerText != 0 && breakSeconds.innerText == 0) {
    breakMinutes.innerText--;
    breakSeconds.innerText = 59;
  }
};
//reset values
const resetBreak = () => {
  breakMinutes.innerText = 5;
  breakSeconds.innerText = "00";
  breaktimer = undefined;
};
const resetPomo = () => {
  pomoMinutes.innerText = 25;
  pomoSeconds.innerText = "00";
  startTimer = undefined;
};
//click events on timers
let startTimer;
startPomo.addEventListener("click", () => {
  if (startTimer === undefined) {
    startTimer = setInterval(focusTimer, 1000);
  } else {
    alert("Timer already running!!!");
  }
  breakButton.innerText = "Focus Time";
  clearInterval(breaktimer);
  resetBreak();
});
pausePomo.addEventListener("click", () => {
  clearInterval(startTimer);
  startTimer = undefined;
});
//break
let breaktimer;
startBreak.addEventListener("click", () => {
  if (breaktimer === undefined) {
    breaktimer = setInterval(breakTimer, 1000);
  } else {
    alert("Timer already running!!!");
  }
  breakButton.innerText = "Break Time";
  clearInterval(startTimer);
});
pauseBreak.addEventListener("click", () => {
  clearInterval(breaktimer);
  breaktimer = undefined;
});
//reset button
reset.addEventListener("click", () => {
  localStorage.removeItem("counter");
  localStorage.removeItem("totalHours");
  totalPomo.innerText = `Total Pomos: 0`;
  totalTime.innerText = `Total Time : 0 hrs`;
  clearInterval(startTimer);
  clearInterval(breaktimer);
  resetPomo();
  resetBreak();
});
//Displaying Data
generateDataTemplate(counter);

//To-Do List
const filterTodos = (term) => {
  // add filter class
  Array.from(list.children)
    .filter((item) => !item.textContent.toLowerCase().includes(term))
    .forEach((item) => item.classList.add("filter"));

  // remove filter class
  Array.from(list.children)
    .filter((item) => item.textContent.toLowerCase().includes(term))
    .forEach((item) => item.classList.remove("filter"));
};

// adding todos event
addForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const todo = addForm.add.value.trim();
  if (todo.length) {
    generateTemplate(todo);
    addForm.reset();
    newTodo.classList.add("filter");
    addNew.classList.remove("filter");
    listArray.push(todo);
    localStorage.setItem("items", JSON.stringify(listArray));
  }
});

// delete todos event
list.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete")) {
    for (let i = 0; i < listArray.length; i++) {
      if (listArray[i].trim() === e.target.parentElement.innerText.trim()) {
        listArray.splice(i, 1);
        localStorage.setItem("items", JSON.stringify(listArray));
      }
    }
    e.target.parentElement.remove();
    console.log(listArray);
  }
});

// filter todos event
search.addEventListener("keyup", () => {
  const term = search.value.trim().toLowerCase();
  filterTodos(term);
});
addNew.addEventListener("click", () => {
  newTodo.classList.remove("filter");
  addNew.classList.add("filter");
});

//changing quote on button click
quoteButton.addEventListener("click", () => {
  newQuotes();
});
//Using Local Storage
if (localStorage.getItem("counter") || localStorage.getItem("totalHours")) {
  let counter = localStorage.getItem("counter");
  let totalHours = localStorage.getItem("totalHours");
  generateDataTemplate(counter, totalHours);
}
if (localStorage.getItem("items")) {
  listArray = JSON.parse(localStorage.getItem("items"));
  const mapArray = JSON.parse(localStorage.getItem("items"));
  mapArray.map((item) => {
    generateTemplate(item);
  });
}
