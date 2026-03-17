import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Scale } from "lucide-react";

type Role = "lawyer" | "client" | null;

const Navbar = () => {
  const [role, setRole] = useState<Role>(null);
  const location = useLocation();
  const isAuthPage = location.pathname === "/login" || location.pathname === "/signup";
  const isLanding = location.pathname === "/";

  useEffect(() => {
    try {
      const stored = localStorage.getItem("ylc_role");
      if (stored === "lawyer" || stored === "client") {
        setRole(stored);
      }
    } catch {
      setRole(null);
    }
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-border">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Scale className="h-6 w-6 text-primary" />
          <span className="font-heading text-xl font-semibold text-foreground">LawGenie</span>
        </Link>

        {!isAuthPage && !isLanding && (
          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Home
            </Link>

            {role !== "lawyer" && (
              <>
                <Link
                  to="/chat"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Ask AI
                </Link>
                <Link
                  to="/lawyers"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Find Lawyer
                </Link>
              </>
            )}

            {role === "lawyer" && (
              <>
                <Link
                  to="/documents"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Document Analyzer
                </Link>
                <Link
                  to="/case-analyzer"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Case Analyzer
                </Link>
              </>
            )}
          </div>
        )}

        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="text-sm font-medium text-foreground hover:text-primary transition-colors"
          >
            {role ? "Switch account" : "Log in"}
          </Link>
          {!role && (
            <Link
              to="/signup"
              className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary-dark transition-colors duration-200 active:scale-95"
            >
              Get Started
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
