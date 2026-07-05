import reportService from "../services/report.service.js";
import attendanceService from "../services/attendance.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

class ReportController {
  getDailyReport = asyncHandler(async (req, res) => {
    const date = req.query.date || attendanceService.getLocalDateString();
    const reportData = await reportService.getDailyReport(req.user, date);
    res.success(200, "Daily attendance report generated.", reportData);
  });
}

export default new ReportController();
