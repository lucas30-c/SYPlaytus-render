import React, { useState } from "react";
import axios from "axios";
import Grid from "@mui/material/Unstable_Grid2";
import {
  Paper,
  Avatar,
  TextField,
  Button,
  createTheme,
  ThemeProvider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import SurveyIcon from "@mui/icons-material/Assignment"; // You can change this icon

const theme = createTheme({
  palette: {
    primary: {
      main: "#5d5fef",
    },
  },
});

const paperstyle = {
  padding: 20,
  height: "500px",
  width: "300px",
  margin: "100px auto",
  background: "#E4E4FC",
};

const PresurveyLogic = () => {
  const [open, setOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    ethnicity: "",
  });

  const genderOptions = ["Male", "Female", "Other"];
  const ethnicityOptions = [
    "Caucasian",
    "Asian",
    "African American",
    "Hispanic",
    "Other",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    try {
      //print form results to console
      console.log("Form data submitted successfully:", formData);

      const token = localStorage.getItem("token"); // <-- 获取token

      if (!token) {
        console.error("No token found!");
        return;
      }

      const response = await axios.post(
        "http://localhost:5000/presurvey",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Log the response from the server
      console.log("Server response:", response.data);
      setOpen(true);
    } catch (error) {
      console.error("Error during form submission:", error);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setFormData({
      // Reset the form
      name: "",
      age: "",
      gender: "",
      ethnicity: "",
    });
    window.location.reload(); // Refresh the page
  };

  return (
    <ThemeProvider theme={theme}>
      <Grid>
        <Paper elevation={10} style={paperstyle}>
          <Grid align="center">
            <Avatar sx={{ bgcolor: "#8D8FF3" }}>
              <SurveyIcon />
            </Avatar>
            <h2>Presurvey</h2>
          </Grid>
          <FormControl fullWidth margin="normal">
            <TextField
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
              required
            />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <TextField
              label="Age"
              name="age"
              type="number"
              value={formData.age}
              onChange={handleChange}
              fullWidth
              required
            />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Gender</InputLabel>
            <Select
              label="Gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              fullWidth
              required
            >
              {genderOptions.map((option, index) => (
                <MenuItem key={index} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Ethnicity</InputLabel>
            <Select
              label="Ethnicity"
              name="ethnicity"
              value={formData.ethnicity}
              onChange={handleChange}
              fullWidth
              required
            >
              {ethnicityOptions.map((option, index) => (
                <MenuItem key={index} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            type="submit"
            color="primary"
            variant="contained"
            style={{ margin: "20px" }}
            onClick={handleSubmit}
          >
            Submit
          </Button>
          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>{"Submission Successful"}</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Congrats! Your information has been recorded.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="primary">
                Close
              </Button>
            </DialogActions>
          </Dialog>
        </Paper>
      </Grid>
    </ThemeProvider>
  );
};

export default PresurveyLogic;
