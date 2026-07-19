const asyncHandler = require("express-async-handler");
const { validationResult } = require("express-validator");
const Lead = require("../models/Lead");

/**
 * @desc    Get all leads with search, filter, sort & pagination
 * @route   GET /api/leads
 * @access  Private
 * Query params:
 *   search   - matches name, email or company (case-insensitive)
 *   source   - filter by lead source
 *   status   - filter by lead status
 *   sort     - "newest" (default) or "oldest"
 *   page     - page number (default 1)
 *   limit    - page size (default 10)
 */
const getLeads = asyncHandler(async (req, res) => {
  const { search, source, status, sort = "newest", page = 1, limit = 10 } = req.query;

  const query = {};

  if (search) {
    const regex = new RegExp(search, "i");
    query.$or = [{ name: regex }, { email: regex }, { company: regex }];
  }

  if (source) query.source = source;
  if (status) query.status = status;

  const sortOption = sort === "oldest" ? { createdAt: 1 } : { createdAt: -1 };

  const pageNum = Math.max(parseInt(page, 10) || 1, 1);
  const limitNum = Math.max(parseInt(limit, 10) || 10, 1);
  const skip = (pageNum - 1) * limitNum;

  const [leads, total] = await Promise.all([
    Lead.find(query).sort(sortOption).skip(skip).limit(limitNum),
    Lead.countDocuments(query),
  ]);

  res.json({
    success: true,
    data: leads,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum) || 1,
    },
  });
});

/**
 * @desc    Get dashboard statistics
 * @route   GET /api/leads/stats/dashboard
 * @access  Private
 */
const getDashboardStats = asyncHandler(async (req, res) => {
  const [total, newLeads, contacted, converted, recentLeads] = await Promise.all([
    Lead.countDocuments(),
    Lead.countDocuments({ status: "New" }),
    Lead.countDocuments({ status: "Contacted" }),
    Lead.countDocuments({ status: "Converted" }),
    Lead.find().sort({ createdAt: -1 }).limit(5),
  ]);

  // Leads grouped by source, useful for a simple chart
  const bySource = await Lead.aggregate([
    { $group: { _id: "$source", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);

  res.json({
    success: true,
    data: {
      total,
      new: newLeads,
      contacted,
      converted,
      recentLeads,
      bySource,
    },
  });
});

/**
 * @desc    Get single lead by id
 * @route   GET /api/leads/:id
 * @access  Private
 */
const getLeadById = asyncHandler(async (req, res) => {
  const lead = await Lead.findById(req.params.id);
  if (!lead) {
    res.status(404);
    throw new Error("Lead not found");
  }
  res.json({ success: true, data: lead });
});

/**
 * @desc    Create a new lead
 * @route   POST /api/leads
 * @access  Private
 */
const createLead = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error(errors.array()[0].msg);
  }

  const { name, email, phone, company, source, status, followUpDate, note } = req.body;

  const existing = await Lead.findOne({ email: email.toLowerCase() });
  if (existing) {
    res.status(400);
    throw new Error("A lead with that email already exists");
  }

  const lead = await Lead.create({
    name,
    email,
    phone,
    company,
    source,
    status,
    followUpDate: followUpDate || null,
    notes: note ? [{ text: note }] : [],
  });

  res.status(201).json({ success: true, data: lead });
});

/**
 * @desc    Update an existing lead
 * @route   PUT /api/leads/:id
 * @access  Private
 */
const updateLead = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error(errors.array()[0].msg);
  }

  const lead = await Lead.findById(req.params.id);
  if (!lead) {
    res.status(404);
    throw new Error("Lead not found");
  }

  const { name, email, phone, company, source, status, followUpDate } = req.body;

  // If email is being changed, make sure it doesn't collide with another lead
  if (email && email.toLowerCase() !== lead.email) {
    const existing = await Lead.findOne({ email: email.toLowerCase() });
    if (existing) {
      res.status(400);
      throw new Error("A lead with that email already exists");
    }
  }

  lead.name = name ?? lead.name;
  lead.email = email ?? lead.email;
  lead.phone = phone ?? lead.phone;
  lead.company = company ?? lead.company;
  lead.source = source ?? lead.source;
  lead.status = status ?? lead.status;
  lead.followUpDate = followUpDate ?? lead.followUpDate;

  const updated = await lead.save();
  res.json({ success: true, data: updated });
});

/**
 * @desc    Delete a lead
 * @route   DELETE /api/leads/:id
 * @access  Private
 */
const deleteLead = asyncHandler(async (req, res) => {
  const lead = await Lead.findById(req.params.id);
  if (!lead) {
    res.status(404);
    throw new Error("Lead not found");
  }
  await lead.deleteOne();
  res.json({ success: true, data: { _id: req.params.id } });
});

/**
 * @desc    Update only the status of a lead (used for quick dropdown updates)
 * @route   PUT /api/leads/:id/status
 * @access  Private
 */
const updateLeadStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  if (!["New", "Contacted", "Converted"].includes(status)) {
    res.status(400);
    throw new Error("Invalid status value");
  }

  const lead = await Lead.findById(req.params.id);
  if (!lead) {
    res.status(404);
    throw new Error("Lead not found");
  }

  lead.status = status;
  lead.notes.push({ text: `Status changed to "${status}"` });
  const updated = await lead.save();

  res.json({ success: true, data: updated });
});

/**
 * @desc    Add a note / timeline entry to a lead
 * @route   POST /api/leads/:id/notes
 * @access  Private
 */
const addLeadNote = asyncHandler(async (req, res) => {
  const { text } = req.body;

  if (!text || !text.trim()) {
    res.status(400);
    throw new Error("Note text is required");
  }

  const lead = await Lead.findById(req.params.id);
  if (!lead) {
    res.status(404);
    throw new Error("Lead not found");
  }

  lead.notes.push({ text: text.trim() });
  const updated = await lead.save();

  res.status(201).json({ success: true, data: updated });
});

/**
 * @desc    Export all leads (matching current filters) as CSV
 * @route   GET /api/leads/export/csv
 * @access  Private
 */
const exportLeadsCSV = asyncHandler(async (req, res) => {
  const { search, source, status } = req.query;
  const query = {};

  if (search) {
    const regex = new RegExp(search, "i");
    query.$or = [{ name: regex }, { email: regex }, { company: regex }];
  }
  if (source) query.source = source;
  if (status) query.status = status;

  const leads = await Lead.find(query).sort({ createdAt: -1 });

  const header = [
    "Name",
    "Email",
    "Phone",
    "Company",
    "Source",
    "Status",
    "Follow-up Date",
    "Created At",
  ];

  const escapeCSV = (value) => `"${String(value ?? "").replace(/"/g, '""')}"`;

  const rows = leads.map((lead) =>
    [
      lead.name,
      lead.email,
      lead.phone,
      lead.company,
      lead.source,
      lead.status,
      lead.followUpDate ? lead.followUpDate.toISOString().split("T")[0] : "",
      lead.createdAt.toISOString().split("T")[0],
    ]
      .map(escapeCSV)
      .join(",")
  );

  const csv = [header.map(escapeCSV).join(","), ...rows].join("\n");

  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", "attachment; filename=leads-export.csv");
  res.send(csv);
});

module.exports = {
  getLeads,
  getDashboardStats,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
  updateLeadStatus,
  addLeadNote,
  exportLeadsCSV,
};
