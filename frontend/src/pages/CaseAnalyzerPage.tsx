import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Upload, Scale, TrendingUp, AlertCircle, FileText, CheckCircle, X, ShieldAlert, BarChart3, Database } from "lucide-react";
import Navbar from "@/components/Navbar";
import { SpotlightCard } from "@/components/SpotlightCard";
import { Progress } from "@/components/ui/progress";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";

type KeywordImportance = { name: string; weight: number };
type RadarData = { subject: string; A: number; fullMark: number };

type CasePrediction = {
  win_probability: number;
  outcome_label: string;
  radar_data: RadarData[];
  keyword_importance: KeywordImportance[];
  model_confidence: number;
  similar_cases_win_rate: number;
};

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:8000/api";

const CaseAnalyzerPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [analyzed, setAnalyzed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<CasePrediction | null>(null);

  const runAnalysis = async (file: File) => {
    setLoading(true);
    setError(null);

    try {
      const text = await file.text();

      const res = await fetch(`${API_BASE}/cases/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: file.name,
          description: null,
          raw_text: text,
          jurisdiction: null,
          case_type: null,
        }),
      });

      if (!res.ok) throw new Error(`Analysis failed with status ${res.status}`);

      const data = await res.json();
      setPrediction(data.prediction);
      setAnalyzed(true);
    } catch (err: any) {
      setError(err.message ?? "Something went wrong while analyzing the case.");
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f) {
      setFile(f);
      void runAnalysis(f);
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      void runAnalysis(f);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-24 pb-16 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-10 text-center">
            <h1 className="font-heading text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent mb-4">
              AI Case Prediction
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Leverage advanced machine learning to forecast case outcomes, analyze critical features, and discover historical precedents.
            </p>
          </div>

          {!analyzed ? (
            <motion.div
              className="border-2 border-dashed border-primary/20 bg-card rounded-3xl p-16 text-center card-shadow max-w-3xl mx-auto"
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Database className="h-10 w-10 text-primary" />
              </div>
              <h3 className="font-heading text-2xl font-semibold text-foreground mb-3">Upload Case Materials</h3>
              <p className="text-muted-foreground mb-8 text-lg">Drop your legal documents (PDF, DOCX, TXT) here to feed them into the ML model.</p>

              <label className="relative overflow-hidden group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-primary-dark px-8 py-4 text-base font-semibold text-white shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer">
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></div>
                <Upload className="h-5 w-5 relative z-10" />
                <span className="relative z-10">Select Documents</span>
                <input type="file" className="hidden" accept=".pdf,.docx,.txt" onChange={handleFileChange} />
              </label>

              {loading && (
                <div className="mt-8 flex flex-col items-center justify-center space-y-4">
                  <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                  <p className="text-sm font-medium text-primary animate-pulse">Running ML pipeline inferences...</p>
                </div>
              )}
              {error && (
                <div className="mt-6 p-4 bg-red-500/10 rounded-lg text-red-500 text-sm font-medium flex items-center justify-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, staggerChildren: 0.1 }}
            >
              {/* Left Column: Summary & File */}
              <div className="lg:col-span-1 space-y-6">
                <motion.div className="bg-card rounded-3xl p-6 shadow-sm border border-border/50 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -z-10 transition-transform group-hover:scale-110"></div>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-sm uppercase tracking-wider text-muted-foreground font-semibold mb-1">Analyzed File</h3>
                      <div className="flex items-center gap-3">
                        <FileText className="h-6 w-6 text-primary" />
                        <span className="font-semibold text-lg truncate max-w-[180px]">{file?.name}</span>
                      </div>
                    </div>
                    <button onClick={() => { setFile(null); setAnalyzed(false); }} className="p-2 bg-muted rounded-full hover:bg-red-500/10 hover:text-red-500 transition-colors">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </motion.div>

                <motion.div className="bg-gradient-to-br from-primary to-accent rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
                  <div className="absolute opacity-10 right-[-10%] top-[-10%]">
                    <Scale className="w-64 h-64" />
                  </div>
                  <h3 className="text-sm uppercase tracking-widest font-semibold text-white/80 mb-6 drop-shadow-sm">Outcome Prediction</h3>

                  <div className="flex flex-col items-center justify-center py-4">
                    <div className="relative flex items-center justify-center">
                      <svg className="w-40 h-40 transform -rotate-90">
                        <circle cx="80" cy="80" r="70" stroke="rgba(255,255,255,0.2)" strokeWidth="12" fill="none" />
                        <circle
                          cx="80" cy="80" r="70"
                          stroke="white"
                          strokeWidth="12"
                          fill="none"
                          strokeDasharray="440"
                          strokeDashoffset={440 - (440 * (prediction?.win_probability || 0)) / 100}
                          className="transition-all duration-1000 ease-out"
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute flex flex-col items-center">
                        <span className="text-4xl font-bold">{prediction?.win_probability}%</span>
                        <span className="text-xs uppercase font-medium text-white/80">Win Prob</span>
                      </div>
                    </div>
                    <div className="mt-6 text-center">
                      <span className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white font-semibold shadow-inner">
                        {prediction?.outcome_label}
                      </span>
                    </div>
                  </div>
                </motion.div>

                <SpotlightCard>
                  <div className="p-6 h-full flex flex-col">
                    <h3 className="font-heading text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                      <ShieldAlert className="h-5 w-5 text-accent" />
                      Model Confidence
                    </h3>
                    <div className="flex items-end gap-2 mb-3">
                      <span className="text-3xl font-bold text-foreground">{prediction?.model_confidence}%</span>
                      <span className="text-sm text-green-500 font-medium mb-1">High</span>
                    </div>
                    <Progress value={prediction?.model_confidence} className="h-2 bg-secondary" />
                    <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
                      Confidence score is based on the volume of historical precedents and clarity of key factual elements extracted from the text.
                    </p>
                  </div>
                </SpotlightCard>
              </div>

              {/* Right Column: Graphs */}
              <div className="lg:col-span-2 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[400px]">
                  {/* Radar Chart */}
                  <SpotlightCard>
                    <div className="p-6 h-full flex flex-col">
                      <h3 className="font-heading text-lg font-semibold text-foreground mb-2 flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-primary" />
                        Factor Analysis
                      </h3>
                      <p className="text-xs text-muted-foreground mb-4">Strength of individual case components</p>
                      <div className="flex-1 w-full -ml-4">
                        {prediction?.radar_data && (
                          <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={prediction.radar_data}>
                              <PolarGrid stroke="#e2e8f0" />
                              <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 11 }} />
                              <Radar name="Case Score" dataKey="A" stroke="#0ea5e9" fill="#0ea5e9" fillOpacity={0.4} />
                              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                            </RadarChart>
                          </ResponsiveContainer>
                        )}
                      </div>
                    </div>
                  </SpotlightCard>

                  {/* Feature Importance Bar Chart */}
                  <SpotlightCard>
                    <div className="p-6 h-full flex flex-col">
                      <h3 className="font-heading text-lg font-semibold text-foreground mb-2 flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-accent" />
                        Extracted Features
                      </h3>
                      <p className="text-xs text-muted-foreground mb-4">Relative weight of terms driving prediction</p>
                      <div className="flex-1 w-full -ml-4">
                        {prediction?.keyword_importance && (
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={prediction.keyword_importance} layout="vertical" margin={{ top: 5, right: 20, left: 40, bottom: 5 }}>
                              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                              <XAxis type="number" domain={[0, 1]} tick={{ fill: '#64748b', fontSize: 11 }} />
                              <YAxis dataKey="name" type="category" tick={{ fill: '#475569', fontSize: 11, fontWeight: 500 }} />
                              <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                              <Bar dataKey="weight" fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={20} />
                            </BarChart>
                          </ResponsiveContainer>
                        )}
                      </div>
                    </div>
                  </SpotlightCard>
                </div>

                {/* Bottom Row: Historical Context */}
                <div className="bg-card rounded-3xl p-8 shadow-sm border border-border/50">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div>
                      <h3 className="font-heading text-xl font-bold text-foreground mb-2">Historical Precedent Alignment</h3>
                      <p className="text-muted-foreground text-sm max-w-xl">
                        The neural network evaluated your document against a vector database of previous rulings. Cases with similar feature constellations resulted in a favorable outcome <span className="font-bold text-foreground">{prediction?.similar_cases_win_rate}%</span> of the time.
                      </p>
                    </div>
                    <div className="bg-accent/10 p-4 rounded-2xl border border-accent/20 flex items-center justify-center shrink-0">
                      <div className="text-center">
                        <span className="block text-3xl font-black text-accent">{prediction?.similar_cases_win_rate}%</span>
                        <span className="text-xs font-semibold text-accent/80 uppercase">Cohort Win Rate</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CaseAnalyzerPage;
