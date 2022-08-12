// import { loadPage } from './controller.js';
// import { modal } from './modals.js';
// import { events } from './events.js'


// create ul element with tasks 
function buildTasksUl(tasks) {
    const tasksUl = document.createElement('ul');
    tasksUl.classList.add('list-of-tasks');

    tasks.forEach(function (task) {
        const taskItem = document.createElement('li');
        taskItem.classList.add('task-item');
        taskItem.classList.add(task.priority.toLowerCase());

        const taskTitleItemDiv = document.createElement('div');
        taskTitleItemDiv.classList.add('task-item-title-text');
        taskTitleItemDiv.dataset.title = task.title;
        taskTitleItemDiv.dataset.notes = task.notes;
        taskTitleItemDiv.dataset.dueDate = task.dueDate;
        taskTitleItemDiv.dataset.priority = task.priority;
        taskTitleItemDiv.dataset.list = task.list;

        const taskTitleItemText = document.createElement('p');
        taskTitleItemText.textContent = task.title.length > 25 ? task.title.substring(0, 25) + '...' : task.title;

        const taskDueDateItemDiv = document.createElement('div');
        taskDueDateItemDiv.classList.add('task-item-due-date-text');

        const taskDueDateItemText = document.createElement('p');
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const dayOfweek = task.dueDate.split(' ')[0];
        const month = task.dueDate.split(' ')[1];
        const dayNumber = task.dueDate.split(' ')[2];
        const dueDateText = new Date(task.dueDate) >= today ? `${dayOfweek} ${month} ${dayNumber}` : 'No due date';
        taskDueDateItemText.textContent = dueDateText;

        taskTitleItemDiv.appendChild(taskTitleItemText);
        taskDueDateItemDiv.appendChild(taskDueDateItemText);
        taskItem.appendChild(taskTitleItemDiv);
        taskItem.appendChild(taskDueDateItemDiv);
        tasksUl.appendChild(taskItem);
    });
    
    return tasksUl;
}

var formattedTasks = (function (){
    //  compare priority for task during the same day
    const comparePriorityAndTime = function (a, b) {
        const priorityLevel = {
            'High': 1,
            'Medium': 2,
            'Low': 3
        };

        // if dates are the same, sort by priority descending from high to low
        if (a.dueDate === b.dueDate) {
            if (priorityLevel[a.priority] > priorityLevel[b.priority]) {
                return 1;
            } else if (priorityLevel[a.priority] < priorityLevel[b.priority]) {
                return -1;
            } else {
                return 0;
            }
        } 
        return 0;
    }
    
    // returns an array of dates of length formatted as dateStrings
    const getFormatedDaysArray = function(start, numDays) {
        let formattedDays = [];
        formattedDays.push(start.toDateString());

        for (let i = 1; i < numDays; i++) {
            let nextDay = new Date(start.setDate(start.getDate() + 1));
            formattedDays.push(nextDay.toDateString());
        }
        return formattedDays;
    };

    // sort tasks by priority changes priority from high to low
    const sortArrayByPriority = function (arr) {
        let sortedArr = arr.sort((objAPriority, objBPriority) => (
            comparePriorityAndTime(objAPriority, objBPriority)
        ));
        return sortedArr;
    }

    // sort tasks by due date changes due date from yyyy-mm-dd to yyyymmdd
    const sortArrayByDuedate = function (arr) {
        let sortedArr = arr.sort((objADueDate, objBDueDate) => (
            objADueDate.dueDate = objADueDate.dueDate.split('-').join(''),
            objBDueDate.dueDate = objBDueDate.dueDate.split('-').join(''),
            objADueDate.dueDate - objBDueDate.dueDate
        ));
        return sortedArr;
    }
    const formatDateString = function (arr){
        let formattedArr = arr.map(obj => {
            let formattedDate = obj.dueDate.split('').splice(0,4).join('') + '-' + obj.dueDate.split('').splice(4,2).join('') + '-' + obj.dueDate.split('').splice(6,2).join('');
            formattedDate = new Date(formattedDate+'T00:00:00');
            formattedDate = formattedDate.toDateString();
            return {...obj, dueDate: formattedDate};
        });
        return formattedArr;
    }
    
    // gets curent list of lists 
    let currentLists = JSON.parse(localStorage.getItem('lists'));
    
    // extracts tasks from current lists
    let tasks = [];
    currentLists.forEach(list => {
        list.tasks.forEach(task => {
            tasks.push(task);
        });
    });

    // sort all current tasks by due date
    let allTasksSortedByDate = sortArrayByDuedate(tasks);
    // sort tasks by priority after sorting by due date
    let allTasksSortedByDateAndPriority = sortArrayByPriority(allTasksSortedByDate);
    // format date string for sorted tasks
    let allSortedTasksAndFormated = formatDateString(allTasksSortedByDateAndPriority);

    const getTodayFormattedTasks = function () {
        let today = new Date();
        let todayFormatted = today.toDateString();
        let todayFormattedTasks = allSortedTasksAndFormated.filter(task => task.dueDate === todayFormatted);
        return todayFormattedTasks;
    }

    const getTomorrowFormattedTasks = function () {
        let tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        let tomorrowFormatted = tomorrow.toDateString();
        let tomorrowFormattedTasks = allSortedTasksAndFormated.filter(task => task.dueDate === tomorrowFormatted);
        return tomorrowFormattedTasks;
    }

    const getSevenDaysFormattedTasks = function () {
        // get current day 
        let sevenDaysStart = new Date();
        let days = 7;

        // get 7 days from current day
        let sevenDaysArray = getFormatedDaysArray(sevenDaysStart, days);

        let sevenDaysFormattedTasks = allSortedTasksAndFormated.filter(task => {
            return sevenDaysArray.includes(task.dueDate);
        });

        // console.log(sevenDaysFormattedTasks);
        return sevenDaysFormattedTasks;
    }

    const getListFormattedTasks = function (list) {
        let listFormattedTasks = allSortedTasksAndFormated.filter(task => task.list === list);
        return listFormattedTasks;
    }
        
    // console.log(allSortedTasksAndFormated);

    return {
        getAllFormattedTasks: () => allSortedTasksAndFormated,
        getTodayFormattedTasks: getTodayFormattedTasks,
        getTomorrowFormattedTasks: getTomorrowFormattedTasks,
        getSevenDaysFormattedTasks: getSevenDaysFormattedTasks,
        getListFormattedTasks: getListFormattedTasks
    }
})();

var todayTasks = (function () {
    let todayTasksList = formattedTasks.getTodayFormattedTasks();
    const todayStr= 'today';
    const todayTaskUl = buildTasksUl(todayTasksList, todayStr);

    return {
        getTodayTaskUl: () => todayTaskUl
    }
})();

var tomorrowTasks = (function () {
    let tomorrowTasksList = formattedTasks.getTomorrowFormattedTasks();
    const tomorrowStr= 'tomorrow';
    const tomorrowTaskUl = buildTasksUl(tomorrowTasksList, tomorrowStr);

    return {
        getTomorrowTaskUl: () => tomorrowTaskUl
    }
})();

var sevenDaysTasks = (function () {
    let sevenDaysTasksList = formattedTasks.getSevenDaysFormattedTasks();
    const sevenDays = 'seven-days';
    const sevenDaysTasksUl = buildTasksUl(sevenDaysTasksList, sevenDays);

    return {
        getSevenDaysUl: () => sevenDaysTasksUl
    }
})();

var allTasks = (function () {
    let allTasksList = formattedTasks.getAllFormattedTasks();
    const allTasksStr = 'all-tasks';
    const allTasksUl = buildTasksUl(allTasksList, allTasksStr);
    // console.log(tasks);
    
    return {
        getAllTasksUl: () => allTasksUl
    }
})();

var lists = (function () {
    const buildListTasksUl = (list) => {
        let listTasks = formattedTasks.getListFormattedTasks(list);
        const listTasksUl = buildTasksUl(listTasks);
        return listTasksUl;
    }
    return {
        buildListTasksUl: buildListTasksUl
    }
})();

var tasksDetails = (function () {
    const tasksDetailsContainer = document.createElement('div');
    tasksDetailsContainer.setAttribute('id', 'hiden');
    tasksDetailsContainer.classList.add('tasks-details-container');

    const titlePara = document.createElement('p');
    titlePara.classList.add('title-text');
    const notesPara = document.createElement('p');
    const dueDatePara = document.createElement('p');
    const priorityPara = document.createElement('p');
    const listPara = document.createElement('p');

    
})();

var taskDisplayController = (function () {
    const mainTaskContainer = document.createElement('div');
    mainTaskContainer.setAttribute('id', 'main-task-container');

    const tasksHeaderDiv = document.createElement('div');
    tasksHeaderDiv.setAttribute('id', 'tasks-header');

    const tasksHeaderContent = document.createElement('h1');
    tasksHeaderContent.textContent = 'Placeholder';

    tasksHeaderContent.setAttribute('id', 'tasks-header-content');

    const tasksListContainer = document.createElement('div');
    tasksListContainer.setAttribute('id', 'tasks-list-container');
    
    const tasksSubContainer = document.createElement('div');
    tasksSubContainer.setAttribute('id', 'tasks-sub-container');
    
    const listOfTasks = document.createElement('ul');
    listOfTasks.classList.add('list-of-tasks');

    const tasksContentDiv = document.createElement('div');
    tasksContentDiv.classList.add('tasks-content');
    tasksContentDiv.setAttribute('id', 'hiden');

    tasksListContainer.appendChild(listOfTasks);
    tasksHeaderDiv.appendChild(tasksHeaderContent);
    tasksSubContainer.appendChild(tasksListContainer);

    tasksContentDiv.appendChild(tasksHeaderDiv);
    tasksContentDiv.appendChild(tasksSubContainer);

    const buildHeader = (header) => {
        const headerText = document.querySelector('#tasks-header-content');
        headerText.textContent = header.length > 25 ? header.substring(0, 25) + '...' : header;
    }

    const getTodayList = () => {
        const taskList = document.querySelector('.list-of-tasks');
        const headerText = "Today's Tasks";
        buildHeader(headerText);
        const todayTasksUl = todayTasks.getTodayTaskUl();
        taskList.replaceWith(todayTasksUl);
    }

    const getTomorrowList = () => {
        const taskList = document.querySelector('.list-of-tasks');
        const headerText = "Tomorrow's Tasks";
        buildHeader(headerText);
        const tomorrowTasksUl = tomorrowTasks.getTomorrowTaskUl();
        taskList.replaceWith(tomorrowTasksUl);
    }

    const getSevenDayList = () => {
        const taskList = document.querySelector('.list-of-tasks');
        const headerText = "Next 7 Days' Tasks";
        buildHeader(headerText);
        const sevenDaysUl = sevenDaysTasks.getSevenDaysUl();
        taskList.replaceWith(sevenDaysUl);
    }

    const getAllTasksList = () => {
        const taskList = document.querySelector('.list-of-tasks');
        const headerText = "All Tasks";
        buildHeader(headerText);
        const allTasksUl = allTasks.getAllTasksUl();
        taskList.replaceWith(allTasksUl);
    }

    const getListTasksList = (list) => {
        const taskList = document.querySelector('.list-of-tasks');
        const headerText = list;
        buildHeader(headerText);
        const listTasksUl = lists.buildListTasksUl(list);
        taskList.replaceWith(listTasksUl);
    }

    mainTaskContainer.appendChild(tasksContentDiv);

    return {
        getMainTaskContainer: () => mainTaskContainer,
        getTodayList: getTodayList,
        getTomorrowList: getTomorrowList,
        getSevenDayList: getSevenDayList,
        getAllTasksList: getAllTasksList,
        getListTasksList: getListTasksList
    }
})();

export { taskDisplayController };