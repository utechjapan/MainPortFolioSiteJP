// pages/api/subscribe.ts
import type { NextApiRequest, NextApiResponse } from "next";

// Load environment variables when not in production
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const mailchimp = require("@mailchimp/mailchimp_marketing");

// Use environment variables if available, otherwise fallback to hardcoded values.
const API_KEY = process.env.MAILCHIMP_API_KEY || "086ed7f8b171a05fb4fd2070a8010252-us9";
const SERVER_PREFIX = process.env.MAILCHIMP_SERVER_PREFIX || "us9";
// Replace 'YOUR_DEFAULT_LIST_ID' with a valid List ID if you wish to fallback
const LIST_ID = process.env.MAILCHIMP_LIST_ID || "YOUR_DEFAULT_LIST_ID";

mailchimp.setConfig({
  apiKey: API_KEY,
  server: SERVER_PREFIX,
});

// Debug: Uncomment the line below to verify configuration during local testing
// console.log("Mailchimp Config:", { API_KEY, SERVER_PREFIX, LIST_ID });

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, name } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  if (!API_KEY || !LIST_ID) {
    return res
      .status(500)
      .json({ error: "Mailchimp configuration error: missing API key or List ID" });
  }

  // Prepare the data for subscription
  const data = {
    email_address: email,
    status: "subscribed",
    merge_fields: {
      FNAME: name,
    },
  };

  // Construct the endpoint URL using the server prefix
  const url = `https://${SERVER_PREFIX}.api.mailchimp.com/3.0/lists/${LIST_ID}/members`;

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // Mailchimp requires Basic Auth where the username can be any string.
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
