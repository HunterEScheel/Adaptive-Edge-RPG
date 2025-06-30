-- ============================================
-- D&D 5E SPELLS SCHEMA
-- ============================================
-- This schema stores spell data imported from the D&D 5e API

-- Drop existing table if you need to recreate (WARNING: This will delete all data!)
-- DROP TABLE IF EXISTS dnd_spells CASCADE;

-- Main spells table
CREATE TABLE IF NOT EXISTS dnd_spells (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Basic spell information
    name TEXT NOT NULL UNIQUE,
    level INTEGER NOT NULL DEFAULT 0,
    school TEXT NOT NULL,
    api_index TEXT, -- The index used by the D&D API
    
    -- Spell details
    description TEXT,
    higher_level TEXT,
    range TEXT,
    components TEXT[] DEFAULT '{}',
    material TEXT,
    ritual BOOLEAN DEFAULT false,
    duration TEXT,
    concentration BOOLEAN DEFAULT false,
    casting_time TEXT,
    
    -- Damage information
    damage_type TEXT,
    damage_at_slot_level JSONB,
    damage_at_character_level JSONB,
    
    -- Healing information
    healing_at_slot_level JSONB,
    
    -- Area of effect
    area_of_effect_type TEXT,
    area_of_effect_size INTEGER,
    
    -- Classes that can use this spell
    classes TEXT[] DEFAULT '{}',
    subclasses TEXT[] DEFAULT '{}',
    
    -- DC information
    dc_type TEXT,
    dc_success TEXT,
    
    -- Attack type
    attack_type TEXT,
    
    -- Metadata
    url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', now()) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_dnd_spells_name ON dnd_spells (name);
CREATE INDEX IF NOT EXISTS idx_dnd_spells_level ON dnd_spells (level);
CREATE INDEX IF NOT EXISTS idx_dnd_spells_school ON dnd_spells (school);
CREATE INDEX IF NOT EXISTS idx_dnd_spells_api_index ON dnd_spells (api_index);
CREATE INDEX IF NOT EXISTS idx_dnd_spells_classes ON dnd_spells USING GIN (classes);
CREATE INDEX IF NOT EXISTS idx_dnd_spells_ritual ON dnd_spells (ritual) WHERE ritual = true;
CREATE INDEX IF NOT EXISTS idx_dnd_spells_concentration ON dnd_spells (concentration) WHERE concentration = true;

-- Full text search index for spell descriptions
CREATE INDEX IF NOT EXISTS idx_dnd_spells_search ON dnd_spells USING GIN (
    to_tsvector('english', 
        COALESCE(name, '') || ' ' || 
        COALESCE(description, '') || ' ' || 
        COALESCE(higher_level, '')
    )
);

-- Enable Row Level Security
ALTER TABLE dnd_spells ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users to read spells
CREATE POLICY "Allow read access for all authenticated users" ON dnd_spells
    FOR SELECT
    USING (true);

-- Only allow service role to insert/update/delete (for import process)
CREATE POLICY "Allow write access for service role" ON dnd_spells
    FOR INSERT
    WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Allow update access for service role" ON dnd_spells
    FOR UPDATE
    USING (auth.role() = 'service_role')
    WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Allow delete access for service role" ON dnd_spells
    FOR DELETE
    USING (auth.role() = 'service_role');

-- Update trigger for updated_at
CREATE TRIGGER update_dnd_spells_updated_at
BEFORE UPDATE ON dnd_spells
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Function to search spells by text
CREATE OR REPLACE FUNCTION search_dnd_spells(search_query TEXT)
RETURNS TABLE (
    id UUID,
    name TEXT,
    level INTEGER,
    school TEXT,
    description TEXT,
    rank REAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        s.id,
        s.name,
        s.level,
        s.school,
        s.description,
        ts_rank(
            to_tsvector('english', 
                COALESCE(s.name, '') || ' ' || 
                COALESCE(s.description, '') || ' ' || 
                COALESCE(s.higher_level, '')
            ),
            plainto_tsquery('english', search_query)
        ) as rank
    FROM dnd_spells s
    WHERE 
        to_tsvector('english', 
            COALESCE(s.name, '') || ' ' || 
            COALESCE(s.description, '') || ' ' || 
            COALESCE(s.higher_level, '')
        ) @@ plainto_tsquery('english', search_query)
    ORDER BY rank DESC;
END;
$$ LANGUAGE plpgsql;

-- Function to get spells by class
CREATE OR REPLACE FUNCTION get_spells_by_class(class_name TEXT)
RETURNS SETOF dnd_spells AS $$
BEGIN
    RETURN QUERY
    SELECT *
    FROM dnd_spells
    WHERE class_name = ANY(classes)
    ORDER BY level, name;
END;
$$ LANGUAGE plpgsql;

-- Function to get spells by level
CREATE OR REPLACE FUNCTION get_spells_by_level(spell_level INTEGER)
RETURNS SETOF dnd_spells AS $$
BEGIN
    RETURN QUERY
    SELECT *
    FROM dnd_spells
    WHERE level = spell_level
    ORDER BY name;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- SAMPLE DATA (Optional)
-- ============================================
-- You can uncomment and run this to add a sample spell for testing

/*
INSERT INTO dnd_spells (
    name, level, school, api_index, description, range, components, 
    casting_time, duration, concentration
) VALUES (
    'Test Spell', 
    0, 
    'Evocation', 
    'test-spell',
    'This is a test spell for development purposes.',
    '60 feet',
    ARRAY['V', 'S'],
    '1 action',
    'Instantaneous',
    false
);
*/