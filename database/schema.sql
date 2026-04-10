-- Database Schema for Pokémon Card Price Checker App

-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    credits INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Pokémon Cards table (static data for card information)
CREATE TABLE pokemon_cards (
    id SERIAL PRIMARY KEY,
    set_name VARCHAR(100) NOT NULL,
    set_code VARCHAR(10) NOT NULL,
    card_number VARCHAR(10) NOT NULL,
    card_name VARCHAR(100) NOT NULL,
    rarity VARCHAR(20),
    card_type VARCHAR(50),
    hp INTEGER,
    image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(set_code, card_number)
);

-- User Collections (Dex) table
CREATE TABLE user_collections (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    card_id INTEGER REFERENCES pokemon_cards(id) ON DELETE CASCADE,
    quantity INTEGER DEFAULT 1,
    condition VARCHAR(20) CHECK (condition IN ('Mint', 'Near Mint', 'Excellent', 'Good', 'Lightly Played', 'Played', 'Poor')),
    is_listed BOOLEAN DEFAULT FALSE,
    listed_price DECIMAL(10, 2),
    date_added TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, card_id)
);

-- Price History table
CREATE TABLE price_history (
    id SERIAL PRIMARY KEY,
    card_id INTEGER REFERENCES pokemon_cards(id) ON DELETE CASCADE,
    price DECIMAL(10, 2) NOT NULL,
    source VARCHAR(50), -- e.g., 'eBay', 'TCGPlayer', 'CardMarket', 'App Listing'
    date_recorded TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Market Scrape Data table (for arbitrage opportunities)
CREATE TABLE market_data (
    id SERIAL PRIMARY KEY,
    card_id INTEGER REFERENCES pokemon_cards(id) ON DELETE CASCADE,
    marketplace VARCHAR(50), -- e.g., 'eBay', 'TCGPlayer', 'Facebook Marketplace'
    price DECIMAL(10, 2) NOT NULL,
    url TEXT,
    date_scraped TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Arbitrage Opportunities table
CREATE TABLE arbitrage_opportunities (
    id SERIAL PRIMARY KEY,
    card_id INTEGER REFERENCES pokemon_cards(id) ON DELETE CASCADE,
    app_price DECIMAL(10, 2) NOT NULL,
    market_price DECIMAL(10, 2) NOT NULL,
    profit_margin DECIMAL(10, 2) GENERATED ALWAYS AS (market_price - app_price) STORED,
    profit_percentage DECIMAL(5, 2) GENERATED ALWAYS AS ((market_price - app_price) / app_price * 100) STORED,
    detected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- Daily Quests table
CREATE TABLE daily_quests (
    id SERIAL PRIMARY KEY,
    quest_description VARCHAR(200) NOT NULL,
    quest_type VARCHAR(50), -- e.g., 'scan', 'price_update', 'list_item'
    target_count INTEGER DEFAULT 1,
    reward_credits INTEGER DEFAULT 10,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Quest Progress table
CREATE TABLE user_quest_progress (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    quest_id INTEGER REFERENCES daily_quests(id) ON DELETE CASCADE,
    progress INTEGER DEFAULT 0,
    completed BOOLEAN DEFAULT FALSE,
    date_completed TIMESTAMP,
    date_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, quest_id)
);

-- Ad Impressions table (for tracking ad views)
CREATE TABLE ad_impressions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    ad_type VARCHAR(50), -- e.g., 'rewarded_video', 'banner'
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_user_collections_user_id ON user_collections(user_id);
CREATE INDEX idx_user_collections_card_id ON user_collections(card_id);
CREATE INDEX idx_price_history_card_id ON price_history(card_id);
CREATE INDEX idx_market_data_card_id ON market_data(card_id);
CREATE INDEX idx_arbitrage_opportunities_card_id ON arbitrage_opportunities(card_id);
CREATE INDEX idx_user_quest_progress_user_id ON user_quest_progress(user_id);
CREATE INDEX idx_ad_impressions_user_id ON ad_impressions(user_id);