import generateToken from "../../utils/generateToken.js";
import Teacher from "../models/TeacherModel.js";
import appError from "./../../utils/appError.js";
import bcrypt from "bcrypt";

export async function LoginTeacher(body, res, next) {
    const { email, password } = body;
    const user = await Teacher.findOne({ email }).select("+hashedPassword");
    if (!user) {
        //return next(new appError("invaild email or password", 401));
        return res
            .status(401)
            .json({ status: "fail", message: "invaild email or password" });
    }

    if (!(await bcrypt.compare(password, user.hashedPassword))) {
        //return next(new appError("invaild email or password", 401));
        return res
            .status(401)
            .json({ status: "fail", message: "invaild email or password" });
    }
    const Token = await generateToken(user.id);
    return {
        Token,
        user,
    };
}
