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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      clients: {
        Row: {
          company_name: string
          created_at: string
          email: string
          id: string
          maintenance_plan: string | null
          owner_name: string | null
          phases: Json
          project_build_cost: string | null
          project_estimated_total: string | null
          project_maintenance_cost: string | null
          project_type: string | null
          scope_of_work: string | null
          sow_comments: Json
          sow_status: string
        }
        Insert: {
          company_name: string
          created_at?: string
          email: string
          id?: string
          maintenance_plan?: string | null
          owner_name?: string | null
          phases?: Json
          project_build_cost?: string | null
          project_estimated_total?: string | null
          project_maintenance_cost?: string | null
          project_type?: string | null
          scope_of_work?: string | null
          sow_comments?: Json
          sow_status?: string
        }
        Update: {
          company_name?: string
          created_at?: string
          email?: string
          id?: string
          maintenance_plan?: string | null
          owner_name?: string | null
          phases?: Json
          project_build_cost?: string | null
          project_estimated_total?: string | null
          project_maintenance_cost?: string | null
          project_type?: string | null
          scope_of_work?: string | null
          sow_comments?: Json
          sow_status?: string
        }
        Relationships: []
      }
      daily_notes: {
        Row: {
          content: string
          created_at: string
          id: string
          note_date: string
          note_type: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          note_date?: string
          note_type?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          note_date?: string
          note_type?: string
        }
        Relationships: []
      }
      goals: {
        Row: {
          completed: boolean
          completed_at: string | null
          created_at: string
          description: string | null
          id: string
          title: string
        }
        Insert: {
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          description?: string | null
          id?: string
          title: string
        }
        Update: {
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          description?: string | null
          id?: string
          title?: string
        }
        Relationships: []
      }
      invoices: {
        Row: {
          client_id: string
          created_at: string
          deliverables: Json | null
          deposit_amount: number | null
          deposit_due_date: string | null
          deposit_paid: boolean
          deposit_required: boolean
          due_date: string
          id: string
          message: string | null
          payment_method: string
          payment_type: string
          price: number
          service: string
          status: Database["public"]["Enums"]["invoice_status"]
          stripe_checkout_session_id: string | null
          stripe_payment_intent_id: string | null
          stripe_subscription_id: string | null
          updated_at: string
        }
        Insert: {
          client_id: string
          created_at?: string
          deliverables?: Json | null
          deposit_amount?: number | null
          deposit_due_date?: string | null
          deposit_paid?: boolean
          deposit_required?: boolean
          due_date: string
          id?: string
          message?: string | null
          payment_method?: string
          payment_type?: string
          price: number
          service: string
          status?: Database["public"]["Enums"]["invoice_status"]
          stripe_checkout_session_id?: string | null
          stripe_payment_intent_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
        }
        Update: {
          client_id?: string
          created_at?: string
          deliverables?: Json | null
          deposit_amount?: number | null
          deposit_due_date?: string | null
          deposit_paid?: boolean
          deposit_required?: boolean
          due_date?: string
          id?: string
          message?: string | null
          payment_method?: string
          payment_type?: string
          price?: number
          service?: string
          status?: Database["public"]["Enums"]["invoice_status"]
          stripe_checkout_session_id?: string | null
          stripe_payment_intent_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      monthly_bills: {
        Row: {
          company_name: string
          created_at: string
          id: string
          notes: string | null
          price: number
          updated_at: string
        }
        Insert: {
          company_name: string
          created_at?: string
          id?: string
          notes?: string | null
          price?: number
          updated_at?: string
        }
        Update: {
          company_name?: string
          created_at?: string
          id?: string
          notes?: string | null
          price?: number
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      invoice_status: "draft" | "approved" | "sent" | "paid"
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
      invoice_status: ["draft", "approved", "sent", "paid"],
    },
  },
} as const
