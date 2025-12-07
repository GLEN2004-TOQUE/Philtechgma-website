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
  CalendarDays, MessageCircle, BookText, School, Heart
} from "lucide-react";
import { supabase } from '../supabaseclient';

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

// Mock data for Parents Portal
const mockChildren = [
  { 
    id: 1, 
    name: "Sarah Johnson", 
    grade: "Grade 11", 
    section: "STEM-A", 
    avatar: "SJ",
    gpa: 3.8,
    attendance: 95,
    pendingAssignments: 3,
    color: "from-blue-500 to-cyan-500",
    school: "City High School",
    advisor: "Mr. Anderson"
  },
  { 
    id: 2, 
    name: "Michael Johnson", 
    grade: "Grade 9", 
    section: "Arts-B", 
    avatar: "MJ",
    gpa: 3.5,
    attendance: 88,
    pendingAssignments: 5,
    color: "from-purple-500 to-pink-500",
    school: "City High School",
    advisor: "Ms. Rodriguez"
  },
];

const mockAnnouncements = [
  { 
    id: 1, 
    title: "Parent-Teacher Conference", 
    content: "Scheduled for Friday, 3:00 PM in the main auditorium...", 
    date: "Today, 9:00 AM", 
    priority: "high",
    sender: "Principal's Office"
  },
  { 
    id: 2, 
    title: "School Holiday Notice", 
    content: "School will be closed next Monday for professional development...", 
    date: "Yesterday", 
    priority: "medium",
    sender: "Administration"
  },
  { 
    id: 3, 
    title: "Science Fair Registration", 
    content: "Registration for the annual science fair is now open...", 
    date: "2 days ago", 
    priority: "low",
    sender: "Science Department"
  },
];

const mockGrades = [
  { 
    id: 1, 
    child: "Sarah Johnson",
    subject: "Mathematics", 
    grade: "A", 
    percentage: 92,
    progress: "+5%",
    teacher: "Mr. Davis",
    lastUpdated: "1 week ago"
  },
  { 
    id: 2, 
    child: "Sarah Johnson",
    subject: "Physics", 
    grade: "B+", 
    percentage: 87,
    progress: "+2%",
    teacher: "Ms. Thompson",
    lastUpdated: "3 days ago"
  },
  { 
    id: 3, 
    child: "Michael Johnson",
    subject: "English", 
    grade: "A-", 
    percentage: 90,
    progress: "+3%",
    teacher: "Mrs. Wilson",
    lastUpdated: "2 weeks ago"
  },
  { 
    id: 4, 
    child: "Michael Johnson",
    subject: "History", 
    grade: "B", 
    percentage: 84,
    progress: "-1%",
    teacher: "Mr. Brown",
    lastUpdated: "5 days ago"
  },
];

const mockAttendance = [
  {
    id: 1,
    child: "Sarah Johnson",
    date: "2024-03-15",
    status: "present",
    period: "Full Day",
    teacher: "Mr. Davis",
    subject: "Mathematics"
  },
  {
    id: 2,
    child: "Sarah Johnson",
    date: "2024-03-14",
    status: "absent",
    period: "Morning",
    reason: "Medical Appointment",
    subject: "Physics"
  },
  {
    id: 3,
    child: "Michael Johnson",
    date: "2024-03-15",
    status: "late",
    period: "1st Period",
    teacher: "Mrs. Wilson",
    subject: "English"
  },
  {
    id: 4,
    child: "Michael Johnson",
    date: "2024-03-13",
    status: "present",
    period: "Full Day",
    teacher: "Mr. Brown",
    subject: "History"
  },
];

const teacherContacts = [
  {
    id: 1,
    name: "Mr. Davis",
    subject: "Mathematics",
    email: "davis@school.edu",
    phone: "(555) 123-4567",
    availability: "Mon-Fri, 2-4 PM",
    children: ["Sarah Johnson"]
  },
  {
    id: 2,
    name: "Ms. Thompson",
    subject: "Physics",
    email: "thompson@school.edu",
    phone: "(555) 234-5678",
    availability: "Tue-Thu, 3-5 PM",
    children: ["Sarah Johnson"]
  },
  {
    id: 3,
    name: "Mrs. Wilson",
    subject: "English",
    email: "wilson@school.edu",
    phone: "(555) 345-6789",
    availability: "Mon-Wed, 1-3 PM",
    children: ["Michael Johnson"]
  },
  {
    id: 4,
    name: "Mr. Brown",
    subject: "History",
    email: "brown@school.edu",
    phone: "(555) 456-7890",
    availability: "Thu-Fri, 9-11 AM",
    children: ["Michael Johnson"]
  },
];

const statsData = [
  { label: "Children Enrolled", value: "2", change: "+0", icon: <Family />, color: "text-blue-500", bgColor: "bg-blue-500/10" },
  { label: "Average GPA", value: "3.65", change: "+0.1", icon: <TrendingUp />, color: "text-green-500", bgColor: "bg-green-500/10" },
  { label: "Attendance Rate", value: "91.5%", change: "+2.3%", icon: <CheckCircle />, color: "text-amber-500", bgColor: "bg-amber-500/10" },
  { label: "Pending Meetings", value: "3", change: "-1", icon: <CalendarDays />, color: "text-purple-500", bgColor: "bg-purple-500/10" },
];

const ParentsPortal: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications] = useState(3);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [selectedChild, setSelectedChild] = useState<string>("all");

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
            setUserName(profileData.full_name || user.email?.split('@')[0] || "Parent");
          } else {
            setUserName(user.user_metadata?.full_name || user.email?.split('@')[0] || "Parent");
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

  // Filter data based on selected child
  const filteredGrades = selectedChild === "all" 
    ? mockGrades 
    : mockGrades.filter(grade => grade.child === selectedChild);
  
  const filteredAttendance = selectedChild === "all"
    ? mockAttendance
    : mockAttendance.filter(record => record.child === selectedChild);

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
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Parents Portal</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Stay Connected, Stay Informed</p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Search Bar */}
            <div className="hidden md:block relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search announcements, grades..."
                className="pl-10 pr-4 py-2 w-64 bg-gray-100 dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7B1112] dark:focus:ring-[#FFB302]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

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
                  {userName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{userName}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Parent/Gaurdian</p>
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

  // Child Selector Component
  const ChildSelector = () => (
    <div className="flex items-center space-x-4 mb-6">
      <button
        onClick={() => setSelectedChild("all")}
        className={`px-4 py-2 rounded-lg transition-all ${selectedChild === "all" 
          ? "bg-gradient-to-r from-[#7B1112] to-[#FFB302] text-white" 
          : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"}`}
      >
        All Children
      </button>
      {mockChildren.map((child) => (
        <button
          key={child.id}
          onClick={() => setSelectedChild(child.name)}
          className={`px-4 py-2 rounded-lg transition-all flex items-center space-x-2 ${selectedChild === child.name
            ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
            : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"}`}
        >
          <div className={`w-6 h-6 rounded-full bg-gradient-to-r ${child.color} flex items-center justify-center text-xs text-white`}>
            {child.avatar}
          </div>
          <span>{child.name.split(' ')[0]}</span>
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
              <p className="text-gray-200">Stay updated with your children's academic progress.</p>
            </div>
            <div className="mt-4 md:mt-0">
              <button className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 px-6 py-3 rounded-xl transition-all">
                <UserPlus size={20} />
                <span>Add Another Child</span>
              </button>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm">
            <span className="flex items-center px-3 py-1 bg-white/10 rounded-full">
              <Family size={16} className="mr-2" />
              {mockChildren.length} Children Enrolled
            </span>
            <span className="flex items-center px-3 py-1 bg-white/10 rounded-full">
              <School size={16} className="mr-2" />
              City High School
            </span>
            <span className="flex items-center px-3 py-1 bg-white/10 rounded-full">
              <Heart size={16} className="mr-2" />
              Parent Association Member
            </span>
          </div>
        </div>
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-gradient-to-br from-[#FFB302]/20 to-transparent rounded-full"></div>
        <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-gradient-to-tr from-[#FFB302]/10 to-transparent rounded-full"></div>
      </div>

      {/* Child Selector */}
      <ChildSelector />

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
        {/* Left Column - Announcements & Grades */}
        <div className="lg:col-span-2 space-y-8">
          {/* Announcements Section */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">School Announcements</h2>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Important updates from school</p>
              </div>
              <button className="text-[#7B1112] dark:text-[#FFB302] font-medium hover:underline">
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
                            <span>From: {announcement.sender}</span>
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

          {/* Grades Overview Section */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Academic Performance</h2>
              <p className="text-gray-500 dark:text-gray-400 mt-1">Latest grades and progress</p>
            </div>
            <div className="p-6">
              {isLoading ? (
                <div className="space-y-4">
                  {Array(3).fill(0).map((_, i) => <SkeletonCard key={i} />)}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredGrades.slice(0, 4).map((grade) => (
                    <div key={grade.id} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className={`p-3 rounded-lg ${
                          grade.grade === 'A' ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400' :
                          grade.grade.startsWith('B') ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' :
                          'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400'
                        }`}>
                          <BookText size={20} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-gray-900 dark:text-white">{grade.subject}</h4>
                            <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">{grade.child}</span>
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{grade.teacher} • Updated {grade.lastUpdated}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold text-gray-900 dark:text-white">{grade.grade}</span>
                          <span className={`text-sm font-medium ${grade.progress.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                            {grade.progress}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{grade.percentage}%</p>
                      </div>
                    </div>
                  ))}
                  <button 
                    onClick={() => setActiveTab("grades")}
                    className="w-full py-3 text-center text-[#7B1112] dark:text-[#FFB302] font-medium hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    View All Grades →
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Children Overview */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">My Children</h2>
              <p className="text-gray-500 dark:text-gray-400 mt-1">Academic overview</p>
            </div>
            <div className="p-6">
              {isLoading ? (
                <div className="space-y-4">
                  {Array(2).fill(0).map((_, i) => <SkeletonCard key={i} />)}
                </div>
              ) : (
                <div className="space-y-4">
                  {mockChildren.map((child) => (
                    <div key={child.id} className="p-4 rounded-xl border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all">
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${child.color} flex items-center justify-center text-white font-bold`}>
                          {child.avatar}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 dark:text-white">{child.name}</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{child.grade} • {child.section}</p>
                        </div>
                      </div>
                      <div className="mt-4 grid grid-cols-3 gap-4">
                        <div className="text-center">
                          <p className="text-sm text-gray-500 dark:text-gray-400">GPA</p>
                          <p className="font-bold text-gray-900 dark:text-white">{child.gpa}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-500 dark:text-gray-400">Attendance</p>
                          <p className="font-bold text-green-600 dark:text-green-400">{child.attendance}%</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-500 dark:text-gray-400">Pending</p>
                          <p className="font-bold text-amber-600 dark:text-amber-400">{child.pendingAssignments}</p>
                        </div>
                      </div>
                      <button className="mt-4 w-full py-2 text-sm font-medium text-[#7B1112] dark:text-[#FFB302] hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                        View Details →
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick Teacher Contact */}
          <div className="bg-gradient-to-br from-[#7B1112] to-[#9B3132] rounded-2xl p-6 text-white">
            <h2 className="text-xl font-bold mb-6">Contact Teachers</h2>
            <div className="space-y-3">
              {teacherContacts.slice(0, 3).map((teacher) => (
                <button 
                  key={teacher.id}
                  onClick={() => setActiveTab("messages")}
                  className="w-full text-left p-4 bg-white/10 hover:bg-white/20 rounded-xl transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{teacher.name}</p>
                      <p className="text-sm text-gray-200/80 mt-1">{teacher.subject}</p>
                    </div>
                    <MessageCircle size={20} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              ))}
              <button 
                onClick={() => setActiveTab("messages")}
                className="w-full mt-4 py-3 text-center bg-white/20 hover:bg-white/30 rounded-xl transition-all"
              >
                View All Teachers →
              </button>
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Upcoming Events</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Parent-Teacher Conference</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Mar 22, 2024 • 3:00 PM</p>
                </div>
                <div className="px-3 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 text-sm rounded-full">
                  1 week
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Science Fair</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Apr 5, 2024 • 10:00 AM</p>
                </div>
                <div className="px-3 py-1 bg-purple-100 dark:bg-purple-800 text-purple-800 dark:text-purple-200 text-sm rounded-full">
                  3 weeks
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Spring Concert</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Apr 12, 2024 • 6:00 PM</p>
                </div>
                <div className="px-3 py-1 bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 text-sm rounded-full">
                  4 weeks
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Grades Section
  const GradesSection = () => (
    <div className="space-y-8 p-6">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-100 dark:border-gray-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Academic Performance</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Detailed grades and progress reports</p>
          </div>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search subjects..."
                className="pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7B1112]"
              />
            </div>
            <button className="px-6 py-2 bg-[#7B1112] text-white rounded-lg hover:bg-[#8B2122] transition-colors flex items-center">
              <Download size={20} className="mr-2" />
              Export Report
            </button>
          </div>
        </div>
        
        <ChildSelector />
        
        {isLoading ? (
          <div className="space-y-4">
            {Array(5).fill(0).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <div className="space-y-6">
            {filteredGrades.map((grade) => (
              <div key={grade.id} className="group p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-[#7B1112] dark:hover:border-[#FFB302] hover:shadow-lg transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`p-4 rounded-xl ${
                      grade.grade === 'A' ? 'bg-green-50 dark:bg-green-900/20' :
                      grade.grade.startsWith('B') ? 'bg-blue-50 dark:bg-blue-900/20' :
                      'bg-amber-50 dark:bg-amber-900/20'
                    }`}>
                      <BookText size={24} className={
                        grade.grade === 'A' ? 'text-green-600 dark:text-green-400' :
                        grade.grade.startsWith('B') ? 'text-blue-600 dark:text-blue-400' :
                        'text-amber-600 dark:text-amber-400'
                      } />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-gray-900 dark:text-white">{grade.subject}</h3>
                        <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-full">
                          {grade.child}
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300">Teacher: {grade.teacher} • Last Updated: {grade.lastUpdated}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center justify-end gap-3">
                      <div className={`text-4xl font-bold ${
                        grade.grade === 'A' ? 'text-green-600 dark:text-green-400' :
                        grade.grade.startsWith('B') ? 'text-blue-600 dark:text-blue-400' :
                        'text-amber-600 dark:text-amber-400'
                      }`}>
                        {grade.grade}
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{grade.percentage}%</p>
                        <p className={`text-sm font-medium ${grade.progress.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                          {grade.progress} from last term
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t dark:border-gray-700">
                  <div className="flex items-center space-x-4">
                    <button className="text-sm text-[#7B1112] dark:text-[#FFB302] hover:underline">
                      View Detailed Report
                    </button>
                    <button className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                      Contact Teacher
                    </button>
                    <button className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                      Compare with Class Average
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

  // Attendance Section
  const AttendanceSection = () => (
    <div className="space-y-8 p-6">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-100 dark:border-gray-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Attendance Records</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Track your children's attendance</p>
          </div>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <select className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7B1112]">
              <option>This Month</option>
              <option>Last Month</option>
              <option>This Term</option>
            </select>
            <button className="px-6 py-2 bg-[#7B1112] text-white rounded-lg hover:bg-[#8B2122] transition-colors">
              Generate Report
            </button>
          </div>
        </div>
        
        <ChildSelector />
        
        {isLoading ? (
          <div className="space-y-4">
            {Array(5).fill(0).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-xl">
                <p className="text-sm text-gray-500 dark:text-gray-400">Overall Attendance Rate</p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">91.5%</p>
                <p className="text-sm text-green-600 dark:text-green-400 mt-1">↑ 2.3% from last month</p>
              </div>
              <div className="bg-amber-50 dark:bg-amber-900/20 p-6 rounded-xl">
                <p className="text-sm text-gray-500 dark:text-gray-400">Days Absent</p>
                <p className="text-3xl font-bold text-amber-600 dark:text-amber-400 mt-2">3</p>
                <p className="text-sm text-amber-600 dark:text-amber-400 mt-1">↓ 1 from last month</p>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl">
                <p className="text-sm text-gray-500 dark:text-gray-400">Late Arrivals</p>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-2">2</p>
                <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">No change</p>
              </div>
            </div>
            
            <div className="space-y-4">
              {filteredAttendance.map((record) => (
                <div key={record.id} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-lg ${
                      record.status === 'present' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' :
                      record.status === 'absent' ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' :
                      'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
                    }`}>
                      {record.status === 'present' ? <CheckCircle size={20} /> :
                       record.status === 'absent' ? <X size={20} /> :
                       <Clock size={20} />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-gray-900 dark:text-white">{record.date}</h4>
                        <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">{record.child}</span>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {record.subject} • {record.teacher} • {record.period}
                      </p>
                      {record.reason && (
                        <p className="text-sm text-amber-600 dark:text-amber-400 mt-1">
                          Reason: {record.reason}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    record.status === 'present' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' :
                    record.status === 'absent' ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300' :
                    'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300'
                  }`}>
                    {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // Messages Section (Teacher Communication)
  const MessagesSection = () => (
    <div className="space-y-8 p-6">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-100 dark:border-gray-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Teacher Communication</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Message your children's teachers</p>
          </div>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search teachers..."
                className="pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7B1112]"
              />
            </div>
            <button className="px-6 py-2 bg-[#7B1112] text-white rounded-lg hover:bg-[#8B2122] transition-colors flex items-center">
              <MessageSquare size={20} className="mr-2" />
              New Message
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Teacher Directory */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Teacher Directory</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {teacherContacts.map((teacher) => (
                <div key={teacher.id} className="p-6 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-[#7B1112] dark:hover:border-[#FFB302] transition-colors">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold">
                      {teacher.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 dark:text-white">{teacher.name}</h4>
                      <p className="text-gray-600 dark:text-gray-300">{teacher.subject}</p>
                      <div className="mt-4 space-y-2">
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <Mail size={16} className="mr-2" />
                          {teacher.email}
                        </div>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <Phone size={16} className="mr-2" />
                          {teacher.phone}
                        </div>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <Clock size={16} className="mr-2" />
                          {teacher.availability}
                        </div>
                      </div>
                      <div className="mt-4 flex items-center space-x-2">
                        <button className="px-4 py-2 text-sm bg-[#7B1112] text-white rounded-lg hover:bg-[#8B2122] transition-colors">
                          Send Message
                        </button>
                        <button className="px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                          Schedule Call
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Message History */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Messages</h3>
            <div className="space-y-4">
              {mockAnnouncements.slice(0, 3).map((announcement) => (
                <div key={announcement.id} className="p-4 rounded-xl border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900 dark:text-white">{announcement.sender}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{announcement.date}</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{announcement.content}</p>
                  <button className="mt-3 text-sm text-[#7B1112] dark:text-[#FFB302] hover:underline">
                    Reply →
                  </button>
                </div>
              ))}
            </div>
            
            {/* Quick Message Form */}
            <div className="p-6 bg-gradient-to-r from-[#7B1112] to-[#9B3132] rounded-xl text-white">
              <h4 className="font-semibold mb-4">Send Quick Message</h4>
              <select className="w-full mb-4 px-4 py-2 bg-white/20 rounded-lg text-white placeholder-white/70">
                <option value="">Select Teacher</option>
                {teacherContacts.map(teacher => (
                  <option key={teacher.id} value={teacher.id}>{teacher.name}</option>
                ))}
              </select>
              <textarea 
                className="w-full mb-4 px-4 py-2 bg-white/20 rounded-lg text-white placeholder-white/70"
                rows={3}
                placeholder="Type your message here..."
              />
              <button className="w-full py-3 bg-white/20 hover:bg-white/30 rounded-lg transition-colors">
                Send Message
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Profile Section
  const ProfileSection = () => (
    <div className="space-y-8 p-6">
      <div className="bg-gradient-to-r from-gray-900 to-[#7B1112] rounded-2xl p-8 text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold">Parent Profile</h2>
            <p className="text-gray-200 mt-2">Manage your family information</p>
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
                          <CheckCircle size={20} className="text-white" />
                        </div>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white text-center">{userName}</h3>
                      <p className="text-gray-600 dark:text-gray-300 mt-1 text-center">{userEmail}</p>
                      <div className="mt-4 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-sm font-medium">
                        <CheckCircle size={16} className="inline mr-2" />
                        Verified Parent
                      </div>
                    </div>
                  </div>
                  
                  <div className="md:w-2/3 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Parent ID</label>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">{userData?.parent_id || "PAR-2023-001"}</p>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Relationship</label>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">{userData?.relationship || "Parent"}</p>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Phone Number</label>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">{userData?.phone || "+1 (555) 123-4567"}</p>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Emergency Contact</label>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">{userData?.emergency_contact || "+1 (555) 987-6543"}</p>
                      </div>
                    </div>
                    
                    <div className="pt-6 border-t dark:border-gray-700">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Address Information</h4>
                      <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                        <div className="flex items-center">
                          <MapPin className="h-5 w-5 text-gray-400 mr-4" />
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Home Address</p>
                            <p className="font-medium text-gray-900 dark:text-white">{userData?.address || "123 College Ave, University City, ST 12345"}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Children Information */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Children Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {mockChildren.map((child) => (
                  <div key={child.id} className="p-6 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${child.color} flex items-center justify-center text-white font-bold text-xl`}>
                        {child.avatar}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 dark:text-white">{child.name}</h4>
                        <p className="text-gray-600 dark:text-gray-300">{child.grade} • {child.section}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{child.school}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Advisor</p>
                        <p className="font-medium text-gray-900 dark:text-white">{child.advisor}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Student ID</p>
                        <p className="font-medium text-gray-900 dark:text-white">STU-{20230000 + child.id}</p>
                      </div>
                    </div>
                    <button className="mt-4 w-full py-2 text-sm font-medium text-[#7B1112] dark:text-[#FFB302] hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                      View Academic Details →
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Family Overview</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <span className="text-gray-700 dark:text-gray-300">Children Enrolled</span>
                  <span className="font-bold text-2xl text-blue-600 dark:text-blue-400">{mockChildren.length}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <span className="text-gray-700 dark:text-gray-300">Avg. GPA</span>
                  <span className="font-bold text-2xl text-green-600 dark:text-green-400">3.65</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <span className="text-gray-700 dark:text-gray-300">Attendance Rate</span>
                  <span className="font-bold text-2xl text-purple-600 dark:text-purple-400">91.5%</span>
                </div>
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h4>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  <span className="text-gray-700 dark:text-gray-300">Add Another Child</span>
                  <UserPlus size={16} className="text-gray-400" />
                </button>
                <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  <span className="text-gray-700 dark:text-gray-300">Download Report Cards</span>
                  <Download size={16} className="text-gray-400" />
                </button>
                <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  <span className="text-gray-700 dark:text-gray-300">Schedule Parent Meeting</span>
                  <Calendar size={16} className="text-gray-400" />
                </button>
                <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  <span className="text-gray-700 dark:text-gray-300">Update Contact Info</span>
                  <Edit size={16} className="text-gray-400" />
                </button>
              </div>
            </div>
            
            {/* Support */}
            <div className="bg-gradient-to-r from-[#7B1112] to-[#9B3132] rounded-2xl p-6 text-white">
              <h4 className="font-semibold mb-4">Need Help?</h4>
              <p className="text-gray-200 text-sm mb-4">Contact our parent support team</p>
              <button className="w-full py-3 bg-white/20 hover:bg-white/30 rounded-lg transition-colors">
                Contact Parent Coordinator
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Settings Section
  const SettingsSection = () => (
    <div className="space-y-8 p-6">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-100 dark:border-gray-700">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Parent Settings</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8">Manage your account preferences and notifications</p>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Family Settings */}
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Family Information</h3>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Primary Contact Name</label>
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
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Emergency Contacts</label>
                  <textarea
                    className="w-full px-4 py-3 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-[#7B1112] focus:border-transparent transition-all"
                    rows={3}
                    placeholder="List emergency contacts with phone numbers..."
                    defaultValue="John Doe (Spouse): +1 (555) 987-6543\nJane Smith (Grandparent): +1 (555) 456-7890"
                  />
                </div>
              </div>
            </div>

            {/* Notification Settings */}
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Notification Preferences</h3>
              <div className="space-y-4">
                {[
                  { label: "Grade Updates", description: "Notify when new grades are posted", checked: true },
                  { label: "Attendance Alerts", description: "Alert for absences or tardiness", checked: true },
                  { label: "School Announcements", description: "Important school-wide updates", checked: true },
                  { label: "Teacher Messages", description: "Messages from teachers", checked: true },
                  { label: "Event Reminders", description: "Upcoming school events", checked: false },
                  { label: "Payment Reminders", description: "Tuition and fee reminders", checked: false },
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
                  Manage Authorized Pickups
                </button>
                <button className="w-full text-left p-4 bg-white/10 hover:bg-white/20 rounded-xl transition-colors">
                  Login History
                </button>
              </div>
            </div>
            
            {/* Danger Zone */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-red-200 dark:border-red-900/50 p-6">
              <h4 className="font-semibold text-red-600 dark:text-red-400 mb-4">Danger Zone</h4>
              <div className="space-y-3">
                <button className="w-full text-left p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors">
                  <Trash2 size={16} className="inline mr-2" />
                  Remove Child Access
                </button>
                <button 
                  onClick={handleLogout}
                  className="w-full text-left p-3 bg-red-600 text-white hover:bg-red-700 rounded-lg transition-colors"
                >
                  <LogOut size={16} className="inline mr-2" />
                  Logout from All Devices
                </button>
              </div>
            </div>
            
            {/* Support */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Parent Resources</h4>
              <button className="w-full text-left p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <HelpCircle size={16} className="inline mr-2" />
                Parent Handbook
              </button>
              <button className="w-full text-left p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <Mail size={16} className="inline mr-2" />
                Contact Parent Association
              </button>
              <button className="w-full text-left p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <Calendar size={16} className="inline mr-2" />
                School Calendar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Announcements Section
  const AnnouncementsSection = () => (
    <div className="space-y-8 p-6">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-100 dark:border-gray-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">School Announcements</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Stay updated with important school information</p>
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
            <select className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7B1112]">
              <option>All Categories</option>
              <option>Important</option>
              <option>Events</option>
              <option>Academic</option>
            </select>
          </div>
        </div>
        
        {isLoading ? (
          <div className="space-y-4">
            {Array(5).fill(0).map((_, i) => <SkeletonCard key={i} />)}
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
                        {announcement.priority === 'high' && (
                          <span className="px-2 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300 text-xs rounded-full">
                            Important
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 mt-1">From: {announcement.sender}</p>
                      <p className="text-gray-700 dark:text-gray-300 mt-3">{announcement.content}</p>
                      <div className="flex items-center space-x-4 mt-4">
                        <button className="text-sm text-[#7B1112] dark:text-[#FFB302] hover:underline">
                          Read More
                        </button>
                        <button className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                          Save for Later
                        </button>
                        <button className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                          Share with Other Parents
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

  // Portal Navigation - Updated for Parents
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
      title: "Grades",
      icon: <BookOpen />,
      action: () => setActiveTab("grades")
    },
    {
      title: "Attendance",
      icon: <CheckCircle />,
      action: () => setActiveTab("attendance")
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
      case "grades":
        return <GradesSection />;
      case "attendance":
        return <AttendanceSection />;
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
                  {feature.title === "Messages" && notifications > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      {notifications}
                    </span>
                  )}
                </button>
              ))}
              
              {/* Children Quick View */}
              <div className="mt-8 p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">My Children</p>
                <div className="space-y-3">
                  {mockChildren.map((child) => (
                    <div key={child.id} className="flex items-center space-x-3 p-2 hover:bg-white/50 dark:hover:bg-gray-700/50 rounded-lg cursor-pointer"
                      onClick={() => {
                        setSelectedChild(child.name);
                        setActiveTab("dashboard");
                      }}>
                      <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${child.color} flex items-center justify-center text-xs text-white`}>
                        {child.avatar}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{child.name.split(' ')[0]}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{child.grade}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-3 text-sm text-[#7B1112] dark:text-[#FFB302] hover:underline text-center">
                  + Add Child
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

export default ParentsPortal;