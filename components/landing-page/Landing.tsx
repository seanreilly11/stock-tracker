"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import LoaderFullscreen from "@/components/common/LoaderFullscreen";
import LandingNav from "@/components/landing-page/LandingNav";
import HeroSection from "@/components/landing-page/HeroSection";
import MomentSection from "@/components/landing-page/MomentSection";
import WhySection from "@/components/landing-page/WhySection";
import FeelSection from "@/components/landing-page/FeelSection";
import NotListSection from "@/components/landing-page/NotListSection";
import GlimpsesSection from "@/components/landing-page/GlimpsesSection";
import FAQSection from "@/components/landing-page/FAQSection";
import ClosingSection from "@/components/landing-page/ClosingSection";
import LandingFooter from "@/components/landing-page/LandingFooter";
import AuthModal from "@/components/auth/AuthModal";

type AuthMode = "login" | "register" | null;

const Landing = () => {
  const [showLoader, setShowLoader] = useState(true);
  const [authMode, setAuthMode] = useState<AuthMode>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) setShowLoader(false);
    const t = setTimeout(() => setShowLoader(false), 1000);
    return () => clearTimeout(t);
  }, [user]);

  const openLogin = () => setAuthMode("login");
  const openRegister = () => setAuthMode("register");
  const closeAuth = () => setAuthMode(null);

  return (
    <div className="min-h-screen bg-[var(--paper)]">
      {showLoader && <LoaderFullscreen />}

      <LandingNav onSignIn={openLogin} onGetStarted={openRegister} />

      <HeroSection onGetStarted={openRegister} />
      <MomentSection />
      <WhySection />
      <FeelSection />
      <NotListSection />
      <GlimpsesSection />
      <FAQSection />
      <ClosingSection onGetStarted={openRegister} />
      <LandingFooter />

      <AuthModal
        open={authMode !== null}
        mode={authMode ?? "login"}
        onClose={closeAuth}
        onSwitchMode={setAuthMode}
      />
    </div>
  );
};

export default Landing;
