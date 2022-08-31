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
            });
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
            return taskModule.createTaskItem(taskName, taskNotes, taskDueDate, taskPriority, taskListTitle, taskListId);
        });
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
        });
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

        });
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
                taskDisplayController.reomoveSelected();
                taskItem.classList.add('selected');
                return taskDisplayController.getTaskDetails(taskId);
            });
        });
    }

    const addTaskCompleteEvent = () => {
        const taskStatusBtns = document.querySelectorAll('.task-status-btn');
        taskStatusBtns.forEach(taskStatusBtn => {
            taskStatusBtn.addEventListener('click', function (e) {
                // prevents task details from showing when toggleling complete on/off
                e.stopPropagation();
                let taskId = taskStatusBtn.parentElement.parentElement.parentElement.getAttribute('data-id')
                let taskListId = taskStatusBtn.parentElement.parentElement.parentElement.getAttribute('data-list-id')
                return taskDisplayController.changeStatus(taskId, taskListId)
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
        addTaskCompleteEvent: addTaskCompleteEvent
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

    const addTasksEvents = () => {
        taskDisplayEvents.addTaskDetailsEvent();
        taskDisplayEvents.addTaskCompleteEvent();
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
        addTasksEvents: addTasksEvents,
        addTaskDeleteEvents: addTaskDeleteEvents
    }
})();

export { events };