import React, { useState, useEffect } from "react";
import { useAuth } from "../AuthContext";
import { saveAs } from "file-saver";
import "./Profile.css";

const Profile = () => {
  const { user } = useAuth();
  const [calculatedData, setCalculatedData] = useState({
    bmiData: null,
    bodyFatData: null,
    bmrData: null,
    calorieData: null,
    bodyShapeData: null,
    diabetesData: null,
  });

  // Generate a unique key for localStorage based on user email
  const getUserStorageKey = (key) => {
    return user?.email ? `${user.email}_${key}` : key;
  };

  // Load data for the current user
  const loadData = () => {
    if (!user?.email) return;

    setCalculatedData({
      bmiData: JSON.parse(localStorage.getItem(getUserStorageKey("bmiData"))),
      bodyFatData: JSON.parse(
        localStorage.getItem(getUserStorageKey("bodyFatData"))
      ),
      bmrData: JSON.parse(localStorage.getItem(getUserStorageKey("bmrData"))),
      calorieData: JSON.parse(
        localStorage.getItem(getUserStorageKey("calorieData"))
      ),
      bodyShapeData: JSON.parse(
        localStorage.getItem(getUserStorageKey("bodyShapeData"))
      ),
      diabetesData: JSON.parse(
        localStorage.getItem(getUserStorageKey("diabetesData"))
      ),
    });
  };

  // Clear all data for the current user
  const clearAllData = () => {
    if (!user?.email) return;

    const keys = [
      "bmiData",
      "bodyFatData",
      "bmrData",
      "calorieData",
      "bodyShapeData",
      "diabetesData",
    ];
    keys.forEach((key) => {
      localStorage.removeItem(getUserStorageKey(key));
    });
    loadData(); // Refresh the UI
  };
  useEffect(() => {
    // Clear any anonymous data when user logs in
    if (user?.email) {
      const anonymousKeys = [
        "bmiData",
        "bodyFatData",
        "bmrData",
        "calorieData",
        "bodyShapeData",
        "diabetesData",
      ];
      anonymousKeys.forEach((key) => {
        const data = localStorage.getItem(key);
        if (data) {
          // Migrate anonymous data to user-specific storage
          localStorage.setItem(getUserStorageKey(key), data);
          localStorage.removeItem(key);
        }
      });
    }

    loadData();
    const handleStorageChange = () => loadData();
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [user?.email]);

  // Function to download report as PDF
  const downloadReport = () => {
    const content = document.getElementById("health-report").innerHTML;
    const style = `
      <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
        .report-header { text-align: center; margin-bottom: 30px; }
        .report-title { font-size: 24px; color: #2c3e50; margin-bottom: 5px; }
        .report-subtitle { font-size: 16px; color: #7f8c8d; margin-bottom: 20px; }
        .patient-info { margin-bottom: 30px; }
        .section { margin-bottom: 25px; }
        .section-title { font-size: 18px; color: #3498db; border-bottom: 1px solid #eee; padding-bottom: 5px; margin-bottom: 10px; }
        .data-row { display: flex; margin-bottom: 5px; }
        .data-label { font-weight: bold; width: 200px; color: #2c3e50; }
        .data-value { color: #34495e; }
        .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #95a5a6; }
      </style>
    `;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Health Report - ${user?.displayName || user?.email}</title>
          ${style}
        </head>
        <body>
          <div id="print-content">
            ${content}
          </div>
        </body>
      </html>
    `;

    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    saveAs(blob, `Health_Report_${user?.displayName || "User"}.html`);
  };

  // Destructure calculatedData for cleaner JSX
  const {
    bmiData,
    bodyFatData,
    bmrData,
    calorieData,
    bodyShapeData,
    diabetesData,
  } = calculatedData;

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div id="health-report">
          {/* Report Header */}
          <div className="report-header">
            <h1 className="report-title">Health Calculator</h1>
            <h2 className="report-subtitle">Final Report</h2>
          </div>

          {/* Patient Identity */}
          <div className="patient-info">
            <h3>Patient Information</h3>
            <div className="data-row">
              <span className="data-label">Name:</span>
              <span className="data-value">
                {user?.displayName || "Not specified"}
              </span>
            </div>
            <div className="data-row">
              <span className="data-label">Email:</span>
              <span className="data-value">{user?.email}</span>
            </div>
            <div className="data-row">
              <span className="data-label">Report Date:</span>
              <span className="data-value">
                {new Date().toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Health Data Sections */}
          <div className="health-data">
            {bmiData && (
              <div className="section">
                <h3 className="section-title">Body Mass Index (BMI)</h3>
                <div className="data-row">
                  <span className="data-label">Height:</span>
                  <span className="data-value">{bmiData.height} cm</span>
                </div>
                <div className="data-row">
                  <span className="data-label">Weight:</span>
                  <span className="data-value">{bmiData.weight} kg</span>
                </div>
                <div className="data-row">
                  <span className="data-label">BMI:</span>
                  <span className="data-value">{bmiData.bmi}</span>
                </div>
                <div className="data-row">
                  <span className="data-label">Category:</span>
                  <span
                    className={`data-value ${bmiData.category.toLowerCase()}`}
                  >
                    {bmiData.category}
                  </span>
                </div>
              </div>
            )}

            {bodyFatData && (
              <div className="section">
                <h3 className="section-title">Body Fat Analysis</h3>
                <div className="data-row">
                  <span className="data-label">Body Fat Percentage:</span>
                  <span className="data-value">{bodyFatData.bodyFat}%</span>
                </div>
                <div className="data-row">
                  <span className="data-label">Category:</span>
                  <span className="data-value">
                    {bodyFatData.category || "Not specified"}
                  </span>
                </div>
              </div>
            )}

            {bmrData && (
              <div className="section">
                <h3 className="section-title">Basal Metabolic Rate (BMR)</h3>
                <div className="data-row">
                  <span className="data-label">BMR:</span>
                  <span className="data-value">{bmrData.bmr} calories/day</span>
                </div>
              </div>
            )}

            {calorieData && (
              <div className="section">
                <h3 className="section-title">Daily Calorie Needs</h3>
                <div className="data-row">
                  <span className="data-label">Maintenance Calories:</span>
                  <span className="data-value">
                    {calorieData.calories} calories/day
                  </span>
                </div>
              </div>
            )}

            {bodyShapeData && (
              <div className="section">
                <h3 className="section-title">Body Shape Analysis</h3>
                <div className="data-row">
                  <span className="data-label">Body Shape:</span>
                  <span className="data-value">{bodyShapeData.bodyShape}</span>
                </div>
              </div>
            )}

            {diabetesData && (
              <div className="section">
                <h3 className="section-title">Diabetes Risk Assessment</h3>
                <div className="data-row">
                  <span className="data-label">Risk Level:</span>
                  <span className="data-value">{diabetesData.risk}</span>
                </div>
              </div>
            )}

            {!bmiData &&
              !bodyFatData &&
              !bmrData &&
              !calorieData &&
              !bodyShapeData &&
              !diabetesData && (
                <div className="section">
                  <h3 className="section-title">No Data Available</h3>
                  <p>Please use our calculators to generate health data.</p>
                </div>
              )}
          </div>

          <div className="footer">
            <p>
              Generated by Health Multi-Calculator •{" "}
              {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>

        <button className="download-btn" onClick={downloadReport}>
          Download Health Report
        </button>
        <button onClick={clearAllData} className="clear-btn">
          Clear All Data
        </button>
      </div>
    </div>
  );
};

export default Profile;
