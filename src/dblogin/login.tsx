import React from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";

const Login: React.FC = () => {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#7B1112] via-black to-[#FFB302]">
      <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 transform hover:scale-110 text-gray-600 dark:text-gray-300"
          aria-label="Close login"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col items-center mb-6">
          <img
            src="/images/logo/logo.png"
            alt="PHILTECH Logo"
            className="h-12 w-12 mb-2"
          />
          <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-[#FFB302] to-[#7B1112] bg-clip-text text-transparent">
            PHILTECH
          </h1>
        </div>

        <form className="space-y-6">
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              required
              className="mt-1 block w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#FFB302] focus:border-[#FFB302]"
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              className="mt-1 block w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#7B1112] focus:border-[#7B1112]"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 px-6 rounded-lg font-semibold text-white bg-gradient-to-r from-[#FFB302] to-[#7B1112] shadow-lg hover:opacity-90 transition"
          >
            Login
          </button>
        </form>

        {/* Links */}
        <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>
            Don’t have an account?{" "}
            <a
              href="/register"
              className="font-semibold text-[#7B1112] hover:text-[#FFB302] transition"
            >
              Register
            </a>
          </p>
          <p className="mt-2">
            <a
              href="/forgot-password"
              className="font-semibold text-[#FFB302] hover:text-[#7B1112] transition"
            >
              Forgot password?
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;