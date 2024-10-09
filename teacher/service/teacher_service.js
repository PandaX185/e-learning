import Teacher from "../model/teacher.js";
import generateToken from "../../utils/generateToken.js";
import appError from "./../../utils/appError.js";
import bcrypt from "bcrypt";
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

export async function createTeacher(teacher) {
    const existingTeacher = await Teacher.findOne({ email: teacher.email });
    if (existingTeacher) {
        throw new appError("Teacher already exists", 409);
    }

    teacher.hashedPassword = teacher.password;
    const newTeacher = await Teacher.create(teacher);
    return newTeacher;
}

export async function LoginTeacher(body, res, next) {
    const { email, password } = body;
    const user = await Teacher.findOne({ email }).select("+hashedPassword");
    if (!user) {
        throw new appError("Invaild email or password", 403);
    }    
    if (!(await bcrypt.compare(password, user.hashedPassword))) {
        throw new appError("Invaild email or password", 401);
    }

    delete user._doc.hashedPassword;
    const accessToken = await generateToken(user.id);
    return {
        accessToken,
        user,
    };
}

export async function forgotTeacherPassword(email) {
    const teacher = await Teacher.findOne({ email });
    if (!teacher) {
        throw new appError('Teacher not registered', 404);
    }

    try {
        const otp = crypto.randomInt(100000, 999999).toString();        
        console.log(otp);
        teacher.otp = await bcrypt.hash(otp, 10);
        await teacher.save();
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: true,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        const mailOptions = {
            from: '"E Learning" <no-reply-elms@zohomail.com>',
            to: email,
            subject: 'Password Reset OTP',
            text: `Your OTP is ${otp}. It will expire in 3 minutes`,
            html: `Your OTP is ${otp}. It will expire in 3 minutes`
        };

        await transporter.sendMail(mailOptions);
        return 'OTP sent to your email. It is valid for 3 minutes';
    } catch (error) {
        console.log(error);
        throw new appError('Error sending email', 500);
        
    }
}

export async function resetTeacherPassword(body) {
    const { email, otp, password } = body;

    const teacher = await Teacher.findOne({ email });
    if (!teacher) {
        throw new appError('Teacher not registered', 404);
    }

    if (!await bcrypt.compare(otp, teacher.otp)) {
        throw new appError('Invalid OTP', 400);
    }

    const otpExpirationTime = 3 * 60 * 1000;
    const currentTime = Date.now();
    if (currentTime - teacher.updatedAt > otpExpirationTime) {
        throw new appError('OTP has expired', 400);
    }

    teacher.hashedPassword = password;
    teacher.otp = undefined;
    await teacher.save();

    return 'Password reset successfully';
}