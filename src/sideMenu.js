
var tasksContent = (function () {
    const tasksDiv = document.createElement('div');
    tasksDiv.classList.add('tasks-div');

    const tasksHeader = document.createElement('h1');
    tasksHeader.textContent = 'Tasks';
    tasksHeader.classList.add('title-text');
    tasksDiv.appendChild(tasksHeader);

    const createTaskButton = document.createElement('button');
    createTaskButton.textContent = 'Create Task';
    createTaskButton.classList.add('create-task-button');
    tasksDiv.appendChild(createTaskButton);
    
    const addIcon = document.createElement('i');
    addIcon.classList.add('material-icons-round');
    addIcon.setAttribute('id', 'add-task-icon');
    addIcon.textContent = 'add'; 
    createTaskButton.appendChild(addIcon);

    const tasksList = document.createElement('ul');
    tasksList.classList.add('tasks-list');

    const tasksShortcuts = ['Today', 'Tomorrow', 'Next 7 days', 'All Tasks'];

    tasksShortcuts.forEach(function (shortcut) {
        const taskItem = document.createElement('li');
        taskItem.classList.add('task-shortcut');
        taskItem.setAttribute('id', shortcut.toLowerCase().replace(/\s/g, '-'));
        taskItem.dataset.id = shortcut.toLowerCase().replace(/\s/g, '-');
        taskItem.textContent = shortcut;
        tasksList.appendChild(taskItem);
    });

    tasksDiv.appendChild(tasksList);


    return {
        getTasksDiv: () => tasksDiv
    }
})();

var listsContent = (function () {
    const listsDiv = document.createElement('div');
    listsDiv.classList.add('Lists');

    const listsHeader = document.createElement('h1');
    listsHeader.textContent = 'Lists';
    listsHeader.classList.add('title-text');
    listsHeader.setAttribute('id', 'lists-header');
    
    listsDiv.appendChild(listsHeader);
    
    const addListButton = document.createElement('button');
    addListButton.textContent = 'Add List';
    addListButton.classList.add('add-list-button');
    listsDiv.appendChild(addListButton);

    const addIcon = document.createElement('i');
    addIcon.classList.add('material-icons-round');
    addIcon.setAttribute('id', 'add-list-icon');
    addIcon.textContent = 'add';
    addListButton.appendChild(addIcon);


    return {
        getListsDiv: () => listsDiv
    }
})();

var sideMenuContent = (function () {
    const sideMenuDiv = document.createElement('div');
    sideMenuDiv.classList.add('side-menu');

    const  tasksDivContent = tasksContent.getTasksDiv();
    const listsDivContent = listsContent.getListsDiv();

    sideMenuDiv.appendChild(tasksDivContent);
    sideMenuDiv.appendChild(listsDivContent);

    return {
        getSideMenuDiv: () => sideMenuDiv,
    }
})();

export { sideMenuContent };