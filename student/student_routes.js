import express from "express";

import { signUp } from "./controller/student_controller.js";

const router = express.Router();

router.post("/students/signup", signUp);

export default router;