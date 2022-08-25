import { events } from './events.js'

// create ul element with tasks 
function buildTasksUl(tasks) {
    const tasksUl = document.createElement('ul');
    tasksUl.classList.add('list-of-tasks');

    tasks.forEach(function (task) {
        const taskItem = document.createElement('li');
        taskItem.classList.add('task-item');
        taskItem.classList.add(task.priority.toLowerCase());
        taskItem.dataset.id = task.id;

        const taskTitleItemDiv = document.createElement('div');
        taskTitleItemDiv.classList.add('task-item-title-text');

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

var formattedTasks = (function () {
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
    const getFormatedDaysArray = function (start, numDays) {
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
        const sortedArr = arr.sort((objAPriority, objBPriority) => (
            comparePriorityAndTime(objAPriority, objBPriority)
        ));
        return sortedArr;
    }

    // sort tasks by due date using yyyymmdd as format for comparison 
    const sortArrayByDuedate = function (arr) {
        const sortedArr = arr.sort((objADueDate, objBDueDate) => (
            objADueDate.dueDate.split('-').join('') - objBDueDate.dueDate.split('-').join('')
        ));
        // console.log(sortedArr)
        return sortedArr;
    }
    const formatDateString = function (arr) { 
        // time necessary for Date() constructor set to 00:00:00
        const time = 'T00:00:00'

        let formattedArr = arr.map(obj => {
            // format dueDate from yyyy-mm-dd to yyyy-mm-ddT00:00:00
            let formattedDate = obj.dueDate + time;

            // new date format will be like this sample: "Wed Aug 24 2022 00:00:00 GMT-0700 (Pacific Daylight Time)"
            formattedDate = new Date(formattedDate);

            // date format will be like this sample: "Wed Aug 24 2022"
            formattedDate = formattedDate.toDateString();
            
            return { ...obj, dueDate: formattedDate };
        });
        return formattedArr;
    }

    const getCurrentFormatedTasks = () => {        
        // gets list of lists 
        const currentLists = JSON.parse(localStorage.getItem('lists'));
        // extracts tasks from current lists
        let tasks = [];
        if (currentLists) {
            currentLists.forEach(list => {
                list.tasks.forEach(task => {
                    tasks.push(task);
                });
            });
        }

        // sort all current tasks by due date
        const allTasksSortedByDate = sortArrayByDuedate(tasks);
        // sort tasks by priority after sorting by due date
        const allTasksSortedByDateAndPriority = sortArrayByPriority(allTasksSortedByDate);
        // format date string for sorted tasks
        const allSortedTasksAndFormated = formatDateString(allTasksSortedByDateAndPriority);  
        return allSortedTasksAndFormated      
    }

   
    const allSortedTasksAndFormated = getCurrentFormatedTasks();

    const getTodayFormattedTasks = function () {
        const today = new Date();
        const todayFormatted = today.toDateString();
        const todayFormattedTasks = allSortedTasksAndFormated.filter(task => task.dueDate === todayFormatted);
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
        const sevenDaysStart = new Date();
        const days = 7;

        // get 7 days from current day
        let sevenDaysArray = getFormatedDaysArray(sevenDaysStart, days);

        let sevenDaysFormattedTasks = allSortedTasksAndFormated.filter(task => {
            return sevenDaysArray.includes(task.dueDate);
        });

        return sevenDaysFormattedTasks;
    }

    const getListFormattedTasks = function (listId) {
        const listFormattedTasks = allSortedTasksAndFormated.filter(task => task.listId === listId);
        return listFormattedTasks;
    }

    const getFormattedTaskDetails = function (taskId) {
        const formattedTaskDetails = allSortedTasksAndFormated.find(task => task.id === taskId);
        return formattedTaskDetails;
    }
    const getAllFormattedTasks = function () {       

        return allSortedTasksAndFormated
    }

    return {
        getAllFormattedTasks: getAllFormattedTasks,
        getTodayFormattedTasks: getTodayFormattedTasks,
        getTomorrowFormattedTasks: getTomorrowFormattedTasks,
        getSevenDaysFormattedTasks: getSevenDaysFormattedTasks,
        getListFormattedTasks: getListFormattedTasks,
        getFormattedTaskDetails: getFormattedTaskDetails,
    }
})();

var todayTasks = (function () {
    const todayTasksList = formattedTasks.getTodayFormattedTasks();
    const todayStr = 'today';
    const todayTaskUl = buildTasksUl(todayTasksList, todayStr);

    return {
        getTodayTaskUl: () => todayTaskUl
    }
})();

var tomorrowTasks = (function () {
    const tomorrowTasksList = formattedTasks.getTomorrowFormattedTasks();
    const tomorrowStr = 'tomorrow';
    const tomorrowTaskUl = buildTasksUl(tomorrowTasksList, tomorrowStr);

    return {
        getTomorrowTaskUl: () => tomorrowTaskUl
    }
})();

var sevenDaysTasks = (function () {
    const sevenDaysTasksList = formattedTasks.getSevenDaysFormattedTasks();
    const sevenDays = 'seven-days';
    const sevenDaysTasksUl = buildTasksUl(sevenDaysTasksList, sevenDays);

    return {
        getSevenDaysUl: () => sevenDaysTasksUl
    }
})();

var allTasks = (function () {
    const allTasksList = formattedTasks.getAllFormattedTasks();
    const allTasksStr = 'all-tasks';
    const allTasksUl = buildTasksUl(allTasksList, allTasksStr);

    return {
        getAllTasksUl: () => allTasksUl
    }
})();


var lists = (function () {
    const buildListTasksUl = (listId) => {
        let listTasks = formattedTasks.getListFormattedTasks(listId);
        const listTasksUl = buildTasksUl(listTasks);
        return listTasksUl;
    }
    return {
        buildListTasksUl: buildListTasksUl
    }
})();

var tasksDetails = (function () {
    const tasksDetailsContainer = document.createElement('div');
    tasksDetailsContainer.classList.add('task-details-container');

    const tasksDetailsHeader = document.createElement('h1');
    tasksDetailsHeader.classList.add('task-details-header');
    tasksDetailsHeader.innerText = 'Task Details';

    tasksDetailsContainer.appendChild(tasksDetailsHeader);

    const tasksDetailsDiv = document.createElement('div');
    tasksDetailsDiv.classList.add('task-details');

    const getTasksDetails = (taskId) => {
        let taskDetails = formattedTasks.getFormattedTaskDetails(taskId);
        // reset tasks details div to prevent duplicate tasks info
        tasksDetailsDiv.innerHTML = '';

        const editDIv = document.createElement('div');
        editDIv.setAttribute('id', 'edit-div')

        const deleteBtn = document.createElement('button');
        deleteBtn.setAttribute('id', 'delete-task-btn');
        deleteBtn.textContent = "Delete"
        deleteBtn.dataset.id = taskId
        deleteBtn.dataset.listId = taskDetails.listId

        editDIv.appendChild(deleteBtn)

        tasksDetailsDiv.appendChild(editDIv);

        for (let [key, value] of Object.entries(taskDetails)) {
            if (key !== 'listId' && key !== 'id') {
                let header = document.createElement('h2');
                header.classList.add('task-details-sub-header');
                let para = document.createElement('p');
                para.classList.add('task-details-para');
                header.innerText = key[0].toUpperCase() + key.substring(1);
                para.textContent = value;
                tasksDetailsDiv.appendChild(header);
                tasksDetailsDiv.appendChild(para);
            }
        }

        tasksDetailsContainer.appendChild(tasksDetailsDiv);

        return tasksDetailsContainer;
    }
    
    return {
        getTasksDetails: getTasksDetails
    }
})();

var taskDisplayController = (function () {
    const mainTaskContainer = document.createElement('div');
    mainTaskContainer.setAttribute('id', 'main-task-container');

    const taskDetailsContainer = document.createElement('div');
    taskDetailsContainer.classList.add('task-details-container');
    taskDetailsContainer.setAttribute('id', 'hidden');

    const tasksHeaderDiv = document.createElement('div');
    tasksHeaderDiv.setAttribute('id', 'tasks-header');

    const tasksHeaderContent = document.createElement('h1');
    tasksHeaderContent.textContent = 'Pending Tasks';

    tasksHeaderContent.setAttribute('id', 'tasks-header-content');

    const tasksListContainer = document.createElement('div');
    tasksListContainer.setAttribute('id', 'tasks-list-container');

    const tasksSubContainer = document.createElement('div');
    tasksSubContainer.setAttribute('id', 'tasks-sub-container');

    const listOfTasks = document.createElement('ul');
    listOfTasks.classList.add('list-of-tasks');

    const tasksContentDiv = document.createElement('div');
    tasksContentDiv.classList.add('tasks-content');

    tasksListContainer.appendChild(listOfTasks);
    tasksHeaderDiv.appendChild(tasksHeaderContent);
    tasksSubContainer.appendChild(tasksListContainer);
    tasksSubContainer.appendChild(taskDetailsContainer);

    tasksContentDiv.appendChild(tasksHeaderDiv);
    tasksContentDiv.appendChild(tasksSubContainer);

    const buildHeader = (header) => {
        const headerText = document.querySelector('#tasks-header-content');
        headerText.textContent = header.length > 25 ? header.substring(0, 25) + '...' : header;
    }

    // hides the task details div
    const hideTaskDetails = () => {
        const taskDetailsContainer = document.querySelector('.task-details-container');

        if (taskDetailsContainer.getAttribute('id') !== 'hidden') {
            taskDetailsContainer.setAttribute('id', 'hidden');
        }
    }

    const selectTimeFrame = (timeframe) => {
        const taskTimFrames = {
            'today': getTodayList,
            'tomorrow': getTomorrowList,
            'next-7-days': getSevenDayList,
            'all-tasks': getAllTasksList
        }
        taskTimFrames[timeframe]();

        // hide taks details div
        hideTaskDetails();

        // add event listener to list tasks ul to display task details
        events.addTaskDetailsEvent();
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

    const getListTasksList = (listTitle, listId) => {
        const taskList = document.querySelector('.list-of-tasks');
        const headerText = listTitle;
        buildHeader(headerText);
        const listTasksUl = lists.buildListTasksUl(listId);
        taskList.replaceWith(listTasksUl);

        // hide task details div
        hideTaskDetails();

        // add event listener to list tasks ul to display task details
        events.addTaskDetailsEvent();
    }

    const getTaskDetails = (taskId) => {
        const taskDetailsDiv = document.querySelector('.task-details-container');
        if (taskDetailsDiv.getAttribute('id') === 'hidden') {
            taskDetailsDiv.removeAttribute('id');
        }
        const taskDetails = tasksDetails.getTasksDetails(taskId);
        taskDetailsDiv.replaceWith(taskDetails);
        events.addTaskDeleteEvents();
    }

    mainTaskContainer.appendChild(tasksContentDiv);

    return {
        getMainTaskContainer: () => mainTaskContainer,
        selectTimeFrame: selectTimeFrame,
        getListTasksList: getListTasksList,
        getTaskDetails: getTaskDetails,
        hideTaskDetails: hideTaskDetails
    }
})();

export { taskDisplayController };