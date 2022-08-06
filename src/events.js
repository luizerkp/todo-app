import { loadPage, createTask, createList } from './helper.js';
import { modal } from './modals.js';


var modalEvents = (function () {
    const addInitialModalEvents = () => {
        let createTask = document.querySelector('.create-task-button');
        let addList = document.querySelector('.add-list-button');

        createTask.addEventListener('click', function () {
            loadPage.createTask();
        });

        addList.addEventListener('click', function () {
            loadPage.createList();
        });
    }
    
    const addCancelEventListeners = (modalDiv, modalContent) => {
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
            createTask.createTaskItem(taskName, taskNotes, taskDueDate, taskPriority, taskList);
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
                createList.createListItem(listName);
                modal.closeModal();
            }, false);
    }

    return {
        addInitialModalEvents: addInitialModalEvents,
        addCancelEventListeners: addCancelEventListeners,
        addTaskSubmitEventListener: addTaskSubmitEventListener,
        addListFormSubmitEventListener: addListFormSubmitEventListener
    }
})();

var events = (function () {
    const addInitialEventListeners = () => {
        modalEvents.addInitialModalEvents();
    }

    const addCancelEvents = (modalDiv, modalContent) => {
        modalEvents.addCancelEventListeners(modalDiv, modalContent);
    }

    const addTaskSubmitEvent = () => {
        modalEvents.addTaskSubmitEventListener();
    }

    const addListSubmitEvent = () => {
        modalEvents.addListFormSubmitEventListener();
    }

    return {
        addInitialEventListeners: addInitialEventListeners,
        addCancelEvents: addCancelEvents,
        addTaskSubmitEvent: addTaskSubmitEvent,
        addListSubmitEvent: addListSubmitEvent
    }
})();

export { events };