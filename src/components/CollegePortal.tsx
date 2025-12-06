import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar, Footer } from "./faculties";
import { 
  User, BookOpen, Calendar, MessageSquare, LogOut, 
  Bell, Settings, FileText, BarChart, Download,
  ChevronRight, Clock, AlertCircle, Home,
  Search, Filter, MoreVertical, Edit, Trash2,
  Upload, Share, Eye, CheckCircle, XCircle,
  Plus, Users, Bookmark, Star, Mail,
  Phone, MapPin, Globe, Lock, CreditCard,
  HelpCircle, Database, Server, Cpu, Shield
} from "lucide-react";

// Mock data for different features
const mockCourses = [
  { id: 1, code: "CS101", name: "Introduction to Programming", professor: "Dr. Smith", progress: 85, color: "bg-blue-100 dark:bg-blue-900/30" },
  { id: 2, code: "MATH201", name: "Calculus II", professor: "Prof. Johnson", progress: 70, color: "bg-green-100 dark:bg-green-900/30" },
  { id: 3, code: "PHYS101", name: "Physics I", professor: "Dr. Williams", progress: 90, color: "bg-purple-100 dark:bg-purple-900/30" },
  { id: 4, code: "ENG101", name: "English Composition", professor: "Prof. Davis", progress: 60, color: "bg-amber-100 dark:bg-amber-900/30" },
];

const mockMessages = [
  { id: 1, sender: "Dr. Smith", subject: "Assignment Feedback", preview: "Great work on the last assignment...", time: "2h ago", unread: true },
  { id: 2, sender: "Student Affairs", subject: "Campus Event", preview: "Join us for the annual science fair...", time: "1d ago", unread: false },
  { id: 3, sender: "Library", subject: "Book Due Soon", preview: "Your book 'Data Structures' is due...", time: "2d ago", unread: false },
];

const mockSchedule = [
  { id: 1, day: "Mon", time: "9:00 AM - 10:30 AM", subject: "CS101", room: "Room 301", type: "lecture" },
  { id: 2, day: "Mon", time: "11:00 AM - 12:30 PM", subject: "MATH201", room: "Room 205", type: "lecture" },
  { id: 3, day: "Tue", time: "2:00 PM - 3:30 PM", subject: "PHYS101", room: "Lab B", type: "lab" },
  { id: 4, day: "Wed", time: "10:00 AM - 11:30 AM", subject: "ENG101", room: "Room 102", type: "lecture" },
];

const mockGrades = [
  { id: 1, course: "CS101", assignment: "Midterm Exam", grade: "A", score: "95/100", date: "Nov 15, 2023" },
  { id: 2, course: "MATH201", assignment: "Quiz 3", grade: "B+", score: "88/100", date: "Nov 10, 2023" },
  { id: 3, course: "PHYS101", assignment: "Lab Report", grade: "A-", score: "92/100", date: "Nov 5, 2023" },
  { id: 4, course: "ENG101", assignment: "Essay", grade: "A", score: "96/100", date: "Oct 30, 2023" },
];

const mockDocuments = [
  { id: 1, name: "Official Transcript", type: "pdf", size: "2.4 MB", date: "Dec 1, 2023" },
  { id: 2, name: "Enrollment Certificate", type: "pdf", size: "1.8 MB", date: "Nov 28, 2023" },
  { id: 3, name: "Course Schedule", type: "xlsx", size: "3.2 MB", date: "Nov 25, 2023" },
  { id: 4, name: "ID Card Copy", type: "jpg", size: "4.1 MB", date: "Nov 20, 2023" },
];

const CollegePortal: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [userName, setUserName] = useState("John Student");
  const [userEmail, setUserEmail] = useState("john.student@college.edu");
  const [notifications, setNotifications] = useState(3);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [selectedMessage, setSelectedMessage] = useState<any>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  const portalFeatures = [
    {
      title: "My Profile",
      description: "View and update your personal information",
      icon: <User className="h-6 w-6" />,
      action: () => setActiveTab("profile"),
      color: "from-blue-500 to-cyan-400",
      bgColor: "bg-blue-50 dark:bg-blue-900/20"
    },
    {
      title: "My Courses",
      description: "Access your enrolled courses and materials",
      icon: <BookOpen className="h-6 w-6" />,
      action: () => setActiveTab("courses"),
      color: "from-[#7B1112] to-[#FFB302]",
      bgColor: "bg-red-50 dark:bg-red-900/20"
    },
    {
      title: "Academic Schedule",
      description: "Check your class schedule and events",
      icon: <Calendar className="h-6 w-6" />,
      action: () => setActiveTab("schedule"),
      color: "from-green-500 to-emerald-400",
      bgColor: "bg-green-50 dark:bg-green-900/20"
    },
    {
      title: "Messages",
      description: "Communicate with faculty and peers",
      icon: <MessageSquare className="h-6 w-6" />,
      action: () => setActiveTab("messages"),
      color: "from-purple-500 to-pink-400",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
      badge: notifications
    },
    {
      title: "Grades & Results",
      description: "View your academic performance",
      icon: <BarChart className="h-6 w-6" />,
      action: () => setActiveTab("grades"),
      color: "from-amber-500 to-yellow-400",
      bgColor: "bg-amber-50 dark:bg-amber-900/20"
    },
    {
      title: "Documents",
      description: "Access transcripts and certificates",
      icon: <FileText className="h-6 w-6" />,
      action: () => setActiveTab("documents"),
      color: "from-indigo-500 to-blue-400",
      bgColor: "bg-indigo-50 dark:bg-indigo-900/20"
    },
    {
      title: "Settings",
      description: "Manage your account preferences",
      icon: <Settings className="h-6 w-6" />,
      action: () => setActiveTab("settings"),
      color: "from-gray-600 to-gray-400",
      bgColor: "bg-gray-50 dark:bg-gray-900/50"
    },
    {
      title: "Notifications",
      description: "View college announcements",
      icon: <Bell className="h-6 w-6" />,
      action: () => setActiveTab("notifications"),
      color: "from-orange-500 to-red-400",
      bgColor: "bg-orange-50 dark:bg-orange-900/20"
    },
  ];

  // Profile Section
  const ProfileSection = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">My Profile</h2>
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Edit className="h-4 w-4 mr-2" />
            Edit Profile
          </button>
        </div>
        
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/3">
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-4xl font-bold mb-4">
                JS
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">{userName}</h3>
              <p className="text-gray-600 dark:text-gray-300">{userEmail}</p>
              <div className="mt-4 flex items-center text-sm text-green-600">
                <CheckCircle className="h-4 w-4 mr-1" />
                Verified Student
              </div>
            </div>
          </div>
          
          <div className="md:w-2/3 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Student ID</label>
                <p className="text-gray-900 dark:text-white font-semibold">2023-0012345</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Department</label>
                <p className="text-gray-900 dark:text-white font-semibold">Computer Science</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Year Level</label>
                <p className="text-gray-900 dark:text-white font-semibold">3rd Year</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Major</label>
                <p className="text-gray-900 dark:text-white font-semibold">Software Engineering</p>
              </div>
            </div>
            
            <div className="border-t dark:border-gray-700 pt-4">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Contact Information</h4>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-gray-400 mr-3" />
                  <span className="text-gray-700 dark:text-gray-300">+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                  <span className="text-gray-700 dark:text-gray-300">123 College Ave, University City</span>
                </div>
                <div className="flex items-center">
                  <Globe className="h-5 w-5 text-gray-400 mr-3" />
                  <span className="text-gray-700 dark:text-gray-300">Student since September 2021</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Courses Section
  const CoursesSection = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">My Courses</h2>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-[#7B1112] focus:border-transparent"
            />
          </div>
          <button className="flex items-center px-4 py-2 bg-[#7B1112] text-white rounded-lg hover:bg-[#5a0d0d] transition-colors">
            <Plus className="h-4 w-4 mr-2" />
            Enroll
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Enrolled Courses</h3>
            <div className="space-y-4">
              {mockCourses.map((course) => (
                <div 
                  key={course.id} 
                  className={`${course.color} p-4 rounded-lg border dark:border-gray-700 hover:shadow-md transition-shadow cursor-pointer`}
                  onClick={() => setSelectedCourse(course)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white">{course.code}: {course.name}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Professor: {course.professor}</p>
                    </div>
                    <MoreVertical className="h-5 w-5 text-gray-400" />
                  </div>
                  <div className="mt-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600 dark:text-gray-300">Progress</span>
                      <span className="font-semibold">{course.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-[#7B1112] to-[#FFB302] h-2 rounded-full" 
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Course Details</h3>
            {selectedCourse ? (
              <div className="space-y-4">
                <div>
                  <h4 className="font-bold text-xl text-gray-900 dark:text-white">{selectedCourse.code}</h4>
                  <p className="text-gray-600 dark:text-gray-300">{selectedCourse.name}</p>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Instructor:</span>
                    <span className="font-semibold">{selectedCourse.professor}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Credits:</span>
                    <span className="font-semibold">3 units</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Schedule:</span>
                    <span className="font-semibold">Mon, Wed 9:00-10:30</span>
                  </div>
                </div>
                <button className="w-full py-2 bg-gradient-to-r from-[#7B1112] to-[#FFB302] text-white rounded-lg font-medium hover:opacity-90 transition-opacity">
                  View Course Materials
                </button>
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">Select a course to view details</p>
            )}
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <div className="flex items-center">
                  <Download className="h-5 w-5 text-blue-500 mr-3" />
                  <span>Download Syllabus</span>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </button>
              <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <div className="flex items-center">
                  <Upload className="h-5 w-5 text-green-500 mr-3" />
                  <span>Submit Assignment</span>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </button>
              <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-purple-500 mr-3" />
                  <span>Class Discussions</span>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Messages Section
  const MessagesSection = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Messages</h2>
        <div className="flex items-center gap-4">
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="h-4 w-4 mr-2" />
            New Message
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="space-y-4">
              {mockMessages.map((message) => (
                <div 
                  key={message.id} 
                  className={`p-4 rounded-lg border dark:border-gray-700 hover:shadow-md transition-shadow cursor-pointer ${
                    message.unread ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                  }`}
                  onClick={() => setSelectedMessage(message)}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-bold text-gray-900 dark:text-white">{message.sender}</h4>
                        <span className="text-sm text-gray-500">{message.time}</span>
                      </div>
                      <h5 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">{message.subject}</h5>
                      <p className="text-sm text-gray-600 dark:text-gray-300 truncate">{message.preview}</p>
                    </div>
                    {message.unread && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Message Details</h3>
            {selectedMessage ? (
              <div className="space-y-4">
                <div>
                  <h4 className="font-bold text-xl text-gray-900 dark:text-white">{selectedMessage.subject}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">From: {selectedMessage.sender}</p>
                </div>
                <div className="border-t dark:border-gray-700 pt-4">
                  <p className="text-gray-700 dark:text-gray-300">
                    {selectedMessage.preview} Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                    Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  </p>
                </div>
                <div className="flex gap-3">
                  <button className="flex-1 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                    <Mail className="h-4 w-4 inline mr-2" />
                    Reply
                  </button>
                  <button className="flex-1 py-2 border dark:border-gray-700 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <Trash2 className="h-4 w-4 inline mr-2" />
                    Delete
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">Select a message to view details</p>
            )}
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Contacts</h3>
            <div className="space-y-3">
              <div className="flex items-center p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors cursor-pointer">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 font-bold mr-3">
                  DS
                </div>
                <div>
                  <p className="font-semibold">Dr. Smith</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Computer Science</p>
                </div>
              </div>
              <div className="flex items-center p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors cursor-pointer">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600 font-bold mr-3">
                  PJ
                </div>
                <div>
                  <p className="font-semibold">Prof. Johnson</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Mathematics</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Schedule Section
  const ScheduleSection = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Academic Schedule</h2>
        <div className="flex items-center gap-4">
          <button className="flex items-center px-4 py-2 border dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <Calendar className="h-4 w-4 mr-2" />
            Calendar View
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b dark:border-gray-700">
                    <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300">Day</th>
                    <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300">Time</th>
                    <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300">Subject</th>
                    <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300">Room</th>
                    <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300">Type</th>
                  </tr>
                </thead>
                <tbody>
                  {mockSchedule.map((item) => (
                    <tr key={item.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <td className="py-3 px-4">
                        <span className="font-semibold text-gray-900 dark:text-white">{item.day}</span>
                      </td>
                      <td className="py-3 px-4 text-gray-700 dark:text-gray-300">{item.time}</td>
                      <td className="py-3 px-4">
                        <span className="font-medium text-gray-900 dark:text-white">{item.subject}</span>
                      </td>
                      <td className="py-3 px-4 text-gray-700 dark:text-gray-300">{item.room}</td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          item.type === 'lecture' 
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                            : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                        }`}>
                          {item.type}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Today's Schedule</h3>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-gray-900 dark:text-white">CS101</h4>
                  <span className="text-sm font-semibold text-blue-600">9:00 AM</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Introduction to Programming</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Room 301</p>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-gray-900 dark:text-white">MATH201</h4>
                  <span className="text-sm font-semibold text-green-600">11:00 AM</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Calculus II</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Room 205</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Upcoming Events</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Midterm Exams</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Dec 18-22, 2023</p>
                </div>
                <AlertCircle className="h-5 w-5 text-amber-500" />
              </div>
              <div className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Science Fair</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Jan 15, 2024</p>
                </div>
                <Calendar className="h-5 w-5 text-green-500" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Grades Section
  const GradesSection = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Grades & Results</h2>
        <div className="flex items-center gap-4">
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-300">Current GPA</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">3.75</p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Grade History</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b dark:border-gray-700">
                    <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300">Course</th>
                    <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300">Assignment</th>
                    <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300">Grade</th>
                    <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300">Score</th>
                    <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {mockGrades.map((grade) => (
                    <tr key={grade.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <td className="py-3 px-4">
                        <span className="font-medium text-gray-900 dark:text-white">{grade.course}</span>
                      </td>
                      <td className="py-3 px-4 text-gray-700 dark:text-gray-300">{grade.assignment}</td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          grade.grade === 'A' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                          grade.grade === 'A-' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                          grade.grade === 'B+' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                          'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'
                        }`}>
                          {grade.grade}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-700 dark:text-gray-300">{grade.score}</td>
                      <td className="py-3 px-4 text-gray-700 dark:text-gray-300">{grade.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">GPA Progress</h3>
            <div className="flex flex-col items-center">
              <div className="relative w-40 h-40 mb-4">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">3.75</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Current GPA</p>
                  </div>
                </div>
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="10" />
                  <circle cx="50" cy="50" r="45" fill="none" stroke="url(#gradient)" strokeWidth="10" strokeLinecap="round" strokeDasharray="283" strokeDashoffset="70.75" />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#7B1112" />
                      <stop offset="100%" stopColor="#FFB302" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-300">Target GPA: 3.80</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Credits Completed: 72/120</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Course Grades</h3>
            <div className="space-y-3">
              {mockCourses.map((course) => (
                <div key={course.id} className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{course.code}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{course.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900 dark:text-white">A-</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">92%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Documents Section
  const DocumentsSection = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Documents</h2>
        <div className="flex items-center gap-4">
          <button className="flex items-center px-4 py-2 bg-gradient-to-r from-[#7B1112] to-[#FFB302] text-white rounded-lg hover:opacity-90 transition-opacity">
            <Upload className="h-4 w-4 mr-2" />
            Upload Document
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">My Documents</h3>
            <div className="space-y-4">
              {mockDocuments.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-4 border dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex items-center">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg mr-4">
                      <FileText className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white">{doc.name}</h4>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-sm text-gray-600 dark:text-gray-300">{doc.type.toUpperCase()}</span>
                        <span className="text-sm text-gray-600 dark:text-gray-300">{doc.size}</span>
                        <span className="text-sm text-gray-600 dark:text-gray-300">{doc.date}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                      <Eye className="h-4 w-4 text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                      <Download className="h-4 w-4 text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                      <Share className="h-4 w-4 text-gray-600" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Document Categories</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-blue-500 mr-3" />
                  <span>Academic Records</span>
                </div>
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">12</span>
              </button>
              <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-green-500 mr-3" />
                  <span>Certificates</span>
                </div>
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">8</span>
              </button>
              <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-purple-500 mr-3" />
                  <span>Course Materials</span>
                </div>
                <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">24</span>
              </button>
              <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-amber-500 mr-3" />
                  <span>Assignments</span>
                </div>
                <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full">15</span>
              </button>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Storage Usage</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600 dark:text-gray-300">Used: 12.5 GB</span>
                  <span className="text-gray-600 dark:text-gray-300">25 GB total</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-gradient-to-r from-[#7B1112] to-[#FFB302] h-2 rounded-full w-1/2"></div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">50% of storage used</p>
              </div>
              <button className="w-full py-2 border dark:border-gray-700 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                Upgrade Storage
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Settings Section
  const SettingsSection = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Account Settings</h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Personal Information</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <input
                      type="text"
                      defaultValue={userName}
                      className="w-full px-4 py-2 border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-[#7B1112] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      defaultValue={userEmail}
                      className="w-full px-4 py-2 border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-[#7B1112] focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Change Password</label>
                <div className="space-y-4">
                  <input
                    type="password"
                    placeholder="Current Password"
                    className="w-full px-4 py-2 border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-[#7B1112] focus:border-transparent"
                  />
                  <input
                    type="password"
                    placeholder="New Password"
                    className="w-full px-4 py-2 border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-[#7B1112] focus:border-transparent"
                  />
                  <input
                    type="password"
                    placeholder="Confirm New Password"
                    className="w-full px-4 py-2 border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-[#7B1112] focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Notification Preferences</label>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300">Email Notifications</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#7B1112]"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300">SMS Notifications</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#7B1112]"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300">Assignment Reminders</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#7B1112]"></div>
                    </label>
                  </div>
                </div>
              </div>
              
              <button className="px-6 py-3 bg-gradient-to-r from-[#7B1112] to-[#FFB302] text-white rounded-lg font-medium hover:opacity-90 transition-opacity">
                Save Changes
              </button>
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Privacy & Security</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <div className="flex items-center">
                  <Lock className="h-5 w-5 text-gray-600 mr-3" />
                  <span>Privacy Settings</span>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </button>
              <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <div className="flex items-center">
                  <Shield className="h-5 w-5 text-gray-600 mr-3" />
                  <span>Security</span>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </button>
              <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <div className="flex items-center">
                  <Database className="h-5 w-5 text-gray-600 mr-3" />
                  <span>Data & Privacy</span>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </button>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Billing</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center">
                  <CreditCard className="h-5 w-5 text-gray-600 mr-3" />
                  <span>Current Balance</span>
                </div>
                <span className="font-bold text-gray-900 dark:text-white">$0.00</span>
              </div>
              <button className="w-full py-2 border dark:border-gray-700 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                View Payment History
              </button>
            </div>
          </div>
          
          <div className="bg-red-50 dark:bg-red-900/20 rounded-xl shadow-lg p-6 border border-red-200 dark:border-red-800">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Danger Zone</h3>
            <div className="space-y-3">
              <button className="w-full py-2 border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 rounded-lg font-medium hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors">
                Deactivate Account
              </button>
              <button 
                onClick={handleLogout}
                className="w-full py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
              >
                <LogOut className="h-4 w-4 inline mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Notifications Section
  const NotificationsSection = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Notifications</h2>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setNotifications(0)}
            className="px-4 py-2 border dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Mark all as read
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="space-y-4">
              {[
                { id: 1, title: "New Assignment Posted", message: "CS101 - Programming Assignment 3 has been posted", time: "2 hours ago", unread: true, type: "assignment" },
                { id: 2, title: "Grade Released", message: "Your grade for MATH201 Quiz 3 has been released", time: "1 day ago", unread: true, type: "grade" },
                { id: 3, title: "System Maintenance", message: "Portal will be down for maintenance on Dec 20, 2023", time: "2 days ago", unread: false, type: "system" },
                { id: 4, title: "Campus Event", message: "Annual Science Fair registration is now open", time: "3 days ago", unread: false, type: "event" },
              ].map((notification) => (
                <div 
                  key={notification.id} 
                  className={`p-4 rounded-lg border dark:border-gray-700 hover:shadow-md transition-shadow ${
                    notification.unread ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-full ${
                      notification.type === 'assignment' ? 'bg-purple-100 dark:bg-purple-900/30' :
                      notification.type === 'grade' ? 'bg-green-100 dark:bg-green-900/30' :
                      notification.type === 'system' ? 'bg-amber-100 dark:bg-amber-900/30' :
                      'bg-blue-100 dark:bg-blue-900/30'
                    }`}>
                      {notification.type === 'assignment' && <FileText className="h-5 w-5 text-purple-600" />}
                      {notification.type === 'grade' && <BarChart className="h-5 w-5 text-green-600" />}
                      {notification.type === 'system' && <Server className="h-5 w-5 text-amber-600" />}
                      {notification.type === 'event' && <Calendar className="h-5 w-5 text-blue-600" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-bold text-gray-900 dark:text-white">{notification.title}</h4>
                        <span className="text-sm text-gray-500">{notification.time}</span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300">{notification.message}</p>
                    </div>
                    {notification.unread && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Notification Settings</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-700 dark:text-gray-300">Email Notifications</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#7B1112]"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700 dark:text-gray-300">Push Notifications</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#7B1112]"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700 dark:text-gray-300">SMS Notifications</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#7B1112]"></div>
                </label>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Help & Support</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <div className="flex items-center">
                  <HelpCircle className="h-5 w-5 text-gray-600 mr-3" />
                  <span>FAQs</span>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </button>
              <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-gray-600 mr-3" />
                  <span>Contact Support</span>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </button>
              <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <div className="flex items-center">
                  <BookOpen className="h-5 w-5 text-gray-600 mr-3" />
                  <span>User Guide</span>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Dashboard View
  const DashboardView = () => (
    <>
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#7B1112] to-[#FFB302] bg-clip-text text-transparent mb-4">
          College Portal
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Welcome to your personal dashboard. Access your courses, schedule, and more.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {portalFeatures.map((feature, index) => (
          <div
            key={index}
            onClick={feature.action}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105"
          >
            <div className="flex flex-col items-center text-center">
              <div className={`p-3 rounded-lg bg-gradient-to-br ${feature.color} text-white mb-4`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                {feature.description}
              </p>
              {feature.badge && (
                <span className="mt-3 text-xs bg-red-500 text-white px-2 py-1 rounded-full">
                  {feature.badge} new
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Upcoming Deadlines</h3>
            <div className="space-y-4">
              {[
                { id: 1, course: "Computer Science 101", task: "Final Project", due: "Dec 15, 2023", daysLeft: 3 },
                { id: 2, course: "Mathematics", task: "Midterm Exam", due: "Dec 18, 2023", daysLeft: 6 },
                { id: 3, course: "English Literature", task: "Research Paper", due: "Dec 20, 2023", daysLeft: 8 },
              ].map((deadline) => (
                <div key={deadline.id} className="flex items-center justify-between p-4 border dark:border-gray-700 rounded-lg">
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white">{deadline.course}</h4>
                    <p className="text-gray-600 dark:text-gray-300">{deadline.task}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-red-600 dark:text-red-400">Due: {deadline.due}</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="h-3 w-3 mr-1" />
                      {deadline.daysLeft} days left
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {[
              { id: 1, text: "Assignment submitted - Calculus II", time: "2 hours ago", type: "submission" },
              { id: 2, text: "Grade updated for Physics Lab", time: "1 day ago", type: "grade" },
              { id: 3, text: "New announcement from Dean's office", time: "2 days ago", type: "announcement" },
            ].map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className={`p-2 rounded-full ${
                  activity.type === 'submission' ? 'bg-green-100 dark:bg-green-900/30' :
                  activity.type === 'grade' ? 'bg-blue-100 dark:bg-blue-900/30' :
                  'bg-purple-100 dark:bg-purple-900/30'
                }`}>
                  {activity.type === 'submission' && <FileText className="h-4 w-4 text-green-600" />}
                  {activity.type === 'grade' && <BarChart className="h-4 w-4 text-blue-600" />}
                  {activity.type === 'announcement' && <Bell className="h-4 w-4 text-purple-600" />}
                </div>
                <div>
                  <p className="text-sm text-gray-900 dark:text-white">{activity.text}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );

  const renderActiveSection = () => {
    switch (activeTab) {
      case "profile": return <ProfileSection />;
      case "courses": return <CoursesSection />;
      case "schedule": return <ScheduleSection />;
      case "messages": return <MessagesSection />;
      case "grades": return <GradesSection />;
      case "documents": return <DocumentsSection />;
      case "settings": return <SettingsSection />;
      case "notifications": return <NotificationsSection />;
      default: return <DashboardView />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#7B1112] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading your portal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 min-h-screen">
      <Navbar />
      <div className="pt-20 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Navigation Tabs */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-2 overflow-x-auto pb-2">
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === "dashboard"
                    ? "bg-gradient-to-r from-[#7B1112] to-[#FFB302] text-white"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <Home className="h-4 w-4 mr-2" />
                Dashboard
              </button>
              {portalFeatures.map((feature, index) => (
                <button
                  key={index}
                  onClick={feature.action}
                  className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                    activeTab === feature.title.toLowerCase().replace(' & ', '').replace(' ', '')
                      ? "bg-gradient-to-r from-[#7B1112] to-[#FFB302] text-white"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  {React.cloneElement(feature.icon, { className: "h-4 w-4 mr-2" })}
                  {feature.title}
                </button>
              ))}
            </div>
          </div>

          {renderActiveSection()}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CollegePortal;