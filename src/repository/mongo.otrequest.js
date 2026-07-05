import { OTRequest } from "../models/otrequest.model.js";

class MongoOTRequestRepository {
  async createOTRequest(data) {
    const otRequest = new OTRequest(data);
    return await otRequest.save();
  }

  async findOTRequestById(id) {
    return await OTRequest.findById(id)
      .populate("employee", "name email role manager")
      .populate("attendance");
  }

  async updateOTRequest(id, updates) {
    return await OTRequest.findByIdAndUpdate(id, updates, { new: true })
      .populate("employee", "name email role manager")
      .populate("attendance");
  }

  async findOTRequests(query) {
    return await OTRequest.find(query)
      .populate("employee", "name email role manager")
      .populate("attendance")
      .sort({ createdAt: -1 });
  }
}

export default new MongoOTRequestRepository();
