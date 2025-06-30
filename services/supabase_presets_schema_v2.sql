-- ============================================
-- CHARACTER PRESETS SCHEMA V2
-- ============================================
-- This schema includes all necessary tables for a complete character preset system
-- including inventory items, weapon skills, and defensive skills

-- Drop existing tables if you need to recreate (WARNING: This will delete all data!)
-- Uncomment these lines only if you want to completely rebuild the schema
/*
DROP TABLE IF EXISTS preset_npcs CASCADE;
DROP TABLE IF EXISTS preset_notes CASCADE;
DROP TABLE IF EXISTS preset_passives CASCADE;
DROP TABLE IF EXISTS preset_attacks CASCADE;
DROP TABLE IF EXISTS preset_flaws CASCADE;
DROP TABLE IF EXISTS preset_spells CASCADE;
DROP TABLE IF EXISTS preset_magic_schools CASCADE;
DROP TABLE IF EXISTS preset_skills CASCADE;
DROP TABLE IF EXISTS preset_defensive_skills CASCADE;
DROP TABLE IF EXISTS preset_weapon_skills CASCADE;
DROP TABLE IF EXISTS preset_inventory_consumables CASCADE;
DROP TABLE IF EXISTS preset_inventory_equipment CASCADE;
DROP TABLE IF EXISTS preset_inventory_weapons CASCADE;
DROP TABLE IF EXISTS preset_armor CASCADE;
DROP TABLE IF EXISTS character_presets CASCADE;
*/

-- ============================================
-- MAIN PRESET TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS character_presets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Preset metadata
    preset_name TEXT NOT NULL,
    description TEXT,
    tags TEXT[] DEFAULT '{}',
    is_public BOOLEAN DEFAULT false,
    is_template BOOLEAN DEFAULT false, -- Mark official templates
    
    -- Basic Character Info
    character_name TEXT NOT NULL,
    character_race TEXT,
    character_class TEXT,
    character_level INTEGER DEFAULT 1,
    
    -- Build Points
    build_points_spent INTEGER DEFAULT 0,
    build_points_remaining INTEGER DEFAULT 100,
    
    -- Vitals
    energy INTEGER DEFAULT 10,
    max_energy INTEGER DEFAULT 10,
    hit_points INTEGER DEFAULT 10,
    max_hit_points INTEGER DEFAULT 10,
    ac INTEGER DEFAULT 10,
    movement INTEGER DEFAULT 30,
    
    -- Stats (using 'foc' to match the app)
    str INTEGER DEFAULT 0,
    dex INTEGER DEFAULT 0,
    con INTEGER DEFAULT 0,
    int INTEGER DEFAULT 0,
    foc INTEGER DEFAULT 0, -- Focus (not wisdom)
    cha INTEGER DEFAULT 0,
    
    -- Additional fields
    gold NUMERIC(10, 2) DEFAULT 0,
    magic_school_credit BOOLEAN DEFAULT false,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', now()) NOT NULL
);

-- ============================================
-- INVENTORY TABLES
-- ============================================

-- Armor
CREATE TABLE IF NOT EXISTS preset_armor (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    preset_id UUID REFERENCES character_presets(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    armor_classification TEXT,
    enchantment_bonus INTEGER DEFAULT 0,
    damage_reduction INTEGER DEFAULT 0,
    evasion_reduction INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', now()) NOT NULL
);

-- Weapons
CREATE TABLE IF NOT EXISTS preset_inventory_weapons (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    preset_id UUID REFERENCES character_presets(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    value NUMERIC(10, 2) DEFAULT 0,
    qty INTEGER DEFAULT 1,
    requires_attunement BOOLEAN DEFAULT false,
    attunement BOOLEAN DEFAULT false,
    damage_dice INTEGER DEFAULT 6,
    damage_dice_count INTEGER DEFAULT 1,
    versatile BOOLEAN DEFAULT false,
    two_handed BOOLEAN DEFAULT false,
    charges INTEGER,
    max_charges INTEGER,
    recharge TEXT,
    equipped BOOLEAN DEFAULT false,
    attack_bonus INTEGER DEFAULT 0,
    attribute TEXT DEFAULT 'str',
    weapon_heft TEXT,
    weapon_type TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', now()) NOT NULL
);

-- Equipment
CREATE TABLE IF NOT EXISTS preset_inventory_equipment (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    preset_id UUID REFERENCES character_presets(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    value NUMERIC(10, 2) DEFAULT 0,
    qty INTEGER DEFAULT 1,
    requires_attunement BOOLEAN DEFAULT false,
    attunement BOOLEAN DEFAULT false,
    stat_effected TEXT,
    stat_modifier INTEGER DEFAULT 0,
    charges INTEGER,
    max_charges INTEGER,
    recharge TEXT,
    equipped BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', now()) NOT NULL
);

-- Consumables
CREATE TABLE IF NOT EXISTS preset_inventory_consumables (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    preset_id UUID REFERENCES character_presets(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    value NUMERIC(10, 2) DEFAULT 0,
    qty INTEGER DEFAULT 1,
    stat_effected TEXT,
    stat_modifier INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', now()) NOT NULL
);

-- ============================================
-- SKILLS AND ABILITIES
-- ============================================

-- Basic Skills
CREATE TABLE IF NOT EXISTS preset_skills (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    preset_id UUID REFERENCES character_presets(id) ON DELETE CASCADE,
    skill_name TEXT NOT NULL,
    skill_level INTEGER DEFAULT 1,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', now()) NOT NULL
);

-- Weapon Skills
CREATE TABLE IF NOT EXISTS preset_weapon_skills (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    preset_id UUID REFERENCES character_presets(id) ON DELETE CASCADE,
    level INTEGER DEFAULT 0,
    weapon_heft TEXT NOT NULL,
    weapon_type TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', now()) NOT NULL
);

-- Defensive Skills
CREATE TABLE IF NOT EXISTS preset_defensive_skills (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    preset_id UUID REFERENCES character_presets(id) ON DELETE CASCADE,
    dodge INTEGER DEFAULT 0,
    parry INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', now()) NOT NULL,
    UNIQUE(preset_id) -- Only one defensive skills entry per preset
);

-- ============================================
-- MAGIC SYSTEM
-- ============================================

-- Magic Schools
CREATE TABLE IF NOT EXISTS preset_magic_schools (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    preset_id UUID REFERENCES character_presets(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', now()) NOT NULL
);

-- Spells
CREATE TABLE IF NOT EXISTS preset_spells (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    preset_id UUID REFERENCES character_presets(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    school TEXT NOT NULL,
    description TEXT,
    energy_cost INTEGER DEFAULT 0,
    build_point_cost INTEGER DEFAULT 0,
    damage TEXT,
    range TEXT,
    duration TEXT,
    area TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', now()) NOT NULL
);

-- ============================================
-- CHARACTER TRAITS
-- ============================================

-- Flaws
CREATE TABLE IF NOT EXISTS preset_flaws (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    preset_id UUID REFERENCES character_presets(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    severity TEXT NOT NULL CHECK (severity IN ('quirk', 'flaw', 'vice')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', now()) NOT NULL
);

-- Combat Attacks
CREATE TABLE IF NOT EXISTS preset_attacks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    preset_id UUID REFERENCES character_presets(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    build_point_cost INTEGER DEFAULT 0,
    energy_cost INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', now()) NOT NULL
);

-- Combat Passives
CREATE TABLE IF NOT EXISTS preset_passives (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    preset_id UUID REFERENCES character_presets(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    build_point_cost INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', now()) NOT NULL
);

-- ============================================
-- NOTES AND NPCS
-- ============================================

-- Notes
CREATE TABLE IF NOT EXISTS preset_notes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    preset_id UUID REFERENCES character_presets(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', now()) NOT NULL
);

-- NPCs
CREATE TABLE IF NOT EXISTS preset_npcs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    preset_id UUID REFERENCES character_presets(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    relationship_level INTEGER DEFAULT 0 CHECK (relationship_level >= -3 AND relationship_level <= 3),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', now()) NOT NULL
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_character_presets_user_id ON character_presets (user_id);
CREATE INDEX IF NOT EXISTS idx_character_presets_name ON character_presets (preset_name);
CREATE INDEX IF NOT EXISTS idx_character_presets_tags ON character_presets USING GIN (tags);
CREATE INDEX IF NOT EXISTS idx_character_presets_is_template ON character_presets (is_template);
CREATE INDEX IF NOT EXISTS idx_character_presets_is_public ON character_presets (is_public);

-- Create indexes for all foreign keys
CREATE INDEX IF NOT EXISTS idx_preset_armor_preset_id ON preset_armor (preset_id);
CREATE INDEX IF NOT EXISTS idx_preset_inventory_weapons_preset_id ON preset_inventory_weapons (preset_id);
CREATE INDEX IF NOT EXISTS idx_preset_inventory_equipment_preset_id ON preset_inventory_equipment (preset_id);
CREATE INDEX IF NOT EXISTS idx_preset_inventory_consumables_preset_id ON preset_inventory_consumables (preset_id);
CREATE INDEX IF NOT EXISTS idx_preset_skills_preset_id ON preset_skills (preset_id);
CREATE INDEX IF NOT EXISTS idx_preset_weapon_skills_preset_id ON preset_weapon_skills (preset_id);
CREATE INDEX IF NOT EXISTS idx_preset_defensive_skills_preset_id ON preset_defensive_skills (preset_id);
CREATE INDEX IF NOT EXISTS idx_preset_magic_schools_preset_id ON preset_magic_schools (preset_id);
CREATE INDEX IF NOT EXISTS idx_preset_spells_preset_id ON preset_spells (preset_id);
CREATE INDEX IF NOT EXISTS idx_preset_flaws_preset_id ON preset_flaws (preset_id);
CREATE INDEX IF NOT EXISTS idx_preset_attacks_preset_id ON preset_attacks (preset_id);
CREATE INDEX IF NOT EXISTS idx_preset_passives_preset_id ON preset_passives (preset_id);
CREATE INDEX IF NOT EXISTS idx_preset_notes_preset_id ON preset_notes (preset_id);
CREATE INDEX IF NOT EXISTS idx_preset_npcs_preset_id ON preset_npcs (preset_id);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

-- Enable RLS on all tables
ALTER TABLE character_presets ENABLE ROW LEVEL SECURITY;
ALTER TABLE preset_armor ENABLE ROW LEVEL SECURITY;
ALTER TABLE preset_inventory_weapons ENABLE ROW LEVEL SECURITY;
ALTER TABLE preset_inventory_equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE preset_inventory_consumables ENABLE ROW LEVEL SECURITY;
ALTER TABLE preset_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE preset_weapon_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE preset_defensive_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE preset_magic_schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE preset_spells ENABLE ROW LEVEL SECURITY;
ALTER TABLE preset_flaws ENABLE ROW LEVEL SECURITY;
ALTER TABLE preset_attacks ENABLE ROW LEVEL SECURITY;
ALTER TABLE preset_passives ENABLE ROW LEVEL SECURITY;
ALTER TABLE preset_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE preset_npcs ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES
-- ============================================

-- Character Presets Policies
CREATE POLICY "Users can view their own presets" ON character_presets
    FOR SELECT USING (auth.uid() = user_id OR is_public = true OR is_template = true);

CREATE POLICY "Users can create their own presets" ON character_presets
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own presets" ON character_presets
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own presets" ON character_presets
    FOR DELETE USING (auth.uid() = user_id);

-- For all related tables, create similar policies
-- This is a template for all the related tables
DO $$
DECLARE
    table_name TEXT;
    tables TEXT[] := ARRAY[
        'preset_armor',
        'preset_inventory_weapons',
        'preset_inventory_equipment',
        'preset_inventory_consumables',
        'preset_skills',
        'preset_weapon_skills',
        'preset_defensive_skills',
        'preset_magic_schools',
        'preset_spells',
        'preset_flaws',
        'preset_attacks',
        'preset_passives',
        'preset_notes',
        'preset_npcs'
    ];
BEGIN
    FOREACH table_name IN ARRAY tables
    LOOP
        -- View policy
        EXECUTE format('
            CREATE POLICY "Users can view related preset data" ON %I
            FOR SELECT USING (
                EXISTS (
                    SELECT 1 FROM character_presets
                    WHERE character_presets.id = %I.preset_id
                    AND (character_presets.user_id = auth.uid() OR character_presets.is_public = true OR character_presets.is_template = true)
                )
            )', table_name, table_name);
        
        -- Insert policy
        EXECUTE format('
            CREATE POLICY "Users can insert related preset data" ON %I
            FOR INSERT WITH CHECK (
                EXISTS (
                    SELECT 1 FROM character_presets
                    WHERE character_presets.id = %I.preset_id
                    AND character_presets.user_id = auth.uid()
                )
            )', table_name, table_name);
        
        -- Update policy
        EXECUTE format('
            CREATE POLICY "Users can update related preset data" ON %I
            FOR UPDATE USING (
                EXISTS (
                    SELECT 1 FROM character_presets
                    WHERE character_presets.id = %I.preset_id
                    AND character_presets.user_id = auth.uid()
                )
            )', table_name, table_name);
        
        -- Delete policy
        EXECUTE format('
            CREATE POLICY "Users can delete related preset data" ON %I
            FOR DELETE USING (
                EXISTS (
                    SELECT 1 FROM character_presets
                    WHERE character_presets.id = %I.preset_id
                    AND character_presets.user_id = auth.uid()
                )
            )', table_name, table_name);
    END LOOP;
END $$;

-- ============================================
-- TRIGGERS
-- ============================================

-- Update trigger for character_presets
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

CREATE TRIGGER update_preset_notes_updated_at
BEFORE UPDATE ON preset_notes
FOR EACH ROW
EXECUTE FUNCTION update_preset_updated_at();

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Function to copy a preset (useful for templates)
CREATE OR REPLACE FUNCTION copy_preset(source_preset_id UUID, new_name TEXT, new_user_id UUID DEFAULT NULL)
RETURNS UUID AS $$
DECLARE
    new_preset_id UUID;
    owner_id UUID;
BEGIN
    -- Use the provided user_id or the current user
    owner_id := COALESCE(new_user_id, auth.uid());
    
    -- Create the new preset
    INSERT INTO character_presets (
        user_id, preset_name, description, tags, character_name, character_race,
        character_class, character_level, build_points_spent, build_points_remaining,
        energy, max_energy, hit_points, max_hit_points, ac, movement,
        str, dex, con, int, foc, cha, gold, magic_school_credit
    )
    SELECT 
        owner_id, new_name, description, tags, character_name, character_race,
        character_class, character_level, build_points_spent, build_points_remaining,
        energy, max_energy, hit_points, max_hit_points, ac, movement,
        str, dex, con, int, foc, cha, gold, magic_school_credit
    FROM character_presets
    WHERE id = source_preset_id
    RETURNING id INTO new_preset_id;
    
    -- Copy all related data
    -- Copy armor
    INSERT INTO preset_armor (preset_id, name, armor_classification, enchantment_bonus, damage_reduction, evasion_reduction)
    SELECT new_preset_id, name, armor_classification, enchantment_bonus, damage_reduction, evasion_reduction
    FROM preset_armor WHERE preset_id = source_preset_id;
    
    -- Copy weapons
    INSERT INTO preset_inventory_weapons (preset_id, name, value, qty, requires_attunement, attunement, damage_dice, damage_dice_count, versatile, two_handed, charges, max_charges, recharge, equipped, attack_bonus, attribute, weapon_heft, weapon_type)
    SELECT new_preset_id, name, value, qty, requires_attunement, attunement, damage_dice, damage_dice_count, versatile, two_handed, charges, max_charges, recharge, equipped, attack_bonus, attribute, weapon_heft, weapon_type
    FROM preset_inventory_weapons WHERE preset_id = source_preset_id;
    
    -- Continue for all other tables...
    -- (Similar INSERT statements for all related tables)
    
    RETURN new_preset_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- SAMPLE TEMPLATES
-- ============================================
-- Insert some default templates that come with the system
-- These can be used as starting points for new characters

INSERT INTO character_presets (
    preset_name, description, tags, is_template, is_public,
    character_name, character_race, character_class, character_level,
    build_points_spent, build_points_remaining,
    str, dex, con, int, foc, cha,
    hit_points, max_hit_points, energy, max_energy, ac, movement, gold
) VALUES 
(
    'Fighter Template', 
    'A basic fighter build focusing on strength and constitution',
    ARRAY['template', 'starter', 'fighter', 'melee'],
    true, true,
    'Generic Fighter', 'Human', 'Fighter', 1,
    20, 80,
    2, 1, 2, 0, 0, 0,
    12, 12, 8, 8, 12, 30, 50.00
),
(
    'Mage Template',
    'A basic mage build focusing on intelligence and focus',
    ARRAY['template', 'starter', 'mage', 'caster'],
    true, true,
    'Generic Mage', 'Elf', 'Mage', 1,
    20, 80,
    0, 1, 0, 2, 2, 0,
    8, 8, 12, 12, 10, 25, 30.00
),
(
    'Rogue Template',
    'A basic rogue build focusing on dexterity and intelligence',
    ARRAY['template', 'starter', 'rogue', 'stealth'],
    true, true,
    'Generic Rogue', 'Halfling', 'Rogue', 1,
    20, 80,
    0, 2, 1, 1, 1, 0,
    10, 10, 10, 10, 11, 35, 40.00
);

-- ============================================
-- MIGRATION NOTES
-- ============================================
-- If you have existing data in the old schema:
-- 1. Export your existing presets data
-- 2. Run the DROP commands at the top (commented out)
-- 3. Run this entire script to create the new schema
-- 4. Import your data with any necessary transformations
--
-- Key changes from v1:
-- - Changed ID fields from BIGSERIAL to UUID for better distributed systems support
-- - Added user_id field for proper user ownership
-- - Added inventory tables (weapons, armor, equipment, consumables)
-- - Added weapon skills and defensive skills
-- - Changed 'wis' to 'foc' to match the app
-- - Added is_template and is_public flags
-- - Improved RLS policies for better security
-- - Added helper function for copying presets
-- - Included sample templates