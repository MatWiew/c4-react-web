import express, { Request, Response } from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";

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
  author_id: string;
  created_at: Date;
  updated_at: Date;
  image_url: string;
}

const ArticleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author_id: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  image_url: { type: String, required: true },
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

interface ITopPlayer extends mongoose.Document {
  fullname: string;
  rating: number; // Use Number for storing ratings
}

// Define the TopPlayers schema
const TopPlayersSchema = new mongoose.Schema({
  fullname: { type: String, required: true },
  rating: { type: Number, required: true } // Use Number type for ratings
});

const TopPlayers = mongoose.model<ITopPlayer>("TopPlayers", TopPlayersSchema, "TopPlayers");

interface ITrainers extends mongoose.Document {
  fullname: string;
}

// Define the Trainers schema
const TrainersSchema = new mongoose.Schema({
  fullname: { type: String, required: true },
});

const Trainers = mongoose.model<ITrainers>("Trainers", TrainersSchema, "Trainers");


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

app.post("/api/articles", async (req: Request, res: Response) => {
  const { title, content, author_id, image_url } = req.body;

  try {
    const newArticle = new Article({
      title,
      content,
      author_id,
      created_at: new Date(),
      updated_at: new Date(),
      image_url,
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
  const { title, content, author_id, image_url } = req.body;

  try {
    const updatedArticle = await Article.findByIdAndUpdate(
      id,
      { title, content, author_id, image_url },
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
    if (typeof date === 'string') {
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
    res.status(500).json({ message: "Server error", error: (err as Error).message });
  }
});


app.post("/api/tournaments", async (req: Request, res: Response) => {
  console.log(req.body);
  const { name, date, type, round_number, place, page } = req.body;

  try {
    // Check if a tournament already exists for the specified date
    const existingTournament = await Tournament.findOne({ date: new Date(date) });

    if (existingTournament) {
      // If tournament exists, update it
      existingTournament.name = name;
      existingTournament.type = type;
      existingTournament.round_number = round_number;
      existingTournament.place = place;
      existingTournament.page = page;

      const updatedTournament = await existingTournament.save();
      return res.json({ message: "Tournament updated successfully", tournament: updatedTournament });
    } else {
      // If no tournament exists, create a new one
      const newTournament = new Tournament({
        name,
        date,
        type,
        round_number,
        place,
        page,
      });
      await newTournament.save();
      return res.json({ message: "Tournament created successfully", tournament: newTournament });
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

//topplayers endpoints
app.get('/api/topplayers', async (req, res) => {
  try {
    const players = await TopPlayers.find().sort({ rating: -1 }); // Sort by rating in descending order
    res.json(players);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while fetching top players' });
  }
});

app.post('/api/topplayers', async (req: Request, res: Response) => {
  const { fullname, rating } = req.body;

  if (!fullname || rating === undefined) {
    return res.status(400).json({ message: "Full name and rating are required." });
  }

  try {
    const newPlayer = new TopPlayers({ fullname, rating });
    await newPlayer.save();
    res.status(201).json({ message: "Top player added successfully", player: newPlayer });
  } catch (error) {
    console.error("Error adding top player:", error);
    res.status(500).json({ message: 'Failed to add top player', error: (error as Error).message });
  }
});

app.put('/api/topplayers/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { fullname, rating } = req.body;

  if (!fullname || rating === undefined) {
    return res.status(400).json({ message: "Full name and rating are required." });
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
    res.status(500).json({ message: 'Failed to update player', error: (error as Error).message });
  }
});

app.delete('/api/topplayers/:id', async (req: Request, res: Response) => {
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
    res.status(500).json({ message: 'Failed to delete player', error: (error as Error).message });
  }
});

//trainers endpoint
app.get('/api/trainers', async (req, res) => {
  try {
    const trainers = await Trainers.find();
    res.json(trainers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while fetching trainers' });
  }
});

app.post('/api/trainers', async (req: Request, res: Response) => {
  const { fullname } = req.body;

  if (!fullname) {
    return res.status(400).json({ message: "Full name is required." });
  }

  try {
    const newTrainer = new Trainers({ fullname });
    await newTrainer.save();
    res.status(201).json({ message: "Trainer added successfully", trainer: newTrainer });
  } catch (error) {
    console.error("Error adding trainer:", error);
    res.status(500).json({ message: 'Failed to add trainer', error: (error as Error).message });
  }
});

app.put('/api/trainers/:id', async (req: Request, res: Response) => {
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

    res.json({ message: "Trainer updated successfully", trainer: updatedTrainer });
  } catch (error) {
    console.error("Error updating trainer:", error);
    res.status(500).json({ message: 'Failed to update trainer', error: (error as Error).message });
  }
});

app.delete('/api/trainers/:id', async (req: Request, res: Response) => {
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
    res.status(500).json({ message: 'Failed to delete trainer', error: (error as Error).message });
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
