-- Create the numisvault database tables

-- Countries table (уже правильно - есть UNIQUE на name)
CREATE TABLE IF NOT EXISTS countries (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    code VARCHAR(10) NOT NULL,
    continent VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Denominations table (добавлено составное уникальное ограничение)
CREATE TABLE IF NOT EXISTS denominations (
    id SERIAL PRIMARY KEY,
    value VARCHAR(50) NOT NULL,
    currency VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(value, currency)  -- ← ДОБАВЛЕНО
);

-- Materials table (добавлено UNIQUE на name)
CREATE TABLE IF NOT EXISTS materials (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,  -- ← ДОБАВЛЕНО UNIQUE
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Conditions table (добавлено UNIQUE на name)
CREATE TABLE IF NOT EXISTS conditions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,  -- ← ДОБАВЛЕНО UNIQUE
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Coins table
CREATE TABLE IF NOT EXISTS coins (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    year INTEGER,
    country_id INTEGER REFERENCES countries(id),
    denomination_id INTEGER REFERENCES denominations(id),
    material_id INTEGER REFERENCES materials(id),
    condition_id INTEGER REFERENCES conditions(id),
    face_value VARCHAR(50),
    weight DECIMAL(10, 3),
    diameter DECIMAL(8, 2),
    thickness DECIMAL(8, 2),
    edge VARCHAR(100),
    mint_mark VARCHAR(50),
    series VARCHAR(255),
    obverse_design TEXT,
    reverse_design TEXT,
    images JSONB,
    rarity VARCHAR(50),
    estimated_value DECIMAL(12, 2),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Collections table
CREATE TABLE IF NOT EXISTS collections (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    owner_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Collection coins junction table
CREATE TABLE IF NOT EXISTS collection_coins (
    id SERIAL PRIMARY KEY,
    collection_id INTEGER REFERENCES collections(id) ON DELETE CASCADE,
    coin_id INTEGER REFERENCES coins(id) ON DELETE CASCADE,
    quantity INTEGER DEFAULT 1,
    purchase_price DECIMAL(12, 2),
    purchase_date DATE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(collection_id, coin_id)
);

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default countries
INSERT INTO countries (name, code, continent) VALUES
('United States', 'US', 'North America'),
('Canada', 'CA', 'North America'),
('United Kingdom', 'GB', 'Europe'),
('Germany', 'DE', 'Europe'),
('France', 'FR', 'Europe'),
('Japan', 'JP', 'Asia'),
('China', 'CN', 'Asia'),
('Russia', 'RU', 'Europe/Asia'),
('Australia', 'AU', 'Oceania'),
('Brazil', 'BR', 'South America')
ON CONFLICT (name) DO NOTHING;

-- Insert default denominations (теперь работает благодаря уникальному ограничению)
INSERT INTO denominations (value, currency) VALUES
('1 Cent', 'USD'),
('5 Cents', 'USD'),
('10 Cents', 'USD'),
('25 Cents', 'USD'),
('50 Cents', 'USD'),
('1 Dollar', 'USD'),
('5 Dollars', 'USD'),
('10 Dollars', 'USD'),
('20 Dollars', 'USD'),
('50 Dollars', 'USD'),
('100 Dollars', 'USD'),
('1 Pence', 'GBP'),
('2 Pence', 'GBP'),
('5 Pence', 'GBP'),
('10 Pence', 'GBP'),
('20 Pence', 'GBP'),
('50 Pence', 'GBP'),
('1 Pound', 'GBP'),
('2 Pounds', 'GBP'),
('5 Euros', 'EUR'),
('10 Euros', 'EUR'),
('20 Euros', 'EUR'),
('50 Euros', 'EUR'),
('100 Euros', 'EUR'),
('200 Euros', 'EUR'),
('500 Euros', 'EUR'),
('1 Yen', 'JPY'),
('5 Yen', 'JPY'),
('10 Yen', 'JPY'),
('50 Yen', 'JPY'),
('100 Yen', 'JPY'),
('500 Yen', 'JPY'),
('1000 Yen', 'JPY'),
('5000 Yen', 'JPY'),
('10000 Yen', 'JPY')
ON CONFLICT (value, currency) DO NOTHING;

-- Insert default materials
INSERT INTO materials (name, description) VALUES
('Copper', 'Pure copper or copper alloy'),
('Nickel', 'Nickel or nickel-plated metal'),
('Silver', 'Silver or silver-plated metal'),
('Gold', 'Gold or gold-plated metal'),
('Bronze', 'Bronze alloy'),
('Brass', 'Brass alloy'),
('Steel', 'Steel core with coating'),
('Aluminum', 'Aluminum or aluminum alloy'),
('Platinum', 'Platinum or platinum-plated metal'),
('Bimetallic', 'Two different metals combined')
ON CONFLICT (name) DO NOTHING;

-- Insert default conditions
INSERT INTO conditions (name, description) VALUES
('Uncirculated', 'Never been in circulation, pristine condition'),
('Almost Uncirculated', 'Very light wear, nearly perfect'),
('Extremely Fine', 'Very minor wear on high points'),
('Very Fine', 'Light wear on design elements'),
('Fine', 'Moderate wear but clear design'),
('Very Good', 'Noticeable wear but major features visible'),
('Good', 'Worn but identifiable'),
('Fair', 'Heavily worn but recognizable'),
('Poor', 'Severely damaged or corroded')
ON CONFLICT (name) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_coins_country_id ON coins(country_id);
CREATE INDEX IF NOT EXISTS idx_coins_denomination_id ON coins(denomination_id);
CREATE INDEX IF NOT EXISTS idx_coins_material_id ON coins(material_id);
CREATE INDEX IF NOT EXISTS idx_coins_condition_id ON coins(condition_id);
CREATE INDEX IF NOT EXISTS idx_coins_year ON coins(year);
CREATE INDEX IF NOT EXISTS idx_coins_name ON coins(name);
CREATE INDEX IF NOT EXISTS idx_collection_coins_collection_id ON collection_coins(collection_id);
CREATE INDEX IF NOT EXISTS idx_collection_coins_coin_id ON collection_coins(coin_id);