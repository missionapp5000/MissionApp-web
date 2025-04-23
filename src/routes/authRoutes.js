const express = require("express");
const router = express.Router();
const axios = require("axios");
const libphonenumber = require("google-libphonenumber").PhoneNumberUtil.getInstance();

// Registration API URLs
const REGISTER_URL = "https://netleak.nl/app/wp-json/wp/v2/users/register";
const CHECK_PHONE_URL = "https://netleak.nl/app/wp-json/netleak/v1/check-phone";
const REGISTRATION_STATUS_URL = "https://netleak.nl/app/wp-json/app/v1/registration_status";

// Utility function to normalize phone numbers
const normalizePhoneNumber = (phone, defaultCountryCode = "IN") => {
    try {
        // Validate the input
        if (!phone || typeof phone !== "string" || phone.trim() === "") {
            console.error("Invalid input: phone number is empty or not a string.");
            return null; // Return null for invalid input
        }

        // If the phone number does not start with "+", assume it's missing the country code
        if (!phone.startsWith("+")) {
            phone = `+${defaultCountryCode}${phone}`;
        }

        // Parse the phone number
        const number = libphonenumber.parseAndKeepRawInput(phone, defaultCountryCode);
        if (libphonenumber.isValidNumber(number)) {
            return libphonenumber.format(number, libphonenumber.PhoneNumberFormat.E164); // "+918222000123"
        }
        console.error("Invalid phone number after parsing:", phone);
        return null; // Return null for invalid numbers
    } catch (error) {
        console.error("Error normalizing phone number:", error.message);
        return null; // Return null for errors
    }
};

// Render the login page (GET /auth/login)
router.get("/login", (req, res) => {
    res.render("login");
});

// Handle login form submission (POST /auth/login)
router.post("/login", require("../controllers/authController").login);

// Render the registration page (GET /auth/register)
router.get("/register", async (req, res) => {
    try {
        const response = await axios.get("https://netleak.nl/app/wp-json/wp/v2/register-notice");
        const registrationNotice = response.data;

        res.render("register", {
            notice: registrationNotice.message || "",
            enabled: registrationNotice.enabled || false,
        });
    } catch (error) {
        console.error("Error fetching registration notice:", error.message);
        res.render("register", {
            notice: "Failed to fetch registration notice. Please try again later.",
            enabled: false,
        });
    }
});

// Handle registration form submission (POST /auth/register)
router.post("/register", async (req, res) => {
    const { username, email, password, phone } = req.body;

    // Log the raw phone input for debugging
    console.log("Raw phone input from user:", phone);

    // Normalize the phone number
    const normalizedPhone = normalizePhoneNumber(phone, "IN");
    if (!normalizedPhone) {
        return res.status(400).send("Invalid phone number format. Please include the country code.");
    }

    try {
        // Check if registration is allowed
        const statusResponse = await axios.get(REGISTRATION_STATUS_URL);
        if (!statusResponse.data.allow_registration) {
            return res.status(403).send("Registration is currently disabled.");
        }

        // Check if the phone number is already registered
        const phoneCheckResponse = await axios.post(CHECK_PHONE_URL, { phone: normalizedPhone });
        if (phoneCheckResponse.data.exists) {
            return res.status(400).send("Phone number is already registered.");
        }

        // Perform user registration
        const registerResponse = await axios.post(REGISTER_URL, {
            username,
            email,
            password,
            phone_number: normalizedPhone,
        });

        if (registerResponse.status === 201 || registerResponse.data.success) {
            res.send("Registration successful! Please log in.");
        } else {
            res.status(registerResponse.status).send(registerResponse.data.message || "Registration failed.");
        }
    } catch (error) {
        console.error("Error during registration:", error.response?.data || error.message);
        res.status(500).send("An error occurred during registration. Please try again.");
    }
});

// Logout route
router.post("/logout", require("../controllers/authController").logout);

module.exports = router;