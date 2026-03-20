import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import logo from "@/assets/rdg-header-logo.png";
import kimoraPhoto from "@/assets/team/kimora-taylor.jpg";
import seydinaPhoto from "@/assets/team/seydina-salla.jpg";
import terellPhoto from "@/assets/team/terell-reed.jpg";
import jadenPhoto from "@/assets/team/jaden-koranteng.jpg";

const team = [
  {
    name: "Terell Reed",
    title: "Chief Executive Officer & Lead Backend Engineer",
    description:
      "Terell is the visionary behind Reed Digital Group. As CEO, he drives the strategic direction of the company while architecting robust, scalable backend systems that power every project we deliver.",
    photo: terellPhoto,
  },
  {
    name: "Kimora Taylor",
    title: "Frontend Developer & UI/UX Designer",
    description:
      "Kimora is the creative force behind every interface we build. With a sharp eye for design and deep expertise in frontend development, she crafts pixel-perfect, intuitive experiences that delight users and elevate brands.",
    photo: kimoraPhoto,
  },
  {
    name: "Jaden Koranteng",
    title: "Backend Developer",
    description:
      "Jaden ensures every system runs smoothly and every feature is built to last. As a backend developer, he brings technical excellence and reliability to every project he touches.",
    photo: jadenPhoto,
  },
  {
    name: "Seydina Salla",
    title: "Director of Finance & Operations",
    description:
      "Seydina oversees all financial operations and business strategy at RDG. His sharp analytical mind and meticulous attention to detail ensure that every engagement is structured for success, from proposal to final payment.",
    photo: seydinaPhoto,
  },
];

const InvoiceThankYou = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Faded background logo */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-0">
        <img src={logo} alt="" className="w-[500px] md:w-[700px] opacity-[0.03]" />
      </div>

      {/* Top bar */}
      <div className="border-b border-border">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center gap-4">
          <img src={logo} alt="RDG" className="h-6" />
          <span className="text-xs font-mono text-foreground uppercase tracking-[0.3em]">
            Payment Confirmation
          </span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="py-16 text-center"
        >
          <img src={logo} alt="Reed Digital Group" className="h-12 mx-auto mb-8" />
          <h1 className="text-4xl md:text-6xl font-mono font-bold text-foreground tracking-tight mb-4">
            <em>Thank You</em>
          </h1>
          <div className="w-16 h-[2px] bg-primary mx-auto mb-4" />
          <div className="flex items-center justify-center gap-2 mb-2">
            <Heart className="w-4 h-4 text-primary fill-primary" />
            <p className="text-sm font-mono text-muted-foreground">
              For trusting us to bring your vision to life.
            </p>
          </div>
          <p className="text-xs font-mono text-muted-foreground max-w-md mx-auto mb-6">
            It's been an honor — your success is our success.
          </p>
          <div className="border-2 border-primary/30 p-6 max-w-lg mx-auto text-left">
            <p className="text-xs font-mono text-primary uppercase tracking-[0.3em] mb-3">
              What Happens Next
            </p>
            <p className="text-sm font-mono text-foreground leading-relaxed">
              All of your property — including source code, documentation, design assets, and any other tools
              or tech stack used for this project — will be delivered to you within the next week.
              You'll receive everything via the links section on your invoice portal.
            </p>
            <p className="text-sm font-mono text-foreground leading-relaxed mt-3">
              Thank you for choosing Reed Digital Group. We're honored to have been part of your journey.
            </p>
          </div>
        </motion.div>

        {/* Team Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="border-2 border-foreground p-8 md:p-12 mb-8"
        >
          <p className="text-xs font-mono text-primary uppercase tracking-[0.3em] mb-2">
            A Special Thanks
          </p>
          <h2 className="text-2xl md:text-3xl font-mono font-bold text-foreground tracking-tight mb-8">
            Meet the Team Behind Your Project
          </h2>
          <p className="text-base font-mono text-foreground leading-relaxed mb-10">
            Every project at Reed Digital Group is powered by a team of dedicated young professionals
            who care deeply about the work they do. We wanted to take a moment to introduce the
            people who helped make your vision a reality.
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            {team.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 + i * 0.15 }}
                className="border border-border p-6"
              >
                <div className="w-20 h-20 mb-4 overflow-hidden border-2 border-foreground">
                  <img
                    src={member.photo}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-lg font-mono font-bold text-foreground mb-1">
                  {member.name}
                </h3>
                <p className="text-xs font-mono text-primary uppercase tracking-[0.2em] mb-3">
                  {member.title}
                </p>
                <p className="text-sm font-mono text-foreground leading-relaxed">
                  {member.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

      {/* Sticky Note — fixed to the side, follows scroll */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 1 }}
        className="fixed top-32 right-4 z-50 hidden lg:block w-56"
        style={{ transform: "rotate(2deg)" }}
      >
        <div className="bg-[hsl(45,80%,75%)] p-5 shadow-[4px_6px_16px_rgba(0,0,0,0.2)] relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-14 h-5 bg-[hsl(45,20%,90%)] opacity-60" />
          <p className="text-[10px] font-mono text-[hsl(30,20%,25%)] uppercase tracking-[0.2em] mb-2 font-bold">
            📌 Referral Bonus
          </p>
          <p className="text-xs font-mono text-[hsl(30,20%,20%)] leading-relaxed mb-2">
            Refer someone to us and earn{" "}
            <span className="font-bold underline">15% of the project total</span> as a bonus!
            Have them mention your name.
          </p>
          <p className="text-[10px] font-mono text-[hsl(30,20%,30%)]">
            📧{" "}
            <a href="mailto:reeddigitalgroup@gmail.com" className="underline">
              reeddigitalgroup@gmail.com
            </a>
          </p>
        </div>
      </motion.div>

      {/* Mobile referral note (inline, since fixed side doesn't work on small screens) */}
      <div className="lg:hidden max-w-3xl mx-auto px-6 mb-8">
        <div
          className="bg-[hsl(45,80%,75%)] p-5 shadow-[4px_4px_12px_rgba(0,0,0,0.15)] relative mx-auto max-w-sm"
          style={{ transform: "rotate(-1deg)" }}
        >
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-14 h-5 bg-[hsl(45,20%,90%)] opacity-60" />
          <p className="text-[10px] font-mono text-[hsl(30,20%,25%)] uppercase tracking-[0.2em] mb-2 font-bold">
            📌 Referral Bonus
          </p>
          <p className="text-xs font-mono text-[hsl(30,20%,20%)] leading-relaxed mb-2">
            Refer someone to us and earn{" "}
            <span className="font-bold underline">15% of the project total</span> as a bonus!
            Have them mention your name.
          </p>
          <p className="text-[10px] font-mono text-[hsl(30,20%,30%)]">
            📧{" "}
            <a href="mailto:reeddigitalgroup@gmail.com" className="underline">
              reeddigitalgroup@gmail.com
            </a>
          </p>
        </div>
      </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="py-12 text-center"
        >
          <Link
            to="/"
            className="inline-flex items-center gap-4 h-14 px-10 text-sm font-mono uppercase tracking-[0.2em] border-2 border-foreground text-foreground hover:bg-foreground hover:text-background rounded-none transition-colors"
          >
            <img src={logo} alt="" className="h-4" />
            Visit the RDG Home
          </Link>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="border-t border-border mt-12">
        <div className="max-w-3xl mx-auto px-6 py-12 flex flex-col items-center gap-4">
          <img src={logo} alt="RDG" className="h-10 opacity-40" />
          <p className="text-xs font-mono text-muted-foreground text-center">
            If you have any questions, please contact{" "}
            <a href="mailto:reeddigitalgroup@gmail.com" className="text-primary hover:underline">
              reeddigitalgroup@gmail.com
            </a>
            {" "}or{" "}
            <a href="mailto:info@reeddigitalgroup.com" className="text-primary hover:underline">
              info@reeddigitalgroup.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default InvoiceThankYou;
