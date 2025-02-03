import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // Enforces that emails are unique
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'], // Email validation regex
  },
  password: {
    type: String,
    required: true,
    minLength: [5, "Minimum password length is 5 characters"], // Changed to `minLength`
  },
  orders: [
    {
      type: Schema.Types.ObjectId,
      ref: "Order",
    },
  ],
  addresses: [
    {
      type: Schema.Types.ObjectId,
      ref: "Address",
    },
  ],
  role: {
    type: String,
    enum: ["customer", "admin"],
    default: "customer",
  },
});

// Password hashing before saving user
userSchema.pre("save", async function (next) {
  const saltRounds = 10;

  try {
    if (this.isModified("password")) {  // Ensure we only hash the password if it was modified
      const salt = await bcrypt.genSalt(saltRounds);  // Corrected to genSalt
      this.password = await bcrypt.hash(this.password, salt);  // Hash the password
    }
    next();
  } catch (error) {
    next(error);  // Pass the error to the next middleware if any
  }
});

userSchema.methods.isCorrectPassword = async function (userPass) {
  return bcrypt.compare(userPass, this.password);  // Returns a boolean
};

const User = model("User", userSchema);
export default User;
