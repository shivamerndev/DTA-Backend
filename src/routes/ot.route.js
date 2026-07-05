import { Router } from "express";
import otRequestController from "../controllers/otrequest.controller.js";
import { userAuth, authorize } from "../middlewares/auth.middleware.js";
import { validator } from "../middlewares/validate.middleware.js";
import { createOTRequestSchema, reviewOTRequestSchema } from "../validations/otrequest.validator.js";

const router = Router();

router.post("/request", userAuth, validator(createOTRequestSchema), otRequestController.submitRequest);
router.patch("/:id/approve", userAuth, authorize("manager", "admin"), validator(reviewOTRequestSchema), otRequestController.approve);
router.patch("/:id/reject", userAuth, authorize("manager", "admin"), validator(reviewOTRequestSchema), otRequestController.reject);
router.get("/me", userAuth, otRequestController.getMe);
router.get("/team", userAuth, authorize("manager", "admin"), otRequestController.getTeam);
router.get("/all", userAuth, authorize("admin"), otRequestController.getAll);

export default router;
