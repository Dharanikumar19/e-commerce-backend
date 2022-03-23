const router = require("express").Router()
const productControl = require("../controllers/productControl")

router.route("/products")
    .get(productControl.getProducts)
    .post(productControl.createProduct)

router.route("/products/:id")
    .put(productControl.updateProduct)
    .delete(productControl.deleteProduct)

module.exports = router