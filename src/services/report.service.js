import MongoAttendanceRepository from "../repository/mongo.attendance.js";
import MongoUserRepository from "../repository/mongo.user.js";

class ReportService {
  async getDailyReport(user, date) {
    const query = { date };

    if (user.role === "employee") {
      query.employee = user._id;
    } else if (user.role === "manager") {
      const users = await MongoUserRepository.findAllUsers();
      const teamUserIds = users
        .filter((u) => u.manager && u.manager._id.toString() === user._id.toString())
        .map((u) => u._id);
      query.employee = { $in: teamUserIds };
    }

    const logs = await MongoAttendanceRepository.findAttendance(query);

    return logs.map((log) => ({
      attendanceId: log._id,
      employeeName: log.employee.name,
      employeeEmail: log.employee.email,
      date: log.date,
      punchIn: log.punchIn,
      punchOut: log.punchOut || null,
      selfieUrl: log.selfieUrl,
      location: log.location,
      workingHours: log.workingHours,
      status: log.status,
      remarks: log.remarks,
      overtimeStatus: log.overtimeStatus,
      overtimeHours: log.overtimeHours,
    }));
  }
}

export default new ReportService();
