import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, ArrowLeft, RefreshCw } from "lucide-react";
import { supabase } from "../supabase";

const VerifyEmail: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      // Verify OTP
      const { error } = await supabase.auth.verifyOtp({
        email: email,
        token: code,
        type: 'email'
      });

      if (error) throw error;

      setSuccess("✓ Email verified successfully! Redirecting to login...");

      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate("/dblogin/login");
      }, 2000);

    } catch (error: any) {
      console.error('Verification error:', error);
      setError(error.message || "Verification failed. Please check your code.");
    }

    setIsLoading(false);
  };

  const handleResendCode = async () => {
    if (!email) {
      setError("Please enter your email address");
      return;
    }

    setIsResending(true);
    setError("");
    setSuccess("");

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      });

      if (error) throw error;

      setSuccess("✓ Verification code resent! Check your email.");
    } catch (error: any) {
      console.error('Resend error:', error);
      setError(error.message || "Failed to resend code.");
    }

    setIsResending(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#7B1112] via-[#3a0a0a] to-[#FFB302]/20 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-md p-8 border border-gray-200 dark:border-gray-800">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#FFB302] to-[#7B1112] rounded-full blur-sm opacity-50"></div>
              <div className="relative z-10 w-16 h-16 bg-gradient-to-r from-[#7B1112] to-[#3a0a0a] rounded-full flex items-center justify-center">
                <Mail className="text-white" size={32} />
              </div>
            </div>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Verify Your Email
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            We've sent an 8-digit verification code to your email {/* 6-digit -> 8-digit */}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleVerify} className="space-y-6">
          {/* Email Field */}
          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
              <Mail className="mr-2 text-[#7B1112]" size={18} />
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@philtech.edu"
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7B1112]/50 focus:border-[#7B1112] transition-all duration-200"
            />
          </div>

          {/* Verification Code */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Verification Code
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 8))} // 6 -> 8
              placeholder="00000000"
              required
              maxLength={8}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 text-center text-2xl font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-[#7B1112]/50 focus:border-[#7B1112] transition-all duration-200"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              Enter the 8-digit code from your email {/* 6-digit -> 8-digit */}
            </p>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800">
              <p className="text-sm font-medium text-red-700 dark:text-red-400">
                {error}
              </p>
            </div>
          )}

          {success && (
            <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800">
              <p className="text-sm font-medium text-green-700 dark:text-green-400">
                {success}
              </p>
            </div>
          )}

          {/* Verify Button */}
          <button
            type="submit"
            disabled={isLoading || code.length !== 8}
            className="w-full py-3.5 px-6 rounded-lg font-semibold text-white bg-gradient-to-r from-[#7B1112] to-[#3a0a0a] hover:from-[#8c1415] hover:to-[#4a0c0c] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Verifying...
              </>
            ) : (
              "Verify Email"
            )}
          </button>

          {/* Resend Code */}
          <div className="text-center">
            <button
              type="button"
              onClick={handleResendCode}
              disabled={isResending}
              className="text-sm font-medium text-[#7B1112] dark:text-[#FFB302] hover:underline disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center"
            >
              {isResending ? (
                <>
                  <RefreshCw className="animate-spin mr-2" size={16} />
                  Resending...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2" size={16} />
                  Resend Code
                </>
              )}
            </button>
          </div>

          {/* Back to Login */}
          <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-800">
            <button
              type="button"
              onClick={() => navigate("/dblogin/login")}
              className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-[#7B1112] dark:hover:text-[#FFB302] inline-flex items-center"
            >
              <ArrowLeft className="mr-2" size={16} />
              Back to Login
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Didn't receive the code? Check your spam folder or click resend
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
