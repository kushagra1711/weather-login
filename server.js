const express = require("express");
const env = require("dotenv").config();
const ejs = require("ejs");
const path = require("path");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);

mongoose.connect(
    "mongodb+srv://kuxi:kuxi@cluster0.5iuws.mongodb.net/weatherly?retryWrites=true&w=majority",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    },
    (err) => {
        if (!err) {
            console.log("[INFO] MongoDB Connection Succeeded");
        } else {
            console.log("[ERROR] Error in DB connection : " + err);
        }
    }
);

var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {});

app.use(
    session({
        secret: "work hard",
        resave: true,
        saveUninitialized: false,
        store: new MongoStore({
            mongooseConnection: db,
        }),
    })
);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(__dirname + "/views"));

var index = require("./routes/index");
app.use("/", index);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error("[ERROR] File Not Found");
    err.status = 404;
    next(err);
});

// error handler
// define as the last app.use callback
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.send(err.message);
});

const PORT = process.env.PORT || 4500;
app.listen(PORT, function () {
    console.log("[INFO] Server is started on http://127.0.0.1:" + PORT);
});
