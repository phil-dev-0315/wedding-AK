-- Wedding Website Database Schema
-- Compatible with: PostgreSQL (Supabase, Neon, PlanetScale)

-- Enable UUID extension (if using UUIDs instead of auto-increment)
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- GUESTS TABLE
-- =============================================
-- Stores all guests including VIPs and their additional guests

CREATE TABLE guests (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    additionals INTEGER NOT NULL DEFAULT 0,
    is_vip BOOLEAN NOT NULL DEFAULT false,
    is_attending BOOLEAN DEFAULT NULL,
    parent_id INTEGER DEFAULT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    -- Foreign key to self for parent-child relationship
    -- parent_id is NULL for VIPs (main guests), and references a VIP's id for additional guests
    CONSTRAINT fk_parent
        FOREIGN KEY (parent_id)
        REFERENCES guests(id)
        ON DELETE CASCADE
);

-- Create index for faster parent lookups
CREATE INDEX idx_guests_parent_id ON guests(parent_id);

-- Create index for VIP searches (VIPs have parent_id = NULL)
CREATE INDEX idx_guests_vip_search ON guests(is_vip, full_name) WHERE parent_id IS NULL;

-- =============================================
-- SAMPLE DATA (VIPs Only)
-- =============================================

INSERT INTO guests (id, full_name, additionals, is_vip, is_attending, parent_id) VALUES
(1, 'Juan Dela Cruz', 2, true, NULL, NULL),
(2, 'Maria Santos', 0, true, NULL, NULL),
(3, 'Pedro Reyes', 1, true, NULL, NULL),
(4, 'Ana Garcia', 3, true, NULL, NULL),
(5, 'Carlos Mendoza', 0, true, NULL, NULL),
(6, 'Sofia Rodriguez', 1, true, NULL, NULL),
(7, 'Miguel Torres', 2, true, NULL, NULL),
(8, 'Isabella Cruz', 0, true, NULL, NULL);

-- Reset sequence after manual inserts
SELECT setval('guests_id_seq', (SELECT MAX(id) FROM guests) + 1);

-- =============================================
-- USEFUL QUERIES
-- =============================================

-- Search VIPs by name (case-insensitive, partial match)
-- SELECT * FROM guests
-- WHERE is_vip = true
--   AND parent_id IS NULL
--   AND full_name ILIKE '%search_term%';

-- Get all guests under a VIP
-- SELECT * FROM guests WHERE parent_id = :vip_id;

-- Update VIP attendance
-- UPDATE guests
-- SET is_attending = :is_attending, updated_at = CURRENT_TIMESTAMP
-- WHERE id = :guest_id AND is_vip = true AND parent_id IS NULL;

-- Insert additional guest
-- INSERT INTO guests (full_name, additionals, is_vip, is_attending, parent_id)
-- VALUES (:name, 0, false, true, :parent_id);

-- Get attendance statistics
-- SELECT
--     COUNT(*) FILTER (WHERE is_attending = true) AS attending,
--     COUNT(*) FILTER (WHERE is_attending = false) AS not_attending,
--     COUNT(*) FILTER (WHERE is_attending IS NULL AND is_vip = true) AS pending
-- FROM guests;

-- =============================================
-- SUPABASE-SPECIFIC SETUP
-- =============================================
-- Run these commands in Supabase SQL Editor to enable Row Level Security

-- Enable Row Level Security (RLS) for Supabase
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anonymous read access for searching VIPs
CREATE POLICY "Allow anonymous VIP search" ON guests
    FOR SELECT
    USING (is_vip = true AND parent_id IS NULL);

-- Policy: Allow anonymous insert for RSVP submission (additional guests only)
CREATE POLICY "Allow anonymous RSVP submission" ON guests
    FOR INSERT
    WITH CHECK (is_vip = false);

-- Policy: Allow anonymous update for VIP attendance
CREATE POLICY "Allow anonymous attendance update" ON guests
    FOR UPDATE
    USING (is_vip = true AND parent_id IS NULL)
    WITH CHECK (is_vip = true AND parent_id IS NULL);
