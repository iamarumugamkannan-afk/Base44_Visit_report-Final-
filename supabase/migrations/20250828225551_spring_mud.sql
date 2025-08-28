-- Initial database setup script for Docker
-- This script runs when the PostgreSQL container starts for the first time

-- Create the main database if it doesn't exist
SELECT 'CREATE DATABASE canna_visits'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'canna_visits');

-- Connect to the database and enable extensions
\c canna_visits;

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- Create a function to check if we're in a Docker environment
CREATE OR REPLACE FUNCTION is_docker_environment() RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (SELECT 1 FROM pg_stat_file('/proc/1/cgroup') WHERE size > 0);
EXCEPTION
    WHEN OTHERS THEN
        RETURN FALSE;
END;
$$ LANGUAGE plpgsql;

-- Only run initial setup in Docker environment
DO $$
BEGIN
    IF is_docker_environment() THEN
        -- Log that we're setting up the database
        RAISE NOTICE 'Setting up CANNA Visit Reports database in Docker environment';
        
        -- The actual schema will be created by migrations
        -- This file just ensures the database exists and extensions are loaded
    END IF;
END $$;