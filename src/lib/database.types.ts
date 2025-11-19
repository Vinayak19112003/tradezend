export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          display_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          display_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          display_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      accounts: {
        Row: {
          id: string
          user_id: string
          name: string
          initial_balance: number
          current_balance: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          initial_balance?: number
          current_balance?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          initial_balance?: number
          current_balance?: number
          created_at?: string
          updated_at?: string
        }
      }
      trades: {
        Row: {
          id: string
          user_id: string
          account_id: string
          date: string
          asset: string
          strategy: string
          direction: 'Buy' | 'Sell'
          entry_time: string | null
          exit_time: string | null
          entry_price: number
          sl: number
          rr: number
          exit_price: number
          result: 'Win' | 'Loss' | 'BE' | 'Missed'
          confidence: number
          mistakes: string[]
          rules_followed: string[]
          model_followed: Json
          notes: string | null
          screenshot_url: string
          account_size: number
          risk_percentage: number
          pnl: number
          ticket: string | null
          pre_trade_emotion: string | null
          post_trade_emotion: string | null
          market_context: string | null
          entry_reason: string | null
          trade_feelings: string | null
          loss_analysis: string | null
          session: 'London' | 'New York' | 'Asian' | null
          key_level: string | null
          entry_time_frame: '1m' | '3m' | '5m' | '15m' | '1h' | '4h' | 'Daily' | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          account_id: string
          date: string
          asset: string
          strategy: string
          direction: 'Buy' | 'Sell'
          entry_time?: string | null
          exit_time?: string | null
          entry_price?: number
          sl?: number
          rr?: number
          exit_price?: number
          result: 'Win' | 'Loss' | 'BE' | 'Missed'
          confidence?: number
          mistakes?: string[]
          rules_followed?: string[]
          model_followed?: Json
          notes?: string | null
          screenshot_url?: string
          account_size?: number
          risk_percentage?: number
          pnl?: number
          ticket?: string | null
          pre_trade_emotion?: string | null
          post_trade_emotion?: string | null
          market_context?: string | null
          entry_reason?: string | null
          trade_feelings?: string | null
          loss_analysis?: string | null
          session?: 'London' | 'New York' | 'Asian' | null
          key_level?: string | null
          entry_time_frame?: '1m' | '3m' | '5m' | '15m' | '1h' | '4h' | 'Daily' | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          account_id?: string
          date?: string
          asset?: string
          strategy?: string
          direction?: 'Buy' | 'Sell'
          entry_time?: string | null
          exit_time?: string | null
          entry_price?: number
          sl?: number
          rr?: number
          exit_price?: number
          result?: 'Win' | 'Loss' | 'BE' | 'Missed'
          confidence?: number
          mistakes?: string[]
          rules_followed?: string[]
          model_followed?: Json
          notes?: string | null
          screenshot_url?: string
          account_size?: number
          risk_percentage?: number
          pnl?: number
          ticket?: string | null
          pre_trade_emotion?: string | null
          post_trade_emotion?: string | null
          market_context?: string | null
          entry_reason?: string | null
          trade_feelings?: string | null
          loss_analysis?: string | null
          session?: 'London' | 'New York' | 'Asian' | null
          key_level?: string | null
          entry_time_frame?: '1m' | '3m' | '5m' | '15m' | '1h' | '4h' | 'Daily' | null
          created_at?: string
          updated_at?: string
        }
      }
      user_settings: {
        Row: {
          id: string
          user_id: string
          currency: 'usd' | 'inr'
          streamer_mode: boolean
          daily_target: number
          weekly_target: number
          monthly_target: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          currency?: 'usd' | 'inr'
          streamer_mode?: boolean
          daily_target?: number
          weekly_target?: number
          monthly_target?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          currency?: 'usd' | 'inr'
          streamer_mode?: boolean
          daily_target?: number
          weekly_target?: number
          monthly_target?: number
          created_at?: string
          updated_at?: string
        }
      }
      strategies: {
        Row: {
          id: string
          user_id: string
          name: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          created_at?: string
        }
      }
      assets: {
        Row: {
          id: string
          user_id: string
          name: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          created_at?: string
        }
      }
      mistake_tags: {
        Row: {
          id: string
          user_id: string
          name: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          created_at?: string
        }
      }
      trading_rules: {
        Row: {
          id: string
          user_id: string
          name: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          created_at?: string
        }
      }
      trading_model: {
        Row: {
          id: string
          user_id: string
          week: string[]
          day: string[]
          trigger: string[]
          ltf: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          week?: string[]
          day?: string[]
          trigger?: string[]
          ltf?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          week?: string[]
          day?: string[]
          trigger?: string[]
          ltf?: string[]
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
