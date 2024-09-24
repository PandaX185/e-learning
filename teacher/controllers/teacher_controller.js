import { LoginTeacher } from "../Services/teacher_service.js";
import asyncWrapper from "../../middlewares/asyncWrapper.js";

export const sginIn = asyncWrapper(async (req, res, next) => {
    const { Token, user } = await LoginTeacher(req.body, res, next);
    res.status(200).json({
        status: "success",
        data: {
            Token,
            user,
        },
    });
});
