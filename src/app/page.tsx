"use client";
import Link from "next/link";
import DecryptedText from "@/components/ui/decrypt-text";
import { SilverButton } from "@/components/ui/silver-button";
import { SpinningBorderButton } from "@/components/ui/spinning-border-button";
import Squares from "@/components/ui/a-bg";
import { teamMembers } from "@/constants/officers";
import GetInvolvedSection from "@/components/get-involved-section";
import TeamGrid from "@/components/ui/a-grid";

export default function Index() {
  return (
    <>
      {/* <div className="relative min-h-screen overflow-hidden"> */}
      <div className="relative min-h-screen w-full flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0 hidden md:block md:mask-[linear-gradient(110deg,transparent_50%,black_50%)]">
          <Squares
            direction="diagonal"
            speed={0.4}
            borderColor="#ffffff"
            squareSize={40}
            hoverFillColor={"#ffd700"}
          />
        </div>

        <main className="z-10 flex flex-col justify-center min-h-screen px-6 sm:px-12 lg:px-20 w-full max-w-6xl mx-auto md:w-1/2 md:max-w-none md:mx-0">
          <div className="md:mt-20">
            <section className="">
              <DecryptedText
                text="Association for Computing Machinery"
                animateOn="view"
                className="font-catamaran xl:text-6xl 2xl:text-7xl text-5xl text-foreground font-black md:text-5xl"
                parentClassName="max-w-full font-catamaran"
                encryptedClassName="max font-catamaran text-foreground text-4xl font-black md:text-5xl 2xl:text-6xl"
                speed={60}
                maxIterations={10}
                sequential={true}
                revealDirection="start"
              />
              <p className="mt-6 max-w-[60ch] font-bmono text-foreground text-lg">
                The official chapter for Association for Computing Machinery{" "}
                {"(ACM)"} at the University of Central Florida.
              </p>
              <div className="mt-12 flex items-center gap-4">
                <SilverButton
                  label="Discord"
                  href="https://discord.gg/gJCSxhR8RY"
                  className="hover:shadow-[0_0_25px_rgba(0,0,0,0.8)] hover:shadow-white/40 duration-200"
                />
                {/* <Link href="/check-in">
                  <SpinningBorderButton className="hover:shadow-[0_0_25px_rgba(253,216,53,0.8)] hover:shadow-yellow-600/60 duration-200">
                    Check In
                  </SpinningBorderButton>
                </Link> */}
              </div>
            </section>
          </div>
        </main>
      </div>
      {/* Calendar/Membership */}
      <GetInvolvedSection />
      {/* Team Members */}
      <section className="py-16 px-4 md:px-8">
        <div className="max-w-7xl mx-auto w-full">
          <div className="text-foreground mb-10 text-center">
            <h2 className="text-4xl md:text-5xl font-catamaran font-black mb-4">
              Meet the <span className="text-yellow-400">Team</span>
            </h2>
            <p className="text-gray-300 font-bmono text-lg">
              The officers behind ACM@UCF.
            </p>
          </div>
          <TeamGrid items={teamMembers} />
        </div>
      </section>
    </>
  );
}
