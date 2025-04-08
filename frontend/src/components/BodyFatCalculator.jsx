import React, { useState } from "react";
import axios from "axios";
import "../global.css";

function BodyFatCalculator() {
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("male");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [bodyFat, setBodyFat] = useState(null);
  const [error, setError] = useState("");

  const calculateBodyFat = async () => {
    if (!height || !weight || !age) {
      setError("Please fill in all fields.");
      return;
    }
    const bodyFatValue =
      gender === "male"
        ? 1.2 * (weight / (height / 100) ** 2) + 0.23 * age - 16.2
        : 1.2 * (weight / (height / 100) ** 2) + 0.23 * age - 5.4;

    const roundedBodyFat = bodyFatValue.toFixed(2);
    setBodyFat(bodyFatValue.toFixed(2));
    setError("");

    // Save Calculation to database
    await axios.post("http://localhost:5000/api/calculations", {
      type: "Body Fat",
      data: { age, gender, weight, height, bodyFat: roundedBodyFat },
    });
    const bodyFatData = {
      age,
      gender,
      weight,
      height,
      bodyFat: roundedBodyFat,
    };
    localStorage.setItem("bodyFatData", JSON.stringify(bodyFatData));
  };
  return (
    <div className="calculator-card">
      <h2 className="calculator-title">Body Fat Calculator</h2>
      <div className="input-group">
        <label>Age</label>
        <input
          type="number"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          placeholder="Enter your age"
        />
      </div>
      <div className="input-group">
        <label>Weight (kg)</label>
        <input
          type="number"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          placeholder="Enter your weight"
        />
      </div>
      <div className="input-group">
        <label>Height (cm)</label>
        <input
          type="number"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
          placeholder="Enter your height"
        />
      </div>
      <div className="input-group">
        <label>Gender</label>
        <select value={gender} onChange={(e) => setGender(e.target.value)}>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
      </div>
      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
      <button className="button" onClick={calculateBodyFat}>
        Calculate Body Fat
      </button>
      {bodyFat && (
        <p className="result">Your Body Fat Percentage is: {bodyFat}%</p>
      )}
    </div>
  );
}

export default BodyFatCalculator;
