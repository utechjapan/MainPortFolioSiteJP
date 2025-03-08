// pages/api/subscribe.ts
import type { NextApiRequest, NextApiResponse } from "next";

// Only load dotenv in development (local testing)
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

// Import Mailchimp SDK
import mailchimp from "@mailchimp/mailchimp_marketing";

// Get environment variables
const API_KEY = process.env.MAILCHIMP_API_KEY;
const SERVER_PREFIX = process.env.MAILCHIMP_SERVER_PREFIX;
const LIST_ID = process.env.MAILCHIMP_LIST_ID;

// Configure the Mailchimp client
if (API_KEY && SERVER_PREFIX) {
  mailchimp.setConfig({
    apiKey: API_KEY,
    server: SERVER_PREFIX,
  });
}

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
  
  // Validate email is present
  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  // Check that necessary configuration is present
  if (!API_KEY || !SERVER_PREFIX || !LIST_ID) {
    return res.status(500).json({
      error: "Mailchimp configuration error: Please set MAILCHIMP_API_KEY, MAILCHIMP_SERVER_PREFIX, and MAILCHIMP_LIST_ID in your environment.",
    });
  }

  try {
    // Using the mailchimp-marketing library
    const response = await mailchimp.lists.addListMember(LIST_ID, {
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: name || "",
      },
    });

    return res.status(201).json({ 
      message: "Successfully subscribed!",
      memberId: response.id
    });
  } catch (error) {
    console.error("Error subscribing:", error);
    
    // If it's a Mailchimp API error, it might have more details
    if (error.response && error.response.body) {
      const mailchimpError = error.response.body;
      return res.status(400).json({
        error: mailchimpError.title || mailchimpError.detail || "There was an error subscribing."
      });
    }
    
    // Generic error
    return res.status(500).json({ 
      error: "Something went wrong with the subscription process." 
    });
  }
}