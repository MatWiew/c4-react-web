import express, { Request, Response } from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";
import os from "os";

dotenv.config();

// Constants
const MAX_DB_SIZE_MB = 500;

const app = express();

// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_API_URL,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

const PORT = process.env.PORT || 5000;
const mongoURI = process.env.MONGODB_URI as string;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

async function checkDatabaseSize(): Promise<number> {
  if (mongoose.connection.readyState !== 1 || !mongoose.connection.db) {
    throw new Error("Database is not connected.");
  }

  const stats = await mongoose.connection.db.stats();
  const dataSizeMB = stats.dataSize / (1024 * 1024); // Convert bytes to megabytes
  return dataSizeMB;
}

// MongoDB Connection
mongoose
  .connect(mongoURI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Define Mongoose Schema and Model
interface IAdmin extends mongoose.Document {
  email: string;
  password: string;
  role: string;
  fullName: string;
  lastLogin: Date;
  failedLoginAttempts: number;
}

const AdminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["Superadmin", "Admin"], required: true },
  fullName: { type: String, required: true },
  lastLogin: { type: Date },
  failedLoginAttempts: { type: Number, default: 0 },
});

const Admin = mongoose.model<IAdmin>("Admin", AdminSchema, "AdminsData");

interface IArticle extends mongoose.Document {
  title: string;
  content: string;
  created_at: Date;
  updated_at: Date;
  image_url: string;
  isSecond?: boolean;
}

const ArticleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  image_url: { type: String, required: true },
  isSecond: { type: Boolean, default: false },
});

// Update the updated_at field before saving
ArticleSchema.pre("save", function (next) {
  this.updated_at = new Date();
  next();
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
  page: string;
  icon: "pawn" | "bishop" | "knight" | "queen" | "king" | "rook";
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
  icon: {
    type: String,
    enum: ["pawn", "bishop", "knight", "queen", "king", "rook"],
    required: true,
  },
});

interface ITopPlayer extends mongoose.Document {
  fullname: string;
  rating: number; // Use Number for storing ratings
}

// Define the TopPlayers schema
const TopPlayersSchema = new mongoose.Schema({
  fullname: { type: String, required: true },
  rating: { type: Number, required: true }, // Use Number type for ratings
});

const TopPlayers = mongoose.model<ITopPlayer>(
  "TopPlayers",
  TopPlayersSchema,
  "TopPlayers"
);

interface ITrainers extends mongoose.Document {
  fullname: string;
}

// Define the Trainers schema
const TrainersSchema = new mongoose.Schema({
  fullname: { type: String, required: true },
});

const Trainers = mongoose.model<ITrainers>(
  "Trainers",
  TrainersSchema,
  "Trainers"
);

//test
app.get("/api/test", (req: Request, res: Response) => {
  res.json({ message: "Test API is working!" });
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
    to: process.env.EMAIL_USER,
    subject: `Wiadomość od ${name} [strona internetowa c4]`,
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

// Define the Sponsors schema
interface ISponsor extends mongoose.Document {
  name: string;
  image_url: string;
}

// Create the Sponsor schema
const SponsorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image_url: { type: String, required: true },
});

// Create the Sponsor model with the correct collection name
const Sponsor = mongoose.model<ISponsor>("Sponsors", SponsorSchema, "Sponsors");

// Admin login route
app.post("/admin/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // Find admin by email
    const admin = await Admin.findOne({ email });

    // If admin not found
    if (!admin) {
      return res.status(401).json({ message: "Not Good: Admin not found" });
    }

    // Compare hashed password
    const isMatch = await bcrypt.compare(password, admin.password);

    // If password does not match
    if (!isMatch) {
      // Optionally: Increment failed login attempts
      admin.failedLoginAttempts += 1;
      await admin.save();

      return res.status(401).json({ message: "Not Good: Incorrect password" });
    }

    // Password matches: Update last login timestamp
    admin.lastLogin = new Date();
    admin.failedLoginAttempts = 0; // Reset failed login attempts
    await admin.save();

    // Login successful
    return res.status(200).json({
      message: "Good: Login successful",
      fullName: admin.fullName, // Include the full name in the response
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/admin/register", async (req: Request, res: Response) => {
  const { email, password, role, fullName } = req.body;

  // Ensure role value is validated correctly
  const validRoles = ["Superadmin", "Admin"];
  if (!validRoles.includes(role)) {
    return res.status(400).json({
      message: `Invalid role. Must be one of: ${validRoles.join(", ")}`,
    });
  }

  try {
    // Hash the password before saving it
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds
    const newAdmin = new Admin({
      email,
      password: hashedPassword,
      role,
      fullName,
    });

    await newAdmin.save();
    res.status(201).json({ message: "Admin created successfully" });
  } catch (err) {
    res.status(400).json({
      message: "Failed to create admin",
      error: (err as Error).message,
    });
  }
});

// Get all sponsors
app.get("/api/sponsors", async (req: Request, res: Response) => {
  try {
    const sponsors = await Sponsor.find(); // Fetch all sponsors from the database
    res.json(sponsors); // Send sponsors as JSON response
  } catch (error) {
    console.error("Error fetching sponsors:", error);
    res.status(500).json({
      message: "Failed to fetch sponsors",
      error: (error as Error).message,
    });
  }
});

// Add a sponsor
app.post("/api/sponsors", async (req: Request, res: Response) => {
  const { name, image_url } = req.body;

  if (!name || !image_url) {
    return res
      .status(400)
      .json({ message: "Name and image URL are required." });
  }

  try {
    const dbSizeMB = await checkDatabaseSize();

    // Check if adding the new sponsor exceeds the size limit
    if (dbSizeMB >= MAX_DB_SIZE_MB) {
      // Find and delete the oldest article
      const oldestArticle = await Article.findOne().sort({ created_at: 1 });
      if (oldestArticle) {
        await Article.findByIdAndDelete(oldestArticle._id);
      }
    }
    const newSponsor = new Sponsor({ name, image_url });
    await newSponsor.save();
    res
      .status(201)
      .json({ message: "Sponsor added successfully", sponsor: newSponsor });
  } catch (error) {
    console.error("Error adding sponsor:", error);
    res.status(500).json({
      message: "Failed to add sponsor",
      error: (error as Error).message,
    });
  }
});

// Delete a sponsor
app.delete("/api/sponsors/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await Sponsor.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).json({ message: "Sponsor not found" });
    }

    res.json({ message: "Sponsor deleted successfully" });
  } catch (error) {
    console.error("Error deleting sponsor:", error);
    res.status(500).json({
      message: "Failed to delete sponsor",
      error: (error as Error).message,
    });
  }
});

// API Routes for Articles
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

app.get("/api/articles/:id", async (req: Request, res: Response) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }
    res.json(article);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Server error", error: (err as Error).message });
  }
});

app.post("/api/articles", async (req: Request, res: Response) => {
  const { title, content, image_url, isSecond } = req.body;

  try {
    const dbSizeMB = await checkDatabaseSize();

    // Check if adding the new article exceeds the size limit
    if (dbSizeMB >= MAX_DB_SIZE_MB) {
      // Find and delete the oldest article
      const oldestArticle = await Article.findOne().sort({ created_at: 1 });
      if (oldestArticle) {
        await Article.findByIdAndDelete(oldestArticle._id);
      }
    }
    const newArticle = new Article({
      title,
      content,
      created_at: new Date(),
      updated_at: new Date(),
      image_url,
      isSecond: isSecond || false,
    });
    await newArticle.save();
    res.status(201).json(newArticle);
  } catch (err) {
    res.status(400).json({
      message: "Failed to create article",
      error: (err as Error).message,
    });
  }
});

app.put("/api/articles/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, content, author_id, image_url, isSecond } = req.body;

  try {
    const updatedArticle = await Article.findByIdAndUpdate(
      id,
      { title, content, author_id, image_url, isSecond },
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
    const { date } = req.query;

    // Check if date exists and is a string
    let tournaments;
    if (typeof date === "string") {
      const parsedDate = new Date(date);
      tournaments = await Tournament.find({
        date: {
          $gte: parsedDate,
          $lt: new Date(parsedDate.getTime() + 86400000), // Next day
        },
      });
    } else {
      tournaments = await Tournament.find();
    }

    res.json(tournaments);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Server error", error: (err as Error).message });
  }
});

app.post("/api/tournaments", async (req: Request, res: Response) => {
  console.log(req.body);
  const { name, date, type, round_number, place, page, icon } = req.body;

  try {
    const dbSizeMB = await checkDatabaseSize();

    // Check if adding the new tournament exceeds the size limit
    if (dbSizeMB >= MAX_DB_SIZE_MB) {
      // Find and delete the oldest article
      const oldestArticle = await Article.findOne().sort({ created_at: 1 });
      if (oldestArticle) {
        await Article.findByIdAndDelete(oldestArticle._id);
      }
    }
    // Check if a tournament already exists for the specified date
    const existingTournament = await Tournament.findOne({
      date: new Date(date),
    });

    if (existingTournament) {
      // If tournament exists, update it
      existingTournament.name = name;
      existingTournament.type = type;
      existingTournament.round_number = round_number;
      existingTournament.place = place;
      existingTournament.page = page;
      existingTournament.icon = icon;

      const updatedTournament = await existingTournament.save();
      return res.json({
        message: "Tournament updated successfully",
        tournament: updatedTournament,
      });
    } else {
      // If no tournament exists, create a new one
      const newTournament = new Tournament({
        name,
        date,
        type,
        round_number,
        place,
        page,
        icon,
      });
      await newTournament.save();
      return res.json({
        message: "Tournament created successfully",
        tournament: newTournament,
      });
    }
  } catch (err) {
    res.status(400).json({
      message: "Failed to create/update tournament",
      error: (err as Error).message,
    });
  }
});

app.put("/api/tournaments/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, date, description, type, icon } = req.body;

  try {
    const updatedTournament = await Tournament.findByIdAndUpdate(
      id,
      { name, date, description, type, icon },
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

//topplayers endpoints
app.get("/api/topplayers", async (req, res) => {
  try {
    const players = await TopPlayers.find().sort({ rating: -1 }); // Sort by rating in descending order
    res.json(players);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Server error while fetching top players" });
  }
});

app.post("/api/topplayers", async (req: Request, res: Response) => {
  const { fullname, rating } = req.body;

  if (!fullname || rating === undefined) {
    return res
      .status(400)
      .json({ message: "Full name and rating are required." });
  }

  try {
    const dbSizeMB = await checkDatabaseSize();

    // Check if adding the new player exceeds the size limit
    if (dbSizeMB >= MAX_DB_SIZE_MB) {
      // Find and delete the oldest article
      const oldestArticle = await Article.findOne().sort({ created_at: 1 });
      if (oldestArticle) {
        await Article.findByIdAndDelete(oldestArticle._id);
      }
    }
    const newPlayer = new TopPlayers({ fullname, rating });
    await newPlayer.save();
    res
      .status(201)
      .json({ message: "Top player added successfully", player: newPlayer });
  } catch (error) {
    console.error("Error adding top player:", error);
    res.status(500).json({
      message: "Failed to add top player",
      error: (error as Error).message,
    });
  }
});

app.put("/api/topplayers/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { fullname, rating } = req.body;

  if (!fullname || rating === undefined) {
    return res
      .status(400)
      .json({ message: "Full name and rating are required." });
  }

  try {
    const updatedPlayer = await TopPlayers.findByIdAndUpdate(
      id,
      { fullname, rating },
      { new: true }
    );

    if (!updatedPlayer) {
      return res.status(404).json({ message: "Player not found" });
    }

    res.json({ message: "Player updated successfully", player: updatedPlayer });
  } catch (error) {
    console.error("Error updating player:", error);
    res.status(500).json({
      message: "Failed to update player",
      error: (error as Error).message,
    });
  }
});

app.delete("/api/topplayers/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  console.log("Deleting player with ID:", id);

  try {
    const result = await TopPlayers.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).json({ message: "Player not found" });
    }

    res.json({ message: "Player deleted successfully" });
  } catch (error) {
    console.error("Error deleting player:", error);
    res.status(500).json({
      message: "Failed to delete player",
      error: (error as Error).message,
    });
  }
});

//trainers endpoint
app.get("/api/trainers", async (req, res) => {
  try {
    const trainers = await Trainers.find();
    res.json(trainers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while fetching trainers" });
  }
});

app.post("/api/trainers", async (req: Request, res: Response) => {
  const { fullname } = req.body;

  if (!fullname) {
    return res.status(400).json({ message: "Full name is required." });
  }

  try {
    const dbSizeMB = await checkDatabaseSize();

    // Check if adding the new trainer exceeds the size limit
    if (dbSizeMB >= MAX_DB_SIZE_MB) {
      // Find and delete the oldest article
      const oldestArticle = await Article.findOne().sort({ created_at: 1 });
      if (oldestArticle) {
        await Article.findByIdAndDelete(oldestArticle._id);
      }
    }
    const newTrainer = new Trainers({ fullname });
    await newTrainer.save();
    res
      .status(201)
      .json({ message: "Trainer added successfully", trainer: newTrainer });
  } catch (error) {
    console.error("Error adding trainer:", error);
    res.status(500).json({
      message: "Failed to add trainer",
      error: (error as Error).message,
    });
  }
});

app.put("/api/trainers/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { fullname } = req.body;

  if (!fullname) {
    return res.status(400).json({ message: "Full name is required." });
  }

  try {
    const updatedTrainer = await Trainers.findByIdAndUpdate(
      id,
      { fullname },
      { new: true }
    );

    if (!updatedTrainer) {
      return res.status(404).json({ message: "Trainer not found" });
    }

    res.json({
      message: "Trainer updated successfully",
      trainer: updatedTrainer,
    });
  } catch (error) {
    console.error("Error updating trainer:", error);
    res.status(500).json({
      message: "Failed to update trainer",
      error: (error as Error).message,
    });
  }
});

app.delete("/api/trainers/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  console.log("Deleting trainer with ID:", id);
  try {
    const result = await Trainers.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({ message: "Trainer not found" });
    }
    res.json({ message: "Trainer deleted successfully" });
  } catch (error) {
    console.error("Error deleting trainer:", error);
    res.status(500).json({
      message: "Failed to delete trainer",
      error: (error as Error).message,
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
  console.log(`Server is running on http://0.0.0.0:${PORT}`);
});
