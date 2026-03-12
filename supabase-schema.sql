-- SUPABASE DATABASE SCHEMA FOR MUKITX

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- USERS TABLE
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- COURSES TABLE
CREATE TABLE IF NOT EXISTS courses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  instructor TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  thumbnail_url TEXT,
  type TEXT CHECK (type IN ('recorded', 'live')),
  intro_video_url TEXT,
  duration TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- COURSE VIDEOS
CREATE TABLE IF NOT EXISTS course_videos (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  video_url TEXT NOT NULL,
  order_index INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- LIVE CLASSES
CREATE TABLE IF NOT EXISTS live_classes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  zoom_link TEXT NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  image_url TEXT,
  download_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ORDERS & PAYMENTS
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  item_id UUID NOT NULL,
  item_type TEXT CHECK (item_type IN ('course', 'product')),
  item_name TEXT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  payment_number TEXT NOT NULL,
  transaction_id TEXT UNIQUE NOT NULL,
  screenshot_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- TESTIMONIALS
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  photo TEXT,
  country TEXT,
  profession TEXT,
  feedback TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- TEAM MEMBERS
CREATE TABLE IF NOT EXISTS team_members (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  photo TEXT,
  bio TEXT,
  display_order INTEGER DEFAULT 0,
  x_link TEXT,
  github_link TEXT,
  linkedin_link TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- PORTFOLIO PROJECTS
CREATE TABLE IF NOT EXISTS portfolio_projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT,
  image TEXT,
  link TEXT,
  tech TEXT[],
  result TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- BLOG POSTS
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  author_id UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- SETTINGS TABLE
CREATE TABLE IF NOT EXISTS settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Initial Settings
INSERT INTO settings (key, value, description) 
VALUES 
('bkash_number', '01700000000', 'Official bKash Personal Number'),
('rocket_number', '01800000000', 'Official Rocket Personal Number')
ON CONFLICT (key) DO NOTHING;

-- RLS RULES
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE live_classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE live_classes ENABLE ROW LEVEL SECURITY;

-- Policies (Drop and Recreate for idempotency)
DO $$ 
BEGIN
    -- Profiles
    DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
    CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
    DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
    CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

    -- Courses
    DROP POLICY IF EXISTS "Public read courses" ON courses;
    CREATE POLICY "Public read courses" ON courses FOR SELECT USING (true);
    DROP POLICY IF EXISTS "Admin manage courses" ON courses;
    CREATE POLICY "Admin manage courses" ON courses FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

    -- Course Videos
    DROP POLICY IF EXISTS "Public read course videos" ON course_videos;
    CREATE POLICY "Public read course videos" ON course_videos FOR SELECT USING (true);
    DROP POLICY IF EXISTS "Admin manage course videos" ON course_videos;
    CREATE POLICY "Admin manage course videos" ON course_videos FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

    -- Live Classes
    DROP POLICY IF EXISTS "Public read live classes" ON live_classes;
    CREATE POLICY "Public read live classes" ON live_classes FOR SELECT USING (true);
    DROP POLICY IF EXISTS "Admin manage live classes" ON live_classes;
    CREATE POLICY "Admin manage live classes" ON live_classes FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

    -- Products
    DROP POLICY IF EXISTS "Public read products" ON products;
    CREATE POLICY "Public read products" ON products FOR SELECT USING (true);
    DROP POLICY IF EXISTS "Admin manage products" ON products;
    CREATE POLICY "Admin manage products" ON products FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

    -- Portfolio
    DROP POLICY IF EXISTS "Public read portfolio" ON portfolio_projects;
    CREATE POLICY "Public read portfolio" ON portfolio_projects FOR SELECT USING (true);
    DROP POLICY IF EXISTS "Admin manage portfolio" ON portfolio_projects;
    CREATE POLICY "Admin manage portfolio" ON portfolio_projects FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

    -- Team
    DROP POLICY IF EXISTS "Public read team" ON team_members;
    CREATE POLICY "Public read team" ON team_members FOR SELECT USING (true);
    DROP POLICY IF EXISTS "Admin manage team" ON team_members;
    CREATE POLICY "Admin manage team" ON team_members FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

    -- Testimonials
    DROP POLICY IF EXISTS "Public read testimonials" ON testimonials;
    CREATE POLICY "Public read testimonials" ON testimonials FOR SELECT USING (true);
    DROP POLICY IF EXISTS "Admin manage testimonials" ON testimonials;
    CREATE POLICY "Admin manage testimonials" ON testimonials FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

    -- Blog Posts
    DROP POLICY IF EXISTS "Public read blog posts" ON blog_posts;
    CREATE POLICY "Public read blog posts" ON blog_posts FOR SELECT USING (true);
    DROP POLICY IF EXISTS "Admin manage blog posts" ON blog_posts;
    CREATE POLICY "Admin manage blog posts" ON blog_posts FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

    -- Settings
    DROP POLICY IF EXISTS "Public read settings" ON settings;
    CREATE POLICY "Public read settings" ON settings FOR SELECT USING (true);
    DROP POLICY IF EXISTS "Admin manage settings" ON settings;
    CREATE POLICY "Admin manage settings" ON settings FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

    -- Orders
    DROP POLICY IF EXISTS "Users view own orders" ON orders;
    CREATE POLICY "Users view own orders" ON orders FOR SELECT USING (auth.uid() = user_id);
    DROP POLICY IF EXISTS "Admin manage orders" ON orders;
    CREATE POLICY "Admin manage orders" ON orders FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
END $$;

-- TRIGGER FUNCTION
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url, role)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url',
    CASE 
      WHEN NEW.email = 'mukituislamnishat@gmail.com' THEN 'admin'
      ELSE 'user'
    END
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RECREATE TRIGGER
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
