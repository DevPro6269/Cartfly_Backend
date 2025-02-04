import { Schema,model } from "mongoose";

const reviewSchema = new Schema({
    product:{
        type:Schema.Types.ObjectId,
        ref:"Product",
        required:true
    },
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    message:{
        type:String,
        required:true
    },
    rating:{
        type:Number,
        min:1,
        max:5,
        default:1
    }
},{timestamps:true})

const Review = model("Review",reviewSchema)
export default Review;