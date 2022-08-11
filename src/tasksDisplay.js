// import { loadPage } from './controller.js';
// import { modal } from './modals.js';
// import { events } from './events.js';



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
            }
            if (priorityLevel[a.priority] < priorityLevel[b.priority]) {
                return -1;
            }
            return 0;
        } else {
            return 0;
        }
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
        

    // console.log(allSortedTasksAndFormated);

    return {
        getAllFormattedTasks: () => allSortedTasksAndFormated,
        getTodayFormattedTasks: getTodayFormattedTasks,
        getTomorrowFormattedTasks: getTomorrowFormattedTasks,
        getSevenDaysFormattedTasks: getSevenDaysFormattedTasks
    }
})();

// var todayTasks = (function () {
    // let todayTasksList = formattedTasks.getTodayFormattedTasks();
// })();

// var tomorrowTasks = (function () {
    // let tomorrowTasksList = formattedTasks.getTomorrowFormattedTasks();
// })();

// var sevenDaysTasks = (function () {
//     let sevenDaysTasksList = formattedTasks.getSevenDaysFormattedTasks();
// })();

var allTasks = (function () {
    const list = document.createElement('ul');
    list.setAttribute('id', 'all-tasks');
    list.classList.add('list-of-tasks');

    let tasks = formattedTasks.getAllFormattedTasks();
    // console.log(tasks);
    
    
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
    
    const listOfTasks = document.createElement('ul');
    listOfTasks.classList.add('list-of-tasks');

    const tasksContentDiv = document.createElement('div');
    tasksContentDiv.setAttribute('id', 'tasks-content');

    tasksListContainer.appendChild(listOfTasks);
    tasksHeaderDiv.appendChild(tasksHeaderContent);

    tasksContentDiv.appendChild(tasksHeaderDiv);
    tasksContentDiv.appendChild(tasksListContainer);

    // const buildTodayList = () => {
        
    // }

    // const buildTomorrowList = () => {
    
    // }

    // const buildUpcomingWeekList = () => {

    // }

    const buildAllTasksList = () => {
        const taskList = document.querySelector('.list-of-tasks');
        // const allTasksList = 


    }

    mainTaskContainer.appendChild(tasksContentDiv);
    return {
        getMainTaskContainer: () => mainTaskContainer,
    }
})();

export { taskDisplayController };