import React, { useEffect, useState, useContext } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Button,
  Box,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import { toast } from "react-toastify";

const AvailableBooks = () => {
  const { token } = useContext(AppContext);
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [searchCriteria, setSearchCriteria] = useState({
    bookName: "",
    authorName: "",
    sectionName: "",
  });

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/user/ebooks", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBooks(res.data);
        setFilteredBooks(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchBooks();
  }, [token]);

  useEffect(() => {
    const { bookName, authorName, sectionName } = searchCriteria;
    const filtered = books.filter(
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
  }, [searchCriteria, books]);

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchCriteria((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleClearSearch = (field) => {
    setSearchCriteria((prevState) => ({ ...prevState, [field]: "" }));
  };

  const requestBook = async (bookId) => {
    try {
      await axios.post(
        `http://localhost:5000/api/user/ebooks/${bookId}/request`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Book requested successfully");
    } catch (err) {
      const errorMessage = err.response?.data?.msg || "Error requesting book";
      console.error(err);
      toast.error(errorMessage);
    }
  };

  return (
    <Container sx={{ paddingTop: 5 }}>
      <Box sx={{ marginBottom: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Search Book Name"
              name="bookName"
              value={searchCriteria.bookName}
              onChange={handleSearchChange}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: searchCriteria.bookName && (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => handleClearSearch("bookName")}
                      edge="end"
                    >
                      <ClearIcon />
                    </IconButton>
                  </InputAdornment>
                ),
                sx: { borderRadius: "20px" },
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Search Author Name"
              name="authorName"
              value={searchCriteria.authorName}
              onChange={handleSearchChange}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: searchCriteria.authorName && (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => handleClearSearch("authorName")}
                      edge="end"
                    >
                      <ClearIcon />
                    </IconButton>
                  </InputAdornment>
                ),
                sx: { borderRadius: "20px" },
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Search Section Name"
              name="sectionName"
              value={searchCriteria.sectionName}
              onChange={handleSearchChange}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: searchCriteria.sectionName && (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => handleClearSearch("sectionName")}
                      edge="end"
                    >
                      <ClearIcon />
                    </IconButton>
                  </InputAdornment>
                ),
                sx: { borderRadius: "20px" },
              }}
            />
          </Grid>
        </Grid>
      </Box>
      {filteredBooks.length > 0 ? (
        <Grid container spacing={3}>
          {filteredBooks.map((book) => (
            <Grid item xs={12} sm={6} md={4} key={book._id}>
              <Card sx={{ borderRadius: "15px", boxShadow: 3 }}>
                <CardContent>
                  <Typography
                    variant="h6"
                    component="div"
                    sx={{ fontWeight: "bold" }}
                  >
                    {book.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {book.authors.join(", ")}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ marginTop: 1 }}
                  >
                    Section: {book.section?.name || "N/A"}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={() => requestBook(book._id)}
                    sx={{
                      borderRadius: "15px",
                      textTransform: "none",
                      fontWeight: "bold",
                    }}
                  >
                    Request
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography
          color="textSecondary"
          variant="h6"
          component="p"
          gutterBottom
          sx={{ textAlign: "center", marginTop: 5 }}
        >
          No eBooks available.
        </Typography>
      )}
    </Container>
  );
};

export default AvailableBooks;
