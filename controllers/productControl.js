const Products = require("../models/productModel");



class APIfeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }
    // Filtering the products
    filtering() {
        const queryObj = { ...this.queryString }
        const excludedFields = ['page', 'sort', 'limit']
        excludedFields.forEach(el => delete (queryObj[el]))
        let queryStr = JSON.stringify(queryObj)
        queryStr = queryStr.replace(/\b(gte|gt|lt|lte|regex)\b/g, match => '$' + match)
        this.query.find(JSON.parse(queryStr))
        return this;
    }
    //Sorting the Products
    sorting() {
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(',').join(' ')
            this.query = this.query.sort(sortBy)
        } else {
            this.query = this.query.sort('-createdAt')
        }
        return this;
    }
    //Product Pages
    paginating() {
        const page = this.queryString.page * 1 || 1
        const limit = this.queryString.limit * 1 || 21
        const skip = (page - 1) * limit;
        this.query = this.query.skip(skip).limit(limit)
        return this;
    }
}


const productControl = {
    getProducts: async (req, res) => {
        try {
            const features = new APIfeatures(Products.find(), req.query).filtering().sorting().paginating()
            const products = await features.query
            res.json({
                status: 'success',
                result: products.length,
                products: products
            })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    },
    createProduct: async (req, res) => {
        try {
            const { product_id, imageUrl, title, price, description, content, category } = req.body;
            if (!imageUrl) return res.status(400).json({ message: "No image found" })
            const product = await Products.findOne({ product_id })
            if (product)
                return res.status(400).json({ message: "This Product already exits" })

            const newProduct = new Products({
                product_id, imageUrl, title: title.toLowerCase(), price, description, content, category
            })
            await newProduct.save()
            res.json({ message: "New Product Created" })

        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    },
    deleteProduct: async (req, res) => {
        try {
            await Products.findByIdAndDelete(req.params.id)
            res.json({ message: "Product Deleted" })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    },
    updateProduct: async (req, res) => {
        try {
            const { product_id, imageUrl, title, price, description, content, category } = req.body;
            if (!imageUrl) return res.status(400).json({ message: "No image found" })

            await Products.findOneAndUpdate({ _id: req.params.id }, {
                imageUrl, title: title.toLowerCase(), price, description, content, category
            })
            res.json({ message: "Product Updated" })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    },
}

module.exports = productControl