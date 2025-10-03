import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
    name:{type:String,required:[true,"User Name is required"],min:2,max:20},
    email:{type:String,required:[true,'User Email is required'],trim:true,unique:true,lowercase:true,min:5,max:255,match:[/\S+@\S+\.\S+/,'Please fill a valid address']},
    password:{type:String,required:[true,'User Password is required'],min:5}
    
},{timestamps:true})

const User=mongoose.model("User",userSchema)

export default User 