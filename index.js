const 
    Message = require("./models/Message"),
    mongoose = require("mongoose"),
    path = require("path")
    cors = require("cors"),
    express = require("express"),
    app = express(),
    http = require("http"),
    server = http.createServer(app),
    { Server } = require("socket.io"),
    io = new Server(server);
    PORT = process.env.PORT || 5000;

/**
 * ================================= Mongoose ======================================== /
 */

mongoose.connect(
    `mongodb+srv://jonG:GosoJbcx2jxdojXW@application.h00aiy3.mongodb.net/Data`,
    {
        useUnifiedTopology: true,
        useNewUrlParser: true
    }
)
.then(
    console.log("\n\tConnected to mongoDB")
)
.catch(error => console.log("Error: ", error))

/* ------------------------------ */

// Listen for changes to Messages model in DB

let tempNewMessageObj = undefined
const messageEventEmitter = Message.watch()

messageEventEmitter.on("change", (change => {
    tempNewMessageObj = change.fullDocument
    // console.log(tempNewMessageObj)
}))


/**
 * ================================= Express ======================================== /
 */

app.use(
    cors({
        origin: "*"
    })
);
app.use(express.urlencoded({extended: true}));
app.use(express.json());
// app.use(express.static("public"))
app.use(express.static(path.join(__dirname, 'public')));


app.get("/", (req, res) => {
    res.render("index.html")
})

io.on("connect", (socket) => {

    console.log("A user connected");

    socket.on("message", (message) => {
        socket.broadcast.emit("message", message)
    })

    socket.on("disconnect", () => {
        console.log("A user disconnected")
    })

})

app.get("/loadmessages", (req, res) => {
    Message.find({})
    .then(data => res.json(data))
})

app.get("/newmessage", (req, res) => {
    let data = tempNewMessageObj
    res.json(data)
})

app.get("/test", (req, res) => {
    res.json({test: "this is a json test string"})
})

app.post("/addmessage", (req, res) => {

    const newMessage = new Message({
        message: req.body.message,
    })

    newMessage.save().then(() => console.log("\nSuccessfully saved message..."))

    res.sendStatus(200)
})

server.listen(PORT, () => console.log(`\n\tListening: http://localhost:${PORT}\n`))

