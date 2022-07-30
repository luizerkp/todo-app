import './css/style.css';
import './css/normalize.css';
// ****remember to import the css file or files that include what you want to use in your project to reduce build size****
import '../node_modules/material-icons/iconfont/material-icons.css';
import { footer } from './footerContent.js';

var buildPageContent = (function (){
    // // sample of how to use material-icons
    //  const test = document.querySelector('.container');
    //  const icon = document.createElement('i');
    //     icon.classList.add('material-icons');
    //     icon.classList.add('icon');
    //     icon.innerHTML = 'key';
    //     test.appendChild(icon);


})();

var buildFooterContent = (function () {
    footer.buildFooter();
})();