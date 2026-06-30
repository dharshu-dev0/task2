// ============================================
// FORGE — Build Tracker (Task 2: Vanilla JS)
// ============================================

// ---------- DOM ----------
const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");
const taskError = document.getElementById("task-error");
const taskEmpty = document.getElementById("task-empty");

const statTotal = document.getElementById("stat-total");
const statCompleted = document.getElementById("stat-completed");
const statPending = document.getElementById("stat-pending");

const progressFill = document.getElementById("progress-fill");
const progressPercent = document.getElementById("progress-percent");

const clearCompletedBtn = document.getElementById("clear-completed");

// ---------- DATA ----------
let tasks = [];
let nextId = 1;
let errorTimeout = null;

// ---------- RENDER ----------
function renderTasks() {

    taskList.innerHTML = "";

    tasks.forEach(task => {

        const li = document.createElement("li");

        li.className =
            "task-item" + (task.completed ? " completed" : "");

        li.dataset.id = task.id;

        li.innerHTML = `
            <button class="task-toggle" type="button">
                ${task.completed ? "✔" : "○"}
            </button>

            <span class="task-text">
                ${escapeHTML(task.text)}
            </span>

            <button class="task-remove" type="button">
                ✕
            </button>
        `;

        taskList.appendChild(li);

    });

    updateStats();
    updateEmptyState();

}

// ---------- STATS ----------
function updateStats() {

    const total = tasks.length;

    const completed =
        tasks.filter(task => task.completed).length;

    const pending = total - completed;

    statTotal.textContent = total;
    statCompleted.textContent = completed;
    statPending.textContent = pending;

    const percent =
        total === 0
            ? 0
            : Math.round((completed / total) * 100);

    progressFill.style.width = percent + "%";
    progressPercent.textContent = percent + "%";

}

// ---------- EMPTY STATE ----------
function updateEmptyState() {

    if (tasks.length === 0) {

        taskEmpty.style.display = "block";

    } else {

        taskEmpty.style.display = "none";

    }

}

// ---------- ESCAPE HTML ----------
function escapeHTML(str) {

    const div = document.createElement("div");

    div.textContent = str;

    return div.innerHTML;

}

// ---------- ERROR ----------
function showError(message) {

    taskError.textContent = message;

    clearTimeout(errorTimeout);

    errorTimeout = setTimeout(() => {

        taskError.textContent = "";

    }, 2500);

}

// ---------- ADD ----------
function addTask(text) {

    text = text.trim();

    if (text === "") {

        showError("Please enter a task.");

        return;

    }

    tasks.push({

        id: nextId++,

        text,

        completed: false

    });

    renderTasks();

}

// ---------- TOGGLE ----------
function toggleTask(id) {

    tasks = tasks.map(task =>

        task.id === id

            ? {

                ...task,

                completed: !task.completed

            }

            : task

    );

    renderTasks();

}

// ---------- REMOVE ----------
function removeTask(id) {

    if (!confirm("Delete this task?")) {

        return;

    }

    tasks = tasks.filter(task => task.id !== id);

    renderTasks();

}

// ---------- FORM ----------
taskForm.addEventListener("submit", function (e) {

    e.preventDefault();

    addTask(taskInput.value);

    taskInput.value = "";

    taskInput.focus();

});

// ---------- TASK EVENTS ----------
taskList.addEventListener("click", function (e) {

    const item = e.target.closest(".task-item");

    if (!item) return;

    const id = Number(item.dataset.id);

    if (e.target.classList.contains("task-remove")) {

        removeTask(id);

    }

    else if (

        e.target.classList.contains("task-toggle") ||

        e.target.classList.contains("task-text")

    ) {

        toggleTask(id);

    }

});

// ---------- CLEAR COMPLETED ----------
clearCompletedBtn.addEventListener("click", function () {

    tasks = tasks.filter(task => !task.completed);

    renderTasks();

});

// ---------- START ----------
renderTasks();