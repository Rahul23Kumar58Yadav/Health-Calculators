import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  MenuItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import WarningIcon from "@mui/icons-material/Warning";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import FavoriteIcon from "@mui/icons-material/Favorite";

const DiabetesCalculator = () => {
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [familyHistory, setFamilyHistory] = useState("no");
  const [activityLevel, setActivityLevel] = useState("sedentary");
  const [riskLevel, setRiskLevel] = useState(null);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState(false);

  const activityLevels = {
    sedentary: "Sedentary (little or no exercise)",
    active: "Active (regular exercise 3+ times/week)",
    veryActive: "Very Active (daily vigorous exercise)",
  };

  const calculateRisk = async () => {
    if (!age || !weight || !height) {
      setError("Please fill in all fields.");
      return;
    }

    if (age <= 0 || weight <= 0 || height <= 0) {
      setError("All values must be positive numbers");
      return;
    }

    // Calculate BMI
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);

    // Risk calculation
    let riskScore = 0;

    // Age factor
    if (age >= 45) riskScore += 2;
    else if (age >= 35) riskScore += 1;

    // BMI factor
    if (bmi >= 30) riskScore += 3;
    else if (bmi >= 25) riskScore += 2;
    else if (bmi >= 23) riskScore += 1;

    // Family history
    if (familyHistory === "yes") riskScore += 2;

    // Activity level
    if (activityLevel === "sedentary") riskScore += 2;
    else if (activityLevel === "active") riskScore += 1;

    // Determine risk level
    let risk;
    if (riskScore >= 7) risk = "High";
    else if (riskScore >= 4) risk = "Moderate";
    else risk = "Low";

    setRiskLevel(risk);
    setError("");
    setExpanded(true);

    try {
      await axios.post("http://localhost:5000/api/calculations", {
        type: "Diabetes Risk",
        data: {
          age,
          weight,
          height,
          bmi,
          familyHistory,
          activityLevel,
          riskScore,
          riskLevel: risk,
        },
      });

      localStorage.setItem(
        "diabetesData",
        JSON.stringify({
          age,
          weight,
          height,
          bmi,
          familyHistory,
          activityLevel,
          riskScore,
          riskLevel: risk,
          lastUpdated: new Date().toISOString(),
        })
      );
    } catch (err) {
      console.error("Failed to save data:", err);
    }
  };

  const getPreventionTips = () => {
    if (!riskLevel) return [];

    const baseTips = [
      "Maintain a healthy weight (BMI between 18.5-24.9)",
      "Exercise for at least 30 minutes daily",
      "Eat a balanced diet rich in whole grains and fiber",
      "Limit processed foods and sugary drinks",
    ];

    if (riskLevel === "Moderate") {
      baseTips.push("Get annual blood sugar checks");
      baseTips.push("Reduce stress through meditation or yoga");
    } else if (riskLevel === "High") {
      baseTips.push("Consult a doctor for regular monitoring");
      baseTips.push("Consider meeting with a dietitian");
    }

    return baseTips;
  };

  const getWarningSigns = () => {
    return [
      "Frequent urination",
      "Increased thirst",
      "Unexplained weight loss",
      "Fatigue and irritability",
      "Blurred vision",
      "Slow-healing sores",
    ];
  };

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 500, mx: "auto", mt: 5 }}>
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={{ color: "primary.main" }}
      >
        Diabetes Risk Calculator
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField
          label="Age"
          type="number"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          fullWidth
          inputProps={{ min: 18, max: 120 }}
        />
        <TextField
          label="Weight (kg)"
          type="number"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          fullWidth
          inputProps={{ min: 1 }}
        />
        <TextField
          label="Height (cm)"
          type="number"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
          fullWidth
          inputProps={{ min: 1 }}
        />
        <TextField
          select
          label="Family History of Diabetes"
          value={familyHistory}
          onChange={(e) => setFamilyHistory(e.target.value)}
          fullWidth
        >
          <MenuItem value="yes">Yes</MenuItem>
          <MenuItem value="no">No</MenuItem>
        </TextField>
        <TextField
          select
          label="Activity Level"
          value={activityLevel}
          onChange={(e) => setActivityLevel(e.target.value)}
          fullWidth
        >
          {Object.entries(activityLevels).map(([value, label]) => (
            <MenuItem key={value} value={value}>
              {label}
            </MenuItem>
          ))}
        </TextField>

        {error && (
          <Typography color="error" align="center">
            {error}
          </Typography>
        )}

        <Button
          variant="contained"
          onClick={calculateRisk}
          fullWidth
          sx={{ py: 1.5, mt: 1 }}
        >
          Calculate Risk
        </Button>

        {riskLevel && (
          <Box sx={{ mt: 2 }}>
            <Typography
              variant="h5"
              align="center"
              gutterBottom
              sx={{
                color:
                  riskLevel === "High"
                    ? "error.main"
                    : riskLevel === "Moderate"
                    ? "warning.main"
                    : "success.main",
              }}
            >
              Your Diabetes Risk: <strong>{riskLevel}</strong>
              {riskLevel === "High" && (
                <WarningIcon
                  color="error"
                  sx={{ ml: 1, verticalAlign: "middle" }}
                />
              )}
            </Typography>

            <Accordion
              expanded={expanded === "prevention"}
              onChange={() =>
                setExpanded(expanded === "prevention" ? false : "prevention")
              }
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <FavoriteIcon color="primary" />
                  <Typography>Prevention Strategies</Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <List dense>
                  {getPreventionTips().map((tip, index) => (
                    <React.Fragment key={index}>
                      <ListItem>
                        <ListItemText primary={`${index + 1}. ${tip}`} />
                      </ListItem>
                      {index < getPreventionTips().length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </AccordionDetails>
            </Accordion>

            <Accordion
              expanded={expanded === "symptoms"}
              onChange={() =>
                setExpanded(expanded === "symptoms" ? false : "symptoms")
              }
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <LocalHospitalIcon color="secondary" />
                  <Typography>Warning Signs to Watch For</Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <List dense>
                  {getWarningSigns().map((sign, index) => (
                    <React.Fragment key={index}>
                      <ListItem>
                        <ListItemText primary={`${index + 1}. ${sign}`} />
                      </ListItem>
                      {index < getWarningSigns().length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </AccordionDetails>
            </Accordion>

            <Box
              sx={{ mt: 2, p: 2, bgcolor: "background.paper", borderRadius: 1 }}
            >
              <Typography variant="body2">
                <strong>Note:</strong> This assessment estimates risk only.
                Consult a healthcare professional for accurate diagnosis.
              </Typography>
            </Box>
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default DiabetesCalculator;
