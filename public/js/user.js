document.addEventListener("DOMContentLoaded", pageLoaded);

function pageLoaded() {

    //Check if logged in
    let username = window.localStorage.getItem("username");

    if(username != null) {
        document.getElementById("navbarUser").innerHTML = username;
    } else {
        window.location = "login.html";
    }

    //Load quizzes
    let url = "http://localhost:5000/find-quizzes/" + username;
    fetch(url).then(response => response.json())
    .then(response => {
        if(response.status == "success") {
            displayQuizzes(response.quizzes);
        }
    });

}

function displayQuizzes(quizzes) {

    let quizList = document.getElementById("quizListInner");

    //Remove all current quizzes
    while (quizList.firstChild != null) {
        quizList.removeChild(quizList.lastChild);
    }

    //Add all new quizzes
    for(let i = 0; i < quizzes.length; i++) {

        let quiz = quizzes[i];

        //Quiz Item
        let quizItem = document.createElement("div");
        quizItem.className = "quizItem";
        quizList.appendChild(quizItem);

        //Quiz Title
        let quizTitle = document.createElement("p");
        quizTitle.className = "quizTitle";
        quizTitle.innerHTML = quiz.quizName;
        quizItem.appendChild(quizTitle);

        //Quiz Type
        let quizType = document.createElement("p");
        quizType.className = "quizType";
        quizType.innerHTML = quiz.quizType;
        quizItem.appendChild(quizType);

        //Buttons
        let buttonContainer = document.createElement("div");
        buttonContainer.className = "interactContainer";
        quizItem.appendChild(buttonContainer);

        let playButton = document.createElement("i");
        playButton.className = "playIcon material-icons"
        playButton.innerHTML = "play_arrow"
        buttonContainer.appendChild(playButton);

        let playButtonToolTip = document.createElement("span");
        playButtonToolTip.innerHTML = "play";
        playButton.appendChild(playButtonToolTip);

        let editButton = document.createElement("i");
        editButton.className = "editIcon material-icons"
        editButton.innerHTML = "edit"
        editButton.onclick = function () {window.location = "".concat("edit-quiz.html?id=",quiz.quizID);}
        buttonContainer.appendChild(editButton);

        let editButtonToolTip = document.createElement("span");
        editButtonToolTip.innerHTML = "edit";
        editButton.appendChild(editButtonToolTip);

        let deleteButton = document.createElement("i");
        deleteButton.className = "deleteIcon material-icons"
        deleteButton.innerHTML = "delete"
        deleteButton.onclick = function() {deleteQuiz(quiz.quizID)};
        buttonContainer.appendChild(deleteButton);

        let deleteButtonToolTip = document.createElement("span");
        deleteButtonToolTip.innerHTML = "delete";
        deleteButton.appendChild(deleteButtonToolTip);

        //Meta Info
        let metaContainer = document.createElement("div");
        metaContainer.className = "metaInfo";
        quizItem.appendChild(metaContainer);

        let metaDate = document.createElement("p");
        metaDate.innerHTML = createDateString(new Date(quiz.date));
        metaContainer.appendChild(metaDate);

        let metaCreator = document.createElement("p");
        metaCreator.innerHTML = quiz.creatorName;
        metaContainer.appendChild(metaCreator);

    }
}

function deleteQuiz(quizID) {
    url = "http://localhost:5000/delete-quiz"

    data = {userData: {username: window.localStorage.getItem("username"),
            password: window.localStorage.getItem("password")},
            quizID: quizID}

    fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)})
        .then(response => response.json())
        .then(response => {
            if(response.status == "success") {
                displayQuizzes(response.quizzes);
            } else {
                console.log(response.err)
            }
        }).catch((error) => {
            alert("Error: Unable to connect to the server")
            console.error(error);
        });
}

function createDateString(date) {
    return "".concat(date.getDate()," / ", (date.getMonth() + 1), " &nbsp &nbsp ", date.getFullYear());
}