document.addEventListener("DOMContentLoaded", pageLoaded);

function pageLoaded() {

    //Check if logged in
    let username = window.localStorage.getItem("username");
    let password = window.localStorage.getItem("password");
    
    if(username != null && password != null) {
        if(window.sessionStorage.getItem("login") == "true") {
            userLoggedIn(username);
        } else {
            quickLogin(username, password).then(() => {
                userLoggedIn(username);
            }) ;
        }
    }

}

function userLoggedIn(username) {

    //Navbar
    navbarUser = document.getElementById("navbarUser");
    navbarUser.innerHTML = username;
    navbarUser.href = "user.html";

    //Create Button
    createButton = document.getElementById("createButton");
    createButton.className = "";
    createButton.href="create-quiz.html"
}