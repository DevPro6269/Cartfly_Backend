import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import generateAccessToken from "../utilis/generateAccessToken.js";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 
    },
    password: {
      type: String,
      required: true,
      minlength: 6, 
    },
  },
  { timestamps: true }
);

userSchema.pre("save",async function(next){

 try {
    const salt_rounds = 10;
     const salt = await bcrypt.genSalt(salt_rounds);
     this.password = await bcrypt.hash(this.password,salt);
     next()
 } catch (error) {
    console.log("internal  error" , error);
    next(error)
 }
})  

userSchema.methods.isCorrect =  async function(candidatePassword){
  
  return await bcrypt.compare(candidatePassword,this.password)
}



const User = mongoose.model("User", userSchema);
export default User;

