import Joi from "joi";
export const signupSchema = new Joi.object({
    firstName:Joi.string().required().max(30).messages({
        "string.empty": "First name is required",
        "string.max": "First name must be less than or equal to 30 characters",
    }),
    lastName: Joi.string().required().max(30).messages({
        "string.empty": "Last name is required",
        "string.max": "Last name must be less than or equal to 15 characters",
    }),
    password:Joi.string().required().pattern(new RegExp(process.env.PASS_REGX)).messages({
        "string.pattern.base":
        "Password must contain at least 8 characters, including a lowercase letter, a number, and a special character",
        "string.empty": "Password is required",
    })
}).unknown(true);