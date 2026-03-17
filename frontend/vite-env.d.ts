import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Upload, FileText, AlertTriangle, CheckCircle, X } from "lucide-react";
import Navbar from "@/components/Navbar";

const DocumentAnalyzerPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [analyzed, setAnalyzed] = useState(false);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f) { setFile(f); setAnalyzed(true); }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) { setFile(f); setAnalyzed(true); }
  };

  const mockAnalysis = {
    summary: "This is a standard residential lease agreement with a 12-month term. The agreement includes standard clauses for rent payment, security deposit, maintenance responsibilities, and termination conditions.",
    riskClauses: [
      { text: "Tenant forfeits entire security deposit if lease is terminated early", severity: "high" },
      { text: "Landlord may enter premises without notice for inspections", severity: "high" },
      { text: "Automatic rent increase of 10% upon renewal", severity: "medium" },
    ],
    keyPoints: [
      "Monthly rent: $1,500 due on the 1st",
      "Security deposit: $3,000 (2 months)",
      "Lease term: 12 months starting April 1, 2026",
      "Pet policy: No pets allowed",
      "Utilities: Tenant responsible for all utilities",
    ],
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
            </motion.div>
          ) : (
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.2, 0, 0, 1] }}
            >
              {/* File info */}
              <div className="bg-card rounded-2xl p-5 card-shadow flex items-center justify-between">
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

              {/* Summary */}
              <div className="bg-card rounded-2xl p-6 card-shadow">
                <h3 className="font-heading text-lg font-semibold text-foreground mb-3">Summary</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{mockAnalysis.summary}</p>
              </div>

              {/* Risk Clauses */}
              <div className="bg-card rounded-2xl p-6 card-shadow">
                <h3 className="font-heading text-lg font-semibold text-foreground mb-4">Risk Clauses</h3>
                <div className="space-y-3">
                  {mockAnalysis.riskClauses.map((clause, i) => (
                    <div key={i} className="flex items-start gap-3 rounded-xl bg-accent/10 p-4">
                      <AlertTriangle className={`h-5 w-5 flex-shrink-0 mt-0.5 ${clause.severity === "high" ? "text-accent" : "text-primary"}`} />
                      <div>
                        <p className="text-sm text-foreground">{clause.text}</p>
                        <span className={`inline-block mt-1.5 text-xs font-medium px-2 py-0.5 rounded-full ${
                          clause.severity === "high" ? "bg-accent/20 text-accent" : "bg-primary/10 text-primary"
                        }`}>
                          {clause.severity === "high" ? "High Risk" : "Medium Risk"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Points */}
              <div className="bg-card rounded-2xl p-6 card-shadow">
                <h3 className="font-heading text-lg font-semibold text-foreground mb-4">Key Points</h3>
                <ul className="space-y-2">
                  {mockAnalysis.keyPoints.map((point, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentAnalyzerPage;
