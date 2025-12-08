// loginSecurity.ts - CIA-Based Security Module for Login Protection

/**
 * CIA Security Module for Login Protection
 * 
 * Principles:
 * - Confidentiality: Protect sensitive data from unauthorized access
 * - Integrity: Ensure data accuracy and prevent tampering
 * - Availability: Ensure legitimate users can access the system
 */

import { supabase } from "./supabase";

// ==================== THREAT MITIGATION CATEGORIES ====================

export enum SecurityThreat {
  BRUTE_FORCE = "brute_force",
  CREDENTIAL_STUFFING = "credential_stuffing",
  SESSION_HIJACKING = "session_hijacking",
  SQL_INJECTION = "sql_injection",
  XSS = "cross_site_scripting",
  ACCOUNT_ENUMERATION = "account_enumeration",
  PHISHING = "phishing",
  DDoS = "ddos",
  DATA_EXPOSURE = "data_exposure"
}

export enum SecurityLevel {
  LOW = 1,
  MEDIUM = 2,
  HIGH = 3,
  CRITICAL = 4
}

// ==================== SECURITY CONFIGURATION ====================

interface SecurityConfig {
  // Confidentiality Controls
  encryptionEnabled: boolean;
  dataMaskingEnabled: boolean;
  sessionTimeout: number; // minutes
  secureCookie: boolean;
  
  // Integrity Controls
  inputValidation: boolean;
  csrfProtection: boolean;
  requestSigning: boolean;
  
  // Availability Controls
  rateLimiting: boolean;
  accountLockout: boolean;
  captchaEnabled: boolean;
  
  // Monitoring & Logging
  auditLogging: boolean;
  anomalyDetection: boolean;
  realTimeAlerts: boolean;
}

const DEFAULT_SECURITY_CONFIG: SecurityConfig = {
  encryptionEnabled: true,
  dataMaskingEnabled: true,
  sessionTimeout: 30,
  secureCookie: true,
  
  inputValidation: true,
  csrfProtection: true,
  requestSigning: false,
  
  rateLimiting: true,
  accountLockout: true,
  captchaEnabled: true,
  
  auditLogging: true,
  anomalyDetection: true,
  realTimeAlerts: true
};

// ==================== DATA MASKING (CONFIDENTIALITY) ====================

export class DataMasker {
  /**
   * Mask sensitive data for logging/display (Confidentiality)
   */
  static maskEmail(email: string): string {
    if (!email || email.length < 5) return "***";
    const [localPart, domain] = email.split('@');
    if (!domain) return "***";
    
    const maskedLocal = localPart.length > 2 
      ? localPart.charAt(0) + '*'.repeat(localPart.length - 2) + localPart.charAt(localPart.length - 1)
      : '*'.repeat(localPart.length);
    
    return `${maskedLocal}@${domain}`;
  }

  static maskPassword(): string {
    return "********";
  }

  static maskIPAddress(ip: string): string {
    if (!ip) return "***.***.***.***";
    const parts = ip.split('.');
    if (parts.length !== 4) return "***.***.***.***";
    return `${parts[0]}.${parts[1]}.***.***`;
  }

  static sanitizeLogData(data: Record<string, any>): Record<string, any> {
    const sensitiveFields = ['password', 'token', 'access_token', 'refresh_token', 'secret', 'key', 'ssn'];
    const sanitized = { ...data };
    
    sensitiveFields.forEach(field => {
      if (sanitized[field]) {
        sanitized[field] = '***REDACTED***';
      }
    });
    
    if (sanitized.email) {
      sanitized.email = this.maskEmail(sanitized.email);
    }
    
    if (sanitized.ip) {
      sanitized.ip = this.maskIPAddress(sanitized.ip);
    }
    
    return sanitized;
  }
}

// ==================== INPUT VALIDATION & SANITIZATION (INTEGRITY) ====================

export class InputValidator {
  /**
   * Validate and sanitize all input data (Integrity)
   */
  
  static validateEmail(email: string): { isValid: boolean; error?: string } {
    if (!email) {
      return { isValid: false, error: 'Email is required' };
    }
    
    // Basic email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { isValid: false, error: 'Invalid email format' };
    }
    
    // Check for suspicious patterns
    if (email.length > 254) {
      return { isValid: false, error: 'Email too long' };
    }
    
    // Check for SQL injection patterns
    if (this.containsSQLInjection(email)) {
      return { isValid: false, error: 'Invalid email format' };
    }
    
    // Check for XSS patterns
    if (this.containsXSS(email)) {
      return { isValid: false, error: 'Invalid email format' };
    }
    
    return { isValid: true };
  }

  static validatePassword(password: string): { isValid: boolean; strength: SecurityLevel; error?: string } {
    if (!password) {
      return { isValid: false, strength: SecurityLevel.LOW, error: 'Password is required' };
    }
    
    if (password.length < 8) {
      return { isValid: false, strength: SecurityLevel.LOW, error: 'Password must be at least 8 characters' };
    }
    
    // Check password strength
    const strength = this.calculatePasswordStrength(password);
    
    if (strength === SecurityLevel.LOW) {
      return { 
        isValid: false, 
        strength, 
        error: 'Password too weak. Include uppercase, lowercase, numbers, and special characters' 
      };
    }
    
    // Check for common passwords
    if (this.isCommonPassword(password)) {
      return { 
        isValid: false, 
        strength: SecurityLevel.LOW, 
        error: 'Password is too common. Please choose a stronger password' 
      };
    }
    
    return { isValid: true, strength };
  }

  static validateFullName(name: string): { isValid: boolean; error?: string } {
    if (!name) {
      return { isValid: false, error: 'Full name is required' };
    }
    
    if (name.trim().split(' ').length < 2) {
      return { isValid: false, error: 'Please enter first and last name' };
    }
    
    if (name.length > 100) {
      return { isValid: false, error: 'Name too long' };
    }
    
    // Check for malicious patterns
    if (this.containsSQLInjection(name) || this.containsXSS(name)) {
      return { isValid: false, error: 'Invalid name format' };
    }
    
    return { isValid: true };
  }

  static sanitizeInput(input: string): string {
    if (!input) return '';
    
    // Remove potentially dangerous characters
    return input
      .replace(/[<>"'`;=]/g, '') // Remove HTML/script tags and SQL special chars
      .trim()
      .substring(0, 1000); // Limit length
  }

  private static containsSQLInjection(input: string): boolean {
    const sqlPatterns = [
      /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|ALTER|CREATE|EXEC)\b)/i,
      /(['";])/,
      /(--)/,
      /(\/\*.*\*\/)/,
      /(OR\s+['"]?['"]?=['"]?['"]?)/i
    ];
    
    return sqlPatterns.some(pattern => pattern.test(input));
  }

  private static containsXSS(input: string): boolean {
    const xssPatterns = [
      /<script.*?>.*?<\/script>/i,
      /javascript:/i,
      /on\w+\s*=/i,
      /<.*?>/,
      /eval\s*\(/i,
      /alert\s*\(/i
    ];
    
    return xssPatterns.some(pattern => pattern.test(input));
  }

  private static calculatePasswordStrength(password: string): SecurityLevel {
    let score = 0;
    
    // Length check
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    
    // Character variety
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;
    
    // Deductions for sequential or repeated characters
    if (/(.)\1{2,}/.test(password)) score--;
    if (/(012|123|234|345|456|567|678|789|890)/.test(password)) score--;
    
    if (score >= 6) return SecurityLevel.HIGH;
    if (score >= 4) return SecurityLevel.MEDIUM;
    return SecurityLevel.LOW;
  }

  private static isCommonPassword(password: string): boolean {
    const commonPasswords = [
      'password', '123456', 'qwerty', 'admin', 'welcome',
      'password123', 'abc123', 'letmein', 'monkey', 'dragon'
    ];
    
    return commonPasswords.includes(password.toLowerCase());
  }
}

// ==================== RATE LIMITING & ACCOUNT PROTECTION (AVAILABILITY) ====================

export class AccountProtector {
  private static readonly MAX_ATTEMPTS = 5;
  private static readonly LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes in milliseconds
  private static readonly REQUEST_WINDOW = 5 * 60 * 1000; // 5 minutes in milliseconds
  private static readonly MAX_REQUESTS_PER_WINDOW = 10;

  /**
   * Track and prevent brute force attacks (Availability)
   */
  
  static async checkRateLimit(
    identifier: string, // email or IP
    type: 'login' | 'signup' | 'password_reset'
  ): Promise<{ allowed: boolean; waitTime?: number; message?: string }> {
    const key = `${type}:${identifier}:${Math.floor(Date.now() / this.REQUEST_WINDOW)}`;
    
    try {
      // Store attempts in Supabase for persistence
      const { data, error } = await supabase
        .from('security_logs')
        .select('attempts, last_attempt, locked_until')
        .eq('identifier', identifier)
        .eq('type', type)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        console.error('Rate limit check error:', error);
        // Fail open in case of DB error
        return { allowed: true };
      }
      
      const now = Date.now();
      let attempts = data?.attempts || 0;
      let lockedUntil = data?.locked_until ? new Date(data.locked_until).getTime() : null;
      
      // Check if account is locked
      if (lockedUntil && now < lockedUntil) {
        const waitMinutes = Math.ceil((lockedUntil - now) / 60000);
        return { 
          allowed: false, 
          waitTime: waitMinutes,
          message: `Account temporarily locked. Try again in ${waitMinutes} minutes.` 
        };
      }
      
      // Reset attempts if window expired
      if (data?.last_attempt && (now - new Date(data.last_attempt).getTime()) > this.REQUEST_WINDOW) {
        attempts = 0;
      }
      
      // Check if limit exceeded
      if (attempts >= this.MAX_ATTEMPTS) {
        // Lock the account
        const lockTime = now + this.LOCKOUT_DURATION;
        await supabase
          .from('security_logs')
          .upsert({
            identifier,
            type,
            attempts: attempts + 1,
            last_attempt: new Date().toISOString(),
            locked_until: new Date(lockTime).toISOString()
          });
        
        return { 
          allowed: false, 
          waitTime: Math.ceil(this.LOCKOUT_DURATION / 60000),
          message: 'Too many failed attempts. Account locked for 15 minutes.' 
        };
      }
      
      return { allowed: true };
      
    } catch (error) {
      console.error('Rate limit check failed:', error);
      return { allowed: true }; // Fail open
    }
  }

  static async recordAttempt(
    identifier: string,
    type: 'login' | 'signup' | 'password_reset',
    success: boolean
  ): Promise<void> {
    try {
      const now = new Date().toISOString();
      
      if (success) {
        // Reset attempts on successful login
        await supabase
          .from('security_logs')
          .upsert({
            identifier,
            type,
            attempts: 0,
            last_attempt: now,
            locked_until: null,
            last_success: now
          });
      } else {
        // Increment failed attempts
        const { data } = await supabase
          .from('security_logs')
          .select('attempts')
          .eq('identifier', identifier)
          .eq('type', type)
          .single();
        
        const attempts = (data?.attempts || 0) + 1;
        
        await supabase
          .from('security_logs')
          .upsert({
            identifier,
            type,
            attempts,
            last_attempt: now,
            locked_until: attempts >= this.MAX_ATTEMPTS 
              ? new Date(Date.now() + this.LOCKOUT_DURATION).toISOString()
              : null
          });
      }
    } catch (error) {
      console.error('Failed to record attempt:', error);
    }
  }

  static async checkAccountHealth(email: string): Promise<{
    status: 'healthy' | 'warning' | 'compromised';
    issues: string[];
    lastLogin?: string;
    suspiciousActivity: boolean;
  }> {
    try {
      const { data: logs } = await supabase
        .from('security_logs')
        .select('*')
        .eq('identifier', email)
        .order('created_at', { ascending: false })
        .limit(10);
      
      const issues: string[] = [];
      let suspiciousActivity = false;
      
      if (logs && logs.length > 0) {
        // Check for rapid consecutive failures
        const recentFailures = logs.filter(log => 
          !log.success && 
          new Date(log.created_at).getTime() > Date.now() - 30 * 60 * 1000
        );
        
        if (recentFailures.length >= 3) {
          issues.push('Multiple failed login attempts recently');
          suspiciousActivity = true;
        }
        
        // Check for login from unusual locations (if IP tracking implemented)
        const uniqueIPs = new Set(logs.map(log => log.ip_address).filter(Boolean));
        if (uniqueIPs.size > 3) {
          issues.push('Logins from multiple locations detected');
          suspiciousActivity = true;
        }
      }
      
      return {
        status: suspiciousActivity ? 'warning' : 'healthy',
        issues,
        lastLogin: logs?.find(l => l.success)?.created_at,
        suspiciousActivity
      };
    } catch (error) {
      console.error('Account health check failed:', error);
      return {
        status: 'healthy',
        issues: [],
        suspiciousActivity: false
      };
    }
  }
}

// ==================== SESSION SECURITY (CONFIDENTIALITY & INTEGRITY) ====================

export class SessionSecurity {
  /**
   * Secure session management and anti-hijacking measures
   */
  
  static generateSessionId(): string {
    // Generate cryptographically secure session ID
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  static validateSessionToken(token: string): boolean {
    if (!token || token.length < 64) return false;
    
    // Check token format (basic validation)
    const tokenRegex = /^[a-f0-9]{64,}$/i;
    return tokenRegex.test(token);
  }

  static async verifySessionIntegrity(sessionData: any): Promise<boolean> {
    try {
      if (!sessionData || !sessionData.userId || !sessionData.sessionToken) {
        return false;
      }
      
      // Verify session with backend
      const { data, error } = await supabase
        .from('sessions')
        .select('is_valid, expires_at, user_agent, ip_address')
        .eq('session_token', sessionData.sessionToken)
        .single();
      
      if (error || !data || !data.is_valid) {
        return false;
      }
      
      // Check expiration
      if (new Date(data.expires_at) < new Date()) {
        return false;
      }
      
      // Optional: Verify user agent and IP (for additional security)
      // if (data.user_agent !== navigator.userAgent) {
      //   return false;
      // }
      
      return true;
      
    } catch (error) {
      console.error('Session verification failed:', error);
      return false;
    }
  }

  static storeSecureSession(userInfo: any): void {
    if (!userInfo || !userInfo.id) {
      throw new Error('Invalid user info for session storage');
    }
    
    const secureSession = {
      ...userInfo,
      sessionId: this.generateSessionId(),
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutes
      userAgent: navigator.userAgent
    };
    
    // Store with minimal exposure
    const storageKey = `philtech_session_${secureSession.sessionId}`;
    const encryptedData = this.encryptSessionData(secureSession);
    
    sessionStorage.setItem(storageKey, encryptedData);
    
    // Also store a reference in a separate location
    sessionStorage.setItem('current_session_id', secureSession.sessionId);
  }

  static getSecureSession(): any {
    const sessionId = sessionStorage.getItem('current_session_id');
    if (!sessionId) return null;
    
    const storageKey = `philtech_session_${sessionId}`;
    const encryptedData = sessionStorage.getItem(storageKey);
    
    if (!encryptedData) return null;
    
    try {
      const sessionData = this.decryptSessionData(encryptedData);
      
      // Check expiration
      if (new Date(sessionData.expiresAt) < new Date()) {
        this.clearSession();
        return null;
      }
      
      return sessionData;
    } catch (error) {
      console.error('Failed to retrieve session:', error);
      this.clearSession();
      return null;
    }
  }

  static clearSession(): void {
    const sessionId = sessionStorage.getItem('current_session_id');
    if (sessionId) {
      sessionStorage.removeItem(`philtech_session_${sessionId}`);
    }
    sessionStorage.removeItem('current_session_id');
    sessionStorage.removeItem('philtech_user'); // Clear old format
  }

  private static encryptSessionData(data: any): string {
    // Simple XOR encryption for demo (use proper encryption in production)
    const jsonString = JSON.stringify(data);
    const key = 'secure_key_change_in_production';
    let result = '';
    
    for (let i = 0; i < jsonString.length; i++) {
      result += String.fromCharCode(jsonString.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    
    return btoa(result);
  }

  private static decryptSessionData(encrypted: string): any {
    try {
      const decoded = atob(encrypted);
      const key = 'secure_key_change_in_production';
      let result = '';
      
      for (let i = 0; i < decoded.length; i++) {
        result += String.fromCharCode(decoded.charCodeAt(i) ^ key.charCodeAt(i % key.length));
      }
      
      return JSON.parse(result);
    } catch (error) {
      throw new Error('Failed to decrypt session data');
    }
  }
}

// ==================== AUDIT LOGGING (ALL CIA PRINCIPLES) ====================

export class SecurityAudit {
  /**
   * Comprehensive audit logging for security monitoring
   */
  
  static async logSecurityEvent(
    eventType: string,
    userId: string | null,
    email: string | null,
    details: Record<string, any>,
    threatLevel: SecurityLevel = SecurityLevel.LOW,
    ipAddress?: string
  ): Promise<void> {
    try {
      const sanitizedDetails = DataMasker.sanitizeLogData(details);
      
      const auditLog = {
        event_type: eventType,
        user_id: userId,
        user_email: email ? DataMasker.maskEmail(email) : null,
        threat_level: threatLevel,
        ip_address: ipAddress || 'unknown',
        user_agent: navigator.userAgent,
        details: sanitizedDetails,
        created_at: new Date().toISOString()
      };
      
      // Store in Supabase
      await supabase.from('security_audit_logs').insert(auditLog);
      
      // Also log to console in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`[SECURITY AUDIT] ${eventType}:`, auditLog);
      }
      
    } catch (error) {
      console.error('Failed to log security event:', error);
    }
  }

  static async logLoginAttempt(
    email: string,
    success: boolean,
    reason?: string,
    ipAddress?: string
  ): Promise<void> {
    const threatLevel = success ? SecurityLevel.LOW : SecurityLevel.MEDIUM;
    
    await this.logSecurityEvent(
      success ? 'LOGIN_SUCCESS' : 'LOGIN_FAILURE',
      null,
      email,
      { success, reason },
      threatLevel,
      ipAddress
    );
  }

  static async logSignupAttempt(
    email: string,
    success: boolean,
    reason?: string,
    ipAddress?: string
  ): Promise<void> {
    const threatLevel = success ? SecurityLevel.LOW : SecurityLevel.MEDIUM;
    
    await this.logSecurityEvent(
      success ? 'SIGNUP_SUCCESS' : 'SIGNUP_FAILURE',
      null,
      email,
      { success, reason },
      threatLevel,
      ipAddress
    );
  }

  static async logSuspiciousActivity(
    threatType: SecurityThreat,
    email: string,
    details: Record<string, any>,
    ipAddress?: string
  ): Promise<void> {
    await this.logSecurityEvent(
      `SUSPICIOUS_${threatType.toUpperCase()}`,
      null,
      email,
      details,
      SecurityLevel.HIGH,
      ipAddress
    );
  }
}

// ==================== MAIN SECURITY MANAGER ====================

export class LoginSecurityManager {
  private config: SecurityConfig;
  
  constructor(config: Partial<SecurityConfig> = {}) {
    this.config = { ...DEFAULT_SECURITY_CONFIG, ...config };
  }
  
  /**
   * Comprehensive security validation for login/signup
   */
  async validateLoginRequest(
    email: string,
    password: string,
    role: string,
    isSignUp: boolean = false,
    additionalData?: Record<string, any>
  ): Promise<{
    isValid: boolean;
    errors: string[];
    warnings: string[];
    threatLevel: SecurityLevel;
    sanitizedData?: Record<string, any>;
  }> {
    const errors: string[] = [];
    const warnings: string[] = [];
    let threatLevel = SecurityLevel.LOW;
    
    // ========== INPUT VALIDATION (INTEGRITY) ==========
    const emailValidation = InputValidator.validateEmail(email);
    if (!emailValidation.isValid) {
      errors.push(emailValidation.error || 'Invalid email');
      threatLevel = SecurityLevel.MEDIUM;
    }
    
    const passwordValidation = InputValidator.validatePassword(password);
    if (!passwordValidation.isValid) {
      errors.push(passwordValidation.error || 'Invalid password');
      if (passwordValidation.strength === SecurityLevel.LOW) {
        threatLevel = SecurityLevel.MEDIUM;
      }
    }
    
    // Sanitize all inputs
    const sanitizedData = {
      email: InputValidator.sanitizeInput(email),
      password: InputValidator.sanitizeInput(password),
      role: InputValidator.sanitizeInput(role),
      ...additionalData
    };
    
    // ========== RATE LIMITING CHECK (AVAILABILITY) ==========
    if (this.config.rateLimiting) {
      const rateLimitCheck = await AccountProtector.checkRateLimit(
        email,
        isSignUp ? 'signup' : 'login'
      );
      
      if (!rateLimitCheck.allowed) {
        errors.push(rateLimitCheck.message || 'Too many attempts. Please try again later.');
        threatLevel = SecurityLevel.HIGH;
        
        // Log suspicious activity
        await SecurityAudit.logSuspiciousActivity(
          SecurityThreat.BRUTE_FORCE,
          email,
          { reason: 'Rate limit exceeded' }
        );
      }
    }
    
    // ========== ACCOUNT HEALTH CHECK (CONFIDENTIALITY) ==========
    if (!isSignUp) {
      const accountHealth = await AccountProtector.checkAccountHealth(email);
      if (accountHealth.suspiciousActivity) {
        warnings.push('Suspicious activity detected on this account');
        threatLevel = Math.max(threatLevel, SecurityLevel.MEDIUM);
        
        await SecurityAudit.logSuspiciousActivity(
          SecurityThreat.ACCOUNT_ENUMERATION,
          email,
          { issues: accountHealth.issues }
        );
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      threatLevel,
      sanitizedData: errors.length === 0 ? sanitizedData : undefined
    };
  }
  
  /**
   * Handle secure session creation
   */
  async createSecureSession(userData: any, email: string): Promise<void> {
    // Validate session data
    if (!userData || !userData.id || !userData.role) {
      throw new Error('Invalid user data for session creation');
    }
    
    // Store secure session
    SessionSecurity.storeSecureSession(userData);
    
    // Record successful login
    await AccountProtector.recordAttempt(email, 'login', true);
    
    // Audit log
    await SecurityAudit.logLoginAttempt(email, true);
    
    // Additional security measures based on threat level
    const accountHealth = await AccountProtector.checkAccountHealth(email);
    if (accountHealth.suspiciousActivity) {
      // Trigger additional verification if suspicious activity detected
      await this.triggerAdditionalVerification(email, userData.id);
    }
  }
  
  /**
   * Handle failed login attempt with security measures
   */
  async handleFailedLogin(
    email: string,
    reason: string,
    ipAddress?: string
  ): Promise<void> {
    // Record failed attempt
    await AccountProtector.recordAttempt(email, 'login', false);
    
    // Audit log
    await SecurityAudit.logLoginAttempt(email, false, reason, ipAddress);
    
    // Check if this triggers lockout
    const rateLimit = await AccountProtector.checkRateLimit(email, 'login');
    if (!rateLimit.allowed) {
      await SecurityAudit.logSuspiciousActivity(
        SecurityThreat.BRUTE_FORCE,
        email,
        { reason: 'Account lockout triggered' },
        ipAddress
      );
    }
  }
  
  /**
   * Validate and process signup with security checks
   */
  async validateSignup(
    email: string,
    password: string,
    fullName: string,
    role: string,
    studentType?: string
  ): Promise<{
    isValid: boolean;
    errors: string[];
    sanitizedData?: Record<string, any>;
  }> {
    const errors: string[] = [];
    
    // Validate email
    const emailValidation = InputValidator.validateEmail(email);
    if (!emailValidation.isValid) {
      errors.push(emailValidation.error || 'Invalid email');
    }
    
    // Validate password strength
    const passwordValidation = InputValidator.validatePassword(password);
    if (!passwordValidation.isValid || passwordValidation.strength === SecurityLevel.LOW) {
      errors.push(passwordValidation.error || 'Password too weak');
    }
    
    // Validate full name
    const nameValidation = InputValidator.validateFullName(fullName);
    if (!nameValidation.isValid) {
      errors.push(nameValidation.error || 'Invalid name');
    }
    
    // Check rate limiting for signup
    if (this.config.rateLimiting) {
      const rateLimitCheck = await AccountProtector.checkRateLimit(email, 'signup');
      if (!rateLimitCheck.allowed) {
        errors.push(rateLimitCheck.message || 'Too many signup attempts');
      }
    }
    
    // Sanitize all data
    const sanitizedData = {
      email: InputValidator.sanitizeInput(email),
      password: InputValidator.sanitizeInput(password),
      fullName: InputValidator.sanitizeInput(fullName),
      role: InputValidator.sanitizeInput(role),
      studentType: studentType ? InputValidator.sanitizeInput(studentType) : undefined
    };
    
    return {
      isValid: errors.length === 0,
      errors,
      sanitizedData: errors.length === 0 ? sanitizedData : undefined
    };
  }
  
  private async triggerAdditionalVerification(email: string, userId: string): Promise<void> {
    // Implement additional verification steps like:
    // 1. Email notification about suspicious login
    // 2. 2FA prompt
    // 3. Security question
    
    await SecurityAudit.logSecurityEvent(
      'ADDITIONAL_VERIFICATION_TRIGGERED',
      userId,
      email,
      { reason: 'Suspicious activity detected' },
      SecurityLevel.MEDIUM
    );
  }
  
  /**
   * Get security configuration
   */
  getConfig(): SecurityConfig {
    return { ...this.config };
  }
  
  /**
   * Update security configuration
   */
  updateConfig(updates: Partial<SecurityConfig>): void {
    this.config = { ...this.config, ...updates };
  }
}

// ==================== SECURITY HOOKS FOR REACT ====================

import { useState, useEffect, useCallback } from "react";

export const useLoginSecurity = (config?: Partial<SecurityConfig>) => {
  const [securityManager] = useState(() => new LoginSecurityManager(config));
  const [session, setSession] = useState<any>(null);
  const [sessionValid, setSessionValid] = useState<boolean>(false);
  
  // Check session on mount
  useEffect(() => {
    const checkSession = () => {
      const currentSession = SessionSecurity.getSecureSession();
      setSession(currentSession);
      
      if (currentSession) {
        SessionSecurity.verifySessionIntegrity(currentSession)
          .then(isValid => setSessionValid(isValid))
          .catch(() => setSessionValid(false));
      } else {
        setSessionValid(false);
      }
    };
    
    checkSession();
    
    // Set up periodic session check
    const interval = setInterval(checkSession, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, []);
  
  const validateLogin = useCallback(async (
    email: string,
    password: string,
    role: string,
    isSignUp: boolean = false
  ) => {
    return await securityManager.validateLoginRequest(email, password, role, isSignUp);
  }, [securityManager]);
  
  const createSession = useCallback(async (userData: any, email: string) => {
    await securityManager.createSecureSession(userData, email);
    setSession(SessionSecurity.getSecureSession());
    setSessionValid(true);
  }, [securityManager]);
  
  const logout = useCallback(() => {
    SessionSecurity.clearSession();
    setSession(null);
    setSessionValid(false);
  }, []);
  
  const handleFailedAttempt = useCallback(async (
    email: string,
    reason: string,
    ipAddress?: string
  ) => {
    await securityManager.handleFailedLogin(email, reason, ipAddress);
  }, [securityManager]);
  
  return {
    securityManager,
    session,
    sessionValid,
    validateLogin,
    createSession,
    logout,
    handleFailedAttempt,
    maskEmail: DataMasker.maskEmail,
    maskPassword: DataMasker.maskPassword
  };
};

// ==================== EXPORT UTILITIES ====================

export default {
  DataMasker,
  InputValidator,
  AccountProtector,
  SessionSecurity,
  SecurityAudit,
  LoginSecurityManager,
  SecurityThreat,
  SecurityLevel,
  useLoginSecurity
};