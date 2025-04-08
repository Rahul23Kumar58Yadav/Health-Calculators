import React from "react";
import { useAuth } from "../AuthContext";
import { Link, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Menu,
  MenuItem,
  IconButton,
} from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import "./Navbar.css";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const navigate = useNavigate();

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Health-Calculators
        </Typography>

        {[
          { path: "/", label: "Home" },
          { path: "/bmi", label: "BMI" },
          { path: "/body-fat", label: "Body Fat" },
          { path: "/bmr", label: "BMR" },
          { path: "/calorie", label: "Calorie" },
          { path: "/body-shape", label: "Body Shape" },
          { path: "/diabetes", label: "Diabetes" },
          { path: "/help", label: "Help" },
          { path: "/support", label: "Support" },
        ].map(({ path, label }) => (
          <Button key={path} color="inherit" component={Link} to={path}>
            {label}
          </Button>
        ))}

        {user ? (
          <Box sx={{ display: "flex", alignItems: "center", ml: "auto" }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={logout}>Logout</MenuItem>
              <MenuItem
                onClick={() => {
                  handleClose();
                  navigate("/profile");
                }}
              >
                Profile
              </MenuItem>
            </Menu>
          </Box>
        ) : (
          <Button color="inherit" component={Link} to="/login">
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
