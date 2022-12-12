const 
    Message = require("./models/Message"),
    User = require("./models/User"),
    mongoose = require("mongoose"),
    { arrange } = require ("emoji-api"),
    // layouts = require("express-ejs-layouts"),
    PORT = process.env.PORT || 5000,
    path = require("path"),
    express = require("express"),
    app = express(),
    http = require("http"),
    server = http.createServer(app),
    io = require("socket.io")(server, {
        cors: {
            origin: "*",
        }
    });


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
    console.log("\n\t...Connected to mongoDB...")
)
.catch(error => console.log("Error connecting to mongoDB...: ", error))

/* ------------------------------ */

// Listen for changes to Messages model in DB

let tempNewMessageObj = undefined
const messageEventEmitter = Message.watch()

messageEventEmitter.on("change", (change => {
    tempNewMessageObj = change.fullDocument
    // console.log(tempNewMessageObj)
}))

/**
 * ================================= Socket.io ======================================== /
 */

io.on("connection", (socket) => {

    console.log("A user connected");

    socket.on("message", (message) => {
        socket.broadcast.emit("message", message)
    })

    socket.on("disconnect", () => {
        console.log("A user disconnected")
    })

})

/**
 * ================================= Express ======================================== /
 */

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// app.set('views', __dirname + '/views');
// app.engine('html', ejs);
app.set('view engine', 'ejs');


app.get("/", (req, res) => {
    res.render("login", {loginStatus: ""})
})

app.post("/login", (req, res) => {

    User.exists({ email: req.body.email, password: req.body.password}, (error, doc) => {

        if(doc == null) {
            res.render("login", {loginStatus: "user_not_found"})
        }
        else{
            // res.redirect("/chat")
            res.render("index") // index is chat
        }
    })
})

app.get("/index", (req, res) => {
    res.render("index", {loginStatus: ""})
})

app.get("/signup", (req, res) => {
    res.render("signup")
})

app.post("/signup", (req, res) => {

    const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        id: "need_to_add_custom_ids"
    })

    newUser.save()
        .then((user) => {
            console.log("New user saved: ", user)
        })
        .catch(error => {
            console.log("Erorr try to save new user: ", error)
        })
})


app.get("/loadmessages/:chatId", (req, res) => {
    let chatId = req.params.chatId
    console.log("On server load messages: ", chatId)

    Message.find({
        chatId: chatId
    })
    .then(data => res.json(data))
})

app.get("/newmessage", (req, res) => {
    let data = tempNewMessageObj
    res.json(data)
})


app.post("/addmessage", (req, res) => {

    let body = req.body

    const newMessage = new Message({
        message: body.messageData.message,
        chatId: body.messageData.chatId,
        receiverId: "test"
    })

    newMessage.save().then(() => console.log("\nSuccessfully saved message..."))

    res.sendStatus(200)
})

app.get("/getemojis", (req, res) => {

    emojisToSend = arrange()["Smileys & Emotion"]

    // console.log("Newmoji: ", emojisToSend[0]["_data"].emoji)

    res.json(emojisToSend)
})

app.get("/user_not_found", (req, res) => {
    res.render("user_not_found")
})


server.listen(PORT, () => console.log(`\n\tListening: http://localhost:${PORT}\n`))

