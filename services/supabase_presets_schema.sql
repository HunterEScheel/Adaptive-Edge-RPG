-- Schema for character presets in Supabase

-- Character preset master table - stores basic info
CREATE TABLE character_presets (
    id BIGSERIAL PRIMARY KEY,
    preset_name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', now()) NOT NULL,
    tags TEXT[], -- Optional tags for easier searching and categorization
    
    -- Basic Character Info
    character_name TEXT NOT NULL,
    character_race TEXT,
    character_class TEXT,
    character_level INTEGER DEFAULT 1,
    build_points INTEGER DEFAULT 0,
    energy INTEGER DEFAULT 0,
    max_energy INTEGER DEFAULT 0,
    hit_points INTEGER DEFAULT 0,
    max_hit_points INTEGER DEFAULT 0,
    ac INTEGER DEFAULT 0,
    movement INTEGER DEFAULT 0,
    
    -- Stats
    str INTEGER DEFAULT 0,
    dex INTEGER DEFAULT 0,
    con INTEGER DEFAULT 0,
    int INTEGER DEFAULT 0,
    wis INTEGER DEFAULT 0,
    cha INTEGER DEFAULT 0,
    
    -- Additional fields
    gold NUMERIC(10, 2) DEFAULT 0,
    magic_school_credit BOOLEAN DEFAULT false
);

-- Skills table for character presets
CREATE TABLE preset_skills (
    id BIGSERIAL PRIMARY KEY,
    preset_id BIGINT REFERENCES character_presets(id) ON DELETE CASCADE,
    skill_name TEXT NOT NULL,
    skill_level INTEGER DEFAULT 1,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', now()) NOT NULL
);

-- Magic schools table
CREATE TABLE preset_magic_schools (
    id BIGSERIAL PRIMARY KEY,
    preset_id BIGINT REFERENCES character_presets(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', now()) NOT NULL
);

-- Spells table
CREATE TABLE preset_spells (
    id BIGSERIAL PRIMARY KEY,
    preset_id BIGINT REFERENCES character_presets(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    school TEXT NOT NULL,  -- Name of the magic school this spell belongs to
    description TEXT,
    energy_cost INTEGER DEFAULT 0,
    build_point_cost INTEGER DEFAULT 0,
    damage TEXT,
    range TEXT,
    duration TEXT,
    area TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', now()) NOT NULL
);

-- Flaws table
CREATE TABLE preset_flaws (
    id BIGSERIAL PRIMARY KEY,
    preset_id BIGINT REFERENCES character_presets(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    severity TEXT NOT NULL,  -- 'quirk', 'flaw', or 'vice'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', now()) NOT NULL
);

-- Attacks table
CREATE TABLE preset_attacks (
    id BIGSERIAL PRIMARY KEY,
    preset_id BIGINT REFERENCES character_presets(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    build_point_cost INTEGER DEFAULT 0,
    energy_cost INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', now()) NOT NULL
);

-- Passives table
CREATE TABLE preset_passives (
    id BIGSERIAL PRIMARY KEY,
    preset_id BIGINT REFERENCES character_presets(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    build_point_cost INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', now()) NOT NULL
);

-- Notes table
CREATE TABLE preset_notes (
    id BIGSERIAL PRIMARY KEY,
    preset_id BIGINT REFERENCES character_presets(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', now()) NOT NULL
);

-- NPCs table
CREATE TABLE preset_npcs (
    id BIGSERIAL PRIMARY KEY,
    preset_id BIGINT REFERENCES character_presets(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    relationship_level INTEGER DEFAULT 0,  -- -3 to +3 scale
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', now()) NOT NULL
);

-- Create indexes for better query performance
CREATE INDEX idx_character_presets_name ON character_presets (preset_name);
CREATE INDEX idx_preset_skills_preset_id ON preset_skills (preset_id);
CREATE INDEX idx_preset_magic_schools_preset_id ON preset_magic_schools (preset_id);
CREATE INDEX idx_preset_spells_preset_id ON preset_spells (preset_id);
CREATE INDEX idx_preset_flaws_preset_id ON preset_flaws (preset_id);
CREATE INDEX idx_preset_attacks_preset_id ON preset_attacks (preset_id);
CREATE INDEX idx_preset_passives_preset_id ON preset_passives (preset_id);
CREATE INDEX idx_preset_notes_preset_id ON preset_notes (preset_id);
CREATE INDEX idx_preset_npcs_preset_id ON preset_npcs (preset_id);

-- Set up Row Level Security (similar to your existing tables)
ALTER TABLE character_presets ENABLE ROW LEVEL SECURITY;
ALTER TABLE preset_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE preset_magic_schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE preset_spells ENABLE ROW LEVEL SECURITY;
ALTER TABLE preset_flaws ENABLE ROW LEVEL SECURITY;
ALTER TABLE preset_attacks ENABLE ROW LEVEL SECURITY;
ALTER TABLE preset_passives ENABLE ROW LEVEL SECURITY;
ALTER TABLE preset_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE preset_npcs ENABLE ROW LEVEL SECURITY;

-- Allow read access to all users
CREATE POLICY "Allow read access for all users" ON character_presets
    FOR SELECT USING (true);

CREATE POLICY "Allow read access for all users" ON preset_skills
    FOR SELECT USING (true);

CREATE POLICY "Allow read access for all users" ON preset_magic_schools
    FOR SELECT USING (true);

CREATE POLICY "Allow read access for all users" ON preset_spells
    FOR SELECT USING (true);

CREATE POLICY "Allow read access for all users" ON preset_flaws
    FOR SELECT USING (true);

CREATE POLICY "Allow read access for all users" ON preset_attacks
    FOR SELECT USING (true);

CREATE POLICY "Allow read access for all users" ON preset_passives
    FOR SELECT USING (true);

CREATE POLICY "Allow read access for all users" ON preset_notes
    FOR SELECT USING (true);

CREATE POLICY "Allow read access for all users" ON preset_npcs
    FOR SELECT USING (true);

-- Allow write access for service role (or authenticated if you implement auth)
CREATE POLICY "Allow write access for service role" ON character_presets
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow write access for service role" ON preset_skills
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow write access for service role" ON preset_magic_schools
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow write access for service role" ON preset_spells
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow write access for service role" ON preset_flaws
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow write access for service role" ON preset_attacks
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow write access for service role" ON preset_passives
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow write access for service role" ON preset_notes
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow write access for service role" ON preset_npcs
    FOR INSERT WITH CHECK (true);

-- Update triggers for updated_at
CREATE OR REPLACE FUNCTION update_preset_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_character_presets_updated_at
BEFORE UPDATE ON character_presets
FOR EACH ROW
EXECUTE FUNCTION update_preset_updated_at();
