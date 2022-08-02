import { sideMenuContent } from "./sideMenu";

var loadPage = (function() {
    const contentDiv = document.createElement('div');
    contentDiv.classList.add('container');

    const sideMenuDiv = sideMenuContent.getSideMenuDiv();
    contentDiv.appendChild(sideMenuDiv);

    // const buildInitialPage = () => {
    // };

    return {
        getContentDiv: () => contentDiv
    }
})();

export { loadPage };