import { v4 as uuidv4 } from "uuid";
import sideMenuContent from "./sideMenu";
import modal from "./modals";
import taskDisplayController from "./tasksDisplay";

function listFactory(title, tasks) {
  return {
    title,
    tasks,
    id: uuidv4(),
  };
}

function tasksFactory(title, dueDate, priority, listTitle, listId, notes = null) {
  return {
    title,
    notes,
    dueDate,
    priority,
    listTitle,
    listId,
    completed: false,
    id: uuidv4(),
  };
}

/* source:
    https://developer.mozilla.org/en-US/docs/Web/API/
    Web_Storage_API/Using_the_Web_Storage_API
*/
function storageAvailable(type) {
  let storage;
  try {
    storage = window[type];
    const x = "__storage_test__";
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  } catch (e) {
    return (
      e instanceof DOMException &&
      // everything except Firefox
      (e.code === 22 ||
        // Firefox
        e.code === 1014 ||
        // test name field too, because code might not be present
        // everything except Firefox
        e.name === "QuotaExceededError" ||
        // Firefox
        e.name === "NS_ERROR_DOM_QUOTA_REACHED") &&
      // acknowledge QuotaExceededError only if there's something already stored
      storage &&
      storage.length !== 0
    );
  }
}

const initialLoad = (() => {
  const listsList = document.createElement("ul");
  listsList.classList.add("lists-list");
  let lists = [];

  const buildListItem = (item) => {
    const listItem = document.createElement("li");
    listItem.classList.add("list-shortcut");
    listItem.dataset.id = item.id;
    listItem.dataset.title = item.title;

    const editIcon = document.createElement("i");
    editIcon.classList.add("material-icons-round", "edit-list-icon");
    editIcon.textContent = "edit";

    editIcon.dataset.id = item.id;
    editIcon.dataset.title = item.title;

    listItem.innerText = item.title.length > 14 ? `${item.title.substring(0, 14)}...` : item.title;
    listItem.appendChild(editIcon);

    return listItem;
  };

  const buildDefaultLists = () => {
    const defaultListsTitles = ["Personal", "Work", "Groceries"];
    const defaultLists = [];
    defaultListsTitles.forEach((listTitle) => {
      const list = listFactory(listTitle, []);
      defaultLists.push(list);
    });

    defaultLists.forEach((list) => {
      const listItem = buildListItem(list);
      listsList.appendChild(listItem);
    });

    lists = defaultLists;
    localStorage.setItem("lists", JSON.stringify(lists));
    document.location.reload();
  };

  const buildPageDisplay = () => {
    if (lists) {
      lists.forEach((list) => {
        const listItem = buildListItem(list);
        listsList.appendChild(listItem);
      });
    } else {
      buildDefaultLists();
    }
  };

  const chekStorage = storageAvailable("localStorage");
  const storageErrorMsg = "Local Storage Unavilable page will reload, if problem persist please contact the developer";

  if (chekStorage) {
    lists = JSON.parse(localStorage.getItem("lists"));
    buildPageDisplay();
  } else {
    // alert user and reload
    alert(storageErrorMsg);
    document.window.location.reload();
  }

  return {
    getListsList: () => listsList,
    getLists: () => lists,
  };
})();

const taskModule = (() => {
  const lists = initialLoad.getLists();

  const createTaskItem = (title, dueDate, priority, listTitle, listId, notes) => {
    const task = tasksFactory(title, dueDate, priority, listTitle, listId, notes);

    lists.some((list) => {
      if (list.id === task.listId) {
        list.tasks.push(task);
        localStorage.setItem("lists", JSON.stringify(lists));
        return true;
      }
      return false;
    });
  };

  const removeTask = (taskId, taskListId) => {
    lists.some((list) => {
      if (list.id === taskListId) {
        const taskIndex = list.tasks.findIndex((task) => task.id === taskId);
        list.tasks.splice(taskIndex, 1);
        localStorage.setItem("lists", JSON.stringify(lists));
        taskDisplayController.updateFomattedTasks();
        taskDisplayController.removeTaskFromDisplay(taskId);
        return true;
      }
      return false;
    });
  };

  const changeTaskStatus = (taskId, taskListId) => {
    lists.some((list) => {
      if (list.id === taskListId) {
        const curretnTask = list.tasks.find((task) => task.id === taskId);

        // if completed is set to false the set it to true and vice versa
        curretnTask.completed = curretnTask.completed === false;
        localStorage.setItem("lists", JSON.stringify(lists));
        taskDisplayController.changeCompleteStatus(curretnTask.id);
        taskDisplayController.updateFomattedTasks();
        return true;
      }
      return false;
    });
  };

  return {
    createTaskItem,
    removeTask,
    changeTaskStatus,
  };
})();

const listModule = (() => {
  const lists = initialLoad.getLists();

  const createListItem = (listTitle) => {
    const list = listFactory(listTitle, []);
    lists.push(list);
    localStorage.setItem("lists", JSON.stringify(initialLoad.getLists()));
  };

  const editListTitle = (currentListTitle, listId, newListTitle) => {
    // if title has changed, update list title in localStorage
    if (currentListTitle !== newListTitle) {
      lists.some((list) => {
        if (list.id === listId) {
          list.title = newListTitle;
          localStorage.setItem("lists", JSON.stringify(lists));
          return true;
        }
        return false;
      });
    }
  };

  const removeList = (listId) => {
    lists.some((list, index) => {
      if (list.id === listId) {
        lists.splice(index, 1);
        localStorage.setItem("lists", JSON.stringify(lists));
        return true;
      }
      return false;
    });
  };

  return {
    createListItem,
    editListTitle,
    removeList,
  };
})();

const loadPage = (() => {
  const contentDiv = document.createElement("div");
  contentDiv.classList.add("container");

  const restorePrevState = () => {
    const previousTaskContainerDataId = JSON.parse(localStorage.getItem("task-container-data-id"));

    const defaultToAllTasks = document.querySelector("#all-tasks");
    let previousTaskConatainer;

    // retrive task container div via data-id if it exists
    if (previousTaskContainerDataId) {
      previousTaskConatainer = document.querySelector(`[data-id = '${previousTaskContainerDataId}']`);
    }

    // simulate click on shortcut if it exists
    if (previousTaskConatainer) {
      previousTaskConatainer.click();
    } else {
      defaultToAllTasks.click();
    }
  };

  const buildPage = () => {
    // creates the skeleton of side menu and the add buttons for tasks and lists
    const sideMenuDiv = sideMenuContent.getSideMenuDiv();
    contentDiv.appendChild(sideMenuDiv);

    // displays current tasks
    const tasksDisplayDiv = taskDisplayController.getMainTaskContainer();
    contentDiv.appendChild(tasksDisplayDiv);

    // gets current lists of lists and appends afterend of the add-list-button
    const listsList = initialLoad.getListsList();
    const addListButton = document.querySelector(".add-list-button");
    addListButton.insertAdjacentElement("afterend", listsList);
  };

  const createTaskModal = () => {
    const createTaskModalHeader = "Create Task";
    const createTaskModalId = "task-modal";

    // handle modal display
    modal.getTaskModal();
    modal.openModal(createTaskModalHeader, createTaskModalId);
  };

  const createListModal = () => {
    const createListModalHeader = "Create List";
    const createListModalId = "list-modal";

    // handle modal display
    modal.getListModal();
    modal.openModal(createListModalHeader, createListModalId);
  };

  const createEditListModal = (listTitle) => {
    const createEditListModalHeader = "Edit List";
    const createEditListModalId = "edit-list-modal";
    modal.getListEditModal(listTitle);
    modal.openModal(createEditListModalHeader, createEditListModalId);
  };

  return {
    getContentDiv: () => contentDiv,
    createTaskModal,
    createListModal,
    createEditListModal,
    buildPage,
    restorePrevState,
  };
})();

export { loadPage, taskModule, listModule };
