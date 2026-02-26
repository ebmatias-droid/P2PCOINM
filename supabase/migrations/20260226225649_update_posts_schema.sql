/*
  # Update Posts Table Schema

  1. Changes to posts table
    - `title` (text) - post title/heading
    - `body` (text) - detailed description
    - `crypto_amount` (decimal) - amount of cryptocurrency
    - `contact_info` (text) - contact information
    - Remove simple `content` column

  2. Security
    - RLS policies remain the same
*/

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'posts' AND column_name = 'content'
  ) THEN
    ALTER TABLE posts DROP COLUMN content;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'posts' AND column_name = 'title'
  ) THEN
    ALTER TABLE posts ADD COLUMN title text NOT NULL DEFAULT '';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'posts' AND column_name = 'body'
  ) THEN
    ALTER TABLE posts ADD COLUMN body text NOT NULL DEFAULT '';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'posts' AND column_name = 'crypto_amount'
  ) THEN
    ALTER TABLE posts ADD COLUMN crypto_amount numeric(18,8);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'posts' AND column_name = 'contact_info'
  ) THEN
    ALTER TABLE posts ADD COLUMN contact_info text;
  END IF;
END $$;
