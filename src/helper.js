import { sideMenuContent } from "./sideMenu.js";
import { modal } from "./modals.js";
import { events } from "./events.js";

var listFactory =  (title, tasks) => {
    return {
        title: title,
        tasks: tasks,
        addTasks: function (task) {
            this.tasks.push(task);
        },
        removeTask: function (task) {
            this.tasks.splice(this.tasks.indexOf(task), 1);
        }
    }
}

function tasksFactory (title, notes = null, dueDate, priority, list) {
    return {
        title: title,
        notes: notes,
        dueDate: dueDate,
        priority: priority,
        list: list
    }
}

var initialLoad = (function () {
    const chekStorage = storageAvailable('localStorage');
    const listsList = document.createElement('ul');
    listsList.classList.add('lists-list');
    let lists = [];

    const buildDefaultLists = () => {
        let defaultListsTitles = ['Personal', 'Work', 'Groceries'];
        let defaultLists = [];
        defaultListsTitles.forEach(function (listTitle) {
            let list = listFactory(listTitle, []);
            defaultLists.push(list);
        });

        defaultLists.forEach(function (list) {
            const listItem = document.createElement('li');
            listItem.classList.add('list-item');
            listItem.setAttribute('id', list.title.toLowerCase().replace(/\s/g, '-'));
            listItem.innerText = list.title;
            listsList.appendChild(listItem);
        });

        lists = defaultLists;
        localStorage.setItem('lists', JSON.stringify(lists));
    }

    if (chekStorage) {
        lists = JSON.parse(localStorage.getItem('lists'));
        console.log(lists);
        if (lists) {
            lists.forEach(function (list) {
                // console.log(Object.getPrototypeOf(list));
                const listItem = document.createElement('li');
                listItem.classList.add('list-item');
                listItem.setAttribute('id', list.title.toLowerCase().replace(/\s/g, '-'));
                listItem.textContent = list.title;
                listsList.appendChild(listItem);
            });
        } else {
            buildDefaultLists();
        }
    }

    return {
        // ul element listsList
        getListsList: () => listsList,
        buildDefaultLists: buildDefaultLists,
        getLists: () => lists
    }
})();

var createTask = (function () {
    let lists = initialLoad.getLists();

    const createTaskItem = ( title, notes, dueDate, priority, list) => {
        let task = tasksFactory(title, notes, dueDate, priority, list);

        lists.forEach(function (list) {
            if (list.title.toLowerCase() === task.list.toLowerCase()) {
                list.addTasks(task);
            } else {
                console.log('List not found');
            }
        });
        localStorage.setItem('lists', JSON.stringify(lists));

        console.log(JSON.parse(localStorage.getItem('lists')));
    }
    return {
        createTaskItem: createTaskItem
    }
})();

var createList = (function () {
    const createListItem = (listTitle) => {
        let list = listFactory(listTitle, []);
        initialLoad.getLists().push(list);
        localStorage.setItem('lists', JSON.stringify(initialLoad.getLists()));
        console.log(JSON.parse(localStorage.getItem('lists')));
    }
    return {
        createListItem: createListItem
    }
})();

var loadPage = (function() {
    const contentDiv = document.createElement('div');
    contentDiv.classList.add('container');

    const sideMenuDiv = sideMenuContent.getSideMenuDiv();
    contentDiv.appendChild(sideMenuDiv);

    const buildPage = () => {
        const header =  document.querySelector('#lists-header');
        const listsList= initialLoad.getListsList();
        header.insertAdjacentElement('afterend', listsList);
    };

    const createTask = () => {
        const createTaskModalHeader = "Create Task";
        const createTaskModalId = "task-modal";
        // handle modal display
        modal.getTaskModal();
        modal.openModal(createTaskModalHeader, createTaskModalId);

        // handle events listeners
        events.addCancelEvents();
        events.addTaskSubmitEvent();
    }

    const createList = () => {
        const createListModalHeader = 'Create List';
        const createListModalId = 'list-modal';

        // handle modal display
        modal.getListModal();
        modal.openModal(createListModalHeader, createListModalId);

        // handle events listeners
        events.addCancelEvents();
        events.addListSubmitEvent();
    }

    return {
        createTask: createTask,
        createList: createList,
        buildPage: buildPage,
        getContentDiv: () => contentDiv
    }
})();

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

export { loadPage, createTask, createList };