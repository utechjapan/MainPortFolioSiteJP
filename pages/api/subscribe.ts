// pages/api/subscribe.ts
import type { NextApiRequest, NextApiResponse } from "next";
import mailchimp from "@mailchimp/mailchimp_marketing";

type Data = {
  error?: string;
  message?: string;
};

mailchimp.setConfig({
  apiKey: process.env.MAILCHIMP_API_KEY!,
  server: process.env.MAILCHIMP_SERVER_PREFIX!, // e.g. "us19"
});

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

  const LIST_ID = process.env.MAILCHIMP_LIST_ID;
  if (!LIST_ID) {
    return res.status(500).json({ error: "Mailchimp configuration error" });
  }

  try {
    // Add the subscriber to your Mailchimp list
    const response = await mailchimp.lists.addListMember(LIST_ID, {
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: name || "",
      },
    });
    return res.status(201).json({ message: "Successfully subscribed!" });
  } catch (error: any) {
    console.error("Error subscribing:", error);
    // If available, use the error detail from Mailchimp's response.
    const errorMessage =
      error.response?.body?.detail || "Something went wrong.";
    return res.status(500).json({ error: errorMessage });
  }
}
