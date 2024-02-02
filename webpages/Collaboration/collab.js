let i;
const collaboratorsCards = document.querySelector("#collaborators-cards");
const displayCollaborators = function () {
    document.querySelector("#collaborators-view").style.display = "block";
    document.querySelector("#collaborators-access-card").style.display = "none";
    console.log("AAA");
};

const collaborators = ["A", "B", "C", "D", "E", "F", "G"];

for (i of collaborators) {
    collaboratorsCards.insertAdjacentHTML(
        "beforeEnd",
        `<div class="collaborator-card-container">
            <div class="card">
                <div class="card-body">
                    <img
                        src="/Assets/images/demo.png"
                        alt=""
                        class="holding-img"
                    />
                    <div class="card-body-text">
                        <h5 class="card-title" style="font-weight: 700; padding-bottom: 20px;">${i}</h5>
                            <sub class="card-text" style="font-weight: 700">
                            Click here to Access
                        </sub>
                    </div>
                </div>
            </div>
        </div>`
    );
}
