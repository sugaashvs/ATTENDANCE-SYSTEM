import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log(" MongoDB Connected"))
  .catch((err) => console.log(" MongoDB Error:", err.message));

/* =========================
   STUDENT SCHEMA
========================= */

const studentSchema = new mongoose.Schema({
  rollNo: {
    type: String,
    required: true,
    unique: true,
  },

  name: {
    type: String,
    required: true,
  },
});

const Student = mongoose.model("Student", studentSchema);

/* =========================
   ATTENDANCE SCHEMA
========================= */

const attendanceSchema = new mongoose.Schema({
  rollNo: {
    type: String,
    required: true,
  },

  date: {
    type: String,
    required: true,
  },

  status: {
    type: String,
    enum: ["Present", "Absent"],
    required: true,
  },
});

const Attendance = mongoose.model("Attendance", attendanceSchema);

/* =========================
   HOME ROUTE
========================= */

app.get("/", (req, res) => {
  res.json({
    message: "Attendance Management API Running",
  });
});

/* =========================
   ADD STUDENT
========================= */

app.post("/students", async (req, res) => {
  try {
    const { rollNo, name } = req.body;

    const student = await Student.create({
      rollNo,
      name,
    });

    res.status(201).json(student);
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
});

/* =========================
   GET ALL STUDENTS
========================= */

app.get("/students", async (req, res) => {
  try {
    const students = await Student.find().sort({ rollNo: 1 });

    res.json(students);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

/* =========================
   MARK ATTENDANCE
========================= */

app.post("/attendance", async (req, res) => {
  try {
    const { rollNo, status } = req.body;

    const today = new Date().toISOString().split("T")[0];

    const attendance = await Attendance.findOneAndUpdate(
      {
        rollNo,
        date: today,
      },
      {
        rollNo,
        date: today,
        status,
      },
      {
        upsert: true,
        returnDocument: "after",
      }
    );

    res.json(attendance);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

/* =========================
   GET TODAY ATTENDANCE
========================= */

app.get("/attendance", async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];

    const attendance = await Attendance.find({
      date: today,
    });

    res.json(attendance);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

/* =========================
   DELETE STUDENT
========================= */

app.delete("/students/:id", async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);

    res.json({
      message: "Student Deleted",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

/* =========================
   SERVER
========================= */

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(` Server Running on Port ${PORT}`);
});