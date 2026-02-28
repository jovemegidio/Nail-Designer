-- =============================================
-- NAIL DESIGNER - SUPABASE DATABASE SETUP
-- =============================================
-- Execute este SQL no SQL Editor do Supabase
-- (Menu lateral esquerdo > SQL Editor > New Query)
-- =============================================

-- Tabela principal para armazenar todos os dados do app
CREATE TABLE IF NOT EXISTS user_data (
    id TEXT PRIMARY KEY DEFAULT 'main',
    app_data JSONB NOT NULL DEFAULT '{}',
    app_settings JSONB NOT NULL DEFAULT '{}',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Inserir registro padrão
INSERT INTO user_data (id, app_data, app_settings)
VALUES ('main', '{}', '{}')
ON CONFLICT (id) DO NOTHING;

-- Habilitar Row Level Security (RLS)
ALTER TABLE user_data ENABLE ROW LEVEL SECURITY;

-- Política: permitir acesso total com a anon key (app pessoal)
-- Para apps multi-usuário, você restringiria por auth.uid()
CREATE POLICY "Allow full access" ON user_data
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Habilitar Realtime (opcional - para sync entre dispositivos)
ALTER PUBLICATION supabase_realtime ADD TABLE user_data;

-- =============================================
-- PRONTO! Agora o app vai funcionar com Supabase
-- =============================================
