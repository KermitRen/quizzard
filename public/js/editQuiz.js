document.addEventListener("DOMContentLoaded", pageLoaded);

function pageLoaded() {

    let urlParams = new URLSearchParams(window.location.search);
    quizID = urlParams.get("id");

    if(quizID == null) {
        console.error("quiz ID not found");
        displayQuiz({
            "quizName": "Musik Quiz test 1",
            "quizType": "Jeopardy",
            "quizData": {rows: 5, columns: 5, pointValues: [100, 200, 300, 400, 500]},
            "quizID": "d0fb130f-e16e-4e8e-a19a-6e3d1b5bd2bf",
            "private": true,
            "creatorName": "Kermit Ren",
            "date": "2021-09-11T13:48:08.091Z"
          });
    } else {
        let url = "http://localhost:5000/find-quiz/" + quizID;
        fetch(url).then(response => response.json())
        .then(response => {
            if(response.status == "success") {
              displayQuiz(response.quiz);
            }
        });
    }

}

function displayQuiz(quiz) {


    //Load Title
    document.getElementById("quizTitle").value = quiz.quizName;

    //Setup Grid Structure
    let quizData = quiz.quizData;
    let grid = document.getElementById("quizGrid");
    let hSize = 100/((quizData.columns + 1) * 2);
    let vSize = 100/((quizData.columns + 2))

    grid.style.gridTemplateColumns = (hSize + "% ") + (hSize*2 + "% ").repeat(quizData.columns);
    grid.style.gridTemplateRows = (vSize + "% ").repeat(quizData.columns + 1);
    //grid.style.gridTemplateRows = ((90/(quizData.rows + 1)) + "vh ").repeat(quizData.rows + 1);
    
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
        }
        rowPoints.value = quizData.pointValues[i - 1];
        rowPointsContainer.appendChild(rowPoints);
        }

        //Question Columns
        for(let j = 0; j < quizData.columns; j++) {
            if(i == 0) {
                let category = document.createElement("div");
                category.innerHTML = "category";
                category.className = "quizCategory";
                grid.appendChild(category);

            } else {
                let question = document.createElement("p");
                question.innerHTML = quizData.pointValues[i - 1];
                question.className = "quizQuestion";
                grid.appendChild(question);
            }
        }

    }


}