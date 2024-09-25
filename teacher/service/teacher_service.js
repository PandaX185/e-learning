import Teacher from "../model/teacher.js";
import generateToken from "../../utils/generateToken.js";
import appError from "./../../utils/appError.js";
import bcrypt from "bcrypt";

export async function createTeacher(teacher) {
    const existingTeacher = await Teacher.findOne({ email: teacher.email });
    if (existingTeacher) {
        throw new appError("Teacher already exists", 400);
    }

    teacher.hashedPassword = teacher.password;
    const newTeacher = await Teacher.create(teacher);
    return newTeacher;
}

export async function LoginTeacher(body, res, next) {
    const { email, password } = body;
    const user = await Teacher.findOne({ email }).select("+hashedPassword");
    if (!user) {
        throw new appError("invaild email or password", 403);
    }

    if (!(await bcrypt.compare(password, user.hashedPassword))) {
        throw new appError("invaild email or password", 401);
    }

    delete user._doc.hashedPassword;
    const Token = await generateToken(user.id);
    return {
        Token,
        user,
    };
}
