-- Run this ONCE in your Supabase SQL Editor
-- Go to: Supabase dashboard → SQL Editor → New query → paste this → Run

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id         BIGSERIAL    PRIMARY KEY,
  username   VARCHAR(50)  UNIQUE NOT NULL,
  password   TEXT         NOT NULL,
  role       VARCHAR(10)  NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ  DEFAULT NOW()
);

-- Transactions table (each row belongs to one user)
CREATE TABLE IF NOT EXISTS transactions (
  id         BIGSERIAL    PRIMARY KEY,
  user_id    BIGINT       NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type       VARCHAR(10)  NOT NULL,
  desc       TEXT         NOT NULL,
  amount     NUMERIC      NOT NULL,
  category   VARCHAR(50)  NOT NULL,
  date       DATE         NOT NULL,
  created_at TIMESTAMPTZ  DEFAULT NOW()
);

-- Sessions table
CREATE TABLE IF NOT EXISTS sessions (
  token      VARCHAR(128) PRIMARY KEY,
  user_id    BIGINT       NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at TIMESTAMPTZ  NOT NULL
);

-- Index for faster session lookups
CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);

-- Row Level Security: disable it since we handle auth ourselves
ALTER TABLE users        DISABLE ROW LEVEL SECURITY;
ALTER TABLE transactions DISABLE ROW LEVEL SECURITY;
ALTER TABLE sessions     DISABLE ROW LEVEL SECURITY;
