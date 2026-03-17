import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Star, MapPin, Briefcase, Filter } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Link } from "react-router-dom";

const lawyers = [
  { id: 1, name: "Adv. Priya Sharma", specialization: "Cyber Law", location: "Mumbai", rating: 4.9, experience: 12, fee: "$150/hr", image: "" },
  { id: 2, name: "Adv. Rahul Mehta", specialization: "Criminal Law", location: "Delhi", rating: 4.8, experience: 15, fee: "$200/hr", image: "" },
  { id: 3, name: "Adv. Neha Singh", specialization: "Family Law", location: "Bangalore", rating: 4.7, experience: 8, fee: "$120/hr", image: "" },
  { id: 4, name: "Adv. Arun Patel", specialization: "Corporate Law", location: "Hyderabad", rating: 4.9, experience: 20, fee: "$250/hr", image: "" },
  { id: 5, name: "Adv. Kavita Das", specialization: "Property Law", location: "Chennai", rating: 4.6, experience: 10, fee: "$130/hr", image: "" },
  { id: 6, name: "Adv. Suresh Kumar", specialization: "Labor Law", location: "Pune", rating: 4.8, experience: 14, fee: "$180/hr", image: "" },
];

const specializations = ["All", "Cyber Law", "Criminal Law", "Family Law", "Corporate Law", "Property Law", "Labor Law"];

const LawyerFinderPage = () => {
  const [search, setSearch] = useState("");
  const [selectedSpec, setSelectedSpec] = useState("All");

  const filtered = lawyers.filter((l) => {
    const matchesSearch = l.name.toLowerCase().includes(search.toLowerCase()) || l.location.toLowerCase().includes(search.toLowerCase());
    const matchesSpec = selectedSpec === "All" || l.specialization === selectedSpec;
    return matchesSearch && matchesSpec;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-24 pb-16 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-10">
            <h1 className="font-heading text-3xl md:text-4xl font-semibold text-foreground mb-3">Find a Lawyer</h1>
            <p className="text-muted-foreground text-lg">Connect with verified legal professionals near you.</p>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or location..."
                className="w-full rounded-xl border border-border bg-card pl-11 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {specializations.map((spec) => (
                <button
                  key={spec}
                  onClick={() => setSelectedSpec(spec)}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    selectedSpec === spec
                      ? "bg-primary text-primary-foreground"
                      : "bg-card text-muted-foreground border border-border hover:bg-muted"
                  }`}
                >
                  {spec}
                </button>
              ))}
            </div>
          </div>

          {/* Lawyer Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((lawyer) => (
              <motion.div
                key={lawyer.id}
                className="bg-card rounded-2xl p-6 card-shadow card-hover"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: [0.2, 0, 0, 1] }}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Briefcase className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-heading text-base font-semibold text-foreground">{lawyer.name}</h3>
                    <p className="text-sm text-primary font-medium">{lawyer.specialization}</p>
                  </div>
                </div>

                <div className="space-y-2 mb-5">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" /> {lawyer.location}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Star className="h-3.5 w-3.5 text-accent fill-accent" /> {lawyer.rating} · {lawyer.experience} yrs exp
                  </div>
                  <div className="text-sm font-medium text-foreground">{lawyer.fee}</div>
                </div>

                <Link
                  to={`/lawyers/${lawyer.id}`}
                  className="block w-full text-center rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary-dark transition-colors active:scale-95"
                >
                  View Profile
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LawyerFinderPage;
