import express, { Request, Response } from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const mongoURI = process.env.MONGODB_URI as string;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose
  .connect(mongoURI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Define Mongoose Schema and Model
interface IArticle extends mongoose.Document {
  title: string;
  content: string;
  author_id: number;
  created_at: Date;
  updated_at: Date;
  image_url: string;
}

const ArticleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author_id: { type: Number, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  image_url: { type: String, required: true },
});

// Use the correct collection name
const Article = mongoose.model<IArticle>(
  "Article",
  ArticleSchema,
  "NewsText&Metadata"
);

interface ITournament extends mongoose.Document {
  name: string;
  date: Date;
  type: "blitz" | "rapid" | "classical" | "bullet";
  round_number: number;
  place: string;
}

// Define the Tournament schema
const TournamentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  date: { type: Date, required: true },
  type: {
    type: String,
    enum: ["blitz", "rapid", "classical", "bullet"],
    required: true,
  },
  round_number: { type: Number, required: true },
  place: { type: String, required: true },
  page: { type: String, required: true },
});

// Email sending endpoint
app.post("/api/send-email", async (req: Request, res: Response) => {
  const { name, email, message } = req.body;

  // Create a transporter
  const transporter = nodemailer.createTransport({
    service: "gmail", // Use 'gmail' or any other service
    auth: {
      user: process.env.EMAIL_USER, // Your email address (from your env file)
      pass: process.env.EMAIL_PASS, // Your application-specific password
    },
  });

  // Email options
  const mailOptions = {
    from: email,
    to: "mateowiew@gmail.com",
    subject: `Wiadomość od ${name}`,
    text: `Imię: ${name},\nAdres mailowy: ${email},\n\nWiadomość: ${message}`,
  };

  // Send email
  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Error sending email" });
  }
});

// Create the Tournament model with the specified collection name
const Tournament = mongoose.model<ITournament>(
  "Tournament",
  TournamentSchema,
  "TournamentsData"
);

// API Routes for articles
app.get("/api/articles", async (req: Request, res: Response) => {
  try {
    const articles = await Article.find();
    res.json(articles);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Server error", error: (err as Error).message });
  }
});

app.post("/api/articles", async (req: Request, res: Response) => {
  const { title, content, author_id } = req.body;

  try {
    const newArticle = new Article({ title, content, author_id });
    await newArticle.save();
    res.json(newArticle);
  } catch (err) {
    res.status(400).json({
      message: "Failed to create article",
      error: (err as Error).message,
    });
  }
});

app.put("/api/articles/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, content, author_id } = req.body;

  try {
    const updatedArticle = await Article.findByIdAndUpdate(
      id,
      { title, content, author_id, updated_at: new Date() },
      { new: true }
    );
    if (!updatedArticle)
      return res.status(404).json({ message: "Article not found" });
    res.json(updatedArticle);
  } catch (err) {
    res.status(400).json({
      message: "Failed to update article",
      error: (err as Error).message,
    });
  }
});

app.delete("/api/articles/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await Article.findByIdAndDelete(id);
    if (!result) return res.status(404).json({ message: "Article not found" });
    res.json({ message: "Article deleted" });
  } catch (err) {
    res.status(400).json({
      message: "Failed to delete article",
      error: (err as Error).message,
    });
  }
});

// API Routes for Tournaments
app.get("/api/tournaments", async (req: Request, res: Response) => {
  try {
    const tournaments = await Tournament.find();
    res.json(tournaments);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Server error", error: (err as Error).message });
  }
});

app.post("/api/tournaments", async (req: Request, res: Response) => {
  const { name, date, description, type } = req.body;

  try {
    const newTournament = new Tournament({ name, date, description, type });
    await newTournament.save();
    res.json(newTournament);
  } catch (err) {
    res.status(400).json({
      message: "Failed to create tournament",
      error: (err as Error).message,
    });
  }
});

app.put("/api/tournaments/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, date, description, type } = req.body;

  try {
    const updatedTournament = await Tournament.findByIdAndUpdate(
      id,
      { name, date, description, type },
      { new: true }
    );
    if (!updatedTournament)
      return res.status(404).json({ message: "Tournament not found" });
    res.json(updatedTournament);
  } catch (err) {
    res.status(400).json({
      message: "Failed to update tournament",
      error: (err as Error).message,
    });
  }
});

app.delete("/api/tournaments/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await Tournament.findByIdAndDelete(id);
    if (!result)
      return res.status(404).json({ message: "Tournament not found" });
    res.json({ message: "Tournament deleted" });
  } catch (err) {
    res.status(400).json({
      message: "Failed to delete tournament",
      error: (err as Error).message,
    });
  }
});

// Serve static assets (for production)
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "..", "client/build")));

  app.get("*", (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, "..", "client/build", "index.html"));
  });
}

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
