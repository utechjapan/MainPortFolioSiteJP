require('dotenv').config(); // if using environment variables
const mailchimp = require("@mailchimp/mailchimp_marketing");

// Use environment variables if available, otherwise fallback to hardcoded values.
const apiKey = process.env.MAILCHIMP_API_KEY || "086ed7f8b171a05fb4fd2070a8010252-us9";
const server = process.env.MAILCHIMP_SERVER_PREFIX || "us9";

mailchimp.setConfig({
  apiKey,
  server,
});

// Debug: Log the configuration (for testing only)
console.log("Mailchimp Config:", { apiKey, server });

async function run() {
  try {
    const response = await mailchimp.ping.get();
    console.log("Ping response:", response);
  } catch (error) {
    console.error("Error:", error);
  }
}

run();
