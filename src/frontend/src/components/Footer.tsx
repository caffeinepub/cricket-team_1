import { useTeamProfile } from "../hooks/useQueries";

export function Footer() {
  const { data: teamProfile } = useTeamProfile();
  const teamName = teamProfile?.name ?? "Cricket Club";
  const currentYear = new Date().getFullYear();
  const caffeineUrl = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`;

  return (
    <footer
      style={{
        background: "oklch(0.09 0.02 128)",
        borderTop: "1px solid oklch(0.18 0.05 128)",
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span
            className="font-display font-bold text-sm"
            style={{ color: "oklch(0.97 0.01 90)" }}
          >
            {teamName}
          </span>
          <span style={{ color: "oklch(0.30 0.08 128)" }}>·</span>
          <span className="text-xs" style={{ color: "oklch(0.45 0.05 128)" }}>
            © {currentYear}. All rights reserved.
          </span>
        </div>
        <div className="text-xs" style={{ color: "oklch(0.45 0.05 128)" }}>
          Built with{" "}
          <span style={{ color: "oklch(0.75 0.26 128)" }} aria-label="love">
            ♥
          </span>{" "}
          using{" "}
          <a
            href={caffeineUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors underline underline-offset-2"
            style={{ color: "oklch(0.68 0.24 128)" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.color =
                "oklch(0.82 0.22 128)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.color =
                "oklch(0.68 0.24 128)";
            }}
          >
            caffeine.ai
          </a>
        </div>
      </div>
    </footer>
  );
}
