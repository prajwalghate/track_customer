const express = require("express");
const router = express.Router();
const { getKey } = require("../controllers/user");
const { updateUser } = require("../controllers/user");
const { getUser } = require("../controllers/user");
const { updatebyId } = require("../controllers/user");

// router.param("userId", getUserById);

// router.get("/user/:userId", getUser);
router.put("/user/update/:key", updateUser);
router.get("/user/getKey", getKey);
router.get("/user/getUser/:key", getUser);
router.put("/user/updatebyId/:id", updatebyId);

module.exports = router;
