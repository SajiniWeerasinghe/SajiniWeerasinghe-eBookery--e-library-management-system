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
  MenuItem,
  Grid,
  InputAdornment,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import { toast } from "react-toastify";

const EbookManagement = () => {
  const { token } = useContext(AppContext);
  const [ebooks, setEbooks] = useState([]);
  const [sections, setSections] = useState([]);
  const [newEbook, setNewEbook] = useState({
    name: "",
    content: "",
    authors: "",
    section: "",
  });
  const [editEbook, setEditEbook] = useState(null);
  const [open, setOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedEbook, setSelectedEbook] = useState(null);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [searchCriteria, setSearchCriteria] = useState({
    bookName: "",
    authorName: "",
    sectionName: "",
  });

  useEffect(() => {
    const fetchEbooks = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/user/ebooks", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEbooks(res.data);
        setFilteredBooks(res.data);
      } catch (err) {
        console.error(err);
      }
    };

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

    fetchEbooks();
    fetchSections();
  }, [token]);

  useEffect(() => {
    const { bookName, authorName, sectionName } = searchCriteria;
    const filtered = ebooks.filter(
      (book) =>
        (bookName === "" ||
          book.name.toLowerCase().includes(bookName.toLowerCase())) &&
        (authorName === "" ||
          book.authors.some((author) =>
            author.toLowerCase().includes(authorName.toLowerCase())
          )) &&
        (sectionName === "" ||
          book.section?.name.toLowerCase().includes(sectionName.toLowerCase()))
    );
    setFilteredBooks(filtered);
  }, [searchCriteria, ebooks]);

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchCriteria((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleClearSearch = (field) => {
    setSearchCriteria((prevState) => ({ ...prevState, [field]: "" }));
  };

  const addEbook = async () => {
    try {
      await axios.post("http://localhost:5000/api/librarian/ebooks", newEbook, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("E-book added successfully");
      const res = await axios.get("http://localhost:5000/api/user/ebooks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEbooks(res.data);
      setFilteredBooks(res.data);
      setNewEbook({
        name: "",
        content: "",
        authors: "",
        section: "",
      });
    } catch (err) {
      const errorMessage = err.response?.data?.msg || "Error adding E-book";
      console.error(err);
      toast.error(errorMessage);
    }
  };

  const handleDeleteClick = (ebook) => {
    setSelectedEbook(ebook);
    setOpenDialog(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(
        `http://localhost:5000/api/librarian/ebooks/${selectedEbook._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setEbooks(ebooks.filter((ebook) => ebook._id !== selectedEbook._id));
      setFilteredBooks(
        filteredBooks.filter((ebook) => ebook._id !== selectedEbook._id)
      );
      toast.success("E-book deleted successfully");
      handleCloseDialog();
    } catch (err) {
      const errorMessage = err.response?.data?.msg || "Error deleting E-book";
      console.error(err);
      toast.error(errorMessage);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedEbook(null);
  };

  const updateEbook = async () => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/librarian/ebooks/${editEbook._id}`,
        editEbook,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const updatedEbook = res.data;

      const updatedEbookWithSection = {
        ...updatedEbook,
        section:
          sections.find((section) => section._id === updatedEbook.section) ||
          editEbook.section,
      };

      setEbooks(
        ebooks.map((ebook) =>
          ebook._id === editEbook._id ? updatedEbookWithSection : ebook
        )
      );
      setFilteredBooks(
        filteredBooks.map((ebook) =>
          ebook._id === editEbook._id ? updatedEbookWithSection : ebook
        )
      );
      setEditEbook(null);
      setOpen(false);
      toast.success("E-book updated successfully");
    } catch (err) {
      const errorMessage = err.response?.data?.msg || "Error updating E-book";
      console.error(err);
      toast.error(errorMessage);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewEbook({ ...newEbook, [name]: value });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditEbook((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleEditOpen = (ebook) => {
    setEditEbook({
      ...ebook,
      section: ebook.section?._id || "",
    });
    setOpen(true);
  };

  const handleEditClose = () => {
    setEditEbook(null);
    setOpen(false);
  };

  return (
    <Container sx={{ paddingTop: 5 }}>
      <Typography
        variant="h6"
        gutterBottom
        sx={{
          paddingTop: 5,
          fontSize: 30,
          fontWeight: 500,
          textAlign: "center",
          color: "#5b320a",
        }}
      >
        Manage E-books
      </Typography>
      <TextField
        label="E-book Name"
        name="name"
        value={newEbook.name}
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
        label="Content"
        name="content"
        value={newEbook.content}
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
        label="Authors (comma separated)"
        name="authors"
        value={newEbook.authors}
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
        select
        label="Section"
        name="section"
        value={newEbook.section}
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
      >
        {sections.map((section) => (
          <MenuItem key={section._id} value={section._id}>
            {section.name}
          </MenuItem>
        ))}
      </TextField>
      <Button
        variant="contained"
        color="primary"
        onClick={addEbook}
        sx={{
          backgroundColor: "#613e0a",
          '&:hover': { backgroundColor: "#4a2b07" }, // Darker shade of brown
        }}
      >
        Add E-book
      </Button>

      <Typography
        variant="h6"
        gutterBottom
        sx={{
          marginTop: 5,
          fontSize: 25,
          fontWeight: 500,
          textAlign: "center",
          color: "#5b320a",
        }}
      >
        E-book List
      </Typography>
      <Grid container spacing={2} sx={{ marginBottom: 2 }}>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Search by Name"
            name="bookName"
            value={searchCriteria.bookName}
            onChange={handleSearchChange}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "#5b320a" }} />
                </InputAdornment>
              ),
              endAdornment: searchCriteria.bookName && (
                <InputAdornment position="end">
                  <IconButton onClick={() => handleClearSearch("bookName")}>
                    <ClearIcon sx={{ color: "#5b320a" }} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ marginBottom: 2 }}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Search by Author"
            name="authorName"
            value={searchCriteria.authorName}
            onChange={handleSearchChange}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "#5b320a" }} />
                </InputAdornment>
              ),
              endAdornment: searchCriteria.authorName && (
                <InputAdornment position="end">
                  <IconButton onClick={() => handleClearSearch("authorName")}>
                    <ClearIcon sx={{ color: "#5b320a" }} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ marginBottom: 2 }}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Search by Section"
            name="sectionName"
            value={searchCriteria.sectionName}
            onChange={handleSearchChange}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "#5b320a" }} />
                </InputAdornment>
              ),
              endAdornment: searchCriteria.sectionName && (
                <InputAdornment position="end">
                  <IconButton onClick={() => handleClearSearch("sectionName")}>
                    <ClearIcon sx={{ color: "#5b320a" }} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ marginBottom: 2 }}
          />
        </Grid>
      </Grid>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
          <TableRow sx={{ backgroundColor: "#d28b19" }}>
              <TableCell sx={{ fontWeight: "bold", color: "#fff", borderRight: "1px solid #ccc" }}>Name</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#fff", borderRight: "1px solid #ccc" }}>Authors</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#fff", borderRight: "1px solid #ccc" }}>Section</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#fff", borderRight: "1px solid #ccc" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredBooks.map((ebook) => (
              <TableRow key={ebook._id} 
              sx={{
                backgroundColor: "#FFF",
                // transition: "transform 0.2s ease-in-out",
                // transformOrigin: "center",
                "&:hover": {
                //   transform: "scale(1.02)",
                  backgroundColor: "#f7e8d0", // Light Cream
                },
              }}>
                <TableCell sx={{ padding: "10px", borderRight: "1px solid #ccc" }}>{ebook.name}</TableCell>
                <TableCell sx={{ padding: "10px", borderRight: "1px solid #ccc" }}>{ebook.authors.join(", ")}</TableCell>
                <TableCell sx={{ padding: "10px", borderRight: "1px solid #ccc" }}>{ebook.section?.name || "N/A"}</TableCell>
                <TableCell sx={{ padding: "10px", borderRight: "1px solid #ccc" }}>
                  <IconButton onClick={() => handleEditOpen(ebook)}>
                    <EditIcon sx={{ color: "#5b320a" }} />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteClick(ebook)}>
                    <DeleteIcon sx={{ color: "#db2016" }} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div style={{ height: '100px' }}></div>

      <Dialog
  open={open}
  onClose={handleEditClose}
  PaperProps={{
    sx: {
      bgcolor: "#FFF3E0", // Light Peach
      padding: 3,
      boxShadow: 3,
      border: "2px solid #d28b19", // Dark Yellow
    },
  }}
>
  <DialogTitle sx={{ color: "#5b320a", fontWeight: 500 }}>
    Edit E-book
  </DialogTitle><div></div>
  <DialogContent>
    <TextField
      label="E-book Name"
      name="name"
      value={editEbook?.name || ""}
      onChange={handleEditChange}
      fullWidth
      sx={{
        marginBottom: 2,
        bgcolor: "#FFF3E0", // Light Peach
        boxShadow: 1,
      }}
      InputLabelProps={{
        style: { color: "#5b320a" }, // Dark Brown label
      }}
      InputProps={{
        style: { color: "#5b320a" }, // Dark Brown text
      }}
    />
    <TextField
      label="Content"
      name="content"
      value={editEbook?.content || ""}
      onChange={handleEditChange}
      fullWidth
      sx={{
        marginBottom: 2,
        bgcolor: "#FFF3E0", // Light Peach
        boxShadow: 1,
      }}
      InputLabelProps={{
        style: { color: "#5b320a" }, // Dark Brown label
      }}
      InputProps={{
        style: { color: "#5b320a" }, // Dark Brown text
      }}
    />
    <TextField
      label="Authors (comma separated)"
      name="authors"
      value={editEbook?.authors.join(", ") || ""}
      onChange={handleEditChange}
      fullWidth
      sx={{
        marginBottom: 2,
        bgcolor: "#FFF3E0", // Light Peach
        boxShadow: 1,
      }}
      InputLabelProps={{
        style: { color: "#5b320a" }, // Dark Brown label
      }}
      InputProps={{
        style: { color: "#5b320a" }, // Dark Brown text
      }}
    />
    <TextField
      select
      label="Section"
      name="section"
      value={editEbook?.section || ""}
      onChange={handleEditChange}
      fullWidth
      sx={{
        marginBottom: 2,
        bgcolor: "#FFF3E0", // Light Peach
        boxShadow: 1,
      }}
      InputLabelProps={{
        style: { color: "#5b320a" }, // Dark Brown label
      }}
      InputProps={{
        style: { color: "#5b320a" }, // Dark Brown text
      }}
    >
      {sections.map((section) => (
        <MenuItem key={section._id} value={section._id}>
          {section.name}
        </MenuItem>
      ))}
    </TextField>
  </DialogContent>
  <DialogActions>
    <Button
      onClick={handleEditClose}
      sx={{
        color: "#db2016", // Red for cancel
        
        '&:hover': {
          backgroundColor: "#f8d2d1",
        },
      }}
    >
      Cancel
    </Button>
    <Button
      onClick={updateEbook}
      sx={{
        color: "#FFF",
        backgroundColor: "#613e0a",
        '&:hover': {
          backgroundColor: "#f4e2d3", 
          color:"#613e0a"// Light brown on hover
        },
      }}
    >
      Update
    </Button>
  </DialogActions>
</Dialog>


      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this e-book?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default EbookManagement;
