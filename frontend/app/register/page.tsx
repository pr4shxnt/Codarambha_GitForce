"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
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

interface FormData {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address: string;
  dateOfBirth: string;
  nationalId: string;
  nationalIdNumber: string;
}

function RegisterPage() {
  const [formData, setFormData] = useState<FormData>({
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
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setMessage(
          error.response?.data?.message ||
            "An error occurred. Please try again."
        );
      } else {
        setMessage("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
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
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { label: "Username", name: "username", icon: <User />, type: "text" },
              { label: "Email", name: "email", icon: <Mail />, type: "email" },
              { label: "Password", name: "password", icon: <Lock />, type: "password" },
              { label: "First Name", name: "firstName", icon: <User />, type: "text" },
              { label: "Last Name", name: "lastName", icon: <User />, type: "text" },
              { label: "Phone Number", name: "phoneNumber", icon: <Phone />, type: "text" },
              { label: "Address", name: "address", icon: <MapPin />, type: "text" },
              { label: "Date of Birth", name: "dateOfBirth", icon: <Calendar />, type: "date" },
            ].map(({ label, name, icon, type }) => (
              <div key={name}>
                <label className="flex items-center gap-2 text-sm font-medium mb-1">
                  {icon} {label}
                </label>
                <input
                  type={type}
                  name={name}
                  value={formData[name as keyof FormData]}
                  onChange={handleChange}
                  required={["username", "email", "password", "firstName", "lastName"].includes(
                    name
                  )}
                  className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
            ))}

            <div>
              <label className="flex items-center gap-2 text-sm font-medium mb-1">
                <IdCard className="w-4 h-4" /> National ID
              </label>
              <select
                name="nationalId"
                value={formData.nationalId}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
              >
                <option value="">Select one</option>
                <option value="passport">Passport</option>
                <option value="Driving License">Driving License</option>
                <option value="Citizenship">Citizenship</option>
                <option value="NID">National Identity Number</option>
              </select>
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
