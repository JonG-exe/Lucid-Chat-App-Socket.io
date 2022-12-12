const emojisContainer = document.querySelector(".emojis-container")
const emojiBoard = document.querySelector(".emoji-board")
const emojiContainerFace = document.querySelector(".emoji-container-face")
let emojiBoardActive = true

//-------------------------------------------------

// Emoji Modal popup

function toggleModal() {

    if (emojiBoardActive) emojiBoard.style.display = "flex";
    else emojiBoard.style.display = "none";
    
    emojiBoardActive = !emojiBoardActive
}

//-------------------------------------------------

// Close Modal when clicking outside the element

window.onclick = (event) => {

    if(event.target != emojiBoard 
        && event.target != emojisContainer
        && event.target != emojiContainerFace
        && !event.target.classList.contains("emoji")) {
        
            emojiBoard.style.display = "none";
            emojiBoardActive = !emojiBoardActive
    }

}

//-------------------------------------------------

// Append emojis to emojiBoard

const fetchedEmojis = undefined

fetch("/getemojis")
    .then(data => data.json())
    .then(emojiData => {
        for(let i = 0; i < emojiData.length; i++) {
            let newEmojiElement = document.createElement("div");

            newEmojiElement.classList.add("emoji")
            newEmojiElement.innerHTML = emojiData[i].emoji
            emojiBoard.appendChild(newEmojiElement)
        }

        allowEmojiClick()

    })

//-------------------------------------------------

// Add emoji to form input field when clicked

function allowEmojiClick() {
    const emojis = document.querySelectorAll(".emoji")
    const formInput = document.querySelector(".message-input")
    
    for (let i = 0; i < emojis.length; i++) {
        emojis[i].addEventListener("click", () => {
            formInput.value = formInput.value + emojis[i].textContent
        })
    }
}


