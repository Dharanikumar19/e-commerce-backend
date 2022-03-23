const router = require("express").Router()
const paymentControl = require("../controllers/paymentControl");
const authenticateUsers = require("../middleware/authenticateUsers");
const authenticateAdmin = require("../middleware/authenticateAdmin");

router.route("/payment")
.get(authenticateUsers, authenticateAdmin, paymentControl.getPayments)
.post(authenticateUsers, paymentControl.createPayment)

module.exports = router;