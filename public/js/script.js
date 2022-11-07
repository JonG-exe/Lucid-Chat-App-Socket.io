var socket = io();
const messages = document.querySelector(".messages")
const chatStart = document.querySelector(".chat-start")
const firstMessage = true

/*--------------------------------------------------*/

// Load messages from DB to the client

function getMessages(chatId) {
    fetch(`/loadmessages/${chatId}`)
    .then(data => data.json())
    .then(data => {
        data.forEach(messageObj => {
            appendMessage(messageObj.message)
        })
    })
}

getMessages(0)


/*--------------------------------------------------*/

// Clear current chat messages 

function clearCurrChat() {
    let allCurrentMessages = document.querySelectorAll(".message")

    for (let i = 0; i < allCurrentMessages.length; i++) {
        messages.removeChild(allCurrentMessages[i])
    }
}



/*--------------------------------------------------*/

// Listen for incoming messages

socket.on("message", (message) => {
    let diffUser = true
    appendMessage(message, diffUser)

})

/*--------------------------------------------------*/

// Submit new message to Server

const form = document.querySelector(".form")

form.addEventListener("submit", (event) => {

    event.preventDefault();
    let messageData = event.target;
    let message = messageData.message.value;

    console.log("Event target: ", messageData.message)


    if (message !== "") {
        socket.emit("message", message)
        appendMessage(message);
        addToDB(messageData);
        event.target.message.value = "";
    }
})

/*--------------------------------------------------*/

// Add message to DB 

function addToDB(messageData) {
    fetch("/addmessage", {
        method: "POST",

        body: JSON.stringify({
            messageData: { 
                message: messageData.message.value,
                chatId: messageData.chatId.value
            }
        }),

        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
    .catch(e => {console.log("Errors in saving message in DB: ", e)})
}

/*--------------------------------------------------*/

// Function appends messages to document

function appendMessage(message, diffUser) {
    const newDiv = document.createElement("div")
    
    if(diffUser) newDiv.classList.add("message-diff-user")
    
    newDiv.classList.add("message") // add message class to all messages
    newDiv.textContent = message
    messages.appendChild(newDiv)
    messages.scrollTo(0, messages.scrollHeight);
}