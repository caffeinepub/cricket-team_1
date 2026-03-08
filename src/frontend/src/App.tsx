import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";
import { AboutSection } from "./components/AboutSection";
import { AdminPanel } from "./components/AdminPanel";
import { Footer } from "./components/Footer";
import { HeroSection } from "./components/HeroSection";
import { Navbar } from "./components/Navbar";
import { PlayersSection } from "./components/PlayersSection";
import { useIsAdmin } from "./hooks/useQueries";

export default function App() {
  const [adminOpen, setAdminOpen] = useState(false);
  const { data: isAdmin } = useIsAdmin();

  return (
    <div className="min-h-screen bg-background">
      <Navbar isAdmin={!!isAdmin} onAdminClick={() => setAdminOpen(true)} />
      <main>
        <HeroSection />
        <PlayersSection />
        <AboutSection />
      </main>
      <Footer />
      {isAdmin && (
        <AdminPanel open={adminOpen} onClose={() => setAdminOpen(false)} />
      )}
      <Toaster richColors position="bottom-right" />
    </div>
  );
}
