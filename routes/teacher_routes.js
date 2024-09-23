import { Router } from "express";
import { sginIn, sginUp } from "../teacher/controllers/teacherController.js";
import validate from "../middlewares/validation.js";
import { signupSchema, signinSchame } from "../validation/teacherSchema.js";

const TeacherRouter = Router();

TeacherRouter.post("/sginup", validate(signupSchema), sginUp);
TeacherRouter.post("/sginin", validate(signinSchame), sginIn);
export default TeacherRouter;
