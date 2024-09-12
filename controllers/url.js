import { nanoid } from "nanoid";
import { URL } from "../models/url.js"; // Import the Mongoose model (adjust the path if needed)

async function handleGenerateNewShortURL(req, res) {
  try {
    const body = req.body;
    if (!body.url) return res.status(400).json({ error: "URL is required" });

    const shortID = nanoid(8); // Generate a unique short ID

    // Use the Mongoose model to create a new document in the database
    await URL.create({
      shortId: shortID,
      redirectURL: body.url,
      visitHistory: [],
    });

    return res.json({ id: shortID }); // Respond with the generated short ID
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
}

async function handleGetAnalytics(req, res) {
  try {
    const shortId = req.params.shortId;

    // Use the Mongoose model to find a document by its shortId
    const result = await URL.findOne({ shortId });

    if (!result) {
      return res.status(404).json({ error: "Short URL not found" });
    }

    return res.json({
      totalClicks: result.visitHistory.length, // Count total clicks
      analytics: result.visitHistory, // Send visit history as analytics
    });
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
}

export { handleGenerateNewShortURL, handleGetAnalytics };
