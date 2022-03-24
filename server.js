require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    preflightContinue: true,
    credentials: true,
    origin: "https://dk-e-commerce.netlify.app"
}));

app.use(fileUpload({
    useTempFiles: true
}))

app.use(function (req, res, next) {
    res.header('Content-Type', 'application/json;charset=UTF-8')
    res.header('Access-Control-Allow-Credentials', true)
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept',
        "Access-Control-Allow-Origin", "https://dk-e-commerce.netlify.app"
    )
    next()
})

//Routes
app.use("/user", require("./routes/userRouter"))
app.use("/api", require("./routes/categoryRouter"))
app.use("/api", require("./routes/productRouter"))
app.use("/api", require("./routes/paymentRouter"))


//Mongodb Connection
const URL = process.env.MONGODB_URL
mongoose.connect(URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, err => {
    if (err) throw err;
    console.log("database connected")
})

app.get("/", (req, res) => {
    res.json({ message: "Server is running" })
})



const PORT = process.env.PORT || 4000

app.listen(PORT, () => { console.log(`Server is running on ${PORT}`) })
