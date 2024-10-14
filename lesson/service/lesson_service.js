import lessonModel from "../../lesson/model/lesson.js";
import sectionModel from "./../../section/model/section.js";
import courseModel from "./../../course/model/course.js";
import appError from "../../utils/appError.js";

//check again
export const add_lesson = async (lesson, course_id) => {
    //check if the course is found
    const course = await courseModel.findOne({ _id: course_id });
    console.log(course);

    if (!course) throw new appError("course is not found", 404);

    //create a lesson
    const new_lesson = await lessonModel.create(lesson);
    if (!new_lesson) throw new appError("can't create a lesson", 400);

    //updating course document
    course.lessons.push(new_lesson.id);
    await course.save();

    return new_lesson;
};

export const findAllLesson = async () => {
    const lessons = await lessonModel.find().populate("sections");
    if (lessons.length == 0) throw new appError("can't find the lessons", 404);
    return lessons;
};

export const findLessonById = async (id) => {
    const lesson = await lessonModel.findById(id).populate("sections");
    if (!lesson) throw new appError("lesson is not found", 404);
    return lesson;
};

export const delete_lesson = async (id) => {
    const lesson = await lessonModel.findOne({ _id: id });
    if (!lesson) throw new appError("lesson is not found", 404);
    await courseModel.updateOne(
        { lessons: lesson._id },
        { $pull: { lessons: lesson._id } }
    );

    await sectionModel.deleteMany({ _id: { $in: lesson.sections } });

    await lesson.deleteOne();
    return "lesson deleted successfully";
};

export const update_lesson = async (id, body) => {
    const lesson = await lessonModel
        .findByIdAndUpdate(id, body, {
            new: true,
        })
        .populate("sections");
    if (!lesson) throw new appError("lesson is not found", 404);
    return lesson;
};
