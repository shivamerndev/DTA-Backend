import { Attendance } from "../models/attendance.model.js";

class MongoAttendanceRepository {
  async createAttendance(data) {
    const attendance = new Attendance(data);
    return await attendance.save();
  }

  async findAttendanceById(id) {
    return await Attendance.findById(id)
      .populate("employee", "name email role manager")
      .populate("otRequest");
  }

  async findAttendanceByEmployeeAndDate(employeeId, date) {
    return await Attendance.findOne({ employee: employeeId, date })
      .populate("otRequest");
  }

  async updateAttendance(id, updates) {
    return await Attendance.findByIdAndUpdate(id, updates, { new: true })
      .populate("employee", "name email role manager")
      .populate("otRequest");
  }

  async findAttendance(query, options = {}) {
    let q = Attendance.find(query).populate("employee", "name email role manager");
    if (options.sort) {
      q = q.sort(options.sort);
    } else {
      q = q.sort({ punchIn: -1 });
    }
    return await q;
  }
}

export default new MongoAttendanceRepository();
