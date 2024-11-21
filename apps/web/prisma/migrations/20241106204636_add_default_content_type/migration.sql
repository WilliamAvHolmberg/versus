-- Create default "other" content type
INSERT INTO "ContentType" ("id", "name", "logo", "strategy", "createdAt", "updatedAt")
VALUES (
    'default',  -- Using 'default' as the ID for easy reference
    'other',    -- Generic name for unknown content types
    '/link-icon.svg',  -- Default icon from your types
    'default',  -- Default strategy
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
)
ON CONFLICT (name) DO NOTHING;  -- Prevent duplicate if "other" already exists 