-- Initial database schema for CANNA Visit Reports Application
-- This creates all necessary tables with proper relationships and constraints

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table for authentication and user management
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('admin', 'manager', 'user')),
    department VARCHAR(100),
    territory VARCHAR(100),
    phone VARCHAR(50),
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Customers table for shop information
CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shop_name VARCHAR(255) NOT NULL,
    shop_type VARCHAR(100) NOT NULL CHECK (shop_type IN ('growshop', 'garden_center', 'nursery', 'hydroponics_store', 'other')),
    shop_address TEXT,
    zipcode VARCHAR(20),
    city VARCHAR(100),
    county VARCHAR(100),
    region VARCHAR(100),
    contact_person VARCHAR(255),
    contact_phone VARCHAR(50),
    contact_email VARCHAR(255),
    job_title VARCHAR(100),
    gps_coordinates POINT,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Configuration table for dropdown options and system settings
CREATE TABLE IF NOT EXISTS configurations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    config_type VARCHAR(100) NOT NULL,
    config_name VARCHAR(255) NOT NULL,
    config_value VARCHAR(255) NOT NULL,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Shop visits table - main entity for visit reports
CREATE TABLE IF NOT EXISTS shop_visits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    
    -- Shop information (denormalized for historical accuracy)
    shop_name VARCHAR(255) NOT NULL,
    shop_type VARCHAR(100) NOT NULL,
    shop_address TEXT,
    zipcode VARCHAR(20),
    city VARCHAR(100),
    county VARCHAR(100),
    contact_person VARCHAR(255),
    contact_phone VARCHAR(50),
    contact_email VARCHAR(255),
    job_title VARCHAR(100),
    
    -- Visit details
    visit_date DATE NOT NULL,
    visit_duration INTEGER DEFAULT 60, -- minutes
    visit_purpose VARCHAR(100) NOT NULL,
    
    -- Product visibility assessment
    product_visibility_score INTEGER DEFAULT 0 CHECK (product_visibility_score >= 0 AND product_visibility_score <= 100),
    competitor_presence VARCHAR(50),
    products_discussed TEXT[], -- Array of product names
    
    -- Sales data (stored as JSONB for flexibility)
    sales_data JSONB DEFAULT '{}',
    
    -- Training and support
    training_provided BOOLEAN DEFAULT false,
    training_topics TEXT[],
    support_materials_required BOOLEAN DEFAULT false,
    support_materials_items TEXT[],
    
    -- Commercial outcomes
    commercial_outcome VARCHAR(100),
    order_value DECIMAL(10,2) DEFAULT 0,
    overall_satisfaction INTEGER DEFAULT 5 CHECK (overall_satisfaction >= 1 AND overall_satisfaction <= 10),
    
    -- Follow-up
    follow_up_required BOOLEAN DEFAULT false,
    follow_up_notes TEXT,
    
    -- Additional notes and photos
    notes TEXT,
    visit_photos TEXT[], -- Array of file URLs
    
    -- Signature
    signature_data TEXT, -- Base64 signature data
    signature_signer_name VARCHAR(255),
    signature_date TIMESTAMP WITH TIME ZONE,
    
    -- Calculated fields
    calculated_score DECIMAL(5,2) DEFAULT 0,
    priority_level VARCHAR(20) DEFAULT 'medium' CHECK (priority_level IN ('low', 'medium', 'high')),
    
    -- Status tracking
    is_draft BOOLEAN DEFAULT false,
    is_finalized BOOLEAN DEFAULT false,
    draft_saved_at TIMESTAMP WITH TIME ZONE,
    
    -- GPS coordinates
    gps_coordinates POINT,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- File uploads table for managing uploaded files
CREATE TABLE IF NOT EXISTS file_uploads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    filename VARCHAR(255) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    file_size INTEGER NOT NULL,
    file_path TEXT NOT NULL,
    uploaded_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_shop_visits_user_id ON shop_visits(user_id);
CREATE INDEX IF NOT EXISTS idx_shop_visits_customer_id ON shop_visits(customer_id);
CREATE INDEX IF NOT EXISTS idx_shop_visits_visit_date ON shop_visits(visit_date);
CREATE INDEX IF NOT EXISTS idx_shop_visits_created_at ON shop_visits(created_at);
CREATE INDEX IF NOT EXISTS idx_customers_shop_name ON customers(shop_name);
CREATE INDEX IF NOT EXISTS idx_customers_city ON customers(city);
CREATE INDEX IF NOT EXISTS idx_configurations_type ON configurations(config_type);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for automatic updated_at updates
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_shop_visits_updated_at BEFORE UPDATE ON shop_visits FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_configurations_updated_at BEFORE UPDATE ON configurations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();