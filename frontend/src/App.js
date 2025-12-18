import React, { useState, useEffect } from "react";
import axios from "axios";
import StudentForm from "./components/StudentForm";
import StudentList from "./components/StudentList";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./App.css";

function App() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingStudent, setEditingStudent] = useState(null);

  // Fetch all students
  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/students/");
      setStudents(response.data);
    } catch (error) {
      console.error("Error fetching students:", error);
      alert("Failed to load students. Please check if backend is running.");
    } finally {
      setLoading(false);
    }
  };

  // Delete student
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?")) {
      return;
    }

    try {
      await axios.delete(`/api/students/${id}/`);
      fetchStudents(); // Refresh list
      alert("Student deleted successfully!");
    } catch (error) {
      console.error("Error deleting student:", error);
      alert("Failed to delete student.");
    }
  };

  // Edit student
  const handleEdit = (student) => {
    setEditingStudent(student);
  };

  // Handle form success
  const handleFormSuccess = () => {
    setEditingStudent(null);
    fetchStudents();
  };

  // Initial fetch
  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <div className="App">
      <div className="container py-4">
        {/* Header */}
        <header className="text-center mb-5">
          <h1 className="display-4 fw-bold text-primary">
            <i className="bi bi-mortarboard-fill me-3"></i>
            Student Management System
          </h1>
          <p className="lead text-muted">
            A full-stack application with Django backend and React frontend
          </p>
        </header>

        <div className="row g-4">
          {/* Left Column - Form */}
          <div className="col-lg-5">
            <StudentForm
              student={editingStudent}
              onStudentAdded={handleFormSuccess}
            />

            {/* Stats Card */}
            <div className="card shadow-sm border-0 mt-4">
              <div className="card-body text-center">
                <h5 className="card-title text-muted">
                  <i className="bi bi-graph-up me-2"></i>
                  Statistics
                </h5>
                <div className="display-4 fw-bold text-primary">
                  {students.length}
                </div>
                <p className="text-muted mb-0">Total Students</p>
                <div className="mt-3">
                  <span className="badge bg-primary me-2">
                    {students.filter((s) => s.gender === "Male").length} Male
                  </span>
                  <span className="badge bg-danger me-2">
                    {students.filter((s) => s.gender === "Female").length}{" "}
                    Female
                  </span>
                  <span className="badge bg-success">
                    {
                      students.filter(
                        (s) => !["Male", "Female"].includes(s.gender)
                      ).length
                    }{" "}
                    Other
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - List */}
          <div className="col-lg-7">
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3 text-muted">Loading students...</p>
              </div>
            ) : (
              <StudentList
                students={students}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-5 pt-4 border-top text-center text-muted">
          <p className="mb-1">
            <strong>Backend:</strong> Django REST Framework |
            <strong> Frontend:</strong> React |<strong> Database:</strong>{" "}
            SQLite
          </p>
          <p className="mb-0 small">
            <i className="bi bi-lightbulb me-1"></i>
            Pro Tip: Django API runs on port 8000, React runs on port 3000
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
