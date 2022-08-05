import { sideMenuContent } from "./sideMenu.js";
import { modal } from "./modals.js";
import { events } from "./events.js";

function listFactory (title, tasks) {
    return {
        title: title,
        tasks: tasks.map(function (task) {
            return task;
        }, []),
        addTask: function (task) {
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
        let defaultListsTitles = ['Groceries', 'Work', 'Personal'];
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
        if (lists) {
            lists.forEach(function (list) {
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
        getListsList: () => listsList,
        buildDefaultLists: buildDefaultLists,
        getLists: () => lists
    }

})();

// var createTask = (function () {
//     let lists = initialLoad.getLists();

// })();

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
        modal.getTaskModal();
        const modalDiv = document.querySelector('.modal');
        const modalContent = document.querySelector('.modal-content');
        modalDiv.classList.add('show-modal');
        modalContent.setAttribute('id', 'task-modal');
        modal.buildHeader('Create Task');
        events.addCancelEvents(modalDiv, modalContent);
    }

    const createList = () => {
        modal.getListModal();
        const modalDiv = document.querySelector('.modal');
        modalDiv.classList.add('show-modal');
        const modalContent = document.querySelector('.modal-content');
        modalContent.setAttribute('id', 'list-modal');
        modal.buildHeader('Create List');
        events.addCancelEvents(modalDiv, modalContent);
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

export { loadPage };