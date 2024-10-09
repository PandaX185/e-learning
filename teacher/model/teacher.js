import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";

const TeacherSchema = new Schema(
    {
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        subject:{
            type: String,
            required: true,
        },
        hashedPassword: {
            type: String,
            required: true,
            select: false,
        },
        profilePicture: {
            type: String,
        },
        otp: {
            type: String,
        }
    },
    { timestamps: true }
);

TeacherSchema.pre("save", async function (next) {
    if (!this.isModified("hashedPassword")) return next();
        this.hashedPassword = await bcrypt.hash(this.hashedPassword, 10);
    next();
});

const Teacher = model("Teacher", TeacherSchema);

export default Teacher;
