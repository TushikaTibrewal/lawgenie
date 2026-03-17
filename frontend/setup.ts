import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, Clock, Video, MessageSquare, ArrowLeft, CheckCircle } from "lucide-react";
import Navbar from "@/components/Navbar";

const BookingPage = () => {
  const { id } = useParams();
  const [booked, setBooked] = useState(false);
  const [form, setForm] = useState({ date: "", time: "", type: "video", description: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBooked(true);
  };

  if (booked) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 px-6 flex items-center justify-center min-h-[80vh]">
          <motion.div
            className="bg-card rounded-2xl p-12 card-shadow text-center max-w-md"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <CheckCircle className="h-16 w-16 text-primary mx-auto mb-4" />
            <h2 className="font-heading text-2xl font-semibold text-foreground mb-2">Booking Confirmed!</h2>
            <p className="text-muted-foreground mb-6">Your consultation has been scheduled. You'll receive a confirmation email shortly.</p>
            <Link to="/lawyers" className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary-dark transition-colors">
              Back to Lawyers
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16 px-6">
        <div className="container mx-auto max-w-2xl">
          <Link to={`/lawyers/${id}`} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to Profile
          </Link>

          <motion.div
            className="bg-card rounded-2xl p-8 card-shadow"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="font-heading text-2xl font-semibold text-foreground mb-6">Book Consultation</h1>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="date"
                    required
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="w-full rounded-lg border border-border bg-background pl-10 pr-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Time</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="time"
                    required
                    value={form.time}
                    onChange={(e) => setForm({ ...form, time: e.target.value })}
                    className="w-full rounded-lg border border-border bg-background pl-10 pr-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Consultation Type</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: "video", label: "Video Call", icon: Video },
                    { value: "chat", label: "Chat", icon: MessageSquare },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setForm({ ...form, type: opt.value })}
                      className={`flex items-center gap-2 rounded-lg border p-3 text-sm font-medium transition-colors ${
                        form.type === opt.value
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-border text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      <opt.icon className="h-4 w-4" />
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Case Description</label>
                <textarea
                  required
                  rows={4}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Briefly describe your legal situation..."
                  className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary-dark transition-colors active:scale-95"
              >
                Confirm Booking
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
