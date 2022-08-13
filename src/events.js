import { loadPage, taskModule, listModule } from './controller.js';
import { modal } from './modals.js';
import { taskDisplayController } from './tasksDisplay.js';

var modalEvents = (function () {
    const addInitialModalEvents = () => {
        let createTaskEvent = document.querySelector('.create-task-button');
        let addListEvent = document.querySelector('.add-list-button');
        let editListEvents = document.querySelectorAll('.edit-list-icon');

        createTaskEvent.addEventListener('click', function () {
            return loadPage.createTaskModal();
        });

        addListEvent.addEventListener('click', function () {
            return loadPage.createListModal();
        });

        editListEvents.forEach(function (editListEvent) {
            editListEvent.addEventListener('click', function (e) {
                let dataTitle = e.target.getAttribute('data-title');
                let dataId = e.target.getAttribute('data-id');
                return loadPage.createEditListModal(dataTitle, dataId);
            }
            );
        });

    }

    const addCancelEventListeners = () => {
        const cancelButtons = document.querySelectorAll('.cancel');
        cancelButtons.forEach(button => {
            button.addEventListener('click', function () {
                return modal.closeModal();
            }, false);
        });
    }

    const addTaskSubmitEventListener = () => {
        const taskForm = document.querySelector('#task-form');
        taskForm.addEventListener('submit', function () {
            const taskFormInfo = taskForm.elements;
            const taskName = taskFormInfo['title'].value.trim();
            const taskNotes = taskFormInfo['notes'].value.trim();
            const taskDueDate = taskFormInfo['due-date'].value.trim();
            const taskPriority = taskFormInfo['priority'].value.trim();
            const taskList = taskFormInfo['list'].value.trim();           
            return taskModule.createTaskItem(taskName, taskNotes, taskDueDate, taskPriority, taskList);
        }, false);
    }

    const addListFormSubmitEventListener = () => {
        const listForm = document.querySelector('#list-form');
        listForm.addEventListener('submit', function () {
            const listFormInfo = listForm.elements;
            const listName = listFormInfo['title'].value.trim();

            if (listName.length === 0) {
                return false;
            } else {
                return listModule.createListItem(listName);
            }
        }, false);
    }

    const addEditListFormSubmitEventListener = (currentListTitle, currentListId) => {
        const editListForm = document.querySelector('#list-edit-form');

        editListForm.addEventListener('click', function (e) {
            const editListFormInfo = editListForm.elements;
            const newListTitle = editListFormInfo['title'].value.trim();
            // e.preventDefault();
            if (newListTitle.length === 0) {
                return false;
            } else if (e.target.id === 'save-list-title') {
                return listModule.editListTitle(currentListTitle, currentListId, newListTitle);
            } else if (e.target.id === 'delete-list-title') {
                return listModule.removeList(currentListId);
            }

        }, false);
    }

    return {
        addInitialModalEvents: addInitialModalEvents,
        addCancelEventListeners: addCancelEventListeners,
        addTaskSubmitEventListener: addTaskSubmitEventListener,
        addListFormSubmitEventListener: addListFormSubmitEventListener,
        addEditListFormSubmitEventListener: addEditListFormSubmitEventListener
    }
})();

var taskDisplayEvents = (function () {
    const addInitialTaskDisplayEvents = () => {
        const taskShortcuts = document.querySelectorAll('.task-shortcut');
        const taskShortcutsEvents = {
            'today': taskDisplayController.getTodayList,
            'tomorrow': taskDisplayController.getTomorrowList,
            'next-7-days': taskDisplayController.getSevenDayList,
            'all-tasks': taskDisplayController.getAllTasksList
        }

        taskShortcuts.forEach(shortcut => {
            shortcut.addEventListener('click', function (e) {
                const taskId = e.target.getAttribute('id');
                const tasksContentDiv = document.querySelector('.tasks-content');
                tasksContentDiv.removeAttribute('id');
                return taskShortcutsEvents[taskId]();
            });
        });
    }
    return {
        addInitialTaskDisplayEvents: addInitialTaskDisplayEvents
    }
})();

var listDisplayEvents = (function () {
    const addInitialListDisplayEvents = () => {
        const listShortcuts = document.querySelectorAll('.list-shortcut');
        listShortcuts.forEach(shortcut => {
            shortcut.addEventListener('click', function (e) {
                const listTitle = e.target.getAttribute('data-title');
                const tasksContentDiv = document.querySelector('.tasks-content');
                tasksContentDiv.removeAttribute('id');
                return taskDisplayController.getListTasksList(listTitle);
            });
        });
    }
    return {
        addInitialListDisplayEvents: addInitialListDisplayEvents
    }
})();

var events = (function () {
    const addInitialEventListeners = () => {
        modalEvents.addInitialModalEvents();
        taskDisplayEvents.addInitialTaskDisplayEvents();
        listDisplayEvents.addInitialListDisplayEvents();
    }

    const addCancelEvents = () => {
        modalEvents.addCancelEventListeners();
    }

    const addTaskSubmitEvent = () => {
        modalEvents.addTaskSubmitEventListener();
    }

    const addListSubmitEvent = () => {
        modalEvents.addListFormSubmitEventListener();
    }

    const addEditListEvent = (title, id) => {
        modalEvents.addEditListFormSubmitEventListener(title, id);
    }

    return {
        addInitialEventListeners: addInitialEventListeners,
        addCancelEvents: addCancelEvents,
        addTaskSubmitEvent: addTaskSubmitEvent,
        addListSubmitEvent: addListSubmitEvent,
        addEditListEvent: addEditListEvent
    }
})();

export { events };