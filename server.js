require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());


app.use(fileUpload({
    useTempFiles : true
}))


//Routes
app.use("/user", require("./routes/userRouter"))
app.use("/api", require("./routes/categoryRouter"))
app.use("/api", require("./routes/productRouter"))
app.use("/api", require("./routes/paymentRouter"))


//Mongodb Connection
const URI = process.env.MONGODB_URL
mongoose.connect(URI, {
    useNewUrlParser : true,
    useUnifiedTopology : true
}, err => {
    if(err) throw err;
    console.log("database connected successfully")
})

app.get("/", (req,res) =>{
    res.json({message : "Server is running"})
})



const port = process.env.PORT || 4000

app.listen(port, () => console.log('server started on port', port))
