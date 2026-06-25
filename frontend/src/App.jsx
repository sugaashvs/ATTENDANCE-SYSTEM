import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    getStudents();
  }, []);

  const getStudents = async () => {
    try {
      const res = await fetch("http://localhost:3000/students");
      const data = await res.json();

      setStudents(
        data.map((student) => ({
          ...student,
          attendance: "",
        }))
      );
    } catch (error) {
      console.log(error);
    }
  };

  const saveAttendance = async (studentId, status) => {
    try {
      await fetch("http://localhost:3000/attendance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentId,
          status,
          date: new Date().toISOString().split("T")[0],
        }),
      });
    } catch (error) {
      console.log(error);
    }
  };

  const markAttendance = (id, status) => {
    setStudents((prev) =>
      prev.map((student) =>
        student._id === id
          ? { ...student, attendance: status }
          : student
      )
    );

    saveAttendance(id, status);
  };

  const resetAttendance = () => {
    if (window.confirm("Reset all attendance?")) {
      setStudents((prev) =>
        prev.map((student) => ({
          ...student,
          attendance: "",
        }))
      );
    }
  };

  const presentCount = students.filter(
    (s) => s.attendance === "P"
  ).length;

  const absentCount = students.filter(
    (s) => s.attendance === "A"
  ).length;

  return (
    <div className="container">
      <div className="header">
        <h1> ATTENDANCE MANAGEMENT SYSTEM</h1>

        <button
          className="reset-btn"
          onClick={resetAttendance}
        >
           RESET
        </button>
      </div>

      <div className="summary">
        <div className="card present-card">
          Present: {presentCount}
        </div>

        <div className="card absent-card">
          Absent: {absentCount}
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Roll No</th>
            <th>Name</th>
            <th>Actions</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {students.length === 0 ? (
            <tr>
              <td colSpan="4">
                No Students Found
              </td>
            </tr>
          ) : (
            students.map((student) => (
              <tr key={student._id}>
                <td>{student.rollNo}</td>

                <td>{student.name}</td>

                <td>
                  <button
                    className="present-btn"
                    onClick={() =>
                      markAttendance(
                        student._id,
                        "P"
                      )
                    }
                  >
                     P
                  </button>

                  <button
                    className="absent-btn"
                    onClick={() =>
                      markAttendance(
                        student._id,
                        "A"
                      )
                    }
                  >
                     A
                  </button>
                </td>

                <td>
                  {student.attendance ===
                  "P" ? (
                    <span className="status-present">
                      P
                    </span>
                  ) : student.attendance ===
                    "A" ? (
                    <span className="status-absent">
                      A
                    </span>
                  ) : (
                    "-"
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;