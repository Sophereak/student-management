import React from "react";

const StudentList = ({ students, onEdit, onDelete }) => {
  const getGenderIcon = (gender) => {
    switch (gender) {
      case "Male":
        return "bi-gender-male text-primary";
      case "Female":
        return "bi-gender-female text-danger";
      default:
        return "bi-gender-ambiguous text-success";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (students.length === 0) {
    return (
      <div className="text-center py-5">
        <i className="bi bi-people display-1 text-muted"></i>
        <h4 className="mt-3 text-muted">No Students Found</h4>
        <p className="text-muted">Add your first student using the form</p>
      </div>
    );
  }

  return (
    <div className="card shadow-sm border-0">
      <div className="card-header bg-success text-white">
        <h4 className="mb-0">
          <i className="bi bi-people me-2"></i>
          Students List ({students.length})
        </h4>
      </div>
      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Age</th>
                <th>Gender</th>
                <th>Email</th>
                <th>Joined</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id}>
                  <td>
                    <span className="badge bg-secondary">#{student.id}</span>
                  </td>
                  <td>
                    <strong>{student.name}</strong>
                  </td>
                  <td>
                    <span className="badge bg-info rounded-pill">
                      {student.age}
                    </span>
                  </td>
                  <td>
                    <i
                      className={`bi ${getGenderIcon(student.gender)} me-1`}
                    ></i>
                    {student.gender}
                  </td>
                  <td>
                    <a
                      href={`mailto:${student.email}`}
                      className="text-decoration-none"
                    >
                      {student.email}
                    </a>
                  </td>
                  <td>
                    <small className="text-muted">
                      {formatDate(student.created_at)}
                    </small>
                  </td>
                  <td className="text-end">
                    <div className="btn-group btn-group-sm" role="group">
                      <button
                        className="btn btn-outline-primary"
                        onClick={() => onEdit(student)}
                        title="Edit"
                      >
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button
                        className="btn btn-outline-danger"
                        onClick={() => onDelete(student.id)}
                        title="Delete"
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentList;
