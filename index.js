const express = require("express");
const app = express();
const http = require("http").Server(app);
const path = require("path");

const bodyParser = require("body-parser");

const io = require("socket.io")(http);

///middleware
app.use(express.json());
var urlencodedParser = bodyParser.urlencoded({ extended: false });

///Routes
app.get("/", (req, res) => {
  res.sendFile("welcome.html", { root: __dirname });
});
app.get("/users", (req, res) => {
  res.sendFile("users.html", { root: __dirname });
});

app.post("/createuser", urlencodedParser, (req, res) => {
  console.log(req.body.username);
  res.redirect("/createuser");
});
app.get("/createuser", urlencodedParser, (req, res) => {
  res.sendFile("chat.html", { root: __dirname });
});

app.get("/createuser", urlencodedParser, (req, res) => {
  console.log(req.header.username);
  res.sendFile("chat.html", { root: __dirname });
});

//Server
http.listen(3000, (req, res) => {
  console.log("Server is running at 3000");
});

//io server
users = [];
io.on("connection", function (socket) {
  console.log("A user connected");
  socket.on("setUsername", function (data) {
    console.log(data);

    if (users.indexOf(data) > -1) {
      socket.emit(
        "userExists",
        data + " username is taken! Try some other username."
      );
    } else {
      users.push(data);
      socket.emit("userSet", { username: data });
    }
  });

  socket.on("msg", function (data) {
    //Send message to everyone
    io.sockets.emit("newmsg", data);
  });
});
