import { loadPage, createTask } from './helper.js';
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

    const addTaskSubmitEventListeners = () => {
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

    return {
        addInitialModalEvents: addInitialModalEvents,
        addCancelEventListeners: addCancelEventListeners,
        addTaskSubmitEventListeners: addTaskSubmitEventListeners
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
        modalEvents.addTaskSubmitEventListeners();
    }

    return {
        addInitialEventListeners: addInitialEventListeners,
        addCancelEvents: addCancelEvents,
        addTaskSubmitEvent: addTaskSubmitEvent
    }
})();

export { events };