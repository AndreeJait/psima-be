const http = require("http");
const app = require("./app");
const PORT = process.env.PORT || 3001;
const server = http.createServer({}, app);
const { Server } = require("socket.io");
const students_psikolog = require("./api/models/students_psikolog");
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
const onlineUser = new Set();
function sendOnlineUser(user, isPsikolog) {
  if (isPsikolog === "YES") {
    students_psikolog
      .find({
        psikolog: user,
        student: { $in: [...onlineUser] },
      })
      .then((res) => {
        let found = [];
        res.forEach((item) => {
          io.emit(item.student + "-" + "update-friend-online", {
            id: user,
          });
          found.push(item.student);
        });
        io.emit(user + "-" + "friend-online", found);
      })
      .catch((err) => {
        io.emit(user + "-" + "friend-online-error", {
          message: "Error to get online user",
        });
      });
  } else {
    students_psikolog
      .find({
        student: user,
        psikolog: { $in: [...onlineUser] },
      })
      .then((res) => {
        let found = [];
        res.forEach((item) => {
          io.emit(item.psikolog + "-" + "update-friend-online", {
            id: user,
          });
          found.push(item.psikolog);
        });
        io.emit(user + "-" + "friend-online", found);
      })
      .catch((err) => {
        io.emit(user + "-" + "friend-online-error", {
          message: "Error to get online user",
        });
      });
  }
}
function sendOfflineUser(user, isPsikolog) {
  if (isPsikolog === "YES") {
    students_psikolog
      .find({
        psikolog: user,
        student: { $in: [...onlineUser] },
      })
      .then((res) => {
        res.forEach((item) => {
          io.emit(item.student + "-" + "update-friend-offline", {
            id: user,
          });
        });
      })
      .catch((err) => {
        io.emit(user + "-" + "friend-offline-error", {
          message: "Error to get offline user",
        });
      });
  } else {
    students_psikolog
      .find({
        student: user,
        psikolog: { $in: [...onlineUser] },
      })
      .then((res) => {
        res.forEach((item) => {
          io.emit(item.psikolog + "-" + "update-friend-offline", {
            id: user,
          });
        });
      })
      .catch((err) => {
        io.emit(user + "-" + "friend-offline-error", {
          message: "Error to get offline user",
        });
      });
  }
}
io.on("connection", function (socket) {
  let user = socket.handshake.query.loggeduser;
  let isPsikolog = socket.handshake.query.ispsikolog;
  onlineUser.add(user);
  sendOnlineUser(user, isPsikolog);
  let date = new Date();
  console.log(
    `[LOGIN : ${date.toLocaleString("id-ID")}] User ${user} online in server`
  );
  socket.on("get-online-user", function (data) {
    sendOnlineUser(data.user, data.isPsikolog);
  });
  onlineUser.forEach((item) => {
    socket.on(user + "-message-" + item, function (msg) {
      console.log(user + "-message-" + item);
      io.emit(item + "-receive_message-" + user, msg);
    });
  });
  socket.on("disconnect", function () {
    let _user = socket.handshake.query.loggeduser;
    let _isPsikolog = socket.handshake.query.ispsikolog;
    sendOfflineUser(_user, _isPsikolog);
    onlineUser.delete(_user);
    console.log(
      `[LOGOUT : ${date.toLocaleString(
        "id-ID"
      )}] User ${_user} offline in server`
    );
  });
});

server.listen(PORT, (err) => {
  if (err) {
    throw new Error(err);
  }
  console.log("Start listen server in port " + PORT);
});
