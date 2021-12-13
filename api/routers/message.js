const express = require("express");
const router = express.Router();
const controller = require("../controllers/messageController");
const checkAuth = require("../middleware/check_auth");
router.post("/connect", checkAuth, controller.add_new_friend);
router.post("/", checkAuth, controller.add_new_message);
router.post("/all", checkAuth, controller.get_all_message);
router.post("/all/friend", checkAuth, controller.get_all_friend);
module.exports = router;
