
import { Schema, model } from "mongoose";

const cartSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price:{
            type:Number,
            required:true
        }
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { timestamps: true }
);

// cartSchema.pre("save", async function (next) {
//   // Populate product details to get price
//   try {
//     // We use `populate` to load product data before calculating the totalAmount
//     const populatedCart = await Cart.find({owner:this.owner})
//     console.log(populatedCart);
    
//     // Recalculate the total amount based on populated product prices
//     this.totalAmount = populatedCart.items.reduce(
//       (acc, curr) => acc + curr.quantity * curr.product.price,
//       0
//     );

//     next();
//   } catch (error) {
//     next(error);
//   }
// });

const Cart = model("Cart", cartSchema);
export default Cart;
