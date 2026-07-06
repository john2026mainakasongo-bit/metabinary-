import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("MongoDB Connected");
})
.catch((err) => {
    console.log(err);
});

const userSchema = new mongoose.Schema({

    name:String,

    email:{
        type:String,
        unique:true
    },

    password:String,

    demoBalance:{
        type:Number,
        default:10000
    },

    realBalance:{
        type:Number,
        default:0
    }

});

const User = mongoose.model("User",userSchema);

app.get("/",(req,res)=>{

    res.send("MetaBinary Backend Running");

});

app.post("/api/register",async(req,res)=>{

    try{

        const {name,email,password}=req.body;

        const exists=await User.findOne({email});

        if(exists){

            return res.json({

                success:false,

                message:"Account already exists"

            });

        }

        const user=await User.create({

            name,

            email,

            password,

            demoBalance:10000,

            realBalance:0

        });

        res.json({

            success:true,

            token:"token-"+Date.now(),

            user

        });

    }

    catch(err){

        res.json({

            success:false,

            message:err.message

        });

    }

});

app.post("/api/login",async(req,res)=>{

    const {email,password}=req.body;

    const user=await User.findOne({

        email

    });

    if(!user){

        return res.json({

            success:false,

            message:"Account not found"

        });

    }

    if(user.password!==password){

        return res.json({

            success:false,

            message:"Wrong password"

        });

    }

    res.json({

        success:true,

        token:"token-"+Date.now(),

        user

    });

});

app.get("/api/user/:email",async(req,res)=>{

    const user=await User.findOne({

        email:req.params.email

    });

    if(!user){

        return res.json({

            success:false

        });

    }

    res.json({

        success:true,

        user

    });

});

app.post("/api/deposit",async(req,res)=>{

    const {

        email,

        amount,

        phone

    }=req.body;

    const user=await User.findOne({

        email

    });

    if(!user){

        return res.json({

            success:false,

            message:"User not found"

        });

    }

    user.realBalance+=Number(amount);

    await user.save();

    res.json({

        success:true,

        message:`Deposit received from ${phone}`,

        user

    });

});

const PORT=process.env.PORT||5000;

app.listen(PORT,()=>{

    console.log(

        `Server running on ${PORT}`

    );

});
