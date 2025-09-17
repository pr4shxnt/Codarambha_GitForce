import React from "react";
import {
  Download,
  Smartphone,
  Monitor,
  Apple,
  ChevronRightIcon,
} from "lucide-react";

function DownloadPage() {
  return (
    <div className="min-h-screen relative bg-white text-gray-900">
      {/* Background subtle grid */}
      <div className="absolute h-[50%] w-full inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(0,0,0,0.03)_50%,transparent_75%)] bg-[length:60px_60px]" />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 pt-24 py-20 space-y-20">
        {/* Header */}
        <section className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-black">
            Download Our App
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Choose your platform and get the latest version of our app. Built
            for speed, security, and simplicity.
          </p>
        </section>

        {/* Download Options */}
        <section className="grid md:grid-cols-3 gap-8">
          {/* Android */}
          <div className="p-6 bg-gray-100 rounded-2xl shadow-md text-center space-y-4 hover:bg-gray-200 transition">
            <Smartphone className="w-10 h-10 mx-auto text-gray-700" />
            <h2 className="text-xl font-semibold">Android</h2>
            <p className="text-gray-600 text-sm">
              Download the latest APK for Android devices.
            </p>
            <a
              href="/download/app-latest.apk"
              download
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-black text-white font-medium hover:bg-gray-800 transition"
            >
              <Download className="w-4 h-4" />
              Download
            </a>
          </div>

          {/* iOS */}
          <div className="p-6 bg-gray-100 rounded-2xl shadow-md text-center space-y-4 hover:bg-gray-200 transition">
            <Apple className="w-10 h-10 mx-auto text-gray-700" />
            <h2 className="text-xl font-semibold">iOS</h2>
            <p className="text-gray-600 text-sm">
              Get the app from the App Store for iPhone & iPad.
            </p>
            <a
              href="#"
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-black text-white font-medium hover:bg-gray-800 transition"
            >
              <Download className="w-4 h-4" />
              App Store
            </a>
          </div>

          {/* Desktop */}
          <div className="p-6 bg-gray-100 rounded-2xl shadow-md text-center space-y-4 hover:bg-gray-200 transition">
            <Monitor className="w-10 h-10 mx-auto text-gray-700" />
            <h2 className="text-xl font-semibold">Desktop</h2>
            <p className="text-gray-600 text-sm">
              Surf our services on your desktop or laptop.
            </p>
            <a
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-black text-white font-medium hover:bg-gray-800 transition"
            >
              Go to
              <ChevronRightIcon className="w-4 h-4" />
            </a>
          </div>
        </section>

        {/* Extra Info */}
        <section className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-black">Why Choose Our App?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our app is lightweight, reliable, and optimized for performance.
            Regular updates ensure you always have the newest features, bug
            fixes, and security patches.
          </p>
        </section>
      </div>
    </div>
  );
}

export default DownloadPage;
