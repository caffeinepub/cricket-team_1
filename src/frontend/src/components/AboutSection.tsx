import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "motion/react";
import { useTeamProfile } from "../hooks/useQueries";

const DEFAULT_ABOUT = `We are a passionate cricket club united by our love for the game. Founded on the principles of fair play, camaraderie, and competitive spirit, our team has grown from a group of weekend enthusiasts into a formidable side that competes at the highest local level.

Every match is an opportunity to improve, to bond, and to represent our community with pride. On and off the field, we hold ourselves to the highest standards — as cricketers and as individuals.

Join us on this journey as we continue to chase victories, build lasting friendships, and write the next chapter of our story.`;

export function AboutSection() {
  const { data: teamProfile, isLoading } = useTeamProfile();

  const about = teamProfile?.about ?? DEFAULT_ABOUT;
  const teamName = teamProfile?.name ?? "Cricket Club";

  return (
    <section
      id="about"
      data-ocid="about.section"
      className="py-20 sm:py-28 px-4 sm:px-6 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(160deg, oklch(0.13 0.03 128) 0%, oklch(0.08 0.018 128) 100%)",
      }}
    >
      {/* Electric lime bloom — top right */}
      <div
        className="absolute top-0 right-0 w-96 h-96 -translate-y-1/4 translate-x-1/4 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse, oklch(0.42 0.17 128 / 0.18) 0%, transparent 70%)",
        }}
      />
      {/* Decorative circle bottom-left */}
      <div
        className="absolute bottom-0 left-0 w-64 h-64 opacity-5 translate-y-1/4 -translate-x-1/4 pointer-events-none"
        style={{
          border: "30px solid oklch(0.68 0.24 128)",
          borderRadius: "50%",
        }}
      />

      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left: Label + heading */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.55, ease: "easeOut" }}
          >
            <span
              className="inline-block text-xs font-semibold tracking-[0.2em] uppercase mb-4"
              style={{ color: "oklch(0.75 0.26 128)" }}
            >
              About Us
            </span>
            <h2
              className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl tracking-tight leading-tight mb-0"
              style={{ color: "oklch(0.97 0.01 90)" }}
            >
              {isLoading ? (
                <Skeleton
                  className="h-12 w-3/4"
                  style={{ background: "oklch(0.20 0.05 128)" }}
                />
              ) : (
                teamName
              )}
            </h2>
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-5 h-0.5"
              style={{
                width: "60px",
                background:
                  "linear-gradient(90deg, oklch(0.75 0.26 128), oklch(0.88 0.20 128))",
                transformOrigin: "left",
              }}
            />

            {/* Stats row */}
            <div className="mt-10 grid grid-cols-3 gap-6">
              {[
                { value: "11", label: "Starting XI" },
                { value: "∞", label: "Passion" },
                { value: "1", label: "Team" },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.2 + i * 0.08 }}
                  className="text-center"
                >
                  <div
                    className="font-display font-bold text-3xl"
                    style={{ color: "oklch(0.75 0.26 128)" }}
                  >
                    {stat.value}
                  </div>
                  <div
                    className="text-xs font-medium mt-1 tracking-wide uppercase"
                    style={{ color: "oklch(0.50 0.05 128)" }}
                  >
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right: About text */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.55, ease: "easeOut", delay: 0.1 }}
          >
            {isLoading ? (
              <div className="space-y-3">
                {(["100%", "100%", "75%", "100%", "100%", "75%"] as const).map(
                  (w, i) => (
                    <Skeleton
                      // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton array, order never changes
                      key={i}
                      className="h-4"
                      style={{ width: w, background: "oklch(0.20 0.05 128)" }}
                    />
                  ),
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {about.split("\n\n").map((paragraph) => (
                  <p
                    key={paragraph.slice(0, 40)}
                    className="text-base leading-relaxed"
                    style={{ color: "oklch(0.62 0.05 128)" }}
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
