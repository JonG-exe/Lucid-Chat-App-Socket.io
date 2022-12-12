function makeMovable() {
    const movables = document.getElementsByClassName("movable")
    const body = document.querySelector("body")
    let offsetX, offsetY, originalRect = undefined
    let zIndex =  0

    // Loop only necessary for multiple movable elements
    for(let i = 0; i < movables.length; i++) {
        console.log("movables", i, ": ", movables[i])

        movables[i].addEventListener("mousedown", (e) => {
            movables[i].style.cursor = "grab"

            originalRect = movables[i].getBoundingClientRect()

            offsetX = e.clientX - originalRect.x
            offsetY = e.clientY - originalRect.y

            // Next if statement is used to check if the top and right borders
            // of a movable element is being dragged. If they are, the element
            // cannot be moved. These areas are reserved to allow for resizing in the 
            // 'resizeElements' script. -20 is the offset from the edge.

            if (( e.clientY < (originalRect.y + 40))
                && ! (e.clientX > (originalRect.x + originalRect.width) - 20)
                && ! (e.clientY > (originalRect.y + originalRect.height) - 20)
            ) {
                body.addEventListener("mousemove", calcElementPosition)
                body.addEventListener("mouseup", () => {
                        body.removeEventListener("mousemove", calcElementPosition)
                        movables[i].style.cursor = "default"
                })

            }
        })

        // Calculates element position relative to the mouse
        const calcElementPosition = function (e) {
            let newPosX = ( e.clientX - offsetX ) / window.innerWidth
            let newPosY = ( e.clientY - offsetY ) / window.innerHeight

            movables[i].style.left = `${newPosX * 100}%`
            movables[i].style.top = `${newPosY * 100}%`
            movables[i].style.zIndex = zIndex++
        }
    }	
}

makeMovable()
