import { loadPage } from './helper.js';
import { modal } from './modals.js';

var modalEvents = (function () {
    const addInitialModalEevents = () => {
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
            modalDiv.classList.remove('show-modal');
            modalContent.removeAttribute('id');
        }, false);
        });
    }

    return {
        addInitialModalEevents: addInitialModalEevents,
        addCancelEventListeners: addCancelEventListeners
    }
})();

var events = (function () {
    const addInitialEventListeners = () => {
        modalEvents.addInitialModalEevents();
    }

    const addCancelEvents = (modalDiv, modalContent) => {
        modalEvents.addCancelEventListeners(modalDiv, modalContent);
    }

    

    return {
        addInitialEventListeners: addInitialEventListeners,
        addCancelEvents: addCancelEvents
    }
})();

export { events };