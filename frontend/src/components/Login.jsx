import React, { useState, useContext, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Box, Button, TextField, Typography } from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { toast } from "react-toastify";
import backgroundImage from "../images/back2.jpg"; // Make sure the path is correct

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { role, dispatch } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (role) {
      navigate(`/${role}`);
    }
  }, [role, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        username,
        password,
      });
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: { token: res.data.token, role: res.data.user.role },
      });
      navigate(`/${res.data.user.role}`);
      toast.success("Login successful!");
    } catch (err) {
      const errorMessage = err.response?.data?.msg || "Error during login";
      console.error(err);
      toast.error(errorMessage);
    }
  };

  return (
    <Box
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <form onSubmit={handleSubmit}>
        <Box
          sx={{
            ":hover": { boxShadow: "10px 10px 15px #ccc" },
          }}
          display="flex"
          flexDirection={"column"}
          maxWidth={600}
          alignItems={"center"}
          justifyContent={"center"}
          margin={"auto"}
          paddingX={10} // Right and left padding
          paddingY={3} // Existing padding for top and bottom
          borderRadius={5}
          boxShadow={"5px 5px 10px #ccc"}
          backgroundColor="rgba(255, 255, 255, 0.8)"
        >
          <Typography variant="h2" padding={5} fontWeight="500" color={"rgb(97, 62, 10,0.9)"}>
            Login
          </Typography>
          <TextField
            margin="normal"
            type={"text"}
            variant="outlined"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            fullWidth
            required
            sx={{
              width: "130%", // Takes up full width
              "& .MuiInputBase-root": {
                color: "black", 
                fontSize: "1.1rem", // Slightly increased font size
                height: "60px", // Increased height of text field
                
                // Light brown text color
              },
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#d7ccc8", // Light brown border color
                },
                "&:hover fieldset": {
                  borderColor: "#a1887f", // Darker brown on hover
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#795548", // Darker brown when focused
                },
              },
            }}
          />
          <TextField
            margin="normal"
            type={"password"}
            variant="outlined"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            required
            sx={{
              width: "130%", // Increased width of text field
              marginBottom: 2, // Extra spacing between text fields
              "& .MuiInputBase-root": {
                color: "black", // Light brown text color
                fontSize: "1.1rem", // Slightly increased font size
                height: "60px", // Increased height of text field
              },
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#d7ccc8", // Light brown border color
                  color: "black",
                },
                "&:hover fieldset": {
                  borderColor: "#a1887f", // Darker brown on hover
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#795548", // Darker brown when focused
                },
              },
            }}
          />
          <Button
            startIcon={<LoginIcon />}
            sx={{ 
              marginTop: 3, 
              borderRadius: 3 ,
              backgroundColor: " #613e0a",
              ":hover": 
              {
                backgroundColor: " #3b2402", // Darker brown on hover
              },
            }}
            variant="contained"
            color="primary"
            type="submit"
          >
            Login
          </Button>
          <Link to="/register">
            <Button
              endIcon={<PersonAddIcon />}
              sx={{ marginTop: 6, borderRadius: 3,color: "#613e0a", // Brown color
                ":hover": {
                  color: "#3b2402", // Darker brown on hover
                }, }}
              color="secondary"
            >
              Change to Register
            </Button>
          </Link>
        </Box>
      </form>
    </Box>
  );
};

export default Login;
