import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User, BookOpen, MessageSquare, Settings, Home,
  Edit, CheckCircle, Phone, MapPin, Globe, Calendar,
  Search, Filter, MoreVertical, Trash2, Eye, Bell,
  TrendingUp, Users, Award, Clock, ChevronRight,
  BarChart3, Download, FileText, Video, Shield,
  Mail, LogOut, Menu, X, GraduationCap, BookMarked,
  Upload, CreditCard, HelpCircle, ChevronDown,
  School, Users as UsersIcon, Library, ClipboardCheck
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

// Senior High specific mock data
const mockSubjects = [
  { id: 1, code: "MATH11", name: "General Mathematics", teacher: "Ms. Garcia", progress: 85, color: "from-blue-500 to-cyan-500", assignments: 5, nextClass: "Mon, 8:00 AM", strand: "STEM" },
  { id: 2, code: "PHYS12", name: "Physics I", teacher: "Mr. Rodriguez", progress: 70, color: "from-purple-500 to-pink-500", assignments: 3, nextClass: "Tue, 10:30 AM", strand: "STEM" },
  { id: 3, code: "ENG11", name: "Oral Communication", teacher: "Mrs. Santos", progress: 90, color: "from-green-500 to-emerald-500", assignments: 4, nextClass: "Wed, 9:00 AM", strand: "All" },
  { id: 4, code: "RES12", name: "Practical Research", teacher: "Sir Reyes", progress: 60, color: "from-amber-500 to-orange-500", assignments: 2, nextClass: "Thu, 1:00 PM", strand: "Academic" },
];

const mockMessages = [
  { id: 1, sender: "Ms. Garcia", subject: "Math Assignment Feedback", preview: "Good work on the recent problem sets...", time: "2h ago", unread: true },
  { id: 2, sender: "Guidance Office", subject: "Career Assessment Schedule", preview: "Your career assessment is scheduled for...", time: "1d ago", unread: false },
  { id: 3, sender: "Adviser", subject: "Parent-Teacher Conference", preview: "Please remind your parents about the...", time: "2d ago", unread: false },
];

const upcomingAssignments = [
  { id: 1, title: "Math Problem Set", subject: "MATH11", dueDate: "Tomorrow", priority: "high", points: 100, type: "Assignment" },
  { id: 2, title: "Research Proposal", subject: "RES12", dueDate: "In 3 days", priority: "medium", points: 150, type: "Project" },
  { id: 3, title: "Physics Lab Activity", subject: "PHYS12", dueDate: "Next Week", priority: "low", points: 75, type: "Laboratory" },
];

const statsData = [
  { label: "Current Average", value: "92%", change: "+3%", icon: <TrendingUp />, color: "text-green-500", bgColor: "bg-green-500/10" },
  { label: "Active Subjects", value: "8", change: "+0", icon: <BookOpen />, color: "text-blue-500", bgColor: "bg-blue-500/10" },
  { label: "Pending Tasks", value: "7", change: "-2", icon: <Clock />, color: "text-amber-500", bgColor: "bg-amber-500/10" },
  { label: "Absences", value: "3", change: "-1", icon: <Users />, color: "text-purple-500", bgColor: "bg-purple-500/10" },
];

const SeniorHighPortal: React.FC = () => {
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
  const [selectedStrand, setSelectedStrand] = useState("STEM");

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
            .from('seniorhigh_profiles')
            .select('*')
            .eq('id', user.id)
            .single();

          if (profileData) {
            setUserData(profileData);
            setUserName(profileData.full_name || user.email?.split('@')[0] || "Student");
            setSelectedStrand(profileData.strand || "STEM");
          } else {
            setUserName(user.user_metadata?.full_name || user.email?.split('@')[0] || "Student");
          }
        }

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
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Senior High Portal</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Student Dashboard</p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Search Bar */}
            <div className="hidden md:block relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search subjects, assignments..."
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

  // Dashboard View
  const DashboardView = () => (
    <div className="space-y-8 p-6">
      {/* Welcome Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-gray-900 to-[#7B1112] p-8 text-white">
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Welcome back, {userName}!</h1>
              <p className="text-gray-200">Here's your academic overview for today.</p>
            </div>
            <div className="mt-4 md:mt-0">
              <button className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 px-6 py-3 rounded-xl transition-all">
                <Calendar size={20} />
                <span>View Schedule</span>
              </button>
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
        {/* Left Column - Subjects & Assignments */}
        <div className="lg:col-span-2 space-y-8">
          {/* Subjects Section */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">My Subjects</h2>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Current semester progress</p>
              </div>
              <button 
                onClick={() => setActiveTab("courses")}
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {mockSubjects.map((subject) => (
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
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-600 dark:text-gray-300">Progress</span>
                            <span className="font-semibold text-gray-900 dark:text-white">{subject.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full bg-gradient-to-r ${subject.color} transition-all duration-500`}
                              style={{ width: `${subject.progress}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                          <span>📅 {subject.nextClass}</span>
                          <span>📝 {subject.assignments} tasks</span>
                        </div>
                      </div>
                      <button className="mt-4 w-full py-2 text-sm font-medium text-[#7B1112] dark:text-[#FFB302] hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                        Continue Learning →
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Assignments Section */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Upcoming Assignments</h2>
              <p className="text-gray-500 dark:text-gray-400 mt-1">Due dates approaching</p>
            </div>
            <div className="p-6">
              {isLoading ? (
                <div className="space-y-4">
                  {Array(3).fill(0).map((_, i) => <SkeletonCard key={i} />)}
                </div>
              ) : (
                <div className="space-y-3">
                  {upcomingAssignments.map((assignment) => (
                    <div key={assignment.id} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group">
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
                      <button className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-[#7B1112] to-[#FFB302] rounded-lg hover:opacity-90 transition-opacity">
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
          <div className="bg-gradient-to-br from-[#7B1112] to-[#9B3132] rounded-2xl p-6 text-white">
            <h2 className="text-xl font-bold mb-6">Quick Actions</h2>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-between p-4 bg-white/10 hover:bg-white/20 rounded-xl transition-all group">
                <span>Submit Assignment</span>
                <Upload size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="w-full flex items-center justify-between p-4 bg-white/10 hover:bg-white/20 rounded-xl transition-all group">
                <span>View Grades</span>
                <BarChart3 size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="w-full flex items-center justify-between p-4 bg-white/10 hover:bg-white/20 rounded-xl transition-all group">
                <span>Request Form 137</span>
                <FileText size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="w-full flex items-center justify-between p-4 bg-white/10 hover:bg-white/20 rounded-xl transition-all group">
                <span>Payment Center</span>
                <CreditCard size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Messages Preview */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Messages</h2>
                <button 
                  onClick={() => setActiveTab("messages")}
                  className="text-[#7B1112] dark:text-[#FFB302] text-sm font-medium hover:underline"
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
              ) : (
                <div className="space-y-4">
                  {mockMessages.map((message) => (
                    <div key={message.id} className={`p-4 rounded-xl border ${
                      message.unread 
                        ? 'border-blue-200 dark:border-blue-900/50 bg-blue-50 dark:bg-blue-900/10' 
                        : 'border-gray-100 dark:border-gray-700'
                    } hover:shadow-md transition-all cursor-pointer group`}
                    onClick={() => setActiveTab("messages")}>
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
                            <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-[#7B1112] dark:group-hover:text-[#FFB302]">
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
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Periodical Exams</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Mar 15 - 19, 2024</p>
                </div>
                <div className="px-3 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 text-sm rounded-full">
                  2 weeks
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Semestral Break</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Mar 22 - 26, 2024</p>
                </div>
                <div className="px-3 py-1 bg-purple-100 dark:bg-purple-800 text-purple-800 dark:text-purple-200 text-sm rounded-full">
                  3 weeks
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Final Exams</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">May 24 - 28, 2024</p>
                </div>
                <div className="px-3 py-1 bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 text-sm rounded-full">
                  8 weeks
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Subjects Section (renamed from CoursesSection)
  const SubjectsSection = () => (
    <div className="space-y-8 p-6">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-100 dark:border-gray-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">My Subjects</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Manage and track your subject progress</p>
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
            <div className="flex items-center space-x-2">
              <Filter size={20} className="text-gray-400" />
              <select 
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7B1112]"
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
              {mockSubjects.map((subject) => (
                <div key={subject.id} className="group relative bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                  <div className="absolute top-4 right-4">
                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                      <MoreVertical className="text-gray-400" size={20} />
                    </button>
                  </div>
                  
                  <div className="mb-6">
                    <div className={`inline-block p-3 rounded-xl bg-gradient-to-r ${subject.color} mb-4`}>
                      <BookOpen className="text-white" size={24} />
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">{subject.code}</span>
                      <span className="text-sm font-medium text-green-600 dark:text-green-400">{subject.progress}%</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{subject.name}</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">{subject.teacher}</p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                      <span>📅 {subject.nextClass}</span>
                      <span>📝 {subject.assignments} tasks</span>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600 dark:text-gray-300">Progress</span>
                        <span className="font-semibold text-gray-900 dark:text-white">{subject.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div className={`h-2 rounded-full bg-gradient-to-r ${subject.color}`} style={{ width: `${subject.progress}%` }}></div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 pt-4">
                      <button className="flex-1 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                        View Details
                      </button>
                      <button className="flex-1 py-3 text-sm font-medium text-white bg-gradient-to-r from-[#7B1112] to-[#FFB302] rounded-lg hover:opacity-90 transition-opacity">
                        Continue
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
                <button className="mt-4 md:mt-0 px-6 py-3 bg-gradient-to-r from-[#7B1112] to-[#FFB302] text-white rounded-lg hover:opacity-90 transition-opacity">
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
            <p className="text-gray-500 dark:text-gray-400 mt-2">Communicate with teachers and staff</p>
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
              <Mail size={20} className="mr-2" />
              New Message
            </button>
          </div>
        </div>
        
        {isLoading ? (
          <div className="space-y-4">
            {Array(5).fill(0).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <div className="space-y-4">
            {mockMessages.map((message) => (
              <div key={message.id} className="group p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-[#7B1112] dark:hover:border-[#FFB302] hover:shadow-lg transition-all duration-300">
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
                        <button className="text-sm text-[#7B1112] dark:text-[#FFB302] hover:underline">
                          Reply
                        </button>
                        <button className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                          Mark as read
                        </button>
                        <button className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
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
  const ProfileSection = () => (
    <div className="space-y-8 p-6">
      <div className="bg-gradient-to-r from-gray-900 to-[#7B1112] rounded-2xl p-8 text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold">My Profile</h2>
            <p className="text-gray-200 mt-2">Manage your personal information and preferences</p>
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
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">{userData?.grade_level || "Grade 12"}</p>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Section</label>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">{userData?.section || "Newton"}</p>
                      </div>
                    </div>
                    
                    <div className="pt-6 border-t dark:border-gray-700">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Contact Information</h4>
                      <div className="space-y-4">
                        <div className="flex items-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                          <Phone className="h-5 w-5 text-gray-400 mr-4" />
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                            <p className="font-medium text-gray-900 dark:text-white">{userData?.phone || "+63 912 345 6789"}</p>
                          </div>
                        </div>
                        <div className="flex items-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                          <MapPin className="h-5 w-5 text-gray-400 mr-4" />
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Address</p>
                            <p className="font-medium text-gray-900 dark:text-white">{userData?.address || "123 Student St., Manila City"}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Academic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Enrollment Date</p>
                  <p className="font-bold text-gray-900 dark:text-white mt-1">{userData?.enrollment_date || "June 2023"}</p>
                </div>
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Expected Graduation</p>
                  <p className="font-bold text-gray-900 dark:text-white mt-1">March 2024</p>
                </div>
                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Academic Standing</p>
                  <p className="font-bold text-green-600 dark:text-green-400 mt-1">Good Standing</p>
                </div>
                <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Attendance Rate</p>
                  <p className="font-bold text-gray-900 dark:text-white mt-1">95%</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Academic Stats</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <span className="text-gray-700 dark:text-gray-300">Current Average</span>
                  <span className="font-bold text-2xl text-blue-600 dark:text-blue-400">92%</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <span className="text-gray-700 dark:text-gray-300">Attendance Rate</span>
                  <span className="font-bold text-2xl text-green-600 dark:text-green-400">95%</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <span className="text-gray-700 dark:text-gray-300">Assignments Done</span>
                  <span className="font-bold text-2xl text-purple-600 dark:text-purple-400">78%</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h4>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  <span className="text-gray-700 dark:text-gray-300">Request Form 137</span>
                  <FileText size={16} className="text-gray-400" />
                </button>
                <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  <span className="text-gray-700 dark:text-gray-300">View Report Card</span>
                  <Download size={16} className="text-gray-400" />
                </button>
                <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  <span className="text-gray-700 dark:text-gray-300">Certificate Requests</span>
                  <Award size={16} className="text-gray-400" />
                </button>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-[#7B1112] to-[#9B3132] rounded-2xl p-6 text-white">
              <h4 className="font-semibold mb-4">Need Help?</h4>
              <p className="text-gray-200 text-sm mb-4">Contact our student support team for assistance</p>
              <button className="w-full py-3 bg-white/20 hover:bg-white/30 rounded-lg transition-colors">
                Contact Support
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
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Bio</label>
                  <textarea
                    className="w-full px-4 py-3 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-[#7B1112] focus:border-transparent transition-all"
                    rows={3}
                    placeholder="Tell us about yourself..."
                    defaultValue="Senior High School student passionate about learning and personal development."
                  />
                </div>
              </div>
            </div>

            {/* Notification Settings */}
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Notification Preferences</h3>
              <div className="space-y-4">
                {[
                  { label: "Email Notifications", description: "Receive updates via email", checked: true },
                  { label: "Push Notifications", description: "Get notified on your device", checked: true },
                  { label: "Assignment Reminders", description: "Remind before deadlines", checked: true },
                  { label: "Grade Updates", description: "Notify when grades are posted", checked: false },
                  { label: "Subject Announcements", description: "Important subject updates", checked: true },
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
              <p className="text-gray-200 text-sm mb-6">Manage your account security and privacy</p>
              <div className="space-y-3">
                <button className="w-full text-left p-4 bg-white/10 hover:bg-white/20 rounded-xl transition-colors">
                  Change Password
                </button>
                <button className="w-full text-left p-4 bg-white/10 hover:bg-white/20 rounded-xl transition-colors">
                  Two-Factor Authentication
                </button>
                <button className="w-full text-left p-4 bg-white/10 hover:bg-white/20 rounded-xl transition-colors">
                  Privacy Settings
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
                  Delete Account
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
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Need Help?</h4>
              <button className="w-full text-left p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <HelpCircle size={16} className="inline mr-2" />
                Help Center
              </button>
              <button className="w-full text-left p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <Mail size={16} className="inline mr-2" />
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

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
              
              {/* Quick Stats */}
              <div className="mt-8 p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Academic Progress</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Average</span>
                    <span className="font-bold text-green-600 dark:text-green-400">92%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Attendance</span>
                    <span className="font-bold text-blue-600 dark:text-blue-400">95%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Strand</span>
                    <span className="font-bold text-purple-600 dark:text-purple-400">{selectedStrand}</span>
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

export default SeniorHighPortal;