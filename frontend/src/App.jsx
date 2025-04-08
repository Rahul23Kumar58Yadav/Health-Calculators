import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import BMICalculator from "./components/BMICalculator";
import Home from "./pages/Home";
import Help from "./pages/Help";
import Support from "./pages/Support";
import BodyFatCalculator from "./components/BodyFatCalculator";
import BMRCalculator from "./components/BMRCalculator";
import CalorieCalculator from "./components/CalorieCalculator";
import BodyShapeCalculator from "./components/BodyShapeCalculator";
import DiabetesCalculator from "./components/DiabetesCalculator";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile"; // Import the Profile component
import { AuthProvider } from "./AuthContext";
import ProtectedRoute from "./ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <div className="app-container">
        <Router>
          <Navbar />
          <main className="content">
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/help" element={<Help />} />
              <Route path="/support" element={<Support />} />

              {/* Protected Routes */}
              <Route path="/" element={<Home />} />
              <Route
                path="/bmi"
                element={<ProtectedRoute element={<BMICalculator />} />}
              />
              <Route
                path="/body-fat"
                element={<ProtectedRoute element={<BodyFatCalculator />} />}
              />
              <Route
                path="/bmr"
                element={<ProtectedRoute element={<BMRCalculator />} />}
              />
              <Route
                path="/calorie"
                element={<ProtectedRoute element={<CalorieCalculator />} />}
              />
              <Route
                path="/body-shape"
                element={<ProtectedRoute element={<BodyShapeCalculator />} />}
              />
              <Route
                path="/diabetes"
                element={<ProtectedRoute element={<DiabetesCalculator />} />}
              />
              {/* Add the Profile route */}
              <Route
                path="/profile"
                element={<ProtectedRoute element={<Profile />} />}
              />
            </Routes>
          </main>
          <Footer />
        </Router>
      </div>
    </AuthProvider>
  );
}

export default App;
