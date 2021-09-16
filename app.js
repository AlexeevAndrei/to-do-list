// Форма
// Список задач
const tasks = [];

(function (arrOfTasks) {
  const objOfTasks = arrOfTasks.reduce((acc, task) => {
    acc[task._id] = task;
    return acc;
  }, {});

  const themes = {
    default: {
      "--base-text-color": "#212529",
      "--header-bg": "#007bff",
      "--header-text-color": "#fff",
      "--default-btn-bg": "#007bff",
      "--default-btn-text-color": "#fff",
      "--default-btn-hover-bg": "#0069d9",
      "--default-btn-border-color": "#0069d9",
      "--danger-btn-bg": "#dc3545",
      "--danger-btn-text-color": "#fff",
      "--danger-btn-hover-bg": "#bd2130",
      "--danger-btn-border-color": "#dc3545",
      "--input-border-color": "#ced4da",
      "--input-bg-color": "#fff",
      "--input-text-color": "#495057",
      "--input-focus-bg-color": "#fff",
      "--input-focus-text-color": "#495057",
      "--input-focus-border-color": "#80bdff",
      "--input-focus-box-shadow": "0 0 0 0.2rem rgba(0, 123, 255, 0.25)",
    },
    dark: {
      "--base-text-color": "#212529",
      "--header-bg": "#343a40",
      "--header-text-color": "#fff",
      "--default-btn-bg": "#58616b",
      "--default-btn-text-color": "#fff",
      "--default-btn-hover-bg": "#292d31",
      "--default-btn-border-color": "#343a40",
      "--default-btn-focus-box-shadow":
        "0 0 0 0.2rem rgba(141, 143, 146, 0.25)",
      "--danger-btn-bg": "#b52d3a",
      "--danger-btn-text-color": "#fff",
      "--danger-btn-hover-bg": "#88222c",
      "--danger-btn-border-color": "#88222c",
      "--input-border-color": "#ced4da",
      "--input-bg-color": "#fff",
      "--input-text-color": "#495057",
      "--input-focus-bg-color": "#fff",
      "--input-focus-text-color": "#495057",
      "--input-focus-border-color": "#78818a",
      "--input-focus-box-shadow": "0 0 0 0.2rem rgba(141, 143, 146, 0.25)",
    },
    light: {
      "--base-text-color": "#212529",
      "--header-bg": "#fff",
      "--header-text-color": "#212529",
      "--default-btn-bg": "#fff",
      "--default-btn-text-color": "#212529",
      "--default-btn-hover-bg": "#e8e7e7",
      "--default-btn-border-color": "#343a40",
      "--default-btn-focus-box-shadow":
        "0 0 0 0.2rem rgba(141, 143, 146, 0.25)",
      "--danger-btn-bg": "#f1b5bb",
      "--danger-btn-text-color": "#212529",
      "--danger-btn-hover-bg": "#ef808a",
      "--danger-btn-border-color": "#e2818a",
      "--input-border-color": "#ced4da",
      "--input-bg-color": "#fff",
      "--input-text-color": "#495057",
      "--input-focus-bg-color": "#fff",
      "--input-focus-text-color": "#495057",
      "--input-focus-border-color": "#78818a",
      "--input-focus-box-shadow": "0 0 0 0.2rem rgba(141, 143, 146, 0.25)",
    },
  };

  let lastSelectedTheme = localStorage.getItem("app_theme") || "default";

  const listContainer = document.querySelector(
    ".tasks-list-section .list-group"
  );
  const form = document.forms["addTask"];
  const inputTitle = form.elements["title"];
  const inputBody = form.elements["body"];
  const allTasksBtn = document.querySelector(".btn-all-tasks");
  const uncompletedTasksBtn = document.querySelector(".btn-uncompleted-tasks");
  const themeSelect = document.getElementById("themeSelect");

  // Events
  setTheme(lastSelectedTheme);
  themeSelect.value = lastSelectedTheme;

  renderAllTasks(objOfTasks);

  form.addEventListener("submit", onFormSubmitHandler);
  listContainer.addEventListener("click", onDeletehandler);
  listContainer.addEventListener("click", onCompletedhandler);
  uncompletedTasksBtn.addEventListener("click", showUncomletedTaskshandler);
  allTasksBtn.addEventListener("click", showAllTasks);
  themeSelect.addEventListener("change", onThemeSelectHandler);

  function renderAllTasks(tasksList) {
    if (!tasksList) {
      console.error("Передайте список задач!");
      return;
    }

    if (Object.keys(tasksList).length === 0) {
      createEmptyList();
    }

    const fragment = document.createDocumentFragment();
    Object.values(tasksList).forEach((task) => {
      const li = listItemTemplate(task);
      fragment.appendChild(li);
    });
    listContainer.appendChild(fragment);
  }

  function emptyListTemplate() {
    const div = document.createElement("div");
    div.classList.add("d-flex", "justify-content-center", "empty-message");
    const span = document.createElement("span");
    span.textContent = "Список задач пуст";
    span.style.fontWeight = "bold";
    div.appendChild(span);

    return div;
  }

  function createEmptyList() {
    const emptyList = emptyListTemplate();
    listContainer.appendChild(emptyList);
  }

  function listItemTemplate({ _id, title, body, completed } = {}) {
    const li = document.createElement("li");
    li.classList.add(
      "list-group-item",
      "d-flex",
      "align-items-center",
      "flex-wrap",
      "mt-2",
      "justify-content-end",
      "uncomplete-task"
    );
    li.setAttribute("data-task-id", _id);

    const span = document.createElement("span");
    span.classList.add("w-100");
    span.textContent = title;
    span.style.fontWeight = "bold";

    const article = document.createElement("p");
    article.textContent = body;
    article.classList.add("mt-2", "w-100");

    const completedBtn = document.createElement("button");
    completedBtn.textContent = "Завершить задачу";
    completedBtn.classList.add("btn", "btn-success", "mr-2", "comleted-btn");

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Удалить задачу";
    deleteBtn.classList.add("btn", "btn-danger", "delete-btn");

    if (completed) {
      li.classList.add("list-group-item-success");
      li.classList.remove("uncomplete-task");
      completedBtn.textContent = "Убрать из завершенных";
    }

    li.appendChild(span);
    li.appendChild(article);
    li.appendChild(completedBtn);
    li.appendChild(deleteBtn);

    return li;
  }

  function onFormSubmitHandler(e) {
    e.preventDefault();
    const titleValue = inputTitle.value;
    const bodyValue = inputBody.value;

    if (!titleValue || !bodyValue) {
      alert("Пожалуйста введите название и тело задачи");
      return;
    }

    const emptyList = document.querySelector(".empty-message");
    if (emptyList) {
      emptyList.remove();
    }

    const task = createNewTask(titleValue, bodyValue);
    const listItem = listItemTemplate(task);
    listContainer.insertAdjacentElement("afterbegin", listItem);
    form.reset();
  }

  function createNewTask(title, body) {
    const newTask = {
      title,
      body,
      completed: false,
      _id: `task-${Math.random()}`,
    };

    objOfTasks[newTask._id] = newTask;
    return { ...newTask };
  }

  function deleteTask(id) {
    const { title } = objOfTasks[id];
    const isConfirm = confirm(`Вы точно хотите удалить задачу: ${title}`);
    if (!isConfirm) return isConfirm;
    delete objOfTasks[id];

    if (Object.keys(objOfTasks).length === 0) {
      createEmptyList();
    }

    return isConfirm;
  }

  function deleteTaskFromHtml(confirmed, el) {
    if (!confirmed) return;
    el.remove();
  }

  function onDeletehandler({ target }) {
    if (target.classList.contains("delete-btn")) {
      const parent = target.closest("[data-task-id]");
      const id = parent.dataset.taskId;
      const confirmed = deleteTask(id);
      deleteTaskFromHtml(confirmed, parent);
    }
  }

  function changeStatusOfTask(id) {
    objOfTasks[id].completed = !objOfTasks[id].completed;

    return objOfTasks[id].completed;
  }

  function changeStatusOfTaskFromHtml(el) {
    el.classList.toggle("list-group-item-success");
    el.classList.toggle("uncomplete-task");
    if (el.classList.contains("filter-uncomplete")) {
      el.classList.add("hide");
    }
  }

  function onCompletedhandler({ target }) {
    if (target.classList.contains("comleted-btn")) {
      const parent = target.closest("[data-task-id]");
      const id = parent.dataset.taskId;
      const completed = changeStatusOfTask(id);
      changeStatusOfTaskFromHtml(parent);

      if (completed) {
        target.textContent = "Убрать из завершенных";
      } else {
        target.textContent = "Завершить задачу";
      }
    }
  }

  function showUncomletedTaskshandler({ target }) {
    if (target.classList.contains("btn-uncompleted-tasks")) {
      document.querySelectorAll(".uncomplete-task").forEach((task) => {
        task.classList.add("filter-uncomplete");
      });
      document.querySelectorAll(".list-group-item-success").forEach((task) => {
        task.classList.add("hide");
      });
    }
  }

  function showAllTasks({ target }) {
    if (target.classList.contains("btn-all-tasks")) {
      document.querySelectorAll(".uncomplete-task").forEach((task) => {
        task.classList.remove("filter-uncomplete");
      });
      document.querySelectorAll(".list-group-item-success").forEach((task) => {
        task.classList.remove("hide");
      });
    }
  }

  function onThemeSelectHandler() {
    const selectedTheme = themeSelect.value;
    const isConfirmed = confirm(
      `Вы действительно хотите изменить тему на: ${selectedTheme}?`
    );
    if (!isConfirmed) {
      themeSelect.value = lastSelectedTheme;
      return;
    }
    setTheme(selectedTheme);
    lastSelectedTheme = selectedTheme;
    localStorage.setItem("app_theme", selectedTheme);
  }

  function setTheme(name) {
    const selectedThemeObj = themes[name];
    Object.entries(selectedThemeObj).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value);
    });
  }
})(tasks);
