const emojis = document.querySelector(".emojis")
const emojiBoard = document.querySelector(".emoji-board")
let emojiBoardActive = true

console.log("board", emojiBoard)

emojis.addEventListener("click", () => {

    console.log("emoji board style: ", emojiBoard.style.display)

    if (emojiBoardActive) emojiBoard.style.display = "block";
    else emojiBoard.style.display = "none";
    
    emojiBoardActive = !emojiBoardActive
})

//-------------------------------------------------

