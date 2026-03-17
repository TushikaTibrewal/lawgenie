import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MessageSquare, FileText, Search, ArrowRight, Shield, Users, Zap } from "lucide-react";
import heroIllustration from "@/assets/hero-illustration.png";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SpotlightCard } from "@/components/SpotlightCard";

const pageTransition = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3, ease: [0.2, 0, 0, 1] },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.08 } },
};

const features = [
  {
    icon: MessageSquare,
    title: "AI Legal Assistant",
    description: "Get instant, clear guidance on your legal questions powered by advanced AI.",
  },
  {
    icon: FileText,
    title: "Document Analyzer",
    description: "Upload contracts and legal documents to get plain-language summaries and risk detection.",
  },
  {
    icon: Search,
    title: "Lawyer Finder",
    description: "Connect with verified lawyers based on specialization, location, and ratings.",
  },
];

const steps = [
  { number: "01", title: "Ask your legal question", description: "Type your question in plain language — no legal jargon needed." },
  { number: "02", title: "AI explains your rights", description: "Get a structured brief with relevant laws, next steps, and risk assessment." },
  { number: "03", title: "Connect with the right lawyer", description: "Get matched with specialists who can take your case further." },
];

const stats = [
  { value: "1,402", label: "Clauses Analyzed" },
  { value: "4.9/5", label: "Average Rating" },
  { value: "500+", label: "Verified Lawyers" },
  { value: "24/7", label: "AI Availability" },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <motion.section
        className="pt-32 pb-20 px-6"
        initial="initial"
        animate="animate"
        variants={stagger}
      >
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div variants={pageTransition}>
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 mb-6">
                <Shield className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary">Trusted Legal AI Platform</span>
              </div>
              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-foreground leading-[1.1] mb-6">
                Legal Help Made{" "}
                <span className="text-primary">Simple</span> with AI
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-lg mb-8">
                Ask legal questions, understand your rights, and connect with trusted lawyers instantly. No jargon, no confusion.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/chat"
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary-dark transition-colors duration-200 active:scale-95"
                >
                  <MessageSquare className="h-4 w-4" />
                  Ask LawGenie
                </Link>
                <Link
                  to="/lawyers"
                  className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-6 py-3 text-sm font-medium text-foreground hover:bg-muted transition-colors duration-200 card-shadow"
                >
                  <Search className="h-4 w-4" />
                  Find a Lawyer
                </Link>
              </div>
            </motion.div>

            <motion.div variants={pageTransition} className="flex justify-center">
              <img
                src={heroIllustration}
                alt="LawGenie - AI Legal Assistant"
                className="w-full max-w-md"
              />
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Stats */}
      <section className="py-12 px-6 border-y border-border bg-card/50">
        <div className="container mx-auto max-w-4xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="font-heading text-2xl md:text-3xl font-semibold text-primary">{stat.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-14">
            <h2 className="font-heading text-3xl md:text-4xl font-semibold text-foreground mb-4">
              Everything you need for legal clarity
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              From AI-powered guidance to connecting with real professionals.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature) => (
              <SpotlightCard key={feature.title} className="p-8">
                <motion.div
                  className="h-full w-full"
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.3, ease: [0.2, 0, 0, 1] }}
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-heading text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </motion.div>
              </SpotlightCard>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 bg-card/50 border-y border-border">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-14">
            <h2 className="font-heading text-3xl md:text-4xl font-semibold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground text-lg">Three simple steps to legal clarity.</p>
          </div>

          <div className="space-y-8">
            {steps.map((step) => (
              <SpotlightCard key={step.number} className="p-6">
                <motion.div
                  className="flex gap-6 items-start h-full"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, ease: [0.2, 0, 0, 1] }}
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
                    <span className="text-sm font-heading font-semibold text-primary-foreground">{step.number}</span>
                  </div>
                  <div>
                    <h3 className="font-heading text-lg font-semibold text-foreground mb-1">{step.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                  </div>
                </motion.div>
              </SpotlightCard>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-3xl text-center">
          <div className="bg-card rounded-3xl p-12 card-shadow glow-accent">
            <h2 className="font-heading text-3xl md:text-4xl font-semibold text-foreground mb-4">
              Legal clarity, simplified.
            </h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
              Start with a question. Get the answers you need. Connect with the right lawyer.
            </p>
            <Link
              to="/chat"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-8 py-3.5 text-base font-medium text-primary-foreground hover:bg-primary-dark transition-colors duration-200 active:scale-95"
            >
              Get Started Free
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
