const createProjectButton = document.getElementById("create-project-button");
const homeButton = document.getElementById("home-button");

createProjectButton.addEventListener("click", function () {
    location.href = "/createProject";
});
homeButton.addEventListener("click", function () {
    location.href = "/home";
});
