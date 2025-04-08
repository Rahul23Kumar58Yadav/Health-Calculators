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
} from "@mui/material";
import {
  FitnessCenter,
  Restaurant,
  LocalHospital,
  ExpandMore,
  ExpandLess,
  Calculate,
} from "@mui/icons-material";

const BMRCalculator = () => {
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("male");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [bmr, setBmr] = useState(null);
  const [bmi, setBmi] = useState(null);
  const [category, setCategory] = useState("");
  const [error, setError] = useState("");
  const [tipsExpanded, setTipsExpanded] = useState(false);

  // Calculate BMI when weight or height changes
  useEffect(() => {
    if (weight && height) {
      const bmiValue = (weight / (height / 100) ** 2).toFixed(2);
      setBmi(bmiValue);
      setCategory(getBMICategory(bmiValue));
    }
  }, [weight, height]);

  const getBMICategory = (bmi) => {
    if (bmi < 18.5) return "Underweight";
    if (bmi >= 18.5 && bmi <= 24.9) return "Normal";
    if (bmi >= 25 && bmi <= 29.9) return "Overweight";
    return "Obese";
  };

  const getHealthTips = (category, bmrValue) => {
    const baseTips = {
      Underweight: [
        `Increase calorie intake by ${(bmrValue * 0.2).toFixed(
          0
        )} calories/day for healthy weight gain`,
        "Focus on nutrient-dense foods like nuts, avocados, and whole grains",
        "Combine strength training with adequate protein intake",
        "Consult a nutritionist for personalized dietary advice",
      ],
      Normal: [
        `Maintain your current intake around ${bmrValue} calories/day`,
        "Balance macronutrients (40% carbs, 30% protein, 30% fats)",
        "Include both cardio and strength training in your routine",
        "Monitor your weight weekly to maintain your healthy range",
      ],
      Overweight: [
        `Reduce intake by ${(bmrValue * 0.15).toFixed(
          0
        )} calories/day for gradual weight loss`,
        "Prioritize lean proteins and fiber-rich foods",
        "Aim for 150+ minutes of moderate exercise weekly",
        "Practice mindful eating and track your meals",
      ],
      Obese: [
        `Consult a doctor about a ${(bmrValue * 0.25).toFixed(
          0
        )} calorie/day reduction plan`,
        "Start with low-impact exercises like swimming or cycling",
        "Focus on sustainable lifestyle changes, not quick fixes",
        "Consider working with a dietitian for meal planning",
      ],
    };
    return baseTips[category] || [];
  };

  const calculateBMR = async () => {
    if (!age || !weight || !height) {
      setError("Please fill in all fields.");
      return;
    }

    // BMR calculation formula (Mifflin-St Jeor Equation)
    const bmrValue =
      gender === "male"
        ? 10 * weight + 6.25 * height - 5 * age + 5
        : 10 * weight + 6.25 * height - 5 * age - 161;

    const roundedBmr = bmrValue.toFixed(0);
    setBmr(roundedBmr);
    setTipsExpanded(true);
    setError("");

    try {
      await axios.post("http://localhost:5000/api/calculations", {
        type: "BMR",
        data: { age, gender, weight, height, bmr: roundedBmr, bmi, category },
      });

      localStorage.setItem(
        "bmrData",
        JSON.stringify({
          age,
          gender,
          weight,
          height,
          bmr: roundedBmr,
          bmi,
          category,
        })
      );
    } catch (error) {
      console.error("Error saving BMR data:", error);
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
          BMR & BMI Calculator
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <TextField
              label="Age"
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              fullWidth
              InputProps={{ inputProps: { min: 15, max: 100 } }}
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
            <Typography color="error" align="center">
              {error}
            </Typography>
          )}

          <Button
            variant="contained"
            size="large"
            onClick={calculateBMR}
            disabled={!age || !weight || !height}
            fullWidth
            sx={{ py: 1.5 }}
          >
            Calculate BMR & BMI
          </Button>

          {(bmr || bmi) && (
            <Box sx={{ mt: 2 }}>
              <Box
                sx={{ display: "flex", justifyContent: "space-around", mb: 2 }}
              >
                <Typography variant="h6">
                  BMR: <strong>{bmr} calories/day</strong>
                </Typography>
                <Typography variant="h6">
                  BMI:{" "}
                  <strong>
                    {bmi} ({category})
                  </strong>
                </Typography>
              </Box>

              <Button
                fullWidth
                variant="outlined"
                onClick={toggleTips}
                endIcon={tipsExpanded ? <ExpandLess /> : <ExpandMore />}
                sx={{ mb: 2 }}
              >
                {tipsExpanded
                  ? "Hide Recommendations"
                  : "Show Personalized Recommendations"}
              </Button>

              <Collapse in={tipsExpanded}>
                <List sx={{ backgroundColor: "#f9f9f9", borderRadius: 1 }}>
                  {getHealthTips(category, bmr).map((tip, index) => (
                    <ListItem
                      key={index}
                      sx={{ borderBottom: "1px solid #eee" }}
                    >
                      <ListItemIcon>
                        {index % 4 === 0 ? (
                          <Restaurant color="primary" />
                        ) : index % 4 === 1 ? (
                          <FitnessCenter color="secondary" />
                        ) : index % 4 === 2 ? (
                          <LocalHospital color="success" />
                        ) : (
                          <Calculate color="action" />
                        )}
                      </ListItemIcon>
                      <ListItemText primary={tip} />
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

export default BMRCalculator;
