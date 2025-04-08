import React, { useState } from "react";
import axios from "axios";
import { Box, TextField, Button, Typography, Paper } from "@mui/material";

const BodyShapeCalculator = () => {
  const [waist, setWaist] = useState("");
  const [hip, setHip] = useState("");
  const [bodyShape, setBodyShape] = useState(null);
  const [error, setError] = useState("");

  const calculateBodyShape = async () => {
    if (!waist || !hip) {
      setError("Please fill in all fields.");
      return;
    }

    // Body Shape calculation
    const ratio = (waist / hip).toFixed(2);
    let shape = "";
    if (ratio < 0.8) shape = "Pear";
    else if (ratio >= 0.8 && ratio <= 0.85) shape = "Hourglass";
    else shape = "Apple";
    setBodyShape(shape);
    setError("");

    // Save calculation to the database
    await axios.post("http://localhost:5000/api/calculations", {
      type: "Body Shape",
      data: { waist, hip, bodyShape: shape },
    });

    // Store data in localStorage
    const bodyShapeData = { waist, hip, bodyShape: shape };
    localStorage.setItem("bodyShapeData", JSON.stringify(bodyShapeData));
  };

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 400, mx: "auto", mt: 5 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Body Shape Calculator
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField
          label="Waist (cm)"
          type="number"
          value={waist}
          onChange={(e) => setWaist(e.target.value)}
          fullWidth
        />
        <TextField
          label="Hip (cm)"
          type="number"
          value={hip}
          onChange={(e) => setHip(e.target.value)}
          fullWidth
        />
        {error && <Typography color="error">{error}</Typography>}
        <Button variant="contained" onClick={calculateBodyShape} fullWidth>
          Calculate Body Shape
        </Button>
        {bodyShape && (
          <Typography variant="h6" align="center">
            Your Body Shape is: {bodyShape}
          </Typography>
        )}
      </Box>
    </Paper>
  );
};

export default BodyShapeCalculator;
