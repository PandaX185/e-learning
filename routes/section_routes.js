import { Router } from "express";
import {
    UpdateSection,
    DeleteSection,
    AddSection,
} from "./../section/controller/section_controller.js";
const router = Router({ mergeParams: true });

router.post("/add-section", AddSection);
router.patch("/update-section/:id", UpdateSection);
router.delete("/delete-section/:id", DeleteSection);
export { router };
