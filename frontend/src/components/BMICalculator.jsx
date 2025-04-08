import React, { useState } from "react";
import axios from "axios";
import { Box, Typography, TextField, Button, Paper } from "@mui/material";

const BMICalculator = () => {
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [bmi, setBmi] = useState(null);
  const [category, setCategory] = useState("");

  const getBMICategory = (bmi) => {
    if (bmi < 18.5) return "Underweight";
    if (bmi >= 18.5 && bmi <= 24.9) return "Normal";
    if (bmi >= 25 && bmi <= 29.9) return "Overweight";
    return "Obese";
  };

  const calculateBMI = async () => {
    const bmiValue = (weight / (height / 100) ** 2).toFixed(2);
    const bmiCategory = getBMICategory(bmiValue);

    setBmi(bmiValue);
    setCategory(bmiCategory);

    await axios.post("http://localhost:5000/api/calculations", {
      type: "BMI",
      data: { weight, height, bmi: bmiValue, category: bmiCategory },
    });

    const bmiData = { height, weight, bmi: bmiValue, category: bmiCategory };
    localStorage.setItem("bmiData", JSON.stringify(bmiData));
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "80vh",
        p: 3,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          width: "100%",
          maxWidth: "500px",
          borderRadius: "12px",
          backgroundColor: "background.paper",
        }}
      >
        <Typography
          variant="h4"
          component="h2"
          gutterBottom
          align="center"
          sx={{ fontWeight: 600 }}
        >
          BMI Calculator
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <TextField
            fullWidth
            type="number"
            label="Weight (kg)"
            variant="outlined"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            InputProps={{ inputProps: { min: 0 } }}
          />

          <TextField
            fullWidth
            type="number"
            label="Height (cm)"
            variant="outlined"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            InputProps={{ inputProps: { min: 0 } }}
          />

          <Button
            variant="contained"
            size="large"
            onClick={calculateBMI}
            disabled={!weight || !height}
            sx={{ py: 1.5, fontWeight: 600 }}
          >
            Calculate BMI
          </Button>
        </Box>

        {bmi && (
          <Box
            sx={{
              mt: 4,
              p: 3,
              borderRadius: "8px",
              backgroundColor: "#f5f5f5",
              textAlign: "center",
            }}
          >
            <Typography variant="h6" gutterBottom>
              Your BMI is: <strong>{bmi}</strong>
            </Typography>
            <Typography variant="body1">
              Category: <strong>{category}</strong>
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default BMICalculator;
