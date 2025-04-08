import React, { useState } from "react";
import axios from "axios";
import { Box, TextField, Button, Typography, Paper } from "@mui/material";

const DiabetesCalculator = () => {
  const [glucose, setGlucose] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const calculateDiabetesRisk = async () => {
    if (!glucose) {
      setError("Please enter your glucose level.");
      return;
    }

    // Diabetes risk calculation
    const risk = glucose > 140 ? "High Risk" : "Normal";
    setResult(risk);
    setError("");

    // Save calculation to the database
    await axios.post("http://localhost:5000/api/calculations", {
      type: "Diabetes",
      data: { glucose, risk },
    });

    // Store data in localStorage
    const diabetesData = { glucose, risk };
    localStorage.setItem("diabetesData", JSON.stringify(diabetesData));
  };

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 400, mx: "auto", mt: 5 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Diabetes Risk Calculator
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField
          label="Glucose Level (mg/dL)"
          type="number"
          value={glucose}
          onChange={(e) => setGlucose(e.target.value)}
          fullWidth
        />
        {error && <Typography color="error">{error}</Typography>}
        <Button variant="contained" onClick={calculateDiabetesRisk} fullWidth>
          Calculate Risk
        </Button>
        {result && (
          <Typography variant="h6" align="center">
            Your Diabetes Risk is: {result}
          </Typography>
        )}
      </Box>
    </Paper>
  );
};

export default DiabetesCalculator;
