import Joi from 'joi';

const userValidateSchema = Joi.object({
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

export default userValidateSchema;
