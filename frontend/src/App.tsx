import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  BookOpen,
  ChevronRight,
  Info,
  Shield,
  Stethoscope,
} from 'lucide-react';
import { getApiBaseUrl, getRecentPredictions, postPredict } from './api/predictions';
import type { PanelTab, Prediction, StoredPrediction } from './types';
import { Navbar } from './components/Navbar';
import { Card } from './components/Card';
import { FileUploader } from './components/FileUploader';
import { Button } from './components/Button';
import { PredictionResult } from './components/PredictionResult';
import { RecentAnalyses } from './components/RecentAnalyses';

const TABS: { id: PanelTab; label: string; icon: typeof Activity }[] = [
  { id: 'analyze', label: 'Analyze', icon: Stethoscope },
  { id: 'guidelines', label: 'Guidelines', icon: BookOpen },
  { id: 'insights', label: 'Session', icon: Activity },
];

const GUIDELINES = [
  'Use frontal chest radiographs in standard clinical formats.',
  'Ensure PHI is handled according to your institution’s policy.',
  'If the model flags pneumonia or confidence is low, seek clinical follow-up.',
] as const;

function App() {
  const apiBase = useMemo(() => getApiBaseUrl(), []);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Prediction | null>(null);
  const [recent, setRecent] = useState<StoredPrediction[]>([]);
  const [panelTab, setPanelTab] = useState<PanelTab>('analyze');

  const stats = useMemo(() => {
    const pneumonia = recent.filter((r) => r.prediction === 'PNEUMONIA').length;
    const normal = recent.filter((r) => r.prediction === 'NORMAL').length;
    const total = recent.length;
    return {
      pneumonia,
      normal,
      total,
      pneumoniaPct: total ? Math.round((pneumonia / total) * 100) : 0,
    };
  }, [recent]);

  const refreshRecent = useCallback(() => {
    void getRecentPredictions(apiBase).then((data) => {
      if (data) setRecent(data);
    });
  }, [apiBase]);

  useEffect(() => {
    refreshRecent();
  }, [refreshRecent]);

  const handleFileSelect = (selected: File) => {
    setFile(selected);
    setError(null);
    setResult(null);
    setPanelTab('analyze');
  };

  const handleClear = () => {
    setFile(null);
    setResult(null);
    setError(null);
  };

  const analyzeImage = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const data = await postPredict(apiBase, file);
      setResult(data);
      refreshRecent();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-clinical-50/70 to-surgical-100/60 text-slate-900 font-sans selection:bg-clinical-200/80 selection:text-clinical-900">
      <Navbar />

      <main className="container mx-auto px-4 sm:px-6 pt-28 pb-16">
        <div className="max-w-5xl mx-auto space-y-10">
          <header className="text-center space-y-5 animate-fade-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 border border-clinical-200/80 text-clinical-800 text-sm font-medium shadow-sm shadow-clinical-900/5">
              <Shield className="w-4 h-4 text-surgical-600" />
              Federated learning · Chest X-ray screening
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-slate-900">
              Hospital-grade
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-clinical-600 via-teal-600 to-surgical-600">
                pneumonia screening
              </span>
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Upload a chest X-ray for a model-assisted read. Recent results are
              stored by your backend — always confirm with a clinician.
            </p>
          </header>

          <div
            className="flex flex-wrap justify-center gap-2 p-1.5 rounded-2xl bg-white/70 border border-clinical-200/60 shadow-inner max-w-md mx-auto"
            role="tablist"
            aria-label="Main sections"
          >
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={panelTab === id}
                onClick={() => setPanelTab(id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  panelTab === id
                    ? 'bg-gradient-to-r from-clinical-600 to-teal-600 text-white shadow-md shadow-clinical-600/25'
                    : 'text-slate-600 hover:bg-clinical-50 hover:text-clinical-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>

          {panelTab === 'guidelines' && (
            <Card className="animate-fade-up">
              <div className="space-y-4 text-slate-700">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-surgical-600 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">
                      Intended use
                    </h3>
                    <p className="text-sm leading-relaxed">
                      This tool supports research and education. It is not a
                      substitute for professional medical diagnosis or treatment.
                    </p>
                  </div>
                </div>
                <ul className="space-y-2 text-sm border-t border-clinical-100 pt-4">
                  {GUIDELINES.map((line) => (
                    <li key={line} className="flex gap-2">
                      <ChevronRight className="w-4 h-4 text-clinical-500 shrink-0 mt-0.5" />
                      {line}
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          )}

          {panelTab === 'insights' && (
            <div className="grid sm:grid-cols-3 gap-4 animate-fade-up">
              <Card className="text-center">
                <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold">
                  Session samples
                </p>
                <p className="text-3xl font-bold text-clinical-700 mt-1">
                  {stats.total}
                </p>
                <p className="text-xs text-slate-500 mt-1">in recent history</p>
              </Card>
              <Card className="text-center">
                <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold">
                  Normal reads
                </p>
                <p className="text-3xl font-bold text-emerald-700 mt-1">
                  {stats.normal}
                </p>
                <p className="text-xs text-slate-500 mt-1">latest batch</p>
              </Card>
              <Card className="text-center">
                <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold">
                  Pneumonia flagged
                </p>
                <p className="text-3xl font-bold text-amber-700 mt-1">
                  {stats.pneumonia}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {stats.total ? `${stats.pneumoniaPct}% of batch` : '—'}
                </p>
              </Card>
            </div>
          )}

          {panelTab === 'analyze' && (
            <div
              id="analysis-panel"
              className="grid lg:grid-cols-5 gap-8 items-start animate-fade-up"
            >
              <div className="lg:col-span-3 space-y-6">
                <Card title="Image analysis" className="h-full">
                  <div className="space-y-6">
                    <FileUploader
                      onFileSelect={handleFileSelect}
                      selectedFile={file}
                      onClear={handleClear}
                      isLoading={loading}
                    />
                    {file && !result && (
                      <div className="flex flex-col sm:flex-row sm:justify-end gap-3">
                        <Button
                          type="button"
                          onClick={analyzeImage}
                          disabled={loading}
                          className="w-full sm:w-auto"
                        >
                          {loading ? (
                            <span className="flex items-center gap-2">
                              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              Analyzing…
                            </span>
                          ) : (
                            'Run analysis'
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                </Card>
              </div>

              <div className="lg:col-span-2 space-y-6">
                {error && (
                  <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-800 flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                    <p className="text-sm font-medium">{error}</p>
                  </div>
                )}

                {result ? (
                  <PredictionResult result={result} onClear={handleClear} />
                ) : (
                  <div className="h-full min-h-[200px] flex items-center justify-center p-8 border-2 border-dashed border-clinical-200 rounded-2xl text-slate-500 text-center bg-gradient-to-b from-white/60 to-clinical-50/40">
                    <div>
                      <Activity className="w-12 h-12 mx-auto mb-3 text-clinical-300" />
                      <p className="text-sm font-medium">
                        Results appear here after analysis
                      </p>
                    </div>
                  </div>
                )}

                <RecentAnalyses items={recent} onRefresh={refreshRecent} />
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="border-t border-clinical-200/80 bg-white/60 backdrop-blur-sm py-10">
        <div className="container mx-auto px-6 text-center text-slate-500 text-sm">
          <p>
            © {new Date().getFullYear()} PulmoCare · Research demo · Not for
            clinical use without validation
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
