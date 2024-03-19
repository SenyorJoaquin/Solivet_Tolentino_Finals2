//===============================================================================================================================================================================================
//                                                                              Username and Passwords for Login
//                                                                                      Username: user1
//                                                                                      Password: 1234
//===============================================================================================================================================================================================
import React, { useState, useEffect } from "react";
import { firestore } from "./firebase";
import "./EmployeeList.css";
import logo from './logo.png';
//===============================================================================================================================================================================================


//=================================================================================CONSTANT DECLARATIONS==========================================================================================
const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [editEmployee, setEditEmployee] = useState(null);
  const [deleteEmployee, setDeleteEmployee] = useState(null);
  const [sortBy, setSortBy] = useState(null);
  const [isSortByOpen, setIsSortByOpen] = useState(false);
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false);


  // Fetches the Employee data from firestore and allows it to be editable
  useEffect(() => {
    const fetchEmployees = async () => {
      const snapshot = await firestore.collection("EmployeeData").get();
      const employeeList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEmployees(employeeList);
    };

    fetchEmployees();
  }, []);

  const handleEdit = (employee) => {
    setEditEmployee({ ...employee });
  };

  const handleCloseModal = () => {
    setEditEmployee(null);
  };

  // Handles the Saved Changes after Editing
  const handleSaveChanges = async (updatedEmployee) => {
    // Excludes the employee_id field from being updated
    const { employee_id, ...employeeData } = updatedEmployee;
    await firestore.collection("EmployeeData").doc(updatedEmployee.id).update(employeeData);
    const updatedEmployees = employees.map(emp => {
      if (emp.id === updatedEmployee.id) {
        return { ...updatedEmployee, employee_id: emp.employee_id }; // Preserves the original employee_id
      }
      return emp;
    });
    setEmployees(updatedEmployees);
    setEditEmployee(null);
  };
  
  // Handles the Delete Function for the Employee
  const handleDelete = (employee) => {
    setDeleteEmployee(employee);
  };

  // Closes the Delete Window
  const handleCloseDeleteConfirmation = () => {
    setDeleteEmployee(null);
  };


  // Handles the Deletion Confirmation and process
  const handleConfirmDelete = async () => {
    await firestore.collection("EmployeeData").doc(deleteEmployee.id).delete();
    const updatedEmployees = employees.filter(emp => emp.id !== deleteEmployee.id);
    setEmployees(updatedEmployees);
    setDeleteEmployee(null);
  };


  // Handles the sorting function
  const handleSortByChange = (event) => {
    const selectedOption = event.target.value;
    setSortBy(selectedOption);
    const sortedEmployees = sortEmployees(selectedOption);
    setEmployees(sortedEmployees);
  };

  // Toggles the Ui element of the sorting function
  const toggleSortBy = () => {
    setIsSortByOpen(!isSortByOpen);
  };

  // Toggles the Ui element of the Add Employee Function
  const toggleAddEmployee = () => {
    setIsAddEmployeeOpen(!isAddEmployeeOpen);
  };

  // Handles Add New Employee function
  const handleAddEmployee = async (newEmployeeData) => {
    // Ensures no field is left blank
    if (!newEmployeeData.name || !newEmployeeData.age || !newEmployeeData.department ||
        !newEmployeeData.email || !newEmployeeData.gender || !newEmployeeData.position ||
        !newEmployeeData.salary) {
      alert("Please fill in all fields.");
      return;
    }
  
    // Gets the highest value of employee_id
    const maxEmployeeId = Math.max(...employees.map(emp => emp.employee_id));
    const newEmployeeId = maxEmployeeId + 1;
  
    // Sets the document ID to the value of the "Name" field
    const documentName = newEmployeeData.name.toLowerCase().replace(/\s/g, "_");
    const docRef = firestore.collection("EmployeeData").doc(documentName);
  
    // Adds the new employee to Firebase with the specifically set document ID
    await docRef.set({
      employee_id: newEmployeeId,
      ...newEmployeeData
    });
  
    // Updates the state to reflect the changes
    setEmployees([...employees, { id: documentName, employee_id: newEmployeeId, ...newEmployeeData }]);
    setIsAddEmployeeOpen(false);
  };

  // Handles the sorting options of the sort by function
  const sortEmployees = (option) => {
    const sortedEmployees = [...employees];
    switch (option) {
      case "employee_id":
        sortedEmployees.sort((a, b) => a.employee_id - b.employee_id);
        break;
      case "name":
        sortedEmployees.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "age":
        sortedEmployees.sort((a, b) => a.age - b.age);
        break;
      case "department":
        sortedEmployees.sort((a, b) => a.department.localeCompare(b.department));
        break;
      case "gender":
        sortedEmployees.sort((a, b) => a.gender.localeCompare(b.gender));
        break;
      case "position":
        sortedEmployees.sort((a, b) => a.position.localeCompare(b.position));
        break;
      case "salary":
        sortedEmployees.sort((a, b) => a.salary - b.salary);
        break;
      default:
        break;
    }
    return sortedEmployees;
  };

//===============================================================================================================================================================================================


//===============================================================================================================================================================================================
  return (
    <div className="page-container">
      <div className="sidebar">
        <div className="sidebar-header">
          <h1>Crews Control</h1>
          <img src={logo} alt="logo" className="logo" />
        </div>
        <p className="sidebar-message">Welcome to Crews Control</p>
        <div className="control-panel">
          <h2>Control Panel</h2>
          <div className="add-employee" onClick={toggleAddEmployee}>
            <span className="add-employee-background">Add Employee</span>
            <span className="plus-sign">+</span>
          </div>
          {}
          <div className="sort-by-container">
            <div className="sort-by" onClick={toggleSortBy}>
              <span className="sort-by-background">Sort By</span>
              <span className="plus-sign">+</span>
            </div>
            {isSortByOpen && (
              <div className="sort-dropdown">
                <select value={sortBy} onChange={handleSortByChange}>
                  <option value="">Select Option</option>
                  <option value="employee_id">ID</option>
                  <option value="name">Name</option>
                  <option value="age">Age</option>
                  <option value="department">Department</option>
                  <option value="gender">Gender</option>
                  <option value="position">Position</option>
                  <option value="salary">Salary</option>
                </select>
              </div>
            )}
          </div>
        </div>
      </div>
      {}
      {isAddEmployeeOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={toggleAddEmployee}>&times;</span>
            <h2>Add New Employee</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              const newEmployeeData = {};
              formData.forEach((value, key) => {
                newEmployeeData[key] = value;
              });
              handleAddEmployee(newEmployeeData);
            }}>
              <div className="form-group">
                <label>Name:</label>
                <input className="form-control" type="text" name="name" />
              </div>
              <div className="form-group">
                <label>Age:</label>
                <input className="form-control" type="number" name="age" />
              </div>
              <div className="form-group">
                <label>Department:</label>
                <input className="form-control" type="text" name="department" />
              </div>
              <div className="form-group">
                <label>Email:</label>
                <input className="form-control" type="text" name="email" />
              </div>
              <div className="form-group">
                <label>Gender:</label>
                <input className="form-control" type="text" name="gender" />
              </div>
              <div className="form-group">
                <label>Position:</label>
                <input className="form-control" type="text" name="position" />
              </div>
              <div className="form-group">
                <label>Salary:</label>
                <input className="form-control" type="text" name="salary" />
              </div>
              <button type="submit" className="save-button">Add Employee</button>
            </form>
          </div>
        </div>
      )}
      <div className="content">
        <h2>Employee List for CIIT Philippines</h2>
        <table className="employee-table">
          <thead>
            <tr>
              <th>Employee ID</th>
              <th>Name</th>
              <th>Age</th>
              <th>Department</th>
              <th>Email</th>
              <th>Gender</th>
              <th>Position</th>
              <th>Salary</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee.id}>
                <td>{employee.employee_id}</td>
                <td>{employee.name}</td>
                <td>{employee.age}</td>
                <td>{employee.department}</td>
                <td>{employee.email}</td>
                <td>{employee.gender}</td>
                <td>{employee.position}</td>
                <td>{employee.salary}</td>
                <td>
                  <button onClick={() => handleEdit(employee)} className="edit-button">Edit</button>
                  <button onClick={() => handleDelete(employee)} className="delete-button">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {}
      {editEmployee && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleCloseModal}>&times;</span>
            <h2>Edit Employee</h2>
            {}
            <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const updatedEmployee = { id: editEmployee.id }; // Ensures the id is included
                formData.forEach((value, key) => {
                    updatedEmployee[key] = value;
                });
                handleSaveChanges(updatedEmployee);
                }}>
              <div className="form-group">
                <label>Name:</label>
                <input className="form-control" type="text" defaultValue={editEmployee.name} name="name" />
              </div>
              <div className="form-group">
                <label>Age:</label>
                <input className="form-control" type="number" defaultValue={editEmployee.age} name="age" />
              </div>
              <div className="form-group">
                <label>Department:</label>
                <input className="form-control" type="text" defaultValue={editEmployee.department} name="department" />
              </div>
              <div className="form-group">
                <label>Email:</label>
                <input className="form-control" type="text" defaultValue={editEmployee.email} name="email" />
              </div>
              <div className="form-group">
                <label>Gender:</label>
                <input className="form-control" type="text" defaultValue={editEmployee.gender} name="gender" />
              </div>
              <div className="form-group">
                <label>Position:</label>
                <input className="form-control" type="text" defaultValue={editEmployee.position} name="position" />
              </div>
              <div className="form-group">
                <label>Salary:</label>
                <input className="form-control" type="text" defaultValue={editEmployee.salary} name="salary" />
              </div>
              <button type="submit" className="save-button">Save Changes</button>
            </form>
          </div>
        </div>
      )}
      {}
      {deleteEmployee && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleCloseDeleteConfirmation}>&times;</span>
            <h2>Confirm Deletion</h2>
            <p>Are you sure you want to delete {deleteEmployee.name}?</p>
            <button className="confirm-delete" onClick={handleConfirmDelete}>Confirm</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeList;
//===============================================================================================================================================================================================
