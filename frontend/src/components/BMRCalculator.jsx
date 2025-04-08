import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  MenuItem,
} from "@mui/material";

const BMRCalculator = () => {
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("male");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [bmr, setBmr] = useState(null);
  const [error, setError] = useState("");

  const calculateBMR = async () => {
    if (!age || !weight || !height) {
      setError("Please fill in all fields.");
      return;
    }

    // BMR calculation formula
    const bmrValue =
      gender === "male"
        ? 88.362 + 13.397 * weight + 4.799 * height - 5.677 * age
        : 447.593 + 9.247 * weight + 3.098 * height - 4.33 * age;
    const roundedBmr = bmrValue.toFixed(2);
    setBmr(roundedBmr);
    setError("");

    // Save calculation to the database
    await axios.post("http://localhost:5000/api/calculations", {
      type: "BMR",
      data: { age, gender, weight, height, bmr: roundedBmr },
    });

    // Store data in localStorage
    const bmrData = { age, gender, weight, height, bmr: roundedBmr };
    localStorage.setItem("bmrData", JSON.stringify(bmrData));
  };

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 400, mx: "auto", mt: 5 }}>
      <Typography variant="h4" align="center" gutterBottom>
        BMR Calculator
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField
          label="Age"
          type="number"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          fullWidth
        />
        <TextField
          label="Weight (kg)"
          type="number"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          fullWidth
        />
        <TextField
          label="Height (cm)"
          type="number"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
          fullWidth
        />
        <TextField
          select
          label="Gender"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          fullWidth
        >
          <MenuItem value="male">Male</MenuItem>
          <MenuItem value="female">Female</MenuItem>
        </TextField>
        {error && <Typography color="error">{error}</Typography>}
        <Button variant="contained" onClick={calculateBMR} fullWidth>
          Calculate BMR
        </Button>
        {bmr && (
          <Typography variant="h6" align="center">
            Your BMR is: {bmr} calories/day
          </Typography>
        )}
      </Box>
    </Paper>
  );
};

export default BMRCalculator;
