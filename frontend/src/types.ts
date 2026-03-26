export type PredictionLabel = 'NORMAL' | 'PNEUMONIA';

export interface Prediction {
  prediction: PredictionLabel;
  confidence: number;
}

export interface StoredPrediction extends Prediction {
  _id: string;
  fileName: string;
  createdAt: string;
}

export type PanelTab = 'analyze' | 'guidelines' | 'insights';
