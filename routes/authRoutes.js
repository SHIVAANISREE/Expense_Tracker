const router = require("express").Router();
const {register, login, changePassword} = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);
router.post("/change-password", changePassword);

module.exports = router;
