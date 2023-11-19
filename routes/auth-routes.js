const express = require("express");
const router = express.Router();
const {
    register,
    login,
    googleAuth,
    getUserNameById
} = require("../controllers/auth-controller")
router.post("/register", register);
router.post("/login", login);
router.post("/api/google", googleAuth);
router.get("/:user_id", getUserNameById)
module.exports = router;