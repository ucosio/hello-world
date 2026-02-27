const defaultLanes = [
  "Backlog de tareas",
  "En curso",
  "Bloqueada",
  "UAT",
  "Finalizada",
  "Descartada",
];

const board = document.getElementById("board");
const laneDialog = document.getElementById("lane-dialog");
const taskDialog = document.getElementById("task-dialog");
const laneForm = document.getElementById("lane-form");
const taskForm = document.getElementById("task-form");
const laneNameInput = document.getElementById("lane-name");
const taskStatusSelect = document.getElementById("task-status");
const taskTemplate = document.getElementById("task-template");

const state = {
  lanes: [...defaultLanes],
  tasks: [],
};

function renderBoard() {
  board.innerHTML = "";

  state.lanes.forEach((laneName) => {
    const laneElement = document.createElement("section");
    laneElement.className = "lane";
    laneElement.dataset.lane = laneName;

    const header = document.createElement("header");
    header.className = "lane-header";

    const title = document.createElement("h2");
    title.className = "lane-title";
    title.textContent = laneName;

    const count = document.createElement("span");
    count.className = "count";

    const laneTasks = state.tasks.filter((task) => task.status === laneName);
    count.textContent = `${laneTasks.length} tarea(s)`;

    header.append(title, count);

    const list = document.createElement("ul");
    list.className = "lane-tasks";

    laneTasks.forEach((task) => {
      const card = taskTemplate.content.firstElementChild.cloneNode(true);
      card.querySelector(".task-title").textContent = task.title;
      if (task.blockedDate) {
        card.classList.add("blocked");
      }

      const metadata = card.querySelector(".task-metadata");
      const details = [
        ["Asignada", task.assignee || "Sin asignar"],
        ["Inicio", task.startDate || "-"],
        ["Fin", task.endDate || "-"],
        ["Bloqueo", task.blockedDate || "-"],
        ["Comentarios", task.comments || "Sin comentarios"],
        ["Adjuntos", task.attachments.length ? task.attachments.join(", ") : "Sin adjuntos"],
      ];

      details.forEach(([label, value]) => {
        const dt = document.createElement("dt");
        const dd = document.createElement("dd");
        dt.textContent = label;
        dd.textContent = value;
        metadata.append(dt, dd);
      });

      const li = document.createElement("li");
      li.append(card);
      list.append(li);
    });

    laneElement.append(header, list);
    board.append(laneElement);
  });

  refreshStatusOptions();
}

function refreshStatusOptions() {
  taskStatusSelect.innerHTML = "";
  state.lanes.forEach((lane) => {
    const option = document.createElement("option");
    option.value = lane;
    option.textContent = lane;
    taskStatusSelect.append(option);
  });
}

function addLane(name) {
  const normalized = name.trim();
  if (!normalized) {
    return;
  }

  const exists = state.lanes.some((lane) => lane.toLowerCase() === normalized.toLowerCase());
  if (exists) {
    alert("Ya existe un carril con ese nombre.");
    return;
  }

  state.lanes.push(normalized);
  renderBoard();
}

function addTask(formData) {
  const attachmentsInput = formData.getAll("attachments");
  const attachments = attachmentsInput
    .filter((file) => file instanceof File && file.name)
    .map((file) => file.name);

  const newTask = {
    title: String(formData.get("title") || "").trim(),
    assignee: String(formData.get("assignee") || "").trim(),
    startDate: String(formData.get("startDate") || ""),
    endDate: String(formData.get("endDate") || ""),
    blockedDate: String(formData.get("blockedDate") || ""),
    comments: String(formData.get("comments") || "").trim(),
    status: String(formData.get("status") || state.lanes[0]),
    attachments,
  };

  if (!newTask.title) {
    alert("El nombre de la tarea es obligatorio.");
    return;
  }

  state.tasks.push(newTask);
  renderBoard();
}

document.getElementById("add-lane-button").addEventListener("click", () => {
  laneDialog.showModal();
  laneNameInput.focus();
});

document.getElementById("add-task-button").addEventListener("click", () => {
  refreshStatusOptions();
  taskDialog.showModal();
});

laneForm.addEventListener("submit", (event) => {
  event.preventDefault();
  addLane(laneNameInput.value);
  laneForm.reset();
  laneDialog.close();
});

taskForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(taskForm);
  addTask(data);
  taskForm.reset();
  taskDialog.close();
});

document.querySelectorAll("[data-close]").forEach((button) => {
  button.addEventListener("click", () => {
    const dialog = document.getElementById(button.dataset.close);
    dialog.close();
  });
});

renderBoard();
