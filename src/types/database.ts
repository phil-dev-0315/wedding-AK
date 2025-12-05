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
      guests: {
        Row: {
          id: number;
          full_name: string;
          additionals: number;
          is_vip: boolean;
          is_attending: boolean | null;
          parent_id: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          full_name: string;
          additionals?: number;
          is_vip?: boolean;
          is_attending?: boolean | null;
          parent_id?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          full_name?: string;
          additionals?: number;
          is_vip?: boolean;
          is_attending?: boolean | null;
          parent_id?: number | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}

export type Guest = Database['public']['Tables']['guests']['Row'];
export type GuestInsert = Database['public']['Tables']['guests']['Insert'];
export type GuestUpdate = Database['public']['Tables']['guests']['Update'];
