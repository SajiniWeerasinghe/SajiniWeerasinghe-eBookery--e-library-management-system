import React, { useState, useEffect, useContext } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import {
  Container,
  TextField,
  Button,
  Typography,
  Card,
  CardActions,
  CardContent,
  IconButton,
  MenuItem,
  Grid,
  InputAdornment,
  Modal,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CloseIcon from "@mui/icons-material/Close";
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
    <Container
      sx={{
        paddingTop: 5,
        backgroundImage: 'url("https://static.toiimg.com/thumb/105046099/105046099.jpg?height=746&width=420&resizemode=76&imgsize=63728")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        paddingBottom: 5,
      }}
    >
      <Card sx={{ padding: 3, marginBottom: 5, backgroundColor: "rgba(255, 255, 255, 0.8)" }}>
        <Typography variant="h5" gutterBottom>
          Add New E-book
        </Typography>
        <TextField
          label="E-book Name"
          name="name"
          value={newEbook.name}
          onChange={handleChange}
          sx={{ marginBottom: 2 }}
          fullWidth
          required
        />
        <TextField
          label="Content"
          name="content"
          value={newEbook.content}
          onChange={handleChange}
          sx={{ marginBottom: 2 }}
          fullWidth
          required
        />
        <TextField
          label="Authors (comma separated)"
          name="authors"
          value={newEbook.authors}
          onChange={handleChange}
          sx={{ marginBottom: 2 }}
          fullWidth
          required
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
        >
          {sections.map((section) => (
            <MenuItem key={section._id} value={section._id}>
              {section.name}
            </MenuItem>
          ))}
        </TextField>
        <Button
          onClick={addEbook}
          variant="contained"
          color="primary"
          startIcon={<AddCircleOutlineIcon />}
        >
          Add E-book
        </Button>
      </Card>

      <Grid container spacing={2} sx={{ marginBottom: 5 }}>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Search by Book Name"
            name="bookName"
            value={searchCriteria.bookName}
            onChange={handleSearchChange}
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {searchCriteria.bookName ? (
                    <IconButton onClick={() => handleClearSearch("bookName")}>
                      <ClearIcon />
                    </IconButton>
                  ) : (
                    <SearchIcon />
                  )}
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Search by Author Name"
            name="authorName"
            value={searchCriteria.authorName}
            onChange={handleSearchChange}
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {searchCriteria.authorName ? (
                    <IconButton onClick={() => handleClearSearch("authorName")}>
                      <ClearIcon />
                    </IconButton>
                  ) : (
                    <SearchIcon />
                  )}
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Search by Section Name"
            name="sectionName"
            value={searchCriteria.sectionName}
            onChange={handleSearchChange}
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {searchCriteria.sectionName ? (
                    <IconButton onClick={() => handleClearSearch("sectionName")}>
                      <ClearIcon />
                    </IconButton>
                  ) : (
                    <SearchIcon />
                  )}
                </InputAdornment>
              ),
            }}
          />
        </Grid>
      </Grid>

      <Grid container spacing={4}>
        {filteredBooks.map((ebook) => (
          <Grid item xs={12} sm={6} md={4} key={ebook._id}>
            <Card>
              <CardContent>
                <Typography gutterBottom variant="h6">
                  {ebook.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Authors: {ebook.authors.join(", ")}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Section: {ebook.section?.name || "No section"}
                </Typography>
              </CardContent>
              <CardActions>
                <IconButton onClick={() => handleEditOpen(ebook)}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleDeleteClick(ebook)}>
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Delete E-book</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the e-book "{selectedEbook?.name}"?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="secondary"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Modal open={open} onClose={handleEditClose}>
        <Box
          sx={{
            width: 400,
            margin: "auto",
            padding: 4,
            marginTop: "10vh",
            backgroundColor: "white",
            borderRadius: 1,
            boxShadow: 24,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Edit E-book
          </Typography>
          <TextField
            label="E-book Name"
            name="name"
            value={editEbook?.name || ""}
            onChange={handleEditChange}
            sx={{ marginBottom: 2 }}
            fullWidth
            required
          />
          <TextField
            label="Content"
            name="content"
            value={editEbook?.content || ""}
            onChange={handleEditChange}
            sx={{ marginBottom: 2 }}
            fullWidth
            required
          />
          <TextField
            label="Authors (comma separated)"
            name="authors"
            value={editEbook?.authors.join(", ") || ""}
            onChange={handleEditChange}
            sx={{ marginBottom: 2 }}
            fullWidth
            required
          />
          <TextField
            select
            label="Section"
            name="section"
            value={editEbook?.section || ""}
            onChange={handleEditChange}
            sx={{ marginBottom: 2 }}
            fullWidth
            required
          >
            {sections.map((section) => (
              <MenuItem key={section._id} value={section._id}>
                {section.name}
              </MenuItem>
            ))}
          </TextField>
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button onClick={handleEditClose} startIcon={<CloseIcon />}>
              Cancel
            </Button>
            <Button
              onClick={updateEbook}
              color="primary"
              variant="contained"
              startIcon={<EditIcon />}
            >
              Save
            </Button>
          </Stack>
        </Box>
      </Modal>
    </Container>
  );
};

export default EbookManagement;
