import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Upload, FileText, AlertTriangle, CheckCircle, X, Target, Sparkles, AlertCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import { SpotlightCard } from "@/components/SpotlightCard";
import { Progress } from "@/components/ui/progress";

type RiskClause = { text: string; severity: "low" | "medium" | "high" | string };

type Highlight = { text: string; reason: string };

type StrongArea = { title: string; description: string };

type AnalysisState = {
  summary: string;
  riskClauses: RiskClause[];
  keyPoints: string[];
  highlights: Highlight[];
  strongAreas: StrongArea[];
  rawText: string;
};

const API_BASE =
  import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:8000/api";

const DocumentAnalyzerPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [analyzed, setAnalyzed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisState | null>(null);

  const runAnalysis = async (file: File) => {
    setLoading(true);
    setError(null);

    try {
      const text = await file.text();

      const res = await fetch(`${API_BASE}/cases/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: file.name,
          description: null,
          raw_text: text,
          jurisdiction: null,
          case_type: null,
        }),
      });

      if (!res.ok) {
        throw new Error(`Analysis failed with status ${res.status}`);
      }

      const data = await res.json();
      const a = data.analysis;

      const riskClauses: RiskClause[] = (a.risk_clauses ?? []).map(
        (c: any) => ({
          text: String(c.text ?? ""),
          severity: (c.severity as RiskClause["severity"]) ?? "medium",
        }),
      );

      const keyPoints: string[] = (a.key_points ?? []).map((p: any) =>
        String(p),
      );

      const highlights: Highlight[] = (a.highlights ?? []).map((h: any) => ({
        text: String(h.text ?? ""),
        reason: String(h.reason ?? ""),
      }));

      const strongAreas: StrongArea[] = (a.strong_areas ?? []).map((sa: any) => ({
        title: String(sa.title ?? ""),
        description: String(sa.description ?? ""),
      }));

      setAnalysis({
        summary: String(a.summary ?? ""),
        riskClauses,
        keyPoints,
        highlights,
        strongAreas,
        rawText: text,
      });
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
        <div className="container mx-auto max-w-5xl">
          <div className="mb-10">
            <h1 className="font-heading text-3xl md:text-4xl font-semibold text-foreground mb-3">Document Analyzer</h1>
            <p className="text-muted-foreground text-lg">Upload a legal document to get a plain-language summary and risk assessment.</p>
          </div>

          {!analyzed ? (
            <motion.div
              className="border-2 border-dashed border-primary/20 bg-primary/5 rounded-2xl p-16 text-center"
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Upload className="h-12 w-12 text-primary/40 mx-auto mb-4" />
              <h3 className="font-heading text-lg font-semibold text-foreground mb-2">Drop your document here</h3>
              <p className="text-sm text-muted-foreground mb-6">PDF, DOCX, or TXT — up to 20MB</p>
              <label className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary-dark transition-colors cursor-pointer active:scale-95">
                <FileText className="h-4 w-4" />
                Browse Files
                <input type="file" className="hidden" accept=".pdf,.docx,.txt" onChange={handleFileChange} />
              </label>
              {loading && (
                <p className="mt-4 text-sm text-muted-foreground">
                  Analyzing document with AI... this can take a few seconds.
                </p>
              )}
              {error && (
                <p className="mt-4 text-sm text-red-500">
                  {error}
                </p>
              )}
            </motion.div>
          ) : (
            <motion.div
              className="max-w-3xl mx-auto space-y-6 lg:space-y-8 relative z-10"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.2, 0, 0, 1] }}
            >
              <div className="space-y-6">
                {/* File info */}
                <div className="bg-card rounded-2xl p-5 card-shadow flex items-center justify-between">
                  {/* ... (existing file info kept identical below) */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{file?.name || "document.pdf"}</p>
                      <p className="text-xs text-muted-foreground">{file ? `${(file.size / 1024).toFixed(1)} KB` : "245 KB"}</p>
                    </div>
                  </div>
                  <button onClick={() => { setFile(null); setAnalyzed(false); }} className="text-muted-foreground hover:text-foreground">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Case Summary (Prominent Top Card) */}
              <SpotlightCard>
                <div className="bg-gradient-to-br from-primary/10 to-accent/5 p-6 h-full flex flex-col">
                  <h3 className="font-heading text-xl font-bold text-foreground mb-3 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Brief Case Explanation & Summary
                  </h3>
                  <p className="text-sm text-foreground/80 leading-relaxed font-medium">
                    {analysis?.summary ||
                      "AI-generated summary of the uploaded case will appear here."}
                  </p>
                </div>
              </SpotlightCard>

              {/* Case Strengths */}
              <SpotlightCard>
                <div className="p-6 h-full flex flex-col">
                  <h3 className="font-heading text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Target className="h-5 w-5 text-accent" />
                    Case Strengths & Evaluation
                  </h3>
                  <div className="space-y-4">
                    {(analysis?.strongAreas ?? []).map((area, i) => (
                      <div key={i} className="border border-accent/20 rounded-xl p-4 bg-accent/5">
                        <h4 className="font-semibold text-sm text-foreground mb-1">{area.title}</h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {area.description}
                        </p>
                      </div>
                    ))}
                    {analysis?.strongAreas?.length === 0 && (
                      <p className="text-sm text-muted-foreground italic">No specific strengths identified yet.</p>
                    )}
                  </div>
                </div>
              </SpotlightCard>

              {/* Risk Clauses */}
              <SpotlightCard>
                <div className="p-6 h-full flex flex-col">
                  <h3 className="font-heading text-lg font-semibold text-foreground mb-4">Risk Clauses</h3>
                  <div className="space-y-3">
                    {(analysis?.riskClauses ?? []).map((clause, i) => (
                      <div key={i} className="flex items-start gap-3 rounded-xl bg-accent/10 p-4">
                        <AlertTriangle className={`h-5 w-5 flex-shrink-0 mt-0.5 ${clause.severity === "high" ? "text-accent" : "text-primary"}`} />
                        <div>
                          <p className="text-sm text-foreground">{clause.text}</p>
                          <span className={`inline-block mt-1.5 text-xs font-medium px-2 py-0.5 rounded-full ${clause.severity === "high" ? "bg-accent/20 text-accent" : "bg-primary/10 text-primary"
                            }`}>
                            {clause.severity === "high" ? "High Risk" : "Medium Risk"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </SpotlightCard>

              {/* Key Points */}
              <SpotlightCard>
                <div className="p-6 h-full flex flex-col">
                  <h3 className="font-heading text-lg font-semibold text-foreground mb-4">Key Points</h3>
                  <ul className="space-y-2">
                    {(analysis?.keyPoints ?? []).map((point, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </SpotlightCard>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentAnalyzerPage;
