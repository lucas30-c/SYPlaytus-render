const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const cors = require("cors");
const { MONGO_URI, JWT_SECRET } = require("./config");
const User = require("./models/User");
const Survey = require("./models/Survey");

const app = express();

// mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1); // Exit the process with failure
  });

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

// Normal Users Sign Up
app.post("/signup", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = new User({ username, password });
    await user.save();
    res.status(200).send("User registered");
  } catch (error) {
    console.error("Signup Error:", error); // Enhanced logging
    res.status(500).send("Error registering user");
  }
});

// Admin Signup
app.post("/admin/signup", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = new User({ username, password, isAdmin: true }); // Set isAdmin to true for admin
    await user.save();
    res.status(200).send("Admin registered");
  } catch (error) {
    console.error("Admin Signup Error:", error);
    res.status(500).send("Error registering admin");
  }
});

// Log In(For All Users)
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).send("Invalid credentials");
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET);
    res.status(200).send({ token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).send("Error logging in");
  }
});

// Delete User (Admin only)
app.delete("/user/:id", async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) return res.status(401).send("Unauthorized");

    const decoded = jwt.verify(token, JWT_SECRET);
    const adminUser = await User.findById(decoded.userId);

    if (!adminUser || !adminUser.isAdmin) {
      return res.status(403).send("Forbidden");
    }

    await User.findByIdAndDelete(req.params.id);
    res.status(200).send("User deleted");
  } catch (error) {
    console.error("Delete User Error:", error);
    res.status(500).send("Error deleting user");
  }
});

// Browse Users (protected)
// app.get('/users', async (req, res) => {
//     const token = req.headers.authorization.split(' ')[1];
//     if (!token) return res.status(401).send('Unauthorized');

//     try {
//         jwt.verify(token, JWT_SECRET);
//         const users = await User.find({}, 'username');  // Return only the usernames
//         res.status(200).send(users);
//     } catch (error) {
//         res.status(500).send('Error fetching users');
//     }
// });

// Browse Users (Admin only now)
app.get("/users", async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) return res.status(401).send("Unauthorized");

    const decoded = jwt.verify(token, JWT_SECRET);
    const adminUser = await User.findById(decoded.userId);

    if (!adminUser || !adminUser.isAdmin) {
      return res.status(403).send("Forbidden");
    }

    const users = await User.find({}, "username"); // Return only the usernames
    res.status(200).send(users);
  } catch (error) {
    console.error("Browse Users Error:", error);
    res.status(500).send("Error fetching users");
  }
});

//Survey
app.post("/presurvey", async (req, res) => {
  try {
    // Verify the JWT
    const token = req.headers.authorization.split(" ")[1];
    if (!token) return res.status(401).send("Unauthorized");

    const decoded = jwt.verify(token, JWT_SECRET);

    // Find the user
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(403).send("Forbidden");
    }

    const { name, age, gender, ethnicity } = req.body;
    const survey = new Survey({ name, age, gender, ethnicity });
    const savedSurvey = await survey.save();

    res
      .status(201)
      .json({ message: "Data saved successfully!", survey: savedSurvey });
  } catch (error) {
    console.error("Presurvey Error:", error);
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return res.status(401).send("Invalid token");
    }
    res.status(500).send("Error saving data");
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
