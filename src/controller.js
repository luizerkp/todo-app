import { sideMenuContent } from "./sideMenu.js";
import { modal } from "./modals.js";
import { events } from "./events.js";
import { taskDisplayController } from "./tasksDisplay.js";
import { v4 as uuidv4 } from '../node_modules/uuid'

var listFactory =  (title, tasks) => {
    return {
        title: title,
        tasks: tasks,
        id: uuidv4()
    }
}

function tasksFactory (title, notes = null, dueDate, priority, listTitle, listId) {
    return {
        title: title,
        notes: notes,
        dueDate: dueDate,
        priority: priority,
        listTitle: listTitle,
        listId: listId,
        id: uuidv4()
    }
}

// source https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API
function storageAvailable(type) {
    let storage;
    try {
        storage = window[type];
        const x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }
    catch(e) {
        return e instanceof DOMException && (
            // everything except Firefox
            e.code === 22 ||
            // Firefox
            e.code === 1014 ||
            // test name field too, because code might not be present
            // everything except Firefox
            e.name === 'QuotaExceededError' ||
            // Firefox
            e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
            // acknowledge QuotaExceededError only if there's something already stored
            (storage && storage.length !== 0);
    }
}

var initialLoad = (function () {
    const chekStorage = storageAvailable('localStorage');
    const listsList = document.createElement('ul');
    listsList.classList.add('lists-list');
    let lists = [];

    const buildListItem = (item) => {
        const listItem = document.createElement('li');
        listItem.classList.add('list-shortcut');
        listItem.dataset.id = item.id;
        listItem.dataset.title = item.title;

        const editIcon = document.createElement('i');
        editIcon.classList.add('material-icons-round', 'edit-list-icon');
        editIcon.textContent = 'edit';

        editIcon.dataset.id = item.id;
        editIcon.dataset.title = item.title;
        
        listItem.innerText = item.title.length > 14 ? item.title.substring(0, 14) + '...' : item.title;
        listItem.appendChild(editIcon);

        return listItem;
    }

    const buildDefaultLists = () => {
        let defaultListsTitles = ['Personal', 'Work', 'Groceries'];
        let defaultLists = [];
        defaultListsTitles.forEach(function (listTitle) {
            let list = listFactory(listTitle, []);
            defaultLists.push(list);
        });

        defaultLists.forEach(function (list) {
            let listItem = buildListItem(list);
            listsList.appendChild(listItem);
        });

        lists = defaultLists;
        localStorage.setItem('lists', JSON.stringify(lists));
        location.reload()
    }
    
    const buildPageDisplay = () => {
        if (lists) {
            lists.forEach(function (list) {
                let listItem = buildListItem(list);
                listsList.appendChild(listItem);
            });
        } else {
            buildDefaultLists();
        }
    }

    if (chekStorage) {
        lists = JSON.parse(localStorage.getItem('lists'));
        buildPageDisplay();   
        console.log(lists);
    } else {
        // alert user and reload
        if(!alert("Local Storage Unavilable page will reload, if problem persist please contact the developer")){window.location.reload();}
    }

    return {
        getListsList: () => listsList,
        getLists: () => lists,
    }
})();

var taskModule = (function () {
    let lists = initialLoad.getLists();

    const createTaskItem = ( title, notes, dueDate, priority, listTitle, listId) => {
        let task = tasksFactory(title, notes, dueDate, priority, listTitle, listId);

        lists.some(function (list) {
            if (list.id === task.listId) {
                list.tasks.push(task);
                localStorage.setItem('lists', JSON.stringify(lists));
                return true;
            }
        });
    }

    const removeTask = (taskId, taskListId) => {
        lists.some(function (list) {
            if (list.id === taskListId) {
                let taskIndex = list.tasks.findIndex(task => task.id === taskId);
                list.tasks.splice(taskIndex, 1);
                return true;
            }
        });
        localStorage.setItem('lists', JSON.stringify(lists));
        document.location.reload();
    }

    return {
        createTaskItem: createTaskItem,
        removeTask: removeTask
    }
})();

var listModule = (function () {
    let lists = initialLoad.getLists();

    const createListItem = (listTitle) => {
        let list = listFactory(listTitle, []);
            lists.push(list);
            localStorage.setItem('lists', JSON.stringify(initialLoad.getLists()));
            console.log(JSON.parse(localStorage.getItem('lists')));
    }

    const editListTitle= (currentListTitle, listId, newListTitle) => {
        // if title has changed, update list title in localStorage
        if (currentListTitle === newListTitle) {
            return false;
        } else {
            lists.some(function (list) {
                if (list.id === listId) {
                    list.title = newListTitle;
                    localStorage.setItem('lists', JSON.stringify(lists));
                }
            });
        }    
    }

    const removeList = (listId) => {
        lists.some(function (list, index) {
            if (list.id === listId) {
                lists.splice(index, 1);
                localStorage.setItem('lists', JSON.stringify(lists));
            }
        });
    }

    return {
        createListItem: createListItem,
        editListTitle: editListTitle,
        removeList: removeList
    }
})();

var loadPage = (function() {
    const contentDiv = document.createElement('div');
    contentDiv.classList.add('container');

    const restorePrevState = () => {
        const previousTaskContainerDataId = JSON.parse(localStorage.getItem('task-container-data-id'));
        let previousTaskConatainer;
        // retrive task container div via data-id if it exists
        if (previousTaskContainerDataId) {
            previousTaskConatainer = document.querySelector(`[data-id = "${previousTaskContainerDataId}"]`)
        }

        // simulate click on shortcut if it exists
        if (previousTaskConatainer) {
            previousTaskConatainer.click();
        }
    }

    const buildPage = () => {
        // creates the skeleton of side menu and the add buttons for tasks and lists
        const sideMenuDiv = sideMenuContent.getSideMenuDiv();
        contentDiv.appendChild(sideMenuDiv);

        // displays current tasks
        const tasksDisplayDiv = taskDisplayController.getMainTaskContainer();
        contentDiv.appendChild(tasksDisplayDiv);
        
        // gets current lists of lists and appends afterend of the add-list-button
        const listsList= initialLoad.getListsList();
        const addListButton =  document.querySelector('.add-list-button');
        addListButton.insertAdjacentElement('afterend', listsList);
    };

    const createTaskModal= () => {
        const createTaskModalHeader = "Create Task";
        const createTaskModalId = "task-modal";

        // handle modal display
        modal.getTaskModal();
        modal.openModal(createTaskModalHeader, createTaskModalId);

        // handle events listeners
        events.addCancelEvents();
        events.addTaskSubmitEvent();
    }

    const createListModal = () => {
        const createListModalHeader = 'Create List';
        const createListModalId = 'list-modal';

        // handle modal display
        modal.getListModal();
        modal.openModal(createListModalHeader, createListModalId);

        // handle events listeners
        events.addCancelEvents();
        events.addListSubmitEvent();
    }

    const createEditListModal = (listTitle, listId) => {
        const createEditListModalHeader = 'Edit List';
        const createEditListModalId = 'edit-list-modal';
        modal.getListEditModal(listTitle);
        modal.openModal(createEditListModalHeader, createEditListModalId);

        events.addCancelEvents();
        events.addEditListEvent(listTitle, listId);
    }

    return {
        createTaskModal: createTaskModal,
        createListModal: createListModal,
        createEditListModal: createEditListModal,
        buildPage: buildPage,
        getContentDiv: () => contentDiv,
        restorePrevState: restorePrevState
    }
})();

export { loadPage, taskModule, listModule };