import { loadPage, taskModule, listModule } from './controller.js';
import { modal } from './modals.js';

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
                return loadPage.createEditListModal(dataTitle);
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
        // console.log(taskForm);
        taskForm.addEventListener('submit', function (e) {
            // e.preventDefault();
            const taskFormInfo = taskForm.elements;
            const taskName = taskFormInfo['title'].value;
            const taskNotes = taskFormInfo['notes'].value;
            const taskDueDate = taskFormInfo['due-date'].value;
            const taskPriority = taskFormInfo['priority'].value;
            const taskList = taskFormInfo['list'].value;
            
            return taskModule.createTaskItem(taskName, taskNotes, taskDueDate, taskPriority, taskList);
            // console.log(taskName, taskNotes, taskDueDate, taskPriority, taskList);
            // modal.closeModal();
        }, false);
    }

    const addListFormSubmitEventListener = () => {
        const listForm = document.querySelector('#list-form');
        listForm.addEventListener('submit', function () {
            // e.preventDefault();
            // console.log('list form submit');
            const listFormInfo = listForm.elements;
            const listName = listFormInfo['title'].value;
            return listModule.createListItem(listName);
        }, false);
    }

    const addEditListFormSubmitEventListener = (currentTitle) => {
        const editListForm = document.querySelector('#list-edit-form');
        const listActions = {
            'save-list-title': listModule.editListTitle,
            'delete-list-title': listModule.removeList
        }

        editListForm.addEventListener('click', function (e) {
            const editListFormInfo = editListForm.elements;
            const newListTitle = editListFormInfo['title'].value.trim();

            if (!e.target.matches('button') || newListTitle.length === 0) {
                return false;

            } else {
                // if id is save-list-title, editListTitle is called with newListTitle and currentTitle else deleteList is called with currentTitle
                return listActions[e.target.id](currentTitle, newListTitle); 
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

var events = (function () {
    const addInitialEventListeners = () => {
        modalEvents.addInitialModalEvents();
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

    const addEditListEvent = (title) => {
        modalEvents.addEditListFormSubmitEventListener(title);
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