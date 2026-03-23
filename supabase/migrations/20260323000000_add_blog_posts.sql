CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT 'solar:document-bold',
  color TEXT NOT NULL DEFAULT 'indigo',
  tags JSONB NOT NULL DEFAULT '[]',
  highlight BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  "order" INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read active blog posts"
  ON blog_posts FOR SELECT
  USING (is_active = true);

CREATE POLICY "Service role full access"
  ON blog_posts
  USING (true)
  WITH CHECK (true);

-- Seed with existing hardcoded posts
INSERT INTO blog_posts (slug, title, description, icon, color, tags, highlight, "order") VALUES
  ('/bares-e-restaurantes', 'Funcionários de Bares e Restaurantes', 'Entenda as particularidades do setor e como garantir seus direitos.', 'solar:cup-hot-linear', 'amber', '["Gorjetas","Freelancer","Insalubridade"]', false, 1),
  ('/convencao-garcons', 'Direitos Convencionais em Bares e Restaurantes', 'Funcionários desse segmento possuem alguns direitos convencionais, descubra quais são eles.', 'solar:clipboard-list-linear', 'teal', '["Piso salarial","Hora extra","Adicional noturno"]', false, 2),
  ('/recisao-contrato-trabalho', 'Rescisão de Contrato de Trabalho', 'O que você deve receber na demissão e quando ocorre a rescisão indireta.', 'solar:document-text-linear', 'indigo', '["Rescisão indireta","Justa causa","Anulação"]', true, 3),
  ('/salario-por-fora', 'Salário por Fora', 'Gorjetas, comissões e recebimentos extra-folha. Saiba como receber seus direitos.', 'solar:wallet-money-linear', 'emerald', '["Comissões","Gorjetas","Extra-folha"]', false, 4),
  ('/horas-remuneracao', 'Horas e Remuneração', 'Saiba como ter uma remuneração justa com base nas horas de trabalho.', 'solar:clock-circle-linear', 'blue', '["Horas extras","Intervalo","Adicional noturno"]', false, 5),
  ('/danos-discriminacao', 'Danos e Discriminação', 'Entenda as situações que podem gerar indenização.', 'solar:shield-warning-linear', 'rose', '["Dano moral","Assédio","Discriminação"]', false, 6),
  ('/funcoes', 'Funções', 'Como a legislação garante a igualdade e justiça salarial com base no serviço prestado.', 'solar:user-check-linear', 'violet', '["Desvio","Acúmulo","Equiparação"]', false, 7),
  ('/condicoes-trabalho', 'Condições de Trabalho', 'Conheça as situações que podem aumentar a remuneração com base no serviço prestado.', 'solar:heart-pulse-linear', 'orange', '["Insalubridade","Periculosidade","Acidente"]', false, 8),
  ('/servicos-especiais', 'Serviços Especiais', 'Entenda o que a lei das domésticas e cuidadoras de idosos te assegura.', 'solar:home-smile-linear', 'pink', '["Domésticas","Cuidadores","PEC"]', false, 9),
  ('/vinculo-emprego', 'Vínculo de Emprego', 'Como comprovar para receber seus direitos.', 'solar:document-add-linear', 'cyan', '["Pessoalidade","Subordinação","Comprovação"]', false, 10);
