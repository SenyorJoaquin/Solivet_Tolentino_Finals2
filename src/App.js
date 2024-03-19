import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Import BrowserRouter
import Login from './Login';
import EmployeeList from './EmployeeList';

const App = () => {
  return (
    <Router> {/* Wrap the entire application with BrowserRouter */}
      <Routes>
        <Route exact path="/" element={<Login />} /> {/* Route to Login page */}
        <Route path="/employee" element={<EmployeeList />} /> {/* Route to Employee page */}
      </Routes>
    </Router>
  );
};

export default App;
