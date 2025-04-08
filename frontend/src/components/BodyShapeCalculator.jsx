import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const BodyShapeCalculator = () => {
  const [waist, setWaist] = useState("");
  const [hip, setHip] = useState("");
  const [bodyShape, setBodyShape] = useState(null);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState(false);

  const calculateBodyShape = async () => {
    if (!waist || !hip) {
      setError("Please fill in all fields.");
      return;
    }

    if (waist <= 0 || hip <= 0) {
      setError("Measurements must be positive numbers");
      return;
    }

    // Body Shape calculation
    const ratio = (waist / hip).toFixed(2);
    let shape = "";
    if (ratio < 0.75) shape = "Pear";
    else if (ratio >= 0.75 && ratio <= 0.85) shape = "Hourglass";
    else shape = "Apple";
    setBodyShape(shape);
    setError("");
    setExpanded(true);

    try {
      // Save calculation to the database
      await axios.post("http://localhost:5000/api/calculations", {
        type: "Body Shape",
        data: { waist, hip, bodyShape: shape },
      });

      // Store data in localStorage
      const bodyShapeData = { waist, hip, bodyShape: shape, ratio };
      localStorage.setItem("bodyShapeData", JSON.stringify(bodyShapeData));
    } catch (err) {
      console.error("Failed to save data:", err);
    }
  };

  const getBodyShapeTips = () => {
    const tips = {
      Apple: [
        "Focus on core exercises to reduce abdominal fat (try planks and Russian twists)",
        "Limit processed carbs and sugars to combat visceral fat",
        "Include 150+ minutes of cardio weekly (brisk walking, swimming)",
        "Monitor waist circumference monthly for health tracking",
      ],
      Pear: [
        "Combine strength training (squats, lunges) with cardio for balanced results",
        "Increase protein intake to support lower body muscle development",
        "Try resistance band workouts to tone hips and thighs",
        "Focus on overall fat loss rather than spot reduction",
      ],
      Hourglass: [
        "Maintain balanced workouts (equal focus on upper/lower body)",
        "Try Pilates or barre to enhance natural proportions",
        "Monitor weight changes as they affect proportions evenly",
        "Focus on maintaining healthy waist-to-hip ratio",
      ],
    };
    return tips[bodyShape] || [];
  };

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 500, mx: "auto", mt: 5 }}>
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={{ color: "primary.main" }}
      >
        Body Shape Calculator
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField
          label="Waist circumference (cm)"
          type="number"
          value={waist}
          onChange={(e) => setWaist(e.target.value)}
          fullWidth
          inputProps={{ min: 1 }}
        />
        <TextField
          label="Hip circumference (cm)"
          type="number"
          value={hip}
          onChange={(e) => setHip(e.target.value)}
          fullWidth
          inputProps={{ min: 1 }}
        />
        {error && (
          <Typography color="error" align="center">
            {error}
          </Typography>
        )}
        <Button
          variant="contained"
          onClick={calculateBodyShape}
          fullWidth
          sx={{ py: 1.5 }}
        >
          Calculate Body Shape
        </Button>

        {bodyShape && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" align="center" sx={{ mb: 1 }}>
              Your Body Shape: <strong>{bodyShape}</strong>
            </Typography>

            <Accordion
              expanded={expanded === "panel1"}
              onChange={handleAccordionChange("panel1")}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Personalized Health Tips</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <List dense>
                  {getBodyShapeTips().map((tip, index) => (
                    <React.Fragment key={index}>
                      <ListItem>
                        <ListItemText
                          primary={`${index + 1}. ${tip}`}
                          primaryTypographyProps={{ variant: "body2" }}
                        />
                      </ListItem>
                      {index < getBodyShapeTips().length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </AccordionDetails>
            </Accordion>

            <Box
              sx={{ mt: 2, p: 2, bgcolor: "background.paper", borderRadius: 1 }}
            >
              <Typography variant="body2">
                <strong>Note:</strong>{" "}
                {
                  {
                    Apple:
                      "Apple shapes may have higher visceral fat risk - focus on core exercises and cardio",
                    Pear: "Pear shapes store fat in lower body - combine strength training with fat-burning cardio",
                    Hourglass:
                      "Hourglass shapes should maintain balanced workouts to preserve proportions",
                  }[bodyShape]
                }
              </Typography>
            </Box>
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default BodyShapeCalculator;
