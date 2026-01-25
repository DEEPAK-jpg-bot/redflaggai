export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      profiles: {
        Row: {
          avatar_url: string | null
          company_name: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          monthly_scan_limit: number
          scans_used_this_month: number
          stripe_customer_id: string | null
          subscription_ends_at: string | null
          subscription_plan: Database["public"]["Enums"]["subscription_plan"]
          subscription_started_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          company_name?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id?: string
          monthly_scan_limit?: number
          scans_used_this_month?: number
          stripe_customer_id?: string | null
          subscription_ends_at?: string | null
          subscription_plan?: Database["public"]["Enums"]["subscription_plan"]
          subscription_started_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          company_name?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          monthly_scan_limit?: number
          scans_used_this_month?: number
          stripe_customer_id?: string | null
          subscription_ends_at?: string | null
          subscription_plan?: Database["public"]["Enums"]["subscription_plan"]
          subscription_started_at?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      scans: {
        Row: {
          asking_price: number
          bank_data: Json | null
          company_name: string
          completed_at: string | null
          created_at: string
          customer_churn: Json | null
          ebitda_bridge: Json | null
          id: string
          industry: string
          ledger_data: Json | null
          personal_expenses: Json | null
          revenue_analysis: Json | null
          risk_level: Database["public"]["Enums"]["risk_level"] | null
          risk_score: number | null
          status: Database["public"]["Enums"]["scan_status"]
          user_id: string
        }
        Insert: {
          asking_price?: number
          bank_data?: Json | null
          company_name: string
          completed_at?: string | null
          created_at?: string
          customer_churn?: Json | null
          ebitda_bridge?: Json | null
          id?: string
          industry: string
          ledger_data?: Json | null
          personal_expenses?: Json | null
          revenue_analysis?: Json | null
          risk_level?: Database["public"]["Enums"]["risk_level"] | null
          risk_score?: number | null
          status?: Database["public"]["Enums"]["scan_status"]
          user_id: string
        }
        Update: {
          asking_price?: number
          bank_data?: Json | null
          company_name?: string
          completed_at?: string | null
          created_at?: string
          customer_churn?: Json | null
          ebitda_bridge?: Json | null
          id?: string
          industry?: string
          ledger_data?: Json | null
          personal_expenses?: Json | null
          revenue_analysis?: Json | null
          risk_level?: Database["public"]["Enums"]["risk_level"] | null
          risk_score?: number | null
          status?: Database["public"]["Enums"]["scan_status"]
          user_id?: string
        }
        Relationships: []
      }
      subscription_events: {
        Row: {
          amount_cents: number | null
          created_at: string
          event_type: string
          id: string
          plan: Database["public"]["Enums"]["subscription_plan"] | null
          stripe_event_id: string | null
          user_id: string
        }
        Insert: {
          amount_cents?: number | null
          created_at?: string
          event_type: string
          id?: string
          plan?: Database["public"]["Enums"]["subscription_plan"] | null
          stripe_event_id?: string | null
          user_id: string
        }
        Update: {
          amount_cents?: number | null
          created_at?: string
          event_type?: string
          id?: string
          plan?: Database["public"]["Enums"]["subscription_plan"] | null
          stripe_event_id?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_create_scan: { Args: { user_uuid: string }; Returns: boolean }
      reset_monthly_scan_counts: { Args: never; Returns: undefined }
    }
    Enums: {
      risk_level: "low" | "medium" | "high"
      scan_status: "pending" | "processing" | "completed" | "failed"
      subscription_plan: "free" | "hunter" | "firm"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      risk_level: ["low", "medium", "high"],
      scan_status: ["pending", "processing", "completed", "failed"],
      subscription_plan: ["free", "hunter", "firm"],
    },
  },
} as const
