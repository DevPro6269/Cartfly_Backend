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
    brandName: Joi.string().required(),
    quantity:Joi.number().min(0).required(),
  });
  
  

