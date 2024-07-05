import express, { Request, Response } from 'express';
import mongoose, { ConnectOptions } from 'mongoose';
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
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
} as ConnectOptions)
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));

// Define Mongoose Schema and Model
interface IItem extends mongoose.Document {
  name: string;
}

const ItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
});

const Item = mongoose.model<IItem>('Item', ItemSchema);

// API Routes
app.get('/api/items', async (req: Request, res: Response) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/items', async (req: Request, res: Response) => {
  const { name } = req.body;

  try {
    const newItem = new Item({ name });
    await newItem.save();
    res.json(newItem);
  } catch (err) {
    res.status(400).json({ message: 'Failed to create item' });
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
