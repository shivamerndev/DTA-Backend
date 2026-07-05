import attendanceService from "../services/attendance.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

class AttendanceController {
  punchIn = asyncHandler(async (req, res) => {
    const userId = req.user.id || req.user._id;
    const record = await attendanceService.punchIn(userId, req.body);
    res.success(201, "Punched in successfully.", record);
  });

  punchOut = asyncHandler(async (req, res) => {
    const userId = req.user.id || req.user._id;
    const record = await attendanceService.punchOut(userId);
    res.success(200, "Punched out successfully.", record);
  });

  getMe = asyncHandler(async (req, res) => {
    const userId = req.user.id || req.user._id;
    const logs = await attendanceService.getPersonalLogs(userId, req.query);
    res.success(200, "Personal attendance logs fetched.", logs);
  });

  getTeam = asyncHandler(async (req, res) => {
    const managerId = req.user.id || req.user._id;
    const logs = await attendanceService.getTeamLogs(managerId, req.query);
    res.success(200, "Team attendance logs fetched.", logs);
  });

  getAll = asyncHandler(async (req, res) => {
    const logs = await attendanceService.getAllLogs(req.query);
    res.success(200, "All attendance logs fetched.", logs);
  });

  verify = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const record = await attendanceService.verifyAttendance(id, req.body);
    res.success(200, "Attendance log verified successfully.", record);
  });
}

export default new AttendanceController();
