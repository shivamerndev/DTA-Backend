import otRequestService from "../services/otrequest.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

class OTRequestController {
  submitRequest = asyncHandler(async (req, res) => {
    const userId = req.user.id || req.user._id;
    const request = await otRequestService.submitOTRequest(userId, req.body);
    res.success(201, "Overtime request submitted successfully.", request);
  });

  approve = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { remarks } = req.body;
    const request = await otRequestService.reviewOTRequest(id, "approved", remarks);
    res.success(200, "Overtime request approved.", request);
  });

  reject = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { remarks } = req.body;
    const request = await otRequestService.reviewOTRequest(id, "rejected", remarks);
    res.success(200, "Overtime request rejected.", request);
  });

  getMe = asyncHandler(async (req, res) => {
    const userId = req.user.id || req.user._id;
    const requests = await otRequestService.getPersonalOTRequests(userId);
    res.success(200, "Personal overtime requests fetched.", requests);
  });

  getTeam = asyncHandler(async (req, res) => {
    const managerId = req.user.id || req.user._id;
    const requests = await otRequestService.getTeamOTRequests(managerId);
    res.success(200, "Team overtime requests fetched.", requests);
  });

  getAll = asyncHandler(async (req, res) => {
    const requests = await otRequestService.getAllOTRequests();
    res.success(200, "All overtime requests fetched.", requests);
  });
}

export default new OTRequestController();
