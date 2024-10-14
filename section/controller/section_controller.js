import asyncWrapper from "../../middlewares/asyncWrapper.js";
import {
    add_section,
    delete_section,
    update_section,
} from "../service/section_service.js";

export const UpdateSection = asyncWrapper(async (req, res, next) => {
    try {
        const updatedsection = await update_section(req.params.id, req.body);
        return res.status(200).json({
            data: updatedsection,
        });
    } catch (error) {
        return res.status(error.statusCode).json({ error: error.message });
    }
});

export const DeleteSection = asyncWrapper(async (req, res, next) => {
    try {
        const Msg = await delete_section(req.params.id);
        return res.status(200).json({
            data: Msg,
        });
    } catch (error) {
        return res.status(error.statusCode).json({ error: error.message });
    }
});

export const AddSection = asyncWrapper(async (req, res, next) => {
    try {
        console.log(req.params);

        const section = await add_section(req.body, req.params.lesson_id);
        return res.status(200).json({
            data: section,
        });
    } catch (error) {
        return res.status(error.statusCode).json({ error: error.message });
    }
});
