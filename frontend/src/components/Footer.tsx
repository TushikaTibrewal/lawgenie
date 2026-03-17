import { Scale } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-card py-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Scale className="h-5 w-5 text-primary" />
              <span className="font-heading text-lg font-semibold">LawGenie</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              AI-powered legal assistance that makes understanding your rights simple and accessible.
            </p>
          </div>

          <div>
            <h4 className="font-heading text-sm font-semibold mb-4">Product</h4>
            <ul className="space-y-2">
              <li><Link to="/chat" className="text-sm text-muted-foreground hover:text-foreground transition-colors">AI Assistant</Link></li>
              <li><Link to="/documents" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Document Analyzer</Link></li>
              <li><Link to="/lawyers" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Find Lawyers</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading text-sm font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">About</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Careers</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading text-sm font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Disclaimer</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">© 2026 LawGenie. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
