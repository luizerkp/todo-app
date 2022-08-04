
function getFormattedDate(date) {
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();

    if (day < 10) {
        day = '0' + day;
    }
    if (month < 10) {
        month = '0' + month;
    }
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
}

var taskFormContainer = (function () {
    const form = document.createElement('form');
    form.classList.add('modal-form');
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
            input.setAttribute('autocomplete', 'off');
            input.setAttribute('autocorrect', 'off');
            
            if (property === 'Title') {
                input.setAttribute('autofocus', 'autofocus');
                input.setAttribute('required', 'required');
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
        label.textContent = 'Due Date and Time';

        const input = document.createElement('input');
        input.setAttribute('type', 'datetime-local');
        input.setAttribute('name', 'due-date-time');
        input.setAttribute('id', 'due-date');
        input.setAttribute('placeholder', 'Enter a Due Date and Time');
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

        const prioritytext = document.createElement('p');
        prioritytext.textContent = 'Priority Level';
        formGroup.appendChild(prioritytext);

        const priorityContentDiv = document.createElement('div');
        priorityContentDiv.setAttribute('id', 'priority-container');

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
            priorityContentDiv.appendChild(priorityDiv);
        });
        
        
        formGroup.appendChild(priorityContentDiv);
        form.appendChild(formGroup);

    }

    const taskTextInputProperties = ['Title', 'Description'];
    const priorityLevels = ['Low', 'Medium', 'High'];
    buildFormTextInputs(taskTextInputProperties);
    buildDueDateInput();
    buildFromPriorityField(priorityLevels);


    return {
        getTaskForm: () => form,
    }
})();

var listFormContainer = (function () {
    const form = document.createElement('form');
    form.classList.add('modal-form');
    form.setAttribute('id', 'task-form');

    const formGroup = document.createElement('div');
    formGroup.classList.add('form-group');

    const label = document.createElement('label');
    label.setAttribute('for', 'title');
    label.textContent = 'Title';

    const input = document.createElement('input');
    input.setAttribute('type', 'text');
    input.setAttribute('name', 'title');
    input.setAttribute('id', 'title');
    input.setAttribute('placeholder', 'Name This List');
    input.setAttribute('required', 'required');
    input.setAttribute('autocomplete', 'off');
    input.setAttribute('autocorrect', 'off');

    input.classList.add('modal-input');

    formGroup.appendChild(label);
    formGroup.appendChild(input);

    form.appendChild(formGroup);

    return {
        getListForm: () => form,
    }
})();

var modal = (function () {
    // create modal container
    const modal = document.createElement('div');
    modal.classList.add('modal');

    // create modal content container
    const modalContent = document.createElement('div');
    modalContent.classList.add('modal-content');

    // creates a close button and adds it to the modal content container
    const closeIcon = document.createElement('i');
    closeIcon.classList.add('material-icons-round');
    closeIcon.setAttribute('id', 'close-button');
    closeIcon.textContent = 'close';

    modalContent.appendChild(closeIcon);

    // create modal header tag and h21 tag to display the header text
    const formHeader = document.createElement('header');
    formHeader.classList.add('modal-header');
    const formHeaderElement = document.createElement('h1');
    formHeaderElement.setAttribute('id', 'modal-header-text');

    // add the header text to the header tag and header tag to modal content container
    formHeader.appendChild(formHeaderElement);
    modalContent.appendChild(formHeader);
     
    // create modal form container
    const formContainer = document.createElement('div');
    formContainer.classList.add('form-container');

    // creates an empty form so that the form can be added to the modal content container dynamically
    const form = document.createElement('form');
    form.classList.add('modal-form'); 
    
    // add the form to form container
    formContainer.appendChild(form);

    // add form container to modal content container and modal content container to modal
    modalContent.appendChild(formContainer);
    modal.appendChild(modalContent);

    // have to refactor this to for new code to work
    const getTaskModal = () => {
        const currentForm = document.querySelector('.modal-form');
        const taskForm = taskFormContainer.getTaskForm();
        currentForm.replaceWith(taskForm);
    }

    const getListModal = () => {
        const currentForm = document.querySelector('.modal-form');
        const listForm = listFormContainer.getListForm();
        currentForm.replaceWith(listForm);
    }

    var buildHeader = (text) => {
        const modalHeaderText = document.querySelector('#modal-header-text');
        modalHeaderText.textContent = text;
    }

    const buildModalContainer = () => {
        document.body.appendChild(modal);
    }

    return {    
        buildModalContainer: buildModalContainer,
        getTaskModal: getTaskModal,
        getListModal: getListModal,
        buildHeader: buildHeader,
    }
})();


export { modal };