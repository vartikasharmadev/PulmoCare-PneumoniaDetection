import mongoose, { Schema, type Document } from 'mongoose';

export type PredictionLabel = 'NORMAL' | 'PNEUMONIA';

export interface PredictionDocument extends Document {
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  prediction: PredictionLabel;
  confidence: number;
  createdAt: Date;
}

const predictionSchema = new Schema<PredictionDocument>(
  {
    fileName: { type: String, required: true },
    mimeType: { type: String, required: true },
    sizeBytes: { type: Number, required: true },
    prediction: { type: String, enum: ['NORMAL', 'PNEUMONIA'], required: true },
    confidence: { type: Number, required: true },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  },
);

export const Prediction =
  mongoose.models.Prediction ||
  mongoose.model<PredictionDocument>('Prediction', predictionSchema);

