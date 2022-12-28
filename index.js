const express=require('express');
const bodyParser=require("body-parser");
const cors=require("cors");
const mongoose = require("mongoose");
const dotenv=require("dotenv");
const app=express();
dotenv.config()

const userRoute=require("./routes/user")



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended:true
}))

var corsOptions={
    origin:['*'],
    methods:['GET','POST','PUT','DELETE'],
    optionsSuccessStatus:200
}

app.use(cors(corsOptions)); 
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});


mongoose.connect(process.env.MONGO_URL,(err)=>{
    if(err){
        console.log(err);
    }
    else{
        console.log("connected to mongo sucessfully");
    }
});

app.use("/api/user",userRoute);


app.listen(3000,()=>{
    console.log("Server running on port 3000");
})