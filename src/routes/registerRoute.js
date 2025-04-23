const express = require("express");
const axios = require("axios");
const router = express.Router();

const REGISTER_URL = "https://netleak.nl/app/wp-json/wp/v2/users/register";
const CHECK_PHONE_URL = "https://netleak.nl/app/wp-json/netleak/v1/check-phone";
const REGISTRATION_STATUS_URL = "https://netleak.nl/app/wp-json/app/v1/registration_status";
const REGISTER_NOTICE_URL = "https://netleak.nl/app/wp-json/wp/v2/register-notice";

// Fetch registration notice
router.get("/register-notice", async (req, res) => {
    try {
        const response = await axios.get(REGISTER_NOTICE_URL);
        return res.status(200).json(response.data);
    } catch (error) {
        console.error("Error fetching registration notice:", error.message);
        return res.status(500).json({ error: "Failed to fetch registration notice" });
    }
});

// Check whether registration is allowed
router.get("/registration-status", async (req, res) => {
    try {
        const response = await axios.get(REGISTRATION_STATUS_URL);
        return res.status(200).json(response.data);
    } catch (error) {
        console.error("Error checking registration status:", error.message);
        return res.status(500).json({ error: "Failed to check registration status" });
    }
});

// Check if the phone number is already registered
router.post("/check-phone", async (req, res) => {
    const { phone } = req.body;

    if (!phone || typeof phone !== "string" || phone.trim() === "") {
        return res.status(400).json({ error: "Phone number is required and must be a valid string." });
    }

    try {
        const response = await axios.post(CHECK_PHONE_URL, { phone });
        return res.status(200).json(response.data);
    } catch (error) {
        console.error("Error checking phone existence:", error.response?.data || error.message);
        return res.status(500).json({ error: "Failed to check phone existence" });
    }
});

// Register the user
router.post("/register", async (req, res) => {
    const { username, email, password, phone } = req.body;

    if (!username || !email || !password || !phone) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        // Step 1: Check if registration is allowed
        const registrationStatusResponse = await axios.get(REGISTRATION_STATUS_URL);
        const registrationAllowed = registrationStatusResponse.data.allow_registration;

        if (!registrationAllowed) {
            return res.status(400).json({ error: "Registration is currently disabled" });
        }

        // Step 2: Check if the phone number already exists
        const checkPhoneResponse = await axios.post(CHECK_PHONE_URL, { phone });
        if (checkPhoneResponse.data.exists) {
            return res.status(400).json({ error: "Phone number already registered" });
        }

        // Step 3: Register the user
        const registerResponse = await axios.post(REGISTER_URL, {
            username,
            email,
            password,
            phone_number: phone, // Ensure the phone number key matches the WordPress backend's expected key
        });

        return res.status(201).json({
            message: "User registered successfully!",
            data: registerResponse.data,
        });
    } catch (error) {
        console.error("Error during registration:", error.response?.data || error.message);
        return res.status(error.response?.status || 500).json(
            error.response?.data || { error: "Registration failed due to an internal error." }
        );
    }
});

module.exports = router;