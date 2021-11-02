document.addEventListener("DOMContentLoaded", pageLoaded);

let quiz;
const maxColumns = 7;
const minColumns = 3;
const maxRows = 7;
const minRows = 3;

function pageLoaded() {

    let urlParams = new URLSearchParams(window.location.search);
    let quizID = urlParams.get("id");

    if(quizID == null) {
        console.error("quiz ID not found");
        quiz = {
            "quizName": "Musik Quiz test 1",
            "quizType": "Jeopardy",
            "quizData": {rows: 5, columns: 5, pointValues: [100, 200, 300, 400, 500], categories: ["Rock", "Pop", "Jazz", "Rap", "Funk"],
                        questions: [[{question: {text: "testString1R"}, answer: "testAnswer"},
                                     {question: {text: "testString2R"}, answer: "testAnswer"},
                                     {question: {text: "testString3R"}, answer: "testAnswer"},
                                     {question: {text: "testString4R"}, answer: "testAnswer"},
                                     {question: {text: "testString5R"}, answer: "testAnswer"}
                                    ],
                                    [{question: {text: "testString1P"}, answer: "testAnswer"},
                                    {question: {text: "testString2P"}, answer: "testAnswer"},
                                    {question: {text: "testString3P"}, answer: "testAnswer"},
                                    {question: {text: "testString4P"}, answer: "testAnswer"},
                                    {question: {text: "testString5P"}, answer: "testAnswer"}
                                    ],
                                    [{question: {text: "testString1"}, answer: "testAnswer"},
                                    {question: {text: "testString2"}, answer: "testAnswer"},
                                    {question: {text: "testString3"}, answer: "testAnswer"},
                                    {question: {text: "testString4"}, answer: "testAnswer"},
                                    {question: {text: "testString5"}, answer: "testAnswer"}
                                    ],
                                    [{question: {text: "testString1"}, answer: "testAnswer"},
                                    {question: {text: "testString2"}, answer: "testAnswer"},
                                    {question: {text: "testString3"}, answer: "testAnswer"},
                                    {question: {text: "testString4"}, answer: "testAnswer"},
                                    {question: {text: "testString5"}, answer: "testAnswer"}
                                    ],
                                    [{question: {text: "testString1"}, answer: "testAnswer"},
                                    {question: {text: "testString2"}, answer: "testAnswer"},
                                    {question: {text: "testString3"}, answer: "testAnswer"},
                                    {question: {text: "testString4"}, answer: "testAnswer"},
                                    {question: {text: "testString5"}, answer: "testAnswer"}
                                    ]]},
            "quizID": "d0fb130f-e16e-4e8e-a19a-6e3d1b5bd2bf",
            "private": true,
            "creatorName": "Kermit Ren",
            "date": "2021-09-11T13:48:08.091Z"
            }
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
    let hSize = 100/((quizData.columns + 1) * 2);
    let vSize = 100/((quizData.rows + 1) * 2 + 1);

    grid.style.gridTemplateColumns = (hSize + "% ") + (hSize*2 + "% ").repeat(quizData.columns);
    grid.style.gridTemplateRows = (vSize + "% ") + (vSize*2 + "% ").repeat(quizData.rows);

    //Load Title
    document.getElementById("quizTitle").value = quiz.quizName;
    document.getElementById("titleContainer").style.width = (100 - hSize - (hSize/quizData.columns)) + "%";
    document.getElementById("backButtonContainer").style.width = (hSize + (hSize/quizData.columns)) + "%";
    document.getElementById("quizTitle").onchange = function() {
        quiz.quizName = document.getElementById("quizTitle").value;
        saveQuiz();
    };
    
    //Load Quiz Data
    for(let i = 0; i < quizData.rows + 1; i++) {

        //Point Column
        if(i == 0) {
            grid.appendChild(document.createElement("div"));
        } else {
            let rowPointsContainer = document.createElement("div");
            rowPointsContainer.className = "rowPointsContainer";
            grid.appendChild(rowPointsContainer);

            let rowPoints = document.createElement("input");
            rowPoints.className = "rowPoints";
            rowPoints.type = "number";
            rowPoints.oninput = function() {
                let v = rowPoints.value
                if(v > 1000) {
                    rowPoints.value = 1000;
                } else if(v < 0) {
                    rowPoints.value = 0;
                }
            };
            rowPoints.onchange = function() {
                quizData.pointValues[i - 1] = parseInt(rowPoints.value);
                displayQuiz();
                saveQuiz();
            };
            rowPoints.value = quizData.pointValues[i - 1];
            rowPointsContainer.appendChild(rowPoints);

            let pointIcons = document.createElement("div");
            pointIcons.className = "pointsIconContainer";
            rowPointsContainer.appendChild(pointIcons);

            if(quizData.rows < maxRows) {
                let pointAdd = document.createElement("i");
                pointAdd.className = "material-icons addPointsIcon";
                pointAdd.innerHTML = "add";
                pointAdd.onclick = function() {addRow(i)};
                pointAdd.onmouseenter = function() {addTooltip(pointAdd, "Add Row")}
                pointAdd.onmouseleave = function() {removeTooltip(pointAdd)}
                pointIcons.appendChild(pointAdd);
            }

            if(quizData.rows > minRows) {
                let pointDelete = document.createElement("i");
                pointDelete.className = "material-icons deletePointsIcon";
                pointDelete.innerHTML = "delete";
                pointDelete.onclick = function() {removeRow(i - 1)};
                pointDelete.onmouseenter = function() {addTooltip(pointDelete, "Delete Row")}
                pointDelete.onmouseleave = function() {removeTooltip(pointDelete)}
                pointIcons.appendChild(pointDelete);
            }
        }

        //Question Columns
        for(let j = 0; j < quizData.columns; j++) {
            if(i == 0) {
                let categoryContainer = document.createElement("div");
                categoryContainer.className = "quizCategoryContainer";
                grid.appendChild(categoryContainer);

                let category = document.createElement("input");
                category.className = "quizCategory";
                category.type = "text";
                category.autocomplete = "off";
                category.spellcheck = false;
                category.value = quizData.categories[j];
                category.onchange = function() {
                    quizData.categories[j] = category.value;
                    saveQuiz();
                };
                categoryContainer.appendChild(category);

                let categoryIcons = document.createElement("div");
                categoryIcons.className = "categoryIconContainer";
                categoryContainer.appendChild(categoryIcons);

                if(quizData.columns < maxColumns) {
                    let categoryAdd = document.createElement("i");
                    categoryAdd.className = "material-icons addCategoryIcon";
                    categoryAdd.innerHTML = "add";
                    categoryAdd.onclick = function() {addColumn(j + 1)};
                    categoryAdd.onmouseenter = function() {addTooltip(categoryAdd, "Add Category")}
                    categoryAdd.onmouseleave = function() {removeTooltip(categoryAdd)}
                    categoryIcons.appendChild(categoryAdd);
                }

                if(quizData.columns > minColumns) {
                    let categoryDelete = document.createElement("i");
                    categoryDelete.className = "material-icons deleteCategoryIcon";
                    categoryDelete.innerHTML = "delete";
                    categoryDelete.onclick = function() {removeColumn(j)};
                    categoryDelete.onmouseenter = function() {addTooltip(categoryDelete, "Delete Category")}
                    categoryDelete.onmouseleave = function() {removeTooltip(categoryDelete)}
                    categoryIcons.appendChild(categoryDelete);
                }

            } else {
                let qaObject = quiz.quizData.questions[j][i-1];
                let questionContainer = document.createElement("div");
                questionContainer.className = "quizQuestionContainer";
                questionContainer.onclick = function() {openQuestion(i - 1, j)};
                grid.appendChild(questionContainer);

                let question = document.createElement("p");
                question.innerHTML = quizData.pointValues[i - 1];
                question.className = "quizQuestion";
                questionContainer.appendChild(question);

                let markerContainer = document.createElement("div");
                markerContainer.className = "markerContainer";
                questionContainer.appendChild(markerContainer);

                let questionMarker = document.createElement("i");
                if(qaObject.question.text == "" && qaObject.question.image == "" && qaObject.question.audio == "") {
                    questionMarker.className = "marker material-icons";
                } else {
                    questionMarker.className = "selectedMarker marker material-icons";
                }
                questionMarker.innerHTML = "help";
                markerContainer.appendChild(questionMarker);

                let answerMarker = document.createElement("i");
                if(qaObject.answer == "") {
                    answerMarker.className = "marker material-icons";
                } else {
                    answerMarker.className = "selectedMarker marker material-icons";
                }
                answerMarker.innerHTML = "done";
                markerContainer.appendChild(answerMarker);
            }
        }

    }

}

function addColumn(index) {
    quiz.quizData.columns += 1;
    quiz.quizData.categories.splice(index, 0, "???");
    quiz.quizData.questions.splice(index, 0, emptyColumn());
    displayQuiz();
    saveQuiz();
}

function removeColumn(index) {
    quiz.quizData.columns -= 1;
    quiz.quizData.categories.splice(index, 1);
    quiz.quizData.questions.splice(index, 1);
    displayQuiz();
    saveQuiz();
}

function addRow(index) {
    quiz.quizData.rows += 1;
    quiz.quizData.pointValues.splice(index, 0, 300);
    for(let i = 0; i < quiz.quizData.columns;i++) {
        quiz.quizData.questions[i].splice(index, 0, {question: {text: "", image: "", audio: ""}, answer: ""});
    }
    displayQuiz();
    saveQuiz();
}

function removeRow(index) {
    quiz.quizData.rows -= 1;
    quiz.quizData.pointValues.splice(index, 1);
    for(let i = 0; i < quiz.quizData.columns; i++) {
        quiz.quizData.questions[i].splice(index, 1);
    }
    displayQuiz();
    saveQuiz();
}

function emptyColumn() {
    return [{question: {text: "", image: "", audio: ""}, answer: ""},
    {question: {text: "", image: "", audio: ""}, answer: ""},
    {question: {text: "", image: "", audio: ""}, answer: ""},
    {question: {text: "", image: "", audio: ""}, answer: ""},
    {question: {text: "", image: "", audio: ""}, answer: ""}
   ]
      
}

function addTooltip(element, tooltip) {
    tooltipContainer = document.createElement("p");
    tooltipContainer.innerHTML = tooltip;
    tooltipContainer.className = "tooltip";
    element.appendChild(tooltipContainer);
}

function removeTooltip(element) {
    element.removeChild(element.lastChild);
}

function saveQuiz() {

    body = {
        quiz: quiz
        ,
        userData: {
            username: window.localStorage.getItem("username"),
            password: window.localStorage.getItem("password")
        } 
    }

    //Send POST request
    url = "http://localhost:5000/edit-quiz"

    fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body)})
    .then(response => response.json())
    .then(response => {
        console.log(response);
        if(response.status == "success") {
            //TODO
        } else {
            alert("Error: " + response.err);
        }
    }).catch((error) => {
        alert("Error: Unable to connect to the server")
        console.error(error);
    });
}

function openQuestion(row, column) {

    let qaObject = quiz.quizData.questions[column][row]
    document.getElementById("questionPopup").dataset.column = column;
    document.getElementById("questionPopup").dataset.row = row;

    //Blur out background
    document.getElementById("topSection").style.filter = "blur(5px) brightness(90%)";
    document.getElementById("mainContent").style.filter = "blur(5px) brightness(90%)";
    document.getElementById("hr").style.filter = "blur(5px) brightness(90%)";
    document.getElementById("body").style.backgroundColor = "#4836a8";

    //Show question
    document.getElementById("questionHeader").innerHTML = quiz.quizData.categories[column] + " (" + quiz.quizData.pointValues[row] + ")";
    document.getElementById("questionTextarea").value = qaObject.question.text;
    document.getElementById("answerTextarea").value = qaObject.answer;
    document.getElementById("popupContainer").style.display = "block";

}

function closeQuestion() {

    row = document.getElementById("questionPopup").dataset.row;
    column = document.getElementById("questionPopup").dataset.column;
    let qaObject = quiz.quizData.questions[column][row];

    //Save Changes
    qaObject.question.text = document.getElementById("questionTextarea").value;
    qaObject.answer = document.getElementById("answerTextarea").value;
    saveQuiz();
    displayQuiz();

    //Remove question
    document.getElementById("popupContainer").style.display = "none";

    //refocus on background
    document.getElementById("topSection").style.filter = "";
    document.getElementById("mainContent").style.filter = "";
    document.getElementById("hr").style.filter = "";
    document.getElementById("body").style.backgroundColor = "#5c46cf";
}

function swapTool(tool) {

    //Disable all
    document.getElementById("textTool").className = "toolContainer";
    document.getElementById("imageTool").className = "toolContainer";
    document.getElementById("audioTool").className = "toolContainer";
    document.getElementById("textInputOption").style.display = "none";
    document.getElementById("imageInputOption").style.display = "none";
    document.getElementById("audioInputOption").style.display = "none";

    //Select Tool
    if(tool == "text") {
        document.getElementById("textTool").className = "toolContainer selectedTool";
        document.getElementById("textInputOption").style.display = "block";
    }else if(tool == "image") {
        document.getElementById("imageTool").className = "toolContainer selectedTool";
        document.getElementById("imageInputOption").style.display = "block";
    }else if(tool == "audio") {
        document.getElementById("audioTool").className = "toolContainer selectedTool";
        document.getElementById("audioInputOption").style.display = "block";
    }
}