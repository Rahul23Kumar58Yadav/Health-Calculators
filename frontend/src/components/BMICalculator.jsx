import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
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
} from "@mui/icons-material";

const BMICalculator = () => {
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [bmi, setBmi] = useState(null);
  const [category, setCategory] = useState("");
  const [tipsExpanded, setTipsExpanded] = useState(false);

  const getBMICategory = (bmi) => {
    if (bmi < 18.5) return "Underweight";
    if (bmi >= 18.5 && bmi <= 24.9) return "Normal";
    if (bmi >= 25 && bmi <= 29.9) return "Overweight";
    return "Obese";
  };

  const getHealthTips = (category) => {
    const tips = {
      Underweight: [
        "Increase calorie intake with nutrient-dense foods like nuts, avocados, and whole grains",
        "Incorporate strength training to build muscle mass",
        "Eat smaller, more frequent meals throughout the day",
        "Consult a nutritionist for personalized dietary advice",
      ],
      Normal: [
        "Maintain your current healthy habits with balanced nutrition",
        "Continue regular physical activity (150+ minutes of moderate exercise weekly)",
        "Monitor your weight monthly to maintain your healthy range",
        "Focus on stress management and quality sleep",
      ],
      Overweight: [
        "Gradually increase physical activity (start with 30 mins walking daily)",
        "Reduce processed foods and sugary drinks",
        "Incorporate more vegetables and lean proteins into meals",
        "Practice mindful eating and portion control",
      ],
      Obese: [
        "Consult with a healthcare provider for a personalized weight management plan",
        "Start with low-impact exercises like swimming or cycling",
        "Keep a food diary to track eating habits",
        "Set realistic short-term goals (5-10% weight loss)",
      ],
    };
    return tips[category] || [];
  };

  const calculateBMI = async () => {
    const bmiValue = (weight / (height / 100) ** 2).toFixed(2);
    const bmiCategory = getBMICategory(bmiValue);

    setBmi(bmiValue);
    setCategory(bmiCategory);
    setTipsExpanded(true);

    try {
      await axios.post("http://localhost:5000/api/calculations", {
        type: "BMI",
        data: { weight, height, bmi: bmiValue, category: bmiCategory },
      });

      const bmiData = { height, weight, bmi: bmiValue, category: bmiCategory };
      localStorage.setItem("bmiData", JSON.stringify(bmiData));
    } catch (error) {
      console.error("Error saving BMI data:", error);
    }
  };

  const toggleTips = () => {
    setTipsExpanded(!tipsExpanded);
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
              borderRadius: "8px",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                p: 3,
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

            <Button
              fullWidth
              onClick={toggleTips}
              endIcon={tipsExpanded ? <ExpandLess /> : <ExpandMore />}
              sx={{ mt: 1 }}
              className="hide"
            >
              {tipsExpanded
                ? "Hide Recommendations"
                : "Show Health Recommendations"}
            </Button>

            <Collapse in={tipsExpanded}>
              <List sx={{ backgroundColor: "#fafafa" }}>
                {getHealthTips(category).map((tip, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      {index % 4 === 0 ? (
                        <FitnessCenter />
                      ) : index % 4 === 1 ? (
                        <Restaurant />
                      ) : index % 4 === 2 ? (
                        <LocalHospital />
                      ) : (
                        <FitnessCenter />
                      )}
                    </ListItemIcon>
                    <ListItemText primary={tip} />
                  </ListItem>
                ))}
              </List>
            </Collapse>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default BMICalculator;
