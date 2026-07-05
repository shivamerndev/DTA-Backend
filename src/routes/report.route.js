import { Router } from "express";
import reportController from "../controllers/report.controller.js";
import { userAuth } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", userAuth, reportController.getDailyReport);

export default router;
