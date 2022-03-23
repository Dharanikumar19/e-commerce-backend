const router = require("express").Router()
const categoryControl = require("../controllers/categoryControl")
const authenticateUsers = require("../middleware/authenticateUsers")
const authenticateAdmin = require("../middleware/authenticateAdmin")


//router fot category -CRUD
router.route("/category")
.get(categoryControl.getCategories)
.post(authenticateUsers, authenticateAdmin, categoryControl.createCategory )


router.route("/category/:id")
.delete(authenticateUsers, authenticateAdmin, categoryControl.deleteCategory)
.put(authenticateUsers, authenticateAdmin, categoryControl.updateCategory)




module.exports = router