import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 10000;

console.log("MONGO_URI exists:", !!process.env.MONGO_URI);

async function connectDB() {

try{

await mongoose.connect(process.env.MONGO_URI);

console.log("MongoDB Connected");

}catch(err){

console.log("MongoDB connection error:",err.message);

}

}

connectDB();


const UserSchema = new mongoose.Schema({

email:String,

demoBalance:{
type:Number,
default:10000
},

realBalance:{
type:Number,
default:0
}

});

const User = mongoose.model("User",UserSchema);



app.get("/",(req,res)=>{

res.send("MetaBinary Backend Running");

});


app.get("/api/user/:email",async(req,res)=>{

try{

let user = await User.findOne({

email:req.params.email

});

if(!user){

user = await User.create({

email:req.params.email

});

}

res.json(user);

}catch(err){

res.status(500).json({

message:err.message

});

}

});



app.post("/api/deposit",async(req,res)=>{

try{

const{

email,

amount

}=req.body;

let user=await User.findOne({

email

});

if(!user){

user=await User.create({

email

});

}

user.realBalance += Number(amount);

await user.save();

res.json({

success:true,

balance:user.realBalance

});

}catch(err){

res.status(500).json({

message:err.message

});

}

});



app.listen(PORT,()=>{

console.log(

`Server running on ${PORT}`

);

});
