
function createQuiz() {


    //Get quiz information
    nameInput = document.getElementById("createInputName").value

    body = {
        quiz: {
            type: "Jeopardy",
            name: (nameInput == "") ? "Unnamed Quiz" : nameInput,
            private: document.getElementById("createInputPrivate").checked
        }
        ,
        userData: {
            username: window.localStorage.getItem("username"),
            password: window.localStorage.getItem("password")
        } 
    }

    //Send POST request
    url = "http://localhost:5000/create-quiz"

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
            window.location = "".concat("edit-quiz.html?id=",response.quiz.quizID);
        } else {
            alert("Error: " + response.err);
        }
    }).catch((error) => {
        alert("Error: Unable to connect to the server")
        console.error(error);
    });
}