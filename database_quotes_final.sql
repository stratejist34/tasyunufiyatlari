
-- Teklif Talepleri Tablosu
CREATE TABLE IF NOT EXISTS quotes (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Müşteri Bilgileri
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    customer_company VARCHAR(255),
    customer_address TEXT,

    -- Sipariş Detayları
    material_type VARCHAR(50) NOT NULL,
    brand_id BIGINT,
    brand_name VARCHAR(255) NOT NULL,
    model_name VARCHAR(255),
    thickness_cm INTEGER NOT NULL,
    area_m2 DECIMAL(10, 2) NOT NULL,
    city_code VARCHAR(10) NOT NULL,
    city_name VARCHAR(255) NOT NULL,

    -- Paket Bilgileri
    package_name VARCHAR(255) NOT NULL,
    package_description TEXT,
    plate_brand_name VARCHAR(255) NOT NULL,
    accessory_brand_name VARCHAR(255) NOT NULL,

    -- Fiyat Bilgileri
    total_price DECIMAL(12, 2) NOT NULL,
    price_per_m2 DECIMAL(10, 2) NOT NULL,
    shipping_cost DECIMAL(10, 2) DEFAULT 0,
    discount_percentage DECIMAL(5, 2) DEFAULT 0,
    price_without_vat DECIMAL(12, 2) NOT NULL,
    vat_amount DECIMAL(12, 2) NOT NULL,

    -- Lojistik Bilgileri
    package_count INTEGER NOT NULL,
    package_size_m2 DECIMAL(5, 2) NOT NULL,
    items_per_package INTEGER NOT NULL,
    vehicle_type VARCHAR(20),
    lorry_capacity_packages INTEGER,
    truck_capacity_packages INTEGER,
    lorry_fill_percentage DECIMAL(5, 2),
    truck_fill_percentage DECIMAL(5, 2),

    -- Paket İçeriği (JSON)
    package_items JSONB NOT NULL,

    -- Teklif Durumu
    status VARCHAR(50) DEFAULT 'pending',
    priority VARCHAR(20) DEFAULT 'normal',

    -- Admin Notları
    admin_notes TEXT,
    quoted_price DECIMAL(12, 2),
    quote_sent_at TIMESTAMP WITH TIME ZONE,
    quote_sent_by VARCHAR(255),

    -- İletişim Durumu
    contact_attempted_at TIMESTAMP WITH TIME ZONE,
    contact_successful BOOLEAN DEFAULT FALSE,
    follow_up_date DATE
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_quotes_created_at ON quotes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_quotes_status ON quotes(status);
CREATE INDEX IF NOT EXISTS idx_quotes_priority ON quotes(priority);
CREATE INDEX IF NOT EXISTS idx_quotes_customer_email ON quotes(customer_email);
CREATE INDEX IF NOT EXISTS idx_quotes_city_code ON quotes(city_code);

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_quotes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS quotes_updated_at_trigger ON quotes;

CREATE TRIGGER quotes_updated_at_trigger
    BEFORE UPDATE ON quotes
    FOR EACH ROW
    EXECUTE FUNCTION update_quotes_updated_at();
