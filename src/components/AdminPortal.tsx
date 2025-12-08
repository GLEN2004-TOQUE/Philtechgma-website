import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User, BookOpen, MessageSquare, Settings, Home,
  Edit, CheckCircle, Phone, MapPin, Globe, Calendar,
  Search, Filter, MoreVertical, Trash2, Eye, Bell,
  TrendingUp, Users, Award, Clock, ChevronRight,
  BarChart3, Download, FileText, Video, Shield,
  Mail, LogOut, Menu, X, GraduationCap, BookMarked,
  Upload, CreditCard, HelpCircle, ChevronDown, UserPlus,
  Users as Family, AlertCircle, TrendingDown, FileCheck,
  CalendarDays, MessageCircle, BookText, School, Heart,
  FileQuestion, FileEdit, Send, UserCheck, Award as Grade,
  BarChart, FileBarChart, ClipboardCheck, Clock4,
  Users as Students, FolderOpen, PenTool, CalendarRange,
  Building, ShieldCheck, Database, Wrench, Key,
  UserCog, BookUser, School as SchoolIcon, Globe as GlobeIcon,
  Users as UsersIcon, UserPlus as UserPlusIcon
} from "lucide-react";
import { supabase } from '../supabaseClient';
import { div } from "framer-motion/client";
import AccessControl from '../Securities/AccessControl';

// Skeleton Loading Components
const SkeletonCard = () => (
  <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-xl p-6 space-y-4">
    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
    <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
    <div className="h-2 bg-gray-300 dark:bg-gray-600 rounded w-full"></div>
    <div className="h-2 bg-gray-300 dark:bg-gray-600 rounded w-5/6"></div>
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

// Mock data for Admin Portal
const mockTeachers = [
  { 
    id: 1, 
    name: "Dr. Sarah Johnson", 
    email: "sarah.j@school.edu",
    department: "Mathematics",
    subjects: ["Calculus", "Algebra", "Geometry"],
    status: "active",
    students: 85,
    yearsExperience: 8
  },
  { 
    id: 2, 
    name: "Mr. James Wilson", 
    email: "james.w@school.edu",
    department: "Physics",
    subjects: ["Advanced Physics", "Mechanics"],
    status: "active",
    students: 72,
    yearsExperience: 5
  },
  { 
    id: 3, 
    name: "Ms. Lisa Chen", 
    email: "lisa.c@school.edu",
    department: "Chemistry",
    subjects: ["Organic Chemistry", "Biochemistry"],
    status: "active",
    students: 68,
    yearsExperience: 6
  },
];

const mockStudents = [
  {
    id: 1,
    name: "Alex Rodriguez",
    email: "alex.r@school.edu",
    grade: "11",
    class: "STEM-A",
    parentName: "Maria Rodriguez",
    attendance: 94,
    gpa: 3.8
  },
  {
    id: 2,
    name: "Emma Watson",
    email: "emma.w@school.edu",
    grade: "10",
    class: "STEM-B",
    parentName: "John Watson",
    attendance: 96,
    gpa: 3.9
  },
  {
    id: 3,
    name: "David Kim",
    email: "david.k@school.edu",
    grade: "12",
    class: "STEM-C",
    parentName: "Soo Kim",
    attendance: 88,
    gpa: 3.5
  },
  {
    id: 4,
    name: "Sophia Martinez",
    email: "sophia.m@school.edu",
    grade: "11",
    class: "Arts-A",
    parentName: "Carlos Martinez",
    attendance: 92,
    gpa: 3.7
  },
];

const mockParents = [
  {
    id: 1,
    name: "Maria Rodriguez",
    email: "maria.r@email.com",
    phone: "+1 (555) 123-4567",
    students: ["Alex Rodriguez"],
    status: "active"
  },
  {
    id: 2,
    name: "John Watson",
    email: "john.w@email.com",
    phone: "+1 (555) 234-5678",
    students: ["Emma Watson"],
    status: "active"
  },
  {
    id: 3,
    name: "Soo Kim",
    email: "soo.k@email.com",
    phone: "+1 (555) 345-6789",
    students: ["David Kim"],
    status: "active"
  },
];

const mockAnnouncements = [
  { 
    id: 1, 
    title: "School Closed - Weather Advisory", 
    content: "Due to severe weather conditions, the school will be closed on Friday, March 22...", 
    date: "Today, 8:00 AM", 
    priority: "high",
    audience: "Everyone",
    views: 1245,
    author: "Admin Office"
  },
  { 
    id: 2, 
    title: "Parent-Teacher Conference Schedule", 
    content: "Parent-teacher conferences will be held from April 1-5. Please schedule your appointments...", 
    date: "Yesterday", 
    priority: "medium",
    audience: "Parents & Teachers",
    views: 892,
    author: "Admin Office"
  },
  { 
    id: 3, 
    title: "Staff Meeting - Curriculum Updates", 
    content: "All teaching staff are required to attend the curriculum planning meeting on Monday...", 
    date: "2 days ago", 
    priority: "high",
    audience: "Teachers",
    views: 67,
    author: "Principal"
  },
  { 
    id: 4, 
    title: "Annual Science Fair", 
    content: "Registration for the annual science fair is now open. Projects must be submitted by...", 
    date: "3 days ago", 
    priority: "medium",
    audience: "Students",
    views: 345,
    author: "Science Department"
  },
];

const mockClasses = [
  { 
    id: 1, 
    name: "Mathematics - Grade 11", 
    section: "STEM-A", 
    code: "MATH-11-A",
    teacher: "Dr. Sarah Johnson",
    studentCount: 32,
    schedule: "Mon, Wed, Fri 9:00 AM"
  },
  { 
    id: 2, 
    name: "Advanced Physics", 
    section: "STEM-B", 
    code: "PHYS-12-B",
    teacher: "Mr. James Wilson",
    studentCount: 28,
    schedule: "Tue, Thu 10:30 AM"
  },
  { 
    id: 3, 
    name: "Organic Chemistry", 
    section: "STEM-C", 
    code: "CHEM-12-C",
    teacher: "Ms. Lisa Chen",
    studentCount: 25,
    schedule: "Mon-Fri 1:00 PM"
  },
];

const chatContacts = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    type: "teacher",
    department: "Mathematics",
    lastMessage: "We need to discuss the curriculum changes",
    time: "10:30 AM",
    unread: 2
  },
  {
    id: 2,
    name: "Maria Rodriguez",
    type: "parent",
    student: "Alex Rodriguez",
    lastMessage: "Thank you for the update about the conference!",
    time: "Yesterday",
    unread: 0
  },
  {
    id: 3,
    name: "Alex Rodriguez",
    type: "student",
    grade: "11",
    class: "STEM-A",
    lastMessage: "I have a question about the science fair",
    time: "2 days ago",
    unread: 1
  },
  {
    id: 4,
    name: "Mr. James Wilson",
    type: "teacher",
    department: "Physics",
    lastMessage: "Can we schedule a department meeting?",
    time: "3 days ago",
    unread: 0
  },
  {
    id: 5,
    name: "Emma Watson",
    type: "student",
    grade: "10",
    class: "STEM-B",
    lastMessage: "Regarding the scholarship application",
    time: "Today",
    unread: 3
  },
];

const statsData = [
  { label: "Total Students", value: "1,245", change: "+42", icon: <Students />, color: "text-blue-500", bgColor: "bg-blue-500/10" },
  { label: "Teaching Staff", value: "68", change: "+3", icon: <UserCog />, color: "text-green-500", bgColor: "bg-green-500/10" },
  { label: "Active Classes", value: "42", change: "+2", icon: <BookOpen />, color: "text-amber-500", bgColor: "bg-amber-500/10" },
  { label: "Parent Accounts", value: "956", change: "+28", icon: <Family />, color: "text-purple-500", bgColor: "bg-purple-500/10" },
  { label: "Avg. Attendance", value: "92.5%", change: "+1.2%", icon: <TrendingUp />, color: "text-teal-500", bgColor: "bg-teal-500/10" },
  { label: "System Health", value: "100%", change: "0%", icon: <ShieldCheck />, color: "text-emerald-500", bgColor: "bg-emerald-500/10" },
];

const AdminPortal: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications] = useState(12);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [chatActive, setChatActive] = useState(false);
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [messageInput, setMessageInput] = useState("");
  const [announcementAudience, setAnnouncementAudience] = useState("everyone");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          navigate("/login");
          return;
        }

        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUserEmail(user.email || "");
          
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

          if (profileData) {
            setUserData(profileData);
            setUserName(profileData.full_name || user.email?.split('@')[0] || "Administrator");
          } else {
            setUserName(user.user_metadata?.full_name || user.email?.split('@')[0] || "Administrator");
          }
        }

        // Simulate loading for better UX
        setTimeout(() => setIsLoading(false), 1200);
      } catch (error) {
        console.error('Error:', error);
        navigate("/login");
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  // Top Header Component
  const Header = () => (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <Menu size={24} />
            </button>
            <div className="flex items-center space-x-3">
              <div>
                <img src="/images/logo/logo.png" alt="Logo" className="w-12 h-12" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">School Admin Portal</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Manage • Coordinate • Communicate</p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Search Bar */}
            <div className="hidden md:block relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search students, teachers, parents..."
                className="pl-10 pr-4 py-2 w-64 bg-gray-100 dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7B1112] dark:focus:ring-[#FFB302]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Messages Button */}
            <button 
              onClick={() => setActiveTab("messages")}
              className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <MessageSquare size={22} className="text-gray-600 dark:text-gray-300" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                12
              </span>
            </button>

            {/* Notifications */}
            <button className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
              <Bell size={22} className="text-gray-600 dark:text-gray-300" />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {notifications}
                </span>
              )}
            </button>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-[#7B1112] to-[#FFB302] rounded-full flex items-center justify-center text-white font-bold">
                  {userName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{userName}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Administrator</p>
                </div>
                <ChevronDown size={16} className="hidden md:block text-gray-400" />
              </button>

              {showUserMenu && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowUserMenu(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border dark:border-gray-700 py-2 z-50">
                    <div className="px-4 py-3 border-b dark:border-gray-700">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{userName}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{userEmail}</p>
                      <span className="inline-block mt-1 px-2 py-1 text-xs bg-gradient-to-r from-[#7B1112] to-[#FFB302] text-white rounded-full">
                        Admin
                      </span>
                    </div>
                    <button 
                      onClick={() => setActiveTab("profile")}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <User size={16} className="inline mr-2" />
                      My Profile
                    </button>
                    <button 
                      onClick={() => setActiveTab("settings")}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <Settings size={16} className="inline mr-2" />
                      System Settings
                    </button>
                    <button 
                      onClick={() => setActiveTab("users")}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <UserCog size={16} className="inline mr-2" />
                      User Management
                    </button>
                    <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                      <HelpCircle size={16} className="inline mr-2" />
                      Help & Support
                    </button>
                    <div className="border-t dark:border-gray-700 mt-2 pt-2">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
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
              <h1 className="text-4xl font-bold mb-2">Welcome, {userName}!</h1>
              <p className="text-gray-200">Manage your school operations, communicate with all stakeholders, and monitor system performance.</p>
            </div>
            <div className="mt-4 md:mt-0">
              <button 
                onClick={() => setActiveTab("announcements")}
                className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 px-6 py-3 rounded-xl transition-all"
              >
                <Bell size={20} />
                <span>Make Announcement</span>
              </button>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm">
            <span className="flex items-center px-3 py-1 bg-white/10 rounded-full">
              <Users size={16} className="mr-2" />
              {mockTeachers.length} Teachers Online
            </span>
            <span className="flex items-center px-3 py-1 bg-white/10 rounded-full">
              <Students size={16} className="mr-2" />
              1,245 Total Students
            </span>
            <span className="flex items-center px-3 py-1 bg-white/10 rounded-full">
              <Building size={16} className="mr-2" />
              42 Active Classes
            </span>
            <span className="flex items-center px-3 py-1 bg-white/10 rounded-full">
              <ShieldCheck size={16} className="mr-2" />
              System Status: Operational
            </span>
          </div>
        </div>
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-gradient-to-br from-[#FFB302]/20 to-transparent rounded-full"></div>
        <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-gradient-to-tr from-[#FFB302]/10 to-transparent rounded-full"></div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {isLoading ? (
          Array(6).fill(0).map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-xl p-6">
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2 mb-4"></div>
              <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
            </div>
          ))
        ) : (
          statsData.map((stat, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                  <p className="text-2xl font-bold mt-2">{stat.value}</p>
                  <p className={`text-xs mt-1 ${stat.change.startsWith('+') ? 'text-green-500' : stat.change.startsWith('-') ? 'text-red-500' : 'text-gray-500'}`}>
                    {stat.change} from last month
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor} ${stat.color} group-hover:scale-110 transition-transform`}>
                  {React.cloneElement(stat.icon, { size: 24 })}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Recent Announcements & System Alerts */}
        <div className="lg:col-span-2 space-y-8">
          {/* Announcements Section */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Announcements</h2>
                <p className="text-gray-500 dark:text-gray-400 mt-1">School-wide communications</p>
              </div>
              <button 
                onClick={() => setActiveTab("announcements")}
                className="text-[#7B1112] dark:text-[#FFB302] font-medium hover:underline"
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
                <div className="space-y-4">
                  {mockAnnouncements.slice(0, 3).map((announcement) => (
                    <div key={announcement.id} className={`p-5 rounded-xl border ${
                      announcement.priority === 'high' 
                        ? 'border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/10' 
                        : announcement.priority === 'medium'
                        ? 'border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-900/10'
                        : 'border-gray-100 dark:border-gray-700'
                    } hover:shadow-md transition-all cursor-pointer`}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-bold text-gray-900 dark:text-white">{announcement.title}</h3>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              announcement.priority === 'high' ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300' :
                              'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300'
                            }`}>
                              {announcement.audience}
                            </span>
                            {announcement.priority === 'high' && (
                              <span className="px-2 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300 text-xs rounded-full">
                                Important
                              </span>
                            )}
                          </div>
                          <p className="text-gray-600 dark:text-gray-300 mb-3">{announcement.content}</p>
                          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                            <div className="flex items-center space-x-4">
                              <span>By: {announcement.author}</span>
                              <span>👁️ {announcement.views} views</span>
                            </div>
                            <span>{announcement.date}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-[#7B1112] to-[#9B3132] rounded-2xl p-6 text-white">
              <h3 className="text-lg font-bold mb-4">User Management</h3>
              <div className="space-y-3">
                <button 
                  onClick={() => setActiveTab("users")}
                  className="w-full text-left p-4 bg-white/10 hover:bg-white/20 rounded-xl transition-all group flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium">Add New Teacher</p>
                    <p className="text-sm text-gray-200/80 mt-1">Create teacher account</p>
                  </div>
                  <UserPlus size={20} className="group-hover:scale-110 transition-transform" />
                </button>
                <button 
                  onClick={() => setActiveTab("users")}
                  className="w-full text-left p-4 bg-white/10 hover:bg-white/20 rounded-xl transition-all group flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium">Manage Students</p>
                    <p className="text-sm text-gray-200/80 mt-1">View and edit student records</p>
                  </div>
                  <UserCog size={20} className="group-hover:scale-110 transition-transform" />
                </button>
                <button 
                  onClick={() => setActiveTab("users")}
                  className="w-full text-left p-4 bg-white/10 hover:bg-white/20 rounded-xl transition-all group flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium">Parent Accounts</p>
                    <p className="text-sm text-gray-200/80 mt-1">Manage parent access</p>
                  </div>
                  <Family size={20} className="group-hover:scale-110 transition-transform" />
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl p-6 text-white">
              <h3 className="text-lg font-bold mb-4">System Tools</h3>
              <div className="space-y-3">
                <button className="w-full text-left p-4 bg-white/10 hover:bg-white/20 rounded-xl transition-all group flex items-center justify-between">
                  <div>
                    <p className="font-medium">Backup Database</p>
                    <p className="text-sm text-gray-200/80 mt-1">Create system backup</p>
                  </div>
                  <Database size={20} className="group-hover:scale-110 transition-transform" />
                </button>
                <button className="w-full text-left p-4 bg-white/10 hover:bg-white/20 rounded-xl transition-all group flex items-center justify-between">
                  <div>
                    <p className="font-medium">System Logs</p>
                    <p className="text-sm text-gray-200/80 mt-1">View activity logs</p>
                  </div>
                  <FileText size={20} className="group-hover:scale-110 transition-transform" />
                </button>
                <button className="w-full text-left p-4 bg-white/10 hover:bg-white/20 rounded-xl transition-all group flex items-center justify-between">
                  <div>
                    <p className="font-medium">Reports</p>
                    <p className="text-sm text-gray-200/80 mt-1">Generate analytics</p>
                  </div>
                  <BarChart3 size={20} className="group-hover:scale-110 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Recent Activity */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Recent Activity</h2>
            <div className="space-y-4">
              {[
                { action: "New student enrolled", user: "Emma Watson", time: "10 min ago" },
                { action: "Teacher account created", user: "Mr. James Wilson", time: "30 min ago" },
                { action: "System backup completed", user: "System", time: "1 hour ago" },
                { action: "Announcement published", user: "Admin", time: "2 hours ago" },
                { action: "Parent account updated", user: "Maria Rodriguez", time: "3 hours ago" },
              ].map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                    <Bell size={16} className="text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.action}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">by {activity.user}</p>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Quick Stats</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Online Users</span>
                <span className="font-bold text-green-600 dark:text-green-400">247</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Storage Used</span>
                <span className="font-bold text-blue-600 dark:text-blue-400">78%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Pending Requests</span>
                <span className="font-bold text-amber-600 dark:text-amber-400">12</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">System Uptime</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">99.9%</span>
              </div>
            </div>
          </div>

          {/* System Status */}
          <div className="bg-gradient-to-br from-emerald-600 to-green-600 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">System Status</h3>
              <ShieldCheck size={24} />
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span>Database</span>
                <span className="px-2 py-1 bg-white/20 rounded-full text-xs">Healthy</span>
              </div>
              <div className="flex items-center justify-between">
                <span>API Services</span>
                <span className="px-2 py-1 bg-white/20 rounded-full text-xs">Operational</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Email Services</span>
                <span className="px-2 py-1 bg-white/20 rounded-full text-xs">Running</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Security</span>
                <span className="px-2 py-1 bg-white/20 rounded-full text-xs">Active</span>
              </div>
            </div>
            <button className="w-full mt-6 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors">
              View Detailed Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Announcements Section with Audience Selection
  const AnnouncementsSection = () => {
    const [announcementTitle, setAnnouncementTitle] = useState("");
    const [announcementContent, setAnnouncementContent] = useState("");
    const [announcementPriority, setAnnouncementPriority] = useState("medium");
    const [selectedGroups, setSelectedGroups] = useState<string[]>([]);

    const audienceOptions = [
      { value: "everyone", label: "Everyone", icon: <GlobeIcon size={16} /> },
      { value: "teachers", label: "Teachers", icon: <UserCog size={16} /> },
      { value: "students", label: "Students", icon: <Students size={16} /> },
      { value: "parents", label: "Parents", icon: <Family size={16} /> },
      { value: "staff", label: "Staff", icon: <UsersIcon size={16} /> },
    ];

    const handleGroupToggle = (group: string) => {
      setSelectedGroups(prev =>
        prev.includes(group)
          ? prev.filter(g => g !== group)
          : [...prev, group]
      );
    };

    const handlePublishAnnouncement = () => {
      // Here you would typically send the announcement to your backend
      const announcement = {
        title: announcementTitle,
        content: announcementContent,
        priority: announcementPriority,
        audience: selectedGroups.length > 0 ? selectedGroups.join(", ") : "Everyone",
        author: userName,
        date: new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
      };
      
      console.log("Publishing announcement:", announcement);
      
      // Reset form
      setAnnouncementTitle("");
      setAnnouncementContent("");
      setAnnouncementPriority("medium");
      setSelectedGroups([]);
      
      alert("Announcement published successfully!");
    };

    return (
      <div className="space-y-8 p-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-100 dark:border-gray-700">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">School Announcements</h2>
              <p className="text-gray-500 dark:text-gray-400 mt-2">Communicate with teachers, students, and parents</p>
            </div>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search announcements..."
                  className="pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7B1112]"
                />
              </div>
            </div>
          </div>
          
          {/* Create Announcement Form */}
          <div className="mb-8 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Create New Announcement</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Announcement Title"
                value={announcementTitle}
                onChange={(e) => setAnnouncementTitle(e.target.value)}
                className="w-full px-4 py-3 border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-[#7B1112] focus:border-transparent"
              />
              <textarea
                placeholder="Announcement Content"
                value={announcementContent}
                onChange={(e) => setAnnouncementContent(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-[#7B1112] focus:border-transparent"
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Select Audience
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {audienceOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => handleGroupToggle(option.value)}
                        className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all ${
                          selectedGroups.includes(option.value)
                            ? 'bg-gradient-to-r from-[#7B1112] to-[#FFB302] text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        {option.icon}
                        <span>{option.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Priority Level
                  </label>
                  <select
                    value={announcementPriority}
                    onChange={(e) => setAnnouncementPriority(e.target.value)}
                    className="w-full px-4 py-3 border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-[#7B1112]"
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                  </select>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="notify-email" defaultChecked />
                    <label htmlFor="notify-email" className="text-sm text-gray-700 dark:text-gray-300">
                      Send Email Notification
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="notify-sms" />
                    <label htmlFor="notify-sms" className="text-sm text-gray-700 dark:text-gray-300">
                      Send SMS Alert
                    </label>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <button className="px-6 py-2 border dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    Save as Draft
                  </button>
                  <button
                    onClick={handlePublishAnnouncement}
                    className="px-6 py-2 bg-gradient-to-r from-[#7B1112] to-[#FFB302] text-white rounded-lg hover:opacity-90 transition-opacity"
                  >
                    Publish Announcement
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Previous Announcements */}
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Previous Announcements</h3>
          {isLoading ? (
            <div className="space-y-4">
              {Array(4).fill(0).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : (
            <div className="space-y-6">
              {mockAnnouncements.map((announcement) => (
                <div key={announcement.id} className="group p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-[#7B1112] dark:hover:border-[#FFB302] hover:shadow-lg transition-all duration-300">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className={`p-3 rounded-lg ${
                        announcement.priority === 'high' ? 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400' :
                        announcement.priority === 'medium' ? 'bg-amber-100 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400' :
                        'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                      }`}>
                        {announcement.priority === 'high' ? <AlertCircle size={20} /> :
                         announcement.priority === 'medium' ? <Bell size={20} /> :
                         <Mail size={20} />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <h3 className="font-bold text-gray-900 dark:text-white">{announcement.title}</h3>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            announcement.audience === 'Everyone' ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300' :
                            announcement.audience === 'Teachers' ? 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-300' :
                            announcement.audience === 'Students' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300' :
                            'bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-300'
                          }`}>
                            {announcement.audience}
                          </span>
                          {announcement.priority === 'high' && (
                            <span className="px-2 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300 text-xs rounded-full">
                              Important
                            </span>
                          )}
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 mt-3">{announcement.content}</p>
                        <div className="flex items-center space-x-4 mt-4">
                          <span className="text-sm text-gray-500 dark:text-gray-400">👁️ {announcement.views} views</span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">By: {announcement.author}</span>
                          <button className="text-sm text-[#7B1112] dark:text-[#FFB302] hover:underline">
                            Edit
                          </button>
                          <button className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                            Resend Notification
                          </button>
                          <button className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                            View Analytics
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500 dark:text-gray-400">{announcement.date}</p>
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
  };

  // Messages Section with Chat for All Users
  const MessagesSection = () => {
    const [activeChatType, setActiveChatType] = useState('all');
    const [chatMessages, setChatMessages] = useState<any[]>([]);

    const filteredContacts = activeChatType === 'all' 
      ? chatContacts 
      : chatContacts.filter(contact => contact.type === activeChatType);

    const handleSendMessage = () => {
      if (!messageInput.trim() || !selectedChat) return;

      const newMessage = {
        id: Date.now(),
        text: messageInput,
        sender: 'admin',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: new Date().toLocaleDateString()
      };

      setChatMessages([...chatMessages, newMessage]);
      setMessageInput('');
    };

    return (
      <div className="space-y-8 p-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-100 dark:border-gray-700">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Communications</h2>
              <p className="text-gray-500 dark:text-gray-400 mt-2">Chat with teachers, students, and parents</p>
            </div>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  className="pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7B1112]"
                />
              </div>
              <button className="px-6 py-2 bg-gradient-to-r from-[#7B1112] to-[#FFB302] text-white rounded-lg hover:opacity-90 transition-opacity flex items-center">
                <Send size={20} className="mr-2" />
                New Conversation
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contacts Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Chat Type Filters */}
              <div className="flex space-x-2 overflow-x-auto pb-2">
                <button
                  onClick={() => setActiveChatType('all')}
                  className={`px-4 py-2 rounded-lg whitespace-nowrap ${
                    activeChatType === 'all' 
                      ? 'bg-gradient-to-r from-[#7B1112] to-[#FFB302] text-white' 
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setActiveChatType('teacher')}
                  className={`px-4 py-2 rounded-lg whitespace-nowrap ${
                    activeChatType === 'teacher' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  Teachers
                </button>
                <button
                  onClick={() => setActiveChatType('student')}
                  className={`px-4 py-2 rounded-lg whitespace-nowrap ${
                    activeChatType === 'student' 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  Students
                </button>
                <button
                  onClick={() => setActiveChatType('parent')}
                  className={`px-4 py-2 rounded-lg whitespace-nowrap ${
                    activeChatType === 'parent' 
                      ? 'bg-purple-500 text-white' 
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  Parents
                </button>
              </div>
              
              {/* Contacts List */}
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {filteredContacts.map((contact) => (
                  <button
                    key={contact.id}
                    onClick={() => {
                      setSelectedChat(contact);
                      setChatActive(true);
                      // Load chat history for this contact
                      setChatMessages([
                        {
                          id: 1,
                          text: contact.lastMessage,
                          sender: contact.type,
                          time: contact.time,
                          date: 'Today'
                        }
                      ]);
                    }}
                    className={`w-full text-left p-4 rounded-xl transition-all ${
                      selectedChat?.id === contact.id
                        ? 'bg-gradient-to-r from-[#7B1112] to-[#9B3132] text-white'
                        : 'bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          contact.type === 'teacher' ? 'bg-blue-500' :
                          contact.type === 'student' ? 'bg-green-500' :
                          contact.type === 'parent' ? 'bg-purple-500' :
                          'bg-amber-500'
                        } text-white`}>
                          {contact.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                          <p className="font-medium">{contact.name}</p>
                          <p className="text-sm opacity-75">
                            {contact.type === 'teacher' ? `Teacher - ${contact.department}` :
                             contact.type === 'student' ? `Student - Grade ${contact.grade}` :
                             contact.type === 'parent' ? `Parent of ${contact.student}` :
                             contact.department}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs opacity-75">{contact.time}</p>
                        {contact.unread > 0 && (
                          <span className="mt-1 inline-block w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                            {contact.unread}
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="mt-2 text-sm truncate opacity-75">{contact.lastMessage}</p>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Chat Area */}
            <div className="lg:col-span-2">
              {selectedChat ? (
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 h-[600px] flex flex-col">
                  {/* Chat Header */}
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        selectedChat.type === 'teacher' ? 'bg-blue-500' :
                        selectedChat.type === 'student' ? 'bg-green-500' :
                        selectedChat.type === 'parent' ? 'bg-purple-500' :
                        'bg-amber-500'
                      } text-white`}>
                        {userName.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">{selectedChat.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {selectedChat.type === 'teacher' ? `Teacher - ${selectedChat.department}` :
                           selectedChat.type === 'student' ? `Student - Grade ${selectedChat.grade}` :
                           selectedChat.type === 'parent' ? `Parent of ${selectedChat.student}` :
                           selectedChat.department}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                        <Phone size={20} />
                      </button>
                      <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                        <Video size={20} />
                      </button>
                      <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                        <MoreVertical size={20} />
                      </button>
                    </div>
                  </div>
                  
                  {/* Messages Area */}
                  <div className="flex-1 p-4 overflow-y-auto space-y-4">
                    {chatMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[70%] rounded-2xl p-4 ${
                          message.sender === 'admin'
                            ? 'bg-gradient-to-r from-[#7B1112] to-[#9B3132] text-white rounded-tr-none'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-tl-none'
                        }`}>
                          <p>{message.text}</p>
                          <p className={`text-xs mt-2 ${
                            message.sender === 'admin' ? 'text-gray-200 opacity-75' : 'text-gray-500 dark:text-gray-400'
                          }`}>
                            {message.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Message Input */}
                  <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Type your message here..."
                        className="flex-1 px-4 py-3 border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-[#7B1112]"
                      />
                      <button 
                        onClick={handleSendMessage}
                        className="px-6 py-3 bg-gradient-to-r from-[#7B1112] to-[#FFB302] text-white rounded-lg hover:opacity-90 transition-opacity"
                      >
                        <Send size={20} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                          <Upload size={20} />
                        </button>
                        <button className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                          <Video size={20} />
                        </button>
                        <button className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                          <FileText size={20} />
                        </button>
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Press Enter to send
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-[600px] bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl flex flex-col items-center justify-center p-8 text-center">
                  <MessageCircle size={64} className="text-gray-400 dark:text-gray-600 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Select a conversation</h3>
                  <p className="text-gray-600 dark:text-gray-400">Choose a contact from the list to start messaging</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">You can chat with teachers, students, and parents</p>
                  <button 
                    onClick={() => {/* Open new message modal */}}
                    className="mt-6 px-6 py-3 bg-gradient-to-r from-[#7B1112] to-[#FFB302] text-white rounded-lg hover:opacity-90 transition-opacity"
                  >
                    Start New Conversation
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // User Management Section
  const UsersManagementSection = () => {
    const [activeUserType, setActiveUserType] = useState('all');

    const userTypes = [
      { id: 'all', label: 'All Users', icon: <UsersIcon />, count: 125 },
      { id: 'teachers', label: 'Teachers', icon: <UserCog />, count: mockTeachers.length },
      { id: 'students', label: 'Students', icon: <Students />, count: mockStudents.length },
      { id: 'parents', label: 'Parents', icon: <Family />, count: mockParents.length },
    ];

    const renderUsersTable = () => {
      switch (activeUserType) {
        case 'teachers':
          return (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Teacher</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Department</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Subjects</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Students</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {mockTeachers.map((teacher) => (
                    <tr key={teacher.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white">
                            {teacher.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">{teacher.name}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{teacher.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">{teacher.department}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {teacher.subjects.map((subject, idx) => (
                            <span key={idx} className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 rounded">
                              {subject}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{teacher.students}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300">
                          {teacher.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-[#7B1112] dark:text-[#FFB302] hover:text-[#8B2122] dark:hover:text-[#FFC432] mr-3">
                          Edit
                        </button>
                        <button className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200">
                          Message
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );

        case 'students':
          return (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Student</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Grade</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Class</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Attendance</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">GPA</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {mockStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white">
                            {student.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">{student.name}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{student.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">Grade {student.grade}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">{student.class}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full" 
                              style={{ width: `${student.attendance}%` }}
                            ></div>
                          </div>
                          <span className="ml-2 text-sm text-gray-900 dark:text-white">{student.attendance}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{student.gpa}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-[#7B1112] dark:text-[#FFB302] hover:text-[#8B2122] dark:hover:text-[#FFC432] mr-3">
                          Edit
                        </button>
                        <button className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200">
                          Contact Parent
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );

        case 'parents':
          return (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Parent</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Contact</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Students</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {mockParents.map((parent) => (
                    <tr key={parent.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white">
                            {parent.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">{parent.name}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{parent.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">{parent.phone}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {parent.students.map((student, idx) => (
                            <span key={idx} className="px-2 py-1 text-xs bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-300 rounded">
                              {student}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300">
                          {parent.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-[#7B1112] dark:text-[#FFB302] hover:text-[#8B2122] dark:hover:text-[#FFC432] mr-3">
                          Edit
                        </button>
                        <button className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200">
                          Message
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );

        default:
          return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockTeachers.slice(0, 3).map((teacher) => (
                <div key={teacher.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white">
                      {teacher.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">{teacher.name}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Teacher</p>
                    </div>
                  </div>
                </div>
              ))}
              {mockStudents.slice(0, 3).map((student) => (
                <div key={student.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white">
                      {student.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">{student.name}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Student</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          );
      }
    };

    return (
      <div className="space-y-8 p-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-100 dark:border-gray-700">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">User Management</h2>
              <p className="text-gray-500 dark:text-gray-400 mt-2">Manage teachers, students, and parent accounts</p>
            </div>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search users..."
                  className="pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7B1112]"
                />
              </div>
              <button className="px-6 py-2 bg-gradient-to-r from-[#7B1112] to-[#FFB302] text-white rounded-lg hover:opacity-90 transition-opacity flex items-center">
                <UserPlus size={20} className="mr-2" />
                Add User
              </button>
            </div>
          </div>
          
          {/* User Type Selector */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {userTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setActiveUserType(type.id)}
                className={`p-4 rounded-xl transition-all flex items-center justify-between ${
                  activeUserType === type.id
                    ? 'bg-gradient-to-r from-[#7B1112] to-[#FFB302] text-white'
                    : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${
                    activeUserType === type.id ? 'bg-white/20' : 'bg-white dark:bg-gray-800'
                  }`}>
                    {React.cloneElement(type.icon, {
                      className: activeUserType === type.id ? 'text-white' : 'text-gray-600 dark:text-gray-300'
                    })}
                  </div>
                  <div className="text-left">
                    <p className="font-medium">{type.label}</p>
                    <p className="text-sm opacity-75">{type.count} users</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
          
          {/* Users Table */}
          {renderUsersTable()}
          
          {/* Bulk Actions */}
          <div className="mt-8 p-6 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Bulk Actions</h3>
            <div className="flex items-center space-x-4">
              <select className="px-4 py-2 border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
                <option>Select Action</option>
                <option>Send Email</option>
                <option>Export Data</option>
                <option>Update Status</option>
                <option>Assign Group</option>
              </select>
              <input
                type="file"
                className="px-4 py-2 border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
                accept=".csv,.xlsx"
                placeholder="Upload user list"
              />
              <button className="px-6 py-2 bg-[#7B1112] text-white rounded-lg hover:bg-[#8B2122] transition-colors">
                Execute Action
              </button>
              <button className="px-6 py-2 border dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                Download Template
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Profile Section
  const ProfileSection = () => (
    <div className="space-y-8 p-6">
      <div className="bg-gradient-to-r from-gray-900 to-[#7B1112] rounded-2xl p-8 text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold">Administrator Profile</h2>
            <p className="text-gray-200 mt-2">Manage your administrative account and permissions</p>
          </div>
          <button className="mt-4 md:mt-0 flex items-center px-6 py-3 bg-white/20 hover:bg-white/30 rounded-xl transition-all">
            <Edit size={20} className="mr-2" />
            Edit Profile
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
                        <div className="w-40 h-40 bg-gradient-to-br from-[#7B1112] to-[#FFB302] rounded-full flex items-center justify-center text-white text-5xl font-bold">
                          {userName.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </div>
                        <div className="absolute bottom-6 right-6 w-10 h-10 bg-green-500 rounded-full border-4 border-white dark:border-gray-800 flex items-center justify-center">
                          <ShieldCheck size={20} className="text-white" />
                        </div>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white text-center">{userName}</h3>
                      <p className="text-gray-600 dark:text-gray-300 mt-1 text-center">{userEmail}</p>
                      <div className="mt-4 px-4 py-2 bg-gradient-to-r from-[#7B1112] to-[#FFB302] text-white rounded-full text-sm font-medium">
                        <ShieldCheck size={16} className="inline mr-2" />
                        System Administrator
                      </div>
                    </div>
                  </div>
                  
                  <div className="md:w-2/3 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Admin ID</label>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">{userData?.admin_id || "ADMIN-001"}</p>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Role</label>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">Super Administrator</p>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Phone Number</label>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">{userData?.phone || "+1 (555) 123-4567"}</p>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Last Login</label>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">Today, 09:42 AM</p>
                      </div>
                    </div>
                    
                    <div className="pt-6 border-t dark:border-gray-700">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">System Permissions</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {['User Management', 'System Settings', 'Database Access', 'Announcements', 'Reports', 'Security'].map((permission) => (
                          <div key={permission} className="flex items-center space-x-2">
                            <CheckCircle size={16} className="text-green-500" />
                            <span className="text-sm text-gray-700 dark:text-gray-300">{permission}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Activity Log */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Recent Activity Log</h3>
              <div className="space-y-4">
                {[
                  { action: "Added new teacher account", time: "10:30 AM", ip: "192.168.1.100" },
                  { action: "Published school announcement", time: "09:15 AM", ip: "192.168.1.100" },
                  { action: "Updated system settings", time: "Yesterday, 3:45 PM", ip: "192.168.1.100" },
                  { action: "Exported user report", time: "Yesterday, 2:30 PM", ip: "192.168.1.100" },
                  { action: "Reset student password", time: "Mar 15, 11:20 AM", ip: "192.168.1.100" },
                ].map((log, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{log.action}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">IP: {log.ip}</p>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{log.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Admin Overview</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <span className="text-gray-700 dark:text-gray-300">Total Users</span>
                  <span className="font-bold text-2xl text-blue-600 dark:text-blue-400">1,369</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <span className="text-gray-700 dark:text-gray-300">Active Sessions</span>
                  <span className="font-bold text-2xl text-green-600 dark:text-green-400">247</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <span className="text-gray-700 dark:text-gray-300">Pending Tasks</span>
                  <span className="font-bold text-2xl text-purple-600 dark:text-purple-400">12</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                  <span className="text-gray-700 dark:text-gray-300">System Alerts</span>
                  <span className="font-bold text-2xl text-amber-600 dark:text-amber-400">3</span>
                </div>
              </div>
            </div>
            
            {/* Security */}
            <div className="bg-gradient-to-br from-gray-900 to-[#7B1112] rounded-2xl p-6 text-white">
              <div className="flex items-center mb-4">
                <Shield size={24} className="mr-3" />
                <h4 className="font-semibold text-xl">Security</h4>
              </div>
              <div className="space-y-3">
                <button className="w-full text-left p-4 bg-white/10 hover:bg-white/20 rounded-xl transition-colors">
                  Change Password
                </button>
                <button className="w-full text-left p-4 bg-white/10 hover:bg-white/20 rounded-xl transition-colors">
                  Two-Factor Authentication
                </button>
                <button className="w-full text-left p-4 bg-white/10 hover:bg-white/20 rounded-xl transition-colors">
                  Login History
                </button>
                <button className="w-full text-left p-4 bg-white/10 hover:bg-white/20 rounded-xl transition-colors">
                  Security Settings
                </button>
              </div>
            </div>
            
            {/* Support */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Admin Support</h4>
              <button className="w-full text-left p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <HelpCircle size={16} className="inline mr-2" />
                Documentation
              </button>
              <button className="w-full text-left p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <Wrench size={16} className="inline mr-2" />
                System Tools
              </button>
              <button className="w-full text-left p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <Database size={16} className="inline mr-2" />
                Backup & Restore
              </button>
              <button className="w-full text-left p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <Key size={16} className="inline mr-2" />
                API Access
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // System Settings Section
  const SettingsSection = () => (
    <div className="space-y-8 p-6">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-100 dark:border-gray-700">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">System Settings</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8">Configure school system preferences and global settings</p>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* General Settings */}
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">General Settings</h3>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">School Name</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-[#7B1112]"
                      defaultValue="Prestige Academy"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Academic Year</label>
                    <select className="w-full px-4 py-3 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-[#7B1112]">
                      <option>2023-2024</option>
                      <option>2024-2025</option>
                      <option>2025-2026</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">School Address</label>
                  <textarea
                    className="w-full px-4 py-3 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-[#7B1112] focus:border-transparent transition-all"
                    rows={3}
                    defaultValue="123 Education Street, Knowledge City, 12345"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Contact Email</label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-[#7B1112]"
                      defaultValue="contact@school.edu"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Contact Phone</label>
                    <input
                      type="tel"
                      className="w-full px-4 py-3 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-[#7B1112]"
                      defaultValue="+1 (555) 123-4567"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Notification Settings */}
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">System Notifications</h3>
              <div className="space-y-4">
                {[
                  { label: "System Updates", description: "Notify about system updates and maintenance", checked: true },
                  { label: "Security Alerts", description: "Critical security notifications", checked: true },
                  { label: "User Activity", description: "Important user actions and changes", checked: true },
                  { label: "Backup Completion", description: "System backup completion alerts", checked: true },
                  { label: "Storage Alerts", description: "Low storage space warnings", checked: true },
                  { label: "Performance Issues", description: "System performance degradation alerts", checked: false },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-600">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{item.label}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{item.description}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked={item.checked} />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#7B1112]"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            {/* System Status Card */}
            <div className="bg-gradient-to-br from-emerald-600 to-green-600 rounded-2xl p-6 text-white">
              <ShieldCheck size={32} className="mb-4" />
              <h4 className="font-semibold text-xl mb-2">System Health</h4>
              <p className="text-gray-200 text-sm mb-6">Current system status and performance</p>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span>Database</span>
                  <span className="px-2 py-1 bg-white/20 rounded-full text-xs">Healthy</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>API Services</span>
                  <span className="px-2 py-1 bg-white/20 rounded-full text-xs">Operational</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Storage</span>
                  <span className="px-2 py-1 bg-white/20 rounded-full text-xs">78% Used</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Uptime</span>
                  <span className="px-2 py-1 bg-white/20 rounded-full text-xs">99.9%</span>
                </div>
              </div>
            </div>
            
            {/* Maintenance Tools */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Maintenance Tools</h4>
              <button className="w-full text-left p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <Database size={16} className="inline mr-2" />
                Database Backup
              </button>
              <button className="w-full text-left p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <Wrench size={16} className="inline mr-2" />
                System Diagnostics
              </button>
              <button className="w-full text-left p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <Key size={16} className="inline mr-2" />
                API Configuration
              </button>
              <button className="w-full text-left p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <BarChart3 size={16} className="inline mr-2" />
                Performance Metrics
              </button>
            </div>
            
            {/* Save Settings */}
            <div className="bg-gradient-to-r from-[#7B1112] to-[#9B3132] rounded-2xl p-6 text-white">
              <h4 className="font-semibold mb-4">Save Changes</h4>
              <p className="text-gray-200 text-sm mb-4">Apply your configuration changes</p>
              <button className="w-full py-3 bg-white/20 hover:bg-white/30 rounded-lg transition-colors">
                Save All Settings
              </button>
              <button className="w-full mt-3 py-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
                Reset to Defaults
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Portal Navigation - Updated for Admin
  const portalFeatures = [
    {
      title: "Dashboard",
      icon: <Home />,
      action: () => setActiveTab("dashboard")
    },
    {
      title: "Announcements",
      icon: <Bell />,
      action: () => setActiveTab("announcements")
    },
    {
      title: "Messages",
      icon: <MessageSquare />,
      action: () => setActiveTab("messages")
    },
    {
      title: "Users",
      icon: <UserCog />,
      action: () => setActiveTab("users")
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
      case "announcements":
        return <AnnouncementsSection />;
      case "messages":
        return <MessagesSection />;
      case "users":
        return <UsersManagementSection />;
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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="p-6">
          <div className="max-w-7xl mx-auto">
            {/* Skeleton Header */}
            <div className="animate-pulse mb-8">
              <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl w-64 mb-4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-96"></div>
            </div>
            
            {/* Skeleton Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
              {Array(6).fill(0).map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
              ))}
            </div>
            
            {/* Skeleton Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                {Array(2).fill(0).map((_, i) => (
                  <div key={i} className="h-96 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
                ))}
              </div>
              <div className="space-y-8">
                {Array(3).fill(0).map((_, i) => (
                  <div key={i} className="h-48 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      {/* Main Layout */}
      <div className="flex">
        {/* Sidebar Navigation */}
        <aside className={`
          hidden lg:block w-64 flex-shrink-0
          ${sidebarOpen ? 'block fixed inset-y-0 left-0 z-40' : 'hidden'}
          bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700
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
                    transition-all duration-300
                    ${activeTab === feature.title.toLowerCase()
                      ? 'bg-gradient-to-r from-[#7B1112] to-[#FFB302] text-white shadow-lg'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                    }
                  `}
                >
                  {React.cloneElement(feature.icon, { 
                    className: `h-5 w-5 ${activeTab === feature.title.toLowerCase() ? 'text-white' : 'text-gray-400'}`
                  })}
                  <span className="font-medium">{feature.title}</span>
                  {feature.title === "Messages" && (
                    <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      12
                    </span>
                  )}
                  {feature.title === "Users" && (
                    <span className="ml-auto bg-amber-500 text-white text-xs px-2 py-1 rounded-full">
                      3
                    </span>
                  )}
                </button>
              ))}
              
              {/* System Status Quick View */}
              <div className="mt-8 p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">System Status</p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Users Online</span>
                    <span className="text-sm font-medium text-green-600 dark:text-green-400">247</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">System Load</span>
                    <span className="text-sm font-medium text-blue-600 dark:text-blue-400">42%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Storage</span>
                    <span className="text-sm font-medium text-amber-600 dark:text-amber-400">78%</span>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t dark:border-gray-700">
                  <div className="flex items-center text-sm text-emerald-600 dark:text-emerald-400">
                    <ShieldCheck size={14} className="mr-2" />
                    All Systems Operational
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
    </div>
  );
};

export default AdminPortal;