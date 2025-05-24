// import logo from './logo.svg';
import './App.css';
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Prediction from './pages/Prediction';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Prediction />} />
      </Routes>
    </Router>
  );
}

export default App;
