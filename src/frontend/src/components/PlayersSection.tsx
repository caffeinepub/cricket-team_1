import { motion } from "motion/react";
import { useAllPlayers } from "../hooks/useQueries";
import { PlayerCard, PlayerCardSkeleton } from "./PlayerCard";

export function PlayersSection() {
  const { data: players, isLoading } = useAllPlayers();

  const hasPlayers = players && players.length > 0;

  return (
    <section
      id="players"
      data-ocid="players.section"
      className="py-20 sm:py-28 px-4 sm:px-6"
      style={{ background: "oklch(0.09 0.02 128)" }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="mb-14 text-center sm:text-left">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span
              className="inline-block text-xs font-semibold tracking-[0.2em] uppercase mb-3"
              style={{ color: "oklch(0.75 0.26 128)" }}
            >
              The Squad
            </span>
            <h2
              className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl tracking-tight leading-tight"
              style={{ color: "oklch(0.97 0.01 90)" }}
            >
              Meet Our Players
            </h2>
          </motion.div>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 h-0.5 hidden sm:block"
            style={{
              width: "60px",
              background:
                "linear-gradient(90deg, oklch(0.75 0.26 128), oklch(0.68 0.24 128))",
              transformOrigin: "left",
            }}
          />
        </div>

        {/* Players grid */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(["sk1", "sk2", "sk3", "sk4", "sk5", "sk6"] as const).map(
              (k, i) => (
                <PlayerCardSkeleton key={k} index={i} />
              ),
            )}
          </div>
        )}

        {!isLoading && hasPlayers && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {players.map((player, i) => (
              <PlayerCard key={player.name} player={player} index={i} />
            ))}
          </div>
        )}

        {!isLoading && !hasPlayers && (
          <motion.div
            data-ocid="players.empty_state"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-center py-20 rounded-2xl border border-dashed"
            style={{
              borderColor: "oklch(0.28 0.08 128)",
              background: "oklch(0.12 0.03 128 / 0.5)",
            }}
          >
            <div className="text-4xl mb-4">🏏</div>
            <h3
              className="font-display font-semibold text-lg mb-2"
              style={{ color: "oklch(0.95 0.01 90)" }}
            >
              No players yet
            </h3>
            <p style={{ color: "oklch(0.55 0.05 128)" }} className="text-sm">
              Sign in as an admin to add players to the squad.
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
