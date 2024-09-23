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
});

const Student = model('Student', studentSchema);

export default Student;