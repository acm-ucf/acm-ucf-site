"use client";
import { Logo } from "@/components/logo";
import { NavMenu } from "./nav-menu";
import { SilverButton } from "@/components/ui/silver-button";
import { SpinningBorderButton } from "@/components/ui/spinning-border-button";

const Navbar = () => {
  return (
    <div className="bg-muted">
      <nav className="fixed top-6 inset-x-4 h-16 z-50 bg-black/80 border dark:border-slate-700/70 max-w-(--breakpoint-xl) mx-auto rounded-full">
        <div className="h-full flex items-center justify-between mx-auto px-4">
          <Logo />
          {/* Desktop Menu */}
          <NavMenu className="hidden md:block" />

          <div className="flex items-center gap-3">
            <SpinningBorderButton
              onClick={() =>
                window.open(
                  "https://linktr.ee/acmucf",
                  "_blank",
                  "noopener,noreferrer",
                )
              }
              className="hover:shadow-[0_0_25px_rgba(253,216,53,0.8)]
           hover:shadow-yellow-600/60 duration-200"
            >
              Linktree
            </SpinningBorderButton>
            <SilverButton
              label="Discord"
              href="https://discord.gg/gJCSxhR8RY"
              className="hover:shadow-[0_0_25px_rgba(0,0,0,0.8)] hover:shadow-white/40 duration-200"
            />
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
