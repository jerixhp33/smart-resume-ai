// ============================================================
// SmartResume AI — Core Types
// ============================================================

// ── Auth & Profile ───────────────────────────────────────
export type CareerGoal = 'first_job' | 'internship' | 'better_job' | 'career_change' | 'freelancing'
export type ExperienceLevel = 'student' | 'fresher' | '1_2_years' | '3_5_years' | '5_plus_years'

export interface Profile {
  id: string
  user_id: string
  full_name: string | null
  email: string
  avatar_url: string | null
  career_goal: CareerGoal | null
  experience_level: ExperienceLevel | null
  onboarding_completed: boolean
  is_admin: boolean
  created_at: string
  updated_at: string
}

// ── Resume Data Structure ────────────────────────────────
export interface PersonalInfo {
  full_name: string
  professional_title: string
  email: string
  phone: string
  location: string
  linkedin: string
  github: string
  portfolio: string
  other_links: { label: string; url: string }[]
}

export interface ExperienceItem {
  id: string
  company: string
  position: string
  location: string
  start_date: string
  end_date: string | null
  is_current: boolean
  description: string
  bullets: string[]
  hidden?: boolean
}

export interface InternshipItem {
  id: string
  company: string
  position: string
  location: string
  start_date: string
  end_date: string | null
  is_current: boolean
  description: string
  bullets: string[]
  hidden?: boolean
}

export interface EducationItem {
  id: string
  institution: string
  degree: string
  field_of_study: string
  location: string
  start_date: string
  end_date: string | null
  is_current: boolean
  gpa: string
  achievements: string[]
  hidden?: boolean
}

export interface SkillCategory {
  id: string
  name: string
  skills: string[]
  hidden?: boolean
}

export interface ProjectItem {
  id: string
  name: string
  description: string
  technologies: string[]
  url: string
  github_url: string
  start_date: string
  end_date: string | null
  bullets: string[]
  hidden?: boolean
}

export interface CertificationItem {
  id: string
  name: string
  issuer: string
  date: string
  expiry_date: string | null
  credential_url: string
  credential_id: string
  hidden?: boolean
}

export interface AchievementItem {
  id: string
  title: string
  description: string
  date: string
  hidden?: boolean
}

export interface LanguageItem {
  id: string
  language: string
  proficiency: 'native' | 'fluent' | 'professional' | 'conversational' | 'basic'
  hidden?: boolean
}

export interface VolunteerItem {
  id: string
  organization: string
  role: string
  start_date: string
  end_date: string | null
  is_current: boolean
  description: string
  hidden?: boolean
}

export interface PublicationItem {
  id: string
  title: string
  publisher: string
  date: string
  url: string
  description: string
  hidden?: boolean
}

export interface CustomSection {
  id: string
  title: string
  items: CustomSectionItem[]
  hidden?: boolean
}

export interface CustomSectionItem {
  id: string
  title: string
  subtitle: string
  date: string
  description: string
  bullets: string[]
}

export interface ResumeData {
  personal: PersonalInfo
  summary: string
  experience: ExperienceItem[]
  internships: InternshipItem[]
  education: EducationItem[]
  skills: SkillCategory[]
  projects: ProjectItem[]
  certifications: CertificationItem[]
  achievements: AchievementItem[]
  languages: LanguageItem[]
  volunteer_work: VolunteerItem[]
  publications: PublicationItem[]
  custom_sections: CustomSection[]
  theme?: {
    primaryColor: string
    fontFamily: string
  }
}

export type TemplateId =
  | 'ats-classic'
  | 'ats-modern'
  | 'ats-minimal'
  | 'ats-professional'
  | 'minimal'
  | 'modern'
  | 'tech'
  | 'creative'
  | 'student'
  | 'graduate'

export interface Resume {
  id: string
  user_id: string
  name: string
  template_id: TemplateId
  data: ResumeData
  ats_score: number | null
  is_public: boolean
  public_slug: string | null
  public_expires_at: string | null
  public_views: number
  created_at: string
  updated_at: string
}

export interface ResumeVersion {
  id: string
  resume_id: string
  version_number: number
  description: string | null
  data: ResumeData
  created_at: string
}

// ── ATS ──────────────────────────────────────────────────
export interface ATSScanResult {
  overall_score: number
  keyword_score: number
  skills_score: number
  experience_score: number
  formatting_score: number
  readability_score: number
  matched_keywords: string[]
  missing_keywords: string[]
  formatting_issues: FormattingIssue[]
  suggestions: ATSSuggestion[]
  section_scores: Record<string, number>
  ai_explanation: string
}

export interface FormattingIssue {
  type: string
  severity: 'low' | 'medium' | 'high'
  message: string
  fix: string
}

export interface ATSSuggestion {
  category: string
  priority: 'low' | 'medium' | 'high'
  message: string
  action: string
}

export interface ATSScan {
  id: string
  user_id: string
  resume_id: string
  job_description: string | null
  result: ATSScanResult
  created_at: string
}

// ── Job Analysis ─────────────────────────────────────────
export interface JobAnalysis {
  job_title: string
  company: string | null
  required_skills: string[]
  preferred_skills: string[]
  responsibilities: string[]
  education_requirements: string[]
  experience_requirements: string
  tools_and_technologies: string[]
  important_keywords: string[]
  soft_skills: string[]
  industry: string
  summary: string
}

// ── Job Applications ─────────────────────────────────────
export type ApplicationStatus =
  | 'wishlist'
  | 'applied'
  | 'assessment'
  | 'interview'
  | 'offer'
  | 'rejected'
  | 'withdrawn'

export interface JobApplication {
  id: string
  user_id: string
  company: string
  position: string
  job_description: string | null
  job_url: string | null
  application_date: string | null
  status: ApplicationStatus
  resume_id: string | null
  notes: string | null
  interview_date: string | null
  recruiter_name: string | null
  recruiter_email: string | null
  recruiter_phone: string | null
  salary_range: string | null
  created_at: string
  updated_at: string
}

// ── Files ────────────────────────────────────────────────
export type FileCategory = 'resumes' | 'certificates' | 'documents' | 'other'

export interface UserFile {
  id: string
  user_id: string
  name: string
  original_name: string
  storage_path: string
  size: number
  mime_type: string
  category: FileCategory
  created_at: string
  updated_at: string
}

// ── Notifications ────────────────────────────────────────
export type NotificationType =
  | 'ats_complete'
  | 'pdf_ready'
  | 'payment_success'
  | 'payment_failed'
  | 'cooldown_complete'
  | 'tailoring_complete'
  | 'resume_imported'
  | 'security_alert'
  | 'welcome'
  | 'general'

export interface Notification {
  id: string
  user_id: string
  type: NotificationType
  title: string
  message: string
  data: Record<string, unknown>
  is_read: boolean
  created_at: string
  read_at: string | null
}

// ── Payments ─────────────────────────────────────────────
export type PaymentStatus = 'pending' | 'successful' | 'failed' | 'refunded'
export type PaymentPurpose = 'resume_unlock' | 'subscription' | 'export_credits'

export interface Payment {
  id: string
  user_id: string
  gateway: string
  transaction_id: string | null
  gateway_order_id: string | null
  amount: number
  currency: string
  status: PaymentStatus
  purpose: PaymentPurpose
  metadata: Record<string, unknown>
  created_at: string
  verified_at: string | null
}

// ── Entitlements ─────────────────────────────────────────
export interface UserEntitlement {
  id: string
  user_id: string
  free_resume_count: number
  cooldown_started_at: string | null
  cooldown_expires_at: string | null
  paid_resume_credits: number
  updated_at: string
}

export interface ResumeEligibilityResult {
  can_create: boolean
  reason: 'free' | 'paid_credits' | 'cooldown_expired' | 'cooldown_active' | 'no_credits'
  cooldown_expires_at: string | null
  free_count: number
  paid_credits: number
  next_unlock_option: 'pay' | 'wait' | null
}

// ── AI ───────────────────────────────────────────────────
export type AITaskType =
  | 'grammar_fix'
  | 'short_rewrite'
  | 'bullet_improve'
  | 'summary_improve'
  | 'keyword_extract'
  | 'generate_resume'
  | 'complex_rewrite'
  | 'jd_analyze'
  | 'resume_tailor'
  | 'ats_explain'
  | 'content_review'
  | 'interview_generate'

export interface AIUsage {
  id: string
  user_id: string
  task_type: AITaskType
  model: string
  prompt_tokens: number
  completion_tokens: number
  total_tokens: number
  created_at: string
}

export interface AIImprovement {
  original: string
  improved: string
  changes_made: string[]
  keywords_added: string[]
}

// ── Interview ────────────────────────────────────────────
export interface InterviewQuestion {
  id: string
  category: 'hr' | 'technical' | 'resume_based' | 'jd_based' | 'behavioral'
  question: string
  guidance: string
  difficulty: 'easy' | 'medium' | 'hard'
}

// ── Template ─────────────────────────────────────────────
export interface Template {
  id: TemplateId
  name: string
  category: 'ats' | 'modern' | 'fresher'
  description: string
  is_ats_optimized: boolean
  preview_image: string
  features: string[]
}
