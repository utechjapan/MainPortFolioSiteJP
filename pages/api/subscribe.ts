// pages/api/subscribe.ts
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  error?: string;
  message?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, name } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  // Mailchimp configuration from environment variables
  const API_KEY = process.env.MAILCHIMP_API_KEY;
  const LIST_ID = process.env.MAILCHIMP_LIST_ID;

  if (!API_KEY || !LIST_ID) {
    return res.status(500).json({ error: "Mailchimp configuration error" });
  }

  // Extract data center from API key (format: <key>-<dc>)
  const parts = API_KEY.split("-");
  const DATACENTER = parts[1];

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
      // Mailchimp uses basic auth with any username and the API key as the password
      Authorization: `Basic ${Buffer.from(`anystring:${API_KEY}`).toString(
        "base64"
      )}`,
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
