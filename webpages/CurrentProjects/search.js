document.addEventListener("DOMContentLoaded", function () {
    const searchBtn = document.getElementById("search-button");

    searchBtn.addEventListener("click", function () {
        searchProjects();
    });

    function searchProjects() {
        var searchText = document
            .getElementById("search-input")
            .value.toLowerCase();
        var projectElements = document.querySelectorAll(".project-element");

        projectElements.forEach(function (element) {
            var projectId = element.id.toLowerCase();
            if (projectId.includes(searchText)) {
                element.style.display = "block";
            } else {
                element.style.display = "none";
            }
        });
    }
});
