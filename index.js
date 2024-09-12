import express, { json } from "express";
import { connectToMongoDB } from "./connect.js";

import urlRoute from "./routes/url.js";
import { findOneAndUpdate } from "./models/url.js";

const app = express();
const PORT = 8001;

connectToMongoDB(
  "mongodb+srv://22bcs12133:cHeeRvTlmSmONfkq@clusterdemo.p3szmqs.mongodb.net/"
).then(() => console.log("connected to MongoDB"));

app.use(json());
app.use("/url", urlRoute);

app.get("/:shortId", async (req, res) => {
  const shortId = req.params.shortId;
  const entry = await findOneAndUpdate(
    { shortId },
    { $push: { visitHistory: { timestamp: Date.now() } } },
    { new: true } // Return the updated document
  );

  if (!entry) {
    return res.status(404).json({ error: "URL not found" });
  }

  res.redirect(entry.redirectURL);
});

app.listen(PORT, () => console.log(`SERVER started on PORT: ${PORT}`));
