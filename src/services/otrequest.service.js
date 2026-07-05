import MongoOTRequestRepository from "../repository/mongo.otrequest.js";
import MongoAttendanceRepository from "../repository/mongo.attendance.js";
import MongoUserRepository from "../repository/mongo.user.js";
import { AppError } from "../utils/error.utils.js";

class OTRequestService {
  async submitOTRequest(userId, { attendanceId, requestedHours, reason }) {
    const attendance = await MongoAttendanceRepository.findAttendanceById(attendanceId);
    if (!attendance) {
      throw new AppError(404, "Attendance record not found.");
    }

    if (attendance.employee._id.toString() !== userId.toString()) {
      throw new AppError(403, "You can only request overtime for your own attendance logs.");
    }

    if (attendance.overtimeStatus === "requested") {
      throw new AppError(400, "Overtime request already pending for this day.");
    }

    if (attendance.overtimeStatus === "approved") {
      throw new AppError(400, "Overtime has already been approved for this day.");
    }

    // Create OTRequest
    const request = await MongoOTRequestRepository.createOTRequest({
      employee: userId,
      attendance: attendanceId,
      requestedHours,
      reason,
      status: "pending",
    });

    // Link in Attendance
    await MongoAttendanceRepository.updateAttendance(attendanceId, {
      overtimeStatus: "requested",
      otRequest: request._id,
    });

    return request;
  }

  async reviewOTRequest(requestId, status, remarks = "") {
    if (!["approved", "rejected"].includes(status)) {
      throw new AppError(400, "Invalid status. Must be approved or rejected.");
    }

    const otRequest = await MongoOTRequestRepository.findOTRequestById(requestId);
    if (!otRequest) {
      throw new AppError(404, "Overtime request not found.");
    }

    if (otRequest.status !== "pending") {
      throw new AppError(400, `Overtime request has already been ${otRequest.status}.`);
    }

    // Update OTRequest
    const updatedRequest = await MongoOTRequestRepository.updateOTRequest(requestId, {
      status,
      remarks,
    });

    // Update Attendance
    const attendanceUpdates = {
      overtimeStatus: status,
    };
    if (status === "approved") {
      attendanceUpdates.overtimeHours = otRequest.requestedHours;
    } else {
      attendanceUpdates.overtimeHours = 0;
    }

    await MongoAttendanceRepository.updateAttendance(otRequest.attendance._id, attendanceUpdates);

    return updatedRequest;
  }

  async getPersonalOTRequests(userId) {
    return await MongoOTRequestRepository.findOTRequests({ employee: userId });
  }

  async getTeamOTRequests(managerId) {
    const users = await MongoUserRepository.findAllUsers();
    const teamUserIds = users
      .filter((u) => u.manager && u.manager._id.toString() === managerId.toString())
      .map((u) => u._id);

    return await MongoOTRequestRepository.findOTRequests({ employee: { $in: teamUserIds } });
  }

  async getAllOTRequests() {
    return await MongoOTRequestRepository.findOTRequests({});
  }
}

export default new OTRequestService();
