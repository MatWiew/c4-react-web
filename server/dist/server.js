"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const bcrypt_1 = __importDefault(require("bcrypt"));
dotenv_1.default.config();
// Constants
const MAX_DB_SIZE_MB = 500;
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
const mongoURI = process.env.MONGODB_URI;
function checkDatabaseSize() {
    return __awaiter(this, void 0, void 0, function* () {
        const stats = yield mongoose_1.default.connection.db.stats();
        const dataSizeMB = stats.dataSize / (1024 * 1024); // Convert bytes to megabytes
        return dataSizeMB;
    });
}
// Middleware
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
// MongoDB Connection
mongoose_1.default
    .connect(mongoURI)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error("MongoDB connection error:", err));
const AdminSchema = new mongoose_1.default.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["Superadmin", "Admin"], required: true },
    fullName: { type: String, required: true },
    lastLogin: { type: Date },
    failedLoginAttempts: { type: Number, default: 0 },
});
const Admin = mongoose_1.default.model("Admin", AdminSchema, "AdminsData");
const ArticleSchema = new mongoose_1.default.Schema({
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
const Article = mongoose_1.default.model("Article", ArticleSchema, "NewsText&Metadata");
// Define the Tournament schema
const TournamentSchema = new mongoose_1.default.Schema({
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
// Define the TopPlayers schema
const TopPlayersSchema = new mongoose_1.default.Schema({
    fullname: { type: String, required: true },
    rating: { type: Number, required: true }, // Use Number type for ratings
});
const TopPlayers = mongoose_1.default.model("TopPlayers", TopPlayersSchema, "TopPlayers");
// Define the Trainers schema
const TrainersSchema = new mongoose_1.default.Schema({
    fullname: { type: String, required: true },
});
const Trainers = mongoose_1.default.model("Trainers", TrainersSchema, "Trainers");
// Email sending endpoint
app.post("/api/send-email", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, message } = req.body;
    // Create a transporter
    const transporter = nodemailer_1.default.createTransport({
        service: "gmail", // Use 'gmail' or any other service
        auth: {
            user: process.env.EMAIL_USER, // Your email address (from your env file)
            pass: process.env.EMAIL_PASS, // Your application-specific password
        },
    });
    // Email options
    const mailOptions = {
        from: email,
        to: "Paweljakubvalmet@gmail.com",
        subject: `Wiadomość od ${name}`,
        text: `Imię: ${name},\nAdres mailowy: ${email},\n\nWiadomość: ${message}`,
    };
    // Send email
    try {
        yield transporter.sendMail(mailOptions);
        res.status(200).json({ message: "Email sent successfully" });
    }
    catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ message: "Error sending email" });
    }
}));
// Create the Tournament model with the specified collection name
const Tournament = mongoose_1.default.model("Tournament", TournamentSchema, "TournamentsData");
// Create the Sponsor schema
const SponsorSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    image_url: { type: String, required: true },
});
// Create the Sponsor model with the correct collection name
const Sponsor = mongoose_1.default.model("Sponsors", SponsorSchema, "Sponsors");
// Admin login route
app.post("/admin/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        // Find admin by email
        const admin = yield Admin.findOne({ email });
        // If admin not found
        if (!admin) {
            return res.status(401).json({ message: "Not Good: Admin not found" });
        }
        // Compare hashed password
        const isMatch = yield bcrypt_1.default.compare(password, admin.password);
        // If password does not match
        if (!isMatch) {
            // Optionally: Increment failed login attempts
            admin.failedLoginAttempts += 1;
            yield admin.save();
            return res.status(401).json({ message: "Not Good: Incorrect password" });
        }
        // Password matches: Update last login timestamp
        admin.lastLogin = new Date();
        admin.failedLoginAttempts = 0; // Reset failed login attempts
        yield admin.save();
        // Login successful
        return res.status(200).json({
            message: "Good: Login successful",
            fullName: admin.fullName, // Include the full name in the response
        });
    }
    catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Server error" });
    }
}));
app.post("/admin/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const hashedPassword = yield bcrypt_1.default.hash(password, 10); // 10 is the salt rounds
        const newAdmin = new Admin({
            email,
            password: hashedPassword,
            role,
            fullName,
        });
        yield newAdmin.save();
        res.status(201).json({ message: "Admin created successfully" });
    }
    catch (err) {
        res.status(400).json({
            message: "Failed to create admin",
            error: err.message,
        });
    }
}));
// Get all sponsors
app.get("/api/sponsors", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sponsors = yield Sponsor.find(); // Fetch all sponsors from the database
        res.json(sponsors); // Send sponsors as JSON response
    }
    catch (error) {
        console.error("Error fetching sponsors:", error);
        res.status(500).json({
            message: "Failed to fetch sponsors",
            error: error.message,
        });
    }
}));
// Add a sponsor
app.post("/api/sponsors", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, image_url } = req.body;
    if (!name || !image_url) {
        return res
            .status(400)
            .json({ message: "Name and image URL are required." });
    }
    try {
        const dbSizeMB = yield checkDatabaseSize();
        // Check if adding the new sponsor exceeds the size limit
        if (dbSizeMB >= MAX_DB_SIZE_MB) {
            // Find and delete the oldest article
            const oldestArticle = yield Article.findOne().sort({ created_at: 1 });
            if (oldestArticle) {
                yield Article.findByIdAndDelete(oldestArticle._id);
            }
        }
        const newSponsor = new Sponsor({ name, image_url });
        yield newSponsor.save();
        res
            .status(201)
            .json({ message: "Sponsor added successfully", sponsor: newSponsor });
    }
    catch (error) {
        console.error("Error adding sponsor:", error);
        res.status(500).json({
            message: "Failed to add sponsor",
            error: error.message,
        });
    }
}));
// Delete a sponsor
app.delete("/api/sponsors/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const result = yield Sponsor.findByIdAndDelete(id);
        if (!result) {
            return res.status(404).json({ message: "Sponsor not found" });
        }
        res.json({ message: "Sponsor deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting sponsor:", error);
        res.status(500).json({
            message: "Failed to delete sponsor",
            error: error.message,
        });
    }
}));
// API Routes for Articles
app.get("/api/articles", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const articles = yield Article.find();
        res.json(articles);
    }
    catch (err) {
        res
            .status(500)
            .json({ message: "Server error", error: err.message });
    }
}));
app.post("/api/articles", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, content, image_url, isSecond } = req.body;
    try {
        const dbSizeMB = yield checkDatabaseSize();
        // Check if adding the new article exceeds the size limit
        if (dbSizeMB >= MAX_DB_SIZE_MB) {
            // Find and delete the oldest article
            const oldestArticle = yield Article.findOne().sort({ created_at: 1 });
            if (oldestArticle) {
                yield Article.findByIdAndDelete(oldestArticle._id);
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
        yield newArticle.save();
        res.status(201).json(newArticle);
    }
    catch (err) {
        res.status(400).json({
            message: "Failed to create article",
            error: err.message,
        });
    }
}));
app.put("/api/articles/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { title, content, author_id, image_url, isSecond } = req.body;
    try {
        const updatedArticle = yield Article.findByIdAndUpdate(id, { title, content, author_id, image_url, isSecond }, { new: true });
        if (!updatedArticle)
            return res.status(404).json({ message: "Article not found" });
        res.json(updatedArticle);
    }
    catch (err) {
        res.status(400).json({
            message: "Failed to update article",
            error: err.message,
        });
    }
}));
app.delete("/api/articles/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const result = yield Article.findByIdAndDelete(id);
        if (!result)
            return res.status(404).json({ message: "Article not found" });
        res.json({ message: "Article deleted" });
    }
    catch (err) {
        res.status(400).json({
            message: "Failed to delete article",
            error: err.message,
        });
    }
}));
// API Routes for Tournaments
app.get("/api/tournaments", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { date } = req.query;
        // Check if date exists and is a string
        let tournaments;
        if (typeof date === "string") {
            const parsedDate = new Date(date);
            tournaments = yield Tournament.find({
                date: {
                    $gte: parsedDate,
                    $lt: new Date(parsedDate.getTime() + 86400000), // Next day
                },
            });
        }
        else {
            tournaments = yield Tournament.find();
        }
        res.json(tournaments);
    }
    catch (err) {
        res
            .status(500)
            .json({ message: "Server error", error: err.message });
    }
}));
app.post("/api/tournaments", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    const { name, date, type, round_number, place, page, icon } = req.body;
    try {
        const dbSizeMB = yield checkDatabaseSize();
        // Check if adding the new tournament exceeds the size limit
        if (dbSizeMB >= MAX_DB_SIZE_MB) {
            // Find and delete the oldest article
            const oldestArticle = yield Article.findOne().sort({ created_at: 1 });
            if (oldestArticle) {
                yield Article.findByIdAndDelete(oldestArticle._id);
            }
        }
        // Check if a tournament already exists for the specified date
        const existingTournament = yield Tournament.findOne({
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
            const updatedTournament = yield existingTournament.save();
            return res.json({
                message: "Tournament updated successfully",
                tournament: updatedTournament,
            });
        }
        else {
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
            yield newTournament.save();
            return res.json({
                message: "Tournament created successfully",
                tournament: newTournament,
            });
        }
    }
    catch (err) {
        res.status(400).json({
            message: "Failed to create/update tournament",
            error: err.message,
        });
    }
}));
app.put("/api/tournaments/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { name, date, description, type, icon } = req.body;
    try {
        const updatedTournament = yield Tournament.findByIdAndUpdate(id, { name, date, description, type, icon }, { new: true });
        if (!updatedTournament)
            return res.status(404).json({ message: "Tournament not found" });
        res.json(updatedTournament);
    }
    catch (err) {
        res.status(400).json({
            message: "Failed to update tournament",
            error: err.message,
        });
    }
}));
app.delete("/api/tournaments/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const result = yield Tournament.findByIdAndDelete(id);
        if (!result)
            return res.status(404).json({ message: "Tournament not found" });
        res.json({ message: "Tournament deleted" });
    }
    catch (err) {
        res.status(400).json({
            message: "Failed to delete tournament",
            error: err.message,
        });
    }
}));
//topplayers endpoints
app.get("/api/topplayers", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const players = yield TopPlayers.find().sort({ rating: -1 }); // Sort by rating in descending order
        res.json(players);
    }
    catch (error) {
        console.error(error);
        res
            .status(500)
            .json({ message: "Server error while fetching top players" });
    }
}));
app.post("/api/topplayers", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { fullname, rating } = req.body;
    if (!fullname || rating === undefined) {
        return res
            .status(400)
            .json({ message: "Full name and rating are required." });
    }
    try {
        const dbSizeMB = yield checkDatabaseSize();
        // Check if adding the new player exceeds the size limit
        if (dbSizeMB >= MAX_DB_SIZE_MB) {
            // Find and delete the oldest article
            const oldestArticle = yield Article.findOne().sort({ created_at: 1 });
            if (oldestArticle) {
                yield Article.findByIdAndDelete(oldestArticle._id);
            }
        }
        const newPlayer = new TopPlayers({ fullname, rating });
        yield newPlayer.save();
        res
            .status(201)
            .json({ message: "Top player added successfully", player: newPlayer });
    }
    catch (error) {
        console.error("Error adding top player:", error);
        res.status(500).json({
            message: "Failed to add top player",
            error: error.message,
        });
    }
}));
app.put("/api/topplayers/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { fullname, rating } = req.body;
    if (!fullname || rating === undefined) {
        return res
            .status(400)
            .json({ message: "Full name and rating are required." });
    }
    try {
        const updatedPlayer = yield TopPlayers.findByIdAndUpdate(id, { fullname, rating }, { new: true });
        if (!updatedPlayer) {
            return res.status(404).json({ message: "Player not found" });
        }
        res.json({ message: "Player updated successfully", player: updatedPlayer });
    }
    catch (error) {
        console.error("Error updating player:", error);
        res.status(500).json({
            message: "Failed to update player",
            error: error.message,
        });
    }
}));
app.delete("/api/topplayers/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    console.log("Deleting player with ID:", id);
    try {
        const result = yield TopPlayers.findByIdAndDelete(id);
        if (!result) {
            return res.status(404).json({ message: "Player not found" });
        }
        res.json({ message: "Player deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting player:", error);
        res.status(500).json({
            message: "Failed to delete player",
            error: error.message,
        });
    }
}));
//trainers endpoint
app.get("/api/trainers", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const trainers = yield Trainers.find();
        res.json(trainers);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error while fetching trainers" });
    }
}));
app.post("/api/trainers", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { fullname } = req.body;
    if (!fullname) {
        return res.status(400).json({ message: "Full name is required." });
    }
    try {
        const dbSizeMB = yield checkDatabaseSize();
        // Check if adding the new trainer exceeds the size limit
        if (dbSizeMB >= MAX_DB_SIZE_MB) {
            // Find and delete the oldest article
            const oldestArticle = yield Article.findOne().sort({ created_at: 1 });
            if (oldestArticle) {
                yield Article.findByIdAndDelete(oldestArticle._id);
            }
        }
        const newTrainer = new Trainers({ fullname });
        yield newTrainer.save();
        res
            .status(201)
            .json({ message: "Trainer added successfully", trainer: newTrainer });
    }
    catch (error) {
        console.error("Error adding trainer:", error);
        res.status(500).json({
            message: "Failed to add trainer",
            error: error.message,
        });
    }
}));
app.put("/api/trainers/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { fullname } = req.body;
    if (!fullname) {
        return res.status(400).json({ message: "Full name is required." });
    }
    try {
        const updatedTrainer = yield Trainers.findByIdAndUpdate(id, { fullname }, { new: true });
        if (!updatedTrainer) {
            return res.status(404).json({ message: "Trainer not found" });
        }
        res.json({
            message: "Trainer updated successfully",
            trainer: updatedTrainer,
        });
    }
    catch (error) {
        console.error("Error updating trainer:", error);
        res.status(500).json({
            message: "Failed to update trainer",
            error: error.message,
        });
    }
}));
app.delete("/api/trainers/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    console.log("Deleting trainer with ID:", id);
    try {
        const result = yield Trainers.findByIdAndDelete(id);
        if (!result) {
            return res.status(404).json({ message: "Trainer not found" });
        }
        res.json({ message: "Trainer deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting trainer:", error);
        res.status(500).json({
            message: "Failed to delete trainer",
            error: error.message,
        });
    }
}));
// Serve static assets (for production)
if (process.env.NODE_ENV === "production") {
    app.use(express_1.default.static(path_1.default.join(__dirname, "..", "client/build")));
    app.get("*", (req, res) => {
        res.sendFile(path_1.default.join(__dirname, "..", "client/build", "index.html"));
    });
}
// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
