// checks if due date is past current date
const pastDueDate =  (dueDate) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);  

  if (new Date(dueDate) >= today) {
    return false;
  }

  return true;
}

// formats due date to be displayed on screen to use 3 char day and month and 2 digit day i.e. "Fri Sep 02"
const formatDueDate = (dueDate) => {
  const dayOfweek = dueDate.split(' ')[0];
  const month = dueDate.split(' ')[1];
  const dayNumber = dueDate.split(' ')[2];
  return pastDueDate(dueDate) ? "Past Due Date" : `${dayOfweek} ${month} ${dayNumber}` ;
}

// create ul element with tasks 
const buildTasksUl = (tasks) => {
  const tasksUl = document.createElement('ul');
  tasksUl.classList.add('list-of-tasks');

  tasks.forEach(function (task) {
    const taskItem = document.createElement('li');
    taskItem.classList.add('task-item');
    taskItem.classList.add(task.priority.toLowerCase());
    taskItem.dataset.id = task.id;
    taskItem.dataset.listId = task.listId;

    const taskTitleItemDiv = document.createElement('div');
    taskTitleItemDiv.classList.add('task-item-title-text');

    // limits title length displayed to 25 chars and adds elipsis if longer
    const taskTitleItemText = document.createElement('p');
    taskTitleItemText.textContent = task.title.length > 25 ? task.title.substring(0, 25) + '...' : task.title;

    // adds radion to toggle complete status on/off
    const radioBtnIcon = document.createElement('i');
    radioBtnIcon.classList.add('material-icons-round', 'task-status-btn');
    radioBtnIcon.textContent = "radio_button_unchecked";

    taskTitleItemText.insertAdjacentElement('afterbegin', radioBtnIcon);

    // format and add due date info
    const taskDueDateItemDiv = document.createElement('div');
    taskDueDateItemDiv.classList.add('task-item-due-date-text');

    const taskDueDateItemText = document.createElement('p');

    const dueDateText = formatDueDate(task.dueDate);

    taskDueDateItemText.textContent = dueDateText;

    // check if task is set as completed and add class 'completed'
    if (task.completed) {
      taskItem.classList.add('completed');
    }

    taskTitleItemDiv.appendChild(taskTitleItemText);
    taskDueDateItemDiv.appendChild(taskDueDateItemText);
    taskItem.appendChild(taskTitleItemDiv);
    taskItem.appendChild(taskDueDateItemDiv);
    tasksUl.appendChild(taskItem);
  });

  return tasksUl;
}


const reArrangePastDueTasks = (tasks) => {
  const idxOfFIrstValidDueDate = tasks.findIndex((task) => !pastDueDate(task.dueDate));

  /* the first task in the tasks array is not >= to current day 
     re-arrage tasks so that past due dates are at the end of array
  */ 
  if (idxOfFIrstValidDueDate > 0) {
    return tasks.slice(idxOfFIrstValidDueDate).concat(tasks.slice(0, idxOfFIrstValidDueDate));
  }

  return tasks;
}

var formattedTasks = (function () {
  //  compare priority for task during the same day
  const comparePriorityAndTime = function (a, b) {
    const priorityLevel = {
      High: 1,
      Medium: 2,
      Low: 3,
    };

    // if dates are the same, sort by priority descending from high to low
    if (a.dueDate === b.dueDate) {
      if (priorityLevel[a.priority] > priorityLevel[b.priority]) {
        return 1;
      }

      if (priorityLevel[a.priority] < priorityLevel[b.priority]) {
        return -1;
      }
    }

    return 0;
  };

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
  };

  // sort tasks by due date using yyyymmdd as format for comparison 
  const sortArrayByDuedate = function (arr) {
    const sortedArr = arr.sort((objADueDate, objBDueDate) => (
      objADueDate.dueDate.split('-').join('') - objBDueDate.dueDate.split('-').join('')
    ));

    return sortedArr;
  };
  const formatDateString = function (arr) {
    // time necessary for Date() constructor set to 00:00:00
    const time = 'T00:00:00';

    let formattedArr = arr.map((obj) => {
      // format dueDate from yyyy-mm-dd to yyyy-mm-ddT00:00:00
      let formattedDate = obj.dueDate + time;

      // new date format will be like this sample: "Wed Aug 24 2022 00:00:00 GMT-0700 (Pacific Daylight Time)"
      formattedDate = new Date(formattedDate);

      // date format will be like this sample: "Wed Aug 24 2022"
      formattedDate = formattedDate.toDateString();

      return { ...obj, dueDate: formattedDate };
    });

    return formattedArr;
  };

  const getCurrentFormatedTasks = () => {
    // gets list of lists 
    let currentLists = JSON.parse(localStorage.getItem('lists'));

    // extracts tasks from current lists
    let tasks = [];
    if (currentLists) {
      currentLists.forEach((list) => {
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
    return allSortedTasksAndFormated;
  };

  let allSortedTasksAndFormated = getCurrentFormatedTasks();

  // update allSortedAndFormated object everytime a change has been made to localStorage obj 'lists'
  const updateFormatedTaskObj = () => {
    allSortedTasksAndFormated = getCurrentFormatedTasks();
  };

  const getTodayFormattedTasks = () => {
    const today = new Date();
    const todayFormatted = today.toDateString();
    const todayFormattedTasks = allSortedTasksAndFormated.filter((task) => task.dueDate === todayFormatted);
    return todayFormattedTasks;
  };

  const getTomorrowFormattedTasks = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowFormatted = tomorrow.toDateString();
    const tomorrowFormattedTasks = allSortedTasksAndFormated.filter((task) => task.dueDate === tomorrowFormatted);
    return tomorrowFormattedTasks;
  };

  const getSevenDaysFormattedTasks = () => {
    // get current day 
    const sevenDaysStart = new Date();
    const days = 7;

    // get 7 days from current day
    const sevenDaysArray = getFormatedDaysArray(sevenDaysStart, days);

    const sevenDaysFormattedTasks = allSortedTasksAndFormated.filter((task) => {
      return sevenDaysArray.includes(task.dueDate);
    });

    return sevenDaysFormattedTasks;
  };

  const getListFormattedTasks = (listId) => {
    const listFormattedTasks = allSortedTasksAndFormated.filter((task) => task.listId === listId);
    const listFormattedTasksWithPAstDueDateReArranged = reArrangePastDueTasks(listFormattedTasks);
    return listFormattedTasksWithPAstDueDateReArranged;
  };

  const getFormattedTaskDetails = (taskId) => {
    const formattedTaskDetails = allSortedTasksAndFormated.find((task) => task.id === taskId);
    return formattedTaskDetails;
  };
  const getAllFormattedTasks = () => {
    const allFormattedTasksWithPastDueDatesReArranged = reArrangePastDueTasks(allSortedTasksAndFormated);
    return allFormattedTasksWithPastDueDatesReArranged;
  };

  return {
    getAllFormattedTasks,
    getTodayFormattedTasks,
    getTomorrowFormattedTasks,
    getSevenDaysFormattedTasks,
    getListFormattedTasks,
    getFormattedTaskDetails,
    updateFormatedTaskObj,
  };

})();

var todayTasks = (function () {
  const getTodayTaskUl = () => {
    const todayTasksList = formattedTasks.getTodayFormattedTasks();
    const todayStr = 'today';
    const todayTaskUl = buildTasksUl(todayTasksList, todayStr);
    return todayTaskUl;
  };

  return {
    getTodayTaskUl,
  };

})();

var tomorrowTasks = (function () {
  const getTomorrowTaskUl = () => {
    const tomorrowTasksList = formattedTasks.getTomorrowFormattedTasks();
    const tomorrowStr = 'tomorrow';
    const tomorrowTaskUl = buildTasksUl(tomorrowTasksList, tomorrowStr);
    return tomorrowTaskUl;
  };

  return {
    getTomorrowTaskUl,
  };

})();

var sevenDaysTasks = (function () {
  const getSevenDaysUl = () => {
    const sevenDaysTasksList = formattedTasks.getSevenDaysFormattedTasks();
    const sevenDays = 'seven-days';
    const sevenDaysTasksUl = buildTasksUl(sevenDaysTasksList, sevenDays);
    return sevenDaysTasksUl;
  };

  return {
    getSevenDaysUl,
  };

})();

var allTasks = (function () {
  const getAllTasksUl = () => {
    const allTasksList = formattedTasks.getAllFormattedTasks();
    const allTasksStr = 'all-tasks';
    const allTasksUl = buildTasksUl(allTasksList, allTasksStr);
    return allTasksUl;
  };

  return {
    getAllTasksUl,
  };

})();


var lists = (function () {
  const buildListTasksUl = (listId) => {
    const listTasks = formattedTasks.getListFormattedTasks(listId);
    const listTasksUl = buildTasksUl(listTasks);
    return listTasksUl;
  };

  return {
    buildListTasksUl,
  };

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
    const taskDetails = formattedTasks.getFormattedTaskDetails(taskId);

    // reset tasks details div to prevent duplicate tasks info
    tasksDetailsDiv.innerHTML = '';

    const editDIv = document.createElement('div');
    editDIv.setAttribute('id', 'edit-div');

    const deleteBtn = document.createElement('button');
    deleteBtn.setAttribute('id', 'delete-task-btn');
    deleteBtn.textContent = "Delete";
    deleteBtn.dataset.id = taskId;
    deleteBtn.dataset.listId = taskDetails.listId;

    editDIv.appendChild(deleteBtn);

    tasksDetailsDiv.appendChild(editDIv);

    for (let [key, value] of Object.entries(taskDetails)) {
      if (key !== 'listId' && key !== 'id' && key !== 'completed') {
        let header = document.createElement('h2');
        header.classList.add('task-details-sub-header');
        let para = document.createElement('p');
        para.classList.add('task-details-para');

        // ensures that due date and list title are formatted correctly
        if (key === 'dueDate' || key === 'listTitle') {
          header.innerText = key === 'dueDate' ? 'Due Date' : 'List Title';
        } else {
          header.innerText = key[0].toUpperCase() + key.substring(1);
        }

        para.textContent = value;
        tasksDetailsDiv.appendChild(header);
        tasksDetailsDiv.appendChild(para);
      }
    }

    tasksDetailsContainer.appendChild(tasksDetailsDiv);

    return tasksDetailsContainer;
  };

  return {
    getTasksDetails,
  };

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
  };

  // hides the task details div
  const hideTaskDetails = () => {
    const taskDetailsContainer = document.querySelector('.task-details-container');

    if (taskDetailsContainer.getAttribute('id') !== 'hidden') {
      taskDetailsContainer.setAttribute('id', 'hidden');
    }
  };

  const removeSelected = () => {
    const taskItems = document.querySelectorAll('.task-item');

    taskItems.forEach(taskItem => {
      taskItem.classList.remove('selected');
    });
  };

  const removeTaskFromDisplay = (taskId) => {
    const taskToRemove = document.querySelector(`[data-id="${taskId}"]`);
    taskToRemove.remove();
    hideTaskDetails();
  };

  const getTodayList = () => {
    const taskList = document.querySelector('.list-of-tasks');
    const headerText = "Today's Tasks";
    buildHeader(headerText);
    const todayTasksUl = todayTasks.getTodayTaskUl();
    taskList.replaceWith(todayTasksUl);
  };

  const getTomorrowList = () => {
    const taskList = document.querySelector('.list-of-tasks');
    const headerText = "Tomorrow's Tasks";
    buildHeader(headerText);
    const tomorrowTasksUl = tomorrowTasks.getTomorrowTaskUl();
    taskList.replaceWith(tomorrowTasksUl);
  };

  const getSevenDayList = () => {
    const taskList = document.querySelector('.list-of-tasks');
    const headerText = "Next 7 Days' Tasks";
    buildHeader(headerText);
    const sevenDaysUl = sevenDaysTasks.getSevenDaysUl();
    taskList.replaceWith(sevenDaysUl);
  };

  const getAllTasksList = () => {
    const taskList = document.querySelector('.list-of-tasks');
    const headerText = "All Tasks";
    buildHeader(headerText);
    const allTasksUl = allTasks.getAllTasksUl();
    taskList.replaceWith(allTasksUl);
  };

  const getListTasksList = (listTitle, listId) => {
    const taskList = document.querySelector('.list-of-tasks');
    const headerText = listTitle;
    buildHeader(headerText);
    const listTasksUl = lists.buildListTasksUl(listId);
    taskList.replaceWith(listTasksUl);

    // hide task details div
    hideTaskDetails();
  };

  const selectTimeFrame = (timeframe) => {
    const taskTimFrames = {
      today: getTodayList,
      tomorrow: getTomorrowList,
      'next-7-days': getSevenDayList,
      'all-tasks': getAllTasksList,
    };

    taskTimFrames[timeframe]();

    // hide taks details div
    hideTaskDetails();
  };

  const getTaskDetails = (taskId) => {
    const taskDetailsDiv = document.querySelector('.task-details-container');

    if (taskDetailsDiv.getAttribute('id') === 'hidden') {
      taskDetailsDiv.removeAttribute('id');
    }

    const taskDetails = tasksDetails.getTasksDetails(taskId);
    taskDetailsDiv.replaceWith(taskDetails);
  };

  const changeCompleteStatus = (taskId) => {
    const targetTask = document.querySelector(`[data-id = "${taskId}"]`);

    if (targetTask.classList.contains('completed')) {
      targetTask.classList.remove('completed');
    } else {
      targetTask.classList.add('completed');
    }
  };

  const updateFomattedTasks = () => {
    formattedTasks.updateFormatedTaskObj();
  };

  mainTaskContainer.appendChild(tasksContentDiv);

  return {
    getMainTaskContainer: () => mainTaskContainer,
    selectTimeFrame,
    getListTasksList,
    getTaskDetails,
    changeCompleteStatus,
    updateFomattedTasks,
    removeTaskFromDisplay,
    removeSelected,
  };

})();

export { taskDisplayController };