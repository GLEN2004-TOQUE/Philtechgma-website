import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  X, User, Mail, Lock, UserCircle, Eye, EyeOff, School, Shield,
  RefreshCw, GraduationCap, BookOpen, Building, Hash, Calendar, Users
} from "lucide-react";
import { supabase } from "../supabase";
import { evaluatePasswordStrength, PasswordStrength } from "../Securities/PasswordStrength";
import { enforceHTTPS, sanitizeInput, validateInput, handleSecureError } from "../Securities/HTTPSecurity";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "student",
    firstName: "",
    middleName: "",
    lastName: "",
    confirmPassword: "",
    studentType: "", // New field for student type
    yearGrade: "",
    section: "",
    sectionData: null as any, // Store full section data
    schoolID: "",
    programStrand: "", // Will be either course (college) or strand (senior high)
    department: "" // New field for teacher department
  });

  // Course/Strand options
  const collegeCourses = [
    "BSCS",
    "BSOA",
    "BTVTED"
  ];

  const seniorHighStrands = [
    "STEM - Science, Technology, Engineering, and Mathematics",
    "ABM - Accountancy, Business and Management",
    "HUMSS - Humanities and Social Sciences",
    "GAS - General Academic Strand",
    "TVL - Technical-Vocational-Livelihood (ICT)",
    "TVL - Technical-Vocational-Livelihood (HE)",
    "TVL - Technical-Vocational-Livelihood (IA)"
  ];

  const yearGradeOptions = [
    "Grade 11",
    "Grade 12",
    "1st Year College",
    "2nd Year College",
    "3rd Year College",
    "4th Year College",
    "5th Year College"
  ];

  // Teacher department options
  const teacherDepartments = [
    "seniorHigh",
    "college",
    "both"
  ];

  const [error, setError] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [signupEmail, setSignupEmail] = useState("");
  const [availableSections, setAvailableSections] = useState<any[]>([]);
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>('Weak');

  // Constants for error messages
  const duplicateEmailError = "This email is already registered. Please use a different email or try signing in.";

  const generateSchoolID = () => {
    // Auto-generate based on current date and time for uniqueness
    const date = new Date();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    const yyyy = String(date.getFullYear());
    const time = String(Date.now()).slice(-4); // Last 4 digits of timestamp
    return `${mm}${dd}${yyyy}-${time}`;
  };

  // Initialize school ID on component mount for sign-up
  useEffect(() => {
    if (isSignUp) {
      setFormData(prev => ({
        ...prev,
        schoolID: generateSchoolID()
      }));
    }
  }, [isSignUp]);

  // Update the section filtering useEffect
// Replace your existing fetchSections useEffect with this version

// Add this useEffect to your login.tsx to debug the section fetching

// Replace your fetchSections useEffect with this fixed version

useEffect(() => {
  const fetchSections = async () => {
    if (!formData.studentType || !formData.programStrand || !formData.yearGrade) {
      console.log('❌ Missing required fields:', {
        studentType: formData.studentType,
        programStrand: formData.programStrand,
        yearGrade: formData.yearGrade
      });
      setAvailableSections([]);
      return;
    }

    // 🔥 TRANSFORM VALUES TO MATCH DATABASE FORMAT
    const transformedStudentType = formData.studentType === 'seniorHigh' 
      ? 'Senior High' 
      : 'College';

    console.log('🔍 Fetching sections with:', {
      student_type: transformedStudentType,  // Now "Senior High" instead of "seniorHigh"
      program: formData.programStrand,
      year_level: formData.yearGrade
    });

    try {
      const { data, error } = await supabase
        .from('sections')
        .select('*')
        .eq('student_type', transformedStudentType)  // ✅ Use transformed value
        .eq('program', formData.programStrand)
        .eq('year_level', formData.yearGrade)
        .order('section_code');

      if (error) {
        console.error('❌ Supabase error:', error);
        throw error;
      }

      console.log('✅ Sections found:', data);
      console.log('📊 Number of sections:', data?.length || 0);
      
      setAvailableSections(data || []);
    } catch (error) {
      console.error('❌ Error fetching sections:', error);
      setAvailableSections([]);
    }
  };

  fetchSections();
}, [formData.studentType, formData.programStrand, formData.yearGrade]);
  // Enforce HTTPS on component mount
  useEffect(() => {
    enforceHTTPS();
  }, []);

  // Password strength evaluation
  useEffect(() => {
    if (isSignUp) {
      setPasswordStrength(evaluatePasswordStrength(formData.password));
    }
  }, [formData.password, isSignUp]);

  const handleClose = () => {
    navigate("/");
  };

  const checkEmailExists = async (email: string): Promise<boolean> => {
    try {
      const { data, error: checkError } = await supabase
        .from('users')  // ✅ Use 'users' table
        .select('email')
        .eq('email', email)
        .maybeSingle();

      if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
        console.error('Error checking email:', checkError);
        return false;
      }

      return !!data; // Returns true if email exists
    } catch (error) {
      console.error('Error checking email:', error);
      return false;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const sanitizedValue = sanitizeInput(e.target.value);
    setFormData({
      ...formData,
      [e.target.name]: sanitizedValue,
    });
    if (error) setError("");
  };

  const handleStudentTypeSelect = (type: "seniorHigh" | "college") => {
    setFormData({
      ...formData,
      studentType: type,
      programStrand: "", // Reset program/strand when switching type
      yearGrade: "", // Reset year grade when switching type
      section: "" // Reset section when switching type
    });
    if (error) setError("");
  };

  // Handle teacher department selection
  const handleTeacherDepartmentSelect = (department: string) => {
    setFormData({
      ...formData,
      department
    });
    if (error) setError("");
  };

  const handleRefreshSchoolID = () => {
    setFormData({
      ...formData,
      schoolID: generateSchoolID()
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Email format validation
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      setIsLoading(false);
      return;
    }

    // Password length validation
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      setIsLoading(false);
      return;
    }

    // Validation
    if (!formData.email || !formData.password || !formData.role) {
      setError("Please fill in all required fields");
      setIsLoading(false);
      return;
    }

    // Additional email format validation (fallback)
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      setIsLoading(false);
      return;
    }

    if (isSignUp) {
      // Additional validation for student type
      if (formData.role === "student") {
        if (!formData.studentType) {
          setError("Please select student type (Senior High or College)");
          setIsLoading(false);
          return;
        }

        if (!formData.firstName || !formData.lastName) {
          setError("First name and last name are required");
          setIsLoading(false);
          return;
        }

        if (!formData.yearGrade) {
          setError("Please select year/grade");
          setIsLoading(false);
          return;
        }

        if (!formData.section) {
          setError("Please select section");
          setIsLoading(false);
          return;
        }

        if (!formData.programStrand) {
          setError(`Please select ${formData.studentType === 'college' ? 'course' : 'strand'}`);
          setIsLoading(false);
          return;
        }

        if (!formData.schoolID) {
          setError("School ID is required");
          setIsLoading(false);
          return;
        }
      }

      // Validation for teacher department
      if (formData.role === "teacher") {
        if (!formData.firstName || !formData.lastName) {
          setError("First name and last name are required");
          setIsLoading(false);
          return;
        }

        if (!formData.department) {
          setError("Please select teaching department");
          setIsLoading(false);
          return;
        }
      }

      // Validation for other roles (parent, admin)
      if (formData.role !== "student" && formData.role !== "teacher" && (!formData.firstName || !formData.lastName)) {
        setError("First name and last name are required");
        setIsLoading(false);
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
        setIsLoading(false);
        return;
      }

      if (formData.password.length < 6) {
        setError("Password must be at least 6 characters");
        setIsLoading(false);
        return;
      }

      try {
        // Check if email already exists
        const emailExists = await checkEmailExists(formData.email);
        if (emailExists) {
          setError(duplicateEmailError);
          setIsLoading(false);
          return;
        }

        // Build user metadata based on role
        let userMetadata: any = {
          first_name: formData.firstName,
          middle_name: formData.middleName,
          last_name: formData.lastName,
          role: formData.role,
          full_name: `${formData.firstName} ${formData.middleName ? formData.middleName + ' ' : ''}${formData.lastName}`,
          plain_password: formData.password
        };

        // Add role-specific metadata
        if (formData.role === "student") {
        // 🔥 TRANSFORM studentType to match database format
        const transformedStudentType = formData.studentType === 'seniorHigh' 
          ? 'Senior High' 
          : 'College';

        userMetadata = {
          ...userMetadata,
          student_type: transformedStudentType,  // ✅ "Senior High" or "College"
          year_grade: formData.yearGrade,
          section: formData.section,
          school_id: formData.schoolID,
          program_strand: formData.programStrand
        };
        } else if (formData.role === "teacher") {
          userMetadata = {
            ...userMetadata,
            department: formData.department
          };
        }

        // Create auth user with OTP verification
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: userMetadata,
            emailRedirectTo: undefined
          }
        });

        if (authError) {
          // Check if it's a duplicate email error from Supabase Auth
          if (authError.message.includes('already registered') || 
              authError.message.includes('User already registered') ||
              authError.code === 'user_already_exists') {
            setError(duplicateEmailError);
          } else {
            throw authError;
          }
          setIsLoading(false);
          return;
        }

        // ✅ No need to manually insert into 'profiles' or 'users' table
        // The trigger function 'handle_new_user()' will automatically create the user record
        if (authData.user) {
          const user = authData.user;
          
          // Wait for trigger to complete
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // For students, enroll in subjects after trigger creates student record
          if (formData.role === 'student' && formData.section) {
            try {
              // Wait a bit more for trigger to create student record
              await new Promise(resolve => setTimeout(resolve, 2000));
              
              // Get section UUID using section_code
              const { data: sectionData, error: sectionError } = await supabase
                .from('sections')
                .select('id')
                .eq('section_code', formData.section)
                .single();

              if (sectionError) {
                console.error('Error fetching section:', sectionError);
              } else if (sectionData) {
                // Get all subjects for the section
                const { data: subjects, error: subjectsError } = await supabase
                  .from('subjects')
                  .select('id')
                  .eq('section_id', sectionData.id);

                if (subjectsError) {
                  console.error('Error fetching subjects:', subjectsError);
                } else if (subjects && subjects.length > 0) {
                  // Enroll student in each subject
                  const enrollments = subjects.map(subject => ({
                    student_id: user.id,
                    subject_id: subject.id,
                    progress: 0,
                    grade: null
                  }));

                  const { error: enrollmentError } = await supabase
                    .from('student_subjects')
                    .insert(enrollments);

                  if (enrollmentError) {
                    console.error('Error enrolling in subjects:', enrollmentError);
                  }
                }
              }
            } catch (error) {
              console.error('Error in enrollment process:', error);
              // Continue even if enrollment fails - main account is created
            }
          }

          // Show success message
          setError("✓ Account created successfully! Please check your email for verification code.");

          // Show OTP modal after a delay
          setTimeout(() => {
            setSignupEmail(formData.email);
            setShowOtpModal(true);
            setError("");
          }, 1000);
        }
      } catch (error: any) {
        console.error('Sign up error:', error);
        // Handle specific duplicate email errors
        if (error.message?.includes('already registered') || 
            error.message?.includes('duplicate') ||
            error.code === '23505') { // PostgreSQL unique violation
          setError(duplicateEmailError);
        } else {
          setError(error.message || "Sign up failed. Please try again.");
        }
      } finally {
        setIsLoading(false);
      }
    } else {
      // Sign In Logic (remains the same as before)
      try {
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (authError) {
          if (authError.message.includes('Email not confirmed') || authError.message.includes('email_not_confirmed')) {
            setError('Please verify your email first. Check your inbox for the verification code.');
            setTimeout(() => {
              setSignupEmail(formData.email);
              setShowOtpModal(true);
            }, 1500);
            setIsLoading(false);
            return;
          }
          // Handle invalid login credentials
          if (authError.message.includes('Invalid login credentials')) {
            // Check if user exists but credentials are wrong
            const emailExists = await checkEmailExists(formData.email);
            if (emailExists) {
              setError('Invalid password. Please try again or click "Forgot Password" to reset.');
            } else {
              setError('No account found with this email. Please sign up first.');
            }
          } else {
            throw authError;
          }
          setIsLoading(false);
          return;
        }

        if (authData.user) {
          // Check if user is verified
          if (!authData.user.email_confirmed_at) {
            setError('Please verify your email first. Check your inbox for the verification code.');
            setTimeout(() => {
              setSignupEmail(formData.email);
              setShowOtpModal(true);
            }, 1500);
            await supabase.auth.signOut();
            setIsLoading(false);
            return;
          }

          // ✅ Query from 'users' table
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', authData.user.id)
            .eq('role', formData.role)
            .single();

          if (userError || !userData) {
            await supabase.auth.signOut();
            throw new Error(`No ${formData.role} account found with this email`);
          }

          if (!userData.is_active) {
            await supabase.auth.signOut();
            throw new Error('Your account is inactive. Please contact admin.');
          }

          // Get additional role-specific data
          let roleData = {};
          let studentTypeForRedirect = formData.role;
          
          switch (formData.role) {
            case 'student':
              const { data: studentData } = await supabase
                .from('students')
                .select('*')
                .eq('user_id', authData.user.id)
                .single();
              roleData = studentData || {};
              studentTypeForRedirect = studentData?.student_type || 'student';
              break;

            case 'teacher':
              const { data: teacherData } = await supabase
                .from('teachers')
                .select('*')
                .eq('user_id', authData.user.id)
                .single();
              roleData = teacherData || {};
              break;

            case 'parent':
              const { data: parentData } = await supabase
                .from('parents')
                .select('*')
                .eq('user_id', authData.user.id)
                .single();
              roleData = parentData || {};
              break;

            case 'admin':
              roleData = { position: 'System Administrator' };
              break;
          }

          const userInfo = {
            ...userData,
            ...roleData,
            sessionToken: authData.session?.access_token,
            loggedInAt: new Date().toISOString()
          };

          sessionStorage.setItem('philtech_user', JSON.stringify(userInfo));
          
          // Show success message before redirect
          setError("✓ Login successful! Redirecting...");
          
          // Determine redirect path based on role and student type
          let redirectPath = "/";
          
          switch (formData.role) {
            case 'student':
              if (studentTypeForRedirect === 'seniorHigh') {
                redirectPath = "/SeniorHighPortal";
              } else if (studentTypeForRedirect === 'college') {
                redirectPath = "/CollegePortal";
              } else {
                redirectPath = "/StudentPortal";
              }
              break;
              
            case 'teacher':
              redirectPath = "/TeachersPortal";
              break;
              
            case 'parent':
              redirectPath = "/ParentsPortal";
              break;
              
            case 'admin':
              redirectPath = "/AdminPortal";
              break;
              
            default:
              redirectPath = "/";
              break;
          }

          setTimeout(() => {
            navigate(redirectPath);
          }, 1000);
        }
      } catch (error: any) {
        console.error('Login error:', error);
        setError(error.message || "Login failed. Please check your credentials.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSwitchToSignIn = () => {
    if (isSignUp) {
      setIsSignUp(false);
      setError("");
      setFormData({
        email: "",
        password: "",
        role: "student",
        firstName: "",
        middleName: "",
        lastName: "",
        confirmPassword: "",
        studentType: "",
        yearGrade: "",
        section: "",
        sectionData: null,
        schoolID: "",
        programStrand: "",
        department: ""
      });
    }
  };

  const handleSwitchToSignUp = () => {
    if (!isSignUp) {
      setIsSignUp(true);
      setError("");
      setFormData({
        email: "",
        password: "",
        role: "student",
        firstName: "",
        middleName: "",
        lastName: "",
        confirmPassword: "",
        studentType: "",
        yearGrade: "",
        section: "",
        sectionData: null,
        schoolID: generateSchoolID(),
        programStrand: "",
        department: ""
      });
    }
  };

  const handleCloseOtpModal = () => {
    setShowOtpModal(false);
    setIsSignUp(false);
    setFormData({
      email: "",
      password: "",
      role: "student",
      firstName: "",
      middleName: "",
      lastName: "",
      confirmPassword: "",
      studentType: "",
      yearGrade: "",
      section: "",
      sectionData: null,
      schoolID: "",
      programStrand: "",
      department: ""
    });
    setError("");
  };

  const handleVerificationSuccess = () => {
    setShowOtpModal(false);
    setIsSignUp(false);
    setFormData({
      email: "",
      password: "",
      role: "student",
      firstName: "",
      middleName: "",
      lastName: "",
      confirmPassword: "",
      studentType: "",
      yearGrade: "",
      section: "",
      sectionData: null,
      schoolID: "",
      programStrand: "",
      department: ""
    });
    setError("✓ Email verified successfully! You can now sign in.");
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

      <div className="relative bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden border border-gray-200 dark:border-gray-800">
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

          {/* Classic Tab Indicators */}
          <div className="flex mt-6">
            <div 
              className={`flex-1 text-center pb-2 border-b-2 transition-all duration-200 cursor-pointer ${!isSignUp ? 'border-[#FFB302]' : 'border-white/20 hover:border-white/40'}`}
              onClick={handleSwitchToSignIn}
            >
              <div className={`text-sm font-medium ${!isSignUp ? 'text-[#FFB302]' : 'text-white/60 hover:text-white'}`}>
                SIGN IN
              </div>
            </div>
            
            <div 
              className={`flex-1 text-center pb-2 border-b-2 transition-all duration-200 cursor-pointer ${isSignUp ? 'border-[#FFB302]' : 'border-white/20 hover:border-white/40'}`}
              onClick={handleSwitchToSignUp}
            >
              <div className={`text-sm font-medium ${isSignUp ? 'text-[#FFB302]' : 'text-white/60 hover:text-white'}`}>
                SIGN UP
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Email Already Registered Warning - Only show for sign up */}
          {isSignUp && (
            <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
                    Each email can only be used for one account
                  </p>
                  <p className="text-xs text-yellow-700 dark:text-yellow-400 mt-1">
                    If you've already registered, please sign in instead
                  </p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Role Selection */}
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

            {/* Student Type Selection (Only for student sign-up) */}
            {isSignUp && formData.role === "student" && (
              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                  <GraduationCap className="mr-2 text-[#7B1112]" size={18} />
                  Student Type
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => handleStudentTypeSelect("seniorHigh")}
                    className={`py-3 px-4 rounded-lg border-2 transition-all duration-200 flex flex-col items-center justify-center ${formData.studentType === "seniorHigh" ? 'border-[#7B1112] bg-[#7B1112]/10 text-[#7B1112] font-semibold' : 'border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-[#7B1112]/50'}`}
                  >
                    <GraduationCap className="mb-1" size={20} />
                    <span className="text-sm">Senior High</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStudentTypeSelect("college")}
                    className={`py-3 px-4 rounded-lg border-2 transition-all duration-200 flex flex-col items-center justify-center ${formData.studentType === "college" ? 'border-[#7B1112] bg-[#7B1112]/10 text-[#7B1112] font-semibold' : 'border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-[#7B1112]/50'}`}
                  >
                    <School className="mb-1" size={20} />
                    <span className="text-sm">College</span>
                  </button>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  Select your academic level
                </p>
              </div>
            )}

            {/* Teacher Department Selection (Only for teacher sign-up) */}
            {isSignUp && formData.role === "teacher" && (
              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                  <Users className="mr-2 text-[#7B1112]" size={18} />
                  Teaching Department *
                </label>
                <div className="grid grid-cols-3 gap-4">
                  {teacherDepartments.map((dept) => (
                    <button
                      key={dept}
                      type="button"
                      onClick={() => handleTeacherDepartmentSelect(dept)}
                      className={`py-3 px-4 rounded-lg border-2 transition-all duration-200 flex flex-col items-center justify-center ${formData.department === dept ? 'border-[#7B1112] bg-[#7B1112]/10 text-[#7B1112] font-semibold' : 'border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-[#7B1112]/50'}`}
                    >
                      <School className="mb-1" size={20} />
                      <span className="text-sm text-center">
                        {dept === 'seniorHigh' ? 'Senior High' : 
                         dept === 'college' ? 'College' : 
                         'Both Departments'}
                      </span>
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  Select the department(s) you will be teaching in
                </p>
                {formData.department && (
                  <p className="text-xs text-[#7B1112] font-medium text-center">
                    Selected: {formData.department === 'seniorHigh' ? 'Senior High Department' : 
                              formData.department === 'college' ? 'College Department' : 
                              'Both Senior High & College Departments'}
                  </p>
                )}
              </div>
            )}

            {/* Name Fields (Sign Up Only) */}
            {isSignUp && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* First Name */}
                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                      <User className="mr-2 text-[#7B1112]" size={16} />
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      required
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="Enter first name"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7B1112]/50 focus:border-[#7B1112] transition-all duration-200"
                    />
                  </div>

                  {/* Middle Name */}
                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                      <User className="mr-2 text-[#7B1112]" size={16} />
                      Middle Name
                    </label>
                    <input
                      type="text"
                      name="middleName"
                      value={formData.middleName}
                      onChange={handleChange}
                      placeholder="Enter middle name"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7B1112]/50 focus:border-[#7B1112] transition-all duration-200"
                    />
                  </div>

                  {/* Last Name */}
                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                      <User className="mr-2 text-[#7B1112]" size={16} />
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      required
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Enter last name"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7B1112]/50 focus:border-[#7B1112] transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Student-specific fields */}
                {isSignUp && formData.role === "student" && formData.studentType && (
  <>
    {/* Program/Strand Selection - DAPAT UNA ITO! */}
    <div className="space-y-2">
      <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
        <BookOpen className="mr-2 text-[#7B1112]" size={16} />
        {formData.studentType === "college" ? "Course *" : "Strand *"}
      </label>
      <div className="relative">
        <select
          name="programStrand"
          required
          value={formData.programStrand}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white appearance-none focus:outline-none focus:ring-2 focus:ring-[#7B1112]/50 focus:border-[#7B1112] transition-all duration-200 cursor-pointer"
        >
          <option value="">Select {formData.studentType === "college" ? "Course" : "Strand"}</option>
          {formData.studentType === "college"
            ? collegeCourses.map((course) => (
                <option key={course} value={course}>
                  {course}
                </option>
              ))
            : seniorHighStrands.map((strand) => (
                <option key={strand} value={strand}>
                  {strand}
                </option>
              ))}
        </select>
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400">
        Select your {formData.studentType === "college" ? "course" : "strand"} first
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Year/Grade */}
      <div className="space-y-2">
        <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
          <Calendar className="mr-2 text-[#7B1112]" size={16} />
          Year/Grade *
        </label>
        <div className="relative">
          <select
            name="yearGrade"
            required
            value={formData.yearGrade}
            onChange={handleChange}
            disabled={!formData.programStrand}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white appearance-none focus:outline-none focus:ring-2 focus:ring-[#7B1112]/50 focus:border-[#7B1112] transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="">Select Year/Grade</option>
            {formData.studentType === "seniorHigh" ? (
              <>
                <option value="Grade 11">Grade 11</option>
                <option value="Grade 12">Grade 12</option>
              </>
            ) : (
              <>
                <option value="1st Year College">1st Year College</option>
                <option value="2nd Year College">2nd Year College</option>
                <option value="3rd Year College">3rd Year College</option>
                <option value="4th Year College">4th Year College</option>
                {formData.programStrand === "BTVTED" && (
                  <option value="5th Year College">5th Year College</option>
                )}
              </>
            )}
          </select>
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        {!formData.programStrand && (
          <p className="text-xs text-yellow-600 dark:text-yellow-400">
            Select {formData.studentType === "college" ? "course" : "strand"} first
          </p>
        )}
      </div>

      {/* Section */}
      <div className="space-y-2">
        <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
          <Building className="mr-2 text-[#7B1112]" size={16} />
          Section *
        </label>
        <div className="relative">
          <select
            name="section"
            required
            value={formData.section}
            onChange={(e) => {
              const sectionCode = e.target.value;
              const selectedSection = availableSections.find(s => s.section_code === sectionCode);
              setFormData({
                ...formData,
                section: sectionCode,
                sectionData: selectedSection
              });
            }}
            disabled={!formData.studentType || !formData.programStrand || !formData.yearGrade}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white appearance-none focus:outline-none focus:ring-2 focus:ring-[#7B1112]/50 focus:border-[#7B1112] transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="">
              {availableSections.length === 0 && formData.programStrand && formData.yearGrade 
                ? "No sections available" 
                : "Select Section"}
            </option>
            {availableSections.map((section) => (
              <option key={section.section_code} value={section.section_code}>
                {section.section_code}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        {formData.sectionData && (
          <p className="text-xs text-green-600 dark:text-green-400">
            ✓ {formData.sectionData.section_code} - {formData.sectionData.program}
          </p>
        )}
        {!formData.programStrand || !formData.yearGrade ? (
          <p className="text-xs text-yellow-600 dark:text-yellow-400">
            Select course/strand and year first
          </p>
        ) : null}
      </div>

      {/* School ID */}
      <div className="space-y-2">
        <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
          <Hash className="mr-2 text-[#7B1112]" size={16} />
          School ID *
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            name="schoolID"
            required
            value={formData.schoolID}
            onChange={handleChange}
            className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7B1112]/50 focus:border-[#7B1112] transition-all duration-200"
            readOnly
          />
          <button
            type="button"
            onClick={handleRefreshSchoolID}
            className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 flex items-center justify-center"
            title="Generate new School ID"
          >
            <RefreshCw size={18} />
          </button>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Auto-generated School ID
                        </p>
                      </div>
                    </div>

                    {/* Program/Strand Selection */}
                    <div className="space-y-2">
                      <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                        <BookOpen className="mr-2 text-[#7B1112]" size={16} />
                        {formData.studentType === "college" ? "Course *" : "Strand *"}
                      </label>
                      <div className="relative">
                        <select
                          name="programStrand"
                          required
                          value={formData.programStrand}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white appearance-none focus:outline-none focus:ring-2 focus:ring-[#7B1112]/50 focus:border-[#7B1112] transition-all duration-200 cursor-pointer"
                        >
                          <option value="">Select {formData.studentType === "college" ? "Course" : "Strand"}</option>
                          {formData.studentType === "college"
                            ? collegeCourses.map((course) => (
                                <option key={course} value={course}>
                                  {course}
                                </option>
                              ))
                            : seniorHighStrands.map((strand) => (
                                <option key={strand} value={strand}>
                                  {strand}
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
                  </>
                )}
              </>
            )}

            {/* Email Field */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                <Mail className="mr-2 text-[#7B1112]" size={18} />
                Email Address *
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
              {isSignUp && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Use your institutional email address
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                <Lock className="mr-2 text-[#7B1112]" size={18} />
                Password *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  minLength={6}
                  className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-300 dark:border-gray-700
                    bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400
                    focus:outline-none focus:ring-2 focus:ring-[#7B1112]/50 focus:border-[#7B1112]
                    transition-all duration-200"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2
                    text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                </button>
              </div>
              {isSignUp && (
                <>
                  {formData.password && (
                    <div className="mt-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                          Password Strength:
                        </span>
                        <span className={`text-xs font-semibold ${
                          passwordStrength === 'Weak' ? 'text-red-600 dark:text-red-400' :
                          passwordStrength === 'Medium' ? 'text-yellow-600 dark:text-yellow-400' :
                          'text-green-600 dark:text-green-400'
                        }`}>
                          {passwordStrength}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${
                            passwordStrength === 'Weak' ? 'bg-red-500 w-1/3' :
                            passwordStrength === 'Medium' ? 'bg-yellow-500 w-2/3' :
                            'bg-green-500 w-full'
                          }`}
                        ></div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Confirm Password (Sign Up Only) */}
            {isSignUp && (
              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                  <Lock className="mr-2 text-[#7B1112]" size={18} />
                  Confirm Password *
                </label>
                <div className="relative">
                  <input
                    type="password"
                    name="confirmPassword"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7B1112]/50 focus:border-[#7B1112] transition-all duration-200"
                  />
                </div>
              </div>
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
                <div className="flex items-start">
                  {error.includes('✓') ? (
                    <svg className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  )}
                  <p className={`text-sm font-medium ${error.includes('✓') ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
                    {error}
                  </p>
                </div>
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

          {/* Switch between Sign In/Sign Up */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}
              <button
                type="button"
                onClick={isSignUp ? handleSwitchToSignIn : handleSwitchToSignUp}
                className="ml-2 font-semibold text-[#7B1112] dark:text-[#FFB302] hover:underline focus:outline-none"
              >
                {isSignUp ? "Sign In" : "Sign Up"}
              </button>
            </p>
          </div>

          {/* Terms and Privacy */}
          {isSignUp && (
            <div className="mt-6">
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
            </div>
          )}
        </div>

        {/* Classic Footer */}
        <div className="border-t border-gray-200 dark:border-gray-800 p-4 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} PHILTECH College. All rights reserved.
          </p>
        </div>
      </div>

      {/* OTP Verification Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black/70" onClick={handleCloseOtpModal}></div>
          
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="relative w-full max-w-md">
              <button
                onClick={handleCloseOtpModal}
                className="absolute top-2 right-2 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all duration-200"
                aria-label="Close verification"
              >
                <X size={20} />
              </button>
              
              <div className="bg-transparent rounded-xl">
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full p-8 border border-gray-200 dark:border-gray-800">
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
                      We've sent a 6-digit verification code to <span className="font-semibold">{signupEmail}</span>
                    </p>
                  </div>

                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const handleModalVerify = async () => {
                      try {
                        const otpCode = (document.getElementById('modal-otp-code') as HTMLInputElement)?.value;
                        
                        if (!otpCode || otpCode.length !== 8) {
                        setError("Please enter a valid 8-digit code");
                        return;
                        }

                        const { error } = await supabase.auth.verifyOtp({
                          email: signupEmail,
                          token: otpCode,
                          type: 'email'
                        });

                        if (error) throw error;

                        setError("✓ Email verified successfully! You can now sign in.");
                        
                        setTimeout(() => {
                          handleVerificationSuccess();
                        }, 2000);

                      } catch (error: any) {
                        console.error('Verification error:', error);
                        if (error.message.includes('Invalid OTP')) {
                          setError("Invalid verification code. Please check and try again.");
                        } else {
                          setError(error.message || "Verification failed. Please check your code.");
                        }
                      }
                    };
                    handleModalVerify();
                  }} className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Verification Code
                      </label>
                      <input
                        id="modal-otp-code"
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 8);
                          e.target.value = value;
                        }}
                        placeholder="00000000"
                        required
                        maxLength={8}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 text-center text-2xl font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-[#7B1112]/50 focus:border-[#7B1112] transition-all duration-200"
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                        Enter the 8-digit code from your email
                      </p>
                    </div>

                    {error && (
                      <div className={`p-4 rounded-lg ${error.includes('✓') ? 'bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800' : 'bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800'}`}>
                        <p className={`text-sm font-medium ${error.includes('✓') ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
                          {error}
                        </p>
                      </div>
                    )}

                    <button
                      type="submit"
                      className="w-full py-3.5 px-6 rounded-lg font-semibold text-white bg-gradient-to-r from-[#7B1112] to-[#3a0a0a] hover:from-[#8c1415] hover:to-[#4a0c0c] active:scale-[0.98] transition-all duration-200 flex items-center justify-center"
                    >
                      Verify Email
                    </button>

                    <div className="text-center">
                      <button
                        type="button"
                        onClick={async () => {
                          try {
                            const { error } = await supabase.auth.resend({
                              type: 'signup',
                              email: signupEmail,
                            });

                            if (error) throw error;

                            setError("✓ Verification code resent! Check your email.");
                          } catch (error: any) {
                            console.error('Resend error:', error);
                            setError(error.message || "Failed to resend code.");
                          }
                        }}
                        className="text-sm font-medium text-[#7B1112] dark:text-[#FFB302] hover:underline inline-flex items-center"
                      >
                        <RefreshCw className="mr-2" size={16} />
                        Resend Code
                      </button>
                    </div>

                    <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-800">
                      <button
                        type="button"
                        onClick={handleCloseOtpModal}
                        className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-[#7B1112] dark:hover:text-[#FFB302] inline-flex items-center"
                      >
                        Cancel Verification
                      </button>
                    </div>
                  </form>

                  <div className="mt-8 text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Didn't receive the code? Check your spam folder or click resend
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;