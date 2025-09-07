const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");

// Load tasks on page load
window.onload = loadTasks;

function addTask() {
  const taskText = taskInput.value.trim();
  if (!taskText) return alert("Please enter a task");

  const task = { text: taskText, completed: false };
  addTaskToDOM(task);
  saveTask(task);
  taskInput.value = "";
}

function addTaskToDOM(task) {
  const li = document.createElement("li");
  li.textContent = task.text;
  li.draggable = true;

  if (task.completed) li.classList.add("completed");

  // Drag events
  li.addEventListener("dragstart", (e) => {
    li.classList.add("dragging");
    e.dataTransfer.setData("text/plain", task.text);
  });
  li.addEventListener("dragend", () => li.classList.remove("dragging"));
  li.addEventListener("dragover", (e) => {
    e.preventDefault();
    const dragging = document.querySelector(".dragging");
    if (dragging && dragging !== li) {
      const rect = li.getBoundingClientRect();
      const offset = e.clientY - rect.top;
      if (offset > rect.height / 2) li.after(dragging);
      else li.before(dragging);
    }
  });
  li.addEventListener("drop", saveTasksOrder);

  // Toggle complete
  li.addEventListener("click", () => {
    li.classList.toggle("completed");
    updateTaskStatus(task.text, li.classList.contains("completed"));
  });

  // Delete button
  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "X";
  deleteBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    li.remove();
    deleteTask(task.text);
  });
  li.appendChild(deleteBtn);

  taskList.appendChild(li);
}

// Save a new task
function saveTask(task) {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Load tasks
function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach(task => addTaskToDOM(task));
}

// Update completion status
function updateTaskStatus(text, completed) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks = tasks.map(task => task.text === text ? { ...task, completed } : task);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Delete task
function deleteTask(text) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks = tasks.filter(task => task.text !== text);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Clear all tasks
function clearAllTasks() {
  if (confirm("Are you sure you want to delete all tasks?")) {
    localStorage.removeItem("tasks");
    taskList.innerHTML = "";
  }
}

// Save tasks order after drag
function saveTasksOrder() {
  const tasks = [];
  taskList.querySelectorAll("li").forEach(li => {
    tasks.push({
      text: li.childNodes[0].textContent,
      completed: li.classList.contains("completed")
    });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}
