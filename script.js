Notification.requestPermission();

const waterGoal = 10;

let water = localStorage.getItem("water")
  ? parseInt(localStorage.getItem("water"))
  : 0;

let tasks = localStorage.getItem("tasks")
  ? JSON.parse(localStorage.getItem("tasks"))
  : [];

let darkMode =
  localStorage.getItem("darkMode") === "true";

if (darkMode) {
  document.body.classList.add("dark");
}

displayTasks();
updateWater();

function saveTasks() {
  localStorage.setItem(
    "tasks",
    JSON.stringify(tasks)
  );
}

function saveWater() {
  localStorage.setItem("water", water);
}

function addTask() {

  let taskInput =
    document.getElementById("taskInput");

  let taskTime =
    document.getElementById("taskTime");

  let text = taskInput.value.trim();

  let time = taskTime.value;

  let priority =
    document.getElementById(
      "taskPriority"
    ).value;

  if (text === "") {
    alert("Please enter a task");
    return;
  }

  tasks.push({
    text: text,
    time: time,
    priority: priority,
    completed: false,
    notified: false
  });

  saveTasks();

  displayTasks();

  taskInput.value = "";
  taskTime.value = "";
}

function displayTasks() {

  let taskList =
    document.getElementById("taskList");

  taskList.innerHTML = "";

  let searchText =
    document.getElementById(
      "searchInput"
    ).value.toLowerCase();

  tasks.forEach((task, index) => {

    if (
      !task.text
        .toLowerCase()
        .includes(searchText)
    ) {
      return;
    }

    let li =
      document.createElement("li");

    let leftDiv =
      document.createElement("div");

    leftDiv.className =
      "task-left";

    let checkbox =
      document.createElement("input");

    checkbox.type = "checkbox";

    checkbox.checked =
      task.completed;

    checkbox.onchange =
      function () {

        tasks[index].completed =
          checkbox.checked;

        saveTasks();

        displayTasks();
      };

    let span =
      document.createElement("span");

    span.innerText =
      task.text +
      " | " +
      task.time +
      " | " +
      task.priority;

    if (task.completed) {
      span.classList.add(
        "completed"
      );
    }

    if (task.priority === "High") {
      li.style.borderLeft =
        "6px solid red";
    }

    if (task.priority === "Medium") {
      li.style.borderLeft =
        "6px solid orange";
    }

    if (task.priority === "Low") {
      li.style.borderLeft =
        "6px solid green";
    }

    let editBtn =
      document.createElement("button");

    editBtn.innerText = "Edit";

    editBtn.onclick =
      function () {

        let updatedText =
          prompt(
            "Edit Task",
            task.text
          );

        if (
          updatedText !== null &&
          updatedText.trim() !== ""
        ) {

          tasks[index].text =
            updatedText.trim();

          saveTasks();

          displayTasks();
        }
      };

    let deleteBtn =
      document.createElement("button");

    deleteBtn.innerText =
      "Delete";

    deleteBtn.onclick =
      function () {

        tasks.splice(index, 1);

        saveTasks();

        displayTasks();
      };

    leftDiv.appendChild(
      checkbox
    );

    leftDiv.appendChild(
      span
    );

    li.appendChild(leftDiv);

    li.appendChild(editBtn);

    li.appendChild(deleteBtn);

    taskList.appendChild(li);
  });

  updateProgress();
}

function updateProgress() {

  let completedTasks =
    tasks.filter(
      task => task.completed
    ).length;

  let totalTasks =
    tasks.length;

  let percentage = 0;

  if (totalTasks > 0) {
    percentage =
      (completedTasks / totalTasks)
      * 100;
  }

  document.getElementById(
    "progressFill"
  ).style.width =
    percentage + "%";

  document.getElementById(
    "progressText"
  ).innerText =
    Math.round(percentage)
    + "% Completed";

  document.getElementById(
    "totalTasks"
  ).innerText =
    totalTasks;

  document.getElementById(
    "completedTasks"
  ).innerText =
    completedTasks;
}

function updateWater() {

  document.getElementById(
    "waterStatus"
  ).innerText =
    water +
    " / " +
    waterGoal +
    " Glasses Completed";

  let percentage =
    (water / waterGoal) * 100;

  if (percentage > 100) {
    percentage = 100;
  }

  document.getElementById(
    "waterProgress"
  ).style.width =
    percentage + "%";

  document.getElementById(
    "waterStat"
  ).innerText =
    water +
    "/" +
    waterGoal;
}

function drinkWater() {

  if (water < waterGoal) {

    water++;

    saveWater();

    updateWater();

    if (water === waterGoal) {

      alert(
        "Daily Water Goal Completed!"
      );
    }
  }
}

function resetWater() {

  water = 0;

  saveWater();

  updateWater();
}

function clearCompleted() {

  tasks = tasks.filter(
    task => !task.completed
  );

  saveTasks();

  displayTasks();
}

function toggleDarkMode() {

  document.body.classList.toggle(
    "dark"
  );

  let isDark =
    document.body.classList.contains(
      "dark"
    );

  localStorage.setItem(
    "darkMode",
    isDark
  );
}

setInterval(() => {

  let now = new Date();

  let currentTime =
    now.getHours()
      .toString()
      .padStart(2, "0")
    +
    ":"
    +
    now.getMinutes()
      .toString()
      .padStart(2, "0");

  tasks.forEach(task => {

    if (
      task.time === currentTime &&
      !task.completed &&
      !task.notified
    ) {

      new Notification(
        "Task Reminder",
        {
          body: task.text
        }
      );

      alert(
        "Reminder: " +
        task.text
      );

      task.notified = true;

      saveTasks();
    }

  });

}, 60000);

if ("serviceWorker"
  in navigator) {

  navigator.serviceWorker
    .register(
      "service-worker.js"
    )

    .then(() => {

      console.log(
        "Service Worker Registered"
      );
    });
}