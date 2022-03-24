const router = require("express").Router();
const userControl = require("../controllers/userControl");
const authenticate = require("../middleware/authenticateUsers")

router.post("/register", userControl.register)
router.post("/login", userControl.login)
router.get("/logout", userControl.logout)
router.get("/refreshToken", userControl.refreshToken)
router.get("/info", authenticate, userControl.getUser)
router.patch("/addcart", authenticate, userControl.addCart)
router.get("/history", authenticate, userControl.history)

module.exports = router