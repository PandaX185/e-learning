import Joi from "joi";
export const signupSchema = new Joi.object({
    firstName:Joi.string().required().max(30).pattern(new RegExp(/^[a-zA-Z0-9äöüÄÖÜ]*$/)).messages({
        "string.empty": "First name is required",
        "string.max": "First name must be less than or equal to 30 characters",
        "string.pattern.base":"Text Musn't Contain Specail Chars"
    }),
    lastName: Joi.string().required().max(30).pattern(new RegExp(/^[a-zA-Z0-9äöüÄÖÜ]*$/)).messages({
        "string.empty": "Last name is required",
        "string.max": "Last name must be less than or equal to 15 characters",
        "string.pattern.base":"Text Musn't Contain Specail Chars"
    }),
    password:Joi.string().required().pattern(new RegExp(/^(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,16}$/)).messages({
        "string.pattern.base":
        "Password must contain at least 8 characters, including a lowercase letter, a number, and a special character",
        "string.empty": "Password is required",
    }),
    email: Joi.string().required().email().messages({
        "string.empty": "Email is required",
        "string.email": "Email must be a valid email address"
    }),
    grade:Joi.number().required().messages({
        "number.empty": "Grade is required",
    }),
    teacherId:Joi.string().required().pattern(/^[0-9a-fA-F]{24}$/).messages({
        "string.empty": "Teachers is required",
        "string.pattern.base": "Invalid teacher ID"
    }),

}).unknown(true);

export const signinSchame = new Joi.object({
    email: Joi.string().required().email().messages({
        "string.empty": "Email is required",
        "string.email": "Email must be a valid email address"
    }),
    password:Joi.string().required().pattern(new RegExp(/^(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,16}$/)).messages({
        "string.pattern.base":
        "Password must contain at least 8 characters, including a lowercase letter, a number, and a special character",
        "string.empty": "Password is required",
    }),
}).unknown(true);

export const updateStudentSchema = new Joi.object({
    firstName: Joi.string().max(30).pattern(new RegExp(/^[a-zA-Z0-9äöüÄÖÜ]*$/)).messages({
        "string.max": "First name must be less than or equal to 30 characters",
        "string.pattern.base":"Text Musn't Contain Specail Chars"
    }),
    lastName: Joi.string().max(30).pattern(new RegExp(/^[a-zA-Z0-9äöüÄÖÜ]*$/)).messages({
        "string.max": "Last name must be less than or equal to 15 characters",
        "string.pattern.base":"Text Musn't Contain Specail Chars"
    }),
    grade: Joi.number().messages({
        "number.empty": "Grade is required",
    }),
    id:Joi.string().required()
})
export const updatePhotoSchema = new Joi.object({
    profilePicture: Joi.string().required()
})