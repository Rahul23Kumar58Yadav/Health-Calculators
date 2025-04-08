import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  MenuItem,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  Alert
} from "@mui/material";
import {
  FitnessCenter,
  Restaurant,
  LocalHospital,
  ExpandMore,
  ExpandLess,
  Calculate,
  Male,
  Female
} from "@mui/icons-material";

const BodyFatCalculator = () => {
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("male");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [bodyFat, setBodyFat] = useState(null);
  const [bmi, setBmi] = useState(null);
  const [fatCategory, setFatCategory] = useState("");
  const [error, setError] = useState("");
  const [tipsExpanded, setTipsExpanded] = useState(false);

  // Calculate BMI when weight or height changes
  useEffect(() => {
    if (weight && height) {
      const bmiValue = (weight / (height / 100) ** 2).toFixed(2);
      setBmi(bmiValue);
    }
  }, [weight, height]);

  const getFatCategory = (bodyFatValue, gender) => {
    if (gender === "male") {
      if (bodyFatValue < 6) return "Essential fat";
      if (bodyFatValue <= 13) return "Athletic";
      if (bodyFatValue <= 17) return "Fitness";
      if (bodyFatValue <= 24) return "Average";
      return "Obese";
    } else {
      if (bodyFatValue < 14) return "Essential fat";
      if (bodyFatValue <= 20) return "Athletic";
      if (bodyFatValue <= 24) return "Fitness";
      if (bodyFatValue <= 31) return "Average";
      return "Obese";
    }
  };

  const getHealthTips = (fatCategory, gender) => {
    const tips = {
      "Essential fat": [
        "Consult a healthcare provider - your body fat may be too low",
        "Increase healthy fats (avocados, nuts, olive oil)",
        "Focus on strength training to build muscle mass",
        "Monitor your health markers regularly"
      ],
      "Athletic": [
        "Maintain your current fitness routine",
        "Ensure adequate protein intake (1.6-2.2g per kg of body weight)",
        "Include recovery days in your workout schedule",
        "Monitor body composition monthly"
      ],
      "Fitness": [
        "Combine cardio and strength training 3-5 times weekly",
        "Reduce processed foods and added sugars",
        "Aim for 7-9 hours of quality sleep nightly",
        "Consider body recomposition (lose fat while gaining muscle)"
      ],
      "Average": [
        "Start with 150 minutes of moderate exercise weekly",
        "Reduce calorie intake by 200-300 calories for fat loss",
        "Increase vegetable intake to 5+ servings daily",
        "Limit alcohol and sugary beverages"
      ],
      "Obese": [
        "Consult a doctor before starting any exercise program",
        "Begin with low-impact activities (walking, swimming)",
        "Focus on sustainable dietary changes, not extreme diets",
        "Set small, achievable goals (5% body weight loss first)"
      ]
    };
    return tips[fatCategory] || [];
  };

  const calculateBodyFat = async () => {
    if (!height || !weight || !age) {
      setError("Please fill in all fields.");
      return;
    }

    // Body fat calculation (Navy Method approximation)
    const bodyFatValue =
      gender === "male"
        ? 1.2 * (weight / (height / 100) ** 2) + 0.23 * age - 16.2
        : 1.2 * (weight / (height / 100) ** 2) + 0.23 * age - 5.4;

    const roundedBodyFat = Math.max(0, bodyFatValue).toFixed(1); // Ensure not negative
    setBodyFat(roundedBodyFat);
    setFatCategory(getFatCategory(roundedBodyFat, gender));
    setTipsExpanded(true);
    setError("");

    try {
      await axios.post("http://localhost:5000/api/calculations", {
        type: "Body Fat",
        data: { age, gender, weight, height, bodyFat: roundedBodyFat, bmi, category: fatCategory },
      });

      localStorage.setItem("bodyFatData", JSON.stringify({
        age,
        gender,
        weight,
        height,
        bodyFat: roundedBodyFat,
        bmi,
        category: fatCategory
      }));
    } catch (error) {
      console.error("Error saving body fat data:", error);
    }
  };

  const toggleTips = () => {
    setTipsExpanded(!tipsExpanded);
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
      <Paper elevation={3} sx={{ p: 4, maxWidth: 600, width: "100%" }}>
        <Typography variant="h4" align="center" gutterBottom sx={{ mb: 3 }}>
          <Calculate sx={{ verticalAlign: "middle", mr: 1 }} />
          Body Fat Calculator
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <TextField
              label="Age"
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              fullWidth
              InputProps={{ inputProps: { min: 18, max: 100 } }}
            />
            <TextField
              select
              label="Gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              fullWidth
            >
              <MenuItem value="male">
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Male /> Male
                </Box>
              </MenuItem>
              <MenuItem value="female">
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Female /> Female
                </Box>
              </MenuItem>
            </TextField>
          </Box>

          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <TextField
              label="Weight (kg)"
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              fullWidth
              InputProps={{ inputProps: { min: 30, max: 300 } }}
            />
            <TextField
              label="Height (cm)"
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              fullWidth
              InputProps={{ inputProps: { min: 100, max: 250 } }}
            />
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Button
            variant="contained"
            size="large"
            onClick={calculateBodyFat}
            disabled={!age || !weight || !height}
            fullWidth
            sx={{ py: 1.5 }}
          >
            Calculate Body Fat
          </Button>

          {(bodyFat || bmi) && (
            <Box sx={{ mt: 2 }}>
              <Box sx={{ 
                display: "flex", 
                justifyContent: "space-around", 
                flexWrap: "wrap",
                gap: 2,
                mb: 2 
              }}>
                <Typography variant="h6">
                  Body Fat: <strong>{bodyFat}%</strong>
                </Typography>
                <Typography variant="h6">
                  Category: <strong>{fatCategory}</strong>
                </Typography>
                <Typography variant="h6">
                  BMI: <strong>{bmi}</strong>
                </Typography>
              </Box>

              <Button
                fullWidth
                variant="outlined"
                onClick={toggleTips}
                endIcon={tipsExpanded ? <ExpandLess /> : <ExpandMore />}
                sx={{ mb: 2 }}
              >
                {tipsExpanded ? "Hide Recommendations" : "Show Personalized Recommendations"}
              </Button>

              <Collapse in={tipsExpanded}>
                <List sx={{ 
                  backgroundColor: "#f9f9f9", 
                  borderRadius: 1,
                  border: "1px solid #eee"
                }}>
                  {getHealthTips(fatCategory, gender).map((tip, index) => (
                    <ListItem 
                      key={index} 
                      sx={{ 
                        borderBottom: index < 3 ? "1px solid #eee" : "none",
                        py: 2
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        {index % 4 === 0 ? <Restaurant color="primary" /> :
                         index % 4 === 1 ? <FitnessCenter color="secondary" /> :
                         index % 4 === 2 ? <LocalHospital color="success" /> :
                         <Calculate color="action" />}
                      </ListItemIcon>
                      <ListItemText 
                        primary={tip} 
                        primaryTypographyProps={{ variant: "body1" }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            </Box>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default BodyFatCalculator;