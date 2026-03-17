import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Scale, Mail, Lock, User, ArrowRight } from "lucide-react";

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState<"client" | "lawyer">("client");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("ylc_role", role === "lawyer" ? "lawyer" : "client");
    navigate(role === "lawyer" ? "/documents" : "/lawyers");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.2, 0, 0, 1] }}
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <Scale className="h-7 w-7 text-primary" />
            <span className="font-heading text-2xl font-semibold text-foreground">LawGenie</span>
          </Link>
          <h1 className="font-heading text-2xl font-semibold text-foreground">
            {isLogin ? "Welcome back" : "Create your account"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {isLogin ? "Sign in to continue" : "Get started with LawGenie"}
          </p>
        </div>

        <div className="bg-card rounded-2xl p-8 card-shadow">
          <form className="space-y-4" onSubmit={handleSubmit}>
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input type="text" placeholder="John Doe" className="w-full rounded-lg border border-border bg-background pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input type="email" placeholder="you@example.com" className="w-full rounded-lg border border-border bg-background pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input type="password" placeholder="••••••••" className="w-full rounded-lg border border-border bg-background pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">I am a</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole("client")}
                  className={`rounded-lg p-3 text-sm font-medium transition-colors ${
                    role === "client"
                      ? "border border-primary bg-primary/5 text-primary"
                      : "border border-border text-muted-foreground hover:bg-muted"
                  }`}
                >
                  Client / User
                </button>
                <button
                  type="button"
                  onClick={() => setRole("lawyer")}
                  className={`rounded-lg p-3 text-sm font-medium transition-colors ${
                    role === "lawyer"
                      ? "border border-primary bg-primary/5 text-primary"
                      : "border border-border text-muted-foreground hover:bg-muted"
                  }`}
                >
                  Lawyer
                </button>
              </div>
            </div>

            <button type="submit" className="w-full rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary-dark transition-colors active:scale-95 flex items-center justify-center gap-2">
              {isLogin ? "Sign In" : "Create Account"}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
