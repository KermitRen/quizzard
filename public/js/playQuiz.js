document.addEventListener("DOMContentLoaded", pageLoaded);
document.addEventListener("keydown", showAnswer);

var quiz;
const defaultNoOfTeams = 2;
const maxNoOfTeams = 4;

function pageLoaded() {

    let urlParams = new URLSearchParams(window.location.search);
    let quizID = urlParams.get("id");

    if(quizID == null) {
        console.error("quiz ID not found");
        quiz = getDummyQuiz();
        displayQuiz();
    } else {
        let url = "http://localhost:5000/find-quiz/" + quizID;
        fetch(url).then(response => response.json())
        .then(response => {
            if(response.status == "success") {
                quiz = response.quiz;
                displayQuiz();
            }
        });
    }

}

function displayQuiz() {
    
    //Remove Old Elements
    let grid = document.getElementById("quizGrid");
    while (grid.firstChild != null) {
        grid.removeChild(grid.lastChild);
    }

    //Setup Grid Structure
    let quizData = quiz.quizData;
    let hSize = 100/(quizData.columns + 0.5);
    let vSize = 100/(quizData.rows + 1.5);

    grid.style.gridTemplateColumns = (hSize + "% ").repeat(quizData.columns);
    grid.style.gridTemplateRows = (vSize/2 + "% ") + (vSize + "% ").repeat(quizData.rows);

    //Load Title
    document.getElementById("quizTitle").innerHTML = quiz.quizName;

    //Load Categories
    for(let i = 0; i < quizData.columns; i++) {
        let categoryContainer = document.createElement("div");
        categoryContainer.className = "quizCategoryContainer";
        grid.appendChild(categoryContainer);

        let category = document.createElement("p");
        category.className = "quizCategory";
        category.innerHTML = quizData.categories[i];
        categoryContainer.appendChild(category);
    }

    //Load Questions
    for(let i = 0; i < quizData.rows; i++) {
        for(let j = 0; j < quizData.columns; j++) {
                let question = quizData.questions[j][i].question;
                let answer = quizData.questions[j][i].answer;

                let questionContainer = document.createElement("div");
                questionContainer.className = "quizQuestionContainer";
                questionContainer.onclick = function() {
                    console.log(question.text + answer);
                    document.getElementById("qaTitle").innerHTML = quizData.categories[j] + " for " + quizData.pointValues[i];
                    loadQAData(question, answer);
                    showQA(true);
                };
                grid.appendChild(questionContainer);

                let questionText = document.createElement("p");
                questionText.innerHTML = quizData.pointValues[i];
                questionText.className = "quizQuestion";
                questionContainer.appendChild(questionText);
        }
    }

    //Load Teams
    let scoreboard = document.getElementById("scoreboard");
    for(let i = 0; i < defaultNoOfTeams; i++) {
        let teamContainer = createTeam(i + 1);
        scoreboard.appendChild(teamContainer);
    }
}

function addPoints(pointObject, points) {
    let currentScore = parseInt(pointObject.innerHTML);
    let newScore = currentScore + points;
    pointObject.innerHTML = newScore;
}

function createTeam(teamNo) {
    let teamContainer = document.createElement("div");
    teamContainer.className = "teamContainer";

    let teamName = document.createElement("input");
    teamName.className = "teamName";
    teamName.type = "text";
    teamName.autocomplete = "off";
    teamName.spellcheck = false;
    teamName.value = "Team " + (teamNo);
    teamContainer.appendChild(teamName);

    let scoreContainer = document.createElement("div");
    scoreContainer.className = "scoreContainer";
    teamContainer.appendChild(scoreContainer);

    let points = document.createElement("p");
    points.innerHTML = "0";
    points.className = "pointText";

    let addPointsIcon = document.createElement("i");
    addPointsIcon.className = "material-icons addPointsIcon pointsIcon";
    addPointsIcon.innerHTML = "add";
    addPointsIcon.onclick = function() { addPoints(points, 100)};
    scoreContainer.appendChild(addPointsIcon);
    scoreContainer.appendChild(points);

    let removePointsIcon = document.createElement("i");
    removePointsIcon.className = "material-icons removePointsIcon pointsIcon";
    removePointsIcon.innerHTML = "remove";
    removePointsIcon.onclick = function() { addPoints(points, -100)};
    scoreContainer.appendChild(removePointsIcon);

    return teamContainer;
}

function addTeam() {
    let scoreboard = document.getElementById("scoreboard");
    let currentNoOfTeams = scoreboard.children.length - 1;
    if(currentNoOfTeams < maxNoOfTeams) {
        let teamContainer = createTeam(currentNoOfTeams + 1);
        scoreboard.appendChild(teamContainer);
    }
}

function removeTeam() {
    let scoreboard = document.getElementById("scoreboard");
    scoreboard.removeChild(scoreboard.lastChild);
}

function showQA(show) {

    let qaContainer = document.getElementById("qaContainer");
    if(show) {
        qaContainer.style.width = "100vw";
        qaContainer.style.height = "100vh";
        qaContainer.style.top = "0";
        qaContainer.style.left = "0";
    } else {
        qaContainer.style.width = "0vw";
        qaContainer.style.height = "0vh";
        qaContainer.style.top = "50%";
        qaContainer.style.left = "50%";
    }
}

function loadQAData(question, answer) {

    //Remove Old Elements
    let qaQuestion = document.getElementById("qaQuestionContainer");
    while (qaQuestion.firstChild != null) {
        qaQuestion.removeChild(qaQuestion.lastChild);
    }

    let qaAnswer = document.getElementById("qaAnswerContainer");
    while (qaAnswer.firstChild != null) {
        qaAnswer.removeChild(qaAnswer.lastChild);
    }
    
    //Load Question Text
    if(question.text != "") {
        let questionText = document.createElement("p");
        questionText.innerHTML = question.text;
        qaQuestion.appendChild(questionText);
    }

    //Load Answer Text
    if(answer != "") {
        let answerText = document.createElement("p");
        answerText.innerHTML = answer;
        qaAnswer.appendChild(answerText);
    }
}

function showAnswer(e) {
    if(e.code == "Space") {
        let qaContainer = document.getElementById("qaContainer");
        console.log("test1");
        if(qaContainer.style.width == "100vw") {
            console.log("test2");
            document.getElementById("qaQuestionContainer").style.display = "none";
            document.getElementById("qaAnswerContainer").style.display = "flex";
        }
    }
}

function getDummyQuiz() {
    return {
        "quizName": "Dummy Quiz",
        "quizType": "Jeopardy",
        "quizData": {rows: 5, columns: 5, pointValues: [100, 200, 300, 400, 500], categories: ["Rock", "Pop", "Jazz", "Rap", "Funk"],
                    questions: [[{question: {text: "testString1R", image: "", audio: ""}, answer: "testAnswer"},
                                 {question: {text: "testString2R", image: "", audio: ""}, answer: "testAnswer"},
                                 {question: {text: "testString3R", image: "", audio: ""}, answer: "testAnswer"},
                                 {question: {text: "testString4R", image: "", audio: ""}, answer: "testAnswer"},
                                 {question: {text: "testString5R", image: "", audio: ""}, answer: "testAnswer"}
                                ],
                                [{question: {text: "testString1P", image: "", audio: ""}, answer: "testAnswer"},
                                {question: {text: "testString2P", image: "", audio: ""}, answer: "testAnswer"},
                                {question: {text: "testString3P", image: "", audio: ""}, answer: "testAnswer"},
                                {question: {text: "testString4P", image: "", audio: ""}, answer: "testAnswer"},
                                {question: {text: "testString5P", image: "", audio: ""}, answer: "testAnswer"}
                                ],
                                [{question: {text: "testString1", image: "", audio: ""}, answer: "testAnswer"},
                                {question: {text: "testString2", image: "", audio: ""}, answer: "testAnswer"},
                                {question: {text: "testString3", image: "", audio: ""}, answer: "testAnswer"},
                                {question: {text: "testString4", image: "", audio: ""}, answer: "testAnswer"},
                                {question: {text: "testString5", image: "", audio: ""}, answer: "testAnswer"}
                                ],
                                [{question: {text: "testString1", image: "", audio: ""}, answer: "testAnswer"},
                                {question: {text: "testString2", image: "", audio: ""}, answer: "testAnswer"},
                                {question: {text: "testString3", image: "", audio: ""}, answer: "testAnswer"},
                                {question: {text: "testString4", image: "", audio: ""}, answer: "testAnswer"},
                                {question: {text: "testString5", image: "", audio: ""}, answer: "testAnswer"}
                                ],
                                [{question: {text: "testString1", image: "", audio: ""}, answer: "testAnswer"},
                                {question: {text: "testString2", image: "", audio: ""}, answer: "testAnswer"},
                                {question: {text: "testString3", image: "", audio: ""}, answer: "testAnswer"},
                                {question: {text: "testString4", image: "", audio: ""}, answer: "testAnswer"},
                                {question: {text: "testString5", image: "", audio: ""}, answer: "testAnswer"}
                                ]]},
        "quizID": "d0fb130f-e16e-4e8e-a19a-6e3d1b5bd2bf",
        "private": true,
        "creatorName": "Kermit Ren",
        "date": "2021-09-11T13:48:08.091Z"
        }
}