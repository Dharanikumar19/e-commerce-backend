const Users = require("../models/userModel")
const Payments = require("../models/paymentModel")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


const userControl = {
    register: async (req, res) => {
        try {
            const { name, email, phone, password } = req.body;

            const user = await Users.findOne({ email })
            if (user) return res.status(400).json({ message: "This Email already exists" })

            if (password.length < 5)
                return res.status(400).json({ message: "Password must be atleast 5 characters" })

            // Bcrypt password
            const hashedPassword = await bcrypt.hash(password, 10)
            const newUser = new Users({
                name, email, phone, password: hashedPassword
            })
            await newUser.save()
            res.json({ msg: "Registration Successful" })

        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    },
    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await Users.findOne({ email })
            if (!user) return res.status(400).json({ message: "User does not exists" })

            const isMatch = await bcrypt.compare(password, user.password)
            if (!isMatch) return res.status(400).json({ message: "Email-id or Password did not match" })

            const refreshtoken = createRefreshToken({ id: user._id })

            res.cookie('refreshtoken', refreshtoken, {
                httpOnly: true,
                path: '/user/refresh_token',
                maxAge: 7 * 24 * 60 * 60 // 7days
            })

            res.json({ msg: "Login Succesfull", user })

        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    },
    refreshToken: (req, res) => {
        try {
            const rf_token = req.cookies.refreshtoken;
            if (!rf_token) return res.status(400).json({ message: "Please Login or Register" })

            jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
                if (err) return res.status(400).json({ message: "Please Login or Register" })
                const accesstoken = createAccessToken({ id: user.id })
                res.json({ accesstoken })
            })

        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    },
    logout: async (req, res) => {
        try {
            res.clearCookie("refreshtoken", { path: "/user/refresh_token" })
            return res.json({ message: "Logged Out" })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    },
 
    getUser: async (req, res) => {
        try {
            const user = await Users.findById(req.user.id).select("-password")

            if (!user) return res.status(400).json({ message: "User does not exits" })
            res.json(user)

        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    },

    addCart: async (req, res) => {
        try {
            const user = await Users.findById(req.user.id)
            if (!user) return res.status(400).json({ message: "User does not exist." })
            await Users.findOneAndUpdate({ _id: req.user.id }, {
                cart: req.body.cart
            })
            return res.json({ message: "Added to Cart" })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    },
    history: async (req, res) => {
        try {
            const history = await Payments.find({ user_id: req.user.id })
            res.json(history)
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }
}

const createAccessToken = (user) => {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1h" })
}

const createRefreshToken = (user) => {
    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" })
}

module.exports = userControl