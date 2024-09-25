import express from "express";
import { signIn, signUp } from "../teacher/controller/teacher_controller.js";
import validate from "../middlewares/validation.js";
import { LoginSchame, signupSchema } from "../validation/teacher.schema.js";

const router = express.Router();

/**
 * @swagger
 * /teacher/signup:
 *  post:
 *   summary: Sign up a teacher
 *   description: Sign up a teacher
 *   requestBody:
 *    content:
 *      application/json:
 *        schema:
 *          type: object
 *          properties:
 *            firstName:
 *              type: string
 *            lastName:
 *              type: string
 *            email:
 *              type: string
 *            password:
 *              type: string
 *          required:
 *           - firstName
 *           - lastName
 *           - email
 *           - password
 *   responses:
 *      200:
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                data:
 *                  type: object
 *                  properties:
 *                    _id:
 *                      type: string
 *                    firstName:
 *                      type: string
 *                    lastName:
 *                      type: string
 *                    email:
 *                      type: string
 *                      format: email
 *                    profilePicture:
 *                      type: string
 *                      format: binary
 *                    createdAt:
 *                      type: string
 *                      format: date-time
 *                    updatedAt:
 *                      type: string
 *                      format: date-time
 *      400:
 *          description: Please provide all the required fields
 *      500:
 *          description: Internal server error
 */
router.post("/teachers/signup", validate(signupSchema), signUp);

/**
 * @swagger
 * /teacher/login:
 *  post:
 *   summary: login a teacher
 *   description: login a teacher
 *   requestBody:
 *    content:
 *      application/json:
 *        schema:
 *          type: object
 *          properties:
 *            email:
 *              type: string
 *            password:
 *              type: string
 *   responses:
 *      200:
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          token:
 *                              type: string
 *                          user:
 *                              type: object
 *                              properties:
 *                                _id:
 *                                  type: string
 *                                firstName:
 *                                  type: string
 *                                lastName:
 *                                  type: string
 *                                email:
 *                                  type: string
 *                                  format: email
 *                                profilePicture:
 *                                  type: string
 *                                  format: binary
 *                                createdAt:
 *                                  type: string
 *                                  format: date-time
 *                                updatedAt:
 *                                  type: string
 *                                  format: date-time
 *      500:
 *          description: Internal server error
 */
router.post("/teacher/login", validate(LoginSchame), signIn);

export { router };
