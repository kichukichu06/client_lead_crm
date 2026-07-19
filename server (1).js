require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const leadRoutes = require("./routes/leadRoutes");
const { notFound, errorHandler } = require("./middleware/errorHandler");

// Connect to MongoDB
connectDB();

const app = express();

// Allow requests from the configured frontend origin(s)
const allowedOrigins = (process.env.CLIENT_ORIGIN || "http://localhost:5173").split(",");
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// Health check
app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "API is running" });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/leads", leadRoutes);

// Error handling (must be last)
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`);
});
