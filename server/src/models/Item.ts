import mongoose, { Document, Schema } from 'mongoose';

interface IItem extends Document {
    name: string;
}

const ItemSchema: Schema = new Schema({
    name: { type: String, required: true }
});

export default mongoose.model<IItem>('Item', ItemSchema);
