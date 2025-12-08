import React, { useState, useEffect, JSX } from "react";
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
  Users as Students, FolderOpen, PenTool, CalendarRange
} from "lucide-react";
import { supabase } from '../supabaseClient';

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

// Mock data for Teachers Portal
const mockClasses = [
  { 
    id: 1, 
    name: "Mathematics - Grade 11", 
    section: "STEM-A", 
    code: "MATH-11-A",
    studentCount: 32,
    assignments: 3,
    color: "from-blue-500 to-cyan-500",
    schedule: "Mon, Wed, Fri 9:00 AM"
  },
  { 
    id: 2, 
    name: "Advanced Physics", 
    section: "STEM-B", 
    code: "PHYS-12-B",
    studentCount: 28,
    assignments: 2,
    color: "from-purple-500 to-pink-500",
    schedule: "Tue, Thu 10:30 AM"
  },
  { 
    id: 3, 
    name: "Calculus BC", 
    section: "STEM-C", 
    code: "CALC-12-C",
    studentCount: 25,
    assignments: 4,
    color: "from-green-500 to-emerald-500",
    schedule: "Mon-Fri 1:00 PM"
  },
];

const mockAnnouncements = [
  { 
    id: 1, 
    title: "Midterm Exam Schedule", 
    content: "Midterm exams will be held from March 25-29. Please prepare your students...", 
    date: "Today, 9:00 AM", 
    priority: "high",
    class: "All Classes",
    views: 124
  },
  { 
    id: 2, 
    title: "Science Fair Submission Deadline", 
    content: "Reminder: Science fair projects must be submitted by Friday, March 22...", 
    date: "Yesterday", 
    priority: "medium",
    class: "Advanced Physics",
    views: 89
  },
  { 
    id: 3, 
    title: "Professional Development Day", 
    content: "No classes next Monday for teacher professional development...", 
    date: "2 days ago", 
    priority: "low",
    class: "All Teachers",
    views: 67
  },
];

const mockAssignments = [
  { 
    id: 1, 
    title: "Linear Algebra Project", 
    class: "Mathematics - Grade 11",
    dueDate: "2024-03-25",
    submissions: 28,
    totalStudents: 32,
    status: "active",
    type: "project",
    points: 100
  },
  { 
    id: 2, 
    title: "Physics Lab Report", 
    class: "Advanced Physics",
    dueDate: "2024-03-20",
    submissions: 24,
    totalStudents: 28,
    status: "grading",
    type: "lab",
    points: 50
  },
  { 
    id: 3, 
    title: "Calculus Quiz #3", 
    class: "Calculus BC",
    dueDate: "2024-03-18",
    submissions: 25,
    totalStudents: 25,
    status: "graded",
    type: "quiz",
    points: 30
  },
];

const mockQuizzes = [
  {
    id: 1,
    title: "Trigonometry Fundamentals",
    class: "Mathematics - Grade 11",
    duration: "45 minutes",
    questions: 20,
    attempts: 120,
    averageScore: 78,
    status: "published"
  },
  {
    id: 2,
    title: "Quantum Mechanics Basics",
    class: "Advanced Physics",
    duration: "60 minutes",
    questions: 25,
    attempts: 85,
    averageScore: 72,
    status: "draft"
  },
  {
    id: 3,
    title: "Integration Techniques",
    class: "Calculus BC",
    duration: "50 minutes",
    questions: 18,
    attempts: 95,
    averageScore: 85,
    status: "published"
  },
];

const mockStudents = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah.j@school.edu",
    class: "Mathematics - Grade 11",
    grade: "A",
    assignmentsCompleted: 12,
    attendance: 95,
    parentName: "Michael Johnson"
  },
  {
    id: 2,
    name: "Alex Chen",
    email: "alex.c@school.edu",
    class: "Advanced Physics",
    grade: "B+",
    assignmentsCompleted: 10,
    attendance: 88,
    parentName: "Lisa Chen"
  },
  {
    id: 3,
    name: "Maria Garcia",
    email: "maria.g@school.edu",
    class: "Calculus BC",
    grade: "A-",
    assignmentsCompleted: 15,
    attendance: 92,
    parentName: "Carlos Garcia"
  },
  {
    id: 4,
    name: "James Wilson",
    email: "james.w@school.edu",
    class: "Mathematics - Grade 11",
    grade: "B",
    assignmentsCompleted: 8,
    attendance: 85,
    parentName: "Robert Wilson"
  },
];

const mockGrades = [
  { 
    id: 1, 
    student: "Sarah Johnson",
    class: "Mathematics - Grade 11", 
    assignment: "Linear Algebra Project",
    grade: "A", 
    percentage: 92,
    submitted: "2024-03-20",
    feedback: "Excellent work! Clear explanations."
  },
  { 
    id: 2, 
    student: "Alex Chen",
    class: "Advanced Physics", 
    assignment: "Physics Lab Report",
    grade: "B+", 
    percentage: 87,
    submitted: "2024-03-19",
    feedback: "Good analysis, needs more detail in conclusion"
  },
  { 
    id: 3, 
    student: "Maria Garcia",
    class: "Calculus BC", 
    assignment: "Integration Quiz",
    grade: "A-", 
    percentage: 90,
    submitted: "2024-03-18",
    feedback: "Well done on complex problems"
  },
];

const chatContacts = [
  {
    id: 1,
    name: "Michael Johnson",
    type: "parent",
    student: "Sarah Johnson",
    lastMessage: "Thank you for the update!",
    time: "10:30 AM",
    unread: 2
  },
  {
    id: 2,
    name: "Lisa Chen",
    type: "parent",
    student: "Alex Chen",
    lastMessage: "Can we schedule a meeting?",
    time: "Yesterday",
    unread: 0
  },
  {
    id: 3,
    name: "Mr. Davis",
    type: "teacher",
    subject: "Chemistry",
    lastMessage: "Team meeting at 3 PM",
    time: "2 days ago",
    unread: 0
  },
  {
    id: 4,
    name: "Admin Office",
    type: "admin",
    department: "Administration",
    lastMessage: "New policy update",
    time: "1 week ago",
    unread: 0
  },
  {
    id: 5,
    name: "Sarah Johnson",
    type: "student",
    class: "Mathematics - Grade 11",
    lastMessage: "Question about assignment",
    time: "Today",
    unread: 1
  },
];

const statsData = [
  { label: "Total Students", value: "85", change: "+5", icon: <Students />, color: "text-blue-500", bgColor: "bg-blue-500/10" },
  { label: "Active Classes", value: "3", change: "+0", icon: <BookOpen />, color: "text-green-500", bgColor: "bg-green-500/10" },
  { label: "Pending Grading", value: "12", change: "-3", icon: <FileCheck />, color: "text-amber-500", bgColor: "bg-amber-500/10" },
  { label: "Avg. Class Score", value: "84.2%", change: "+2.1%", icon: <TrendingUp />, color: "text-purple-500", bgColor: "bg-purple-500/10" },
];

const TeachersPortal: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications] = useState(5);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [selectedClass, setSelectedClass] = useState<string>("all");
  const [chatActive, setChatActive] = useState(false);
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [messageInput, setMessageInput] = useState("");

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
            setUserName(profileData.full_name || user.email?.split('@')[0] || "Teacher");
          } else {
            setUserName(user.user_metadata?.full_name || user.email?.split('@')[0] || "Teacher");
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

  // Filter data based on selected class
  const filteredAssignments = selectedClass === "all" 
    ? mockAssignments 
    : mockAssignments.filter(assignment => assignment.class === selectedClass);
  
  const filteredQuizzes = selectedClass === "all"
    ? mockQuizzes
    : mockQuizzes.filter(quiz => quiz.class === selectedClass);

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
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Teachers Portal</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Educate • Inspire • Empower</p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Search Bar */}
            <div className="hidden md:block relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search students, assignments..."
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
                5
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
                  <p className="text-xs text-gray-500 dark:text-gray-400">Teacher</p>
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
                      Settings
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

  // Class Selector Component
  const ClassSelector = () => (
    <div className="flex items-center space-x-4 mb-6 overflow-x-auto pb-2">
      <button
        onClick={() => setSelectedClass("all")}
        className={`px-4 py-2 rounded-lg transition-all whitespace-nowrap ${selectedClass === "all" 
          ? "bg-gradient-to-r from-[#7B1112] to-[#FFB302] text-white" 
          : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"}`}
      >
        All Classes
      </button>
      {mockClasses.map((classItem) => (
        <button
          key={classItem.id}
          onClick={() => setSelectedClass(classItem.name)}
          className={`px-4 py-2 rounded-lg transition-all flex items-center space-x-2 whitespace-nowrap ${selectedClass === classItem.name
            ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
            : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"}`}
        >
          <div className={`w-6 h-6 rounded-full bg-gradient-to-r ${classItem.color} flex items-center justify-center text-xs text-white`}>
            {classItem.code.split('-')[0][0]}
          </div>
          <span>{classItem.name.split(' ')[0]}</span>
        </button>
      ))}
    </div>
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
              <p className="text-gray-200">Track and manage your classes, assignments, and student progress.</p>
            </div>
            <div className="mt-4 md:mt-0">
              <button className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 px-6 py-3 rounded-xl transition-all">
                <CalendarRange size={20} />
                <span>View Schedule</span>
              </button>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm">
            <span className="flex items-center px-3 py-1 bg-white/10 rounded-full">
              <BookOpen size={16} className="mr-2" />
              {mockClasses.length} Active Classes
            </span>
            <span className="flex items-center px-3 py-1 bg-white/10 rounded-full">
              <Students size={16} className="mr-2" />
              85 Total Students
            </span>
            <span className="flex items-center px-3 py-1 bg-white/10 rounded-full">
              <Award size={16} className="mr-2" />
              5 Years Experience
            </span>
          </div>
        </div>
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-gradient-to-br from-[#FFB302]/20 to-transparent rounded-full"></div>
        <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-gradient-to-tr from-[#FFB302]/10 to-transparent rounded-full"></div>
      </div>

      {/* Class Selector */}
      <ClassSelector />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading ? (
          Array(4).fill(0).map((_, i) => (
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
                  <p className="text-3xl font-bold mt-2">{stat.value}</p>
                  <p className={`text-sm mt-1 ${stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                    {stat.change} from last week
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
        {/* Left Column - Assignments & Announcements */}
        <div className="lg:col-span-2 space-y-8">
          {/* Assignments Section */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Assignments</h2>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Track submission and grading progress</p>
              </div>
              <button 
                onClick={() => setActiveTab("assignments")}
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
                  {filteredAssignments.slice(0, 3).map((assignment) => (
                    <div key={assignment.id} className="p-5 rounded-xl border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all cursor-pointer">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              assignment.type === 'project' ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300' :
                              assignment.type === 'lab' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300' :
                              'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-300'
                            }`}>
                              {assignment.type.toUpperCase()}
                            </span>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              assignment.status === 'active' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300' :
                              assignment.status === 'grading' ? 'bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-300' :
                              'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                            }`}>
                              {assignment.status.toUpperCase()}
                            </span>
                          </div>
                          <h3 className="font-bold text-gray-900 dark:text-white mb-2">{assignment.title}</h3>
                          <p className="text-gray-600 dark:text-gray-300 mb-3">{assignment.class}</p>
                          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                            <div className="flex items-center space-x-4">
                              <span>Due: {assignment.dueDate}</span>
                              <span>{assignment.points} points</span>
                            </div>
                            <span>{assignment.submissions}/{assignment.totalStudents} submitted</span>
                          </div>
                          <div className="mt-3 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full" 
                              style={{ width: `${(assignment.submissions / assignment.totalStudents) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Announcements Section */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Your Announcements</h2>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Communicate with students and parents</p>
              </div>
              <button 
                onClick={() => setActiveTab("announcements")}
                className="text-[#7B1112] dark:text-[#FFB302] font-medium hover:underline"
              >
                Create New →
              </button>
            </div>
            <div className="p-6">
              {isLoading ? (
                <div className="space-y-4">
                  {Array(3).fill(0).map((_, i) => <SkeletonCard key={i} />)}
                </div>
              ) : (
                <div className="space-y-4">
                  {mockAnnouncements.map((announcement) => (
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
                            {announcement.priority === 'high' && (
                              <span className="px-2 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300 text-xs rounded-full">
                                Important
                              </span>
                            )}
                          </div>
                          <p className="text-gray-600 dark:text-gray-300 mb-3">{announcement.content}</p>
                          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                            <span>Class: {announcement.class}</span>
                            <div className="flex items-center space-x-4">
                              <span>👁️ {announcement.views} views</span>
                              <span>{announcement.date}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Classes Overview */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">My Classes</h2>
              <p className="text-gray-500 dark:text-gray-400 mt-1">Teaching schedule and details</p>
            </div>
            <div className="p-6">
              {isLoading ? (
                <div className="space-y-4">
                  {Array(2).fill(0).map((_, i) => <SkeletonCard key={i} />)}
                </div>
              ) : (
                <div className="space-y-4">
                  {mockClasses.map((classItem) => (
                    <div key={classItem.id} className="p-4 rounded-xl border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all">
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${classItem.color} flex items-center justify-center text-white font-bold`}>
                          {classItem.code.split('-')[0][0]}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 dark:text-white">{classItem.name}</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{classItem.code} • {classItem.section}</p>
                        </div>
                      </div>
                      <div className="mt-4 grid grid-cols-2 gap-4">
                        <div className="text-center">
                          <p className="text-sm text-gray-500 dark:text-gray-400">Students</p>
                          <p className="font-bold text-gray-900 dark:text-white">{classItem.studentCount}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-500 dark:text-gray-400">Assignments</p>
                          <p className="font-bold text-amber-600 dark:text-amber-400">{classItem.assignments}</p>
                        </div>
                      </div>
                      <div className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                        <Clock size={14} className="inline mr-1" />
                        {classItem.schedule}
                      </div>
                      <button 
                        onClick={() => {
                          setSelectedClass(classItem.name);
                          setActiveTab("assignments");
                        }}
                        className="mt-4 w-full py-2 text-sm font-medium text-[#7B1112] dark:text-[#FFB302] hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        View Class →
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gradient-to-br from-[#7B1112] to-[#9B3132] rounded-2xl p-6 text-white">
            <h2 className="text-xl font-bold mb-6">Quick Actions</h2>
            <div className="space-y-3">
              <button 
                onClick={() => setActiveTab("assignments")}
                className="w-full text-left p-4 bg-white/10 hover:bg-white/20 rounded-xl transition-all group flex items-center justify-between"
              >
                <div>
                  <p className="font-medium">Create Assignment</p>
                  <p className="text-sm text-gray-200/80 mt-1">Add new homework or project</p>
                </div>
                <PenTool size={20} className="group-hover:scale-110 transition-transform" />
              </button>
              <button 
                onClick={() => setActiveTab("quizzes")}
                className="w-full text-left p-4 bg-white/10 hover:bg-white/20 rounded-xl transition-all group flex items-center justify-between"
              >
                <div>
                  <p className="font-medium">Create Quiz</p>
                  <p className="text-sm text-gray-200/80 mt-1">Design assessment</p>
                </div>
                <FileQuestion size={20} className="group-hover:scale-110 transition-transform" />
              </button>
              <button 
                onClick={() => setActiveTab("announcements")}
                className="w-full text-left p-4 bg-white/10 hover:bg-white/20 rounded-xl transition-all group flex items-center justify-between"
              >
                <div>
                  <p className="font-medium">Post Announcement</p>
                  <p className="text-sm text-gray-200/80 mt-1">Share updates</p>
                </div>
                <Bell size={20} className="group-hover:scale-110 transition-transform" />
              </button>
              <button 
                onClick={() => setActiveTab("grades")}
                className="w-full text-left p-4 bg-white/10 hover:bg-white/20 rounded-xl transition-all group flex items-center justify-between"
              >
                <div>
                  <p className="font-medium">Enter Grades</p>
                  <p className="text-sm text-gray-200/80 mt-1">Update student scores</p>
                </div>
                <Grade size={20} className="group-hover:scale-110 transition-transform" />
              </button>
            </div>
          </div>

          {/* Upcoming Deadlines */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Upcoming Deadlines</h2>
            <div className="space-y-4">
              {mockAssignments.slice(0, 3).map((assignment) => (
                <div key={assignment.id} className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{assignment.title}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{assignment.class}</p>
                  </div>
                  <div className="px-3 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 text-sm rounded-full">
                    {assignment.dueDate}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Assignments Section
  const AssignmentsSection = () => (
    <div className="space-y-8 p-6">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-100 dark:border-gray-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Assignments Management</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Create, track, and grade student assignments</p>
          </div>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search assignments..."
                className="pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7B1112]"
              />
            </div>
            <button 
              onClick={() => {/* Open create assignment modal */}}
              className="px-6 py-2 bg-[#7B1112] text-white rounded-lg hover:bg-[#8B2122] transition-colors flex items-center"
            >
              <PenTool size={20} className="mr-2" />
              Create Assignment
            </button>
          </div>
        </div>
        
        <ClassSelector />
        
        <div className="flex items-center space-x-4 mb-6">
          <button className="px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-lg">
            All ({mockAssignments.length})
          </button>
          <button className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
            Active ({mockAssignments.filter(a => a.status === 'active').length})
          </button>
          <button className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
            Grading ({mockAssignments.filter(a => a.status === 'grading').length})
          </button>
          <button className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
            Graded ({mockAssignments.filter(a => a.status === 'graded').length})
          </button>
        </div>
        
        {isLoading ? (
          <div className="space-y-4">
            {Array(5).fill(0).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <div className="space-y-6">
            {filteredAssignments.map((assignment) => (
              <div key={assignment.id} className="group p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-[#7B1112] dark:hover:border-[#FFB302] hover:shadow-lg transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`p-4 rounded-xl ${
                      assignment.type === 'project' ? 'bg-blue-50 dark:bg-blue-900/20' :
                      assignment.type === 'lab' ? 'bg-green-50 dark:bg-green-900/20' :
                      'bg-purple-50 dark:bg-purple-900/20'
                    }`}>
                      {assignment.type === 'project' ? <FolderOpen size={24} /> :
                       assignment.type === 'lab' ? <ClipboardCheck size={24} /> :
                       <FileText size={24} />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-gray-900 dark:text-white">{assignment.title}</h3>
                        <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-full">
                          {assignment.class}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
                        <span>Due: {assignment.dueDate}</span>
                        <span>{assignment.points} points</span>
                        <span>Type: {assignment.type}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center justify-end gap-3">
                      <div className={`text-3xl font-bold ${
                        assignment.status === 'active' ? 'text-green-600 dark:text-green-400' :
                        assignment.status === 'grading' ? 'text-amber-600 dark:text-amber-400' :
                        'text-blue-600 dark:text-blue-400'
                      }`}>
                        {assignment.submissions}/{assignment.totalStudents}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Submissions</p>
                        <p className={`text-sm ${assignment.status === 'active' ? 'text-green-500' : 'text-amber-500'}`}>
                          {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t dark:border-gray-700">
                  <div className="flex items-center space-x-4">
                    <button className="text-sm text-[#7B1112] dark:text-[#FFB302] hover:underline">
                      View Submissions ({assignment.submissions})
                    </button>
                    <button className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                      Edit Assignment
                    </button>
                    <button className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                      Grade All
                    </button>
                    <button className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                      Send Reminder
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

  // Quizzes Section
  const QuizzesSection = () => (
    <div className="space-y-8 p-6">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-100 dark:border-gray-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Quizzes & Assessments</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Create and manage student assessments</p>
          </div>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search quizzes..."
                className="pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7B1112]"
              />
            </div>
            <button 
              onClick={() => {/* Open create quiz modal */}}
              className="px-6 py-2 bg-[#7B1112] text-white rounded-lg hover:bg-[#8B2122] transition-colors flex items-center"
            >
              <FileQuestion size={20} className="mr-2" />
              Create Quiz
            </button>
          </div>
        </div>
        
        <ClassSelector />
        
        {isLoading ? (
          <div className="space-y-4">
            {Array(5).fill(0).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <div className="space-y-6">
            {filteredQuizzes.map((quiz) => (
              <div key={quiz.id} className="group p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-[#7B1112] dark:hover:border-[#FFB302] hover:shadow-lg transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`p-4 rounded-xl ${
                      quiz.status === 'published' ? 'bg-green-50 dark:bg-green-900/20' :
                      quiz.status === 'draft' ? 'bg-gray-100 dark:bg-gray-700' :
                      'bg-blue-50 dark:bg-blue-900/20'
                    }`}>
                      <FileQuestion size={24} className={
                        quiz.status === 'published' ? 'text-green-600 dark:text-green-400' :
                        quiz.status === 'draft' ? 'text-gray-600 dark:text-gray-400' :
                        'text-blue-600 dark:text-blue-400'
                      } />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-gray-900 dark:text-white">{quiz.title}</h3>
                        <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-full">
                          {quiz.class}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          quiz.status === 'published' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300' :
                          'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                        }`}>
                          {quiz.status.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
                        <span>Duration: {quiz.duration}</span>
                        <span>Questions: {quiz.questions}</span>
                        <span>Attempts: {quiz.attempts}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center justify-end gap-3">
                      <div className="text-3xl font-bold text-gray-900 dark:text-white">
                        {quiz.averageScore}%
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Avg. Score</p>
                        <p className="text-sm text-green-500">
                          {quiz.attempts} attempts
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t dark:border-gray-700">
                  <div className="flex items-center space-x-4">
                    {quiz.status === 'published' ? (
                      <>
                        <button className="text-sm text-[#7B1112] dark:text-[#FFB302] hover:underline">
                          View Results
                        </button>
                        <button className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                          Download Reports
                        </button>
                        <button className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                          Close Quiz
                        </button>
                      </>
                    ) : (
                      <>
                        <button className="text-sm text-[#7B1112] dark:text-[#FFB302] hover:underline">
                          Edit Quiz
                        </button>
                        <button className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                          Preview
                        </button>
                        <button className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                          Publish
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  // Announcements Section
  const AnnouncementsSection = () => (
    <div className="space-y-8 p-6">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-100 dark:border-gray-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Announcements</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Communicate with students and parents</p>
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
            <button 
              onClick={() => {/* Open create announcement modal */}}
              className="px-6 py-2 bg-[#7B1112] text-white rounded-lg hover:bg-[#8B2122] transition-colors flex items-center"
            >
              <Edit size={20} className="mr-2" />
              New Announcement
            </button>
          </div>
        </div>
        
        {/* Create Announcement Form */}
        <div className="mb-8 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Create New Announcement</h3>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Announcement Title"
              className="w-full px-4 py-3 border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-[#7B1112] focus:border-transparent"
            />
            <textarea
              placeholder="Announcement Content"
              rows={4}
              className="w-full px-4 py-3 border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-[#7B1112] focus:border-transparent"
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <select className="px-4 py-3 border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-[#7B1112]">
                <option>Select Class</option>
                <option value="all">All Classes</option>
                {mockClasses.map(c => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
              <select className="px-4 py-3 border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-[#7B1112]">
                <option>Priority Level</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="notify-parents" />
                <label htmlFor="notify-parents" className="text-sm text-gray-700 dark:text-gray-300">
                  Notify Parents
                </label>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="px-6 py-2 bg-[#7B1112] text-white rounded-lg hover:bg-[#8B2122] transition-colors">
                Publish Announcement
              </button>
              <button className="px-6 py-2 border dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                Save as Draft
              </button>
            </div>
          </div>
        </div>
        
        {isLoading ? (
          <div className="space-y-4">
            {Array(5).fill(0).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Previous Announcements</h3>
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
                        {announcement.priority === 'high' && (
                          <span className="px-2 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300 text-xs rounded-full">
                            Important
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 mt-1">Class: {announcement.class}</p>
                      <p className="text-gray-700 dark:text-gray-300 mt-3">{announcement.content}</p>
                      <div className="flex items-center space-x-4 mt-4">
                        <span className="text-sm text-gray-500 dark:text-gray-400">👁️ {announcement.views} views</span>
                        <button className="text-sm text-[#7B1112] dark:text-[#FFB302] hover:underline">
                          Edit
                        </button>
                        <button className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                          View Responses
                        </button>
                        <button className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                          Resend Notification
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

  // Grades Section
  const GradesSection = () => (
    <div className="space-y-8 p-6">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-100 dark:border-gray-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Grade Management</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Enter and manage student grades</p>
          </div>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search students..."
                className="pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7B1112]"
              />
            </div>
            <button className="px-6 py-2 bg-[#7B1112] text-white rounded-lg hover:bg-[#8B2122] transition-colors flex items-center">
              <Download size={20} className="mr-2" />
              Export Grades
            </button>
          </div>
        </div>
        
        <ClassSelector />
        
        {isLoading ? (
          <div className="space-y-4">
            {Array(5).fill(0).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-xl">
                <p className="text-sm text-gray-500 dark:text-gray-400">Average Class Score</p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">84.2%</p>
                <p className="text-sm text-green-600 dark:text-green-400 mt-1">↑ 2.1% from last term</p>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl">
                <p className="text-sm text-gray-500 dark:text-gray-400">Assignments Graded</p>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-2">36/48</p>
                <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">75% complete</p>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-xl">
                <p className="text-sm text-gray-500 dark:text-gray-400">Top Performing Class</p>
                <p className="text-3xl font-bold text-purple-600 dark:text-purple-400 mt-2">Calculus BC</p>
                <p className="text-sm text-purple-600 dark:text-purple-400 mt-1">88.5% average</p>
              </div>
            </div>
            
            {/* Grade Entry Table */}
            <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Class
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Assignment
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Grade
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Percentage
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {mockGrades.map((grade) => (
                    <tr key={grade.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                            {grade.student.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">{grade.student}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">{grade.class}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">{grade.assignment}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Submitted: {grade.submitted}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          grade.grade === 'A' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300' :
                          grade.grade.startsWith('B') ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300' :
                          'bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-300'
                        }`}>
                          {grade.grade}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">{grade.percentage}%</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-[#7B1112] dark:text-[#FFB302] hover:text-[#8B2122] dark:hover:text-[#FFC432] mr-3">
                          Edit
                        </button>
                        <button className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200">
                          Add Feedback
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Bulk Grade Entry */}
            <div className="mt-8 p-6 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Bulk Grade Entry</h3>
              <div className="flex items-center space-x-4">
                <select className="px-4 py-2 border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
                  <option>Select Assignment</option>
                  {mockAssignments.map(a => (
                    <option key={a.id} value={a.id}>{a.title}</option>
                  ))}
                </select>
                <input
                  type="file"
                  className="px-4 py-2 border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
                  accept=".csv,.xlsx"
                />
                <button className="px-6 py-2 bg-[#7B1112] text-white rounded-lg hover:bg-[#8B2122] transition-colors">
                  Upload Grades
                </button>
                <button className="px-6 py-2 border dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  Download Template
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // Messages Section
  const MessagesSection = () => {
    const [activeChatType, setActiveChatType] = useState('all');

    const filteredContacts = activeChatType === 'all' 
      ? chatContacts 
      : chatContacts.filter(contact => contact.type === activeChatType);

    return (
      <div className="space-y-8 p-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-100 dark:border-gray-700">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Messages</h2>
              <p className="text-gray-500 dark:text-gray-400 mt-2">Communicate with students, parents, and staff</p>
            </div>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search messages..."
                  className="pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7B1112]"
                />
              </div>
              <button className="px-6 py-2 bg-[#7B1112] text-white rounded-lg hover:bg-[#8B2122] transition-colors flex items-center">
                <Send size={20} className="mr-2" />
                New Message
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
                      ? 'bg-[#7B1112] text-white' 
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setActiveChatType('student')}
                  className={`px-4 py-2 rounded-lg whitespace-nowrap ${
                    activeChatType === 'student' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  Students
                </button>
                <button
                  onClick={() => setActiveChatType('parent')}
                  className={`px-4 py-2 rounded-lg whitespace-nowrap ${
                    activeChatType === 'parent' 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  Parents
                </button>
                <button
                  onClick={() => setActiveChatType('teacher')}
                  className={`px-4 py-2 rounded-lg whitespace-nowrap ${
                    activeChatType === 'teacher' 
                      ? 'bg-purple-500 text-white' 
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  Teachers
                </button>
                <button
                  onClick={() => setActiveChatType('admin')}
                  className={`px-4 py-2 rounded-lg whitespace-nowrap ${
                    activeChatType === 'admin' 
                      ? 'bg-amber-500 text-white' 
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  Admin
                </button>
              </div>
              
              {/* Contacts List */}
              <div className="space-y-3">
                {filteredContacts.map((contact) => (
                  <button
                    key={contact.id}
                    onClick={() => {
                      setSelectedChat(contact);
                      setChatActive(true);
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
                          contact.type === 'parent' ? 'bg-blue-500' :
                          contact.type === 'student' ? 'bg-green-500' :
                          contact.type === 'teacher' ? 'bg-purple-500' :
                          'bg-amber-500'
                        } text-white`}>
                          {contact.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                          <p className="font-medium">{contact.name}</p>
                          <p className="text-sm opacity-75">
                            {contact.type === 'parent' ? `Parent of ${contact.student}` :
                             contact.type === 'student' ? `Student - ${contact.class}` :
                             contact.type === 'teacher' ? `Teacher - ${contact.subject}` :
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
                        selectedChat.type === 'parent' ? 'bg-blue-500' :
                        selectedChat.type === 'student' ? 'bg-green-500' :
                        selectedChat.type === 'teacher' ? 'bg-purple-500' :
                        'bg-amber-500'
                      } text-white`}>
                        {userName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">{selectedChat.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {selectedChat.type === 'parent' ? `Parent of ${selectedChat.student}` :
                           selectedChat.type === 'student' ? `Student - ${selectedChat.class}` :
                           selectedChat.type === 'teacher' ? `Teacher - ${selectedChat.subject}` :
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
                    {/* Sample messages */}
                    <div className="flex justify-start">
                      <div className="max-w-[70%] bg-gray-100 dark:bg-gray-700 rounded-2xl rounded-tl-none p-4">
                        <p className="text-gray-900 dark:text-white">Hello, I have a question about the upcoming assignment deadline.</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">10:15 AM</p>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <div className="max-w-[70%] bg-gradient-to-r from-[#7B1112] to-[#9B3132] text-white rounded-2xl rounded-tr-none p-4">
                        <p>Sure! The deadline is this Friday at 11:59 PM. Let me know if you need an extension.</p>
                        <p className="text-xs text-gray-200 opacity-75 mt-2">10:16 AM</p>
                      </div>
                    </div>
                    <div className="flex justify-start">
                      <div className="max-w-[70%] bg-gray-100 dark:bg-gray-700 rounded-2xl rounded-tl-none p-4">
                        <p className="text-gray-900 dark:text-white">Thank you! I'll submit it by tomorrow.</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">10:17 AM</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Message Input */}
                  <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        placeholder="Type your message here..."
                        className="flex-1 px-4 py-3 border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-[#7B1112]"
                      />
                      <button 
                        onClick={() => {
                          // Send message logic
                          setMessageInput('');
                        }}
                        className="px-6 py-3 bg-gradient-to-r from-[#7B1112] to-[#9B3132] text-white rounded-lg hover:opacity-90 transition-opacity"
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
                  <button 
                    onClick={() => {/* Open new message modal */}}
                    className="mt-6 px-6 py-2 bg-gradient-to-r from-[#7B1112] to-[#9B3132] text-white rounded-lg hover:opacity-90 transition-opacity"
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

  // Profile Section
  const ProfileSection = () => (
    <div className="space-y-8 p-6">
      <div className="bg-gradient-to-r from-gray-900 to-[#7B1112] rounded-2xl p-8 text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold">Teacher Profile</h2>
            <p className="text-gray-200 mt-2">Manage your professional information</p>
          </div>
          <button 
            onClick={() => {/* Open edit modal */}}
            className="mt-4 md:mt-0 flex items-center px-6 py-3 bg-white/20 hover:bg-white/30 rounded-xl transition-all"
          >
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
                          <CheckCircle size={20} className="text-white" />
                        </div>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white text-center">{userName}</h3>
                      <p className="text-gray-600 dark:text-gray-300 mt-1 text-center">{userEmail}</p>
                      <div className="mt-4 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-sm font-medium">
                        <CheckCircle size={16} className="inline mr-2" />
                        Verified Teacher
                      </div>
                    </div>
                  </div>
                  
                  <div className="md:w-2/3 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Teacher ID</label>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">{userData?.teacher_id || "TEACH-2023-001"}</p>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Department</label>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">{userData?.department || "Mathematics & Sciences"}</p>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Phone Number</label>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">{userData?.phone || "+1 (555) 123-4567"}</p>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Years of Experience</label>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">{userData?.experience || "5"}</p>
                      </div>
                    </div>
                    
                    <div className="pt-6 border-t dark:border-gray-700">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Subjects & Classes</h4>
                      <div className="flex flex-wrap gap-2">
                        {mockClasses.map((classItem) => (
                          <span key={classItem.id} className="px-3 py-2 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 text-blue-700 dark:text-blue-300 rounded-lg">
                            {classItem.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Teaching Schedule */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Teaching Schedule</h3>
              <div className="space-y-4">
                {mockClasses.map((classItem) => (
                  <div key={classItem.id} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">{classItem.name}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{classItem.code} • {classItem.section}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900 dark:text-white">{classItem.schedule}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{classItem.studentCount} students</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Teaching Overview</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <span className="text-gray-700 dark:text-gray-300">Total Students</span>
                  <span className="font-bold text-2xl text-blue-600 dark:text-blue-400">85</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <span className="text-gray-700 dark:text-gray-300">Active Classes</span>
                  <span className="font-bold text-2xl text-green-600 dark:text-green-400">3</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <span className="text-gray-700 dark:text-gray-300">Avg. Class Score</span>
                  <span className="font-bold text-2xl text-purple-600 dark:text-purple-400">84.2%</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                  <span className="text-gray-700 dark:text-gray-300">Pending Grading</span>
                  <span className="font-bold text-2xl text-amber-600 dark:text-amber-400">12</span>
                </div>
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h4>
              <div className="space-y-3">
                <button 
                  onClick={() => setActiveTab("assignments")}
                  className="w-full flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <span className="text-gray-700 dark:text-gray-300">Create Assignment</span>
                  <PenTool size={16} className="text-gray-400" />
                </button>
                <button 
                  onClick={() => setActiveTab("quizzes")}
                  className="w-full flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <span className="text-gray-700 dark:text-gray-300">Create Quiz</span>
                  <FileQuestion size={16} className="text-gray-400" />
                </button>
                <button 
                  onClick={() => setActiveTab("messages")}
                  className="w-full flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <span className="text-gray-700 dark:text-gray-300">Message Students</span>
                  <MessageSquare size={16} className="text-gray-400" />
                </button>
                <button 
                  onClick={() => setActiveTab("announcements")}
                  className="w-full flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <span className="text-gray-700 dark:text-gray-300">Post Announcement</span>
                  <Bell size={16} className="text-gray-400" />
                </button>
              </div>
            </div>
            
            {/* Support */}
            <div className="bg-gradient-to-r from-[#7B1112] to-[#9B3132] rounded-2xl p-6 text-white">
              <h4 className="font-semibold mb-4">Teacher Support</h4>
              <p className="text-gray-200 text-sm mb-4">Need assistance with teaching tools?</p>
              <button className="w-full py-3 bg-white/20 hover:bg-white/30 rounded-lg transition-colors">
                Contact Tech Support
              </button>
              <button className="w-full mt-3 py-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
                Teaching Resources
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Settings Section (similar to parents but teacher-focused)
  const SettingsSection = () => (
    <div className="space-y-8 p-6">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-100 dark:border-gray-700">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Teacher Settings</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8">Manage your teaching preferences and notifications</p>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Teaching Preferences */}
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Teaching Preferences</h3>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Default Assignment Deadline Time</label>
                    <select className="w-full px-4 py-3 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-[#7B1112]">
                      <option>11:59 PM</option>
                      <option>5:00 PM</option>
                      <option>12:00 PM</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Grading Scale</label>
                    <select className="w-full px-4 py-3 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-[#7B1112]">
                      <option>Letter Grades (A-F)</option>
                      <option>Percentage (0-100%)</option>
                      <option>Points Based</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Office Hours</label>
                  <textarea
                    className="w-full px-4 py-3 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-[#7B1112] focus:border-transparent transition-all"
                    rows={3}
                    placeholder="Enter your office hours schedule..."
                    defaultValue="Monday: 2:00 PM - 4:00 PM
Wednesday: 10:00 AM - 12:00 PM
Friday: 1:00 PM - 3:00 PM"
                  />
                </div>
              </div>
            </div>

            {/* Notification Settings */}
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Notification Preferences</h3>
              <div className="space-y-4">
                {[
                  { label: "Assignment Submissions", description: "Notify when students submit assignments", checked: true },
                  { label: "Late Submissions", description: "Alert for late submissions", checked: true },
                  { label: "Parent Messages", description: "Messages from parents", checked: true },
                  { label: "Student Questions", description: "Questions from students", checked: true },
                  { label: "Grade Appeals", description: "Student grade appeals", checked: true },
                  { label: "Department Announcements", description: "Department-wide updates", checked: false },
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
            {/* Security Card */}
            <div className="bg-gradient-to-br from-gray-900 to-[#7B1112] rounded-2xl p-6 text-white">
              <Shield size={32} className="mb-4" />
              <h4 className="font-semibold text-xl mb-2">Security</h4>
              <p className="text-gray-200 text-sm mb-6">Manage your account security</p>
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
                  Data Export
                </button>
              </div>
            </div>
            
            {/* Teaching Resources */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Teaching Resources</h4>
              <button className="w-full text-left p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <BookOpen size={16} className="inline mr-2" />
                Curriculum Materials
              </button>
              <button className="w-full text-left p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <Users size={16} className="inline mr-2" />
                Professional Development
              </button>
              <button className="w-full text-left p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <FileBarChart size={16} className="inline mr-2" />
                Assessment Tools
              </button>
              <button className="w-full text-left p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <HelpCircle size={16} className="inline mr-2" />
                Teaching Guides
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Portal Navigation - Updated for Teachers
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
      title: "Assignments",
      icon: <PenTool />,
      action: () => setActiveTab("assignments")
    },
    {
      title: "Quizzes",
      icon: <FileQuestion />,
      action: () => setActiveTab("quizzes")
    },
    {
      title: "Grades",
      icon: <Grade />,
      action: () => setActiveTab("grades")
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
      case "announcements":
        return <AnnouncementsSection />;
      case "assignments":
        return <AssignmentsSection />;
      case "quizzes":
        return <QuizzesSection />;
      case "grades":
        return <GradesSection />;
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {Array(4).fill(0).map((_, i) => (
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
                      5
                    </span>
                  )}
                  {feature.title === "Assignments" && (
                    <span className="ml-auto bg-amber-500 text-white text-xs px-2 py-1 rounded-full">
                      3
                    </span>
                  )}
                </button>
              ))}
              
              {/* Classes Quick View */}
              <div className="mt-8 p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">My Classes</p>
                <div className="space-y-3">
                  {mockClasses.map((classItem) => (
                    <div key={classItem.id} className="flex items-center space-x-3 p-2 hover:bg-white/50 dark:hover:bg-gray-700/50 rounded-lg cursor-pointer"
                      onClick={() => {
                        setSelectedClass(classItem.name);
                        setActiveTab("assignments");
                      }}>
                      <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${classItem.color} flex items-center justify-center text-xs text-white`}>
                        {classItem.code.split('-')[0][0]}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{classItem.name.split(' ')[0]}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{classItem.studentCount} students</p>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-3 text-sm text-[#7B1112] dark:text-[#FFB302] hover:underline text-center">
                  + Create Class
                </button>
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

export default TeachersPortal;