import { ChevronDown } from "lucide-react";
import { motion } from "motion/react";
import { useTeamProfile } from "../hooks/useQueries";

export function HeroSection() {
  const { data: teamProfile, isLoading } = useTeamProfile();

  const teamName = teamProfile?.name ?? "The Cricketers";
  const tagline =
    teamProfile?.tagline ?? "Playing with heart, winning with grace.";
  const logoUrl = teamProfile?.logo
    ? teamProfile.logo.getDirectURL()
    : "/assets/uploads/ChatGPT-Image-Mar-8-2026-11_18_51-AM-1.png";

  return (
    <section
      id="home"
      data-ocid="hero.section"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Dark background base */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background: "oklch(0.08 0.018 128)",
        }}
      />

      {/* Electric lime radial gradient — center bloom */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 70% 65% at 50% 40%, oklch(0.40 0.15 128 / 0.65) 0%, oklch(0.18 0.07 128 / 0.4) 45%, transparent 75%)",
        }}
      />

      {/* Secondary lime bloom — upper left */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 50% 40% at 20% 20%, oklch(0.42 0.17 128 / 0.3) 0%, transparent 60%)",
        }}
      />

      {/* Subtle grid lines */}
      <div
        className="absolute inset-0 -z-10 opacity-8"
        style={{
          backgroundImage:
            "linear-gradient(oklch(0.68 0.24 128 / 0.08) 1px, transparent 1px), linear-gradient(90deg, oklch(0.68 0.24 128 / 0.08) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      {/* Cricket pitch oval decoration */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 opacity-6"
        style={{
          width: "min(700px, 90vw)",
          height: "min(700px, 90vw)",
          border: "1px solid oklch(0.68 0.24 128 / 0.25)",
          borderRadius: "50%",
        }}
      />
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 opacity-6"
        style={{
          width: "min(500px, 70vw)",
          height: "min(500px, 70vw)",
          border: "1px solid oklch(0.68 0.24 128 / 0.15)",
          borderRadius: "50%",
        }}
      />

      {/* Content */}
      <div className="text-center px-4 sm:px-6 max-w-3xl mx-auto">
        {/* Logo */}
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex justify-center mb-8"
        >
          <div
            className="w-40 h-40 sm:w-52 sm:h-52 relative flex items-center justify-center"
            style={{
              filter:
                "drop-shadow(0 0 30px oklch(0.58 0.22 128 / 0.55)) drop-shadow(0 20px 40px oklch(0 0 0 / 0.5))",
            }}
          >
            {isLoading ? (
              <div className="w-full h-full rounded-2xl bg-muted animate-pulse" />
            ) : (
              <img
                src={logoUrl}
                alt={teamName}
                className="w-full h-full object-contain"
              />
            )}
          </div>
        </motion.div>

        {/* Team Name */}
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
          className="font-display font-bold leading-none tracking-tight text-balance mb-5"
          style={{
            fontSize: "clamp(2.5rem, 8vw, 5.5rem)",
            color: "oklch(0.97 0.01 90)",
            textShadow: "0 2px 20px oklch(0 0 0 / 0.5)",
          }}
        >
          {isLoading ? (
            <span
              className="inline-block rounded-lg animate-pulse"
              style={{
                background: "oklch(0.2 0.05 128)",
                width: "300px",
                height: "1em",
              }}
            />
          ) : (
            teamName
          )}
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.28, ease: "easeOut" }}
          className="text-base sm:text-lg font-medium tracking-wide"
          style={{ color: "oklch(0.88 0.20 128)" }}
        >
          {isLoading ? (
            <span
              className="inline-block rounded animate-pulse"
              style={{
                background: "oklch(0.2 0.05 128)",
                width: "200px",
                height: "1.2em",
              }}
            />
          ) : (
            tagline
          )}
        </motion.p>

        {/* Divider accent — lime line */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.45, ease: "easeOut" }}
          className="mx-auto mt-8 h-px"
          style={{
            width: "80px",
            background:
              "linear-gradient(90deg, transparent, oklch(0.75 0.26 128), transparent)",
          }}
        />

        {/* CTA */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.55, ease: "easeOut" }}
          className="mt-8 flex items-center justify-center gap-4"
        >
          <a
            href="#players"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-all duration-200"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.75 0.26 128), oklch(0.65 0.24 128))",
              color: "oklch(0.08 0.018 128)",
              boxShadow: "0 4px 20px oklch(0.75 0.26 128 / 0.35)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow =
                "0 4px 28px oklch(0.75 0.26 128 / 0.55)";
              (e.currentTarget as HTMLElement).style.transform =
                "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow =
                "0 4px 20px oklch(0.75 0.26 128 / 0.35)";
              (e.currentTarget as HTMLElement).style.transform =
                "translateY(0)";
            }}
          >
            Meet the Squad
          </a>
          <a
            href="#about"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold border transition-all duration-200"
            style={{
              borderColor: "oklch(0.68 0.24 128 / 0.5)",
              color: "oklch(0.85 0.10 128)",
              background: "oklch(0.68 0.24 128 / 0.08)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor =
                "oklch(0.68 0.24 128 / 0.9)";
              (e.currentTarget as HTMLElement).style.color =
                "oklch(0.97 0.01 90)";
              (e.currentTarget as HTMLElement).style.background =
                "oklch(0.68 0.24 128 / 0.15)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor =
                "oklch(0.68 0.24 128 / 0.5)";
              (e.currentTarget as HTMLElement).style.color =
                "oklch(0.85 0.10 128)";
              (e.currentTarget as HTMLElement).style.background =
                "oklch(0.68 0.24 128 / 0.08)";
            }}
          >
            Our Story
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.8,
          delay: 1,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <ChevronDown
          className="w-6 h-6"
          style={{ color: "oklch(0.68 0.24 128 / 0.5)" }}
        />
      </motion.div>
    </section>
  );
}
