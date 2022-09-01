# todo-app
A todo app created using JavaScript, HTML, CSS and webpack. It makes use of localStorage for data persistence. This app uses any.do app for UI inspiration. My goal is to become more familiar with npm, webpack, JavaScript, CSS and the use localStorage for data persistence. I tried to implement functional programming, the module pattern and SOLID principles onto this project. Because of the lack of database backend to this project, I implemented a unique id, to identify tasks and lists. This functions much like the UNIQUE constraint in a SQL DB, every time a new task or list object is created it automatically gets assigned a unique id by use of the npm package uuidv4. This allows the user to create tasks or lists with the same name.

### Details:
On first use the app checks if there is lists array in localStorage to build initial page; if no lists are stored, it loads the default lists (Personal, Work, & Groceries) otherwise it loads the list in storage onto the side menu. Tasks are sorted based on due date followed by priority. When creating a new task a modal is displayed to allow details input. The user can select which list they want to add task to by clicking on the select menu which expand show all current lists. List can be edited or deleted. White space is trimmed from both ends of the input string before a list/task is created for cleaner data management. When clicking on Today, Tomorrow, Next 7 days and All task the task that fall within that date constraint will be shown. Tasks can be deleted or marked as complete.

### Demo
https://luizerkp.github.io/todo-app/