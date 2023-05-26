const express = require("express");
const app = express();
const mongoose = require("mongoose");
const multer = require("multer");
const User = require("./model.js");
const path = require("path");
// let x = Math.random() * 10;
// let code = x.toString();
// const filename = user.id;
// const filePath = path.join(__dirname, 'uploads', fileName);
// app.use(express.static(path.join(__dirname, "uploads")));
app.use(express.static(path.join(__dirname, "space")));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const Storage = multer.diskStorage({
    destination:"space",
    filename(req,file,cb){
        cb(null,file.originalname);
    }
})
const upload = multer({
    storage:Storage
}).single("image");



function setExpiry(id){
 setTimeout(async ()=>{
    const result = await User.deleteOne(id)
    console.log(`${id} deleted`);
 }, 100000)   
}

app.post("/send",upload,async(req,res)=>{
    const {username,password} = req.body
    try{
        const user =new User({username,password,image:{name:req.file.filename,path :"/space/"}});
        
        await user.save();
        setExpiry(user._id)
       return  res.status(200).json({username,password})
    }   
    catch(err){
        console.log("helloe baby")
        console.log(err);
       return res.status(404).json(err);
    }
})


// const path = require("path");
app.get("/receive",async(req,res)=>{
    const {username,password} = req.body;
    try{
        const user = await User.receive(username,password)
        const fileName = user.image.name;
        const filePath = path.resolve(__dirname, 'space', fileName);
        app.use(express.static(path.join(__dirname, "space")));
        res.status(200).download(filePath)
    }
    catch(error){
        console.log(error)
        res.status(500).json(error)
    }
})


const dbURI =  "mongodb+srv://guddu:guddu@cluster1.ved7bni.mongodb.net/yes?retryWrites=true&w=majority";
mongoose.connect(dbURI ,{useNewUrlParser : true , useUnifiedTopology: true})
.then((result)=>{const PORT = process.env.PORT || 8888;
    app.listen(PORT, ()=>{
        console.log("server is created")
    })})
.catch((err)=>console.log(err))                     










// const deletedocument = async(user._id)=>{
//     try{
//         const result = await User.deleteOne({user._id})
//     }
//     catch(err){
//         console.log(err)
//     }