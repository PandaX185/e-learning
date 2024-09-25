import { Schema, model } from 'mongoose';

const studentSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    hashedPassword: {
        type: String,
        required: true
    },
    grade: {
        type: Number,
        required: true
    },
    teachers: {
        type: [Schema.Types.ObjectId],
        ref: 'Teacher'
    },
    profilePicture: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
},{timestamps: true});

const Student = model('Student', studentSchema);

export default Student;