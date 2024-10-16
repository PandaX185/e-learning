import courseModel from "./../model/course.js";
import sectionModel from "./../../section/model/section.js";
import lessonModel from "./../../lesson/model/lesson.js";

import appError from "../../utils/appError.js";
const add_Course = async (Course) => {
    const new_course = await courseModel.create(Course);
    if (!new_course) throw new appError("please try again", 400);
    return new_course;
};

const findAllCourse = async () => {
    const courses = await courseModel.find();
    if (!courses) throw new appError("not course found", 404);
    return courses;
};

const FindCourseById = async (id) => {
    const course = await courseModel.findById(id).populate([
        { path: "lessons", select: "-__v" },
        { path: "teacher", select: "-__v" },
    ]);
    if (!course) throw new appError("not course found", 404);
    return course;
};

const update_Course = async (id, body) => {
    const course = await courseModel
        .findByIdAndUpdate(id, body, { new: true })
        .populate([
            { path: "lessons", select: "-__v" },
            { path: "teacher", select: "-__v" },
        ]);
    if (!course) throw new appError(" course not found", 404);
    return course;
};

const delete_course = async (id) => {
    const course = await courseModel.findById(id);
    if (!course) throw new appError(" course not found", 404);

    for (const lesson_id of course.lessons) {
        const lessons = await lessonModel.findByIdAndDelete(lesson_id);
        await sectionModel.deleteMany({ _id: { $in: lessons.sections } });
    }
    await course.deleteOne();
    return "course deleted successfully";
};
export {
    add_Course,
    findAllCourse,
    FindCourseById,
    update_Course,
    delete_course,
};
