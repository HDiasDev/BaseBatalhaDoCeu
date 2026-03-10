# Batalha da Aldeia

Uma aplicação web completa para gerenciar uma liga de batalha de rap local, inspirada no estilo urbano/hip-hop com design moderno e responsivo.

## Visão Geral

A aplicação possui duas partes principais:

1. **Site Público** - Onde fãs e participantes podem ver informações sobre MCs, ranking, torneios, eventos e galeria de vídeos
2. **Painel Administrativo** - Interface protegida para gerenciar MCs, batalhas, torneios e atualizações do sistema

## Tecnologias Utilizadas

### Frontend
- **React 18** - Biblioteca JavaScript para construção de interfaces
- **TypeScript** - Tipagem estática para JavaScript
- **Vite** - Build tool e dev server ultra-rápido
- **React Router DOM** - Roteamento de páginas
- **Tailwind CSS** - Framework CSS utilitário
- **Lucide React** - Biblioteca de ícones

### Backend & Banco de Dados
- **Supabase** - Backend as a Service (BaaS)
- **PostgreSQL** - Banco de dados relacional (via Supabase)
- **Row Level Security (RLS)** - Segurança em nível de linha do Supabase

### Autenticação
- **Supabase Auth** - Sistema de autenticação completo

## Arquitetura do Projeto

```
src/
├── components/           # Componentes reutilizáveis
│   ├── Header.tsx       # Cabeçalho do site público
│   ├── Footer.tsx       # Rodapé do site público
│   ├── Layout.tsx       # Layout wrapper para páginas públicas
│   ├── AdminLayout.tsx  # Layout wrapper para páginas admin
│   └── ProtectedRoute.tsx # Componente para proteger rotas privadas
│
├── pages/               # Páginas da aplicação
│   ├── Home.tsx         # Página inicial
│   ├── MCsList.tsx      # Lista de MCs
│   ├── MCProfile.tsx    # Perfil detalhado do MC
│   ├── Ranking.tsx      # Ranking geral
│   ├── Tournaments.tsx  # Lista de torneios
│   ├── Events.tsx       # Agenda de eventos
│   ├── Gallery.tsx      # Galeria de vídeos
│   ├── Login.tsx        # Página de login admin
│   └── admin/           # Páginas do painel admin
│       ├── Dashboard.tsx           # Dashboard com estatísticas
│       ├── MCsManagement.tsx       # CRUD de MCs
│       ├── BattlesManagement.tsx   # Gerenciamento de batalhas
│       └── TournamentsManagement.tsx # CRUD de torneios
│
├── lib/                 # Bibliotecas e utilitários
│   ├── supabase.ts     # Cliente Supabase e tipos TypeScript
│   └── auth.tsx        # Context e hooks de autenticação
│
├── App.tsx             # Componente raiz com rotas
├── main.tsx            # Entry point da aplicação
└── index.css           # Estilos globais Tailwind
```

## Estrutura do Banco de Dados

### Tabela: `mcs`
Armazena informações dos MCs (participantes das batalhas).

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | uuid | ID único (chave primária) |
| nome | text | Nome do MC |
| cidade | text | Cidade de origem |
| foto | text | URL da foto |
| instagram | text | Username do Instagram (opcional) |
| vitorias | integer | Total de vitórias |
| derrotas | integer | Total de derrotas |
| titulos | text | Títulos conquistados (opcional) |
| pontos | integer | Pontos no ranking |
| created_at | timestamptz | Data de criação |

### Tabela: `batalhas`
Registra as batalhas entre MCs.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | uuid | ID único (chave primária) |
| mc1_id | uuid | Referência ao primeiro MC |
| mc2_id | uuid | Referência ao segundo MC |
| vencedor_id | uuid | Referência ao MC vencedor (opcional) |
| data | date | Data da batalha |
| torneio_id | uuid | Referência ao torneio (opcional) |
| created_at | timestamptz | Data de criação |

### Tabela: `torneios`
Armazena informações sobre torneios.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | uuid | ID único (chave primária) |
| nome | text | Nome do torneio |
| data | date | Data do torneio |
| local | text | Local do evento |
| premio | text | Descrição do prêmio (opcional) |
| created_at | timestamptz | Data de criação |

### Tabela: `eventos`
Agenda de eventos futuros.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | uuid | ID único (chave primária) |
| nome | text | Nome do evento |
| data | date | Data do evento |
| local | text | Local do evento |
| descricao | text | Descrição do evento (opcional) |
| created_at | timestamptz | Data de criação |

### Tabela: `videos`
Galeria de vídeos do YouTube.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | uuid | ID único (chave primária) |
| titulo | text | Título do vídeo |
| youtube_id | text | ID do vídeo no YouTube |
| thumbnail | text | URL da thumbnail (opcional) |
| created_at | timestamptz | Data de criação |

## Segurança (Row Level Security)

Todas as tabelas possuem RLS habilitado com as seguintes políticas:

### Acesso Público (SELECT)
- Todos os visitantes podem **ler** dados de todas as tabelas
- Permite que o site público funcione sem autenticação

### Acesso Administrativo (INSERT, UPDATE, DELETE)
- Apenas usuários **autenticados** podem criar, editar ou deletar dados
- Protege a integridade dos dados contra modificações não autorizadas

## Funcionalidades

### Site Público

#### Home
- Banner principal com nome da batalha
- Top 5 MCs do ranking
- Últimas 3 batalhas registradas
- Design chamativo com gradientes vermelho e preto

#### Página de MCs
- Grid de cards com todos os MCs
- Busca por nome ou cidade
- Informações resumidas: vitórias, derrotas, pontos
- Click no card leva ao perfil completo

#### Perfil do MC
- Foto, nome, cidade e Instagram
- Estatísticas completas: vitórias, derrotas, pontos, taxa de vitória
- Histórico completo de batalhas
- Visual destacado para títulos conquistados

#### Ranking
- Tabela ordenada por pontos
- Destaque visual para top 3 (troféus/medalhas)
- Informações: posição, MC, cidade, V/D, pontos

#### Torneios
- Grid de torneios realizados e futuros
- Data, local e prêmio
- Diferenciação visual entre torneios passados e futuros

#### Eventos
- Seção de próximos eventos destacada
- Lista de eventos anteriores
- Data, local e descrição completa

#### Galeria
- Grid de vídeos incorporados do YouTube
- Link para assistir no YouTube

### Painel Admin

#### Dashboard
- Estatísticas gerais (total de MCs, batalhas, torneios)
- Média de batalhas por MC
- Links rápidos para principais funcionalidades

#### Gerenciamento de MCs
- Listagem completa em tabela
- Formulário modal para adicionar/editar
- Campos: nome, cidade, foto, Instagram, vitórias, derrotas, títulos, pontos
- Exclusão com confirmação

#### Gerenciamento de Batalhas
- Formulário para registrar novas batalhas
- Seleção de MC1, MC2, vencedor (opcional)
- Associação com torneio (opcional)
- **Atualização automática**: ao selecionar vencedor, incrementa vitórias/derrotas e adiciona 3 pontos ao vencedor
- Histórico de batalhas com possibilidade de exclusão

#### Gerenciamento de Torneios
- Grid de cards com todos os torneios
- CRUD completo: criar, editar, excluir
- Campos: nome, data, local, prêmio
- Visual diferenciado para torneios futuros

## Sistema de Pontuação

O ranking é calculado automaticamente baseado em:

- **Vitória**: +3 pontos + incremento no contador de vitórias
- **Derrota**: incremento no contador de derrotas (sem perda de pontos)
- **Batalha sem resultado**: não afeta estatísticas

A atualização é feita automaticamente ao registrar uma batalha com vencedor definido.

## Design

### Paleta de Cores
- **Preto** (#000000, zinc-900, zinc-950): Background principal
- **Vermelho** (#DC2626, red-600): Cor de destaque
- **Branco** (#FFFFFF): Texto principal
- **Cinza** (gray-400, zinc-800): Texto secundário e bordas

### Tipografia
- Font weights: Bold (700) e Black (900) para títulos
- Tracking ajustado para visual mais impactante
- Hierarquia clara entre títulos e textos

### Componentes UI
- Borders grossas (2-4px) para estilo urbano
- Gradientes em elementos de destaque
- Hover states em todos os elementos interativos
- Transições suaves para melhor UX
- Cards com bordas e efeitos hover

## Instalação e Configuração

### Pré-requisitos
- Node.js 18+ instalado
- Conta no Supabase

### Passos de Instalação

1. Clone o repositório:
```bash
git clone [seu-repositorio]
cd batalha-da-aldeia
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
O arquivo `.env` já está configurado com as credenciais do Supabase:
```
VITE_SUPABASE_URL=sua_url
VITE_SUPABASE_ANON_KEY=sua_chave
```

4. Execute o projeto em desenvolvimento:
```bash
npm run dev
```

5. Acesse:
- Site público: `http://localhost:5173`
- Painel admin: `http://localhost:5173/admin`

### Build para Produção

```bash
npm run build
npm run preview
```

## Criando o Primeiro Usuário Admin

Para acessar o painel administrativo, você precisa criar um usuário via Supabase Dashboard:

1. Acesse seu projeto no Supabase Dashboard
2. Vá em Authentication > Users
3. Clique em "Add user"
4. Crie um usuário com email e senha
5. Use essas credenciais para fazer login em `/admin`

## Dados de Exemplo

O banco de dados já vem populado com:
- 8 MCs de exemplo
- 4 torneios
- 4 eventos
- 4 vídeos na galeria
- 1 batalha de exemplo

Você pode adicionar, editar ou remover esses dados via painel admin.

## Scripts Disponíveis

- `npm run dev` - Inicia servidor de desenvolvimento
- `npm run build` - Gera build de produção
- `npm run preview` - Preview do build de produção
- `npm run lint` - Executa linter
- `npm run typecheck` - Verifica tipos TypeScript

## Melhorias Futuras

Possíveis funcionalidades para expandir:
- Sistema de votação em tempo real
- Transmissão ao vivo de batalhas
- Perfil público para MCs (auto-gerenciável)
- Sistema de comentários e interação
- Estatísticas avançadas e gráficos
- App mobile
- Integração com redes sociais
- Sistema de notificações
- Brackets de torneios eliminatórios

## Contribuindo

Este é um projeto open-source. Sinta-se à vontade para:
- Reportar bugs
- Sugerir novas funcionalidades
- Fazer pull requests

## Licença

MIT License - sinta-se livre para usar este projeto como desejar.

---

Desenvolvido com React, TypeScript, Tailwind CSS e Supabase.
