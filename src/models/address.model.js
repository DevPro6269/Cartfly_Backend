import { Schema, model } from "mongoose";

const addressSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
      required: true, // Ensures each address is linked to a user
    },
    recipientName: {
      type: String,
      required: true, // Ensure recipient's name is always provided
    },
    streetAddress: {
      type: String,
      required: true, // Street address is required
    },
    city: {
      type: String,
      required: true, // City name is required
    },
    state: {
      type: String,
      required: true, // State name is required
    },
    country: {
      type: String,
      required: true, // Country is required
    },
    postalCode: {
      type: String,
      required: true, // Postal code is required
    },
    phoneNumber: {
      type: String,
      required: true, // Phone number is required
      match: [/^\d{10}$/, "Please enter a valid 10-digit phone number"], 
    },
    isPrimary: {
      type: Boolean,
      default: false, 
    },
  },
  {
    timestamps: true, 
  }
);

const Address = model("Address", addressSchema);

export default Address;
