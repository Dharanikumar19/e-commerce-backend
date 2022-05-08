const Users = require("../models/userModel")
const Payments = require("../models/paymentModel")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


const userControl = {
    register: async (req, res) => {
        try {
            const { name, email, phone, password } = req.body;

            const user = await Users.findOne({ email })
            if (user) return res.status(400).json({ message: "This Email Already Exists." })

            if (password.length < 8)
                return res.status(400).json({ message: "Password must be atleast 8 characters" })

            // Bcrypt password
            const hashedPassword = await bcrypt.hash(password, 10)
            const newUser = new Users({
                name, email, phone, password: hashedPassword
            })
            await newUser.save()      
            const olduser = await Users.findOne({email})    
            const accesstoken = createAccessToken({id: olduser._id})
    
            res.json({accesstoken}) 

        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    },
    login: async (req, res) =>{
        try {
            const {email, password} = req.body;

            const user = await Users.findOne({email})
            if(!user) return res.status(400).json({msg: "User does not exist"})

            const isMatch = await bcrypt.compare(password, user.password)
            if(!isMatch) return res.status(400).json({msg: "Email Id or Password is Invalid"})

            // If login success , create access token 
            const accesstoken = createAccessToken({id: user._id})
    
            res.json({accesstoken})

        } catch (error) {
            return res.status(500).json({message: error.message})
        }
    },


    logout: async (req, res) =>{
        try {
            res.clearCookie('refreshtoken', {path: '/user/refreshToken'})
            return res.json({message: "Logged out"})
        } catch (error) {
            return res.status(500).json({message: error.message})
        }
    },

    getUser : async (req,res) =>{
        try {
            const user = await Users.findById(req.user.id).select("-password")
            
            if(!user) return res.status(400).json({ message: "User does not exits" })
            res.json(user)

        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    },

    addCart : async (req,res) => {
        try {
            const user = await Users.findById(req.user.id)
            if(!user) return res.status(400).json({message : "User does not exist."})
            await Users.findOneAndUpdate({_id : req.user.id} , {
                cart : req.body.cart
            })
            return res.json({message : "Added to Cart"})
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    },

    history : async (req,res) => {
        try {
            const history = await Payments.find({user_id : req.user.id})
            res.json(history)
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }
}

const createAccessToken = (user) =>{
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn : "1d"})
}


module.exports = userControl