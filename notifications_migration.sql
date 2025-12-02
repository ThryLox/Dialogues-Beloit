-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('reply', 'hot_post', 'mention')),
  resource_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own notifications
CREATE POLICY "Users can view their own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

-- Policy: System/Server can insert notifications (users generally don't insert directly, but for now we allow auth users to trigger if needed via server actions)
-- Ideally, insertions happen via secure server functions, but for simplicity in this setup:
CREATE POLICY "Users can insert notifications" ON notifications
  FOR INSERT WITH CHECK (auth.uid() = user_id OR auth.uid() IS NOT NULL); 

-- Policy: Users can update their own notifications (mark as read)
CREATE POLICY "Users can update their own notifications" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);
