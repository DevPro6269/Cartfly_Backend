import { Schema, model } from "mongoose";

const orderSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    items: [
      {
        products: {
          type: Schema.Types.ObjectId,
          ref: "Product",
        },
        quantity: {
          type: Number,
          default: 1,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          min: 0,
          required: true,
        },
    }
    ],
    status: {
      type: String,
      enum: ["pending", "shipped", "deliverd", "cancelled"],
      default:"pending"
    },
    totalPayment: {
      type: Number,
      required: true,
      min: 0,
    },
    shippingAddress: {
      type: Schema.Types.ObjectId,
      ref: "Address",
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Completed", "Failed", "Refunded"],
      default: "Pending",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Order = model("Order",orderSchema)
export default Order;