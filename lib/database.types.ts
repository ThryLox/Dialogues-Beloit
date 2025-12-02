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
      notifications: {
        Row: {
          id: string
          user_id: string
          type: 'reply' | 'hot_post' | 'mention'
          resource_id: string
          content: string
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: 'reply' | 'hot_post' | 'mention'
          resource_id: string
          content: string
          is_read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: 'reply' | 'hot_post' | 'mention'
          resource_id?: string
          content?: string
          is_read?: boolean
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_resource_id_fkey"
            columns: ["resource_id"]
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          }
        ]
      }
      users: {
        Row: {
          id: string
          email: string
          display_name: string
          avatar_url: string | null
          role: 'user' | 'admin' | 'moderator'
          created_at: string
        }
        Insert: {
          id: string
          email: string
          display_name: string
          avatar_url?: string | null
          role?: 'user' | 'admin' | 'moderator'
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          display_name?: string
          avatar_url?: string | null
          role?: 'user' | 'admin' | 'moderator'
          created_at?: string
        }
      }
      conversations: {
        Row: {
          id: string
          title: string
          body: string
          status: 'live' | 'closed'
          location: string | null
          people: string | null
          topic: string | null
          misc: string | Json | null
          started_at: string
          ended_at: string | null
          author_id: string
          score: number
        }
        Insert: {
          id?: string
          title: string
          body: string
          status?: 'live' | 'closed'
          location?: string | null
          people?: string | null
          topic?: string | null
          misc?: string | Json | null
          started_at?: string
          ended_at?: string | null
          author_id: string
          score?: number
        }
        Update: {
          id?: string
          title?: string
          body?: string
          status?: 'live' | 'closed'
          location?: string | null
          people?: string | null
          topic?: string | null
          misc?: string | Json | null
          started_at?: string
          ended_at?: string | null
          author_id?: string
          score?: number
        }
      }
      comments: {
        Row: {
          id: string
          conversation_id: string
          parent_comment_id: string | null
          author_id: string
          body: string
          created_at: string
          score: number
        }
        Insert: {
          id?: string
          conversation_id: string
          parent_comment_id?: string | null
          author_id: string
          body: string
          created_at?: string
          score?: number
        }
        Update: {
          id?: string
          conversation_id?: string
          parent_comment_id?: string | null
          author_id?: string
          body?: string
          created_at?: string
          score?: number
        }
      }
      conversation_votes: {
        Row: {
          id: string
          user_id: string
          conversation_id: string
          value: number
        }
        Insert: {
          id?: string
          user_id: string
          conversation_id: string
          value: number
        }
        Update: {
          id?: string
          user_id?: string
          conversation_id?: string
          value?: number
        }
      }
      comment_votes: {
        Row: {
          id: string
          user_id: string
          comment_id: string
          value: number
        }
        Insert: {
          id?: string
          user_id: string
          comment_id: string
          value: number
        }
        Update: {
          id?: string
          user_id?: string
          comment_id?: string
          value?: number
        }
      }
      communication_guides: {
        Row: {
          id: string
          title: string
          content: string
          category: string
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          content: string
          category: string
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          content?: string
          category?: string
          created_at?: string
        }
      }
      tags: {
        Row: {
          id: string
          name: string
        }
        Insert: {
          id?: string
          name: string
        }
        Update: {
          id?: string
          name?: string
        }
      }
      conversation_tags: {
        Row: {
          conversation_id: string
          tag_id: string
        }
        Insert: {
          conversation_id: string
          tag_id: string
        }
        Update: {
          conversation_id?: string
          tag_id?: string
        }
      }
    }
  }
}
