import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, User, Mail, Lock, UserCircle, Eye, EyeOff, School, Shield, Copy } from "lucide-react";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "student"
  });
  const [error, setError] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);



  const handleClose = () => {
    navigate("/");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Validation
    if (!formData.email || !formData.password || !formData.role) {
      setError("Please fill in all required fields");
      setIsLoading(false);
      return;
    }

    try {
      // Make API call to backend
      const response = await fetch('/Backed/login.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          role: formData.role
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Successful login - store user info in localStorage
        const userData = {
          ...data.user,
          loggedInAt: new Date().toISOString(),
        };

        localStorage.setItem('philtech_user', JSON.stringify(userData));

        // Navigate to College Portal
        navigate("/college-portal");
      } else {
        setError(data.message || "Login failed. Please check your credentials.");
      }
    } catch (error) {
      console.error('Login error:', error);
      setError("Network error. Please try again later.");
    }

    setIsLoading(false);
  };

  // Separate functions for switching modes
  const handleSwitchToSignIn = () => {
    if (isSignUp) {
      setIsSignUp(false);
      setError("");
      setFormData({ email: "", password: "", role: "student" });
    }
  };

  const handleSwitchToSignUp = () => {
    if (!isSignUp) {
      setIsSignUp(true);
      setError("");
      setFormData({ email: "", password: "", role: "student" });
    }
  };



  const roles = [
    { value: "student", label: "Student", icon: <User size={16} /> },
    { value: "teacher", label: "Faculty/Teacher", icon: <School size={16} /> },
    { value: "parent", label: "Parent/Guardian", icon: <UserCircle size={16} /> },
    { value: "admin", label: "Administrator", icon: <Shield size={16} /> },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#7B1112] via-[#3a0a0a] to-[#FFB302]/20 p-4 relative overflow-hidden">
      {/* Classic Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('/images/pattern.png')] opacity-5 pointer-events-none"></div>
      
      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-[#7B1112]/20 to-transparent rounded-full blur-2xl"></div>
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-to-tr from-[#FFB302]/20 to-transparent rounded-full blur-2xl"></div>

      <div className="relative bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-200 dark:border-gray-800">
        {/* Classic Header */}
        <div className="relative bg-gradient-to-r from-[#7B1112] to-[#3a0a0a] p-6">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200 text-white"
            aria-label="Close login"
          >
            <X size={20} />
          </button>

          <div className="flex items-center justify-center mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#FFB302] to-[#7B1112] rounded-full blur-sm opacity-50"></div>
              <img
                src="/images/logo/logo.png"
                alt="PHILTECH Logo"
                className="h-20 w-20 relative z-10"
              />
            </div>
          </div>

          <div className="text-center">
            <h1 className="text-2xl font-bold text-white font-serif">
              {isSignUp ? "Create Your Account" : "Welcome to PHILTECH"}
            </h1>
            <p className="text-sm text-white/80 mt-2">
              {isSignUp ? "Join our academic community" : "Sign in to access your portal"}
            </p>
          </div>

          {/* Classic Tab Indicators - FIXED */}
          <div className="flex mt-6">
            {/* SIGN IN Tab */}
            <div 
              className={`flex-1 text-center pb-2 border-b-2 transition-all duration-200 cursor-pointer ${!isSignUp ? 'border-[#FFB302]' : 'border-white/20 hover:border-white/40'}`}
              onClick={handleSwitchToSignIn}
            >
              <div
                className={`text-sm font-medium ${!isSignUp ? 'text-[#FFB302]' : 'text-white/60 hover:text-white'}`}
              >
                SIGN IN
              </div>
            </div>
            
            {/* SIGN UP Tab */}
            <div 
              className={`flex-1 text-center pb-2 border-b-2 transition-all duration-200 cursor-pointer ${isSignUp ? 'border-[#FFB302]' : 'border-white/20 hover:border-white/40'}`}
              onClick={handleSwitchToSignUp}
            >
              <div
                className={`text-sm font-medium ${isSignUp ? 'text-[#FFB302]' : 'text-white/60 hover:text-white'}`}
              >
                SIGN UP
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Role Selection - Classic Dropdown */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                <UserCircle className="mr-2 text-[#7B1112]" size={18} />
                Access Level
              </label>
              <div className="relative">
                <select
                  name="role"
                  required
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white appearance-none focus:outline-none focus:ring-2 focus:ring-[#7B1112]/50 focus:border-[#7B1112] transition-all duration-200 cursor-pointer"
                >
                  {roles.map((role) => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                <Mail className="mr-2 text-[#7B1112]" size={18} />
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your institutional email"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7B1112]/50 focus:border-[#7B1112] transition-all duration-200"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                <Lock className="mr-2 text-[#7B1112]" size={18} />
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7B1112]/50 focus:border-[#7B1112] transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Additional Sign Up Fields (Optional) */}
            {isSignUp && (
              <>
                {/* Full Name Field for Sign Up */}
                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                    <User className="mr-2 text-[#7B1112]" size={18} />
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7B1112]/50 focus:border-[#7B1112] transition-all duration-200"
                  />
                </div>

                {/* Confirm Password Field */}
                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                    <Lock className="mr-2 text-[#7B1112]" size={18} />
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      name="confirmPassword"
                      required
                      placeholder="Confirm your password"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7B1112]/50 focus:border-[#7B1112] transition-all duration-200"
                    />
                  </div>
                </div>
              </>
            )}

            {!isSignUp && (
              <div className="flex justify-end">
                <a
                  href="/forgot-password"
                  className="text-sm font-medium text-[#7B1112] hover:text-[#FFB302] dark:text-[#FFB302] dark:hover:text-white transition-colors duration-200"
                >
                  Forgot Password?
                </a>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className={`p-4 rounded-lg ${error.includes('✓') ? 'bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800' : 'bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800'}`}>
                <p className={`text-sm font-medium ${error.includes('✓') ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
                  {error}
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-6 rounded-lg font-semibold text-white bg-gradient-to-r from-[#7B1112] to-[#3a0a0a] hover:from-[#8c1415] hover:to-[#4a0c0c] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {isSignUp ? "Creating Account..." : "Signing In..."}
                </>
              ) : (
                <>
                  {isSignUp ? "Create Account" : "Sign In"}
                  <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* Additional Information */}
          <div className="mt-8 space-y-4">
            {/* Terms and Privacy */}
            {isSignUp && (
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                By creating an account, you agree to our{" "}
                <a href="/terms" className="text-[#7B1112] dark:text-[#FFB302] hover:underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="/privacy" className="text-[#7B1112] dark:text-[#FFB302] hover:underline">
                  Privacy Policy
                </a>
              </p>
            )}
          </div>
        </div>

        {/* Classic Footer */}
        <div className="border-t border-gray-200 dark:border-gray-800 p-4 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} PHILTECH College. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;