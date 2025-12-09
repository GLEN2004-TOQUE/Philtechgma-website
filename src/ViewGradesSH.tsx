// viewgrades.tsx -> rename this file to ViewGradesSH.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  TrendingUp, 
  Award, 
  ArrowLeft,
  Download,
  FileText,
  Calendar,
  User,
  BookOpen
} from "lucide-react";
import { supabase } from './supabaseClient';

interface Course {
  id: number | string;
  code: string;
  name: string;
  professor: string;
}

interface Grade {
  id: number | string;
  course: string;
  subject: string;
  grade: string;
  remarks: string;
  date: string;
}

const ViewGradesSH = () => {
  const navigate = useNavigate();
  const [grades, setGrades] = useState<Grade[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
    fetchUserCourses();
  }, []);

  const fetchUserData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login");
        return;
      }

      const { data: userData } = await supabase
        .from("users")
        .select("full_name")
        .eq("id", session.user.id)
        .single();

      if (userData) {
        setUserName(userData.full_name || "Student");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const fetchUserCourses = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data: coursesData } = await supabase
        .from("student_subjects")
        .select("subject_id, subjects(*)")
        .eq("student_id", session.user.id);

      if (coursesData) {
        const formattedCourses: Course[] = coursesData.map((item: any) => ({
          id: item.subjects?.id,
          code: item.subjects?.subject_code,
          name: item.subjects?.subject_name,
          professor: item.subjects?.professor
        }));
        setCourses(formattedCourses);
      }

      setGrades([]);
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateAverage = () => {
    // Since no grades are available, return 0.00
    return "0.00";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/SeniorHighPortal")}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <ArrowLeft size={24} />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Grades Overview (Senior High)</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Academic performance</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                <Download size={18} className="inline mr-2" />
                Export
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="p-6 max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Academic Grades</h2>
              <p className="text-gray-500 dark:text-gray-400 mt-2">
                {userName}'s performance overview
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                <Calendar size={16} />
                <span>As of {new Date().toLocaleDateString('en-US', { 
                  month: 'long', 
                  day: 'numeric', 
                  year: 'numeric' 
                })}</span>
              </div>
            </div>
          </div>

          {/* Average Card - Changed from GPA to Average for Senior High */}
          <div className="bg-gradient-to-r from-[#7B1112] to-[#FFB302] rounded-2xl p-8 text-white mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div>
                <p className="text-white/80 mb-2">Current Average Grade</p>
                <p className="text-5xl font-bold mb-4">{calculateAverage()}</p>
                <p className="text-white/90">Based on {courses.length} enrolled subjects</p>
              </div>
              <div className="mt-6 md:mt-0">
                <div className="flex items-center space-x-4">
                  <div className="p-4 bg-white/20 rounded-xl">
                    <TrendingUp size={32} />
                  </div>
                  <div className="text-right">
                    <p className="text-white/80">Academic Standing</p>
                    <p className="text-2xl font-bold">Good</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Grades Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Subject Grades</h3>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Grades will appear here once teachers post them</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm">
                  {courses.length} Subjects
                </span>
              </div>
            </div>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 border-4 border-[#7B1112] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-500 dark:text-gray-400">Loading grades...</p>
              </div>
            ) : grades.length === 0 ? (
              <div className="text-center py-12">
                <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Grades Available</h4>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  Your teachers haven't posted any grades yet. Grades will appear here once they are available.
                </p>
                <div className="max-w-md mx-auto">
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-4">
                    <div className="flex items-start space-x-3">
                      <BookOpen className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" size={20} />
                      <div className="text-left">
                        <p className="font-medium text-blue-800 dark:text-blue-300">You're enrolled in {courses.length} subjects</p>
                        <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                          Continue completing assignments and attending classes. Grades will be posted by your teachers.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Grades list would go here when available */}
              </div>
            )}
          </div>
        </div>

        {/* Enrolled Subjects */}
        {courses.length > 0 && (
          <div className="mt-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Enrolled Subjects</h3>
              <p className="text-gray-500 dark:text-gray-400 mt-1">Subjects you're currently taking</p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {courses.map((course) => (
                  <div key={course.id} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:shadow-md transition-all">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{course.code}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{course.name}</p>
                      </div>
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
                        <BookOpen size={18} />
                      </div>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <User size={14} className="mr-2" />
                      {course.professor}
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                      <div className="text-center py-2">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Grade: Not Yet Posted</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ViewGradesSH;