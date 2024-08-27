import React, { useState, useContext } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Box, Button, TextField, Typography } from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import LoginIcon from "@mui/icons-material/Login";
import { toast } from "react-toastify";
import backgroundImage from "../images/back2.jpg"; // Ensure the path is correct

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const { dispatch } = useContext(AppContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", {
        username,
        password,
        email,
      });
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: { token: res.data.token, role: "user" },
      });
      navigate("/user");
      toast.success("Registration successful!");
    } catch (err) {
      const errorMessage =
        err.response?.data?.errors?.[0]?.msg || "Error during registration";
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
          paddingX={10}
          paddingY={3}
          borderRadius={5}
          boxShadow={"5px 5px 10px #ccc"}
          backgroundColor="rgba(255, 255, 255, 0.8)"
        >
          <Typography variant="h2" padding={5} fontWeight="500" color={"rgb(97, 62, 10,0.9)"}>
            Register
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
              width: "130%",
              "& .MuiInputBase-root": {
                color: "black",
                fontSize: "1.1rem",
                height: "60px",
              },
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#d7ccc8",
                },
                "&:hover fieldset": {
                  borderColor: "#a1887f",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#795548",
                },
              },
            }}
          />
          <TextField
            margin="normal"
            type={"email"}
            variant="outlined"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            required
            sx={{
              width: "130%",
              "& .MuiInputBase-root": {
                color: "black",
                fontSize: "1.1rem",
                height: "60px",
              },
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#d7ccc8",
                },
                "&:hover fieldset": {
                  borderColor: "#a1887f",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#795548",
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
              width: "130%",
              marginBottom: 2,
              "& .MuiInputBase-root": {
                color: "black",
                fontSize: "1.1rem",
                height: "60px",
              },
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#d7ccc8",
                },
                "&:hover fieldset": {
                  borderColor: "#a1887f",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#795548",
                },
              },
            }}
          />
          <Button
            startIcon={<PersonAddIcon />}
            sx={{
              marginTop: 3,
              borderRadius: 3,
              backgroundColor: "#613e0a",
              ":hover": {
                backgroundColor: "#3b2402",
              },
            }}
            variant="contained"
            color="primary"
            type="submit"
          >
            Register
          </Button>
          <Link to="/login">
            <Button
              endIcon={<LoginIcon />}
              sx={{
                marginTop: 6,
                borderRadius: 3,
                color: "#613e0a",
                ":hover": {
                  color: "#3b2402",
                },
              }}
              color="secondary"
            >
              Change to Login
            </Button>
          </Link>
        </Box>
      </form>
    </Box>
  );
};

export default Register;
