import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const StudentForm = ({ onStudentAdded, studentToEdit }) => {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "Male",
    email: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const nameInputRef = useRef(null);

  // Focus first input on mount
  useEffect(() => {
    if (nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, []);

  // If editing existing student
  useEffect(() => {
    if (studentToEdit) {
      setFormData({
        name: studentToEdit.name || "",
        age: studentToEdit.age || "",
        gender: studentToEdit.gender || "Male",
        email: studentToEdit.email || "",
      });
      setIsEditing(true);
    } else {
      setIsEditing(false);
    }
  }, [studentToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Special handling for age - convert to number
    const processedValue =
      name === "age" && value !== "" ? parseInt(value) || "" : value;

    setFormData((prev) => ({
      ...prev,
      [name]: processedValue,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    } else if (formData.name.length > 100) {
      newErrors.name = "Name must be less than 100 characters";
    }

    // Age validation
    if (!formData.age && formData.age !== 0) {
      newErrors.age = "Age is required";
    } else if (formData.age < 1 || formData.age > 120) {
      newErrors.age = "Age must be between 1 and 120";
    } else if (!Number.isInteger(Number(formData.age))) {
      newErrors.age = "Age must be a whole number";
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email (e.g., student@school.edu)";
    } else if (formData.email.length > 254) {
      newErrors.email = "Email is too long";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      let response;

      if (isEditing && studentToEdit) {
        // Update existing student
        response = await axios.put(
          `/api/students/${studentToEdit.id}/`,
          formData
        );
        alert("✅ Student updated successfully!");
      } else {
        // Create new student
        response = await axios.post("/api/students/", formData);
        alert("✅ Student added successfully!");
      }

      // Reset form
      if (!isEditing) {
        setFormData({
          name: "",
          age: "",
          gender: "Male",
          email: "",
        });
      }
      setErrors({});

      // Callback to refresh list
      if (onStudentAdded) {
        onStudentAdded(response.data);
      }
    } catch (error) {
      console.error("Error saving student:", error);

      if (error.response?.data) {
        // Django validation errors
        setErrors(error.response.data);
      } else if (error.code === "ERR_NETWORK") {
        alert(
          "⚠️ Cannot connect to server. Make sure Django backend is running on port 8000!"
        );
      } else if (error.response?.status === 400) {
        alert("Bad request. Check your input data.");
      } else if (error.response?.status === 404) {
        alert("Student not found. It may have been deleted.");
      } else {
        alert(
          `❌ Failed to ${
            isEditing ? "update" : "add"
          } student. Please try again.`
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      name: "",
      age: "",
      gender: "Male",
      email: "",
    });
    setErrors({});
    setIsEditing(false);
  };

  return (
    <div className="card shadow-sm border-0">
      <div
        className={`card-header ${
          isEditing ? "bg-warning text-dark" : "bg-primary text-white"
        }`}
      >
        <h4 className="mb-0">
          <i
            className={`bi ${isEditing ? "bi-pencil" : "bi-person-plus"} me-2`}
          ></i>
          {isEditing ? "Edit Student" : "Add New Student"}
        </h4>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              <i className="bi bi-person me-1"></i>
              Full Name <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              ref={nameInputRef}
              className={`form-control ${errors.name ? "is-invalid" : ""}`}
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter student's full name"
              disabled={loading}
              maxLength={100}
            />
            {errors.name && (
              <div className="invalid-feedback d-flex align-items-center">
                <i className="bi bi-exclamation-circle me-1"></i>
                {errors.name}
              </div>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="age" className="form-label">
              <i className="bi bi-calendar me-1"></i>
              Age <span className="text-danger">*</span>
            </label>
            <input
              type="number"
              id="age"
              name="age"
              className={`form-control ${errors.age ? "is-invalid" : ""}`}
              value={formData.age}
              onChange={handleChange}
              placeholder="Enter age"
              min="1"
              max="120"
              step="1"
              disabled={loading}
            />
            {errors.age && (
              <div className="invalid-feedback d-flex align-items-center">
                <i className="bi bi-exclamation-circle me-1"></i>
                {errors.age}
              </div>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="gender" className="form-label">
              <i className="bi bi-gender-ambiguous me-1"></i>
              Gender
            </label>
            <select
              id="gender"
              name="gender"
              className="form-select"
              value={formData.gender}
              onChange={handleChange}
              disabled={loading}
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </select>
          </div>

          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              <i className="bi bi-envelope me-1"></i>
              Email <span className="text-danger">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className={`form-control ${errors.email ? "is-invalid" : ""}`}
              value={formData.email}
              onChange={handleChange}
              placeholder="student@example.com"
              disabled={loading}
              maxLength={254}
            />
            {errors.email && (
              <div className="invalid-feedback d-flex align-items-center">
                <i className="bi bi-exclamation-circle me-1"></i>
                {errors.email}
              </div>
            )}
          </div>

          <div className="d-grid gap-2">
            <button
              type="submit"
              className="btn btn-primary py-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  {isEditing ? "Updating..." : "Adding..."}
                </>
              ) : (
                <>
                  <i
                    className={`bi ${
                      isEditing ? "bi-check-circle" : "bi-plus-circle"
                    } me-2`}
                  ></i>
                  {isEditing ? "Update Student" : "Add Student"}
                </>
              )}
            </button>

            {isEditing && (
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={handleReset}
                disabled={loading}
              >
                <i className="bi bi-x-circle me-2"></i>
                Cancel Edit
              </button>
            )}
          </div>
        </form>

        <div className="mt-3 text-muted small">
          <i className="bi bi-info-circle me-1"></i>
          Fields marked with <span className="text-danger">*</span> are required
        </div>
      </div>
    </div>
  );
};

export default StudentForm;
