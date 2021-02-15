require('dotenv').config();
const express=require("express");
const bodyParser=require("body-parser");
const ejs=require("ejs");
const mongoose=require("mongoose");
const encrypt=require("mongoose-encryption");

const app=express();


app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));

 mongoose.connect('mongodb://localhost/usersDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const userSchema= new mongoose.Schema({ //here it is creating new schema instead of javascript object ,this is because we jave install "mongoose-encrytion" module
    email:String,
    password:String
});


//when we save the data it will encrypt and when find method called it will decrypted.
userSchema.plugin(encrypt, { secret: process.env.API_KEY,encryptedFields: ['password'] });

const User=new mongoose.model("User",userSchema);

app.get("/", function(req,res){
    res.render("home");
});

app.get("/login", function(req,res){
    res.render("login");
});


app.get("/register", function(req,res){
    res.render("register");
});


app.post("/register",function(req,res){  //storing username and password in userDB.
    const newUser=new User({
        email:req.body.username,
        password:req.body.password
    })
newUser.save(function(err){
    if(err){
        console.log(err);
    }else{
        res.render("secrets");  // once user register themself they will directly redirect to scerets page.
   }
});
});

app.post("/login",function(req,res){
    const username=req.body.username;  //storing the eneterd data in const  for validtion.
    const password=req.body.password;

    User.findOne({email:username},function(err,founduser){  //find email that have data of current "username" in userDB.
        if (err){
            console.log(err);
        }else{
            if(founduser.password===password){ //once found the email then check for password of "founduser" that is current user.
            res.render("secrets");
        }
        }
    })
})







app.listen(3000,function(){
    console.log("Server Started at Port 3000.")
})