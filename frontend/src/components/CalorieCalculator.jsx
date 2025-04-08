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

const CalorieCalculator = () => {
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("male");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [activityLevel, setActivityLevel] = useState("sedentary");
  const [calories, setCalories] = useState(null);
  const [error, setError] = useState("");

  const calculateCalories = async () => {
    if (!age || !weight || !height) {
      setError("Please fill in all fields.");
      return;
    }

    // BMR calculation
    const bmr =
      gender === "male"
        ? 88.362 + 13.397 * weight + 4.799 * height - 5.677 * age
        : 447.593 + 9.247 * weight + 3.098 * height - 4.33 * age;

    // Activity multipliers
    const activityMultipliers = {
      sedentary: 1.2,
      lightlyActive: 1.375,
      moderatelyActive: 1.55,
      veryActive: 1.725,
      extraActive: 1.9,
    };

    const caloriesValue = bmr * activityMultipliers[activityLevel];
    const roundedCalories = caloriesValue.toFixed(2);
    setCalories(roundedCalories);
    setError("");

    // Save calculation to the database
    await axios.post("http://localhost:5000/api/calculations", {
      type: "Calorie",
      data: {
        age,
        gender,
        weight,
        height,
        activityLevel,
        calories: roundedCalories,
      },
    });

    // Store data in localStorage
    const calorieData = {
      age,
      gender,
      weight,
      height,
      activityLevel,
      calories: roundedCalories,
    };
    localStorage.setItem("calorieData", JSON.stringify(calorieData));
  };

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 400, mx: "auto", mt: 5 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Calorie Calculator
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
        <TextField
          select
          label="Activity Level"
          value={activityLevel}
          onChange={(e) => setActivityLevel(e.target.value)}
          fullWidth
        >
          <MenuItem value="sedentary">Sedentary</MenuItem>
          <MenuItem value="lightlyActive">Lightly Active</MenuItem>
          <MenuItem value="moderatelyActive">Moderately Active</MenuItem>
          <MenuItem value="veryActive">Very Active</MenuItem>
          <MenuItem value="extraActive">Extra Active</MenuItem>
        </TextField>
        {error && <Typography color="error">{error}</Typography>}
        <Button variant="contained" onClick={calculateCalories} fullWidth>
          Calculate Calories
        </Button>
        {calories && (
          <Typography variant="h6" align="center">
            Your Daily Calorie Needs: {calories} calories
          </Typography>
        )}
      </Box>
    </Paper>
  );
};

export default CalorieCalculator;
