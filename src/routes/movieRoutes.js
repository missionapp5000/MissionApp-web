const express = require("express");
const router = express.Router();
const movieController = require("../controllers/movieController");
const authMiddleware = require("../middlewares/authMiddleware");

// Protect routes with isAuthenticated middleware
router.get("/", authMiddleware.isAuthenticated, movieController.getMovies);
router.get("/:source/:id", authMiddleware.isAuthenticated, movieController.getMovieDetails);

module.exports = router;