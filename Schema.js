import Joi from 'joi';


 export const userValidateSchema = Joi.object({
    username: Joi.string()
        .min(3)  // Minimum length for the username
        .max(30) // Maximum length for the username
        .required(),
    
    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
        .required(),
    
    password: Joi.string()
        .min(6)  // Minimum password length (you can adjust this)
        .required()
});



export const productValidateSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number().min(0).required(),
  discount: Joi.number().min(0).max(100).default(0),
  brandName: Joi.string().required(),
  quantity: Joi.number().min(0).required(),
//   category: Joi.object().items(Joi.string()).optional(),  // Assuming category IDs are strings
  Availability: Joi.string().valid('inStock', 'out of stock').default('inStock'),
  returnPolicyDays: Joi.number().min(0).default(0),
    // If media URLs are expected
  tags: Joi.array().items(Joi.string()).optional(),
  deliveryCharge: Joi.string().default('Free delivery'),  // Assuming this is a string
  colors: Joi.array().items(Joi.string()).optional(),
  // Validates that the thumbnail is a valid URL
  // You can add more custom validation for fields like tags, category, etc., if needed
});

  
  

