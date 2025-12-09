import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  User, BookOpen, MessageSquare, Settings, Home,
  Edit, CheckCircle, Phone, MapPin, Calendar,
  Search, MoreVertical, Trash2, Bell,
  TrendingUp, Award, Clock,
  BarChart3, Download, FileText, Shield,
  Mail, LogOut, Menu, GraduationCap, BookMarked,
  Upload, CreditCard, HelpCircle, ChevronDown,
  Users, FileUp, BookCheck, CalendarDays, Eye, EyeOff, History,
  Image, Save, X, Send, UserCheck
} from "lucide-react";
import { supabase } from '../supabaseClient';
import { button } from "framer-motion/client";
import { generateCSRFToken, validateCSRFToken, storeCSRFToken, getStoredCSRFToken } from '../Securities/CSRFtoken';

// ========== TYPE DEFINITIONS ==========
interface Course {
  id: number | string;
  code: string;
  name: string;
  professor: string;
  progress: number;
  color: string;
  assignments: number;
  credits?: number;
  schedule?: {
    day: string;
    time: string;
    room: string;
  };
  section?: string;
  nextClass: string;
}

interface Assignment {
  id: number | string;
  title: string;
  course: string;
  dueDate: string;
  priority: string;
  points: number;
  description?: string;
}

interface Message {
  id: number | string;
  sender: string;
  subject: string;
  preview: string;
  time: string;
  unread: boolean;
}

interface Stat {
  label: string;
  value: string;
  change: string;
  icon: React.ComponentType<{size?: number; className?: string}>;
  color: string;
  bgColor: string;
}

interface Section {
  id?: string;
  section_code?: string;
  program?: string;
  year_level?: string;
  student_type?: string;
}

interface UserData {
  id?: string;
  email?: string;
  role?: string;
  first_name?: string;
  middle_name?: string;
  last_name?: string;
  student_type?: string;
  year_grade?: string;
  section?: string;
  school_id?: string;
  program_strand?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
  full_name?: string;
  phone?: string;
  address?: string;
  bio?: string;
}

interface Notification {
  id: number | string;
  title: string;
  message: string;
  time: string;
  type: 'assignment' | 'message' | 'system' | 'alert';
  read: boolean;
  action?: () => void;
}

// ========== MODAL COMPONENTS ==========
const ChangePasswordModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (updateError) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user?.email) {
          setError("Unable to verify user");
          return;
        }

        const { error: reauthError } = await supabase.auth.signInWithPassword({
          email: user.email,
          password: oldPassword
        });

        if (reauthError) {
          setError("Current password is incorrect");
          return;
        }

        const { error: secondUpdateError } = await supabase.auth.updateUser({
          password: newPassword
        });

        if (secondUpdateError) {
          setError("Failed to update password");
          return;
        }
      }

      // Show success message
      setTimeout(() => {
        onClose();
        resetForm();
      }, 500);
    } catch (error) {
      setError("An error occurred while changing password");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setError("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl md:rounded-2xl w-full max-w-xs sm:max-w-sm md:max-w-md p-4 sm:p-5 md:p-6 animate-fade-in mx-2 sm:mx-4">
        <div className="flex justify-between items-center mb-4 sm:mb-5 md:mb-6">
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Change Password</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
            <X size={18} className="sm:w-5 sm:h-5" />
          </button>
        </div>
        
        <div className="space-y-3 sm:space-y-4">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showOldPassword ? "text" : "password"}
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-[#7B1112] focus:border-transparent pr-10 transition-all text-sm sm:text-base"
              />
              <button
                type="button"
                onClick={() => setShowOldPassword(!showOldPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showOldPassword ? <EyeOff size={18} className="sm:w-5 sm:h-5" /> : <Eye size={18} className="sm:w-5 sm:h-5" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
              New Password
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-[#7B1112] focus:border-transparent pr-10 transition-all text-sm sm:text-base"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showNewPassword ? <EyeOff size={18} className="sm:w-5 sm:h-5" /> : <Eye size={18} className="sm:w-5 sm:h-5" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-[#7B1112] focus:border-transparent pr-10 transition-all text-sm sm:text-base"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff size={18} className="sm:w-5 sm:h-5" /> : <Eye size={18} className="sm:w-5 sm:h-5" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-2 sm:p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs sm:text-sm rounded-lg animate-shake">
              {error}
            </div>
          )}

          <div className="flex justify-end space-x-2 sm:space-x-3 pt-3 sm:pt-4">
            <button
              onClick={() => {
                resetForm();
                onClose();
              }}
              className="px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-4 sm:px-6 py-2 bg-gradient-to-r from-[#7B1112] to-[#FFB302] text-white rounded-lg hover:opacity-90 transition-all disabled:opacity-50 hover:scale-105 text-xs sm:text-sm"
            >
              {loading ? (
                <span className="flex items-center">
                  <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-1 sm:mr-2"></div>
                  Changing...
                </span>
              ) : "Change Password"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const DeleteAccountModal = ({ 
  isOpen, 
  onClose, 
  onConfirm 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onConfirm: () => void 
}) => {
  const [step, setStep] = useState(1);
  const [confirmText, setConfirmText] = useState("");

  const handleConfirm = () => {
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      if (confirmText.toLowerCase() === "confirm") {
        onConfirm();
        resetModal();
      }
    }
  };

  const resetModal = () => {
    setStep(1);
    setConfirmText("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl md:rounded-2xl w-full max-w-xs sm:max-w-sm md:max-w-md p-4 sm:p-5 md:p-6 animate-fade-in mx-2 sm:mx-4">
        <div className="flex justify-between items-center mb-3 sm:mb-4">
          <h3 className="text-lg sm:text-xl font-bold text-red-600 dark:text-red-400">
            {step === 1 ? "Delete Account" : "Confirm Deletion"}
          </h3>
          <button onClick={resetModal} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
            <X size={18} className="sm:w-5 sm:h-5" />
          </button>
        </div>
        
        <div className="space-y-3 sm:space-y-4">
          {step === 1 ? (
            <>
              <div className="p-3 sm:p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <p className="text-red-700 dark:text-red-300 font-medium text-sm sm:text-base">
                  Warning: This action cannot be undone!
                </p>
                <p className="text-red-600 dark:text-red-400 text-xs sm:text-sm mt-1 sm:mt-2">
                  All your data, including courses, assignments, and profile information will be permanently deleted.
                </p>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
                Are you sure you want to delete your account?
              </p>
            </>
          ) : (
            <>
              <div className="p-3 sm:p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <p className="text-red-700 dark:text-red-300 font-medium text-sm sm:text-base">
                  Final confirmation required
                </p>
                <p className="text-red-600 dark:text-red-400 text-xs sm:text-sm mt-1 sm:mt-2">
                  Type "confirm" to permanently delete your account
                </p>
              </div>
              <input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="Type 'confirm' here"
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all text-sm sm:text-base"
              />
            </>
          )}

          <div className="flex justify-end space-x-2 sm:space-x-3 pt-3 sm:pt-4">
            <button
              onClick={resetModal}
              className="px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="px-4 sm:px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all hover:scale-105 text-xs sm:text-sm"
            >
              {step === 1 ? "Yes, Delete Account" : "Delete Account"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// NEW: Submit Assignment Modal
const SubmitAssignmentModal = ({ 
  isOpen, 
  onClose, 
  assignment,
  course
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  assignment: Assignment | null;
  course: Course | null;
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [remarks, setRemarks] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = () => {
    if (!file) {
      // Show centered alert
      setTimeout(() => {
        onClose();
      }, 500);
      return;
    }

    setSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setSuccess(true);
      setSubmitting(false);
      
      // Reset and close after showing success
      setTimeout(() => {
        setSuccess(false);
        setFile(null);
        setRemarks("");
        onClose();
      }, 1500);
    }, 1500);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 10 * 1024 * 1024) { // 10MB limit
        // Show centered alert
        setTimeout(() => {
          onClose();
        }, 500);
        return;
      }
      setFile(selectedFile);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl md:rounded-2xl w-full max-w-xs sm:max-w-sm md:max-w-md p-4 sm:p-5 md:p-6 animate-fade-in mx-2 sm:mx-4">
        <div className="flex justify-between items-center mb-4 sm:mb-5 md:mb-6">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Submit Assignment</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
            <X size={18} className="sm:w-5 sm:h-5" />
          </button>
        </div>
        
        {success ? (
          <div className="py-8 sm:py-10 md:py-12 text-center">
            <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 animate-bounce">
              <CheckCircle className="text-green-600 dark:text-green-400 sm:w-8 sm:h-8 md:w-10 md:h-10" />
            </div>
            <h4 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-1 sm:mb-2">Assignment Submitted!</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">Your assignment has been sent successfully.</p>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-5 md:space-y-6">
            {/* Assignment Info */}
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg sm:rounded-xl p-3 sm:p-4">
              <div className="flex items-start justify-between mb-1 sm:mb-2">
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base md:text-lg truncate">{assignment?.title}</h4>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-1">{assignment?.course} • {assignment?.points} points</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Due: {assignment?.dueDate}</p>
                </div>
              </div>
            </div>

            {/* Teacher Info */}
            <div className="border border-blue-200 dark:border-blue-900/50 bg-blue-50 dark:bg-blue-900/20 rounded-lg sm:rounded-xl p-3 sm:p-4">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center">
                  <UserCheck
                    size={16}
                    className={`text-blue-600 dark:text-blue-400 sm:w-5 sm:h-5`}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">This assignment will be sent to:</p>
                  <p className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base truncate">{course?.professor || "Professor"}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{course?.name || "Course Teacher"}</p>
                </div>
              </div>
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                Upload File
              </label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 text-center hover:border-[#7B1112] dark:hover:border-[#FFB302] transition-all cursor-pointer">
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-gray-400 mx-auto mb-2 sm:mb-3" />
                  <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white mb-1 truncate">
                    {file ? file.name : "Click to upload or drag and drop"}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    PDF, DOC, TXT, JPG, PNG (Max 10MB)
                  </p>
                </label>
              </div>
              {file && (
                <div className="mt-1 sm:mt-2 text-xs sm:text-sm text-green-600 dark:text-green-400 truncate">
                  ✓ {file.name} ({Math.round(file.size / 1024)} KB)
                </div>
              )}
            </div>

            {/* Remarks */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                Remarks (Optional)
              </label>
              <textarea
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-[#7B1112] focus:border-transparent transition-all text-sm sm:text-base"
                rows={3}
                placeholder="Add any additional comments for your teacher..."
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-2 sm:space-x-3 pt-3 sm:pt-4">
              <button
                onClick={onClose}
                className="px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting || !file}
                className="px-4 sm:px-6 py-2 bg-gradient-to-r from-[#7B1112] to-[#FFB302] text-white rounded-lg hover:opacity-90 transition-all disabled:opacity-50 hover:scale-105 flex items-center text-xs sm:text-sm"
              >
                {submitting ? (
                  <>
                    <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-1 sm:mr-2"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send size={14} className="sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    Submit Assignment
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// NEW: Notification Modal
const NotificationModal = ({ 
  isOpen, 
  onClose, 
  notifications 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  notifications: Notification[] 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl md:rounded-2xl w-full max-w-xs sm:max-w-sm md:max-w-md p-4 sm:p-5 md:p-6 animate-fade-in mx-2 sm:mx-4">
        <div className="flex justify-between items-center mb-4 sm:mb-5 md:mb-6">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Notifications</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
            <X size={18} className="sm:w-5 sm:h-5" />
          </button>
        </div>
        
        <div className="space-y-3 sm:space-y-4 max-h-60 sm:max-h-80 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="text-center py-6 sm:py-8 md:py-12">
              <Bell className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 text-gray-400 mx-auto mb-3 sm:mb-4" />
              <h4 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-1 sm:mb-2">No Notifications</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">You're all caught up!</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div 
                key={notification.id} 
                className={`p-3 sm:p-4 rounded-lg sm:rounded-xl border ${
                  notification.read 
                    ? "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800" 
                    : "border-blue-200 dark:border-blue-900/50 bg-blue-50 dark:bg-blue-900/10"
                } hover:shadow-md transition-all cursor-pointer`}
                onClick={notification.action}
              >
                <div className="flex items-start space-x-2 sm:space-x-3">
                  <div className={`p-1.5 sm:p-2 rounded-lg ${
                    notification.read 
                      ? "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300" 
                      : "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                  }`}>
                    <Bell size={14} className="sm:w-4 sm:h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                      <h4 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base truncate">
                        {notification.title}
                      </h4>
                      <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 sm:mt-0">{notification.time}</span>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">{notification.message}</p>
                    {!notification.read && (
                      <span className="inline-block mt-1 sm:mt-2 px-1.5 sm:px-2 py-0.5 sm:py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 text-xs rounded-full">
                        New
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        
        {notifications.length > 0 && (
          <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-gray-200 dark:border-gray-700">
            <button 
              onClick={() => {
                // Mark all as read functionality
                onClose();
              }}
              className="w-full px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              Mark all as read
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// NEW: Centered Alert Modal
const CenteredAlert = ({ 
  isOpen, 
  onClose, 
  title, 
  message, 
  type = 'info' 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  title: string; 
  message: string; 
  type?: 'success' | 'error' | 'info' | 'warning' 
}) => {
  if (!isOpen) return null;

  const typeColors = {
    success: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-900/50 text-green-800 dark:text-green-300',
    error: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-900/50 text-red-800 dark:text-red-300',
    warning: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-900/50 text-amber-800 dark:text-amber-300',
    info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-900/50 text-blue-800 dark:text-blue-300'
  };

  const typeIcons = {
    success: <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6" />,
    error: <X className="w-5 h-5 sm:w-6 sm:h-6" />,
    warning: <Bell className="w-5 h-5 sm:w-6 sm:h-6" />,
    info: <Info className="w-5 h-5 sm:w-6 sm:h-6" />
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className={`${typeColors[type]} rounded-lg sm:rounded-xl md:rounded-2xl p-4 sm:p-5 md:p-6 max-w-xs sm:max-w-sm md:max-w-md w-full animate-fade-in-up mx-2 sm:mx-4`}>
        <div className="flex items-center justify-center mb-3 sm:mb-4">
          <div className="p-2 sm:p-3 rounded-full bg-current/10">
            {typeIcons[type]}
          </div>
        </div>
        <h3 className="text-base sm:text-lg md:text-xl font-semibold text-center mb-1 sm:mb-2">{title}</h3>
        <p className="text-center mb-4 sm:mb-5 md:mb-6 text-sm sm:text-base">{message}</p>
        <div className="flex justify-center">
          <button
            onClick={onClose}
            className="px-4 sm:px-6 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-sm sm:text-base"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

// NEW: Simple Calendar Modal
const CalendarModal = ({ 
  isOpen, 
  onClose 
}: { 
  isOpen: boolean; 
  onClose: () => void;
}) => {
  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  
  // Generate days of the month
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  
  // Get day of week for the first day of the month
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl w-full max-w-xs sm:max-w-sm p-3 sm:p-4 animate-fade-in mx-2 sm:mx-4">
        <div className="flex justify-between items-center mb-3 sm:mb-4">
          <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">Academic Calendar</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
            <X size={18} className="sm:w-5 sm:h-5" />
          </button>
        </div>
        
        <div className="space-y-2 sm:space-y-3">
          {/* Calendar Header */}
          <div className="mb-1 sm:mb-2">
            <h4 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white text-center">{currentMonth}</h4>
          </div>

          {/* Calendar Grid */}
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-2 max-h-60 sm:max-h-80 overflow-y-auto">
            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-1 mb-1">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day) => (
                <div key={day} className="text-center text-xs font-medium text-gray-600 dark:text-gray-400 p-1">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-1">
              {/* Empty cells for days before the first day of month */}
              {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                <div key={`empty-${i}`} className="h-6 sm:h-8 rounded"></div>
              ))}
              
              {/* Days of the month - EMPTY CELLS ONLY */}
              {days.map((day) => {
                const isToday = day === currentDate.getDate();
                
                return (
                  <div 
                    key={day} 
                    className={`h-6 sm:h-8 rounded flex items-center justify-center text-xs sm:text-sm ${
                      isToday 
                        ? 'bg-[#7B1112] text-white' 
                        : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {day}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Simple Legend */}
          <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
            <div className="flex items-center justify-center gap-2">
              <div className="flex items-center">
                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-[#7B1112] rounded mr-1"></div>
                <span>Today</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Add Info icon import
const Info = (props: any) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="16" x2="12" y2="12"></line>
    <line x1="12" y1="8" x2="12.01" y2="8"></line>
  </svg>
);

// ========== SKELETON LOADING COMPONENTS ==========
const SkeletonCard = () => (
  <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg sm:rounded-xl p-4 sm:p-6 space-y-3 sm:space-y-4">
    <div className="h-3 sm:h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
    <div className="h-2.5 sm:h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
    <div className="h-2 bg-gray-300 dark:bg-gray-600 rounded w-full"></div>
    <div className="h-2 bg-gray-300 dark:bg-gray-600 rounded w-5/6"></div>
  </div>
);

const SkeletonProfile = () => (
  <div className="animate-pulse">
    <div className="flex flex-col md:flex-row gap-4 sm:gap-6">
      <div className="md:w-1/3 flex flex-col items-center">
        <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 bg-gray-300 dark:bg-gray-700 rounded-full mb-3 sm:mb-4"></div>
        <div className="h-4 sm:h-5 md:h-6 bg-gray-300 dark:bg-gray-700 rounded w-32 sm:w-40 md:w-48 mb-1 sm:mb-2"></div>
        <div className="h-3 sm:h-4 bg-gray-300 dark:bg-gray-700 rounded w-24 sm:w-32"></div>
      </div>
      <div className="md:w-2/3 space-y-3 sm:space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-8 sm:h-10 bg-gray-300 dark:bg-gray-700 rounded"></div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const CollegePortal = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [stats, setStats] = useState<Stat[]>([]);
  const [userSection, setUserSection] = useState<Section | null>(null);
  const [allSections, setAllSections] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [loginHistory, setLoginHistory] = useState<Array<{ time: string; device?: string }>>([]);
  const [notificationSettings, setNotificationSettings] = useState([
    { label: "Email Notifications", description: "Receive updates via email", checked: true },
    { label: "Push Notifications", description: "Get notified on your device", checked: true },
    { label: "Assignment Reminders", description: "Remind before deadlines", checked: true },
    { label: "Grade Updates", description: "Notify when grades are posted", checked: false },
    { label: "Course Announcements", description: "Important course updates", checked: true },
    { label: "Payment Reminders", description: "Tuition and fee reminders", checked: false },
  ]);

  // NEW: State for submit assignment modal
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  // NEW: State for notification modal
  const [showNotificationModal, setShowNotificationModal] = useState(false);

  // NEW: State for centered alerts
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    title: '',
    message: '',
    type: 'info' as 'success' | 'error' | 'info' | 'warning'
  });

  // NEW: State for calendar modal
  const [showCalendarModal, setShowCalendarModal] = useState(false);

  const hasFetched = useRef(false);

  const colorGradients = [
    "from-blue-500 to-cyan-500",
    "from-purple-500 to-pink-500",
    "from-green-500 to-emerald-500",
    "from-amber-500 to-orange-500",
    "from-red-500 to-pink-500",
    "from-indigo-500 to-purple-500"
  ];

  // Calculate GPA
  const calculateGPA = useCallback(() => {
    if (courses.length === 0) return "0.00";
    // Mock GPA calculation based on number of courses
    const baseGPA = 1.5; // Starting GPA
    const adjustment = courses.length * 0.1;
    const finalGPA = Math.min(1.0 + adjustment, 4.0);
    return finalGPA.toFixed(2);
  }, [courses]);

  // Calculate stats with GPA
  const calculateStats = useCallback((coursesData: Course[], assignmentsData: Assignment[]) => {
    const totalCredits = coursesData?.reduce((sum: number, course: Course) => sum + (course.credits || 0), 0) || 0;
    const pendingAssignments = assignmentsData.filter((a: Assignment) => !a.dueDate.includes("Overdue")).length;
    const currentGPA = calculateGPA();

    const newStats: Stat[] = [
      {
        label: "Current GPA",
        value: currentGPA,
        change: "+0.15",
        icon: Award,
        color: "text-green-500",
        bgColor: "bg-green-500/10"
      },
      {
        label: "Active Subjects",
        value: coursesData?.length?.toString() || "0",
        change: "+0",
        icon: BookOpen,
        color: "text-blue-500",
        bgColor: "bg-blue-500/10"
      },
      {
        label: "Pending Tasks",
        value: pendingAssignments.toString(),
        change: "-3",
        icon: Clock,
        color: "text-amber-500",
        bgColor: "bg-amber-500/10"
      }
    ];

    setStats(newStats);
  }, [calculateGPA]);

  // NEW: Show centered alert function
  const showCenteredAlert = (title: string, message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    setAlertConfig({ title, message, type });
    setShowAlert(true);
  };

  // Format time ago
  const formatTimeAgo = useCallback((dateString: string) => {
    if (!dateString) return "Just now";
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }, []);

  // Format due date
  const formatDueDate = useCallback((dateString: string) => {
    if (!dateString) return "No due date";
    const dueDate = new Date(dateString);
    const now = new Date();
    const diffTime = dueDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    if (diffDays < 0) return "Overdue";
    if (diffDays < 7) return `In ${diffDays} days`;
    if (diffDays < 14) return "Next week";
    return dueDate.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }, []);

  // Get next class
  const getNextClass = useCallback((scheduleDay: string) => {
    if (!scheduleDay) return "Mon, 10:00 AM";
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const today = new Date().getDay();
    const scheduleDays = scheduleDay.split(",").map((d: string) => d.trim());
    
    for (let i = 1; i <= 7; i++) {
      const nextDayIndex = (today + i) % 7;
      const nextDay = days[nextDayIndex];
      if (scheduleDays.includes(nextDay)) {
        return `${nextDay}, ${scheduleDay.includes("Morning") ? "10:00 AM" : "2:00 PM"}`;
      }
    }
    return scheduleDay;
  }, []);

  // Helper function to get year number
  const getYearNumber = (yearString: string | undefined): number => {
    if (!yearString) return 1;
    if (!isNaN(Number(yearString))) return Number(yearString);
    const match = yearString.match(/\d+/);
    return match ? parseInt(match[0]) : 1;
  };

  // Calculate notifications
  const calculateNotifications = useCallback((msgs: Message[], assgns: Assignment[]) => {
    const unreadMessages = msgs.filter((m: Message) => m.unread).length;
    const upcomingAssignments = assgns.filter((a: Assignment) => 
      a.dueDate === "Today" || a.dueDate === "Tomorrow"
    ).length;
    setUnreadCount(unreadMessages + upcomingAssignments);
    
    // Create notification objects
    const notificationList: Notification[] = [
      ...msgs.filter(m => m.unread).map((msg, index) => ({
        id: `msg-${index}`,
        title: "New Message",
        message: `From ${msg.sender}: ${msg.subject}`,
        time: msg.time,
        type: 'message' as const,
        read: false,
        action: () => {
          setActiveTab("messages");
          setShowNotificationModal(false);
        }
      })),
      ...assgns.filter(a => a.dueDate === "Today" || a.dueDate === "Tomorrow").map((assgn, index) => ({
        id: `assgn-${index}`,
        title: "Assignment Due Soon",
        message: `${assgn.title} is due ${assgn.dueDate.toLowerCase()}`,
        time: "Just now",
        type: 'assignment' as const,
        read: false,
        action: () => {
          setSelectedAssignment(assgn);
          const course = courses.find(c => c.code === assgn.course);
          setSelectedCourse(course || null);
          setShowNotificationModal(false);
          setShowSubmitModal(true);
        }
      }))
    ];
    
    setNotifications(notificationList);
  }, [courses]);

  // Fetch login history
  const fetchLoginHistory = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;

      // Mock login history (in real app, you'd have a login_history table)
      const mockHistory = [
        { time: new Date().toLocaleString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        }), device: "Current Session" },
        { time: new Date(Date.now() - 86400000).toLocaleString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        }), device: "Previous Login" },
        { time: new Date(Date.now() - 172800000).toLocaleString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        }), device: "Account Created" },
      ];

      setLoginHistory(mockHistory);
    } catch (error) {
      console.error("Error fetching login history:", error);
    }
  }, []);

  // Fetch user courses
  const fetchUserCourses = useCallback(async (userId: string) => {
    try {
      // First check if user exists in users table
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("section, program_strand, year_grade")
        .eq("id", userId)
        .single();

      if (userError || !userData) {
        console.log("User not found or incomplete data, using mock courses");
        // Fallback to mock data
        const mockCourses: Course[] = [
          { id: 1, code: "CS101", name: "Introduction to Programming", professor: "Dr. Smith", progress: 0, color: "from-blue-500 to-cyan-500", assignments: 0, nextClass: "Mon, 10:00 AM" },
          { id: 2, code: "MATH201", name: "Calculus II", professor: "Prof. Johnson", progress: 0, color: "from-purple-500 to-pink-500", assignments: 0, nextClass: "Tue, 2:00 PM" },
          { id: 3, code: "PHYS101", name: "Physics I", professor: "Dr. Williams", progress: 0, color: "from-green-500 to-emerald-500", assignments: 0, nextClass: "Wed, 9:00 AM" },
        ];
        setCourses(mockCourses);
        calculateStats(mockCourses, assignments);
        return mockCourses;
      }

      // Get user's section from sections table
      let userSectionData = null;
      if (userData.section) {
        const { data: sectionData } = await supabase
          .from("sections")
          .select("*")
          .eq("section_code", userData.section)
          .maybeSingle();
        userSectionData = sectionData;
      }

      // Fetch subjects for user's section
      if (userSectionData) {
        const { data: subjectsData, error: subjectsError } = await supabase
          .from("subjects")
          .select("*")
          .eq("section_id", userSectionData.id);

        if (!subjectsError && subjectsData && subjectsData.length > 0) {
          const formattedCourses: Course[] = subjectsData.map((subject: any, index: number) => ({
            id: subject.id || index,
            code: subject.subject_code || `SUB${index}`,
            name: subject.subject_name || "Unnamed Subject",
            professor: subject.professor || "Professor",
            progress: 0, // No progress yet
            color: colorGradients[index % colorGradients.length],
            assignments: 0, // Teachers haven't assigned anything yet
            credits: subject.credits || 3,
            schedule: {
              day: subject.schedule_day || "Monday, Wednesday",
              time: subject.schedule_time || "10:00 AM - 11:30 AM",
              room: subject.room || "Room 301"
            },
            section: userSectionData.section_code,
            nextClass: getNextClass(subject.schedule_day)
          }));

          setCourses(formattedCourses);
          calculateStats(formattedCourses, assignments);
          return;
        }
      }

      // Fallback to mock data if no subjects found
      console.log("No subjects found for user's section, using mock data");
      const mockCourses: Course[] = [
        { id: 1, code: "CS101", name: "Introduction to Programming", professor: "Dr. Smith", progress: 0, color: "from-blue-500 to-cyan-500", assignments: 0, nextClass: "Mon, 10:00 AM" },
        { id: 2, code: "MATH201", name: "Calculus II", professor: "Prof. Johnson", progress: 0, color: "from-purple-500 to-pink-500", assignments: 0, nextClass: "Tue, 2:00 PM" },
        { id: 3, code: "PHYS101", name: "Physics I", professor: "Dr. Williams", progress: 0, color: "from-green-500 to-emerald-500", assignments: 0, nextClass: "Wed, 9:00 AM" },
      ];
      setCourses(mockCourses);
      calculateStats(mockCourses, assignments);

    } catch (error) {
      console.error("Error fetching courses:", error);
      // Fallback to mock data
      const mockCourses: Course[] = [
        { id: 1, code: "CS101", name: "Introduction to Programming", professor: "Dr. Smith", progress: 0, color: "from-blue-500 to-cyan-500", assignments: 0, nextClass: "Mon, 10:00 AM" },
        { id: 2, code: "MATH201", name: "Calculus II", professor: "Prof. Johnson", progress: 0, color: "from-purple-500 to-pink-500", assignments: 0, nextClass: "Tue, 2:00 PM" },
        { id: 3, code: "PHYS101", name: "Physics I", professor: "Dr. Williams", progress: 0, color: "from-green-500 to-emerald-500", assignments: 0, nextClass: "Wed, 9:00 AM" },
      ];
      setCourses(mockCourses);
      calculateStats(mockCourses, assignments);
    }
  }, [colorGradients, getNextClass, calculateStats, assignments]);

  // Fetch user assignments
  const fetchUserAssignments = useCallback(async (userId: string) => {
    try {
      // Get user's subject IDs
      const { data: subjectsData } = await supabase
        .from("student_subjects")
        .select("subject_id")
        .eq("student_id", userId);

      if (!subjectsData?.length) {
        // No assignments yet
        setAssignments([]);
        return;
      }

      const subjectIds = subjectsData.map((item: any) => item.subject_id);

      const { data, error } = await supabase
        .from("assignments")
        .select(`*, subjects ( subject_code, subject_name )`)
        .in("subject_id", subjectIds)
        .order("due_date", { ascending: true });

      if (error) throw error;

      const formattedAssignments: Assignment[] = (data || []).map((assignment: any) => ({
        id: assignment.id,
        title: assignment.title,
        course: assignment.subjects?.subject_code || "N/A",
        dueDate: formatDueDate(assignment.due_date),
        priority: assignment.priority || "medium",
        points: assignment.total_points || 100,
        description: assignment.description
      }));

      setAssignments(formattedAssignments.slice(0, 5));
    } catch (error) {
      console.error("Error fetching assignments:", error);
      // No assignments yet
      setAssignments([]);
    }
  }, [formatDueDate]);

  // Fetch user messages
  const fetchUserMessages = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("messages")
        .select(`*, sender:profiles!messages_sender_id_fkey(full_name, avatar_url)`)
        .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
        .order("created_at", { ascending: false })
        .limit(5);

      if (error) throw error;

      const formattedMessages: Message[] = (data || []).map((msg: any) => ({
        id: msg.id,
        sender: msg.sender?.full_name || "Unknown",
        subject: msg.subject || "No Subject",
        preview: msg.content?.substring(0, 100) + "..." || "No content",
        time: formatTimeAgo(msg.created_at),
        unread: !msg.is_read && msg.receiver_id === userId
      }));

      setMessages(formattedMessages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      // Empty messages by default
      setMessages([]);
    }
  }, [formatTimeAgo]);

  // Fetch user data
  const fetchUserData = useCallback(async () => {
    if (hasFetched.current) return; // Prevent multiple fetches
      hasFetched.current = true;

    setIsLoading(true);
    setError(null);

    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError) {
        setError("Session error.");
        return;
      }

      if (!session) {
        navigate("/dblogin/login");
        return;
      }

      const user = session.user;
      setUserEmail(user.email || "");

      // Fetch from users table
      let { data: userData, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();

      if (userError) {
        console.error("Error fetching user:", userError);
        // Fallback to minimal user data
        userData = {
          id: user.id,
          full_name: user.user_metadata?.full_name || "User",
          email: user.email,
          role: user.user_metadata?.role || "student",
          section: user.user_metadata?.section,
          program_strand: user.user_metadata?.program_strand,
          year_grade: user.user_metadata?.year_grade,
          student_type: user.user_metadata?.student_type
        };
      }

      // Set user data
      setUserData(userData);
      setUserName(userData.full_name || "User");

      // Fetch user's section from sections table using section_code
      if (userData.section) {
        const { data: sectionData, error: sectionError } = await supabase
          .from("sections")
          .select("*")
          .eq("section_code", userData.section)
          .maybeSingle();

        if (!sectionError && sectionData) {
          setUserSection(sectionData);
        } else {
          // If no section found in sections table, create a section object from user data
          setUserSection({
            section_code: userData.section,
            program: userData.program_strand,
            year_level: userData.year_grade,
            student_type: userData.student_type
          });
        }
      }

      // Fetch related data
      await fetchUserCourses(user.id);
      await fetchUserAssignments(user.id);
      await fetchUserMessages(user.id);
      await fetchLoginHistory();

      // notifications AFTER messages+assignments finished loading
      setTimeout(() => {
        calculateNotifications(messages, assignments);
      }, 50);

    } catch (error) {
      console.error("FETCH USER DATA ERROR:", error);
      setError("Something went wrong while loading your data.");
    } finally {
      setIsLoading(false);
    }
  }, [navigate, fetchUserCourses, fetchUserAssignments, fetchUserMessages, calculateNotifications, fetchLoginHistory, messages, assignments]);

  // Handle logout
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setUserName("");
      setUserEmail("");
      setUserData(null);
      setCourses([]);
      setMessages([]);
      setAssignments([]);
      setStats([]);
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      showCenteredAlert("Logout Error", "Failed to logout. Please try again.", "error");
    }
  };

  // Update profile
  const updateProfile = async (updates: any) => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        console.error("User error:", userError);
        return;
      }

      let error = null;
      const { error: usersError } = await supabase
        .from("users")
        .update(updates)
        .eq("id", user.id);
        
      if (usersError) {
        console.log("Trying profiles table for update...");
        const { error: profilesError } = await supabase
          .from("profiles")
          .update(updates)
          .eq("id", user.id);
        error = profilesError;
      } else {
        error = usersError;
      }

      if (error) throw error;

      fetchUserData();
    } catch (error) {
      console.error("Error updating profile:", error);
      showCenteredAlert("Update Error", "Failed to update profile. Please try again.", "error");
    }
  };

  // Handle notification toggle
  const handleNotificationToggle = (index: number) => {
    const updatedSettings = [...notificationSettings];
    updatedSettings[index].checked = !updatedSettings[index].checked;
    setNotificationSettings(updatedSettings);
    
    // Show success message
    showCenteredAlert(
      "Notification Settings",
      `Successfully ${updatedSettings[index].checked ? 'enabled' : 'disabled'} ${updatedSettings[index].label}`,
      "success"
    );
  };

  // Handle delete account
  const handleDeleteAccount = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Delete user from auth
      const { error: authError } = await supabase.auth.admin.deleteUser(user.id);
      
      if (authError) {
        console.error("Error deleting account:", authError);
        showCenteredAlert("Delete Error", "Error deleting account. Please contact support.", "error");
        return;
      }

      // Delete from users table
      const { error: userError } = await supabase
        .from("users")
        .delete()
        .eq("id", user.id);

      if (userError) {
        console.error("Error deleting user data:", userError);
      }

      showCenteredAlert("Account Deleted", "Account deleted successfully.", "success");
      setTimeout(() => {
        handleLogout();
      }, 1500);
    } catch (error) {
      console.error("Delete account error:", error);
      showCenteredAlert("Delete Error", "Error deleting account. Please contact support.", "error");
    }
  };

  // Handle profile image change
  const handleProfileImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showCenteredAlert("File Too Large", "File size should be less than 5MB", "error");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setProfileImage(base64String);
      updateProfile({ avatar_url: base64String });
      showCenteredAlert("Profile Updated", "Profile image updated successfully!", "success");
    };
    reader.readAsDataURL(file);
  };

  // NEW: Handle assignment submission
  const handleSubmitAssignment = (assignment: Assignment) => {
    // Find the course for this assignment
    const course = courses.find(c => c.code === assignment.course);
    setSelectedAssignment(assignment);
    setSelectedCourse(course || null);
    setShowSubmitModal(true);
  };

  // Initialize user data and CSRF token
  useEffect(() => {
    // Generate and store CSRF token on component mount
    const existingToken = getStoredCSRFToken();
    if (!existingToken) {
      const newToken = generateCSRFToken();
      storeCSRFToken(newToken);
    }

    fetchUserData();
  }, [fetchUserData]);

  // Header Component
  const Header = () => (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800">
      <div className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-1 sm:p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <Menu size={20} className="sm:w-6 sm:h-6" />
            </button>
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div>
                <img src="/images/logo/logo.png" alt="Logo" className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12" />
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 dark:text-white truncate">College Portal</h1>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate max-w-[150px] sm:max-w-[200px] md:max-w-none">
                  {userSection 
                    ? `${userSection.section_code} • ${userSection?.program || userData?.program_strand || "Student"}`
                    : "Student Dashboard"}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4">
            {/* Notifications */}
            <button 
              onClick={() => setShowNotificationModal(true)}
              className="relative p-1 sm:p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <Bell size={18} className="sm:w-5 sm:h-5 md:w-6 md:h-6 text-gray-600 dark:text-gray-300" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 p-1 sm:p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-[#7B1112] to-[#FFB302] rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-sm">
                  {userName.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()}
                </div>
                <div className="hidden md:block text-left min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-[100px] lg:max-w-[150px]">{userName}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[100px] lg:max-w-[150px]">
                    {userSection?.program || userData?.program_strand || "Student"}
                  </p>
                </div>
                <ChevronDown size={14} className="hidden md:block text-gray-400 sm:w-4 sm:h-4" />
              </button>

              {showUserMenu && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowUserMenu(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border dark:border-gray-700 py-2 z-50 animate-fade-in">
                    <div className="px-4 py-3 border-b dark:border-gray-700">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{userName}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{userEmail}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 truncate">
                        {userSection?.section_code || "No Section"}
                      </p>
                    </div>
                    <button 
                      onClick={() => {
                        setActiveTab("profile");
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center"
                    >
                      <User size={16} className="inline mr-2" />
                      My Profile
                    </button>
                    <button 
                      onClick={() => {
                        setActiveTab("settings");
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center"
                    >
                      <Settings size={16} className="inline mr-2" />
                      Settings
                    </button>
                    <div className="border-t dark:border-gray-700 mt-2 pt-2">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center"
                      >
                        <LogOut size={16} className="inline mr-2" />
                        Logout
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );

  // Dashboard View
  const DashboardView = () => (
    <div className="space-y-4 sm:space-y-6 md:space-y-8 p-3 sm:p-4 md:p-6">
      {/* Welcome Header */}
      <div className="relative overflow-hidden rounded-lg sm:rounded-xl md:rounded-2xl bg-gradient-to-r from-gray-900 to-[#7B1112] p-4 sm:p-6 md:p-8 text-white">
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2">Welcome back, {userName}!</h1>
              <p className="text-gray-200 text-sm sm:text-base">Here's your academic overview for today.</p>
            </div>
            <div className="mt-3 sm:mt-4 md:mt-0">
              <button 
                onClick={() => setShowCalendarModal(true)}
                className="flex items-center space-x-1 sm:space-x-2 bg-white/20 hover:bg-white/30 px-3 sm:px-4 md:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl transition-all hover:scale-105 text-sm sm:text-base"
              >
                <Calendar size={16} className="sm:w-5 sm:h-5" />
                <span>View Calendar</span>
              </button>
            </div>
          </div>
          <div className="mt-4 sm:mt-5 md:mt-6 flex flex-wrap items-center gap-2 sm:gap-3 md:gap-4 text-xs sm:text-sm">
            <span className="flex items-center px-2 sm:px-3 py-1 bg-white/10 rounded-full">
              <GraduationCap size={12} className="sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span className="truncate max-w-[120px] sm:max-w-none">{userSection?.program || userData?.program_strand || "Computer Science"}</span>
            </span>
            <span className="flex items-center px-2 sm:px-3 py-1 bg-white/10 rounded-full">
              <Award size={12} className="sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span className="truncate max-w-[120px] sm:max-w-none">
                {userSection 
                  ? `${userSection.section_code} • ${userSection.year_level || userData?.year_grade || "Year 1"}`
                  : "Year 3 • Semester 2"}
              </span>
            </span>
            <span className="flex items-center px-2 sm:px-3 py-1 bg-white/10 rounded-full">
              <CheckCircle size={12} className="sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span>{courses.length} Active Subjects</span>
            </span>
          </div>
        </div>
        <div className="absolute -right-10 sm:-right-20 -top-10 sm:-top-20 w-40 h-40 sm:w-64 sm:h-64 bg-gradient-to-br from-[#FFB302]/20 to-transparent rounded-full"></div>
        <div className="absolute -left-5 sm:-left-10 -bottom-5 sm:-bottom-10 w-24 h-24 sm:w-40 sm:h-40 bg-gradient-to-tr from-[#FFB302]/10 to-transparent rounded-full"></div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
        {isLoading ? (
          Array(3).fill(0).map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg sm:rounded-xl p-4 sm:p-6">
              <div className="h-3 sm:h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2 mb-3 sm:mb-4"></div>
              <div className="h-6 sm:h-7 md:h-8 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
            </div>
          ))
        ) : (
          stats.map((stat, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-5 md:p-6 border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">{stat.label}</p>
                  <p className="text-xl sm:text-2xl md:text-3xl font-bold mt-1 sm:mt-2 truncate">{stat.value}</p>
                  <p className={`text-xs sm:text-sm mt-1 ${stat.change.startsWith("+") ? "text-green-500" : "text-red-500"}`}>
                    {stat.change} from last month
                  </p>
                </div>
                <div className={`p-2 sm:p-3 rounded-lg ${stat.bgColor} ${stat.color} group-hover:scale-110 transition-transform ml-2 sm:ml-4`}>
                  <stat.icon size={20} className="sm:w-6 sm:h-6" />
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
        {/* Left Column - Subjects & Assignments */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6 md:space-y-8">
          {/* Subjects Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl md:rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="p-3 sm:p-4 md:p-6 border-b border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center justify-between">
              <div className="flex-1 min-w-0">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white truncate">My Subjects</h2>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 truncate">Current semester enrollment</p>
              </div>
              <button 
                onClick={() => setActiveTab("courses")}
                className="mt-2 sm:mt-0 text-[#7B1112] dark:text-[#FFB302] font-medium hover:underline transition-colors text-sm sm:text-base whitespace-nowrap"
              >
                View All →
              </button>
            </div>
            <div className="p-3 sm:p-4 md:p-6">
              {isLoading ? (
                <div className="space-y-3 sm:space-y-4">
                  {Array(3).fill(0).map((_, i) => <SkeletonCard key={i} />)}
                </div>
              ) : courses.length === 0 ? (
                <div className="text-center py-6 sm:py-8">
                  <BookOpen className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">No subjects enrolled yet</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                  {courses.slice(0, 4).map((course) => (
                    <div key={course.id} className="group relative bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-lg sm:rounded-xl border border-gray-200 dark:border-gray-700 p-3 sm:p-4 md:p-5 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                      <div className="flex items-start justify-between mb-3 sm:mb-4">
                        <div className="flex-1 min-w-0">
                          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 truncate">{course.code}</span>
                          <h3 className="font-bold text-gray-900 dark:text-white mt-1 text-sm sm:text-base md:text-lg truncate">{course.name}</h3>
                          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-1 truncate">{course.professor}</p>
                        </div>
                        <div className={`p-2 rounded-lg bg-gradient-to-r ${course.color} ml-2`}>
                          <BookMarked size={16} className="sm:w-5 sm:h-5 text-white" />
                        </div>
                      </div>
                      <div className="space-y-3 sm:space-y-4">
                        <div className="text-center py-3 sm:py-4">
                          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Progress will appear here</p>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs sm:text-sm text-gray-500 dark:text-gray-400 gap-1 sm:gap-0">
                          <span className="flex items-center">
                            <Calendar size={12} className="mr-1 sm:mr-2" />
                            <span className="truncate">{course.nextClass}</span>
                          </span>
                          <span className="flex items-center">
                            <FileText size={12} className="mr-1 sm:mr-2" />
                            {course.assignments} assignments
                          </span>
                        </div>
                      </div>
                      <button className="mt-3 sm:mt-4 w-full py-2 text-xs sm:text-sm font-medium text-[#7B1112] dark:text-[#FFB302] hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors truncate">
                        Continue Learning →
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Assignments Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl md:rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="p-3 sm:p-4 md:p-6 border-b border-gray-100 dark:border-gray-700">
              <div className="flex-1 min-w-0">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white truncate">Upcoming Assignments</h2>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 truncate">Due dates approaching</p>
              </div>
            </div>
            <div className="p-3 sm:p-4 md:p-6">
              {isLoading ? (
                <div className="space-y-3 sm:space-y-4">
                  {Array(3).fill(0).map((_, i) => <SkeletonCard key={i} />)}
                </div>
              ) : assignments.length === 0 ? (
                <div className="text-center py-6 sm:py-8">
                  <FileText className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">No assignments yet</p>
                  <p className="text-xs sm:text-sm text-gray-400 mt-2">Assignments will appear here when teachers assign them</p>
                </div>
              ) : (
                <div className="space-y-2 sm:space-y-3">
                  {assignments.map((assignment) => (
                    <div key={assignment.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 rounded-lg sm:rounded-xl border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group hover:shadow-md">
                      <div className="flex items-start sm:items-center gap-2 sm:gap-3 mb-3 sm:mb-0 flex-1 min-w-0">
                        <div className={`p-2 sm:p-3 rounded-lg flex-shrink-0 ${
                          assignment.priority === "high" ? "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400" :
                          assignment.priority === "medium" ? "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400" :
                          "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                        }`}>
                          <FileText size={16} className="sm:w-5 sm:h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base truncate">{assignment.title}</h4>
                          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 truncate">
                            {assignment.course} • {assignment.points} points • Due {assignment.dueDate}
                          </p>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleSubmitAssignment(assignment)}
                        className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-white bg-gradient-to-r from-[#7B1112] to-[#FFB302] rounded-lg hover:opacity-90 transition-all hover:scale-105 w-full sm:w-auto mt-2 sm:mt-0"
                      >
                        Submit
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4 sm:space-y-6 md:space-y-8">
          {/* Quick Actions */}
          <div className="bg-gradient-to-br from-[#7B1112] to-[#FFB302] rounded-lg sm:rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-6 text-white">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 sm:mb-5 md:mb-6">Quick Actions</h2>
            <div className="space-y-2 sm:space-y-3">
              <button
                onClick={() => {
                  if (assignments.length === 0) {
                    showCenteredAlert(
                      "No Assignments",
                      "No assignments available yet. Teachers haven't assigned anything.",
                      "info"
                    );
                  } else {
                    setActiveTab("courses");
                  }
                }}
                className="w-full flex items-center justify-between p-3 sm:p-4 bg-white/10 hover:bg-white/20 rounded-lg sm:rounded-xl transition-all group hover:scale-[1.02] text-sm sm:text-base"
              >
                <span className="truncate">Submit Assignment</span>
                <Upload size={16} className="sm:w-5 sm:h-5 flex-shrink-0 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => setActiveTab("courses")}
                className="w-full flex items-center justify-between p-3 sm:p-4 bg-white/10 hover:bg-white/20 rounded-lg sm:rounded-xl transition-all group hover:scale-[1.02] text-sm sm:text-base"
              >
                <span className="truncate">View Subjects</span>
                <BarChart3 size={16} className="sm:w-5 sm:h-5 flex-shrink-0 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => navigate("/viewgrades")}
                className="w-full flex items-center justify-between p-3 sm:p-4 bg-white/10 hover:bg-white/20 rounded-lg sm:rounded-xl transition-all group hover:scale-[1.02] text-sm sm:text-base"
              >
                <span className="truncate">View Grades</span>
                <TrendingUp size={16} className="sm:w-5 sm:h-5 flex-shrink-0 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Messages Preview */}
          <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl md:rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="p-3 sm:p-4 md:p-6 border-b border-gray-100 dark:border-gray-700">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white truncate">Recent Messages</h2>
                </div>
                <button 
                  onClick={() => setActiveTab("messages")}
                  className="mt-2 sm:mt-0 text-[#7B1112] dark:text-[#FFB302] text-xs sm:text-sm font-medium hover:underline transition-colors whitespace-nowrap"
                >
                  View All
                </button>
              </div>
            </div>
            <div className="p-3 sm:p-4 md:p-6">
              {isLoading ? (
                <div className="space-y-3 sm:space-y-4">
                  {Array(3).fill(0).map((_, i) => <SkeletonCard key={i} />)}
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center py-6 sm:py-8">
                  <Mail className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">No messages yet</p>
                  <p className="text-xs sm:text-sm text-gray-400 mt-2">Messages from professors will appear here</p>
                </div>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  {messages.map((message) => (
                    <div 
                      key={message.id} 
                      className={`p-3 sm:p-4 rounded-lg sm:rounded-xl border ${
                        message.unread 
                          ? "border-blue-200 dark:border-blue-900/50 bg-blue-50 dark:bg-blue-900/10" 
                          : "border-gray-100 dark:border-gray-700"
                      } hover:shadow-md transition-all cursor-pointer group hover:scale-[1.02]`}
                      onClick={() => setActiveTab("messages")}
                    >
                      <div className="flex items-start gap-2 sm:gap-3">
                        <div className={`p-2 rounded-lg flex-shrink-0 ${
                          message.unread 
                            ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" 
                            : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                        }`}>
                          <Mail size={14} className="sm:w-4 sm:h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                            <h4 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base truncate group-hover:text-[#7B1112] dark:group-hover:text-[#FFB302] transition-colors">
                              {message.sender}
                            </h4>
                            <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 sm:mt-0">{message.time}</span>
                          </div>
                          <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white mt-1 truncate">{message.subject}</p>
                          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">{message.preview}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Academic Calendar */}
          <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl md:rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-3 sm:p-4 md:p-6">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-5 md:mb-6">Academic Calendar</h2>
            <div className="text-center py-6 sm:py-8">
              <CalendarDays className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
              <p className="text-sm text-gray-500 dark:text-gray-400">No upcoming events</p>
              <p className="text-xs sm:text-sm text-gray-400 mt-2">Calendar events will appear here</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Subjects Section
  const SubjectsSection = () => (
    <div className="space-y-4 sm:space-y-6 md:space-y-8 p-3 sm:p-4 md:p-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl md:rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 border border-gray-100 dark:border-gray-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 sm:mb-6 md:mb-8">
          <div className="flex-1 min-w-0">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white truncate">My Subjects</h2>
            <p className="text-xs sm:text-sm md:text-base text-gray-500 dark:text-gray-400 mt-1 sm:mt-2 truncate">View and manage your enrolled subjects</p>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-3 mt-3 sm:mt-4 md:mt-0">
            <button className="px-3 sm:px-4 md:px-6 py-2 bg-[#7B1112] text-white rounded-lg hover:bg-[#8B2122] transition-all hover:scale-105 flex items-center text-xs sm:text-sm md:text-base whitespace-nowrap">
              <BookOpen size={16} className="sm:w-5 sm:h-5 mr-1 sm:mr-2" />
              Enroll Subject
            </button>
          </div>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
            {Array(6).fill(0).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-8 sm:py-10 md:py-12">
            <BookOpen className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 text-gray-400 mx-auto mb-3 sm:mb-4" />
            <h3 className="text-base sm:text-lg md:text-xl font-medium text-gray-900 dark:text-white mb-1 sm:mb-2">No subjects enrolled</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Subjects will appear here once you're enrolled</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              {courses.map((course, _index) => (
                <div key={course.id} className="group relative bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl md:rounded-2xl border border-gray-200 dark:border-gray-700 p-3 sm:p-4 md:p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 sm:hover:-translate-y-2">
                  <div className="absolute top-2 right-2 sm:top-3 sm:right-3 md:top-4 md:right-4">
                    <button className="p-1 sm:p-1.5 md:p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                      <MoreVertical
                        size={14}
                        className={`text-gray-400 sm:w-4 sm:h-4 md:w-5 md:h-5`}
                      />
                    </button>
                  </div>
                  
                  <div className="mb-4 sm:mb-5 md:mb-6">
                    <div className={`inline-block p-2 sm:p-3 rounded-lg sm:rounded-xl bg-gradient-to-r ${course.color} mb-3 sm:mb-4`}>
                      <BookOpen
                        size={18}
                        className={`text-white sm:w-5 sm:h-5 md:w-6 md:h-6`}
                      />
                    </div>
                    <div className="flex items-center justify-between mb-1 sm:mb-2">
                      <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 truncate">{course.code}</span>
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Enrolled</span>
                    </div>
                    <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2 line-clamp-2">{course.name}</h3>
                    <p className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-300 mb-3 sm:mb-4 line-clamp-1 truncate">{course.professor}</p>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-3 sm:mb-4 gap-1 sm:gap-0">
                      <span className="flex items-center truncate">
                        <Calendar size={12} className="mr-1" />
                        {course.nextClass}
                      </span>
                      <span className="flex items-center">
                        <FileText size={12} className="mr-1" />
                        {course.assignments} assignments
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-3 sm:space-y-4">
                    <div className="text-center py-3 sm:py-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Progress will update as you complete work</p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-0 sm:space-x-2 pt-3 sm:pt-4">
                      <button className="flex-1 py-2 sm:py-3 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors truncate">
                        View Details
                      </button>
                      <button className="flex-1 py-2 sm:py-3 text-xs sm:text-sm font-medium text-white bg-gradient-to-r from-[#7B1112] to-[#FFB302] rounded-lg hover:opacity-90 transition-all hover:scale-105 truncate">
                        Open Subject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 sm:mt-8 p-4 sm:p-5 md:p-6 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-lg sm:rounded-xl">
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 dark:text-white text-base sm:text-lg md:text-xl truncate">Need help with subjects?</h3>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-1 truncate">Schedule a meeting with your academic advisor</p>
                </div>
                <button className="mt-3 sm:mt-4 md:mt-0 px-3 sm:px-4 md:px-6 py-2 sm:py-3 bg-gradient-to-r from-[#7B1112] to-[#FFB302] text-white rounded-lg hover:opacity-90 transition-all hover:scale-105 text-xs sm:text-sm md:text-base whitespace-nowrap">
                  Schedule Advisor Meeting
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );

  // Messages Section
  const MessagesSection = () => (
    <div className="space-y-4 sm:space-y-6 md:space-y-8 p-3 sm:p-4 md:p-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl md:rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 border border-gray-100 dark:border-gray-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 sm:mb-6 md:mb-8">
          <div className="flex-1 min-w-0">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white truncate">Messages</h2>
            <p className="text-xs sm:text-sm md:text-base text-gray-500 dark:text-gray-400 mt-1 sm:mt-2 truncate">Communicate with faculty and staff</p>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-3 mt-3 sm:mt-4 md:mt-0">
            <button className="px-3 sm:px-4 md:px-6 py-2 bg-[#7B1112] text-white rounded-lg hover:bg-[#8B2122] transition-all hover:scale-105 flex items-center text-xs sm:text-sm md:text-base whitespace-nowrap">
              <Mail size={16} className="sm:w-5 sm:h-5 mr-1 sm:mr-2" />
              New Message
            </button>
          </div>
        </div>
        
        {isLoading ? (
          <div className="space-y-3 sm:space-y-4">
            {Array(5).fill(0).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-8 sm:py-10 md:py-12">
            <MessageSquare className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 text-gray-400 mx-auto mb-3 sm:mb-4" />
            <h3 className="text-base sm:text-lg md:text-xl font-medium text-gray-900 dark:text-white mb-1 sm:mb-2">No messages</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Your messages will appear here</p>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {messages.map((message) => (
              <div key={message.id} className="group p-3 sm:p-4 md:p-6 bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl border border-gray-100 dark:border-gray-700 hover:border-[#7B1112] dark:hover:border-[#FFB302] hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-2 sm:gap-3 md:gap-4 flex-1 min-w-0">
                    <div className={`p-2 sm:p-3 rounded-lg flex-shrink-0 ${message.unread ? "bg-blue-100 dark:bg-blue-900/30" : "bg-gray-100 dark:bg-gray-700"}`}>
                      <MessageSquare
                        size={16}
                        className={`sm:w-5 sm:h-5 md:w-6 md:h-6 ${
                          message.unread ? "text-blue-600 dark:text-blue-400" : "text-gray-400"
                        }`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <h3 className="font-bold text-gray-900 dark:text-white text-sm sm:text-base md:text-lg truncate">{message.subject}</h3>
                        {message.unread && (
                          <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 text-xs rounded-full flex-shrink-0">
                            New
                          </span>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-1 truncate">From: {message.sender}</p>
                      <p className="text-xs sm:text-sm md:text-base text-gray-700 dark:text-gray-300 mt-2 sm:mt-3 line-clamp-2">{message.preview}</p>
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 md:gap-4 mt-3 sm:mt-4">
                        <button className="text-xs sm:text-sm text-[#7B1112] dark:text-[#FFB302] hover:underline transition-colors">
                          Reply
                        </button>
                        <button className="text-xs sm:text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
                          Mark as read
                        </button>
                        <button className="text-xs sm:text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
                          Archive
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="text-right ml-2 sm:ml-4">
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{message.time}</p>
                    <button className="mt-1 sm:mt-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 sm:p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                      <MoreVertical size={14} className="sm:w-4 sm:h-4 md:w-5 md:h-5 text-gray-400" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  // Profile Section
  const ProfileSection = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [editFormData, setEditFormData] = useState({
      phone: userData?.phone || "",
      address: userData?.address || "",
      bio: userData?.bio || "", // Empty by default
    });

    const getGraduationYear = () => {
      const studentType = userSection?.student_type || userData?.student_type;
      const yearString = userSection?.year_level || userData?.year_grade;
      const yearNumber = getYearNumber(yearString);
      
      if (studentType === "seniorHigh") {
        return new Date().getFullYear() + (2 - yearNumber);
      } else {
        // college
        return new Date().getFullYear() + (4 - yearNumber);
      }
    };

    const handleEditToggle = () => {
      if (isEditing) {
        // Save changes
        const updates = {
          phone: editFormData.phone,
          address: editFormData.address,
          bio: editFormData.bio
        };
        updateProfile(updates);
        showCenteredAlert("Profile Updated", "Successfully saved changes", "success");
      }
      setIsEditing(!isEditing);
    };

    const handleInputChange = (field: string, value: string) => {
      setEditFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
      <div className="space-y-4 sm:space-y-6 md:space-y-8 p-3 sm:p-4 md:p-6">
        <div className="bg-gradient-to-r from-gray-900 to-[#7B1112] rounded-lg sm:rounded-xl md:rounded-2xl p-4 sm:p-6 md:p-8 text-white">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div className="flex-1 min-w-0">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold truncate">My Profile</h2>
              <p className="text-gray-200 mt-1 sm:mt-2 text-sm sm:text-base truncate">Manage your personal information and preferences</p>
            </div>
            <button 
              onClick={handleEditToggle}
              className="mt-3 sm:mt-4 md:mt-0 flex items-center px-3 sm:px-4 md:px-6 py-2 sm:py-3 bg-white/20 hover:bg-white/30 rounded-lg sm:rounded-xl transition-all hover:scale-105 text-sm sm:text-base whitespace-nowrap"
            >
              {isEditing ? (
                <>
                  <Save size={16} className="sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                  Save Profile
                </>
              ) : (
                <>
                  <Edit size={16} className="sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                  Edit Profile
                </>
              )}
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl md:rounded-2xl shadow-lg p-4 sm:p-6 md:p-8">
            <SkeletonProfile />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            <div className="lg:col-span-2 space-y-4 sm:space-y-6 md:space-y-8">
              <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl md:rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="p-4 sm:p-6 md:p-8">
                  <div className="flex flex-col md:flex-row gap-4 sm:gap-6 md:gap-8">
                    <div className="md:w-1/3">
                      <div className="flex flex-col items-center">
                        <div className="relative mb-4 sm:mb-5 md:mb-6">
                          <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 bg-gradient-to-br from-[#7B1112] to-[#FFB302] rounded-full flex items-center justify-center text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 overflow-hidden">
                            {profileImage ? (
                              <img 
                                src={profileImage} 
                                alt="Profile" 
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              userName.split(" ").map((n: string) => n[0]).join("").toUpperCase()
                            )}
                          </div>
                          {isEditing && (
                            <label className="block text-center">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleProfileImageChange}
                                className="hidden"
                              />
                              <span className="px-3 sm:px-4 py-1.5 sm:py-2 bg-[#7B1112] text-white rounded-lg hover:bg-[#8B2122] transition-all hover:scale-105 cursor-pointer text-xs sm:text-sm flex items-center justify-center">
                                <Image size={14} className="sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                                Change Photo
                              </span>
                            </label>
                          )}
                          <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 bg-green-500 rounded-full border-3 sm:border-4 border-white dark:border-gray-800 flex items-center justify-center">
                            <CheckCircle size={12} className="sm:w-4 sm:h-4 md:w-5 md:h-5 text-white" />
                          </div>
                        </div>
                        <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white text-center truncate w-full">{userName}</h3>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-1 text-center truncate w-full">{userEmail}</p>
                        <div className="mt-3 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-xs sm:text-sm font-medium">
                          <CheckCircle size={12} className="sm:w-4 sm:h-4 inline mr-1 sm:mr-2" />
                          Verified Student
                        </div>
                      </div>
                    </div>
                    
                    <div className="md:w-2/3 space-y-4 sm:space-y-6 md:space-y-8">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                        <div className="space-y-1 sm:space-y-2">
                          <label className="block text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">Student ID</label>
                          <p className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 dark:text-white truncate">{userData?.school_id || "2023-0012345"}</p>
                        </div>
                        <div className="space-y-1 sm:space-y-2">
                          <label className="block text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">Program</label>
                          <p className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 dark:text-white truncate">{userSection?.program || userData?.program_strand || "Computer Science"}</p>
                        </div>
                        <div className="space-y-1 sm:space-y-2">
                          <label className="block text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">Section</label>
                          <p className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 dark:text-white truncate">
                            {userSection?.section_code || userData?.section || "CS1M1"}
                            {userSection?.program ? ` - ${userSection.program}` : ""}
                          </p>
                        </div>
                        <div className="space-y-1 sm:space-y-2">
                          <label className="block text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">Year Level</label>
                          <p className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 dark:text-white truncate">
                            {userSection?.year_level || userData?.year_grade || "1"} 
                            ({userSection?.student_type === "seniorHigh" ? "Senior High" : "College"})
                          </p>
                        </div>
                        <div className="space-y-1 sm:space-y-2">
                          <label className="block text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">Phone</label>
                          {isEditing ? (
                            <input
                              type="tel"
                              value={editFormData.phone}
                              onChange={(e) => handleInputChange("phone", e.target.value)}
                              className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border dark:border-gray-600 rounded bg-white dark:bg-gray-800 focus:ring-2 focus:ring-[#7B1112] transition-all text-sm sm:text-base"
                              placeholder="Enter phone number"
                            />
                          ) : (
                            <p className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 dark:text-white truncate">
                              {editFormData.phone || "Not provided"}
                            </p>
                          )}
                        </div>
                        <div className="space-y-1 sm:space-y-2">
                          <label className="block text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">Address</label>
                          {isEditing ? (
                            <input
                              type="text"
                              value={editFormData.address}
                              onChange={(e) => handleInputChange("address", e.target.value)}
                              className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border dark:border-gray-600 rounded bg-white dark:bg-gray-800 focus:ring-2 focus:ring-[#7B1112] transition-all text-sm sm:text-base"
                              placeholder="Enter address"
                            />
                          ) : (
                            <p className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 dark:text-white truncate">
                              {editFormData.address || "Not provided"}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div className="pt-4 sm:pt-5 md:pt-6 border-t dark:border-gray-700">
                        <h4 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">Bio</h4>
                        {isEditing ? (
                          <textarea
                            value={editFormData.bio}
                            onChange={(e) => handleInputChange("bio", e.target.value)}
                            className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border dark:border-gray-600 rounded bg-white dark:bg-gray-800 focus:ring-2 focus:ring-[#7B1112] transition-all text-sm sm:text-base"
                            rows={3}
                            placeholder="Tell us about yourself..."
                          />
                        ) : editFormData.bio ? (
                          <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300">{editFormData.bio}</p>
                        ) : (
                          <p className="text-sm text-gray-500 dark:text-gray-400 italic">No bio added yet</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl md:rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-4 sm:p-5 md:p-6">
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-5 md:mb-6">Academic Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                  <div className="p-3 sm:p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg sm:rounded-xl hover:shadow-md transition-all">
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Enrollment Date</p>
                    <p className="font-bold text-gray-900 dark:text-white mt-1 sm:mt-2 text-sm sm:text-base md:text-lg">
                      {new Date(userData?.created_at || "").toLocaleDateString("en-US", { month: "long", year: "numeric" }) || "September 2021"}
                    </p>
                  </div>
                  <div className="p-3 sm:p-4 bg-green-50 dark:bg-green-900/20 rounded-lg sm:rounded-xl hover:shadow-md transition-all">
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Expected Graduation</p>
                    <p className="font-bold text-gray-900 dark:text-white mt-1 sm:mt-2 text-sm sm:text-base md:text-lg">
                      May {getGraduationYear()}
                    </p>
                  </div>
                  <div className="p-3 sm:p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg sm:rounded-xl hover:shadow-md transition-all">
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Academic Standing</p>
                    <p className="font-bold text-green-600 dark:text-green-400 mt-1 sm:mt-2 text-sm sm:text-base md:text-lg">Good Standing</p>
                  </div>
                  <div className="p-3 sm:p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg sm:rounded-xl hover:shadow-md transition-all">
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Current GPA</p>
                    <p className="font-bold text-gray-900 dark:text-white mt-1 sm:mt-2 text-sm sm:text-base md:text-lg">{calculateGPA()}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4 sm:space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl md:rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-4 sm:p-5 md:p-6">
                <h4 className="font-semibold text-gray-900 dark:text-white text-base sm:text-lg mb-3 sm:mb-4">Academic Stats</h4>
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center justify-between p-3 sm:p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:shadow-md transition-all">
                    <span className="text-sm sm:text-base text-gray-700 dark:text-gray-300 truncate">Subjects Enrolled</span>
                    <span className="font-bold text-xl sm:text-2xl text-blue-600 dark:text-blue-400">
                      {courses.length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 sm:p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:shadow-md transition-all">
                    <span className="text-sm sm:text-base text-gray-700 dark:text-gray-300 truncate">Current GPA</span>
                    <span className="font-bold text-xl sm:text-2xl text-green-600 dark:text-green-400">
                      {calculateGPA()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 sm:p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:shadow-md transition-all">
                    <span className="text-sm sm:text-base text-gray-700 dark:text-gray-300 truncate">Credits Earned</span>
                    <span className="font-bold text-xl sm:text-2xl text-purple-600 dark:text-purple-400">
                      0
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl md:rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-4 sm:p-5 md:p-6">
                <h4 className="font-semibold text-gray-900 dark:text-white text-base sm:text-lg mb-3 sm:mb-4">Quick Actions</h4>
                <div className="space-y-2 sm:space-y-3">
                  <button className="w-full flex items-center justify-between p-2 sm:p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-all hover:scale-[1.02]">
                    <span className="text-sm sm:text-base text-gray-700 dark:text-gray-300 truncate">Download Transcript</span>
                    <Download size={16} className="sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
                  </button>
                  <button 
                    onClick={() => navigate("/viewgrades")}
                    className="w-full flex items-center justify-between p-2 sm:p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-all hover:scale-[1.02]"
                  >
                    <span className="text-sm sm:text-base text-gray-700 dark:text-gray-300 truncate">View Grades</span>
                    <TrendingUp size={16} className="sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
                  </button>
                  <button className="w-full flex items-center justify-between p-2 sm:p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-all hover:scale-[1.02]">
                    <span className="text-sm sm:text-base text-gray-700 dark:text-gray-300 truncate">Scholarship Status</span>
                    <Award size={16} className="sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Settings Section
  const SettingsSection = () => {
    const [formData, setFormData] = useState({
      phone: userData?.phone || "",
      address: userData?.address || "",
      bio: userData?.bio || "",
    });

    const handleInputChange = (field: string, value: string) => {
      setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSaveProfile = () => {
      const updates = {
        phone: formData.phone,
        address: formData.address,
        bio: formData.bio
      };
      updateProfile(updates);
      showCenteredAlert("Profile Updated", "Successfully saved changes", "success");
    };

    return (
      <div className="space-y-4 sm:space-y-6 md:space-y-8 p-3 sm:p-4 md:p-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl md:rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2">Settings</h2>
          <p className="text-xs sm:text-sm md:text-base text-gray-500 dark:text-gray-400 mb-6 sm:mb-7 md:mb-8">Manage your account preferences and security</p>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            <div className="lg:col-span-2 space-y-4 sm:space-y-6 md:space-y-8">
              {/* Account Settings */}
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg sm:rounded-xl md:rounded-2xl p-4 sm:p-5 md:p-6">
                <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 dark:text-white mb-4 sm:mb-5 md:mb-6">Account Information</h3>
                <div className="space-y-4 sm:space-y-5 md:space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">Full Name</label>
                      <input
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-[#7B1112] focus:border-transparent transition-all text-sm sm:text-base"
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">Email Address</label>
                      <input
                        type="email"
                        value={userEmail}
                        onChange={(e) => setUserEmail(e.target.value)}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-[#7B1112] focus:border-transparent transition-all text-sm sm:text-base"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">Phone Number</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-[#7B1112] focus:border-transparent transition-all text-sm sm:text-base"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">Address</label>
                      <input
                        type="text"
                        value={formData.address}
                        onChange={(e) => handleInputChange("address", e.target.value)}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-[#7B1112] focus:border-transparent transition-all text-sm sm:text-base"
                        placeholder="123 College Ave, University City"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">Bio</label>
                    <textarea
                      value={formData.bio}
                      onChange={(e) => handleInputChange("bio", e.target.value)}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-[#7B1112] focus:border-transparent transition-all text-sm sm:text-base"
                      rows={3}
                      placeholder="Tell us about yourself..."
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={handleSaveProfile}
                      className="px-4 sm:px-5 md:px-6 py-2 sm:py-3 bg-gradient-to-r from-[#7B1112] to-[#FFB302] text-white rounded-lg hover:opacity-90 transition-all hover:scale-105 text-sm sm:text-base"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>

              {/* Notification Settings */}
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg sm:rounded-xl md:rounded-2xl p-4 sm:p-5 md:p-6">
                <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 dark:text-white mb-4 sm:mb-5 md:mb-6">Notification Preferences</h3>
                <div className="space-y-3 sm:space-y-4">
                  {notificationSettings.map((item, index) => (
                    <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl border dark:border-gray-600 hover:shadow-md transition-all">
                      <div className="flex-1 min-w-0 mb-2 sm:mb-0">
                        <p className="font-medium text-gray-900 dark:text-white text-sm sm:text-base truncate">{item.label}</p>
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">{item.description}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={item.checked}
                          onChange={() => handleNotificationToggle(index)}
                        />
                        <div className="w-10 h-5 sm:w-11 sm:h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 sm:after:h-5 sm:after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#7B1112]"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="space-y-4 sm:space-y-6">
              {/* Security Card */}
              <div className="bg-gradient-to-br from-gray-900 to-[#7B1112] rounded-lg sm:rounded-xl md:rounded-2xl p-4 sm:p-5 md:p-6 text-white">
                <Shield size={24} className="sm:w-7 sm:h-7 md:w-8 md:h-8 mb-3 sm:mb-4" />
                <h4 className="font-semibold text-lg sm:text-xl mb-1 sm:mb-2">Security</h4>
                <p className="text-gray-200 text-xs sm:text-sm mb-4 sm:mb-5 md:mb-6">Manage your account security</p>
                <div className="space-y-2 sm:space-y-3">
                  <button 
                    onClick={() => setShowPasswordModal(true)}
                    className="w-full text-left p-3 sm:p-4 bg-white/10 hover:bg-white/20 rounded-lg sm:rounded-xl transition-all hover:scale-[1.02] text-sm sm:text-base"
                  >
                    Change Password
                  </button>
                  <button className="w-full text-left p-3 sm:p-4 bg-white/10 hover:bg-white/20 rounded-lg sm:rounded-xl transition-all hover:scale-[1.02] text-sm sm:text-base">
                    <History size={16} className="sm:w-5 sm:h-5 inline mr-2" />
                    Login History
                  </button>
                </div>
              </div>
              
              {/* Login History */}
              <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl md:rounded-2xl border border-gray-200 dark:border-gray-700 p-4 sm:p-5 md:p-6">
                <h4 className="font-semibold text-gray-900 dark:text-white text-base sm:text-lg mb-3 sm:mb-4">Login History</h4>
                <div className="space-y-2 sm:space-y-3 max-h-48 sm:max-h-56 md:max-h-60 overflow-y-auto">
                  {loginHistory.map((login, index) => (
                    <div key={index} className="p-2 sm:p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:shadow-md transition-all">
                      <div className="flex items-center justify-between">
                        <div className="text-xs sm:text-sm flex-1 min-w-0">
                          <p className="font-medium text-gray-900 dark:text-white truncate">
                            {login.device || `Login ${index + 1}`}
                          </p>
                          <p className="text-gray-500 dark:text-gray-400 truncate">{login.time}</p>
                        </div>
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full ml-2 flex-shrink-0"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Danger Zone */}
              <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl md:rounded-2xl border border-red-200 dark:border-red-900/50 p-4 sm:p-5 md:p-6">
                <h4 className="font-semibold text-red-600 dark:text-red-400 text-base sm:text-lg mb-3 sm:mb-4">Danger Zone</h4>
                <div className="space-y-2 sm:space-y-3">
                  <button 
                    onClick={() => setShowDeleteModal(true)}
                    className="w-full text-left p-2 sm:p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-all hover:scale-[1.02] text-sm sm:text-base"
                  >
                    <Trash2 size={16} className="sm:w-5 sm:h-5 inline mr-2" />
                    Delete Account
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left p-2 sm:p-3 bg-red-600 text-white hover:bg-red-700 rounded-lg transition-all hover:scale-[1.02] text-sm sm:text-base"
                  >
                    <LogOut size={16} className="sm:w-5 sm:h-5 inline mr-2" />
                    Logout from All Devices
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Portal Navigation
  const portalFeatures = [
    {
      title: "Dashboard",
      icon: <Home />,
      action: () => setActiveTab("dashboard")
    },
    {
      title: "Subjects",
      icon: <BookOpen />,
      action: () => setActiveTab("courses")
    },
    {
      title: "Messages",
      icon: <MessageSquare />,
      action: () => setActiveTab("messages")
    },
    {
      title: "Profile",
      icon: <User />,
      action: () => setActiveTab("profile")
    },
    {
      title: "Settings",
      icon: <Settings />,
      action: () => setActiveTab("settings")
    }
  ];

  // Render Active Section
  const renderActiveSection = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardView />;
      case "courses":
        return <SubjectsSection />;
      case "messages":
        return <MessagesSection />;
      case "profile":
        return <ProfileSection />;
      case "settings":
        return <SettingsSection />;
      default:
        return <DashboardView />;
    }
  };

  if (isLoading && activeTab === "dashboard") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <Header />
        <div className="flex items-center justify-center h-[calc(100vh-80px)]">
          <div className="text-center">
            <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 border-4 border-[#7B1112] border-t-transparent rounded-full animate-spin mx-auto mb-3 sm:mb-4"></div>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Header />
      
      {/* Add error display */}
      {error && (
        <div className="mx-3 sm:mx-4 md:mx-6 mt-4 sm:mt-5 md:mt-6 p-3 sm:p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg sm:rounded-xl animate-fade-in">
          <div className="flex items-start sm:items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3 flex-1 min-w-0">
              <p className="text-sm font-medium text-red-800 dark:text-red-200 truncate">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-1 sm:mt-2 text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-500 transition-colors"
              >
                Try Again →
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Modals */}
      <ChangePasswordModal 
        isOpen={showPasswordModal} 
        onClose={() => setShowPasswordModal(false)} 
      />
      
      <DeleteAccountModal 
        isOpen={showDeleteModal} 
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteAccount}
      />

      {/* NEW: Submit Assignment Modal */}
      <SubmitAssignmentModal
        isOpen={showSubmitModal}
        onClose={() => {
          setShowSubmitModal(false);
          setSelectedAssignment(null);
          setSelectedCourse(null);
        }}
        assignment={selectedAssignment}
        course={selectedCourse}
      />

      {/* NEW: Notification Modal */}
      <NotificationModal
        isOpen={showNotificationModal}
        onClose={() => setShowNotificationModal(false)}
        notifications={notifications}
      />

      {/* NEW: Centered Alert Modal */}
      <CenteredAlert
        isOpen={showAlert}
        onClose={() => setShowAlert(false)}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
      />

      {/* NEW: Simple Calendar Modal */}
      <CalendarModal
        isOpen={showCalendarModal}
        onClose={() => setShowCalendarModal(false)}
      />

      {/* REMOVED: Grades Modal - Now handled by viewgrades.tsx */}
      
      {/* Main Layout */}
      <div className="flex flex-col lg:flex-row">
        {/* Sidebar Navigation */}
        <aside className={`
          ${sidebarOpen ? "fixed inset-0 z-40 lg:static lg:z-auto" : "hidden lg:block"}
          w-full lg:w-64 flex-shrink-0
          bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg border-b lg:border-r border-gray-200 dark:border-gray-700
          pt-16 lg:pt-20
        `}>
          <div className="h-full overflow-y-auto p-3 sm:p-4 md:p-6">
            <div className="space-y-1 sm:space-y-2">
              {portalFeatures.map((feature, index) => (
                <button
                  key={index}
                  onClick={() => {
                    feature.action();
                    setSidebarOpen(false);
                  }}
                  className={`
                    w-full flex items-center space-x-2 sm:space-x-3 px-2 sm:px-3 md:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl
                    transition-all duration-300 hover:scale-[1.02] text-xs sm:text-sm md:text-base
                    ${activeTab === feature.title.toLowerCase()
                      ? "bg-gradient-to-r from-[#7B1112] to-[#FFB302] text-white shadow-lg"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50"
                    }
                  `}
                >
                  {React.cloneElement(feature.icon, { 
                    className: `h-4 w-4 sm:h-5 sm:w-5 ${activeTab === feature.title.toLowerCase() ? "text-white" : "text-gray-400"}`
                  })}
                  <span className="font-medium truncate">{feature.title}</span>
                  {feature.title === "Messages" && unreadCount > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full animate-pulse flex-shrink-0">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>
              ))}
              
              {/* Quick Stats */}
              <div className="mt-4 sm:mt-6 p-2 sm:p-3 md:p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-lg sm:rounded-xl">
                <p className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">Academic Overview</p>
                <div className="space-y-1 sm:space-y-2">
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Subjects</span>
                    <span className="font-bold text-purple-600 dark:text-purple-400">{courses.length}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Current GPA</span>
                    <span className="font-bold text-green-600 dark:text-green-400">{calculateGPA()}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Messages</span>
                    <span className="font-bold text-blue-600 dark:text-blue-400">{messages.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Overlay for mobile sidebar */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 w-full overflow-x-hidden">
          {renderActiveSection()}
        </main>
      </div>

      {/* Add custom animations */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-3px); }
          75% { transform: translateX(3px); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.3s ease-out;
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        .line-clamp-2 {
          overflow: hidden;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
        }
        .line-clamp-1 {
          overflow: hidden;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
        }
      `}</style>
    </div>
  );
};

export default CollegePortal;