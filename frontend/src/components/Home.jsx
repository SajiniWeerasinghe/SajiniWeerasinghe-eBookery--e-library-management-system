import React from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Avatar,
} from "@mui/material";
import { styled } from "@mui/system";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import ImportContactsIcon from "@mui/icons-material/ImportContacts";
import SearchIcon from "@mui/icons-material/Search";
import RateReviewIcon from "@mui/icons-material/RateReview";
import backgroundImage from "../images/back2.jpg";

const features = [
  {
    title: "Manage E-books",
    description:
      "Librarians can create and delete e-books within various sections of the library.",
    icon: <LibraryBooksIcon sx={{ fontSize: 40, color: "#3b2402" }} />,
  },
  {
    title: "User Account Management",
    description:
      "Librarians can manage user accounts, roles, and monitor user activity.",
    icon: <ManageAccountsIcon sx={{ fontSize: 40, color: "#3b2402" }} />,
  },
  {
    title: "Grant/Revoke Access",
    description:
      "Librarians can handle the issuing and returning process of e-books for users.",
    icon: <ImportContactsIcon sx={{ fontSize: 40, color: "#3b2402" }} />,
  },
  {
    title: "Search Library Catalog",
    description:
      "Users can easily search for e-books and resources available in the library.",
    icon: <SearchIcon sx={{ fontSize: 40, color: "#3b2402" }} />,
  },
  {
    title: "Request E-books",
    description:
      "Users can request access to e-books and manage their requests.",
    icon: <ImportContactsIcon sx={{ fontSize: 40, color: "#3b2402" }} />,
  },
  {
    title: "Rate and Review E-books",
    description: "Users can rate and review e-books they have read.",
    icon: <RateReviewIcon sx={{ fontSize: 40, color: "#3b2402" }} />,
  },
];

const BackgroundSection = styled(Box)(({ theme }) => ({
  backgroundImage: `url(${backgroundImage})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  height: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#fff",
  textAlign: "center",
  padding: "0 20px",
  position: "relative",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // semi-transparent overlay
    zIndex: 1,
  },
  "& > *": {
    position: "relative",
    zIndex: 2,
  },
}));

const FeaturesSection = styled(Box)({
  padding: "60px 0",
  backgroundColor: "#f4f4f4",
});

const FeatureCard = styled(Card)({
  padding: "30px",
  textAlign: "center",
  borderRadius: "16px",
  backgroundColor: "#ffffff",
  color: "#3b2402",
  cursor: "pointer",
  transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  "&:hover": {
    transform: "translateY(-10px)",
    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
  },
});

const Home = () => {
  return (
    <div>
      <BackgroundSection>
        <Typography
          variant="h2"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: "bold",
            fontFamily: "Poppins, sans-serif",
            background: "linear-gradient(to right,  #fff, #ddd)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            WebkitTextStroke: "1px black",
          }}
        >
          Welcome to eBookery <br />
          E-Library Management System
        </Typography>
      </BackgroundSection>
      <FeaturesSection>
        <Container>
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <FeatureCard>
                  <Avatar
                    sx={{
                      bgcolor: "#ffffff",
                      mb: 2,
                      width: 60,
                      height: 60,
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    {feature.icon}
                  </Avatar>
                  <CardContent>
                    <Typography
                      variant="h6"
                      component="div"
                      sx={{
                        fontWeight: "bold",
                        fontFamily: "Montserrat, sans-serif",
                      }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography variant="body2">{feature.description}</Typography>
                  </CardContent>
                </FeatureCard>
              </Grid>
            ))}
          </Grid>
        </Container>
      </FeaturesSection>
    </div>
  );
};

export default Home;
