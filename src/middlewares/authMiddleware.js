const express = require("express");
const session = require("express-session");
const app = express();
const authRoutes = require("./src/routes/authRoutes");
const movieRoutes = require("./src/routes/movieRoutes");

app.use(
  session({
    secret: "your-secret-key", // Replace with a secure secret key
    resave: false,
    saveUninitialized: true,
  })
);

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Routes
app.use("/auth", authRoutes);
app.use("/", movieRoutes);

exports.isAuthenticated = (req, res, next) => {
    if (req.session && req.session.token) {
      next(); // User is authenticated
    } else {
      res.redirect("/auth/login"); // Redirect to login page
    }
  };

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));