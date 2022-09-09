import { loadPage, taskModule, listModule } from "./controller";
import modal from "./modals";
import taskDisplayController from "./tasksDisplay";

const modalEvents = (() => {
  const addCancelEventListeners = () => {
    const cancelButtons = document.querySelectorAll(".cancel");
    cancelButtons.forEach((button) => {
      button.addEventListener("click", () => modal.closeModal());
    });
  };

  const addTaskSubmitEventListener = () => {
    const taskForm = document.querySelector("#task-form");
    const addBtn = document.querySelector("#add-task");

    taskForm.addEventListener("submit", () => {
      addBtn.setAttribute("disabled", "disabled");
      addBtn.style.cursor = "wait";
      const taskFormInfo = taskForm.elements;
      const taskTitle = taskFormInfo.title.value.trim();
      const taskNotes = taskFormInfo.notes.value.trim();
      const taskDueDate = taskFormInfo["due-date"].value.trim();
      const taskPriority = taskFormInfo.priority.value.trim();
      const taskListTitle = taskFormInfo["list-select"].value;
      const taskListId =
        taskFormInfo["list-select"].options[taskFormInfo["list-select"].selectedIndex].getAttribute("data-id");
      return taskModule.createTaskItem(taskTitle, taskDueDate, taskPriority, taskListTitle, taskListId, taskNotes);
    });
  };

  const addListFormSubmitEventListener = () => {
    const listForm = document.querySelector("#list-form");
    const addBtn = document.querySelector("#add-list");
    listForm.addEventListener("submit", () => {
      addBtn.setAttribute("disabled", "disabled");
      addBtn.style.cursor = "wait";
      const listFormInfo = listForm.elements;
      const listName = listFormInfo.title.value.trim();
      return listModule.createListItem(listName);
    });
  };

  const addEditListFormSubmitEventListener = (currentListTitle, currentListId) => {
    const editListForm = document.querySelector("#list-edit-form");

    editListForm.addEventListener("click", (e) => {
      const editListFormInfo = editListForm.elements;
      const newListTitle = editListFormInfo.title.value.trim();

      if (newListTitle.length > 0) {
        if (e.target.id === "save-list-title") {
          return listModule.editListTitle(currentListTitle, currentListId, newListTitle);
        }

        if (e.target.id === "delete-list-title") {
          return listModule.removeList(currentListId);
        }
      }
      return false;
    });
  };

  const addInitialModalEvents = () => {
    const createTaskEvent = document.querySelector(".create-task-button");
    const addListEvent = document.querySelector(".add-list-button");
    const editListEvents = document.querySelectorAll(".edit-list-icon");

    createTaskEvent.addEventListener("click", () => {
      loadPage.createTaskModal();
      addCancelEventListeners();
      addTaskSubmitEventListener();
    });

    addListEvent.addEventListener("click", () => {
      loadPage.createListModal();
      addListFormSubmitEventListener();
      addCancelEventListeners();
    });

    editListEvents.forEach((editListEvent) => {
      editListEvent.addEventListener("click", (e) => {
        const dataTitle = e.target.getAttribute("data-title");
        const dataId = e.target.getAttribute("data-id");
        loadPage.createEditListModal(dataTitle, dataId);
        addCancelEventListeners();
        addEditListFormSubmitEventListener(dataTitle, dataId);
      });
    });
  };

  return {
    addInitialModalEvents,
  };
})();

const taskDisplayEvents = (() => {
  const addTaskDeleteEvent = () => {
    const deleteBtn = document.querySelector("#delete-task-btn");
    const taskId = deleteBtn.getAttribute("data-id");
    const taskListId = deleteBtn.getAttribute("data-list-id");

    deleteBtn.addEventListener("click", () => {
      const confirmMsg = "Would you like to delete this task?\n**This action can not be undone!**";

      if (window.confirm(confirmMsg) === true) {
        return taskModule.removeTask(taskId, taskListId);
      }
      return false;
    });
  };

  const addTaskDetailsEvent = () => {
    const taskItems = document.querySelectorAll(".task-item");
    taskItems.forEach((taskItem) => {
      taskItem.addEventListener("click", () => {
        const taskId = taskItem.getAttribute("data-id");
        taskDisplayController.removeSelected();
        taskItem.classList.add("selected");
        taskDisplayController.getTaskDetails(taskId);
        addTaskDeleteEvent();
      });
    });
  };

  const addTaskCompleteEvent = () => {
    const taskStatusBtns = document.querySelectorAll(".task-status-btn");
    taskStatusBtns.forEach((taskStatusBtn) => {
      taskStatusBtn.addEventListener("click", (e) => {
        // prevents task details from showing when toggleling complete on/off
        e.stopPropagation();
        const taskId = taskStatusBtn.parentElement.parentElement.parentElement.getAttribute("data-id");
        const taskListId = taskStatusBtn.parentElement.parentElement.parentElement.getAttribute("data-list-id");
        return taskModule.changeTaskStatus(taskId, taskListId);
      });
    });
  };

  const addInitialTaskDisplayEvents = () => {
    const taskShortcuts = document.querySelectorAll(".task-shortcut");

    taskShortcuts.forEach((shortcut) => {
      shortcut.addEventListener("click", (e) => {
        const taskId = e.target.getAttribute("id");
        localStorage.setItem("task-container-data-id", JSON.stringify(taskId));
        taskDisplayController.selectTimeFrame(taskId);
        addTaskDetailsEvent();
        addTaskCompleteEvent();
      });
    });
  };

  return {
    addInitialTaskDisplayEvents,
    addTaskDetailsEvent,
    addTaskCompleteEvent,
  };
})();

const listDisplayEvents = (() => {
  const addInitialListDisplayEvents = () => {
    const listShortcuts = document.querySelectorAll(".list-shortcut");
    listShortcuts.forEach((shortcut) => {
      shortcut.addEventListener("click", (e) => {
        const listTitle = e.target.getAttribute("data-title");
        const listId = e.target.getAttribute("data-id");
        localStorage.setItem("task-container-data-id", JSON.stringify(listId));
        taskDisplayController.getListTasksList(listTitle, listId);
        taskDisplayEvents.addTaskDetailsEvent();
        taskDisplayEvents.addTaskCompleteEvent();
      });
    });
  };

  return {
    addInitialListDisplayEvents,
  };
})();

const events = (() => {
  const addInitialEventListeners = () => {
    modalEvents.addInitialModalEvents();
    taskDisplayEvents.addInitialTaskDisplayEvents();
    listDisplayEvents.addInitialListDisplayEvents();
  };

  return {
    addInitialEventListeners,
  };
})();

export default events;
