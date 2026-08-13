export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type QuoteRequestStatus =
  | "New"
  | "In Review"
  | "Quoted"
  | "Won"
  | "Closed";

export type QuoteRequestSource =
  | "contact_form"
  | "quote_wizard"
  | "voice_agent";

export type AppointmentSource = "form" | "voice_agent";

export type AppointmentStatus =
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled";

export type StaffRole = "admin" | "ops" | "viewer";

export type EmailCategory = "shipment" | "quotation" | "alert" | "general";
export type EmailUrgency = "low" | "medium" | "high" | "critical";
export type EmailIntelligenceStatus = "new" | "read" | "actioned" | "archived";

export interface Database {
  public: {
    Tables: {
      staff_profiles: {
        Row: {
          user_id: string;
          email: string;
          full_name: string | null;
          role: StaffRole;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          email: string;
          full_name?: string | null;
          role?: StaffRole;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["staff_profiles"]["Insert"]>;
        Relationships: [];
      };
      quote_requests: {
        Row: {
          id: string;
          source: QuoteRequestSource;
          status: QuoteRequestStatus;
          name: string;
          company: string;
          company_address: string | null;
          email: string;
          phone: string | null;
          origin: string;
          destination: string;
          service_type: string | null;
          product_type: string | null;
          total_packages: number | null;
          approx_weight: string | null;
          container_size: string | null;
          container_type: string | null;
          value_inr: number | null;
          message: string;
          payload: Json;
          internal_notes: string | null;
          quoted_amount: string | null;
          submitted_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          source: QuoteRequestSource;
          status?: QuoteRequestStatus;
          name: string;
          company: string;
          company_address?: string | null;
          email: string;
          phone?: string | null;
          origin: string;
          destination: string;
          service_type?: string | null;
          product_type?: string | null;
          total_packages?: number | null;
          approx_weight?: string | null;
          container_size?: string | null;
          container_type?: string | null;
          value_inr?: number | null;
          message?: string;
          payload?: Json;
          internal_notes?: string | null;
          quoted_amount?: string | null;
          submitted_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["quote_requests"]["Insert"]>;
        Relationships: [];
      };
      appointments: {
        Row: {
          id: string;
          source: AppointmentSource;
          status: AppointmentStatus;
          name: string;
          company: string;
          email: string;
          phone: string;
          appointment_type: string;
          preferred_date: string;
          preferred_time: string;
          meeting_mode: string;
          notes: string | null;
          payload: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          source?: AppointmentSource;
          status?: AppointmentStatus;
          name: string;
          company: string;
          email: string;
          phone: string;
          appointment_type: string;
          preferred_date: string;
          preferred_time: string;
          meeting_mode: string;
          notes?: string | null;
          payload?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["appointments"]["Insert"]>;
        Relationships: [];
      };
      email_intelligence: {
        Row: {
          id: string;
          source_account: string;
          external_message_id: string | null;
          sender_email: string;
          sender_name: string | null;
          subject: string;
          received_at: string;
          category: EmailCategory;
          confidence: number | null;
          summary: string | null;
          extracted_data: Json;
          status: EmailIntelligenceStatus;
          urgency: EmailUrgency | null;
          has_attachments: boolean;
          attachment_names: string[];
          processed_at: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          source_account: string;
          external_message_id?: string | null;
          sender_email: string;
          sender_name?: string | null;
          subject: string;
          received_at: string;
          category: EmailCategory;
          confidence?: number | null;
          summary?: string | null;
          extracted_data?: Json;
          status?: EmailIntelligenceStatus;
          urgency?: EmailUrgency | null;
          has_attachments?: boolean;
          attachment_names?: string[];
          processed_at?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["email_intelligence"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_staff: {
        Args: Record<string, never>;
        Returns: boolean;
      };
    };
    Enums: {
      quote_request_status: QuoteRequestStatus;
      quote_request_source: QuoteRequestSource;
      appointment_source: AppointmentSource;
      appointment_status: AppointmentStatus;
      staff_role: StaffRole;
      email_category: EmailCategory;
      email_urgency: EmailUrgency;
      email_intelligence_status: EmailIntelligenceStatus;
    };
    CompositeTypes: Record<string, never>;
  };
}
