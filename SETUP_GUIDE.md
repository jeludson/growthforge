# GrowthForge AI - Supabase Setup & Deployment Guide

## 📋 Prerequisites
1. Node.js (v18 or later)
2. A Supabase account (https://supabase.com)
3. Your Supabase project credentials

---

## 🔧 Step 1: Configure Supabase Credentials

### Update Environment Files

#### 1. Server (`server/.env`)
```env
PORT=5000
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_KEY=your_service_role_key_here
JWT_SECRET=your_strong_jwt_secret_here
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
```

#### 2. Client (create `client/.env`)
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
VITE_API_URL=http://localhost:5000/api
```

---

## 🗄️ Step 2: Create Supabase Database Tables

Run these SQL queries in your Supabase SQL Editor:

```sql
-- Users Table
CREATE TABLE users (
  id UUID DEFAULT auth.uid() PRIMARY KEY,
  name TEXT,
  email TEXT UNIQUE,
  website_url TEXT,
  business_category TEXT,
  location TEXT,
  competitors TEXT[],
  onboarding_complete BOOLEAN DEFAULT false,
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reports Table
CREATE TABLE reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  website_score INTEGER,
  seo_score INTEGER,
  performance_score INTEGER,
  lead_potential INTEGER,
  seo_data JSONB,
  performance_data JSONB,
  audit_issues JSONB,
  ai_suggestions TEXT[],
  seo_trend JSONB,
  competitor_comparison JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Leads Table
CREATE TABLE leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  business_name TEXT,
  owner_name TEXT,
  phone TEXT,
  email TEXT,
  status TEXT DEFAULT 'New',
  notes TEXT,
  follow_up_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Competitors Table
CREATE TABLE competitors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT,
  url TEXT,
  seo INTEGER,
  speed INTEGER,
  traffic INTEGER,
  blog_frequency INTEGER,
  social_activity INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Messages Table
CREATE TABLE messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT,
  role TEXT CHECK (role IN ('user', 'assistant')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE competitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own data" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view their own reports" ON reports
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own reports" ON reports
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own leads" ON leads
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can modify their own leads" ON leads
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own competitors" ON competitors
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can modify their own competitors" ON competitors
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own messages" ON messages
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own messages" ON messages
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

---

## 🔐 About JWT (JSON Web Tokens)

### What is JWT?
JWT is a secure way to transmit information between parties as a JSON object. In GrowthForge AI:

1. **User logs in** → Server verifies credentials
2. **Server creates JWT** → Contains user ID and expiration
3. **Client stores JWT** → Usually in localStorage
4. **Client sends JWT** → In Authorization header for API requests
5. **Server verifies JWT** → Grants access if valid

### JWT in This Project
- `JWT_SECRET`: Secret key to sign tokens (keep this safe!)
- `JWT_EXPIRE`: How long tokens last (e.g., `7d` = 7 days)
- Tokens are sent in headers: `Authorization: Bearer <token>`

---

## 🚀 Deployment Options

### Option 1: Vercel + Supabase (Recommended)

#### Frontend to Vercel
1. Push your code to GitHub
2. Go to https://vercel.com
3. Import your repository
4. Add environment variables in Vercel dashboard
5. Deploy!

#### Backend to Railway
1. Push your code to GitHub
2. Go to https://railway.app
3. New Project → Deploy from repo
4. Add environment variables
5. Deploy!

### Option 2: Full Vercel
- Frontend: Vercel (free)
- Backend: Vercel Functions (serverless)
- Database: Supabase (free tier)

---

## 📱 Running Locally

### Start Backend
```bash
cd server
npm install
npm start
```
Runs on http://localhost:5000

### Start Frontend
```bash
cd client
npm install
npm run dev
```
Runs on http://localhost:5173

---

## 🔑 Admin Panel
- Access admin at: `/admin`
- To make a user admin: Update `is_admin` column in Supabase users table to `true`

---

## 🎯 Next Steps
1. ✅ Enter your Supabase credentials in .env files
2. ✅ Run the SQL queries in Supabase
3. ✅ Start the servers and test!
4. ✅ Deploy when ready!

Need help? Check Supabase docs: https://supabase.com/docs
