
import { Schema,model } from "mongoose";

const cartSchema = new Schema({
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    items:[
        {   product:{
            type:Schema.Types.ObjectId,
            ref:"Product",
            required:true
        },
        quantity:{
            type:Number,
            required:true,
            min:1
        },
        price:{
            type:Number,
            required:true,
            min:0
        }
        }
    ],
    totalAmount:{
        type:Number,
        required:true,
        min:0
    }
},{timestamps:true})

cartSchema.pre("save",function(next){
   this.totalAmount= this.items.reduce((acc,curr)=>(curr.quantity*curr.price)+acc,0)
   next()
})

const Cart = model("Cart",cartSchema)
export default Cart;