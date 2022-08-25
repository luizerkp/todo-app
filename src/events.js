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
        const addBtn = document.querySelector('#add-task');

        taskForm.addEventListener('submit', function () {
            addBtn.setAttribute('disabled', 'disabled');
            addBtn.style.cursor = 'wait';
            const taskFormInfo = taskForm.elements;
            const taskName = taskFormInfo['title'].value.trim();
            const taskNotes = taskFormInfo['notes'].value.trim();
            const taskDueDate = taskFormInfo['due-date'].value.trim();
            const taskPriority = taskFormInfo['priority'].value.trim();
            const taskListTitle = taskFormInfo['list-select'].value; 
            const taskListId = taskFormInfo['list-select'].options[taskFormInfo['list-select'].selectedIndex].getAttribute('data-id');
            // (taskName, taskNotes, taskDueDate, taskPriority, taskListTitle, taskListId);
            return taskModule.createTaskItem(taskName, taskNotes, taskDueDate, taskPriority, taskListTitle, taskListId);
        }, false);
    }

    const addListFormSubmitEventListener = () => {
        const listForm = document.querySelector('#list-form');
        const addBtn = document.querySelector('#add-list');
        listForm.addEventListener('submit', function () {
            addBtn.setAttribute('disabled', 'disabled');
            addBtn.style.cursor = 'wait';
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

        taskShortcuts.forEach(shortcut => {
            shortcut.addEventListener('click', function (e) {
                const taskId = e.target.getAttribute('id');
                localStorage.setItem('task-container-data-id', JSON.stringify(taskId));
                return taskDisplayController.selectTimeFrame(taskId);
            });
        });
    }

    const addTaskDetailsEvent = () => {
        const taskItems = document.querySelectorAll('.task-item');
        const taskDetailsDiv = document.querySelector('.task-details-container');
        taskItems.forEach(taskItem => {
            taskItem.addEventListener('click', function () {
                const taskId = taskItem.getAttribute('data-id');
                if (taskDetailsDiv.getAttribute('id' === 'hidden')) {
                    taskDetailsDiv.removeAttribute('id');
                }
                // (taskId);
                return taskDisplayController.getTaskDetails(taskId);
            });
        });
    }

    const addTaskDeleteEvent = () => {
        const deleteBtn = document.querySelector('#delete-task-btn');
        const taskId = deleteBtn.getAttribute('data-id');
        const taskListId = deleteBtn.getAttribute('data-list-id');

        deleteBtn.addEventListener('click', function () {
            const confirmMsg = "would you like to delete this task?\n**This action can not be undone!**"
            if (confirm(confirmMsg) === true) {
                return taskModule.removeTask(taskId, taskListId);
            } else {
                return false;
            }
        });
    }

    return {
        addInitialTaskDisplayEvents: addInitialTaskDisplayEvents,
        addTaskDetailsEvent: addTaskDetailsEvent,
        addTaskDeleteEvent: addTaskDeleteEvent,
    }
})();

var listDisplayEvents = (function () {
    const addInitialListDisplayEvents = () => {
        const listShortcuts = document.querySelectorAll('.list-shortcut');
        listShortcuts.forEach(shortcut => {
            shortcut.addEventListener('click', function (e) {
                const listTitle = e.target.getAttribute('data-title');
                const listId = e.target.getAttribute('data-id');
                localStorage.setItem('task-container-data-id', JSON.stringify(listId));
                return taskDisplayController.getListTasksList(listTitle, listId);
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

    const addTaskDetailsEvent = () => {
        taskDisplayEvents.addTaskDetailsEvent();
    }

    const addTaskDeleteEvents = () => {
        taskDisplayEvents.addTaskDeleteEvent();
    }
    return {
        addInitialEventListeners: addInitialEventListeners,
        addCancelEvents: addCancelEvents,
        addTaskSubmitEvent: addTaskSubmitEvent,
        addListSubmitEvent: addListSubmitEvent,
        addEditListEvent: addEditListEvent,
        addTaskDetailsEvent: addTaskDetailsEvent,
        addTaskDeleteEvents: addTaskDeleteEvents
    }
})();

export { events };