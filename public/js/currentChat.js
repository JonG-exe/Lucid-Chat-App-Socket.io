const chats = document.getElementsByClassName("chat")

    
let currChatPic = document.querySelector(".current-chat")
    .querySelector(".profile-picture")
    .querySelector("img")

let currChatName = document.querySelector(".current-chat")
    .querySelector(".profile-name-status")
    .querySelector(".profile-name")

let selectedChat = {
    profileImage: undefined,
    chatName: undefined
}

for(let i = 0; i < chats.length; i++) {
    chats[i].addEventListener("click", () => {

        selectedChat.profileImage = chats[i]
            .querySelector(".chat-profile-owner")
            .querySelector(".profile-picture")
            .querySelector("img")

        selectedChat.chatName = chats[i]
            .querySelector(".chat-profile-owner")
            .querySelector(".profile-name-mini-message")
            .querySelector(".chat-profile-name")
            .textContent

        currChatPic.src = selectedChat.profileImage.src
        currChatName.textContent = selectedChat.chatName

    })
}
