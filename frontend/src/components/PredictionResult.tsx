import { AlertTriangle, CheckCircle2, RefreshCw } from 'lucide-react';
import { Card } from './Card';
import { Button } from './Button';
import type { Prediction } from '../types';

interface PredictionResultProps {
  result: Prediction;
  onClear: () => void;
}

export function PredictionResult({ result, onClear }: PredictionResultProps) {
  const isPneumonia = result.prediction === 'PNEUMONIA';
  const pct = result.confidence * 100;

  return (
    <Card className="border-clinical-200 bg-white/95">
      <div className="text-center py-4 space-y-4">
        <div
          className={`w-20 h-20 mx-auto rounded-2xl flex items-center justify-center ${
            isPneumonia
              ? 'bg-amber-100 text-amber-700'
              : 'bg-emerald-100 text-emerald-700'
          }`}
        >
          {isPneumonia ? (
            <AlertTriangle className="w-10 h-10" />
          ) : (
            <CheckCircle2 className="w-10 h-10" />
          )}
        </div>

        <div>
          <h2 className="text-2xl font-bold text-slate-900 border-b border-clinical-100 pb-2 mb-2 inline-block">
            {result.prediction}
          </h2>
          <p className="text-slate-600 font-medium">
            Confidence:{' '}
            <span className="text-slate-900 tabular-nums">{pct.toFixed(1)}%</span>
          </p>
        </div>

        <div className="text-left max-w-xs mx-auto space-y-2">
          <div className="flex justify-between text-xs font-medium text-slate-500">
            <span>Confidence</span>
            <span className="text-clinical-700 tabular-nums">
              {pct.toFixed(0)}%
            </span>
          </div>
          <div className="h-2.5 rounded-full bg-clinical-100 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ease-out ${
                isPneumonia
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500'
                  : 'bg-gradient-to-r from-clinical-500 to-emerald-500'
              }`}
              style={{ width: `${Math.min(100, pct)}%` }}
            />
          </div>
          {result.confidence < 0.6 && (
            <p className="text-xs text-amber-700 font-semibold text-center">
              Low confidence — consider additional imaging or review.
            </p>
          )}
        </div>

        <p
          className={`text-sm px-4 py-3 rounded-xl inline-block ${
            isPneumonia
              ? 'bg-amber-50 text-amber-900 border border-amber-100'
              : 'bg-emerald-50 text-emerald-900 border border-emerald-100'
          }`}
        >
          {isPneumonia
            ? 'Correlate clinically and follow institutional protocols.'
            : 'No pneumonia pattern detected by this model.'}
        </p>

        <div className="pt-2 border-t border-clinical-100">
          <Button
            variant="outline"
            size="sm"
            type="button"
            onClick={onClear}
            className="w-full"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            New image
          </Button>
        </div>
      </div>
    </Card>
  );
}
