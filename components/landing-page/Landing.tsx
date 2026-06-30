"use client";
import { useState, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
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
import { AUTH_PARAM, AUTH_MODES, type AuthMode } from "@/lib/utils/constants";

const Landing = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const paramMode = searchParams.get(AUTH_PARAM);
  const initialMode = AUTH_MODES.find((m) => m === paramMode) ?? null;

  const [showLoader, setShowLoader] = useState(true);
  const [authMode, setAuthMode] = useState<AuthMode | null>(initialMode);
  const { user } = useAuth();

  useEffect(() => {
    // Hide immediately once the user is known, else after a brief splash.
    const t = setTimeout(() => setShowLoader(false), user ? 0 : 1000);
    return () => clearTimeout(t);
  }, [user]);

  const openRegister = () => setAuthMode("register");
  const closeAuth = () => {
    setAuthMode(null);
    // Drop the ?auth= param so closing doesn't leave it in the URL (and so a
    // refresh doesn't reopen the modal).
    if (searchParams.has(AUTH_PARAM)) {
      const params = new URLSearchParams(searchParams.toString());
      params.delete(AUTH_PARAM);
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      });
    }
  };

  return (
    <div className="min-h-screen bg-[var(--paper)]">
      {showLoader && <LoaderFullscreen />}

      <LandingNav onGetStarted={openRegister} />

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
