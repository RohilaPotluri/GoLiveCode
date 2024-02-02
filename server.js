const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const http = require("http");
const socketIo = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const port = 3000;
const fs = require("fs");
const cors = require("cors");
const { passport, getProfile } = require("./auth");
const path = require("path");
const ejs = require("ejs");

const GoogleStrategy = require("passport-google-oauth20").Strategy;

//session
app.use(
    session({
        secret: "Our little secret.",
        resave: true,
        saveUninitialized: true,
    })
);

app.use(passport.initialize());
app.use(passport.session());

// Serve static files from the root directory

app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, "webpages")));
app.use(express.static(__dirname + "/webpages/CurrentProjects"));
app.use(express.static(__dirname + "/webpages/codingspace"));
app.use(
    "/socket.io",
    express.static(__dirname + "/node_modules/socket.io/client-dist")
);
app.use(cors());

app.use(express.json());
app.use(express.static("webpages"));

//Utilizing bodyParser
app.use(bodyParser.json());

function isLoggedIn(req, res, next) {
    req.user ? next() : res.sendStatus(401);
}

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.get(
    "/auth/google",
    passport.authenticate("google", { scope: ["email", "profile"] })
);

app.get(
    "/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/auth/failure" }),
    (req, res) => {
        // Successful authentication, redirect to currentProjects.html
        res.redirect("/home");
    }
);

app.get("/home", isLoggedIn, (req, res) => {
    res.sendFile(__dirname + "/webpages/CurrentProjects/currentProjects.html");
    console.log(getProfile().displayName);
});

app.get("/createProject", (req, res) => {
    res.sendFile(__dirname + "/webpages/createproject/page2.html");
});

app.get("/auth/failure", (req, res) => {
    res.send("Wrong credentials!");
});

app.get("/logout", (req, res) => {
    req.logout();
    res.send("Goodbye!");
    console.log("User logged out");
});

app.get("/getProfile", (req, res) => {
    try {
        console.log(getProfile().displayName);
        const profile = getProfile();
        console.log(profile);
        if (!profile) {
            throw new Error("Profile not found");
        }
        console.log(profile);
        res.json(profile);
    } catch (error) {
        console.error("Error fetching profile:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.get("/:roomName", (req, res) => {
    const roomName = req.params.roomName;
    const filePath = __dirname + `/webpages/codingspace/coding.html`;

    fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
            console.error("Error reading HTML file:", err);
            return res.status(500).send("Internal Server Error");
        }
        res.send(data);
    });
});

// WebSocket handling
io.on("connection", (socket) => {
    socket.on("joinRoom", (roomName) => {
        socket.join(roomName);
        console.log(`User joined the room: ${roomName}`);
    });

    socket.on("codeChange", (data) => {
        const { roomName, newCode } = data;
        io.to(roomName).emit("codeChange", newCode);
    });

    socket.on("disconnect", () => {
        console.log("A user disconnected");
    });
});

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
