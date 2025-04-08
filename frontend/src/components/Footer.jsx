import React from "react";
import { Box, Container, Grid, Typography, Link } from "@mui/material";
import { Facebook, Twitter, Instagram, LinkedIn } from "@mui/icons-material";

const Footer = () => {
  const calculators = [
    { name: "Diabetes Calculator", path: "/diabetes-calculator" },
    { name: "Body Shape Calculator", path: "/body-shape-calculator" },
    { name: "Calorie Calculator", path: "/calorie-calculator" },
    { name: "BMR Calculator", path: "/bmr-calculator" },
    { name: "Body Fat Calculator", path: "/body-fat-calculator" },
  ];

  const quickLinks = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
    { name: "Blog", path: "/blog" },
    { name: "Privacy Policy", path: "/privacy" },
    { name: "Terms of Service", path: "/terms" },
  ];

  return (
    <Box
      sx={{
        bgcolor: "primary.main",
        color: "white",
        py: 6,
        mt: "auto",
        borderTop: "4px solid",
        borderColor: "secondary.main",
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Health Calculators Section */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
              Health Calculators
            </Typography>
            <Box component="ul" sx={{ listStyle: "none", pl: 0, mt: 2 }}>
              {calculators.map((calculator) => (
                <li key={calculator.name}>
                  <Link
                    href={calculator.path}
                    color="inherit"
                    underline="hover"
                    sx={{
                      display: "block",
                      py: 1,
                      "&:hover": { color: "secondary.light" },
                    }}
                  >
                    {calculator.name}
                  </Link>
                </li>
              ))}
            </Box>
          </Grid>

          {/* Quick Links Section */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
              Quick Links
            </Typography>
            <Box component="ul" sx={{ listStyle: "none", pl: 0, mt: 2 }}>
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.path}
                    color="inherit"
                    underline="hover"
                    sx={{
                      display: "block",
                      py: 1,
                      "&:hover": { color: "secondary.light" },
                    }}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </Box>
          </Grid>

          {/* Contact & Social Section */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
              Connect With Us
            </Typography>
            <Typography variant="body1" sx={{ mt: 2, mb: 2 }}>
              123 Health Street, Wellness City
              <br />
              contact@multicalculator.com
              <br />
              +1 (555) 123-4567
            </Typography>
            <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
              <Link href="#" color="inherit">
                <Facebook fontSize="large" />
              </Link>
              <Link href="#" color="inherit">
                <Twitter fontSize="large" />
              </Link>
              <Link href="#" color="inherit">
                <Instagram fontSize="large" />
              </Link>
              <Link href="#" color="inherit">
                <LinkedIn fontSize="large" />
              </Link>
            </Box>
          </Grid>
        </Grid>

        {/* Copyright Section */}
        <Box
          sx={{
            borderTop: "1px solid",
            borderColor: "divider",
            pt: 4,
            mt: 4,
            textAlign: "center",
          }}
        >
          <Typography variant="body2">
            &copy; {new Date().getFullYear()} Health Multi-Calculator. All
            rights reserved.
          </Typography>
          <Typography variant="caption" display="block" sx={{ mt: 1 }}>
            Disclaimer: The calculators provided on this site are for
            informational purposes only and should not replace professional
            medical advice.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
