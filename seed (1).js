/**
 * Seed script — populates the database with a sample admin account and sample leads.
 * Run with: npm run seed
 */
require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const Admin = require("../models/Admin");
const Lead = require("../models/Lead");

const seedData = async () => {
  await connectDB();

  try {
    // Clear existing data
    await Admin.deleteMany();
    await Lead.deleteMany();

    // Create default admin (password hashed automatically via pre-save hook)
    await Admin.create({
      name: "Admin User",
      email: "admin@crm.com",
      password: "admin123",
    });

    // Sample leads
    const sources = [
      "Website",
      "Referral",
      "Social Media",
      "Cold Call",
      "Email Campaign",
      "Advertisement",
      "Other",
    ];
    const statuses = ["New", "Contacted", "Converted"];

    const sampleLeads = [
      {
        name: "Priya Sharma",
        email: "priya.sharma@example.com",
        phone: "+91 98765 43210",
        company: "Sharma Textiles",
        source: "Website",
        status: "New",
        notes: [{ text: "Filled out contact form asking for a pricing quote." }],
        followUpDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      },
      {
        name: "Arjun Mehta",
        email: "arjun.mehta@example.com",
        phone: "+91 91234 56789",
        company: "Mehta Logistics",
        source: "Referral",
        status: "Contacted",
        notes: [
          { text: "Referred by an existing customer." },
          { text: "Had an intro call, sending proposal next week." },
        ],
        followUpDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      },
      {
        name: "Sara Khan",
        email: "sara.khan@example.com",
        phone: "+91 99887 76655",
        company: "Khan Consulting",
        source: "Social Media",
        status: "Converted",
        notes: [{ text: "Signed the annual contract." }],
        followUpDate: null,
      },
      {
        name: "David Lee",
        email: "david.lee@example.com",
        phone: "+1 415-555-0192",
        company: "Lee Innovations",
        source: "Cold Call",
        status: "New",
        notes: [],
        followUpDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      },
      {
        name: "Fatima Noor",
        email: "fatima.noor@example.com",
        phone: "+92 300 1234567",
        company: "Noor Retail Group",
        source: "Email Campaign",
        status: "Contacted",
        notes: [{ text: "Opened pricing email, replied with questions." }],
        followUpDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      },
      {
        name: "Michael Chen",
        email: "michael.chen@example.com",
        phone: "+1 212-555-0148",
        company: "Chen & Partners",
        source: "Advertisement",
        status: "New",
        notes: [],
        followUpDate: null,
      },
      {
        name: "Ananya Rao",
        email: "ananya.rao@example.com",
        phone: "+91 90000 11223",
        company: "Rao Digital",
        source: "Website",
        status: "Converted",
        notes: [{ text: "Closed deal after product demo." }],
        followUpDate: null,
      },
      {
        name: "Omar Farooq",
        email: "omar.farooq@example.com",
        phone: "+971 50 123 4567",
        company: "Farooq Trading LLC",
        source: "Other",
        status: "New",
        notes: [],
        followUpDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    ];

    await Lead.insertMany(sampleLeads);

    console.log("Seed data inserted successfully:");
    console.log("  Admin login -> email: admin@crm.com | password: admin123");
    console.log(`  Leads created: ${sampleLeads.length}`);
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error.message);
    process.exit(1);
  }
};

seedData();
