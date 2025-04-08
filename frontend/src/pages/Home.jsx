import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import "./Home.css";

const Home = () => {
  const [expanded, setExpanded] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : null);
  };

  const healthTips = [
    {
      question: "Desk Stretches You Can Do Right Now",
      answer:
        "Try neck rolls, shoulder shrugs, seated spinal twists, and wrist circles every hour to improve circulation.",
    },
    {
      question: "Mini Workouts During TV Time",
      answer:
        "Do squats during commercials, plank during the opening credits, or march in place throughout the show.",
    },
    {
      question: "Hydration Reminder Trick",
      answer:
        "Keep a water bottle at your desk and take 3 big sips every time you check your phone.",
    },
    {
      question: "Snack Swaps for Better Energy",
      answer:
        "Replace chips with nuts, soda with sparkling water, and candy with fresh fruit for sustained energy.",
    },
    {
      question: "5-Minute Morning Routine",
      answer:
        "Start with 5 deep breaths, 10 arm circles, 10 knee lifts, and 5 standing side stretches.",
    },
    {
      question: "Eye Strain Reduction",
      answer:
        "Follow the 20-20-20 rule: every 20 minutes, look at something 20 feet away for 20 seconds.",
    },
    {
      question: "Lunch Break Movement Ideas",
      answer:
        "Eat in 20 minutes, then spend 10 minutes walking stairs or doing bodyweight exercises.",
    },
    {
      question: "Bedtime Wind-Down Routine",
      answer:
        "Dim lights 1 hour before bed, do gentle yoga stretches, and avoid screens for better sleep.",
    },
    {
      question: "Posture Correction Reminder",
      answer:
        "Set hourly alerts to check your posture - ears over shoulders, shoulders over hips.",
    },
    {
      question: "Air Squats While Brushing Teeth",
      answer:
        "Do 10-15 squats during your 2-minute tooth brushing routine twice daily.",
    },
    {
      question: "Stress-Relief Breathing Technique",
      answer:
        "Practice 4-7-8 breathing: inhale 4 sec, hold 7 sec, exhale 8 sec. Repeat 4 times.",
    },
    {
      question: "Active Gaming Alternatives",
      answer:
        "Try dance video games, VR fitness apps, or standing/moving during mobile games.",
    },
    {
      question: "Stair Climbing Motivation",
      answer:
        "Take stairs instead of elevators - start with 1 flight daily and increase gradually.",
    },
    {
      question: "Kitchen Counter Exercises",
      answer:
        "Do counter push-ups, leg lifts, or calf raises while waiting for food to cook.",
    },
    {
      question: "Walking Meetings",
      answer:
        "Convert phone meetings to walking meetings - even pacing around your home helps.",
    },
  ];

  const calculatorLinks = [
    { path: "/bmi", label: "BMI Calculator" },
    { path: "/body-fat", label: "Body Fat Calculator" },
    { path: "/bmr", label: "BMR Calculator" },
    { path: "/calorie", label: "Calorie Calculator" },
    { path: "/body-shape", label: "Body Shape Calculator" },
    { path: "/diabetes", label: "Diabetes Risk Calculator" },
  ];

  return (
    <Box className="home-container" sx={{ px: isMobile ? 2 : 4, pb: 4 }}>
      {/* Hero Section */}
      <Box className="hero-section" sx={{ mb: 4, pt: 4 }}>
        <Typography
          variant={isMobile ? "h4" : "h2"}
          className="hero-title"
          sx={{
            fontWeight: 700,
            mb: 2,
            color: theme.palette.primary.dark,
          }}
        >
          Welcome to Health-Calculators
        </Typography>
        <Typography
          variant="body1"
          className="hero-subtitle"
          sx={{ mb: 1, fontSize: isMobile ? "1rem" : "1.1rem" }}
        >
          Explore a variety of calculators to help you with health, fitness, and
          more.
        </Typography>
      </Box>

      {/* Calculator Links */}
      <Box className="calculator-section" sx={{ mb: 6 }}>
        <Typography
          variant="h5"
          sx={{
            mb: 3,
            textAlign: "center",
            color: theme.palette.secondary.main,
          }}
        >
          Quick Access Calculators
        </Typography>
        <Box
          className="calculator-links"
          sx={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(3, 1fr)",
            gap: 2,
          }}
        >
          {calculatorLinks.map((link, index) => (
            <Link
              key={index}
              to={link.path}
              className="calculator-link"
              sx={{
                p: 2,
                borderRadius: 1,
                textAlign: "center",
                textDecoration: "none",
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                transition: "all 0.3s ease",
                boxShadow: 1,
                "&:hover": {
                  backgroundColor: theme.palette.primary.dark,
                  transform: "translateY(-2px)",
                  boxShadow: 3,
                },
              }}
            >
              {link.label}
            </Link>
          ))}
        </Box>
      </Box>

      {/* Health Tips Section */}
      <Box className="health-tips-section">
        <Typography
          variant={isMobile ? "h5" : "h3"}
          className="health-tips-title"
          sx={{
            mb: 2,
            textAlign: "center",
            color: theme.palette.secondary.main,
          }}
        >
          Health & Wellness Tips
        </Typography>
        <Typography
          variant="body1"
          className="health-tips-subtitle"
          sx={{
            mb: 3,
            textAlign: "center",
            fontSize: isMobile ? "0.95rem" : "1.05rem",
          }}
        >
          Simple ways to stay active and healthy in your daily routine
        </Typography>

        <Box className="health-tips-container">
          {healthTips.map((tip, index) => (
            <Accordion
              key={index}
              expanded={expanded === `panel${index}`}
              onChange={handleChange(`panel${index}`)}
              className="health-tip-accordion"
              sx={{
                mb: 2,
                "&:before": { display: "none" }, // Remove default border
              }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1" fontWeight="600">
                  {tip.question}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>{tip.answer}</Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default Home;
