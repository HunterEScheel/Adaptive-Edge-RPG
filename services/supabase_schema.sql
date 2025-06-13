-- Schema for the skill_embeddings table in Supabase

-- Create the skill_embeddings table
CREATE TABLE skill_embeddings (
    id BIGSERIAL PRIMARY KEY,
    skill_name TEXT NOT NULL UNIQUE,
    embedding_vector FLOAT[] NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', now()) NOT NULL
);

-- Create a unique index on skill_name for faster lookups
CREATE INDEX idx_skill_embeddings_skill_name ON skill_embeddings (skill_name);

-- Create a Row Level Security policy to restrict access
ALTER TABLE skill_embeddings ENABLE ROW LEVEL SECURITY;

-- Allow read access to authenticated users
CREATE POLICY "Allow read access for authenticated users" ON skill_embeddings
    FOR SELECT
    USING (true);  -- Anyone can read the embeddings

-- Allow write access only to authenticated users
CREATE POLICY "Allow write access for authenticated users" ON skill_embeddings
    FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');  -- Only authenticated users can insert

CREATE POLICY "Allow update access for authenticated users" ON skill_embeddings
    FOR UPDATE
    USING (auth.role() = 'authenticated')  -- Only authenticated users can update
    WITH CHECK (auth.role() = 'authenticated');

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to automatically update the updated_at timestamp
CREATE TRIGGER update_skill_embeddings_updated_at
BEFORE UPDATE ON skill_embeddings
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Create a function for vector operations if needed
-- Uncomment if you want to use vector similarity searches directly in SQL
/*
CREATE EXTENSION IF NOT EXISTS vector;

-- Add a vector column for more efficient similarity searches
ALTER TABLE skill_embeddings ADD COLUMN embedding_vector_idx vector;

-- Create a function to convert float[] to vector
CREATE OR REPLACE FUNCTION array_to_vector(float8[])
RETURNS vector AS $$
    SELECT $1::vector
$$ LANGUAGE SQL IMMUTABLE PARALLEL SAFE;

-- Create a trigger to convert embedding_vector to embedding_vector_idx
CREATE OR REPLACE FUNCTION update_embedding_vector_idx()
RETURNS TRIGGER AS $$
BEGIN
    NEW.embedding_vector_idx = array_to_vector(NEW.embedding_vector);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_embedding_vector_idx
BEFORE INSERT OR UPDATE ON skill_embeddings
FOR EACH ROW
EXECUTE FUNCTION update_embedding_vector_idx();

-- Create an index for similarity searches
CREATE INDEX idx_skill_embeddings_vector ON skill_embeddings USING ivfflat (embedding_vector_idx vector_cosine_ops)
WITH (lists = 100);
*/

-- Add sample data
-- This is commented out because you would typically load this from your CSV in your app
/*
INSERT INTO skill_embeddings (skill_name, embedding_vector)
VALUES ('Accounting', ARRAY[0.1, 0.2, 0.3, ...]), -- Replace with actual embedding values
       ('Acrobatics', ARRAY[0.2, 0.3, 0.4, ...]), -- Replace with actual embedding values
       ('Acting', ARRAY[0.3, 0.4, 0.5, ...]); -- Replace with actual embedding values
*/
