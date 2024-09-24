import generateToken from "../../utils/generateToken.js";
import Teacher from "../models/Teacher.js";
import appError from "./../../utils/appError.js";
import bcrypt from "bcrypt";

export async function LoginTeacher(body, res, next) {
    const { email, password } = body;
    const user = await Teacher.findOne({ email }).select("+hashedPassword");
    if (!user) {
        throw new appError("invaild email or password", 403);
    }

    if (!(await bcrypt.compare(password, user.hashedPassword))) {
        throw new appError("invaild email or password", 401);
    }
    const Token = await generateToken(user.id);
    return {
        Token,
        user,
    };
}
