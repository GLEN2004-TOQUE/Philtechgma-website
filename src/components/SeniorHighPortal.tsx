import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  User, BookOpen, MessageSquare, Settings, Home,
  Edit, CheckCircle, Phone, MapPin, Globe, Calendar,
  Search, Filter, MoreVertical, Trash2, Eye, Bell,
  TrendingUp, Users, Award, Clock, ChevronRight,
  BarChart3, Download, FileText, Video, Shield,
  Mail, LogOut, Menu, X, GraduationCap, BookMarked,
  Upload, CreditCard, HelpCircle, ChevronDown,
  School, Users as UsersIcon, Library, ClipboardCheck,
  FileUp, BookCheck, CalendarDays, EyeOff, History,
  Image, Save, Send, UserCheck, Info
} from "lucide-react";
import { supabase } from '../supabaseClient';

// ========== TYPE DEFINITIONS ==========
interface Subject {
  id: number | string;
  code: string;
  name: string;
  teacher: string;
  color: string;
  strand: string;
  nextClass: string;
  schedule?: {
    day: string;
    time: string;
    room: string;
  };
}

interface Assignment {
  id: number | string;
  title: string;
  subject: string;
  dueDate: string;
  priority: string;
  points: number;
  description?: string;
  type?: string;
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
  strand?: string;
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
  strand?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
  full_name?: string;
  phone?: string;
  address?: string;
  bio?: string;
  lrn?: string;
  enrollment_date?: string;
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md p-6 animate-fade-in">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Change Password</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showOldPassword ? "text" : "password"}
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full px-4 py-3 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-[#7B1112] focus:border-transparent pr-10 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowOldPassword(!showOldPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showOldPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              New Password
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-[#7B1112] focus:border-transparent pr-10 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-[#7B1112] focus:border-transparent pr-10 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-lg animate-shake">
              {error}
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={() => {
                resetForm();
                onClose();
              }}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-6 py-2 bg-gradient-to-r from-[#7B1112] to-[#FFB302] text-white rounded-lg hover:opacity-90 transition-all disabled:opacity-50 hover:scale-105"
            >
              {loading ? (
                <span className="flex items-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md p-6 animate-fade-in">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-red-600 dark:text-red-400">
            {step === 1 ? "Delete Account" : "Confirm Deletion"}
          </h3>
          <button onClick={resetModal} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <div className="space-y-4">
          {step === 1 ? (
            <>
              <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <p className="text-red-700 dark:text-red-300 font-medium">
                  Warning: This action cannot be undone!
                </p>
                <p className="text-red-600 dark:text-red-400 text-sm mt-2">
                  All your data, including subjects, assignments, and profile information will be permanently deleted.
                </p>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                Are you sure you want to delete your account?
              </p>
            </>
          ) : (
            <>
              <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <p className="text-red-700 dark:text-red-300 font-medium">
                  Final confirmation required
                </p>
                <p className="text-red-600 dark:text-red-400 text-sm mt-2">
                  Type "confirm" to permanently delete your account
                </p>
              </div>
              <input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="Type 'confirm' here"
                className="w-full px-4 py-3 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
              />
            </>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={resetModal}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all hover:scale-105"
            >
              {step === 1 ? "Yes, Delete Account" : "Delete Account"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const SubmitAssignmentModal = ({ 
  isOpen, 
  onClose, 
  assignment,
  subject
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  assignment: Assignment | null;
  subject: Subject | null;
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [remarks, setRemarks] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = () => {
    if (!file) {
      showCenteredAlert(
        "No File Selected",
        "Please select a file to upload for your assignment.",
        "warning"
      );
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
        showCenteredAlert(
          "File Too Large",
          "File size should be less than 10MB",
          "error"
        );
        return;
      }
      setFile(selectedFile);
    }
  };

  // Helper function for showing alerts (needs to be defined in parent or imported)
  const showCenteredAlert = (title: string, message: string, type: 'success' | 'error' | 'info' | 'warning') => {
    // This should be implemented in the parent component
    // For now, we'll just use a simple alert
    alert(`${title}: ${message}`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md p-6 animate-fade-in">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Submit Assignment</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
            <X size={20} />
          </button>
        </div>
        
        {success ? (
          <div className="py-12 text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
              <CheckCircle className="text-green-600 dark:text-green-400" size={32} />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Assignment Submitted!</h4>
            <p className="text-gray-600 dark:text-gray-300">Your assignment has been sent successfully.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Assignment Info */}
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">{assignment?.title}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{assignment?.subject} • {assignment?.points} points • {assignment?.type}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Due: {assignment?.dueDate}</p>
                </div>
              </div>
            </div>

            {/* Teacher Info */}
            <div className="border border-blue-200 dark:border-blue-900/50 bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center">
                  <UserCheck className="text-blue-600 dark:text-blue-400" size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">This assignment will be sent to:</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{subject?.teacher || "Teacher"}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{subject?.name || "Subject Teacher"}</p>
                </div>
              </div>
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Upload File
              </label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 text-center hover:border-[#7B1112] dark:hover:border-[#FFB302] transition-all cursor-pointer">
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                    {file ? file.name : "Click to upload or drag and drop"}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    PDF, DOC, TXT, JPG, PNG (Max 10MB)
                  </p>
                </label>
              </div>
              {file && (
                <div className="mt-2 text-sm text-green-600 dark:text-green-400">
                  ✓ {file.name} ({Math.round(file.size / 1024)} KB)
                </div>
              )}
            </div>

            {/* Remarks */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Remarks (Optional)
              </label>
              <textarea
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                className="w-full px-4 py-3 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-[#7B1112] focus:border-transparent transition-all"
                rows={3}
                placeholder="Add any additional comments for your teacher..."
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting || !file}
                className="px-6 py-2 bg-gradient-to-r from-[#7B1112] to-[#FFB302] text-white rounded-lg hover:opacity-90 transition-all disabled:opacity-50 hover:scale-105 flex items-center"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send size={16} className="mr-2" />
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md p-6 animate-fade-in">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Notifications</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Notifications</h4>
              <p className="text-gray-600 dark:text-gray-300">You're all caught up!</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div 
                key={notification.id} 
                className={`p-4 rounded-xl border ${
                  notification.read 
                    ? "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800" 
                    : "border-blue-200 dark:border-blue-900/50 bg-blue-50 dark:bg-blue-900/10"
                } hover:shadow-md transition-all cursor-pointer`}
                onClick={notification.action}
              >
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg ${
                    notification.read 
                      ? "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300" 
                      : "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                  }`}>
                    <Bell size={18} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {notification.title}
                      </h4>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{notification.time}</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{notification.message}</p>
                    {!notification.read && (
                      <span className="inline-block mt-2 px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 text-xs rounded-full">
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
          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button 
              onClick={() => {
                // Mark all as read logic here
                onClose();
              }}
              className="w-full px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              Mark all as read
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

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
    success: <CheckCircle className="w-6 h-6" />,
    error: <X className="w-6 h-6" />,
    warning: <Bell className="w-6 h-6" />,
    info: <Info className="w-6 h-6" />
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className={`${typeColors[type]} rounded-2xl p-6 max-w-md w-full animate-fade-in-up`}>
        <div className="flex items-center justify-center mb-4">
          <div className="p-3 rounded-full bg-current/10">
            {typeIcons[type]}
          </div>
        </div>
        <h3 className="text-lg font-semibold text-center mb-2">{title}</h3>
        <p className="text-center mb-6">{message}</p>
        <div className="flex justify-center">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

const CalendarModal = ({ 
  isOpen, 
  onClose 
}: { 
  isOpen: boolean; 
  onClose: () => void;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-sm p-4 animate-fade-in">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Academic Calendar</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <div className="text-center py-8">
          <CalendarDays className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Calendar Empty</h4>
          <p className="text-gray-600 dark:text-gray-300">No events scheduled yet.</p>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">Check back when classes start</p>
        </div>
      </div>
    </div>
  );
};

// ========== SKELETON LOADING COMPONENTS ==========
const SkeletonCard = () => (
  <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-xl p-6 space-y-4">
    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
    <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
  </div>
);

const SkeletonProfile = () => (
  <div className="animate-pulse">
    <div className="flex flex-col md:flex-row gap-6">
      <div className="md:w-1/3 flex flex-col items-center">
        <div className="w-32 h-32 bg-gray-300 dark:bg-gray-700 rounded-full mb-4"></div>
        <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-48 mb-2"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-32"></div>
      </div>
      <div className="md:w-2/3 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-10 bg-gray-300 dark:bg-gray-700 rounded"></div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// Senior High specific mock data
const mockSubjects = [
  { id: 1, code: "MATH11", name: "General Mathematics", teacher: "Ms. Garcia", color: "from-blue-500 to-cyan-500", nextClass: "Mon, 8:00 AM", strand: "STEM" },
  { id: 2, code: "PHYS12", name: "Physics I", teacher: "Mr. Rodriguez", color: "from-purple-500 to-pink-500", nextClass: "Tue, 10:30 AM", strand: "STEM" },
  { id: 3, code: "ENG11", name: "Oral Communication", teacher: "Mrs. Santos", color: "from-green-500 to-emerald-500", nextClass: "Wed, 9:00 AM", strand: "All" },
  { id: 4, code: "RES12", name: "Practical Research", teacher: "Sir Reyes", color: "from-amber-500 to-orange-500", nextClass: "Thu, 1:00 PM", strand: "Academic" },
];

const statsData = [
  { label: "Active Subjects", value: "4", change: "+0", icon: BookOpen, color: "text-blue-500", bgColor: "bg-blue-500/10" },
  { label: "Pending Tasks", value: "0", change: "0", icon: Clock, color: "text-gray-500", bgColor: "bg-gray-500/10" },
  { label: "Current Status", value: "Active", change: "Good", icon: CheckCircle, color: "text-purple-500", bgColor: "bg-purple-500/10" },
];

const SeniorHighPortal = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [selectedStrand, setSelectedStrand] = useState("STEM");
  const [subjects, setSubjects] = useState<Subject[]>(mockSubjects);
  const [messages, setMessages] = useState<Message[]>([]); // Empty messages
  const [assignments, setAssignments] = useState<Assignment[]>([]); // Empty assignments
  const [stats, setStats] = useState<Stat[]>(statsData);
  const [userSection, setUserSection] = useState<Section | null>(null);
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
    { label: "Subject Announcements", description: "Important subject updates", checked: true },
  ]);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    title: '',
    message: '',
    type: 'info' as 'success' | 'error' | 'info' | 'warning'
  });
  const [showCalendarModal, setShowCalendarModal] = useState(false);

  const hasFetched = useRef(false);

  // Show centered alert function
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
    if (dateString.includes("Tomorrow")) return "Tomorrow";
    if (dateString.includes("Today")) return "Today";
    if (dateString.includes("Next Week")) return "Next Week";
    if (dateString.includes("Overdue")) return "Overdue";
    return dateString;
  }, []);

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
          const subject = subjects.find(c => c.code === assgn.subject);
          setSelectedSubject(subject || null);
          setShowNotificationModal(false);
          setShowSubmitModal(true);
        }
      }))
    ];
    
    setNotifications(notificationList);
  }, [subjects]);

  // Fetch login history
  const fetchLoginHistory = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;

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

  // Handle logout
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem("authToken");
      setUserName("");
      setUserEmail("");
      setUserData(null);
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
      const { error: profileError } = await supabase
        .from('seniorhigh_profiles')
        .update(updates)
        .eq('id', user.id);
      error = profileError;

      if (error) throw error;

      // Refresh user data
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

      // Delete from profiles table
      const { error: profileError } = await supabase
        .from('seniorhigh_profiles')
        .delete()
        .eq('id', user.id);

      if (profileError) {
        console.error("Error deleting profile data:", profileError);
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

  // Handle assignment submission
  const handleSubmitAssignment = (assignment: Assignment) => {
    const subject = subjects.find(c => c.code === assignment.subject);
    setSelectedAssignment(assignment);
    setSelectedSubject(subject || null);
    setShowSubmitModal(true);
  };

  // Fetch user data
  const fetchUserData = useCallback(async () => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    setIsLoading(true);
    setError(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
         navigate("/dblogin/login");
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserEmail(user.email || "");
        
        const { data: profileData } = await supabase
          .from('seniorhigh_profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileData) {
          setUserData(profileData);
          setUserName(profileData.full_name || user.email?.split('@')[0] || "Student");
          setSelectedStrand(profileData.strand || "STEM");
          
          // Create section object from profile data
          setUserSection({
            section_code: profileData.section,
            strand: profileData.strand,
            year_level: profileData.year_grade,
            student_type: "seniorHigh"
          });
        } else {
          setUserName(user.user_metadata?.full_name || user.email?.split('@')[0] || "Student");
        }
      }

      await fetchLoginHistory();
      
      // Calculate notifications after data is loaded
      setTimeout(() => {
        calculateNotifications(messages, assignments);
      }, 50);

      setTimeout(() => setIsLoading(false), 1200);
    } catch (error) {
      console.error('Error:', error);
      setError("Something went wrong while loading your data.");
       navigate("/dblogin/login");
    }
  }, [navigate, fetchLoginHistory, calculateNotifications, messages, assignments]);

  // Initialize user data
  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  // Top Header Component
  const Header = () => (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <Menu size={24} />
            </button>
            <div className="flex items-center space-x-3">
              <div>
                <img src="/images/logo/logo.png" alt="Logo" className="w-12 h-12" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Senior High Portal</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Student Dashboard</p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button 
              onClick={() => setShowNotificationModal(true)}
              className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <Bell size={22} className="text-gray-600 dark:text-gray-300" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-[#7B1112] to-[#FFB302] rounded-full flex items-center justify-center text-white font-bold">
                  {userName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{userName}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Senior High Student</p>
                </div>
                <ChevronDown size={16} className="hidden md:block text-gray-400" />
              </button>

              {showUserMenu && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowUserMenu(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border dark:border-gray-700 py-2 z-50 animate-fade-in">
                    <div className="px-4 py-3 border-b dark:border-gray-700">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{userName}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{userEmail}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        {selectedStrand} Strand
                      </p>
                    </div>
                    <button 
                      onClick={() => {
                        setActiveTab("profile");
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <User size={16} className="inline mr-2" />
                      My Profile
                    </button>
                    <button 
                      onClick={() => {
                        setActiveTab("settings");
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <Settings size={16} className="inline mr-2" />
                      Settings
                    </button>
                    <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                      <HelpCircle size={16} className="inline mr-2" />
                      Help & Support
                    </button>
                    <div className="border-t dark:border-gray-700 mt-2 pt-2">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
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
    <div className="space-y-8 p-6">
      {/* Welcome Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-gray-900 to-[#7B1112] p-8 text-white">
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Welcome back, {userName}!</h1>
              <p className="text-gray-200">Classes haven't started yet. Check back for updates.</p>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm">
            <span className="flex items-center px-3 py-1 bg-white/10 rounded-full">
              <School size={16} className="mr-2" />
              {selectedStrand} Strand
            </span>
            <span className="flex items-center px-3 py-1 bg-white/10 rounded-full">
              <Award size={16} className="mr-2" />
              Grade 12 • Semester 2
            </span>
            <span className="flex items-center px-3 py-1 bg-white/10 rounded-full">
              <CheckCircle size={16} className="mr-2" />
              Good Standing
            </span>
            <span className="flex items-center px-3 py-1 bg-white/10 rounded-full">
              <UsersIcon size={16} className="mr-2" />
              Section: Newton
            </span>
          </div>
        </div>
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-gradient-to-br from-[#FFB302]/20 to-transparent rounded-full"></div>
        <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-gradient-to-tr from-[#FFB302]/10 to-transparent rounded-full"></div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array(3).fill(0).map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-xl p-6">
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2 mb-4"></div>
              <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
            </div>
          ))
        ) : (
          stats.map((stat, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                  <p className="text-3xl font-bold mt-2">{stat.value}</p>
                  <p className={`text-sm mt-1 ${stat.change.startsWith('+') ? 'text-green-500' : stat.change === '0' ? 'text-gray-500' : 'text-green-500'}`}>
                    {stat.change === '0' ? 'No change' : stat.change}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor} ${stat.color} group-hover:scale-110 transition-transform`}>
                  <stat.icon size={24} />
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Subjects & Assignments */}
        <div className="lg:col-span-2 space-y-8">
          {/* Subjects Section */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">My Subjects</h2>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Current semester subjects</p>
              </div>
              <button 
                onClick={() => setActiveTab("courses")}
                className="text-[#7B1112] dark:text-[#FFB302] font-medium hover:underline transition-colors"
              >
                View All →
              </button>
            </div>
            <div className="p-6">
              {isLoading ? (
                <div className="space-y-4">
                  {Array(3).fill(0).map((_, i) => <SkeletonCard key={i} />)}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {subjects.slice(0, 4).map((subject) => (
                    <div key={subject.id} className="group relative bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-5 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">{subject.code}</span>
                          <h3 className="font-bold text-gray-900 dark:text-white mt-1">{subject.name}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{subject.teacher}</p>
                          <span className="inline-block mt-2 px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs rounded">
                            {subject.strand}
                          </span>
                        </div>
                        <div className={`p-2 rounded-lg bg-gradient-to-r ${subject.color}`}>
                          <BookMarked size={20} className="text-white" />
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                          <span>📅 {subject.nextClass}</span>
                          <span className="text-gray-400 dark:text-gray-500">No tasks yet</span>
                        </div>
                      </div>
                      <button className="mt-4 w-full py-2 text-sm font-medium text-[#7B1112] dark:text-[#FFB302] hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                        View Subject →
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Assignments Section - Updated to show message when no assignments */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Upcoming Assignments</h2>
              <p className="text-gray-500 dark:text-gray-400 mt-1">No assignments yet from teachers</p>
            </div>
            <div className="p-6">
              {isLoading ? (
                <div className="space-y-4">
                  {Array(3).fill(0).map((_, i) => <SkeletonCard key={i} />)}
                </div>
              ) : assignments.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Assignments Yet</h4>
                  <p className="text-gray-600 dark:text-gray-300">Your teachers haven't assigned any tasks yet.</p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">Check back later for updates</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {assignments.map((assignment) => (
                    <div key={assignment.id} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group hover:shadow-md">
                      <div className="flex items-center space-x-4">
                        <div className={`p-3 rounded-lg ${
                          assignment.priority === 'high' ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400' :
                          assignment.priority === 'medium' ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400' :
                          'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                        }`}>
                          <FileText size={20} />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">{assignment.title}</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {assignment.subject} • {assignment.type} • {assignment.points} points • Due {assignment.dueDate}
                          </p>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleSubmitAssignment(assignment)}
                        className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-[#7B1112] to-[#FFB302] rounded-lg hover:opacity-90 transition-all hover:scale-105"
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
        <div className="space-y-8">
          {/* Quick Actions */}
          <div className="bg-gradient-to-br from-[#7B1112] to-[#FFB302] rounded-2xl p-6 text-white">
            <h2 className="text-xl font-bold mb-6">Quick Actions</h2>
            <div className="space-y-3">
              <button
                onClick={() => {
                  showCenteredAlert(
                    "No Assignments",
                    "No assignments available yet. Teachers haven't assigned anything.",
                    "info"
                  );
                }}
                className="w-full flex items-center justify-between p-4 bg-white/10 hover:bg-white/20 rounded-xl transition-all group hover:scale-[1.02]"
              >
                <span>Submit Assignment</span>
                <Upload size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => setActiveTab("courses")}
                className="w-full flex items-center justify-between p-4 bg-white/10 hover:bg-white/20 rounded-xl transition-all group hover:scale-[1.02]"
              >
                <span>View Subjects</span>
                <BarChart3 size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => navigate("/ViewGradesSH")}
                className="w-full flex items-center justify-between p-4 bg-white/10 hover:bg-white/20 rounded-xl transition-all group hover:scale-[1.02]"
              >
                <span>View Grades</span>
                <TrendingUp size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Messages Preview - Updated to show when no messages */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Messages</h2>
                <button 
                  onClick={() => setActiveTab("messages")}
                  className="text-[#7B1112] dark:text-[#FFB302] text-sm font-medium hover:underline transition-colors"
                >
                  View All
                </button>
              </div>
            </div>
            <div className="p-6">
              {isLoading ? (
                <div className="space-y-4">
                  {Array(3).fill(0).map((_, i) => <SkeletonCard key={i} />)}
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Messages</h4>
                  <p className="text-gray-600 dark:text-gray-300">No messages from teachers or staff yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div 
                      key={message.id} 
                      className={`p-4 rounded-xl border ${
                        message.unread 
                          ? 'border-blue-200 dark:border-blue-900/50 bg-blue-50 dark:bg-blue-900/10' 
                          : 'border-gray-100 dark:border-gray-700'
                      } hover:shadow-md transition-all cursor-pointer group hover:scale-[1.02]`}
                      onClick={() => setActiveTab("messages")}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-lg ${
                          message.unread 
                            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                        }`}>
                          <Mail size={18} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-[#7B1112] dark:group-hover:text-[#FFB302] transition-colors">
                              {message.sender}
                            </h4>
                            <span className="text-xs text-gray-500 dark:text-gray-400">{message.time}</span>
                          </div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">{message.subject}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">{message.preview}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Academic Calendar */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">School Calendar</h2>
            <div className="text-center py-8">
              <CalendarDays className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Events Scheduled</h4>
              <p className="text-gray-600 dark:text-gray-300">Calendar is empty. Check back later for updates.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Subjects Section
  const SubjectsSection = () => (
    <div className="space-y-8 p-6">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-100 dark:border-gray-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">My Subjects</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Manage and track your subject progress</p>
          </div>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <div className="flex items-center space-x-2">
              <Filter size={20} className="text-gray-400" />
              <select 
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7B1112] transition-all"
                value={selectedStrand}
                onChange={(e) => setSelectedStrand(e.target.value)}
              >
                <option value="All">All Strands</option>
                <option value="STEM">STEM</option>
                <option value="ABM">ABM</option>
                <option value="HUMSS">HUMSS</option>
                <option value="TVL">TVL</option>
                <option value="Academic">Academic</option>
              </select>
            </div>
          </div>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6).fill(0).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {subjects.map((subject) => (
                <div key={subject.id} className="group relative bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                  <div className="absolute top-4 right-4">
                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                      <MoreVertical className="text-gray-400" size={20} />
                    </button>
                  </div>
                  
                  <div className="mb-6">
                    <div className={`inline-block p-3 rounded-xl bg-gradient-to-r ${subject.color} mb-4`}>
                      <BookOpen className="text-white" size={24} />
                    </div>
                    <div className="mb-2">
                      <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">{subject.code}</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{subject.name}</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">{subject.teacher}</p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                      <span>📅 {subject.nextClass}</span>
                      <span className="text-gray-400 dark:text-gray-500">No tasks yet</span>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex space-x-2 pt-4">
                      <button className="flex-1 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                        View Details
                      </button>
                      <button className="flex-1 py-3 text-sm font-medium text-white bg-gradient-to-r from-[#7B1112] to-[#FFB302] rounded-lg hover:opacity-90 transition-all hover:scale-105">
                        View Subject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 p-6 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl">
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">Need help with subjects?</h3>
                  <p className="text-gray-600 dark:text-gray-300 mt-1">Schedule a meeting with your class adviser</p>
                </div>
                <button className="mt-4 md:mt-0 px-6 py-3 bg-gradient-to-r from-[#7B1112] to-[#FFB302] text-white rounded-lg hover:opacity-90 transition-all hover:scale-105">
                  Schedule Meeting
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
    <div className="space-y-8 p-6">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-100 dark:border-gray-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Messages</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2">No messages from teachers or staff yet</p>
          </div>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <button className="px-6 py-2 bg-[#7B1112] text-white rounded-lg hover:bg-[#8B2122] transition-all hover:scale-105 flex items-center">
              <Mail size={20} className="mr-2" />
              New Message
            </button>
          </div>
        </div>
        
        {isLoading ? (
          <div className="space-y-4">
            {Array(5).fill(0).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-16">
            <MessageSquare className="w-24 h-24 text-gray-400 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">No Messages Yet</h3>
            <p className="text-gray-600 dark:text-gray-300 max-w-md mx-auto mb-8">
              You don't have any messages from teachers or school staff at the moment.
            </p>
            <button className="px-8 py-3 bg-gradient-to-r from-[#7B1112] to-[#FFB302] text-white rounded-lg hover:opacity-90 transition-all hover:scale-105">
              Compose New Message
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className="group p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-[#7B1112] dark:hover:border-[#FFB302] hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-lg ${message.unread ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-gray-100 dark:bg-gray-700'}`}>
                      <MessageSquare size={20} className={message.unread ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h3 className="font-bold text-gray-900 dark:text-white">{message.subject}</h3>
                        {message.unread && (
                          <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 text-xs rounded-full">
                            New
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 mt-1">From: {message.sender}</p>
                      <p className="text-gray-700 dark:text-gray-300 mt-3">{message.preview}</p>
                      <div className="flex items-center space-x-4 mt-4">
                        <button className="text-sm text-[#7B1112] dark:text-[#FFB302] hover:underline transition-colors">
                          Reply
                        </button>
                        <button className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
                          Mark as read
                        </button>
                        <button className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
                          Archive
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500 dark:text-gray-400">{message.time}</p>
                    <button className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                      <MoreVertical size={20} className="text-gray-400" />
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
      bio: userData?.bio || "",
    });

    const getGraduationYear = () => {
      const yearString = userSection?.year_level || userData?.year_grade;
      if (yearString?.includes("12")) return "2024";
      if (yearString?.includes("11")) return "2025";
      return "2024";
    };

    const handleEditToggle = () => {
      if (isEditing) {
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
      <div className="space-y-8 p-6">
        <div className="bg-gradient-to-r from-gray-900 to-[#7B1112] rounded-2xl p-8 text-white">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold">My Profile</h2>
              <p className="text-gray-200 mt-2">Manage your personal information and preferences</p>
            </div>
            <button 
              onClick={handleEditToggle}
              className="mt-4 md:mt-0 flex items-center px-6 py-3 bg-white/20 hover:bg-white/30 rounded-xl transition-all hover:scale-105"
            >
              {isEditing ? (
                <>
                  <Save size={20} className="mr-2" />
                  Save Profile
                </>
              ) : (
                <>
                  <Edit size={20} className="mr-2" />
                  Edit Profile
                </>
              )}
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
            <SkeletonProfile />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="p-8">
                  <div className="flex flex-col md:flex-row gap-8">
                    <div className="md:w-1/3">
                      <div className="flex flex-col items-center">
                        <div className="relative mb-6">
                          <div className="w-40 h-40 bg-gradient-to-br from-[#7B1112] to-[#FFB302] rounded-full flex items-center justify-center text-white text-5xl font-bold mb-4 overflow-hidden">
                            {profileImage ? (
                              <img 
                                src={profileImage} 
                                alt="Profile" 
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              userName.split(' ').map(n => n[0]).join('').toUpperCase()
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
                              <span className="px-4 py-2 bg-[#7B1112] text-white rounded-lg hover:bg-[#8B2122] transition-all hover:scale-105 cursor-pointer text-sm flex items-center justify-center">
                                <Image size={16} className="mr-2" />
                                Change Photo
                              </span>
                            </label>
                          )}
                          <div className="absolute bottom-6 right-6 w-10 h-10 bg-green-500 rounded-full border-4 border-white dark:border-gray-800 flex items-center justify-center">
                            <CheckCircle size={20} className="text-white" />
                          </div>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white text-center">{userName}</h3>
                        <p className="text-gray-600 dark:text-gray-300 mt-1 text-center">{userEmail}</p>
                        <div className="mt-4 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-sm font-medium">
                          <CheckCircle size={16} className="inline mr-2" />
                          Active Student
                        </div>
                      </div>
                    </div>
                    
                    <div className="md:w-2/3 space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">LRN</label>
                          <p className="text-lg font-semibold text-gray-900 dark:text-white">{userData?.lrn || "123456789012"}</p>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Strand</label>
                          <p className="text-lg font-semibold text-gray-900 dark:text-white">{userData?.strand || selectedStrand}</p>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Grade Level</label>
                          <p className="text-lg font-semibold text-gray-900 dark:text-white">{userData?.year_grade || "Grade 12"}</p>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Section</label>
                          <p className="text-lg font-semibold text-gray-900 dark:text-white">{userData?.section || "Newton"}</p>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Phone</label>
                          {isEditing ? (
                            <input
                              type="tel"
                              value={editFormData.phone}
                              onChange={(e) => handleInputChange("phone", e.target.value)}
                              className="w-full px-3 py-2 border dark:border-gray-600 rounded bg-white dark:bg-gray-800 focus:ring-2 focus:ring-[#7B1112] transition-all"
                              placeholder="Enter phone number"
                            />
                          ) : (
                            <p className="text-lg font-semibold text-gray-900 dark:text-white">
                              {editFormData.phone || "Not provided"}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Address</label>
                          {isEditing ? (
                            <input
                              type="text"
                              value={editFormData.address}
                              onChange={(e) => handleInputChange("address", e.target.value)}
                              className="w-full px-3 py-2 border dark:border-gray-600 rounded bg-white dark:bg-gray-800 focus:ring-2 focus:ring-[#7B1112] transition-all"
                              placeholder="Enter address"
                            />
                          ) : (
                            <p className="text-lg font-semibold text-gray-900 dark:text-white">
                              {editFormData.address || "Not provided"}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div className="pt-6 border-t dark:border-gray-700">
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Bio</h4>
                        {isEditing ? (
                          <textarea
                            value={editFormData.bio}
                            onChange={(e) => handleInputChange("bio", e.target.value)}
                            className="w-full px-3 py-2 border dark:border-gray-600 rounded bg-white dark:bg-gray-800 focus:ring-2 focus:ring-[#7B1112] transition-all"
                            rows={3}
                            placeholder="Tell us about yourself..."
                          />
                        ) : editFormData.bio ? (
                          <p className="text-gray-700 dark:text-gray-300">{editFormData.bio}</p>
                        ) : (
                          <p className="text-gray-500 dark:text-gray-400 italic">No bio added yet</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Academic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl hover:shadow-md transition-all">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Enrollment Date</p>
                    <p className="font-bold text-gray-900 dark:text-white mt-1">{userData?.enrollment_date || "June 2023"}</p>
                  </div>
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl hover:shadow-md transition-all">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Expected Graduation</p>
                    <p className="font-bold text-gray-900 dark:text-white mt-1">March {getGraduationYear()}</p>
                  </div>
                  <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl hover:shadow-md transition-all">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Academic Standing</p>
                    <p className="font-bold text-green-600 dark:text-green-400 mt-1">Good Standing</p>
                  </div>
                  <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl hover:shadow-md transition-all">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                    <p className="font-bold text-gray-900 dark:text-white mt-1">Enrolled</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Academic Stats</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:shadow-md transition-all">
                    <span className="text-gray-700 dark:text-gray-300">Current Subjects</span>
                    <span className="font-bold text-2xl text-gray-500 dark:text-gray-400">{subjects.length}</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:shadow-md transition-all">
                    <span className="text-gray-700 dark:text-gray-300">Enrollment Status</span>
                    <span className="font-bold text-2xl text-green-600 dark:text-green-400">Active</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:shadow-md transition-all">
                    <span className="text-gray-700 dark:text-gray-300">Assignments</span>
                    <span className="font-bold text-2xl text-gray-500 dark:text-gray-400">0</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h4>
                <div className="space-y-3">
                  <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-all hover:scale-[1.02]">
                    <span className="text-gray-700 dark:text-gray-300">Request Form 137</span>
                    <FileText size={16} className="text-gray-400" />
                  </button>
                  <button 
                    onClick={() => navigate("/ViewGradesSH")}
                    className="w-full flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-all hover:scale-[1.02]"
                  >
                    <span className="text-gray-700 dark:text-gray-300">View Grades</span>
                    <Download size={16} className="text-gray-400" />
                  </button>
                  <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-all hover:scale-[1.02]">
                    <span className="text-gray-700 dark:text-gray-300">Certificate Requests</span>
                    <Award size={16} className="text-gray-400" />
                  </button>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-[#7B1112] to-[#FFB302] rounded-2xl p-6 text-white">
                <h4 className="font-semibold mb-4">Need Help?</h4>
                <p className="text-gray-200 text-sm mb-4">Contact our student support team for assistance</p>
                <button className="w-full py-3 bg-white/20 hover:bg-white/30 rounded-lg transition-all hover:scale-[1.02]">
                  Contact Support
                </button>
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
      <div className="space-y-8 p-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-100 dark:border-gray-700">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Settings</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8">Manage your account preferences and security</p>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* Account Settings */}
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Account Information</h3>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
                      <input
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        className="w-full px-4 py-3 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-[#7B1112] focus:border-transparent transition-all"
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                      <input
                        type="email"
                        value={userEmail}
                        onChange={(e) => setUserEmail(e.target.value)}
                        className="w-full px-4 py-3 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-[#7B1112] focus:border-transparent transition-all"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone Number</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        className="w-full px-4 py-3 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-[#7B1112] focus:border-transparent transition-all"
                        placeholder="+63 912 345 6789"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Address</label>
                      <input
                        type="text"
                        value={formData.address}
                        onChange={(e) => handleInputChange("address", e.target.value)}
                        className="w-full px-4 py-3 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-[#7B1112] focus:border-transparent transition-all"
                        placeholder="123 Student St., Manila City"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Bio</label>
                    <textarea
                      value={formData.bio}
                      onChange={(e) => handleInputChange("bio", e.target.value)}
                      className="w-full px-4 py-3 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-[#7B1112] focus:border-transparent transition-all"
                      rows={3}
                      placeholder="Tell us about yourself..."
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={handleSaveProfile}
                      className="px-6 py-3 bg-gradient-to-r from-[#7B1112] to-[#FFB302] text-white rounded-lg hover:opacity-90 transition-all hover:scale-105"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>

              {/* Notification Settings */}
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Notification Preferences</h3>
                <div className="space-y-4">
                  {notificationSettings.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-600 hover:shadow-md transition-all">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{item.label}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{item.description}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={item.checked}
                          onChange={() => handleNotificationToggle(index)}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#7B1112]"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              {/* Security Card */}
              <div className="bg-gradient-to-br from-gray-900 to-[#7B1112] rounded-2xl p-6 text-white">
                <Shield size={32} className="mb-4" />
                <h4 className="font-semibold text-xl mb-2">Security</h4>
                <p className="text-gray-200 text-sm mb-6">Manage your account security</p>
                <div className="space-y-3">
                  <button 
                    onClick={() => setShowPasswordModal(true)}
                    className="w-full text-left p-4 bg-white/10 hover:bg-white/20 rounded-xl transition-all hover:scale-[1.02]"
                  >
                    Change Password
                  </button>
                  <button className="w-full text-left p-4 bg-white/10 hover:bg-white/20 rounded-xl transition-all hover:scale-[1.02]">
                    <History size={16} className="inline mr-2" />
                    Login History
                  </button>
                </div>
              </div>
              
              {/* Login History */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Login History</h4>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {loginHistory.map((login, index) => (
                    <div key={index} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:shadow-md transition-all">
                      <div className="flex items-center justify-between">
                        <div className="text-sm">
                          <p className="font-medium text-gray-900 dark:text-white">
                            {login.device || `Login ${index + 1}`}
                          </p>
                          <p className="text-gray-500 dark:text-gray-400">{login.time}</p>
                        </div>
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Danger Zone */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-red-200 dark:border-red-900/50 p-6">
                <h4 className="font-semibold text-red-600 dark:text-red-400 mb-4">Danger Zone</h4>
                <div className="space-y-3">
                  <button 
                    onClick={() => setShowDeleteModal(true)}
                    className="w-full text-left p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-all hover:scale-[1.02]"
                  >
                    <Trash2 size={16} className="inline mr-2" />
                    Delete Account
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left p-3 bg-red-600 text-white hover:bg-red-700 rounded-lg transition-all hover:scale-[1.02]"
                  >
                    <LogOut size={16} className="inline mr-2" />
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
            <div className="w-16 h-16 border-4 border-[#7B1112] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading dashboard...</p>
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
        <div className="mx-6 mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl animate-fade-in">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800 dark:text-red-200">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-2 text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-500 transition-colors"
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

      <SubmitAssignmentModal
        isOpen={showSubmitModal}
        onClose={() => {
          setShowSubmitModal(false);
          setSelectedAssignment(null);
          setSelectedSubject(null);
        }}
        assignment={selectedAssignment}
        subject={selectedSubject}
      />

      <NotificationModal
        isOpen={showNotificationModal}
        onClose={() => setShowNotificationModal(false)}
        notifications={notifications}
      />

      <CenteredAlert
        isOpen={showAlert}
        onClose={() => setShowAlert(false)}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
      />

      <CalendarModal
        isOpen={showCalendarModal}
        onClose={() => setShowCalendarModal(false)}
      />

      {/* Main Layout */}
      <div className="flex">
        {/* Sidebar Navigation */}
        <aside className={`
          hidden lg:block w-64 flex-shrink-0
          ${sidebarOpen ? "block fixed inset-y-0 left-0 z-40" : "hidden"}
          bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-r border-gray-200 dark:border-gray-700
          pt-20
        `}>
          <div className="h-full overflow-y-auto p-6">
            <div className="space-y-2">
              {portalFeatures.map((feature, index) => (
                <button
                  key={index}
                  onClick={() => {
                    feature.action();
                    setSidebarOpen(false);
                  }}
                  className={`
                    w-full flex items-center space-x-3 px-4 py-3 rounded-xl
                    transition-all duration-300 hover:scale-[1.02]
                    ${activeTab === feature.title.toLowerCase()
                      ? "bg-gradient-to-r from-[#7B1112] to-[#FFB302] text-white shadow-lg"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50"
                    }
                  `}
                >
                  {React.cloneElement(feature.icon, { 
                    className: `h-5 w-5 ${activeTab === feature.title.toLowerCase() ? "text-white" : "text-gray-400"}`
                  })}
                  <span className="font-medium">{feature.title}</span>
                  {feature.title === "Messages" && unreadCount > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </button>
              ))}
              
              {/* Quick Stats */}
              <div className="mt-8 p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Academic Overview</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Subjects</span>
                    <span className="font-bold text-purple-600 dark:text-purple-400">{subjects.length}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Average</span>
                    <span className="font-bold text-gray-500 dark:text-gray-400">N/A</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Messages</span>
                    <span className="font-bold text-gray-500 dark:text-gray-400">{messages.length}</span>
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
        <main className="flex-1">
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
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
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
      `}</style>
    </div>
  );
};

export default SeniorHighPortal;