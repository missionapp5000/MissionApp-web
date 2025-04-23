const axios = require("axios");

const WORDPRESS_LOGIN_URL = "https://netleak.nl/app/wp-json/jwt-auth/v1/token";
const PLAN_CHECK_URL = "https://netleak.nl/app/wp-json/netleak/v1/check-plan";

// Login Function
exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Step 1: Authenticate with WordPress JWT Endpoint
    const loginResponse = await axios.post(WORDPRESS_LOGIN_URL, {
      username,
      password,
      device_id: "deprecated-placeholder", // Add a dummy device_id value
    });

    const token = loginResponse.data.token; // Extract token from response

    // Step 2: Verify Plan with the Token
    const planCheckResponse = await axios.post(
      PLAN_CHECK_URL,
      { token },
      { headers: { "Content-Type": "application/json" } }
    );

    const isActive = planCheckResponse.data.active;

    if (isActive) {
      // Step 3: Save token in session and redirect to the dashboard
      req.session.token = token;
      req.session.isLoggedIn = true;
      return res.redirect("/dashboard"); // Redirect to the dashboard
    } else {
      // If no active plan, send an error
      req.session.destroy(); // Clear session
      return res.status(403).send("No active plan found. Please subscribe.");
    }
  } catch (error) {
    console.error(error.response?.data || error.message);

    // Handle login or plan verification errors
    if (error.response?.data?.message) {
      const errorMessage = error.response.data.message.replace(/<.*?>/g, "").trim(); // Clean HTML tags
      return res.status(401).send(`Login failed: ${errorMessage}`);
    }

    return res.status(500).send("An error occurred during login.");
  }
};

// Logout Function
exports.logout = (req, res) => {
  req.session.destroy(); // Clear session
  res.redirect("/auth/login"); // Redirect to login page
};