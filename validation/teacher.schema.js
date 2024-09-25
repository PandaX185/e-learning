import Joi from "joi";
export const signupSchema = new Joi.object({
    firstName: Joi.string()
        .required()
        .max(30)
        .pattern(new RegExp(/^[a-zA-Z0-9äöüÄÖÜ]*$/))
        .messages({
            "string.empty": "First name is required",
            "string.max":
                "First name must be less than or equal to 30 characters",
            "string.pattern.base": "Text Musn't Contain Specail Chars",
        }),
    lastName: Joi.string()
        .required()
        .max(30)
        .pattern(new RegExp(/^[a-zA-Z0-9äöüÄÖÜ]*$/))
        .messages({
            "string.empty": "Last name is required",
            "string.max":
                "Last name must be less than or equal to 15 characters",
            "string.pattern.base": "Text Musn't Contain Specail Chars",
        }),
    password: Joi.string()
        .required()
        .pattern(
            new RegExp(
                /^(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,16}$/
            )
        )
        .messages({
            "string.pattern.base":
                "Password must contain at least 8 characters, including a lowercase letter, a number, and a special character",
            "string.empty": "Password is required",
        }),
    email: Joi.string().required().email().messages({
        "string.empty": "Email is required",
        "string.email": "Email must be a valid email address",
    }),
}).unknown(true);

export const LoginSchame = new Joi.object({
    email: Joi.string().required().email().messages({
        "string.empty": "Email is required",
        "string.email": "Email must be a valid email address",
    }),
    password: Joi.string()
        .required()
        .pattern(
            new RegExp(
                /^(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,16}$/
            )
        )
        .messages({
            "string.pattern.base":
                "Password must contain at least 8 characters, including a lowercase letter, a number, and a special character",
            "string.empty": "Password is required",
        }),
}).unknown(true);
