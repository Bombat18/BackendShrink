import Url from "../models/Url.js";
import shortid from "shortid";

export const shortenUrl = async (req, res) => {
  const { longUrl } = req.body;

  if (!longUrl) return res.status(400).json({ message: "Long URL is required" });

  try {
    const shortCode = shortid.generate();
    const newUrl = await Url.create({ longUrl, shortCode });
    res.json({ shortUrl: `${process.env.BASE_URL}/${shortCode}` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const redirectUrl = async (req, res) => {
  try {
    const url = await Url.findOne({ shortCode: req.params.shortcode });
    if (!url) return res.status(404).send("URL not found");

    url.clicks++;
    await url.save();
    res.redirect(url.longUrl);
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

export const getAllUrls = async (req, res) => {
  try {
    const urls = await Url.find().sort({ createdAt: -1 });
    res.json(urls);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
