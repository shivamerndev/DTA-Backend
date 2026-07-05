import { Router } from "express";
import attendanceController from "../controllers/attendance.controller.js";
import { userAuth, authorize } from "../middlewares/auth.middleware.js";
import { validator } from "../middlewares/validate.middleware.js";
import { punchInSchema, verifyAttendanceSchema } from "../validations/attendance.validator.js";

const router = Router();

router.post("/punch-in", userAuth, validator(punchInSchema), attendanceController.punchIn);
router.patch("/punch-out", userAuth, attendanceController.punchOut);
router.get("/me", userAuth, attendanceController.getMe);
router.get("/team", userAuth, authorize("manager", "admin"), attendanceController.getTeam);
router.get("/all", userAuth, authorize("admin"), attendanceController.getAll);
router.patch("/:id/verify", userAuth, authorize("manager", "admin"), validator(verifyAttendanceSchema), attendanceController.verify);

export default router;
