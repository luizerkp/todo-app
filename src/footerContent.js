import githubLogo from "./imgs/GitHubMarkSmallLight.png";

// adds footer content to the page
const footer = (() => {
  const footerDiv = document.createElement("div");
  footerDiv.classList.add("footer");
  const footerPara1 = document.createElement("p");
  const footerPara2 = document.createElement("p");
  const a = document.createElement("a");
  a.href = "https://github.com/luizerkp";
  const myGithubLogo = document.createElement("img");
  myGithubLogo.src = githubLogo;
  a.appendChild(myGithubLogo);
  a.setAttribute("id", "github-logo");
  a.target = "_blank";
  const date = new Date().getFullYear();
  footerPara1.textContent = `Copyright © ${date} Luis Tamarez`;
  footerPara2.textContent = "All Rights Reserved";
  footerDiv.appendChild(footerPara1);
  footerDiv.appendChild(a);
  footerDiv.appendChild(footerPara2);

  const buildFooter = () => document.body.appendChild(footerDiv);

  return {
    buildFooter,
  };
})();

export default footer;
