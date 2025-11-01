"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import { IdCard, Users, Calendar, User, Lock } from "lucide-react";
import axios from "axios";

interface CardRequestFormData {
  requesterType: string;
  username: string;
  password: string;
  fullName: string;
  dateOfBirth: string;
}

function CardRequestPage() {
  const [formData, setFormData] = useState<CardRequestFormData>({
    requesterType: "",
    username: "",
    password: "",
    fullName: "",
    dateOfBirth: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/card-requests`,
        formData
      );

      setMessage("✅ Card request submitted successfully!");
      setFormData({
        requesterType: "",
        username: "",
        password: "",
        fullName: "",
        dateOfBirth: "",
      });

      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setMessage(
          error.response?.data?.message || "❌ Failed to submit card request."
        );
      } else {
        setMessage("❌ An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative bg-white text-gray-900">
      {/* Background grid */}
      <div className="absolute h-[50%] w-full inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(0,0,0,0.03)_50%,transparent_75%)] bg-[length:60px_60px]" />

      {/* Content */}
      <div className="relative z-10 max-w-2xl mx-auto px-6 pt-24 py-20">
        {/* Header */}
        <section className="text-center space-y-4 mb-10">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-black">
            Request a Card
          </h1>
          <p className="text-gray-600 max-w-xl mx-auto">
            Fill out the form with your details to request a new transit card.
          </p>
        </section>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="p-8 bg-gray-100 rounded-2xl shadow-md space-y-6"
        >
          <div className="grid gap-6">
            {/* Requester Type */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium mb-1">
                <Users className="w-4 h-4" /> Requester Type
              </label>
              <select
                name="requesterType"
                value={formData.requesterType}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
              >
                <option value="" disabled>
                  Select requester type
                </option>
                <option value="User">User</option>
                <option value="Org">Organization</option>
                <option value="Ward">Ward</option>
              </select>
            </div>

            {/* Full Name */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium mb-1">
                <User className="w-4 h-4" /> Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            {/* Date of Birth */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium mb-1">
                <Calendar className="w-4 h-4" /> Date of Birth
              </label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            {/* Username */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium mb-1">
                <IdCard className="w-4 h-4" /> Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            {/* Password */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium mb-1">
                <Lock className="w-4 h-4" /> Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex justify-center items-center gap-2 px-6 py-3 rounded-xl bg-black text-white font-medium hover:bg-gray-800 transition"
          >
            {loading ? "Submitting..." : "Submit Request"}
          </button>

          {message && (
            <p className="text-center text-sm font-medium mt-2">{message}</p>
          )}
        </form>
      </div>
    </div>
  );
}

export default CardRequestPage;
