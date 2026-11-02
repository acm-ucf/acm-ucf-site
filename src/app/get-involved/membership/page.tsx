"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import PayPalComponent from "@/components/paypal";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const MAJORS = [
  // Computer Science & Engineering
  {
    group: "Computer Science & Engineering",
    majors: [
      "Computer Science",
      "Computer Engineering",
      "Information Technology",
      "Cybersecurity",
      "Data Science",
      "Software Engineering",
    ],
  },
  // Engineering
  {
    group: "Engineering",
    majors: [
      "Electrical Engineering",
      "Mechanical Engineering",
      "Civil Engineering",
      "Aerospace Engineering",
      "Industrial Engineering",
      "Environmental Engineering",
    ],
  },
  // Science & Math
  {
    group: "Science & Math",
    majors: ["Mathematics", "Statistics", "Physics", "Chemistry", "Biology"],
  },
  // Business
  {
    group: "Business",
    majors: [
      "Business Administration",
      "Finance",
      "Accounting",
      "Marketing",
      "Economics",
      "Management Information Systems",
    ],
  },
  // Other
  {
    group: "Other",
    majors: ["Digital Media", "Game Design", "Psychology", "Other"],
  },
];

export type MembershipType = "yearly" | "semesterly";

export interface MembershipFormData {
  firstName: string;
  lastName: string;
  email: string;
  studentId: string;
  major?: string;
  graduationYear?: string;
}

export const MEMBERSHIP_OPTIONS = {
  yearly: {
    label: "Yearly Membership",
    price: 25,
    description: "ACM Chapter Yearly Membership",
  },
  semesterly: {
    label: "Semester Membership",
    price: 15,
    description: "ACM Chapter Semester Membership",
  },
} as const;

export default function Membership() {
  const [showPayPal, setShowPayPal] = useState(false);
  const [formData, setFormData] = useState<MembershipFormData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [membershipType, setMembershipType] = useState<MembershipType | null>(
    null
  );
  const [membershipError, setMembershipError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<MembershipFormData>();

  const selectedMajor = watch("major");

  const onFormSubmit = (data: MembershipFormData) => {
    // Validate membership type is selected
    if (!membershipType) {
      setMembershipError("Please select a membership type");
      return;
    }
    setMembershipError(null);
    setFormData(data);
    setShowPayPal(true);
    setError(null);
  };

  return (
    <main className="relative w-full min-h-screen sm:p-12">
      <div className="absolute inset-0 z-30"></div>

      <div className="relative z-30 flex items-center justify-center min-h-screen py-8">
        <div className="bg-black/40 backdrop-blur-sm border border-gray-700 rounded-lg p-8 max-w-4xl w-full mx-4">
          <h1 className="text-4xl text-foreground font-catamaran font-black mb-8 text-center">
            <span className="text-yellow-400">Member</span>ship
          </h1>

          <div className="space-y-8">
            {/* Obtaining chapter Membership */}
            <section id="membership">
              {error && (
                <div className="mb-4 p-4 bg-red-600/20 border border-red-500 rounded-md">
                  <p className="text-red-400 font-bmono">{error}</p>
                </div>
              )}

              <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
                <form
                  onSubmit={handleSubmit(onFormSubmit)}
                  className="space-y-4"
                >
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
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-400">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="studentId"
                        className="block text-sm font-bmono font-medium text-gray-300 mb-2"
                      >
                        Student ID *
                      </label>
                      <input
                        type="text"
                        inputMode="numeric"
                        id="studentId"
                        {...register("studentId", {
                          required: "Student ID is required",
                          pattern: {
                            value: /^[0-9]+$/,
                            message: "Student ID must contain only numbers",
                          },
                        })}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-foreground font-bmono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      {errors.studentId && (
                        <p className="mt-1 text-sm text-red-400">
                          {errors.studentId.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="graduationYear"
                        className="block text-sm font-bmono font-medium text-gray-300 mb-2"
                      >
                        Graduation Year
                      </label>
                      <input
                        type="text"
                        inputMode="numeric"
                        id="graduationYear"
                        {...register("graduationYear", {
                          pattern: {
                            value: /^[0-9]*$/,
                            message:
                              "Graduation year must contain only numbers",
                          },
                        })}
                        placeholder="e.g. 2026"
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-foreground font-bmono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      {errors.graduationYear && (
                        <p className="mt-1 text-sm text-red-400">
                          {errors.graduationYear.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="major"
                      className="block text-sm font-bmono font-medium text-gray-300 mb-2"
                    >
                      Major
                    </label>
                    <Select
                      value={selectedMajor || ""}
                      onValueChange={(value) => setValue("major", value)}
                    >
                      <SelectTrigger className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-foreground font-bmono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent h-auto">
                        <SelectValue placeholder="Select your major (optional)" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border border-gray-600 max-h-[300px]">
                        {MAJORS.map((group) => (
                          <SelectGroup key={group.group}>
                            <SelectLabel className="text-gray-400 font-bmono">
                              {group.group}
                            </SelectLabel>
                            {group.majors.map((major) => (
                              <SelectItem
                                key={major}
                                value={major}
                                className="text-foreground font-bmono hover:bg-gray-700 focus:bg-gray-700 cursor-pointer"
                              >
                                {major}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Membership Type Selection */}
                  <div>
                    <label className="block text-sm font-bmono font-medium text-gray-300 mb-2">
                      Membership Type *
                    </label>
                    <Select
                      value={membershipType || ""}
                      onValueChange={(value) => {
                        setMembershipType(value as MembershipType);
                        setMembershipError(null);
                      }}
                    >
                      <SelectTrigger className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-foreground font-bmono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent h-auto">
                        <SelectValue placeholder="Select membership duration" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border border-gray-600">
                        <SelectItem
                          value="yearly"
                          className="text-foreground font-bmono hover:bg-gray-700 focus:bg-gray-700 cursor-pointer"
                        >
                          <span className="flex justify-between items-center w-full gap-4">
                            <span>Yearly Membership</span>
                            <span className="text-green-400 font-semibold">
                              $25
                            </span>
                          </span>
                        </SelectItem>
                        <SelectItem
                          value="semesterly"
                          className="text-foreground font-bmono hover:bg-gray-700 focus:bg-gray-700 cursor-pointer"
                        >
                          <span className="flex justify-between items-center w-full gap-4">
                            <span>Semester Membership</span>
                            <span className="text-green-400 font-semibold">
                              $15
                            </span>
                          </span>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    {membershipError && (
                      <p className="mt-1 text-sm text-red-400">
                        {membershipError}
                      </p>
                    )}
                  </div>

                  {!showPayPal && (
                    <div className="pt-4">
                      <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-foreground font-bmono font-semibold py-3 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                      >
                        Continue to Payment
                        {membershipType &&
                          ` ($${MEMBERSHIP_OPTIONS[membershipType].price})`}
                      </button>
                    </div>
                  )}
                </form>

                {showPayPal && formData && membershipType && (
                  <div className="mt-6 pt-6 border-t border-gray-700">
                    <h4 className="text-lg font-catamaran font-semibold text-foreground mb-4">
                      Complete Payment
                    </h4>
                    <p className="text-gray-400 font-bmono text-sm mb-2">
                      Paying as: {formData.firstName} {formData.lastName} (
                      {formData.email})
                    </p>
                    <p className="text-green-400 font-bmono text-sm mb-4">
                      {MEMBERSHIP_OPTIONS[membershipType].label}: $
                      {MEMBERSHIP_OPTIONS[membershipType].price}
                    </p>
                    <PayPalComponent
                      formData={formData}
                      membershipType={membershipType}
                      amount={MEMBERSHIP_OPTIONS[membershipType].price}
                      description={
                        MEMBERSHIP_OPTIONS[membershipType].description
                      }
                      onError={(msg) => {
                        setError(msg);
                        setShowPayPal(false);
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPayPal(false)}
                      className="mt-4 w-full text-gray-400 hover:text-foreground font-bmono text-sm transition-colors"
                    >
                      ← Edit Information
                    </button>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
