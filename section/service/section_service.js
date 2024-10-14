import appError from "./../../utils/appError.js";
import sectionModel from "./../model/section.js";
import lessonModel from "./../../lesson/model/lesson.js";

export const delete_section = async (id) => {
    const section = await sectionModel.findOne({ _id: id });

    if (!section) throw new appError("section is not found", 404);
    await lessonModel.updateOne(
        { sections: section._id },
        { $pull: { sections: section._id } }
    );
    await section.deleteOne();
    return "section deleted successfully";
};

export const update_section = async (id, body) => {
    const section = await sectionModel.findByIdAndUpdate(id, body, {
        new: true,
    });
    if (!section) throw new appError("section is not found", 404);
    return section;
};

export const add_section = async (body, lesson_id) => {
    //find the lesson

    const lesson = await lessonModel.findOne({ _id: lesson_id });

    if (!lesson) throw new appError("can't find this lesson", 404);
    //create a section
    const section = await sectionModel.create(body);

    //assgin the section to lesson
    lesson.sections.push(section.id);
    await lesson.save();

    return section;
};
