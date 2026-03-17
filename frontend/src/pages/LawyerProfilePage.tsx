import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, MapPin, Briefcase, Clock, DollarSign, ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";

const lawyersData: Record<number, { name: string; specialization: string; location: string; rating: number; experience: number; fee: string; bio: string }> = {
  1: { name: "Adv. Priya Sharma", specialization: "Cyber Law", location: "Mumbai", rating: 4.9, experience: 12, fee: "$150/hr", bio: "Specializes in cyber crime cases, data privacy, and online fraud. Has handled 200+ cases with a 92% success rate." },
  2: { name: "Adv. Rahul Mehta", specialization: "Criminal Law", location: "Delhi", rating: 4.8, experience: 15, fee: "$200/hr", bio: "Expert in criminal defense with extensive courtroom experience. Formerly served as a public prosecutor." },
  3: { name: "Adv. Neha Singh", specialization: "Family Law", location: "Bangalore", rating: 4.7, experience: 8, fee: "$120/hr", bio: "Compassionate family law attorney specializing in divorce, custody, and domestic disputes." },
  4: { name: "Adv. Arun Patel", specialization: "Corporate Law", location: "Hyderabad", rating: 4.9, experience: 20, fee: "$250/hr", bio: "Senior corporate attorney with expertise in mergers, acquisitions, and regulatory compliance." },
  5: { name: "Adv. Kavita Das", specialization: "Property Law", location: "Chennai", rating: 4.6, experience: 10, fee: "$130/hr", bio: "Property law specialist handling real estate transactions, disputes, and land acquisition cases." },
  6: { name: "Adv. Suresh Kumar", specialization: "Labor Law", location: "Pune", rating: 4.8, experience: 14, fee: "$180/hr", bio: "Labor law expert advocating for employee rights, workplace safety, and fair employment practices." },
};

const LawyerProfilePage = () => {
  const { id } = useParams();
  const lawyer = lawyersData[Number(id)] || lawyersData[1];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16 px-6">
        <div className="container mx-auto max-w-3xl">
          <Link to="/lawyers" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to Lawyers
          </Link>

          <motion.div
            className="bg-card rounded-2xl p-8 card-shadow"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-start gap-6 mb-6">
              <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Briefcase className="h-10 w-10 text-primary" />
              </div>
              <div>
                <h1 className="font-heading text-2xl font-semibold text-foreground">{lawyer.name}</h1>
                <p className="text-primary font-medium">{lawyer.specialization}</p>
                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {lawyer.location}</span>
                  <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5 text-accent fill-accent" /> {lawyer.rating}</span>
                </div>
              </div>
            </div>

            <p className="text-muted-foreground leading-relaxed mb-8">{lawyer.bio}</p>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-muted rounded-xl p-4 text-center">
                <Clock className="h-5 w-5 text-primary mx-auto mb-1" />
                <p className="text-sm font-semibold text-foreground">{lawyer.experience} years</p>
                <p className="text-xs text-muted-foreground">Experience</p>
              </div>
              <div className="bg-muted rounded-xl p-4 text-center">
                <Star className="h-5 w-5 text-accent mx-auto mb-1" />
                <p className="text-sm font-semibold text-foreground">{lawyer.rating}/5</p>
                <p className="text-xs text-muted-foreground">Rating</p>
              </div>
              <div className="bg-muted rounded-xl p-4 text-center">
                <DollarSign className="h-5 w-5 text-primary mx-auto mb-1" />
                <p className="text-sm font-semibold text-foreground">{lawyer.fee}</p>
                <p className="text-xs text-muted-foreground">Consultation</p>
              </div>
            </div>

            <Link
              to={`/book/${id}`}
              className="block w-full text-center rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary-dark transition-colors active:scale-95"
            >
              Book Consultation
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LawyerProfilePage;
