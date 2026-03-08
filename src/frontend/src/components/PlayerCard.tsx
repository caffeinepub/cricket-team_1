import { motion } from "motion/react";
import type { Player } from "../backend.d";

const ROLE_LABELS: Record<string, string> = {
  batsman: "Batsman",
  bowler: "Bowler",
  allRounder: "All-Rounder",
  wicketKeeper: "Wicket-Keeper",
};

const ROLE_COLORS: Record<
  string,
  { bg: string; text: string; border: string }
> = {
  batsman: {
    bg: "oklch(0.68 0.24 128 / 0.12)",
    text: "oklch(0.75 0.24 128)",
    border: "oklch(0.68 0.24 128 / 0.3)",
  },
  bowler: {
    bg: "oklch(0.65 0.22 135 / 0.15)",
    text: "oklch(0.72 0.22 135)",
    border: "oklch(0.65 0.22 135 / 0.35)",
  },
  allRounder: {
    bg: "oklch(0.82 0.22 125 / 0.12)",
    text: "oklch(0.85 0.22 125)",
    border: "oklch(0.82 0.22 125 / 0.3)",
  },
  wicketKeeper: {
    bg: "oklch(0.65 0.20 130 / 0.1)",
    text: "oklch(0.70 0.18 130)",
    border: "oklch(0.65 0.20 130 / 0.25)",
  },
};

interface PlayerCardProps {
  player: Player;
  index: number;
}

export function PlayerCard({ player, index }: PlayerCardProps) {
  const roleKey = player.role.__kind__;
  const roleLabel = ROLE_LABELS[roleKey] ?? roleKey;
  const roleColor = ROLE_COLORS[roleKey] ?? ROLE_COLORS.batsman;

  const photoUrl = player.photo
    ? player.photo.getDirectURL()
    : "/assets/generated/player-avatar-placeholder-transparent.png";

  return (
    <motion.article
      data-ocid={`players.item.${index + 1}`}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.45,
        delay: (index % 3) * 0.08,
        ease: "easeOut",
      }}
      className="group relative rounded-xl overflow-hidden border transition-all duration-300"
      style={{
        background: "oklch(0.12 0.03 128)",
        borderColor: "oklch(0.22 0.06 128)",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor =
          "oklch(0.58 0.22 128 / 0.5)";
        (e.currentTarget as HTMLElement).style.boxShadow =
          "0 8px 30px oklch(0.45 0.20 128 / 0.3)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor =
          "oklch(0.22 0.06 128)";
        (e.currentTarget as HTMLElement).style.boxShadow = "none";
      }}
    >
      {/* Photo */}
      <div
        className="player-photo-wrapper relative aspect-[3/4] overflow-hidden"
        style={{ background: "oklch(0.10 0.03 128)" }}
      >
        <img
          src={photoUrl}
          alt={player.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src =
              "/assets/generated/player-avatar-placeholder-transparent.png";
          }}
        />
        {/* Electric lime gradient overlay at bottom */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, oklch(0.08 0.03 128 / 0.8) 0%, transparent 40%)",
          }}
        />
        {/* Jersey number badge */}
        <div
          className="absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center font-display font-bold text-sm"
          style={{
            background: "oklch(0.70 0.26 128 / 0.9)",
            color: "oklch(0.08 0.018 128)",
            backdropFilter: "blur(4px)",
            boxShadow: "0 2px 8px oklch(0.70 0.26 128 / 0.4)",
          }}
        >
          {player.jerseyNumber.toString()}
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3
          className="font-display font-bold text-base leading-tight truncate"
          style={{ color: "oklch(0.97 0.01 90)" }}
        >
          {player.name}
        </h3>
        <div className="mt-2">
          <span
            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border"
            style={{
              background: roleColor.bg,
              color: roleColor.text,
              borderColor: roleColor.border,
            }}
          >
            {roleLabel}
          </span>
        </div>
        {player.bio && (
          <p
            className="mt-2 text-xs line-clamp-2 leading-relaxed"
            style={{ color: "oklch(0.55 0.05 128)" }}
          >
            {player.bio}
          </p>
        )}
      </div>
    </motion.article>
  );
}

export function PlayerCardSkeleton({ index }: { index: number }) {
  return (
    <div
      data-ocid={`players.item.${index + 1}`}
      className="rounded-xl overflow-hidden border animate-pulse"
      style={{
        background: "oklch(0.12 0.03 128)",
        borderColor: "oklch(0.22 0.06 128)",
      }}
    >
      <div
        className="aspect-[3/4]"
        style={{ background: "oklch(0.16 0.04 128)" }}
      />
      <div className="p-4 space-y-2">
        <div
          className="h-4 rounded w-3/4"
          style={{ background: "oklch(0.20 0.05 128)" }}
        />
        <div
          className="h-5 rounded-full w-24"
          style={{ background: "oklch(0.20 0.05 128)" }}
        />
        <div
          className="h-3 rounded w-full"
          style={{ background: "oklch(0.18 0.03 128)" }}
        />
        <div
          className="h-3 rounded w-2/3"
          style={{ background: "oklch(0.18 0.03 128)" }}
        />
      </div>
    </div>
  );
}
