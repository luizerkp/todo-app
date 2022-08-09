import { loadPage, taskModule, listModule } from './helper.js';
import { modal } from './modals.js';

var modalEvents = (function () {
    const addInitialModalEvents = () => {
        let createTaskEvent = document.querySelector('.create-task-button');
        let addListEvent = document.querySelector('.add-list-button');
        let editListEvents = document.querySelectorAll('.edit-list-icon');

        createTaskEvent.addEventListener('click', function () {
            loadPage.createTaskModal();
        });

        addListEvent.addEventListener('click', function () {
            loadPage.createListModal();
        });

        editListEvents.forEach(function (editListEvent) {
            editListEvent.addEventListener('click', function (e) {
                let dataTitle = e.target.getAttribute('data-title');
                loadPage.createEditListModal(dataTitle);
            }
            );
        });

    }
    
    const addCancelEventListeners = () => {
        const cancelButtons = document.querySelectorAll('.cancel');
        cancelButtons.forEach(button  => {
            button.addEventListener('click', function () {
                modal.closeModal();
        }, false);
        });
    }

    const addTaskSubmitEventListener = () => {
        const taskForm = document.querySelector('#task-form');
        // console.log(taskForm);
        taskForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const taskFormInfo = taskForm.elements;
            const taskName = taskFormInfo['title'].value;
            const taskNotes = taskFormInfo['notes'].value;
            const taskDueDate = taskFormInfo['due-date-time'].value;
            const taskPriority = taskFormInfo['priority'].value;
            const taskList = taskFormInfo['list'].value;
            taskModule.createTaskItem(taskName, taskNotes, taskDueDate, taskPriority, taskList);
            // console.log(taskName, taskNotes, taskDueDate, taskPriority, taskList);
            modal.closeModal();
        }, false);
    }

    const addListFormSubmitEventListener = () => {
            const listForm = document.querySelector('#list-form');
            listForm.addEventListener('submit', function (e) {
                e.preventDefault();
                const listFormInfo = listForm.elements;
                const listName = listFormInfo['title'].value;
                listModule.createListItem(listName);
                modal.closeModal();
            }, false);
    }

    const addEditListFormSubmitEventListener = (currentTitle) => {
        const editListForm = document.querySelector('#list-edit-form');
        editListForm.addEventListener('click', function (e) {
            e.preventDefault();
            const editListFormInfo = editListForm.elements;
            const newListTitle = editListFormInfo['title'].value;
            if (!e.target.classList.contains('edit-buttons')) {
                return;
            }

            if (e.target.id === 'save-list-title') {
                console.log(currentTitle, newListTitle);
                listModule.editListTitle(currentTitle, newListTitle);
            } 
            
            if (e.target.id === 'delete-list-title') {
                listModule.removeList(currentTitle);
            } 

            modal.closeModal();
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