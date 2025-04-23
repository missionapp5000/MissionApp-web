const express = require("express");
const router = express.Router();
const { normalizePhoneNumber } = require("./utils/phoneUtils"); // Import the function
const axios = require("axios"); // For HTTP requests to WordPress backend

router.post("/auth/check-phone", async (req, res) => {
    const { phone } = req.body;

    // Normalize the phone number to match WordPress expectations
    const normalizedPhone = normalizePhoneNumber(phone, "IN");
    if (!normalizedPhone) {
        return res.status(400).json({ error: "Invalid phone number format. Please include the country code." });
    }

    console.log("Normalized Phone Number for Duplicate Check:", normalizedPhone);

    try {
        // Call the WordPress backend check-phone API
        const response = await axios.post("http://your-wordpress-site.com/wp-json/netleak/v1/check-phone", {
            phone: normalizedPhone, // Send normalized phone number
        });

        return res.status(200).json(response.data);
    } catch (error) {
        console.error("Error during phone check:", error.response?.data || error.message);
        return res.status(error.response?.status || 500).json(error.response?.data || { error: "An error occurred during phone check." });
    }
});

module.exports = router;