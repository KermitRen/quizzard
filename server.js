const express = require("express");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const path = require("path");
const app = express();
const port = 5000;

//Get data
const users =  JSON.parse(fs.readFileSync("data/users.json"));
const quizzes = JSON.parse(fs.readFileSync("data/quizzes.json"));

//Usefull Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "public"), {index: "home.html"}));


//Login Routing
app.post("/login", (req, res) => {

    let userData = req.body;
    if(userExists(userData.username)) {
        if(verifyPassword(userData.username,userData.password)) {
            res.json({status: "success"});
        } else {
            res.json({status: "failure", err: "Invalid password"});
        }
    } else {
        res.json({status: "failure", err: "User does not exist"});
    }
})

app.post("/signup", (req, res) => {

    let userData = req.body;

    if(userData.username.length < 5 || userData.username.length > 30 ||
       userData.password.length < 5 || userData.password.includes(" ")) {
        res.json({status: "failure", err: "Invalid user data"})
    }

    if(userExists(userData.username)) {
        res.json({status: "failure", err:"User already exists"})
    } else {
        if(users.length >= 100) {
            res.json({status: "failure", err: "We have too many users"})
        } else {
            users[userData.username] = userData.password;
            fs.writeFile("data/users.json", JSON.stringify(users, null, 2), 'utf8', () => console.log("!!!!"));
            res.json({status: "success"});
        }
    }
})

//Quiz routing
app.post("/create-quiz", (req, res) => {

    let userData = req.body.userData;
    let quiz = req.body.quiz;

    if(verifyPassword(userData.username, userData.password)) {

        let quizObject = {
            quizName: quiz.name,
            quizType: quiz.type,
            quizData: {},
            quizID: uuidv4(),
            private: quiz.private,
            creatorName: userData.username,
            date: new Date()
        }

        quizzes.push(quizObject);
        fs.writeFile("data/quizzes.json", JSON.stringify(quizzes, null, 2), 'utf8', () => {});
        res.json({status: "success", quiz: quizObject});
        
    } else {
        res.json({status: "failure", err:"Invalid user data"})
    }

})

app.post("/delete-quiz", (req, res) => {

    let userData = req.body.userData;

    if(verifyPassword(userData.username, userData.password)) {

        let quizID = req.body.quizID;

        for(let i = 0; i < quizzes.length; i++) {
            quiz  = quizzes[i];
            if(quiz.creatorName == userData.username && quiz.quizID == quizID) {
                quizzes.splice(i, 1);
            }
        }
        let userQuizzes = quizzes.filter(quiz => quiz.creatorName == userData.username);
        fs.writeFile("data/quizzes.json", JSON.stringify(quizzes, null, 2), 'utf8', () => {});
        res.json({status: "success", quizzes: userQuizzes});
        
    } else {
        res.json({status: "failure", err:"Invalid user data"})
    }

})

app.get("/find-quizzes/:username", (req, res) => {

    let username = req.params.username;

    if(username != null) {
        const usersQuizzes = quizzes.filter(quiz => quiz.creatorName == username);
        res.json({status: "success", quizzes: usersQuizzes});
    } else {
        res.json({status: "failure", err: "No username provided"})
    }

})

app.get("/find-quiz/:id", (req, res) => {

    let quizID = req.params.id;

    if(quizID != null) {
        let quiz = quizzes.find(quiz => quiz.quizID == quizID);
        res.json({status: "success", quiz: quiz});
    } else {
        res.json({status: "failure", err: "No id provided"})
    }

})

//Begin Listening
app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`)
})

//Helper functions
function userExists(username) {
    return users.hasOwnProperty(username);
}

function verifyPassword(username, password) {
    return users[username] == password;
}