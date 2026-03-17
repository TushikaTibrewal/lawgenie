import { Link } from "react-router-dom";
import { Scale, MessageSquare, Search } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-border">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Scale className="h-6 w-6 text-primary" />
          <span className="font-heading text-xl font-semibold text-foreground">LawGenie</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <Link to="/chat" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Ask AI</Link>
          <Link to="/lawyers" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Find Lawyer</Link>
          <Link to="/documents" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Documents</Link>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="text-sm font-medium text-foreground hover:text-primary transition-colors"
          >
            Log in
          </Link>
          <Link
            to="/signup"
            className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary-dark transition-colors duration-200 active:scale-95"
          >
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
