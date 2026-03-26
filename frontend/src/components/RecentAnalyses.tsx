import { Clock, History } from 'lucide-react';
import { Card } from './Card';
import type { StoredPrediction } from '../types';

interface RecentAnalysesProps {
  items: StoredPrediction[];
  onRefresh: () => void;
}

export function RecentAnalyses({ items, onRefresh }: RecentAnalysesProps) {
  return (
    <Card className="bg-white/80 border-clinical-200/80">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-clinical-600" />
          <h3 className="text-sm font-semibold text-slate-900">Recent analyses</h3>
        </div>
        <button
          type="button"
          onClick={onRefresh}
          className="text-xs font-medium text-surgical-600 hover:text-surgical-700"
        >
          Refresh
        </button>
      </div>

      <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1">
        {items.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-6">
            No saved runs yet. Analyze an image to populate history.
          </p>
        ) : (
          items.map((item) => (
            <div
              key={item._id}
              className="flex items-center justify-between rounded-xl border border-clinical-100 px-3 py-2.5 text-sm hover:bg-clinical-50/50 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                    item.prediction === 'PNEUMONIA'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {item.prediction === 'PNEUMONIA' ? 'P+' : 'OK'}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-slate-900 font-medium">
                    {item.fileName}
                  </p>
                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3 shrink-0" />
                    {new Date(item.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p
                  className={`text-xs font-semibold ${
                    item.prediction === 'PNEUMONIA'
                      ? 'text-amber-700'
                      : 'text-emerald-700'
                  }`}
                >
                  {item.prediction}
                </p>
                <p className="text-[11px] text-slate-500 tabular-nums">
                  {(item.confidence * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
