import { sideMenuContent } from "./sideMenu.js";
import { modal } from "./modals.js";
import { events } from "./events.js";

var listFactory =  (title, tasks) => {
    
    return {
        title: title,
        tasks: tasks,
        // removeTask (task) {
        //     this.tasks.splice(this.tasks.indexOf(task), 1);
        // }
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
        listItem.classList.add('list-item');
        listItem.setAttribute('id', item.title.toLowerCase().replace(/\s/g, '-'));

        const editIcon = document.createElement('i');
        editIcon.classList.add('material-icons-round', 'edit-list-icon');
        editIcon.textContent = 'edit';
        editIcon.setAttribute('data-title', item.title);

        listItem.innerText = item.title;
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
    }

    if (chekStorage) {
        lists = JSON.parse(localStorage.getItem('lists'));
        console.log(lists);
        if (lists) {
            lists.forEach(function (list) {
                let listItem = buildListItem(list);
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

var taskModule = (function () {
    let lists = initialLoad.getLists();

    const createTaskItem = ( title, notes, dueDate, priority, list) => {
        let task = tasksFactory(title, notes, dueDate, priority, list);

        lists.some(function (list) {
            if (list.title.toLowerCase() === task.list.toLowerCase()) {
                list.tasks.push(task);
                return true;
            }
        });
        localStorage.setItem('lists', JSON.stringify(lists));

        console.log(JSON.parse(localStorage.getItem('lists')));
    }
    return {
        createTaskItem: createTaskItem
    }
})();

var listModule = (function () {
    let lists = initialLoad.getLists();
    const listExistsMessage = 'List with this title already exists';   
    const listNotFoundMessage = 'List not found';
    const titleHasChangedMessage = 'List Title has changed';

    const alreadyExists = (title) => {
        let exists = false;
        lists.some(function (list) {
            if (list.title.toLowerCase() === title.toLowerCase()) {
                exists = true;
            }
        });
        return exists;
    }

    const checkListTitles = (oldValue, newValue) => {
        let listTitleStatus = {
            newTitleExists: false,
            oldAndNewTitleAreSame: false,
        }

        if (oldValue !== null && (newValue.toLowerCase() === oldValue.toLowerCase())) {
            listTitleStatus.oldAndNewTitleAreSame = true;
        }

        if (alreadyExists(newValue)) {
            listTitleStatus.newTitleExists = true;
        }
        
        return listTitleStatus;
    }

    const alertUser = (listTitleStatus, action) => {
        const errorType = {
            'create': function () {
                // if list title already exists - show error message
                if (listTitleStatus.newTitleExists) {
                    alert(listExistsMessage);
                    return false;
                }
            },
            'edit': function () {
                // if title exists and is not the same as the old one - show error message
                if (listTitleStatus.newTitleExists && !listTitleStatus.oldAndNewTitleAreSame) {
                    alert(listExistsMessage);
                } 
            },
            'delete': function () {
                // if title does not exists - show error message
                if (!listTitleStatus.newTitleExists) {
                   alert(listNotFoundMessage);
                } else if (!listTitleStatus.oldAndNewTitleAreSame) {
                    alert(titleHasChangedMessage);
                }
            }
        }
        errorType[action]();
    }

    const createListItem = (listTitle) => {
        let list = listFactory(listTitle, []);
        let listTitleStatus = checkListTitles(null, listTitle);
        const actionType = 'create';

        if (Object.values(listTitleStatus).includes(true)) {
            return alertUser(listTitleStatus, actionType);
        } else {
            lists.push(list);
            localStorage.setItem('lists', JSON.stringify(initialLoad.getLists()));
            console.log(JSON.parse(localStorage.getItem('lists')));
        }
    }

    const editListTitle= (oldTitle, newTitle) => {
        let listTitleStatus = checkListTitles(oldTitle, newTitle);
        const actionType = 'edit';

        // if new title exists and/or is the same as the old one call alertUser function else edit list title
        if (Object.values(listTitleStatus).includes(true)) {
            return alertUser(listTitleStatus, actionType);
        } else {
            lists.some(function (list) {
                if (list.title.toLowerCase() === oldTitle.toLowerCase()) {
                    list.title = newTitle;
                }
            });
            localStorage.setItem('lists', JSON.stringify(lists));
        }
    }

    const removeList = (oldTitle, newTitle) => {
        let listTitleStatus = checkListTitles(oldTitle, newTitle);
        const actionType = 'delete';

        // if new title exists and is not the same as the old one call alertUser function else remove list from lists array
        if (Object.values(listTitleStatus).includes(false)) {
            return alertUser(listTitleStatus, actionType);
        } else {
            lists.some(function (list, index) {
                if (list.title.toLowerCase() === newTitle.toLowerCase()) {
                    lists.splice(index, 1);
                }
            });
        }
        
        localStorage.setItem('lists', JSON.stringify(lists));
    }

    return {
        createListItem: createListItem,
        editListTitle: editListTitle,
        removeList: removeList,
        alreadyExists: alreadyExists
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

    const createEditListModal = (listTitle) => {
        const createEditListModalHeader = 'Edit List';
        const createEditListModalId = 'edit-list-modal';

        modal.getListEditModal(listTitle);
        modal.openModal(createEditListModalHeader, createEditListModalId);

        events.addCancelEvents();
        events.addEditListEvent(listTitle);
    }

    return {
        createTaskModal: createTaskModal,
        createListModal: createListModal,
        createEditListModal: createEditListModal,
        buildPage: buildPage,
        getContentDiv: () => contentDiv
    }
})();



export { loadPage, taskModule, listModule };