import React, { useState, useContext, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import {
  Button,
  TextField,
  Container,
  Paper,
  Grid,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Tab,
  Tabs,
  Typography,
  Divider,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UserProfile = () => {
  const { token, logout } = useContext(AppContext);
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [tabIndex, setTabIndex] = useState(0); // Track active tab
  const [openPreview, setOpenPreview] = useState(false); // Preview changes before update
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/user/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData({ ...response.data, password: "" });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleUpdate = async () => {
    try {
      await axios.put("http://localhost:5000/api/user/me", userData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEditMode(false);
      setOpenPreview(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      const errorMessage =
        error.response?.data?.msg || "Error updating profile";
      console.error(error);
      toast.error(errorMessage);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete("http://localhost:5000/api/user/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      logout();
      navigate("/login");
    } catch (error) {
      const errorMessage =
        error.response?.data?.msg || "Error deleting account";
      console.error(error);
      toast.error(errorMessage);
    }
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleDeleteConfirm = () => {
    handleDelete();
    handleCloseDialog();
  };

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const handleOpenPreview = () => {
    setOpenPreview(true);
  };

  const handleClosePreview = () => {
    setOpenPreview(false);
  };

  return (
    <Container component={Paper} style={{ padding: "20px", marginTop: "40px" }}>
      <Typography variant="h5" gutterBottom>
        User Profile
      </Typography>
      <Tabs
        value={tabIndex}
        onChange={handleTabChange}
        indicatorColor="primary"
        textColor="primary"
        centered
        style={{ marginBottom: "20px" }}
      >
        <Tab label="Personal Details" />
        <Tab label="Account Settings" />
      </Tabs>

      {tabIndex === 0 && (
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Username"
              name="username"
              value={userData.username}
              onChange={handleInputChange}
              fullWidth
              disabled={!editMode}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Email"
              name="email"
              value={userData.email}
              onChange={handleInputChange}
              fullWidth
              disabled={!editMode}
            />
          </Grid>
          {editMode && (
            <Grid item xs={12}>
              <TextField
                label="Password"
                name="password"
                type="password"
                value={userData.password}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
          )}
          <Grid item xs={12}>
            <Divider style={{ margin: "20px 0" }} />
            <Box display="flex" justifyContent="space-between">
              {editMode ? (
                <>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleOpenPreview}
                  >
                    Preview Changes
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => setEditMode(false)}
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setEditMode(true)}
                >
                  Edit Profile
                </Button>
              )}
            </Box>
          </Grid>
        </Grid>
      )}

      {tabIndex === 1 && (
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h6" color="error">
              Danger Zone
            </Typography>
            <Typography variant="body2" gutterBottom>
              Deleting your account is permanent and cannot be undone.
            </Typography>
            <Button
              variant="outlined"
              color="error"
              onClick={handleOpenDialog}
              style={{ marginTop: "20px" }}
            >
              Delete Account
            </Button>
          </Grid>
        </Grid>
      )}

      {/* Confirm Delete Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Delete"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete your account? This action is
            irreversible.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Preview Changes Dialog */}
      <Dialog
        open={openPreview}
        onClose={handleClosePreview}
        aria-labelledby="preview-dialog-title"
        aria-describedby="preview-dialog-description"
      >
        <DialogTitle id="preview-dialog-title">{"Confirm Update"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="preview-dialog-description">
            You are about to update your profile with the following changes:
          </DialogContentText>
          <Box mt={2}>
            <Typography variant="body1">
              <strong>Username: </strong> {userData.username}
            </Typography>
            <Typography variant="body1">
              <strong>Email: </strong> {userData.email}
            </Typography>
            {userData.password && (
              <Typography variant="body1">
                <strong>Password: </strong> (updated)
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePreview} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleUpdate} color="primary" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default UserProfile;
