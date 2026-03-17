import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Send, Scale, Sparkles, ArrowRight, Paperclip, XCircle, CheckCircle } from "lucide-react";
import Navbar from "@/components/Navbar";

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:8000/api";

interface Message {
  role: "user" | "assistant";
  content: string;
  brief?: {
    explanation: string;
    statutes: string[];
    nextSteps: string[];
  };
  signatureRisk?: {
    is_risk_free: boolean;
    explanation: string;
    risky_clauses: string[];
  };
}

const suggestedQuestions = [
  "Someone made a fake Instagram account using my photos.",
  "Can my landlord evict me without notice?",
  "What are my rights if I'm wrongfully terminated?",
  "How do I file a consumer complaint?",
];

const AIChatPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg: Message = { role: "user", content: input };
    const currentInput = input;

    // Add user message immediately
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/cases/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: currentInput }),
      });

      if (!res.ok) throw new Error("Failed to get response");

      const data = await res.json();

      const aiMsg: Message = {
        role: "assistant",
        content: "",
        brief: {
          explanation: data.explanation || "I'm sorry, I couldn't understand that.",
          statutes: data.statutes || [],
          nextSteps: data.nextSteps || [],
        },
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I'm having trouble connecting to my legal database right now. Please try again.",
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const text = await file.text();

    // Add user message indicating upload
    setMessages((prev) => [...prev, { role: "user", content: `Uploaded document for signature review: ${file.name}` }]);

    try {
      const res = await fetch(`${API_BASE}/cases/analyze-signature`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ raw_text: text }),
      });

      if (!res.ok) throw new Error("Failed to analyze signature");

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "",
          signatureRisk: {
            is_risk_free: data.is_risk_free,
            explanation: data.explanation,
            risky_clauses: data.risky_clauses,
          }
        }
      ]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an error analyzing that document. Please try again or consult a lawyer directly.",
        }
      ]);
    } finally {
      setLoading(false);
      // reset file input
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSuggestedQuestion = (q: string) => {
    setInput(q);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <div className="flex-1 pt-20 pb-32">
        <div className="container mx-auto max-w-3xl px-6">
          {messages.length === 0 ? (
            <motion.div
              className="flex flex-col items-center justify-center min-h-[60vh]"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.2, 0, 0, 1] }}
            >
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                <Scale className="h-8 w-8 text-primary" />
              </div>
              <h1 className="font-heading text-2xl md:text-3xl font-semibold text-foreground mb-3 text-center">
                Ask LawGenie
              </h1>
              <p className="text-muted-foreground text-center max-w-md mb-10">
                Describe your legal situation in plain language. I'll explain your rights and suggest next steps.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
                {suggestedQuestions.map((q) => (
                  <button
                    key={q}
                    onClick={() => handleSuggestedQuestion(q)}
                    className="text-left rounded-xl border border-border bg-card p-4 text-sm text-foreground hover:bg-muted transition-colors card-shadow card-hover"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </motion.div>
          ) : (
            <div className="space-y-6 py-6">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, ease: [0.2, 0, 0, 1] }}
                >
                  {msg.role === "user" ? (
                    <div className="flex justify-end">
                      <div className="bg-primary text-primary-foreground rounded-2xl rounded-br-md px-5 py-3 max-w-lg">
                        <p className="text-sm leading-relaxed">{msg.content}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-card rounded-2xl card-shadow p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <Scale className="h-5 w-5 text-primary" />
                        <span className="font-heading text-sm font-semibold text-primary">Legal Brief</span>
                      </div>

                      {msg.brief && (
                        <div className="space-y-5">
                          <div>
                            <h3 className="font-heading text-base font-semibold text-foreground mb-2">Legal Explanation</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">{msg.brief.explanation}</p>
                          </div>

                          <div>
                            <h3 className="font-heading text-base font-semibold text-foreground mb-2">Relevant Statutes</h3>
                            <ul className="space-y-1.5">
                              {msg.brief.statutes.map((s, j) => (
                                <li key={j} className="flex items-start gap-2 text-sm text-muted-foreground">
                                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                                  {s}
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <h3 className="font-heading text-base font-semibold text-foreground mb-2">Action Items</h3>
                            <ul className="space-y-1.5">
                              {msg.brief.nextSteps.map((s, j) => (
                                <li key={j} className="flex items-start gap-2 text-sm text-muted-foreground">
                                  <span className="w-5 h-5 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <span className="text-xs font-medium text-primary">{j + 1}</span>
                                  </span>
                                  {s}
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="pt-3 border-t border-border">
                            <button className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary-dark transition-colors">
                              <Sparkles className="h-4 w-4" />
                              Connect with a Specialist
                              <ArrowRight className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      )}

                      {msg.signatureRisk && (
                        <div className="space-y-5">
                          <div className={`p-4 rounded-xl border ${msg.signatureRisk.is_risk_free ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'} flex items-start gap-3`}>
                            {msg.signatureRisk.is_risk_free ? (
                              <CheckCircle className="h-6 w-6 text-green-600 shrink-0" />
                            ) : (
                              <XCircle className="h-6 w-6 text-red-600 shrink-0 mt-0.5" />
                            )}
                            <div>
                              <h3 className={`font-heading font-bold text-lg mb-1 ${msg.signatureRisk.is_risk_free ? 'text-green-700' : 'text-red-700'}`}>
                                {msg.signatureRisk.is_risk_free ? 'Safe to Sign' : 'Risky Document'}
                              </h3>
                              <p className="text-sm text-foreground/80 leading-relaxed font-medium">{msg.signatureRisk.explanation}</p>
                            </div>
                          </div>

                          {msg.signatureRisk.risky_clauses && msg.signatureRisk.risky_clauses.length > 0 && (
                            <div>
                              <h3 className="font-heading text-base font-semibold text-foreground mb-3">Clauses to Review with a Lawyer</h3>
                              <ul className="space-y-3">
                                {msg.signatureRisk.risky_clauses.map((clause, j) => (
                                  <li key={j} className="flex items-start gap-3 bg-red-50 p-3 rounded-lg border border-red-100">
                                    <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                                      <span className="text-xs font-bold text-red-600">{j + 1}</span>
                                    </div>
                                    <p className="text-sm text-red-900 leading-relaxed pt-0.5">{clause}</p>
                                  </li>
                                ))}
                              </ul>
                              <div className="pt-5 mt-5 border-t border-border">
                                <button className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary-dark transition-colors">
                                  <Sparkles className="h-4 w-4" />
                                  Connect with a Specialist regarding these risks
                                  <ArrowRight className="h-3 w-3" />
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {msg.content && !msg.brief && !msg.signatureRisk && (
                        <p className="text-sm leading-relaxed">{msg.content}</p>
                      )}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Input */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-md border-t border-border p-4">
        <div className="container mx-auto max-w-3xl">
          <div className="flex gap-3 items-center bg-card rounded-full px-5 py-2 card-shadow glow-accent">
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
              className="w-9 h-9 rounded-full flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-primary transition-colors disabled:opacity-40"
              title="Upload document for signature review"
            >
              <Paperclip className="h-5 w-5" />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept=".pdf,.docx,.txt"
              onChange={handleFileUpload}
            />
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder={loading ? "Analyzing document..." : "Describe your legal situation..."}
              disabled={loading}
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none py-2"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || loading}
              className="w-9 h-9 border border-border rounded-full bg-primary-dark flex items-center justify-center text-primary-foreground hover:bg-primary transition-colors disabled:opacity-40"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChatPage;
