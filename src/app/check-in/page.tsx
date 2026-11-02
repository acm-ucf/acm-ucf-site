"use client";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { createPortal } from "react-dom";
import { Scanner } from "@yudiel/react-qr-scanner";
import { HiQrcode } from "react-icons/hi";
import { createClient } from "@/utils/supabase/client";

interface CheckInFormData {
  firstName: string;
  lastName: string;
  email: string;
  studentId: string;
}
// WIP
export default function CheckIn() {
  const [submitted, setSubmitted] = useState(false);
  const [justCheckedIn, setJustCheckedIn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [showManualForm, setShowManualForm] = useState(false);
  const [mounted, setMounted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CheckInFormData>();

  const supabase = createClient();

  useEffect(() => {
    setMounted(true);
  }, []);

  // WIP
  const handleQrScan = (result: string) => {
    try {
      if (
        result &&
        (result.startsWith("http://") || result.startsWith("https://"))
      ) {
        window.location.href = result;
      } else {
        const url = result.startsWith("http") ? result : `https://${result}`;
        window.location.href = url;
      }
    } catch (err) {
      setError("Invalid QR code. Please try again.");
      console.error("Error processing QR code:", err);
    }
  };

  const onSubmit = async (data: CheckInFormData) => {
    try {
      const { error: insertError } = await supabase.from("checkins").insert({
        event_id: null,
        event_title: null,
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        student_id: data.studentId || null,
      });

      if (insertError) throw insertError;

      setJustCheckedIn(true);

      setTimeout(() => {
        setSubmitted(true);
      }, 1500);
    } catch (err) {
      setError("Failed to submit check-in. Please try again.");
      console.error("Error submitting check-in:", err);
    }
  };

  if (submitted) {
    return (
      <main className="relative w-full min-h-screen flex items-center justify-center p-4">
        <div className="relative z-30 w-full max-w-md">
          <div className="bg-black/40 backdrop-blur-sm border border-gray-700 rounded-lg p-8">
            <div className="text-center">
              <h1 className="text-3xl font-catamaran font-black text-foreground mb-2">
                Check-in Successful!
              </h1>
              <p className="text-gray-300 font-bmono mb-6">
                Welcome to the event! You're all set.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setShowManualForm(false);
                  reset();
                }}
                className="bg-blue-600 hover:bg-blue-700 text-foreground px-6 py-2 rounded-md transition-colors font-bmono font-medium"
              >
                Check in Another Person
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="relative w-full min-h-screen flex items-center justify-center p-4">
      <div className="relative z-30 w-full max-w-2xl">
        <div className="bg-black/40 backdrop-blur-sm border border-gray-700 rounded-lg p-8 relative">
          {!showManualForm ? (
            <div className="flex flex-col gap-4 h-[400px]">
              {/* <button
                onClick={() => setIsQrModalOpen(true)}
                className="flex-1 w-full bg-gray-800/20 hover:bg-gray-700/30 border border-gray-600 rounded-lg p-8 flex flex-col items-center justify-center transition-all duration-200 hover:border-gray-500"
              >
                <HiQrcode className="w-16 h-16 text-foreground mb-4" />
                <p className="text-gray-300 font-bmono text-lg">QR Code Scan</p>
              </button> */}

              <button
                onClick={() => setShowManualForm(true)}
                className="flex-1 w-full bg-gray-800/50 hover:bg-gray-700/50 border border-gray-600 rounded-lg p-8 flex flex-col items-center justify-center transition-all duration-200 hover:border-gray-500"
              >
                <p className="text-gray-300 font-bmono text-lg">
                  Manual Check In
                </p>
              </button>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h1 className="text-3xl font-catamaran font-black text-foreground mb-2">
                      Event Check-in
                    </h1>
                    <p className="text-gray-300 font-bmono">
                      Please fill out the form below to check in to your event.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setShowManualForm(false);
                      reset();
                    }}
                    className="ml-4 text-gray-400 hover:text-foreground font-bmono text-sm"
                  >
                    Back
                  </button>
                </div>
                {error && (
                  <div className="mt-4 p-4 bg-red-600/20 border border-red-500 rounded-md">
                    <p className="text-red-400 font-bmono">{error}</p>
                  </div>
                )}
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="firstName"
                        className="block text-sm font-bmono font-medium text-gray-300 mb-2"
                      >
                        First Name *
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        {...register("firstName", {
                          required: "First name is required",
                        })}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-foreground font-bmono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your first name"
                      />
                      {errors.firstName && (
                        <p className="mt-1 text-sm text-red-400">
                          {errors.firstName.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="lastName"
                        className="block text-sm font-bmono font-medium text-gray-300 mb-2"
                      >
                        Last Name *
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        {...register("lastName", {
                          required: "Last name is required",
                        })}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-foreground font-bmono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your last name"
                      />
                      {errors.lastName && (
                        <p className="mt-1 text-sm text-red-400">
                          {errors.lastName.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-bmono font-medium text-gray-300 mb-2"
                    >
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Invalid email address",
                        },
                      })}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-foreground font-bmono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your email address"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-400">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="studentId"
                      className="block text-sm font-bmono font-medium text-gray-300 mb-2"
                    >
                      Student ID
                    </label>
                    <input
                      type="text"
                      id="studentId"
                      {...register("studentId")}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-foreground font-bmono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your student ID (optional)"
                    />
                  </div>
                </div>
                <div className="pt-6">
                  <button
                    type="submit"
                    disabled={isSubmitting || justCheckedIn}
                    className={`w-full ${
                      justCheckedIn
                        ? "bg-green-600"
                        : "bg-blue-600 hover:bg-blue-700"
                    } disabled:cursor-not-allowed text-foreground font-bmono font-semibold py-3 px-4 rounded-md transition-all duration-300 focus:outline-none focus:ring-2 ${
                      justCheckedIn
                        ? "focus:ring-green-500"
                        : "focus:ring-blue-500"
                    } focus:ring-offset-2 focus:ring-offset-gray-800`}
                  >
                    {justCheckedIn ? (
                      <div className="flex items-center justify-center">
                        <svg
                          className="w-5 h-5 mr-2"
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
                        You're checked in!
                      </div>
                    ) : isSubmitting ? (
                      <div className="flex items-center justify-center">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-foreground"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Checking In...
                      </div>
                    ) : (
                      "Check In"
                    )}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>

      {mounted &&
        isQrModalOpen &&
        createPortal(
          <>
            <div
              className="fixed inset-0 bg-black bg-opacity-70 z-9998"
              onClick={() => setIsQrModalOpen(false)}
            />

            <div
              className="fixed inset-0 z-9999 flex items-center justify-center p-4"
              onClick={() => setIsQrModalOpen(false)}
            >
              <div
                className="relative w-full max-w-md h-auto max-h-[90vh] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="bg-[#181818] rounded-lg shadow-2xl overflow-hidden border border-gray-700">
                  <div className="bg-[#262626] p-4 flex items-center justify-between border-b border-gray-700">
                    <h2 className="text-xl font-catamaran font-bold text-foreground">
                      Scan QR Code
                    </h2>
                    <button
                      onClick={() => setIsQrModalOpen(false)}
                      className="text-gray-400 hover:text-foreground text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-700 transition-colors duration-200"
                    >
                      ×
                    </button>
                  </div>

                  <div className="p-6">
                    <div className="relative w-full aspect-square bg-black rounded-lg overflow-hidden">
                      <Scanner
                        onScan={(result: any) => {
                          try {
                            let scannedValue: string | null = null;

                            if (Array.isArray(result) && result.length > 0) {
                              scannedValue =
                                result[0]?.rawValue ||
                                result[0]?.text ||
                                result[0];
                            } else if (result && typeof result === "object") {
                              scannedValue =
                                (result as any).rawValue ||
                                (result as any).text ||
                                (result as any).value;
                            } else if (typeof result === "string") {
                              scannedValue = result;
                            }

                            if (scannedValue) {
                              handleQrScan(scannedValue);
                              setIsQrModalOpen(false);
                            }
                          } catch (err) {
                            console.error("Error processing scan result:", err);
                          }
                        }}
                        onError={(error: unknown) => {
                          console.error("QR Scanner error:", error);
                        }}
                      />
                    </div>
                    <p className="text-gray-400 font-bmono text-sm text-center mt-4">
                      Position the QR code within the frame to scan
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>,
          document.body,
        )}
    </main>
  );
}
