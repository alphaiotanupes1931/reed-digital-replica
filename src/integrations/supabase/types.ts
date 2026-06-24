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
      accountant_invites: {
        Row: {
          accepted_at: string | null
          accountant_user_id: string | null
          created_at: string
          email: string
          id: string
          invite_token: string
          owner_user_id: string
          revoked_at: string | null
          updated_at: string
        }
        Insert: {
          accepted_at?: string | null
          accountant_user_id?: string | null
          created_at?: string
          email: string
          id?: string
          invite_token: string
          owner_user_id: string
          revoked_at?: string | null
          updated_at?: string
        }
        Update: {
          accepted_at?: string | null
          accountant_user_id?: string | null
          created_at?: string
          email?: string
          id?: string
          invite_token?: string
          owner_user_id?: string
          revoked_at?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      accountant_settings: {
        Row: {
          created_at: string
          id: string
          owner_user_id: string
          published: boolean
          share_passcode_hash: string | null
          share_token: string | null
          show_bills: boolean
          show_invoices: boolean
          show_notes: boolean
          show_taxes: boolean
          show_writeoffs: boolean
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          owner_user_id: string
          published?: boolean
          share_passcode_hash?: string | null
          share_token?: string | null
          show_bills?: boolean
          show_invoices?: boolean
          show_notes?: boolean
          show_taxes?: boolean
          show_writeoffs?: boolean
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          owner_user_id?: string
          published?: boolean
          share_passcode_hash?: string | null
          share_token?: string | null
          show_bills?: boolean
          show_invoices?: boolean
          show_notes?: boolean
          show_taxes?: boolean
          show_writeoffs?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      bank_transactions: {
        Row: {
          account_id: string | null
          amount: number
          category: string | null
          created_at: string
          id: string
          is_write_off: boolean | null
          iso_currency_code: string | null
          merchant_name: string | null
          name: string
          owner_user_id: string
          pending: boolean
          plaid_item_id: string | null
          reviewed_at: string | null
          transaction_id: string
          txn_date: string
          updated_at: string
        }
        Insert: {
          account_id?: string | null
          amount: number
          category?: string | null
          created_at?: string
          id?: string
          is_write_off?: boolean | null
          iso_currency_code?: string | null
          merchant_name?: string | null
          name: string
          owner_user_id: string
          pending?: boolean
          plaid_item_id?: string | null
          reviewed_at?: string | null
          transaction_id: string
          txn_date: string
          updated_at?: string
        }
        Update: {
          account_id?: string | null
          amount?: number
          category?: string | null
          created_at?: string
          id?: string
          is_write_off?: boolean | null
          iso_currency_code?: string | null
          merchant_name?: string | null
          name?: string
          owner_user_id?: string
          pending?: boolean
          plaid_item_id?: string | null
          reviewed_at?: string | null
          transaction_id?: string
          txn_date?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bank_transactions_plaid_item_id_fkey"
            columns: ["plaid_item_id"]
            isOneToOne: false
            referencedRelation: "plaid_items"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          company_name: string
          contract_hidden: boolean
          contract_signed_at: string | null
          contract_signed_name: string | null
          contract_text: string | null
          created_at: string
          email: string
          id: string
          maintenance_plan: string | null
          owner_name: string | null
          owner_user_id: string | null
          phases: Json
          project_build_cost: string | null
          project_estimated_total: string | null
          project_maintenance_cost: string | null
          project_type: string | null
          scope_of_work: string | null
          sow_comments: Json
          sow_hidden: boolean
          sow_status: string
        }
        Insert: {
          company_name: string
          contract_hidden?: boolean
          contract_signed_at?: string | null
          contract_signed_name?: string | null
          contract_text?: string | null
          created_at?: string
          email: string
          id?: string
          maintenance_plan?: string | null
          owner_name?: string | null
          owner_user_id?: string | null
          phases?: Json
          project_build_cost?: string | null
          project_estimated_total?: string | null
          project_maintenance_cost?: string | null
          project_type?: string | null
          scope_of_work?: string | null
          sow_comments?: Json
          sow_hidden?: boolean
          sow_status?: string
        }
        Update: {
          company_name?: string
          contract_hidden?: boolean
          contract_signed_at?: string | null
          contract_signed_name?: string | null
          contract_text?: string | null
          created_at?: string
          email?: string
          id?: string
          maintenance_plan?: string | null
          owner_name?: string | null
          owner_user_id?: string | null
          phases?: Json
          project_build_cost?: string | null
          project_estimated_total?: string | null
          project_maintenance_cost?: string | null
          project_type?: string | null
          scope_of_work?: string | null
          sow_comments?: Json
          sow_hidden?: boolean
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
          owner_user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          note_date?: string
          note_type?: string
          owner_user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          note_date?: string
          note_type?: string
          owner_user_id?: string | null
        }
        Relationships: []
      }
      email_send_log: {
        Row: {
          created_at: string
          error_message: string | null
          id: string
          message_id: string | null
          metadata: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email?: string
          status?: string
          template_name?: string
        }
        Relationships: []
      }
      email_send_state: {
        Row: {
          auth_email_ttl_minutes: number
          batch_size: number
          id: number
          retry_after_until: string | null
          send_delay_ms: number
          transactional_email_ttl_minutes: number
          updated_at: string
        }
        Insert: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Update: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Relationships: []
      }
      email_unsubscribe_tokens: {
        Row: {
          created_at: string
          email: string
          id: string
          token: string
          used_at: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          token: string
          used_at?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          token?: string
          used_at?: string | null
        }
        Relationships: []
      }
      extra_income: {
        Row: {
          category: string
          created_at: string
          id: string
          notes: string | null
          owner_user_id: string | null
          price: number
          source: string
          updated_at: string
        }
        Insert: {
          category?: string
          created_at?: string
          id?: string
          notes?: string | null
          owner_user_id?: string | null
          price?: number
          source: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          notes?: string | null
          owner_user_id?: string | null
          price?: number
          source?: string
          updated_at?: string
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
          owner_user_id: string | null
          title: string
        }
        Insert: {
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          description?: string | null
          id?: string
          owner_user_id?: string | null
          title: string
        }
        Update: {
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          description?: string | null
          id?: string
          owner_user_id?: string | null
          title?: string
        }
        Relationships: []
      }
      invoices: {
        Row: {
          client_id: string
          created_at: string
          deactivated: boolean
          deliverables: Json | null
          deposit_amount: number | null
          deposit_due_date: string | null
          deposit_paid: boolean
          deposit_required: boolean
          due_date: string
          hidden_from_client: boolean
          id: string
          message: string | null
          owner_user_id: string | null
          paid_at: string | null
          payment_method: string
          payment_plan: string
          payment_type: string
          plan_end_date: string | null
          plan_monthly_amount: number | null
          plan_months: number | null
          plan_start_date: string | null
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
          deactivated?: boolean
          deliverables?: Json | null
          deposit_amount?: number | null
          deposit_due_date?: string | null
          deposit_paid?: boolean
          deposit_required?: boolean
          due_date: string
          hidden_from_client?: boolean
          id?: string
          message?: string | null
          owner_user_id?: string | null
          paid_at?: string | null
          payment_method?: string
          payment_plan?: string
          payment_type?: string
          plan_end_date?: string | null
          plan_monthly_amount?: number | null
          plan_months?: number | null
          plan_start_date?: string | null
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
          deactivated?: boolean
          deliverables?: Json | null
          deposit_amount?: number | null
          deposit_due_date?: string | null
          deposit_paid?: boolean
          deposit_required?: boolean
          due_date?: string
          hidden_from_client?: boolean
          id?: string
          message?: string | null
          owner_user_id?: string | null
          paid_at?: string | null
          payment_method?: string
          payment_plan?: string
          payment_type?: string
          plan_end_date?: string | null
          plan_monthly_amount?: number | null
          plan_months?: number | null
          plan_start_date?: string | null
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
      month_closes: {
        Row: {
          closed_at: string
          created_at: string
          id: string
          month: number
          owner_user_id: string
          updated_at: string
          year: number
        }
        Insert: {
          closed_at?: string
          created_at?: string
          id?: string
          month: number
          owner_user_id: string
          updated_at?: string
          year: number
        }
        Update: {
          closed_at?: string
          created_at?: string
          id?: string
          month?: number
          owner_user_id?: string
          updated_at?: string
          year?: number
        }
        Relationships: []
      }
      monthly_bills: {
        Row: {
          company_name: string
          created_at: string
          hidden: boolean
          id: string
          notes: string | null
          owner_user_id: string | null
          price: number
          updated_at: string
        }
        Insert: {
          company_name: string
          created_at?: string
          hidden?: boolean
          id?: string
          notes?: string | null
          owner_user_id?: string | null
          price?: number
          updated_at?: string
        }
        Update: {
          company_name?: string
          created_at?: string
          hidden?: boolean
          id?: string
          notes?: string | null
          owner_user_id?: string | null
          price?: number
          updated_at?: string
        }
        Relationships: []
      }
      plaid_items: {
        Row: {
          access_token: string
          created_at: string
          cursor: string | null
          id: string
          institution_name: string | null
          item_id: string
          last_synced_at: string | null
          owner_user_id: string
          updated_at: string
        }
        Insert: {
          access_token: string
          created_at?: string
          cursor?: string | null
          id?: string
          institution_name?: string | null
          item_id: string
          last_synced_at?: string | null
          owner_user_id: string
          updated_at?: string
        }
        Update: {
          access_token?: string
          created_at?: string
          cursor?: string | null
          id?: string
          institution_name?: string | null
          item_id?: string
          last_synced_at?: string | null
          owner_user_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          accountant_email: string | null
          accountant_name: string | null
          birthdate: string | null
          business_id: string | null
          business_name: string | null
          cashapp_handle: string | null
          created_at: string
          full_name: string | null
          id: string
          last_accountant_notified_at: string | null
          onboarded: boolean
          payment_methods: string[]
          phone: string | null
          primary_goal: string | null
          recovery_setup_complete: boolean
          referral_source: string | null
          role: string | null
          security_answer_1_hash: string | null
          security_answer_2_hash: string | null
          security_question_1: string | null
          security_question_2: string | null
          stripe_customer_id: string | null
          stripe_secret_key: string | null
          subscribed: boolean
          updated_at: string
          user_id: string
          zelle_handle: string | null
        }
        Insert: {
          accountant_email?: string | null
          accountant_name?: string | null
          birthdate?: string | null
          business_id?: string | null
          business_name?: string | null
          cashapp_handle?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          last_accountant_notified_at?: string | null
          onboarded?: boolean
          payment_methods?: string[]
          phone?: string | null
          primary_goal?: string | null
          recovery_setup_complete?: boolean
          referral_source?: string | null
          role?: string | null
          security_answer_1_hash?: string | null
          security_answer_2_hash?: string | null
          security_question_1?: string | null
          security_question_2?: string | null
          stripe_customer_id?: string | null
          stripe_secret_key?: string | null
          subscribed?: boolean
          updated_at?: string
          user_id: string
          zelle_handle?: string | null
        }
        Update: {
          accountant_email?: string | null
          accountant_name?: string | null
          birthdate?: string | null
          business_id?: string | null
          business_name?: string | null
          cashapp_handle?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          last_accountant_notified_at?: string | null
          onboarded?: boolean
          payment_methods?: string[]
          phone?: string | null
          primary_goal?: string | null
          recovery_setup_complete?: boolean
          referral_source?: string | null
          role?: string | null
          security_answer_1_hash?: string | null
          security_answer_2_hash?: string | null
          security_question_1?: string | null
          security_question_2?: string | null
          stripe_customer_id?: string | null
          stripe_secret_key?: string | null
          subscribed?: boolean
          updated_at?: string
          user_id?: string
          zelle_handle?: string | null
        }
        Relationships: []
      }
      suppressed_emails: {
        Row: {
          created_at: string
          email: string
          id: string
          metadata: Json | null
          reason: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          metadata?: Json | null
          reason: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          metadata?: Json | null
          reason?: string
        }
        Relationships: []
      }
      tax_expenses: {
        Row: {
          amount: number
          category: string
          created_at: string
          description: string
          entry_date: string
          id: string
          owner_user_id: string
          receipt_note: string | null
          updated_at: string
        }
        Insert: {
          amount?: number
          category?: string
          created_at?: string
          description: string
          entry_date?: string
          id?: string
          owner_user_id: string
          receipt_note?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string
          description?: string
          entry_date?: string
          id?: string
          owner_user_id?: string
          receipt_note?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      tax_income_entries: {
        Row: {
          amount: number
          created_at: string
          entry_date: string
          id: string
          invoice_id: string | null
          notes: string | null
          owner_user_id: string
          source: string
          updated_at: string
        }
        Insert: {
          amount?: number
          created_at?: string
          entry_date?: string
          id?: string
          invoice_id?: string | null
          notes?: string | null
          owner_user_id: string
          source: string
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          entry_date?: string
          id?: string
          invoice_id?: string | null
          notes?: string | null
          owner_user_id?: string
          source?: string
          updated_at?: string
        }
        Relationships: []
      }
      tax_mileage_entries: {
        Row: {
          created_at: string
          entry_date: string
          gas_amount: number
          id: string
          miles: number
          owner_user_id: string
          purpose: string
          updated_at: string
          vehicle: string | null
        }
        Insert: {
          created_at?: string
          entry_date?: string
          gas_amount?: number
          id?: string
          miles?: number
          owner_user_id: string
          purpose: string
          updated_at?: string
          vehicle?: string | null
        }
        Update: {
          created_at?: string
          entry_date?: string
          gas_amount?: number
          id?: string
          miles?: number
          owner_user_id?: string
          purpose?: string
          updated_at?: string
          vehicle?: string | null
        }
        Relationships: []
      }
      tax_reminders: {
        Row: {
          amount: number
          created_at: string
          due_date: string | null
          id: string
          notes: string | null
          owner_user_id: string | null
          paid: boolean
          title: string
          updated_at: string
        }
        Insert: {
          amount?: number
          created_at?: string
          due_date?: string | null
          id?: string
          notes?: string | null
          owner_user_id?: string | null
          paid?: boolean
          title: string
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          due_date?: string | null
          id?: string
          notes?: string | null
          owner_user_id?: string | null
          paid?: boolean
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      tax_w2_entries: {
        Row: {
          created_at: string
          employer: string
          federal_withheld: number
          gross_wages: number
          id: string
          notes: string | null
          owner_user_id: string
          state_withheld: number
          updated_at: string
          year: number
        }
        Insert: {
          created_at?: string
          employer: string
          federal_withheld?: number
          gross_wages?: number
          id?: string
          notes?: string | null
          owner_user_id: string
          state_withheld?: number
          updated_at?: string
          year?: number
        }
        Update: {
          created_at?: string
          employer?: string
          federal_withheld?: number
          gross_wages?: number
          id?: string
          notes?: string | null
          owner_user_id?: string
          state_withheld?: number
          updated_at?: string
          year?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      delete_email: {
        Args: { message_id: number; queue_name: string }
        Returns: boolean
      }
      enqueue_email: {
        Args: { payload: Json; queue_name: string }
        Returns: number
      }
      gen_business_id: { Args: never; Returns: string }
      list_businesses: {
        Args: never
        Returns: {
          business_name: string
          cashapp_handle: string
          has_stripe: boolean
          owner_name: string
          payment_methods: string[]
          user_id: string
          zelle_handle: string
        }[]
      }
      lookup_business_by_code: {
        Args: { p_code: string }
        Returns: {
          business_name: string
          cashapp_handle: string
          has_stripe: boolean
          owner_name: string
          payment_methods: string[]
          user_id: string
          zelle_handle: string
        }[]
      }
      move_to_dlq: {
        Args: {
          dlq_name: string
          message_id: number
          payload: Json
          source_queue: string
        }
        Returns: number
      }
      read_email_batch: {
        Args: { batch_size: number; queue_name: string; vt: number }
        Returns: {
          message: Json
          msg_id: number
          read_ct: number
        }[]
      }
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
