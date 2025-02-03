import { Schema, model } from 'mongoose';

const productSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: [0, 'Price must be a positive number'],
  },
  discount: {
    type: Number,
    min: [0, 'Discount cannot be less than 0'],
    max: [100, 'Discount cannot exceed 100'],
    default:0
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Review',
    },
  ],
  category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
    }
  ,
  Availability: {
    type: String,
    enum: ['inStock', 'out of stock'],
    default: 'inStock',
  },
  returnPolicyDays: {
    type: Number,
    default: 0,
  },
  media: [
    {
      type: String,
    },
  ],
  tags: [
    {
      type: String,
    },
  ],
  brandName: {
    type: String,
    required: true,
  },
  deliveryCharge: {
    type: Schema.Types.Mixed,
    default: 'Free delivery',
  },
  colors: [
    {
      type: String,
    },
  ],
  thumbnail: {
    type: String,
    required: true,
    match: [/^https?:\/\/[^\s]+$/, 'Please enter a valid URL'],
  },
  quantity:{
    type:Number,
    min:0,
    required:true
  }
},{timestamps:true});

const Product = model('Product', productSchema);

export default Product;
