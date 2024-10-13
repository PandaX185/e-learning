import Student from "../model/student.js";
import bcrypt from 'bcrypt';
import appError from "../../utils/appError.js";
import generateToken from "../../utils/generateToken.js";
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { log } from "console";
dotenv.config();

export async function createStudent(student) {
    const hashedPassword = await bcrypt.hash(student.password, 10);
    student.hashedPassword = hashedPassword;
    const existingStudent = await Student.findOne({ email: student.email, teacherId: student.teacherId });
    if (existingStudent) {
        throw new appError('Student already exists', 409);
    }
    const newStudent = await Student.create(student);
    return newStudent;
}

export async function loginStudent(body) {
    const student = await Student.findOne({
        email: body.email,
        teacherId: body.teacherId
    }).select('+hashedPassword');

    if (!student || !body.password || !body.email) {
        throw new appError('Invalid Email Or Password', 401);
    }
    const isMatch = await bcrypt.compare(body.password, student.hashedPassword);
    if (!isMatch) {
        throw new appError('Invalid Email Or Password', 401);
    }
    let accessToken = await generateToken({
        id: student._id,
        email: student.email,
        role: 'Student',
        teacherId: student.teacherId
    })

    return {
        student,
        accessToken
    };
}

export async function updateStudent(body, id) {
    const updatedStudent = await Student.findByIdAndUpdate(id, { $set: { ...body } }, { new: true, runValidators: true });
    if (!updatedStudent) {
        throw new appError('Student not found', 404);
    }
    return updatedStudent;
}

export async function updateStudentPhoto(file, id) {    
    const updatedStudent = await Student.findByIdAndUpdate(id, { profilePicture: file.path }, { new: true, runValidators: true });
    if (!updatedStudent) {
        throw new appError('Student not found', 404);
    }
    return updatedStudent;
}

export async function forgotStudentPassword(email, teacherId) {
    const existingStudent = await Student.findOne({ email, teacherId });
    if (!existingStudent) {
        throw new appError('Student not registered', 404);
    }

    try {
        const otp = crypto.randomInt(100000, 999999).toString();
        console.log(otp);
        
        existingStudent.otp = await bcrypt.hash(otp, 10);
        await existingStudent.save();

        const transporter = nodemailer.createTransport({
            service:'gmail',
            secure: true,
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GAMIL_PASS,
            },
        });

        const mailOptions = {
            from: '"E Learning" <no-reply-elms@zohomail.com>',
            to: email,
            subject: 'Password Reset OTP',
            text: `Your OTP is ${otp}. It will expire in 3 minutes`,
            html: `Your OTP is ${otp}. It will expire in 3 minutes`
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                throw new appError('Failed to send OTP email', 500);
            } else {
                console.log('Email sent:', info.response);
            }
        });
        return 'OTP sent to your email. It is valid for 3 minutes';
    } catch (error) {
        throw new appError('Error sending email', 500);
    }
}

export async function resetStudentPassword(body) {
    const { email, teacherId, otp, password } = body;

    const student = await Student.findOne({ email, teacherId });
    if (!student) {
        throw new appError('Student not registered', 404);
    }

    if (!await bcrypt.compare(otp, student.otp)) {
        throw new appError('Invalid OTP', 400);
    }

    const otpExpirationTime = 3 * 60 * 1000;
    const currentTime = Date.now();
    if (currentTime - student.updatedAt > otpExpirationTime) {
        throw new appError('OTP has expired', 400);
    }

    student.hashedPassword = await bcrypt.hash(password, 10);
    student.otp = undefined;
    await student.save();

    return 'Password reset successfully';
}