"use client";

import Link from "next/link";
import GoogleCalendar from "@/components/ui/calendar";

export default function GetInvolvedSection() {
  return (
    <section className="min-h-screen flex items-center justify-center py-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto w-full">
        <div className="text-foreground mb-12 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-catamaran font-black mb-6">
            Get <span className="text-yellow-400">Involved</span>
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div>
            <GoogleCalendar />
          </div>

          {/* Right: Membership */}
          <div className="flex flex-col items-center justify-center h-full gap-8">
            <div className="text-foreground text-center">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-catamaran font-black mb-6">
                <span className="text-yellow-400">Member</span>ship
              </h2>
              <p className="text-gray-300 font-bmono leading-7 text-lg max-w-3xl mx-auto">
                Join ACM@UCF and become part of our community.
              </p>
            </div>

            <div className="bg-black/40 backdrop-blur-sm border border-gray-700 rounded-lg p-8 w-fit">
              <div className="text-center">
                <Link
                  href="/get-involved/membership"
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-foreground px-8 py-3 rounded-md transition-colors font-bmono font-medium text-lg"
                >
                  Membership Form
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
