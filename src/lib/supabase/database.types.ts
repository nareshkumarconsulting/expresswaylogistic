export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type QuoteRequestStatus =
  | "New"
  | "Under Review"
  | "Sent to Forwarders"
  | "Awaiting Forwarder Quotes"
  | "Quote Received"
  | "Quoted"
  | "Quote Ready / Email Failed"
  | "Accepted"
  | "Rejected"
  | "Expired";

export type ForwarderStatus = "Active" | "Inactive";

export type QuoteForwarderRequestStatus =
  | "Pending"
  | "Sent"
  | "Delivered"
  | "Awaiting Response"
  | "Quote Received"
  | "No Response"
  | "Declined";

export type QuoteRequestSource =
  | "contact_form"
  | "quote_wizard"
  | "voice_agent"
  | "email";

export type QuoteAiReviewStatus =
  | "needs_review"
  | "needs_info"
  | "confirmed"
  | "dismissed";

export type ClientEmailStatus = "draft" | "sent" | "failed";

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
          pickup_location: string | null;
          delivery_location: string | null;
          required_delivery_date: string | null;
          additional_requirements: string | null;
          currency: string;
          additional_charges: number | null;
          discount: number | null;
          quote_validity: string | null;
          quote_sent_at: string | null;
          quote_sent_to: string | null;
          quote_sent_by: string | null;
          assigned_to: string | null;
          forwarder_cost: number | null;
          margin: number | null;
          selected_forwarder_id: string | null;
          email_intelligence_id: string | null;
          ai_review_status: QuoteAiReviewStatus | null;
          ai_missing_fields: string[];
          ai_completeness: number | null;
          ai_suggested_reply: string | null;
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
          pickup_location?: string | null;
          delivery_location?: string | null;
          required_delivery_date?: string | null;
          additional_requirements?: string | null;
          currency?: string;
          additional_charges?: number | null;
          discount?: number | null;
          quote_validity?: string | null;
          quote_sent_at?: string | null;
          quote_sent_to?: string | null;
          quote_sent_by?: string | null;
          assigned_to?: string | null;
          forwarder_cost?: number | null;
          margin?: number | null;
          selected_forwarder_id?: string | null;
          email_intelligence_id?: string | null;
          ai_review_status?: QuoteAiReviewStatus | null;
          ai_missing_fields?: string[];
          ai_completeness?: number | null;
          ai_suggested_reply?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["quote_requests"]["Insert"]>;
        Relationships: [];
      };
      forwarders: {
        Row: {
          id: string;
          company_name: string;
          contact_person: string | null;
          email: string;
          phone: string | null;
          address: string | null;
          country: string | null;
          service_types: string[];
          origin_locations: string[];
          destination_locations: string[];
          preferred_routes: string | null;
          notes: string | null;
          status: ForwarderStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          company_name: string;
          contact_person?: string | null;
          email: string;
          phone?: string | null;
          address?: string | null;
          country?: string | null;
          service_types?: string[];
          origin_locations?: string[];
          destination_locations?: string[];
          preferred_routes?: string | null;
          notes?: string | null;
          status?: ForwarderStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["forwarders"]["Insert"]>;
        Relationships: [];
      };
      quote_forwarder_requests: {
        Row: {
          id: string;
          quote_request_id: string;
          forwarder_id: string;
          status: QuoteForwarderRequestStatus;
          sent_at: string | null;
          response_at: string | null;
          response_deadline: string | null;
          quotation_amount: number | null;
          currency: string;
          shipping_charges: number | null;
          additional_charges: number | null;
          transit_time: string | null;
          validity: string | null;
          carrier: string | null;
          notes: string | null;
          attachments: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          quote_request_id: string;
          forwarder_id: string;
          status?: QuoteForwarderRequestStatus;
          sent_at?: string | null;
          response_at?: string | null;
          response_deadline?: string | null;
          quotation_amount?: number | null;
          currency?: string;
          shipping_charges?: number | null;
          additional_charges?: number | null;
          transit_time?: string | null;
          validity?: string | null;
          carrier?: string | null;
          notes?: string | null;
          attachments?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["quote_forwarder_requests"]["Insert"]
        >;
        Relationships: [];
      };
      quote_activity: {
        Row: {
          id: string;
          quote_request_id: string;
          action: string;
          message: string;
          actor: string | null;
          metadata: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          quote_request_id: string;
          action: string;
          message: string;
          actor?: string | null;
          metadata?: Json;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["quote_activity"]["Insert"]>;
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
          body: string | null;
          quote_request_id: string | null;
          quote_subtype: string | null;
          quote_action: string | null;
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
          body?: string | null;
          quote_request_id?: string | null;
          quote_subtype?: string | null;
          quote_action?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["email_intelligence"]["Insert"]>;
        Relationships: [];
      };
      client_email_messages: {
        Row: {
          id: string;
          quote_request_id: string | null;
          client_name: string | null;
          client_company: string | null;
          to_recipients: string[];
          cc_recipients: string[];
          bcc_recipients: string[];
          subject: string;
          body_text: string;
          body_html: string;
          prompt: string | null;
          status: ClientEmailStatus;
          provider_message_id: string | null;
          error_message: string | null;
          sent_by: string | null;
          sent_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          quote_request_id?: string | null;
          client_name?: string | null;
          client_company?: string | null;
          to_recipients?: string[];
          cc_recipients?: string[];
          bcc_recipients?: string[];
          subject: string;
          body_text: string;
          body_html: string;
          prompt?: string | null;
          status?: ClientEmailStatus;
          provider_message_id?: string | null;
          error_message?: string | null;
          sent_by?: string | null;
          sent_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["client_email_messages"]["Insert"]
        >;
        Relationships: [];
      };
      email_branding_settings: {
        Row: {
          id: string;
          company_name: string;
          tagline: string | null;
          website_url: string | null;
          contact_email: string | null;
          contact_phone: string | null;
          contact_address: string | null;
          logo_url: string | null;
          signature_html: string | null;
          updated_at: string;
          updated_by: string | null;
        };
        Insert: {
          id?: string;
          company_name: string;
          tagline?: string | null;
          website_url?: string | null;
          contact_email?: string | null;
          contact_phone?: string | null;
          contact_address?: string | null;
          logo_url?: string | null;
          signature_html?: string | null;
          updated_at?: string;
          updated_by?: string | null;
        };
        Update: Partial<
          Database["public"]["Tables"]["email_branding_settings"]["Insert"]
        >;
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
      forwarder_status: ForwarderStatus;
      quote_forwarder_request_status: QuoteForwarderRequestStatus;
      quote_request_source: QuoteRequestSource;
      appointment_source: AppointmentSource;
      appointment_status: AppointmentStatus;
      staff_role: StaffRole;
      email_category: EmailCategory;
      email_urgency: EmailUrgency;
      email_intelligence_status: EmailIntelligenceStatus;
      quote_ai_review_status: QuoteAiReviewStatus;
      client_email_status: ClientEmailStatus;
    };
    CompositeTypes: Record<string, never>;
  };
}
