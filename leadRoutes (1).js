const express = require("express");
const router = express.Router();
const {
  getLeads,
  getDashboardStats,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
  updateLeadStatus,
  addLeadNote,
  exportLeadsCSV,
} = require("../controllers/leadController");
const { leadValidator } = require("../utils/validators");
const { protect } = require("../middleware/auth");

// All lead routes require authentication
router.use(protect);

// Specific/static routes must be declared BEFORE the "/:id" dynamic route
router.get("/stats/dashboard", getDashboardStats);
router.get("/export/csv", exportLeadsCSV);

router.route("/").get(getLeads).post(leadValidator, createLead);

router
  .route("/:id")
  .get(getLeadById)
  .put(leadValidator, updateLead)
  .delete(deleteLead);

router.put("/:id/status", updateLeadStatus);
router.post("/:id/notes", addLeadNote);

module.exports = router;
