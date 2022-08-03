
function getFormattedDate(date) {
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    if (day < 10) {
        day = '0' + day;
    }
    if (month < 10) {
        month = '0' + month;
    }
    return `${year}-${month}-${day}`;
}

var taskFormContainer = (function () {
    const formContainer = document.createElement('div');
    formContainer.classList.add('form-container');

    const formHeader = document.createElement('header');
    formHeader.classList.add('modal-header');
    const formHeaderElement = document.createElement('h1');
    formHeaderElement.textContent = 'Create Task';

    formHeader.appendChild(formHeaderElement);

    const form = document.createElement('form');
    form.setAttribute('id', 'task-form');

    const buildFormTextInputs = (properties) => {
        properties.forEach(function (property) {
            const formGroup = document.createElement('div');
            formGroup.classList.add('form-group');

            const label = document.createElement('label');
            label.setAttribute('for', property);
            label.textContent = property;

            const input = document.createElement('input');
            input.setAttribute('type', 'text');
            input.setAttribute('name', property);
            input.setAttribute('id', property);
            input.setAttribute('placeholder', 'Enter a ' + property);
            input.setAttribute('required', 'required');
            input.setAttribute('autocomplete', 'off');
            input.setAttribute('autocorrect', 'off');
            
            if (property === 'Title') {
                input.setAttribute('autofocus', 'autofocus');
            }

            input.classList.add('modal-input');

            formGroup.appendChild(label);
            formGroup.appendChild(input);

            form.appendChild(formGroup);
        });
    }

    const buildDueDateInput = () => {
        const formGroup = document.createElement('div');
        formGroup.classList.add('form-group');

        const label = document.createElement('label');
        label.setAttribute('for', 'due-date');
        label.textContent = 'Due Date';

        const input = document.createElement('input');
        input.setAttribute('type', 'date');
        input.setAttribute('name', 'due-date');
        input.setAttribute('id', 'due-date');
        input.setAttribute('placeholder', 'Enter a Due Date');
        input.setAttribute('required', 'required');
        input.setAttribute('value', getFormattedDate(new Date()));
        input.classList.add('modal-input');

        formGroup.appendChild(label);
        formGroup.appendChild(input);

        form.appendChild(formGroup);
    }

    const buildFromPriorityField = (levels) => {
        const formGroup = document.createElement('div');
        formGroup.classList.add('form-group');
        formGroup.setAttribute('id','priority-group');

        levels.forEach(function (priorityLevel) {
            const priorityDiv = document.createElement('div');
            const label= document.createElement('label');
            label.setAttribute('for', priorityLevel);
            label.textContent = priorityLevel;

            const input = document.createElement('input');
            input.setAttribute('type', 'radio');
            input.setAttribute('name', 'priority');
            input.setAttribute('id', priorityLevel);
            input.setAttribute('value', priorityLevel);

            if (priorityLevel === 'Medium') {
                input.setAttribute('checked', 'checked');
            }
            priorityDiv.appendChild(label);
            priorityDiv.appendChild(input);
            formGroup.appendChild(priorityDiv);
        });
        
        form.appendChild(formGroup);

    }

    const taskTextInputProperties = ['Title', 'Description'];
    const priorityLevels = ['Low', 'Medium', 'High'];
    buildFormTextInputs(taskTextInputProperties);
    buildDueDateInput();
    buildFromPriorityField(priorityLevels);

    formContainer.appendChild(formHeader);
    formContainer.appendChild(form);

    return {
        getTaskFormContainer: () => formContainer,
    }
})();

// var listFormContainer = (function () {


// })();

var modal = (function () {
    const modal = document.createElement('div');
    modal.classList.add('modal');

    const modalContent = document.createElement('div');
    modalContent.classList.add('modal-content');

    const closeIcon = document.createElement('i');
    closeIcon.classList.add('material-icons-round', 'close-button');
    closeIcon.textContent = 'close';

    const tempFormContainer = document.createElement('div');
    tempFormContainer.classList.add('form-container');

    modalContent.appendChild(closeIcon);
    modalContent.appendChild(tempFormContainer);
    modal.appendChild(modalContent);

    const getTaskModal = () => {
        const modalContentDiv = document.querySelector('.form-container');
        const taskForm = taskFormContainer.getTaskFormContainer();
        modalContentDiv.replaceWith(taskForm);
    }

    const buildModalContainer = () => {
        document.body.appendChild(modal);
    }

    return {    
        buildModalContainer: buildModalContainer,
        getTaskModal: getTaskModal,
    }
})();


export { modal };