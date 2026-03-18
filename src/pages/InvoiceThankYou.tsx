import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import logo from "@/assets/rdg-header-logo.png";
import kimoraPhoto from "@/assets/team/kimora-taylor.jpg";
import seydinaPhoto from "@/assets/team/seydina-salla.jpg";
import terellPhoto from "@/assets/team/terell-reed.jpg";
import lawrencePhoto from "@/assets/team/lawrence-wright.jpg";

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
    name: "Lawrence Wright",
    title: "Project Manager & Backend Developer",
    description:
      "Lawrence keeps every project on track and every system running smoothly. As both a project manager and backend developer, he bridges the gap between strategy and execution, ensuring timely delivery and technical excellence.",
    photo: lawrencePhoto,
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
        {/* Thank You Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="py-16 text-center"
        >
          <img src={logo} alt="Reed Digital Group" className="h-12 mx-auto mb-8" />
          <h1 className="text-4xl md:text-6xl font-mono font-bold text-foreground tracking-tight mb-6">
            <em>Thank You</em>
          </h1>
          <div className="w-16 h-[2px] bg-primary mx-auto mb-8" />
        </motion.div>

        {/* Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="border-2 border-foreground p-8 md:p-12 mb-8"
        >
          <p className="text-lg md:text-xl font-mono text-foreground leading-relaxed mb-6">
            Thank you for your payment and for trusting Reed Digital Group to bring your vision to life.
          </p>
          <p className="text-base font-mono text-foreground leading-relaxed mb-6">
            It has been our sincere privilege to work alongside you. We hope that throughout this
            journey, you have felt the care, professionalism, and dedication that we pour into every
            project we touch. Your success is our success, and we take that responsibility to heart.
          </p>
          <p className="text-base font-mono text-foreground leading-relaxed mb-6">
            From the very first conversation to the final deliverable, our goal has always been
            simple: to treat every client the way we would want to be treated — with respect,
            transparency, and an unwavering commitment to excellence. We hope that is exactly what
            you experienced.
          </p>
          <p className="text-base font-mono text-foreground leading-relaxed">
            Thank you for making your dreams our mission. It has been an honor turning them into reality.
          </p>
        </motion.div>

        {/* Referral */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="border-2 border-foreground p-8 md:p-12 mb-8"
        >
          <p className="text-xs font-mono text-primary uppercase tracking-[0.3em] mb-4">
            Referral Program
          </p>
          <p className="text-base font-mono text-foreground leading-relaxed mb-4">
            Know someone who could benefit from what we do? We would love to help them too. As a
            token of our gratitude, we offer a 15% referral discount to anyone you send our way.
            Simply have them mention your name when they reach out, and we will take care of the rest.
          </p>
          <p className="text-sm font-mono text-foreground">
            Reach us at{" "}
            <a href="mailto:reeddigitalgroup@gmail.com" className="text-primary hover:underline">
              reeddigitalgroup@gmail.com
            </a>
          </p>
        </motion.div>

        {/* Team Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="border-2 border-foreground p-8 md:p-12 mb-8"
        >
          <p className="text-xs font-mono text-primary uppercase tracking-[0.3em] mb-2">
            A Special Thanks
          </p>
          <h2 className="text-2xl md:text-3xl font-mono font-bold text-foreground tracking-tight mb-8">
            Meet the Team Behind Your Project
          </h2>
          <p className="text-base font-mono text-foreground leading-relaxed mb-10">
            Every project at Reed Digital Group is powered by a team of dedicated professionals
            who care deeply about the work they do. We wanted to take a moment to introduce the
            people who helped make your vision a reality.
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            {team.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.9 + i * 0.15 }}
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

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
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
