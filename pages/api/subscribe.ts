// pages/api/subscribe.ts
import type { NextApiRequest, NextApiResponse } from "next";

// Only load dotenv in development (local testing)
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const mailchimp = require("@mailchimp/mailchimp_marketing");

// Get environment variables (do not fallback to hardcoded values)
const API_KEY = process.env.MAILCHIMP_API_KEY;
const SERVER_PREFIX = process.env.MAILCHIMP_SERVER_PREFIX;
const LIST_ID = process.env.MAILCHIMP_LIST_ID;

mailchimp.setConfig({
  apiKey: API_KEY,
  server: SERVER_PREFIX,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Allow only POST requests
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, name } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  // Check that necessary configuration is present
  if (!API_KEY || !SERVER_PREFIX || !LIST_ID) {
    return res.status(500).json({
      error: "Mailchimp configuration error: Please set MAILCHIMP_API_KEY, MAILCHIMP_SERVER_PREFIX, and MAILCHIMP_LIST_ID in your environment.",
    });
  }

  const parts = API_KEY.split("-");
  // Validate that the API key is formatted correctly
  if (parts.length < 2) {
    return res.status(500).json({
      error: "Invalid Mailchimp API key format.",
    });
  }
  const DATACENTER = parts[1];

  // Construct the Mailchimp endpoint URL
  const url = `https://${DATACENTER}.api.mailchimp.com/3.0/lists/${LIST_ID}/members`;

  const data = {
    email_address: email,
    status: "subscribed",
    merge_fields: {
      FNAME: name,
    },
  };

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // Mailchimp requires basic authentication with any username.
      Authorization: `Basic ${Buffer.from(`anystring:${API_KEY}`).toString("base64")}`,
    },
    body: JSON.stringify(data),
  };

  try {
    const response = await fetch(url, options);
    const json = await response.json();

    if (response.status >= 400) {
      return res.status(400).json({
        error: json.detail || "There was an error subscribing.",
      });
    }

    return res.status(201).json({ message: "Successfully subscribed!" });
  } catch (error) {
    console.error("Error subscribing:", error);
    return res.status(500).json({ error: "Something went wrong." });
  }
}
