// Auto-generated types for Supabase — extend as schema grows
// In production, generate with: npx supabase gen types typescript

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          user_id: string
          full_name: string | null
          email: string
          avatar_url: string | null
          career_goal: string | null
          experience_level: string | null
          onboarding_completed: boolean
          is_admin: boolean
          created_at: string
          updated_at: string
          username: string | null
        }
        Insert: any
        Update: any
      }
      resumes: {
        Row: {
          id: string
          user_id: string
          name: string
          template_id: string
          data: Json
          ats_score: number | null
          is_public: boolean
          public_slug: string | null
          public_expires_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: any
        Update: any
      }
      resume_versions: {
        Row: {
          id: string
          resume_id: string
          version_number: number
          description: string | null
          data: Json
          created_at: string
        }
        Insert: any
        Update: any
      }
      ats_scans: {
        Row: {
          id: string
          user_id: string
          resume_id: string
          job_description: string | null
          result: Json
          created_at: string
        }
        Insert: any
        Update: any
      }
      job_applications: {
        Row: {
          id: string
          user_id: string
          company: string
          position: string
          job_description: string | null
          job_url: string | null
          application_date: string | null
          status: string
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
        Insert: any
        Update: any
      }
      user_files: {
        Row: {
          id: string
          user_id: string
          name: string
          original_name: string
          storage_path: string
          size: number
          mime_type: string
          category: string
          created_at: string
          updated_at: string
        }
        Insert: any
        Update: any
      }
      ai_usage: {
        Row: {
          id: string
          user_id: string
          task_type: string
          model: string
          prompt_tokens: number
          completion_tokens: number
          total_tokens: number
          created_at: string
        }
        Insert: any
        Update: any
      }
      payments: {
        Row: {
          id: string
          user_id: string
          gateway: string
          transaction_id: string | null
          gateway_order_id: string | null
          amount: number
          currency: string
          status: string
          purpose: string
          metadata: Json
          created_at: string
          verified_at: string | null
        }
        Insert: any
        Update: any
      }
      user_entitlements: {
        Row: {
          id: string
          user_id: string
          free_resume_count: number
          cooldown_started_at: string | null
          cooldown_expires_at: string | null
          paid_resume_credits: number
          updated_at: string
        }
        Insert: any
        Update: any
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: string
          title: string
          message: string
          data: Json
          is_read: boolean
          created_at: string
          read_at: string | null
        }
        Insert: any
        Update: any
      }
    }
  }
}
