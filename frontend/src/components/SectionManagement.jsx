import React, { useState, useEffect, useContext } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import {
  Container,
  TextField,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Modal,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import { toast } from "react-toastify";

const SectionManagement = () => {
  const { token } = useContext(AppContext);
  const [sections, setSections] = useState([]);
  const [newSection, setNewSection] = useState({
    name: "",
    description: "",
  });
  const [editSection, setEditSection] = useState(null);
  const [open, setOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedSection, setSelectedSection] = useState(null);

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/user/sections", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSections(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchSections();
  }, [token]);

  const addSection = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/librarian/sections",
        newSection,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSections([...sections, res.data]);
      setNewSection({ name: "", description: "" });
      toast.success("Section added successfully");
    } catch (err) {
      const errorMessage = err.response?.data?.msg || "Error adding Section";
      console.error(err);
      toast.error(errorMessage);
    }
  };

  const handleDeleteClick = (section) => {
    setSelectedSection(section);
    setOpenDialog(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(
        `http://localhost:5000/api/librarian/sections/${selectedSection._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSections(
        sections.filter((section) => section._id !== selectedSection._id)
      );
      toast.success("Section deleted successfully");
      handleCloseDialog();
    } catch (err) {
      const errorMessage = err.response?.data?.msg || "Error deleting Section";
      console.error(err);
      toast.error(errorMessage);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedSection(null);
  };

  const updateSection = async () => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/librarian/sections/${editSection._id}`,
        editSection,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSections(
        sections.map((section) =>
          section._id === editSection._id ? res.data : section
        )
      );
      setEditSection(null);
      setOpen(false);
      toast.success("Section updated successfully");
    } catch (err) {
      const errorMessage = err.response?.data?.msg || "Error updating Section";
      console.error(err);
      toast.error(errorMessage);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewSection({ ...newSection, [name]: value });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditSection({ ...editSection, [name]: value });
  };

  const handleEditOpen = (section) => {
    setEditSection(section);
    setOpen(true);
  };

  const handleEditClose = () => {
    setEditSection(null);
    setOpen(false);
  };

  return (
    <Container sx={{ marginTop: 5 }}>
      <TextField
        label="Section Name"
        name="name"
        value={newSection.name}
        onChange={handleChange}
        sx={{ marginBottom: 2 }}
        fullWidth
        required
        InputLabelProps={{
          style: { color: "#5b320a" }, // Dark Brown
        }}
        InputProps={{
          style: { color: "#5b320a" }, // Dark Brown
        }}
      />
      <TextField
        label="Description"
        name="description"
        value={newSection.description}
        onChange={handleChange}
        sx={{ marginBottom: 2 }}
        fullWidth
        InputLabelProps={{
          style: { color: "#5b320a" }, // Dark Brown
        }}
        InputProps={{
          style: { color: "#5b320a" }, // Dark Brown
        }}
      />
      <Button
        onClick={addSection}
        variant="contained"
        sx={{ marginBottom: 2, backgroundColor: "#613e0a", color: "#FFF"  ,"&:hover": {
                        backgroundColor: "#4a2b07",
                        transition: "transform 1.3s ease-out, background-color 0.3s ease-out",
                      },}} // Pinkish Red
      >
        Add Section
      </Button>
      {sections.length > 0 ? (
        <TableContainer
          component={Paper}
          sx={{
            border: "1px solid #ccc",
            marginTop: 2,
            marginBottom: 10,
            backgroundColor: "#F9F9F9", // Light Grey
            
          }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#d28b19",}}>
                <TableCell sx={{ fontWeight: "bold", color: "#fff", borderRight: "1px solid #ccc" }}>
                  Section Name
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#fff", borderRight: "1px solid #ccc" }}>
                  Description
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#fff", borderRight: "1px solid #ccc" }}>
                  Date Created
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#fff", borderRight: "1px solid #ccc" }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sections.map((section) => (
                <TableRow
                  key={section._id}
                  sx={{
                    backgroundColor: "#FFF",
                    // transition: "transform 0.2s ease-in-out",
                    // transformOrigin: "center",
                    "&:hover": {
                    //   transform: "scale(1.02)",
                      backgroundColor: "#f7e8d0", // Light Cream
                    },
                  }}
                >
                  <TableCell sx={{ padding: "10px", borderRight: "1px solid #ccc" }}>
                    {section.name}
                  </TableCell>
                  <TableCell sx={{ padding: "10px", borderRight: "1px solid #ccc" }}>
                    {section.description}
                  </TableCell>
                  <TableCell sx={{ padding: "10px", borderRight: "1px solid #ccc" }}>
                    {new Date(section.dateCreated).toLocaleString()}
                  </TableCell>
                  <TableCell sx={{ padding: "10px" }}>
                    <IconButton
                      sx={{ color: "#8a4d19" }} // Green
                      onClick={() => handleEditOpen(section)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      sx={{ color: "#db2016" }} // Orange
                      onClick={() => handleDeleteClick(section)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography
          color="textSecondary"
          variant="h6"
          component="p"
          gutterBottom
        >
          No sections available.
        </Typography>
      )}

      <Modal open={open} onClose={handleEditClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "#FFF3E0", // Light Peach
            border: "2px solid #d28b19", // Dark Yellow
            boxShadow: 24,
            p: 4,
          }}
        >
          <IconButton
            aria-label="close"
            onClick={handleEditClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
          <Typography
            sx={{ marginBottom: 2, color: "#5b320a" }} // Dark Brown
            variant="h6"
            component="h2"
            gutterBottom
          >
            Edit Section
          </Typography>
          <TextField
            label="Section Name"
            name="name"
            value={editSection?.name || ""}
            onChange={handleEditChange}
            sx={{ marginBottom: 2 ,boxShadow: 1,}}
            fullWidth
            required
            InputLabelProps={{
              style: { color: "#5b320a" }, // Dark Brown
            }}
            InputProps={{
              style: { color: "#5b320a" }, // Dark Brown
            }}
          />
          <TextField
            label="Description"
            name="description"
            value={editSection?.description || ""}
            onChange={handleEditChange}
            sx={{ marginBottom: 2 ,boxShadow: 1,}}
            fullWidth
            InputLabelProps={{
              style: { color: "#5b320a" }, // Dark Brown
            }}
            InputProps={{
              style: { color: "#5b320a" }, // Dark Brown
            }}
          />
          <Button
            onClick={updateSection}
            variant="contained"
            sx={{ backgroundColor: "#613e0a", 
              '&:hover': {
          backgroundColor: "#f4e2d3", 
          color:"#613e0a"// Light brown on hover
        },color: "#FFF" }} // Pinkish Red
            fullWidth
          >
            Update Section
          </Button>
        </Box>
      </Modal>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Delete Section"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this section?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default SectionManagement;
