
function loginWithValues() {
    let username = document.getElementById("loginInputUsername").value;
    let password = document.getElementById("loginInputPassword").value;
    attemptLogin(username, password);
}

function createWithValues() {
    let username = document.getElementById("signupInputUsername").value;
    let password = document.getElementById("signupInputPassword").value;

    //Criteria Checking
    let errors = [];
    if(username.length < 5) {
        errors.push("Username is too short");
    }
    if(username.length > 30) {
        errors.push("Username is too long");
    }
    if(password.length < 5) {
        errors.push("Password is too short");
    }
    if(password.includes(" ")) {
        errors.push("password contains spaces");
    }

    let errorResponse = "";
    for(let i = 0; i < errors.length; i++) {
        errorResponse += errors[i] + "<br>";
    }

    let errorMessage = document.getElementById("signupError");
    errorMessage.innerHTML = errorResponse;
    if(errors.length == 0) {
        attemptAccountCreation(username, password);
    }
}

function changeSection(section) {

    //Hide old section
    document.getElementById("loginSectionButton").className = "";
    document.getElementById("signupSectionButton").className = "";
    document.getElementById("loginSection").style.display = "none";
    document.getElementById("signupSection").style.display = "none";
    document.getElementById("loginError").innerHTML = "";
    document.getElementById("signupError").innerHTML = "";

    //Reveal new section
    document.getElementById(section + "SectionButton").className = "selectedSection";
    document.getElementById(section + "Section").style.display = "block";
    
}

function attemptAccountCreation(username, password) {
    url = "http://localhost:5000/signup"
    userData = {username: username, password: password};

    fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData)})
    .then(response => response.json())
    .then(response => {
        console.log(response);
        if(response.status == "success") {
            window.localStorage.setItem("username", username);
            window.localStorage.setItem("password", password);
            window.sessionStorage.setItem("login", true);
            window.location = "home.html";
        } else {
            let errorMessage = document.getElementById("signupError");
            errorMessage.innerHTML = response.err;
        }
    }).catch((error) => {
        alert("Error: Unable to connect to the server")
        console.error(error);
    });
}

function attemptLogin(username, password) {
    url = "http://localhost:5000/login"
    userData = {username: username, password: password};

    fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData)})
    .then(response => response.json())
    .then(response => {
        console.log(response);
        if(response.status == "success") {
            window.localStorage.setItem("username", username);
            window.localStorage.setItem("password", password);
            window.sessionStorage.setItem("login", true);
            window.location = "home.html";
        } else {
            let errorMessage = document.getElementById("loginError");
            errorMessage.innerHTML = response.err;
        }
    }).catch((error) => {
        alert("Error: Unable to connect to the server")
        console.error(error);
    });

}

async function quickLogin(username, password) {
    url = "http://localhost:5000/login"
    userData = {username: username, password: password};

    await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData)})
    .then(response => response.json())
    .then(response => {
        if(response.status == "success") {
            window.sessionStorage.setItem("login", true);
        }
    }).catch((error) => {
        console.error(error);
    });
}
