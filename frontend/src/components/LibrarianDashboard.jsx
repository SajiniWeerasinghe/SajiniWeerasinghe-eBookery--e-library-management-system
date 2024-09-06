import React, { useEffect, useState, useContext } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import PeopleIcon from "@mui/icons-material/People";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import BookIcon from "@mui/icons-material/Book";
import ImportContactsIcon from "@mui/icons-material/ImportContacts";
import { toast } from "react-toastify";

const LibrarianDashboard = () => {
  const { token } = useContext(AppContext);
  const [data, setData] = useState({
    usersCount: 0,
    sections: 0,
    ebooks: 0,
    totalBooksIssued: 0,
    users: [],
  });
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/librarian/dashboard",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setData(res.data);
      } catch (err) {
        console.error("Error fetching dashboard data", err);
      }
    };

    fetchData();
  }, [token]);

  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedUser(null);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(
        `http://localhost:5000/api/librarian/user/${selectedUser._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setData((prevState) => ({
        ...prevState,
        users: prevState.users.filter((user) => user._id !== selectedUser._id),
      }));
      toast.success("User deleted successfully");
      handleClose();
    } catch (err) {
      const errorMessage = err.response?.data?.msg || "Error deleting User";
      console.error("Error deleting user", err);
      toast.error(errorMessage);
    }
  };

  return (
    <Container sx={{ paddingTop: 5 }}>
      <Grid container spacing={3} sx={{ marginBottom: 5 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "#eb348f",
              color: "#fff",
              height: 150,
              transition: "transform 0.3s ease-in-out",
              "&:hover": {
                transform: "scale(1.05)",
              },
            }}
          >
            <CardMedia>
              <PeopleIcon sx={{ fontSize: 50, margin: 2 }} />
            </CardMedia>
            <CardContent>
              <Typography variant="h6">Active Users</Typography>
              <Typography variant="h4">{data.usersCount}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "#51a9ed",
              color: "#fff",
              height: 150,
              transition: "transform 0.3s ease-in-out",
              "&:hover": {
                transform: "scale(1.05)",
              },
            }}
          >
            <CardMedia>
              <LibraryBooksIcon sx={{ fontSize: 50, margin: 2 }} />
            </CardMedia>
            <CardContent>
              <Typography variant="h6">Total Sections</Typography>
              <Typography variant="h4">{data.sections}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "#75e354",
              color: "#fff",
              height: 150,
              transition: "transform 0.3s ease-in-out",
              "&:hover": {
                transform: "scale(1.05)",
              },
            }}
          >
            <CardMedia>
              <BookIcon sx={{ fontSize: 50, margin: 2 }} />
            </CardMedia>
            <CardContent>
              <Typography variant="h6">Total E-books</Typography>
              <Typography variant="h4">{data.ebooks}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "#FF9800",
              color: "#fff",
              height: 150,
              transition: "transform 0.3s ease-in-out",
              "&:hover": {
                transform: "scale(1.05)",
              },
            }}
          >
            <CardMedia>
              <ImportContactsIcon sx={{ fontSize: 50, margin: 2 }} />
            </CardMedia>
            <CardContent>
              <Typography variant="h6">Total Books Issued</Typography>
              <Typography variant="h4">{data.totalBooksIssued}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Typography variant="h6" gutterBottom sx={{ paddingTop: 5 ,fontSize: 30, fontWeight: 500, textAlign: "center", color: "#5b320a" }}>
        All Users
      </Typography>
      <TableContainer
  component={Paper}
  sx={{ border: "1px solid #ccc", marginTop: 2, marginBottom: 10 }}
>
  <Table>
    <TableHead>
      <TableRow sx={{ backgroundColor: "#d28b19" }}>
        <TableCell sx={{ fontWeight: "bold", color: "#fff", borderRight: "1px solid #ccc" }}>Username</TableCell>
        <TableCell sx={{ fontWeight: "bold", color: "#fff", borderRight: "1px solid #ccc" }}>Email</TableCell>
        <TableCell sx={{ fontWeight: "bold", color: "#fff", borderRight: "1px solid #ccc" }}>Role</TableCell>
        <TableCell sx={{ fontWeight: "bold", color: "#fff" }}>Action</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {data.users.map((user, index) => (
        <TableRow
          key={user._id}
          sx={{
            backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#fff",
            // transition: "transform 0.2s ease-in-out",
            // transformOrigin: "center",
            "&:hover": {
              // transform: "scale(1.02)",
              backgroundColor: "#f7e8d0",
              transition: "transform 1.3s ease-out, background-color 0.3s ease-out",
            },
          }}
        >
          <TableCell sx={{ padding: "10px", borderRight: "1px solid #ccc" }}>{user.username}</TableCell>
          <TableCell sx={{ padding: "10px", borderRight: "1px solid #ccc" }}>{user.email}</TableCell>
          <TableCell sx={{ padding: "10px", borderRight: "1px solid #ccc" }}>{user.role}</TableCell>
          <TableCell sx={{ padding: "10px" }}>
            <IconButton color="error" onClick={() => handleDeleteClick(user)}>
              <DeleteIcon />
            </IconButton>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</TableContainer>


      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Delete User"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this user?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default LibrarianDashboard;
