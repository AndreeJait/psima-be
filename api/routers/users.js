const express = require("express");
const router = express.Router();
const controller = require("../controllers/usersController");
const multer = require("multer");
const path = require("path");
const checkAuth = require("../middleware/check_auth");
const fs = require("fs");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let destination = "student";
    if (req.body.isPsikolog === "YES") {
      destination = "psikolog";
    }
    let type = req.body.typefile;
    if (
      req.body.typefile === undefined ||
      req.body.typefile === null ||
      req.body.typefile.trim() === ""
    ) {
      type = "image";
    }
    let path =
      "./public/" + destination + "/" + type + "/" + req.body.email + "/";
    fs.mkdirSync(path, { recursive: true });
    cb(null, path);
  },
  filename: function (req, file, cb) {
    var today = new Date();
    var timeStr = today.getTime().toString();
    cb(null, timeStr + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 50,
  },
});

router.post("/login", controller.login_process);
router.post("/register", upload.single("sipp"), controller.register_process);
router.get("/psikolog/all", checkAuth, controller.get_psikolog);
router.post("/psikolog/all", checkAuth, controller.get_psikolog_students);
router.get("/students/all", checkAuth, controller.get_students);
module.exports = router;
