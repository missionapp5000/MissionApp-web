const express = require("express");
const session = require("express-session");
const path = require("path");
const authRoutes = require("./src/routes/authRoutes"); // Import auth routes
const app = express();


// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "your-secret-key", // Use a secure key in production
    resave: false,
    saveUninitialized: true,
  })
);


// Set EJS as the view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src/views"));

// Serve static files (e.g., CSS, images)
app.use(express.static(path.join(__dirname, "public")));

// Define the root route
app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome</title>
    </head>
    <body>
      <h1>Welcome to the Mission App!</h1>
      <p><a href="/auth/login">Login</a> to get started.</p>
    </body>
    </html>
  `);
});

// Routes
app.use("/auth", authRoutes); // Use auth routes

// Example dashboard route
app.get("/dashboard", (req, res) => {
  if (req.session.isLoggedIn) {
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Dashboard</title>
      </head>
      <body>
        <h1>Welcome to your Dashboard</h1>
        <p>You are logged in successfully!</p>
        <a href="/auth/account">Account</a>
      </body>
      </html>
    `);
  } else {
    res.redirect("/auth/login"); // Redirect to login if the user is not logged in
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});