import "./css/style.css";
import "./css/normalize.css";
import "material-icons/iconfont/round.css";
import "./imgs/staryNightSky.jpg";
import { loadPage } from "./controller";
import modal from "./modals";
import events from "./events";
import footer from "./footerContent";

// buildHeaderContent
(() => {
  const headerDiv = document.createElement("header");
  headerDiv.setAttribute("id", "header-content");
  const viewListIcon = document.createElement("i");
  viewListIcon.classList.add("material-icons-round");
  viewListIcon.setAttribute("id", "header-icon");
  viewListIcon.textContent = "view_list";

  const header = document.createElement("h1");
  header.innerHTML = "To Do App";
  headerDiv.appendChild(viewListIcon);
  headerDiv.appendChild(header);
  document.body.appendChild(headerDiv);
})();

// buildPageContent
(() => {
  const mainContainer = loadPage.getContentDiv();
  document.body.appendChild(mainContainer);
  loadPage.buildPage();
  modal.buildModalContainer();
  events.addInitialEventListeners();
  footer.buildFooter();
  loadPage.restorePrevState();
})();
