-- Enable extension for generating UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Create updated_at trigger helper function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 2. Create TEMPLATES table
CREATE TABLE IF NOT EXISTS templates (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    is_premium BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Insert standard v1 templates
INSERT INTO templates (id, name, is_premium)
VALUES 
    ('harvard', 'Classic Harvard', FALSE),
    ('modern', 'Modern Tech', FALSE),
    ('creative', 'Creative Bold', FALSE)
ON CONFLICT (id) DO UPDATE 
SET name = EXCLUDED.name, is_premium = EXCLUDED.is_premium;

-- 3. Create RESUMES table
CREATE TABLE IF NOT EXISTS resumes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    session_id TEXT NOT NULL,
    contact JSONB NOT NULL DEFAULT '{}'::jsonb,
    summary TEXT,
    experience JSONB NOT NULL DEFAULT '[]'::jsonb,
    education JSONB NOT NULL DEFAULT '[]'::jsonb,
    skills JSONB NOT NULL DEFAULT '[]'::jsonb,
    raw_source_text TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on resumes
ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;

-- Resumes Policies (strictly restricted to user's own uid)
CREATE POLICY "Enable read access for own resumes" ON resumes
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Enable insert access for own resumes" ON resumes
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable update access for own resumes" ON resumes
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Enable delete access for own resumes" ON resumes
    FOR DELETE USING (auth.uid() = user_id);

-- Create updated_at trigger for resumes
CREATE TRIGGER update_resumes_updated_at
    BEFORE UPDATE ON resumes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();


-- 4. Create JOB_DESCRIPTIONS table
CREATE TABLE IF NOT EXISTS job_descriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    raw_text TEXT NOT NULL,
    parsed_fields JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on job_descriptions
ALTER TABLE job_descriptions ENABLE ROW LEVEL SECURITY;

-- Job Descriptions Policies (strictly restricted to user's own uid)
CREATE POLICY "Enable read access for own job_descriptions" ON job_descriptions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Enable insert access for own job_descriptions" ON job_descriptions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable update access for own job_descriptions" ON job_descriptions
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Enable delete access for own job_descriptions" ON job_descriptions
    FOR DELETE USING (auth.uid() = user_id);


-- 5. Create OPTIMIZATIONS table
CREATE TABLE IF NOT EXISTS optimizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id TEXT NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    resume_id UUID REFERENCES resumes(id) ON DELETE CASCADE NOT NULL,
    job_description_id UUID REFERENCES job_descriptions(id) ON DELETE CASCADE NOT NULL,
    tailored_resume JSONB NOT NULL DEFAULT '{}'::jsonb,
    score_parseability INTEGER NOT NULL CHECK (score_parseability >= 0 AND score_parseability <= 100),
    score_keyword_match INTEGER NOT NULL CHECK (score_keyword_match >= 0 AND score_keyword_match <= 100),
    score_knockout INTEGER NOT NULL CHECK (score_knockout >= 0 AND score_knockout <= 100),
    gaps_identified JSONB NOT NULL DEFAULT '[]'::jsonb,
    template_id TEXT REFERENCES templates(id) ON DELETE SET NULL,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'previewed', 'downloaded')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on optimizations
ALTER TABLE optimizations ENABLE ROW LEVEL SECURITY;

-- Optimizations Policies (strictly restricted to user's own uid)
CREATE POLICY "Enable read access for own optimizations" ON optimizations
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Enable insert access for own optimizations" ON optimizations
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable update access for own optimizations" ON optimizations
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Enable delete access for own optimizations" ON optimizations
    FOR DELETE USING (auth.uid() = user_id);

-- Create updated_at trigger for optimizations
CREATE TRIGGER update_optimizations_updated_at
    BEFORE UPDATE ON optimizations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
