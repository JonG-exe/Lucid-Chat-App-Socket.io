// var socket = io();
const test = document.querySelector(".test")
const testMessage = document.querySelector(".testMessage")

/*--------------------------------------------------*/

// Load messages from DB to the client

    // https://server-lucidity-chat-app.vercel.app

fetch("/loadmessages")
    .then(data => data.json())
    .then(data => data.forEach(messageObj => {
        appendMessage(messageObj.message)
    }))





/*--------------------------------------------------*/

// Add message to DB 

function addToDB(message) {
    fetch("/addmessage", {
        method: "POST",

        body: JSON.stringify({
            message: message
        }),

        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
    .catch(e => {console.log("Errors in saving message in DB: ", e)})
}

/*--------------------------------------------------*/

// Function appends messages to document

function appendMessage(message) {
    const newDiv = document.createElement("div")
    
    newDiv.classList.add("testMessage")
    newDiv.textContent = message
    test.appendChild(newDiv)
    test.scrollTo(0, test.scrollHeight);
}