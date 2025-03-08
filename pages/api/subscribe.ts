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

  // Trim the environment variables to remove stray spaces
  const API_KEY = process.env.MAILCHIMP_API_KEY?.trim();
  const LIST_ID = process.env.MAILCHIMP_LIST_ID?.trim();

  if (!API_KEY || !LIST_ID) {
    console.error("Mailchimp configuration error: API_KEY or LIST_ID missing.");
    return res.status(500).json({ error: "Mailchimp configuration error" });
  }

  // Verify API key format (should contain a hyphen)
  const parts = API_KEY.split("-");
  if (parts.length < 2) {
    console.error("Mailchimp API key format is invalid:", API_KEY);
    return res.status(500).json({ error: "Mailchimp configuration error" });
  }

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
      // Basic Auth with any username and the API key as the password (base64 encoded)
      Authorization: `Basic ${Buffer.from(`anystring:${API_KEY}`).toString("base64")}`,
    },
    body: JSON.stringify(data),
  };

  try {
    const response = await fetch(url, options);
    const json = await response.json();

    if (!response.ok) {
      console.error("Mailchimp API error response:", json);
      return res.status(response.status).json({
        error: json.detail || "There was an error subscribing.",
      });
    }

    return res.status(201).json({ message: "Successfully subscribed!" });
  } catch (error: any) {
    console.error("Error subscribing:", error);
    return res.status(500).json({ error: "Something went wrong." });
  }
}
