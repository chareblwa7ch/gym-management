export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      members: {
        Row: {
          id: string;
          full_name: string;
          phone: string;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          full_name: string;
          phone: string;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          phone?: string;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      subscriptions: {
        Row: {
          id: string;
          member_id: string;
          amount: number;
          payment_date: string;
          expiry_date: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          member_id: string;
          amount?: number;
          payment_date: string;
          expiry_date: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          member_id?: string;
          amount?: number;
          payment_date?: string;
          expiry_date?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "subscriptions_member_id_fkey";
            columns: ["member_id"];
            isOneToOne: false;
            referencedRelation: "members";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: {
      create_member_with_subscription: {
        Args: {
          p_full_name: string;
          p_phone: string;
          p_notes?: string | null;
          p_payment_date: string;
        };
        Returns: string;
      };
      renew_membership: {
        Args: {
          p_member_id: string;
          p_payment_date: string;
        };
        Returns: string;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

export type MemberRow = Database["public"]["Tables"]["members"]["Row"];
export type SubscriptionRow = Database["public"]["Tables"]["subscriptions"]["Row"];

export type MembershipStatus =
  | "active"
  | "expiring-soon"
  | "expired"
  | "no-subscription";

export type MemberWithSubscription = MemberRow & {
  latestSubscription: SubscriptionRow | null;
  status: MembershipStatus;
  daysRemaining: number | null;
  relativeExpiry: string;
};

export type DashboardCounts = {
  totalMembers: number;
  activeMembers: number;
  expiringSoonMembers: number;
  expiredMembers: number;
};

export type RecentActivityItem = {
  id: string;
  amount: number;
  payment_date: string;
  expiry_date: string;
  created_at: string;
  member: Pick<MemberRow, "id" | "full_name" | "phone"> | null;
};
