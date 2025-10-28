"use client";
import React, { FormEventHandler, useState } from "react";
import {
  User,
  Mail,
  Lock,
  Phone,
  MapPin,
  Calendar,
  IdCard,
  FileText,
} from "lucide-react";
import axios from "axios";

function RegisterPage() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    address: "",
    dateOfBirth: "",
    nationalId: "",
    nationalIdNumber: "",
  });

  console.log(formData);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement | HTMLOptionElement>
  ) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/create`,
        formData
      );
      setMessage("Registration successful! Please check your email.");
      setFormData({
        username: "",
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        phoneNumber: "",
        address: "",
        dateOfBirth: "",
        nationalId: "",
        nationalIdNumber: "",
      });
      setLoading(false);
    } catch (error: any) {
      setMessage(
        error.response?.data?.message || "An error occurred. Please try again."
      );
      setLoading(false);
      console.error("Registration error:", error);
    }
  };
  return (
    <div className="min-h-screen relative bg-white text-gray-900">
      {/* Background subtle grid */}
      <div className="absolute h-[50%] w-full inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(0,0,0,0.03)_50%,transparent_75%)] bg-[length:60px_60px]" />

      {/* Content */}
      <div className="relative z-10 max-w-3xl mx-auto px-6 pt-24 py-20">
        {/* Header */}
        <section className="text-center space-y-4 mb-10">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-black">
            Create Account
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Fill out the form below to register a new account.
          </p>
        </section>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="p-8 bg-gray-100 rounded-2xl shadow-md space-y-6"
        >
          {/* Grid fields */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium mb-1">
                <User className="w-4 h-4" /> Username
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

            <div>
              <label className="flex items-center gap-2 text-sm font-medium mb-1">
                <Mail className="w-4 h-4" /> Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

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

            <div>
              <label className="flex items-center gap-2 text-sm font-medium mb-1">
                <User className="w-4 h-4" /> First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium mb-1">
                <User className="w-4 h-4" /> Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium mb-1">
                <Phone className="w-4 h-4" /> Phone Number
              </label>
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium mb-1">
                <MapPin className="w-4 h-4" /> Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium mb-1">
                <Calendar className="w-4 h-4" /> Date of Birth
              </label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <div>
              <>
                <label className="flex items-center gap-2 text-sm font-medium mb-1">
                  <IdCard className="w-4 h-4" /> National ID
                </label>
                <select
                  name="nationalId"
                  value={formData.nationalId}
                  onChange={(e) =>
                    setFormData({ ...formData, nationalId: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
                >
                  <option value="" disabled></option>
                  <option value="passport">Passport</option>
                  <option value="Driving License">Driver's License</option>
                  <option value="Citizenship">Citizenship</option>
                  <option value="NID">National Identity Number</option>
                </select>
              </>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium mb-1">
                <FileText className="w-4 h-4" /> National ID Number
              </label>
              <input
                type="text"
                name="nationalIdNumber"
                value={formData.nationalIdNumber}
                onChange={handleChange}
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
            {loading ? "Registering..." : "Create Account"}
          </button>

          {message && (
            <p className="text-center text-sm font-medium mt-2">{message}</p>
          )}
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;
