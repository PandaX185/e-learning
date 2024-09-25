import express from "express";
import { signUp } from "../teacher/controller/teacher_controller.js";
import validate from "../middlewares/validation.js";
import { signupSchema } from "../validation/teacher.schema.js";

const router = express.Router();
router.post("/teachers/signup", validate(signupSchema), signUp);

export { router };