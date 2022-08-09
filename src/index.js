import './css/style.css';
import './css/normalize.css';
// ****remember to import the css file or files that include what you want to use in your project to reduce build size****
import '../node_modules/material-icons/iconfont/round.css';
import { footer } from './footerContent.js';
import { loadPage } from './helper.js';
import { modal } from './modals.js';
import { events } from './events.js';

var buildHeaderContent = (function () {
    const headerDiv = document.createElement('header');
    headerDiv.setAttribute('id', 'header-content');

    const viewListIcon = document.createElement('i');
    viewListIcon.classList.add('material-icons-round');
    viewListIcon.setAttribute('id','header-icon');
    viewListIcon.textContent = 'view_list';

    const header = document.createElement('h1');
    header.innerHTML = 'To Do App';
    headerDiv.appendChild(viewListIcon);
    headerDiv.appendChild(header);
    document.body.appendChild(headerDiv);
})();

var buildPageContent = (function (){
    const mainContainer = loadPage.getContentDiv();
    document.body.appendChild(mainContainer);
    loadPage.buildPage();
    events.addInitialEventListeners();
    
})();

var buildFooterContent = (function () {
    footer.buildFooter();
})();

var buildModal = (function () {
    modal.buildModalContainer();
})();
