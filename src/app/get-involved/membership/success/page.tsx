"use client";
import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function SuccessContent() {
  const searchParams = useSearchParams();
  const name = searchParams.get("name") || "Member";
  const email = searchParams.get("email") || "";
  const membershipType = searchParams.get("type") || "yearly";
  const amount = searchParams.get("amount") || "25";

  const membershipLabel =
    membershipType === "yearly" ? "Yearly Membership" : "Semester Membership";

  return (
    <div className="text-center">
      {/* Success Icon */}
      <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg
          className="w-10 h-10 text-foreground"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>

      <h1 className="text-3xl font-catamaran font-black text-foreground mb-4">
        Payment Successful!
      </h1>
      <p className="text-gray-300 font-bmono mb-6">
        Thank you for becoming a paid member of ACM UCF!
      </p>

      {/* Membership Details */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 mb-6 text-left">
        <h2 className="text-lg font-catamaran font-semibold text-foreground mb-4">
          Membership Details
        </h2>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-400 font-bmono">Name:</span>
            <span className="text-foreground font-bmono">{name}</span>
          </div>
          {email && (
            <div className="flex justify-between">
              <span className="text-gray-400 font-bmono">Email:</span>
              <span className="text-foreground font-bmono">{email}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-gray-400 font-bmono">Membership Type:</span>
            <span className="text-foreground font-bmono">
              {membershipLabel}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400 font-bmono">Amount Paid:</span>
            <span className="text-green-400 font-bmono font-semibold">
              ${amount}.00
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400 font-bmono">Status:</span>
            <span className="text-green-400 font-bmono">Active</span>
          </div>
        </div>
      </div>

      {/* What's Next */}
      <div className="bg-blue-600/20 border border-blue-500/50 rounded-lg p-4 mb-6 text-left">
        <h3 className="text-sm font-catamaran font-semibold text-blue-400 mb-2">
          What's Next?
        </h3>
        <ul className="text-sm text-gray-300 font-bmono space-y-1">
          <li>• Join our Discord server for updates</li>
          <li>• Check out upcoming events</li>
          <li>• Connect with other members</li>
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href="/"
          className="bg-blue-600 hover:bg-blue-700 text-foreground px-6 py-3 rounded-md transition-colors font-bmono font-medium"
        >
          Go Home
        </Link>
        <Link
          href="/get-involved/events"
          className="bg-gray-700 hover:bg-gray-600 text-foreground px-6 py-3 rounded-md transition-colors font-bmono font-medium"
        >
          View Events
        </Link>
      </div>

      <p className="text-gray-500 font-bmono text-xs mt-6">
        Please contact any of the officers if you have any questions.
      </p>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
      <p className="text-gray-300 font-bmono">Loading...</p>
    </div>
  );
}

export default function MembershipSuccess() {
  return (
    <main className="relative w-full min-h-screen sm:p-12">
      <div className="absolute inset-0 z-30"></div>

      <div className="relative z-30 flex items-center justify-center min-h-screen py-8">
        <div className="bg-black/40 backdrop-blur-sm border border-gray-700 rounded-lg p-8 max-w-lg w-full mx-4">
          <Suspense fallback={<LoadingFallback />}>
            <SuccessContent />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
