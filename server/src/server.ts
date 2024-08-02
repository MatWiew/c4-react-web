import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const mongoURI = process.env.MONGODB_URI as string;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

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
  image_url: { type: String, required: true }
});

// Use the correct collection name
const Article = mongoose.model<IArticle>('Article', ArticleSchema, 'Text&Metadata');

interface ITournament extends mongoose.Document {
  name: string;
  date: Date;
  description: string;
  type: 'blitz' | 'rapid' | 'classical' | 'bullet';
}

// Define the Tournament schema
const TournamentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  date: { type: Date, required: true },
  description: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['blitz', 'rapid', 'classical', 'bullet'], 
    required: true 
  }
});

// Create the Tournament model with the specified collection name
const Tournament = mongoose.model<ITournament>('Tournament', TournamentSchema, 'TournamentsData');

// API Routes
app.get('/api/articles', async (req: Request, res: Response) => {
  try {
    const articles = await Article.find();
    res.json(articles);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: (err as Error).message });
  }
});

app.post('/api/articles', async (req: Request, res: Response) => {
  const { title, content, author_id } = req.body;

  try {
    const newArticle = new Article({ title, content, author_id });
    await newArticle.save();
    res.json(newArticle);
  } catch (err) {
    res.status(400).json({ message: 'Failed to create article', error: (err as Error).message });
  }
});

app.put('/api/articles/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, content, author_id } = req.body;

  try {
    const updatedArticle = await Article.findByIdAndUpdate(
      id,
      { title, content, author_id, updated_at: new Date() },
      { new: true }
    );
    if (!updatedArticle) return res.status(404).json({ message: 'Article not found' });
    res.json(updatedArticle);
  } catch (err) {
    res.status(400).json({ message: 'Failed to update article', error: (err as Error).message });
  }
});

app.delete('/api/articles/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await Article.findByIdAndDelete(id);
    if (!result) return res.status(404).json({ message: 'Article not found' });
    res.json({ message: 'Article deleted' });
  } catch (err) {
    res.status(400).json({ message: 'Failed to delete article', error: (err as Error).message });
  }
});

// Serve static assets (for production)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '..', 'client/build')));

  app.get('*', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '..', 'client/build', 'index.html'));
  });
}

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
