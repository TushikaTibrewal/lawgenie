import { useNavigate } from "react-router-dom";
import { MessageSquare, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const RoleSelectPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 pt-28 pb-20 px-6">
        <div className="container mx-auto max-w-4xl grid gap-10 lg:grid-cols-[1.1fr_1fr] items-center">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5">
              <span className="w-2 h-2 rounded-full bg-primary" />
              <span className="text-xs font-medium text-primary">
                Choose how you want to use LawGenie
              </span>
            </div>

            <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-foreground leading-[1.1]">
              Are you a{" "}
              <span className="text-primary">client</span> or a{" "}
              <span className="text-primary">lawyer</span>?
            </h1>

            <p className="text-muted-foreground text-base md:text-lg max-w-xl">
              We&apos;ll tailor the experience for you. Clients can ask AI and find
              nearby lawyers, while lawyers get document analysis and case win
              prediction tools.
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-card rounded-2xl p-6 card-shadow space-y-4">
              <h2 className="font-heading text-base font-semibold text-foreground">
                Continue as
              </h2>

              <div className="space-y-3">
                <Button
                  className="w-full justify-between"
                  size="lg"
                  onClick={() => {
                    localStorage.setItem("ylc_role", "client");
                    navigate("/lawyers");
                  }}
                >
                  <span className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    <span>Client / User</span>
                  </span>
                  <span className="text-xs text-primary-foreground/80">
                    Ask AI • Find Lawyers
                  </span>
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-between"
                  size="lg"
                  onClick={() => {
                    localStorage.setItem("ylc_role", "lawyer");
                    navigate("/documents");
                  }}
                >
                  <span className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4" />
                    <span>Lawyer</span>
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Case analysis • Win prediction
                  </span>
                </Button>
              </div>

              <p className="text-xs text-muted-foreground text-center pt-1">
                You can switch roles anytime from the navigation bar.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default RoleSelectPage;

