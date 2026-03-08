import { Button } from "@/components/ui/button";
import { LogIn, LogOut, Menu, Shield, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useTeamProfile } from "../hooks/useQueries";

interface NavbarProps {
  isAdmin: boolean;
  onAdminClick: () => void;
}

export function Navbar({ isAdmin, onAdminClick }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { data: teamProfile } = useTeamProfile();
  const { login, clear, identity, isLoggingIn } = useInternetIdentity();

  const teamName = teamProfile?.name ?? "Cricket Club";

  const logoUrl = teamProfile?.logo
    ? teamProfile.logo.getDirectURL()
    : "/assets/uploads/ChatGPT-Image-Mar-8-2026-11_18_51-AM-1.png";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { label: "Home", href: "#home", ocid: "nav.home_link" },
    { label: "Players", href: "#players", ocid: "nav.players_link" },
    { label: "About", href: "#about", ocid: "nav.about_link" },
  ];

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={
        scrolled
          ? {
              background: "oklch(0.10 0.02 128 / 0.95)",
              backdropFilter: "blur(16px)",
              borderBottom: "1px solid oklch(0.22 0.06 128)",
              boxShadow: "0 4px 20px oklch(0 0 0 / 0.4)",
            }
          : { background: "transparent" }
      }
    >
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo + Team Name */}
        <a href="#home" className="flex items-center gap-3 group">
          <div
            className="w-10 h-10 flex items-center justify-center flex-shrink-0"
            style={{
              filter: "drop-shadow(0 0 6px oklch(0.58 0.22 128 / 0.5))",
            }}
          >
            <img
              src={logoUrl}
              alt={teamName}
              className="w-full h-full object-contain"
            />
          </div>
          <span
            className="font-display font-bold text-base tracking-tight"
            style={{ color: "oklch(0.97 0.01 90)" }}
          >
            {teamName}
          </span>
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              data-ocid={link.ocid}
              className="field-line px-4 py-2 text-sm font-medium transition-colors"
              style={{ color: "oklch(0.60 0.06 128)" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.color =
                  "oklch(0.97 0.01 90)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.color =
                  "oklch(0.60 0.06 128)";
              }}
            >
              {link.label}
            </a>
          ))}
          {isAdmin && (
            <button
              type="button"
              data-ocid="nav.manage_link"
              onClick={onAdminClick}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium transition-colors ml-2"
              style={{ color: "oklch(0.75 0.26 128)" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.color =
                  "oklch(0.85 0.24 128)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.color =
                  "oklch(0.75 0.26 128)";
              }}
            >
              <Shield className="w-3.5 h-3.5" />
              Manage
            </button>
          )}
          <div
            className="ml-3 pl-3"
            style={{ borderLeft: "1px solid oklch(0.22 0.06 128)" }}
          >
            {identity ? (
              <button
                type="button"
                onClick={clear}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
                style={{ color: "oklch(0.55 0.05 128)" }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.color =
                    "oklch(0.85 0.02 90)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.color =
                    "oklch(0.55 0.05 128)";
                }}
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign out
              </button>
            ) : (
              <Button
                size="sm"
                onClick={login}
                disabled={isLoggingIn}
                className="gap-1.5 text-sm font-semibold"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.70 0.26 128), oklch(0.60 0.24 128))",
                  color: "oklch(0.08 0.018 128)",
                  border: "none",
                  boxShadow: "0 2px 12px oklch(0.70 0.26 128 / 0.3)",
                }}
              >
                <LogIn className="w-3.5 h-3.5" />
                {isLoggingIn ? "Signing in…" : "Sign in"}
              </Button>
            )}
          </div>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          className="md:hidden p-2 transition-colors"
          style={{ color: "oklch(0.55 0.05 128)" }}
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden"
            style={{
              background: "oklch(0.11 0.03 128 / 0.97)",
              borderBottom: "1px solid oklch(0.22 0.06 128)",
            }}
          >
            <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  data-ocid={link.ocid}
                  onClick={() => setMenuOpen(false)}
                  className="px-3 py-2.5 text-sm font-medium rounded-md transition-colors"
                  style={{ color: "oklch(0.60 0.06 128)" }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.color =
                      "oklch(0.97 0.01 90)";
                    (e.currentTarget as HTMLElement).style.background =
                      "oklch(0.18 0.05 128)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.color =
                      "oklch(0.60 0.06 128)";
                    (e.currentTarget as HTMLElement).style.background =
                      "transparent";
                  }}
                >
                  {link.label}
                </a>
              ))}
              {isAdmin && (
                <button
                  type="button"
                  data-ocid="nav.manage_link"
                  onClick={() => {
                    onAdminClick();
                    setMenuOpen(false);
                  }}
                  className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-left rounded-md transition-colors"
                  style={{ color: "oklch(0.75 0.26 128)" }}
                >
                  <Shield className="w-3.5 h-3.5" />
                  Manage Team
                </button>
              )}
              <div
                className="mt-2 pt-2"
                style={{ borderTop: "1px solid oklch(0.22 0.06 128)" }}
              >
                {identity ? (
                  <button
                    type="button"
                    onClick={clear}
                    className="w-full flex items-center gap-2 px-3 py-2.5 text-sm font-medium rounded-md transition-colors"
                    style={{ color: "oklch(0.55 0.05 128)" }}
                  >
                    <LogOut className="w-4 h-4" />
                    Sign out
                  </button>
                ) : (
                  <Button
                    size="sm"
                    onClick={login}
                    disabled={isLoggingIn}
                    className="w-full gap-2 font-semibold"
                    style={{
                      background:
                        "linear-gradient(135deg, oklch(0.70 0.26 128), oklch(0.60 0.24 128))",
                      color: "oklch(0.08 0.018 128)",
                      border: "none",
                    }}
                  >
                    <LogIn className="w-4 h-4" />
                    {isLoggingIn ? "Signing in…" : "Sign in"}
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
