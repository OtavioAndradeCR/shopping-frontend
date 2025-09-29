# Shopping Frontend - Interface de Usuário

## Descrição do Projeto

Este é o módulo frontend do sistema de compras online, desenvolvido em React com uma interface moderna e responsiva. A aplicação permite aos usuários navegar por produtos, adicionar itens ao carrinho e finalizar compras, comunicando-se com a API backend através de requisições REST.

## Arquitetura do Sistema

O sistema segue o **Cenário 1** proposto, onde:

- **Interface (Front-End)**: Este módulo - sistema de compras online
- **API (Back-End)**: Shopping API - gerencia dados e regras de negócio
- **Serviço Externo**: Fake Store API - fornece dados de produtos (via backend)

```
┌─────────────────┐    REST/HTTP    ┌─────────────────┐    REST/HTTP    ┌─────────────────┐
│   Frontend      │ ──────────────> │   Backend API   │ ──────────────> │  Fake Store API │
│   (React)       │                 │   (Flask)       │                 │   (Externa)     │
│   - Produtos    │                 │   - Usuários    │                 │   - Catálogo    │
│   - Carrinho    │                 │   - Compras     │                 │   - Produtos    │
│   - Busca       │                 │   - Persistência│                 │                 │
└─────────────────┘                 └─────────────────┘                 └─────────────────┘
```

## Tecnologias Utilizadas

- **React 18**: Biblioteca JavaScript para interfaces de usuário
- **Vite**: Build tool e dev server rápido
- **Tailwind CSS**: Framework CSS utilitário para estilização
- **shadcn/ui**: Componentes UI modernos e acessíveis
- **Lucide React**: Ícones SVG otimizados
- **Framer Motion**: Animações e transições suaves
- **React Router DOM**: Roteamento client-side

## Estrutura do Projeto

```
shopping-frontend/
├── public/              # Arquivos públicos estáticos
├── src/
│   ├── assets/          # Imagens e recursos estáticos
│   ├── components/      # Componentes React reutilizáveis
│   │   ├── ui/          # Componentes base do shadcn/ui
│   │   ├── Header.jsx   # Cabeçalho da aplicação
│   │   ├── ProductCard.jsx # Card de produto
│   │   └── Cart.jsx     # Componente do carrinho
│   ├── hooks/           # Custom hooks React
│   ├── lib/             # Utilitários e configurações
│   ├── services/        # Serviços de API
│   │   └── api.js       # Cliente HTTP para backend
│   ├── App.jsx          # Componente principal
│   ├── App.css          # Estilos da aplicação
│   ├── index.css        # Estilos globais
│   └── main.jsx         # Ponto de entrada
├── components.json      # Configuração shadcn/ui
├── package.json         # Dependências e scripts
├── Dockerfile          # Configuração Docker
└── README.md           # Este arquivo
```

## Funcionalidades da Interface

### Navegação de Produtos

- **Catálogo**: Exibição em grid responsivo de todos os produtos
- **Busca**: Campo de busca em tempo real por nome ou categoria
- **Filtros**: Filtragem por categoria de produtos
- **Detalhes**: Visualização de informações completas do produto

### Carrinho de Compras

- **Adicionar**: Botão para adicionar produtos ao carrinho
- **Gerenciar**: Alterar quantidades e remover itens
- **Visualizar**: Sidebar com resumo do carrinho
- **Finalizar**: Processo de checkout integrado com backend

### Interface Responsiva

- **Desktop**: Layout otimizado para telas grandes
- **Tablet**: Adaptação para dispositivos médios
- **Mobile**: Interface touch-friendly para smartphones
- **Acessibilidade**: Componentes acessíveis com ARIA labels

## Instruções de Instalação

### Pré-requisitos

- Node.js 20 ou superior
- pnpm (recomendado) ou npm
- Backend API rodando na porta 5000

### Instalação Local

1. **Clone o repositório**:
   ```bash
   git clone <url-do-repositorio>
   cd shopping-frontend
   ```

2. **Instale as dependências**:
   ```bash
   pnpm install
   # ou
   npm install
   ```

3. **Configure a API**:
   Certifique-se de que o backend está rodando em `http://localhost:5000`

4. **Execute em modo desenvolvimento**:
   ```bash
   pnpm run dev
   # ou
   npm run dev
   ```

5. **Acesse a aplicação**:
   - URL: `http://localhost:5173`
   - A página será recarregada automaticamente ao salvar alterações

### Build para Produção

```bash
pnpm run build
# ou
npm run build
```

Os arquivos otimizados serão gerados na pasta `dist/`.

### Instalação com Docker

1. **Build da imagem**:
   ```bash
   docker build -t shopping-frontend .
   ```

2. **Execute o container**:
   ```bash
   docker run -p 3000:80 shopping-frontend
   ```

3. **Local do Frontend**:
```bash
   URL: http://localhost:3000
```
### Usando Docker Compose (Recomendado)

Na raiz do projeto principal:

```bash
docker-compose up --build
```

Isso iniciará tanto o frontend quanto o backend automaticamente.

## Configuração da API

### Endpoint Base

O frontend está configurado para se comunicar com o backend em:

```javascript
const API_BASE_URL = 'http://localhost:5000/api'
```

Para alterar esta configuração, edite o arquivo `src/services/api.js`.

### Endpoints Utilizados

- **GET /api/products**: Buscar todos os produtos
- **GET /api/products/search**: Buscar produtos por termo
- **POST /api/users**: Criar usuário (para checkout)
- **POST /api/purchases**: Criar compra

## Componentes Principais

### App.jsx

Componente raiz que gerencia:
- Estado global da aplicação
- Carregamento de produtos
- Gerenciamento do carrinho
- Integração com API

### Header.jsx

Cabeçalho com:
- Logo da aplicação
- Campo de busca
- Contador do carrinho
- Botões de ação

### ProductCard.jsx

Card de produto contendo:
- Imagem do produto
- Informações básicas
- Preço formatado
- Botão de adicionar ao carrinho

### Cart.jsx

Componente do carrinho com:
- Lista de itens
- Controles de quantidade
- Cálculo do total
- Botão de checkout

## Fluxo de Dados

```
1. Usuário acessa a aplicação
   ↓
2. App.jsx carrega produtos da API
   ↓
3. Produtos são exibidos em ProductCard
   ↓
4. Usuário adiciona item ao carrinho
   ↓
5. Estado local é atualizado
   ↓
6. Cart.jsx reflete as mudanças
   ↓
7. Checkout envia dados para API
   ↓
8. Compra é registrada no backend
```

## Estilização

### Tailwind CSS

A aplicação utiliza classes utilitárias do Tailwind para:
- Layout responsivo
- Cores e tipografia
- Espaçamentos e dimensões
- Estados hover e focus

### Componentes shadcn/ui

Componentes pré-construídos para:
- Botões e inputs
- Cards e badges
- Toasts e notificações
- Layout e navegação

### Tema Personalizado

As cores principais da aplicação:
- **Primária**: Azul (#2563eb)
- **Secundária**: Cinza (#6b7280)
- **Sucesso**: Verde (#16a34a)
- **Erro**: Vermelho (#dc2626)

## Testes

### Testes Manuais

1. **Carregamento**: Verificar se produtos carregam corretamente
2. **Busca**: Testar funcionalidade de busca
3. **Carrinho**: Adicionar, remover e alterar quantidades
4. **Checkout**: Finalizar compra com sucesso
5. **Responsividade**: Testar em diferentes tamanhos de tela

### Comandos de Teste

```bash
# Executar testes (quando implementados)
pnpm run test

# Verificar build
pnpm run build

# Preview da build
pnpm run preview
```

## Desenvolvimento

### Scripts Disponíveis

- `pnpm run dev`: Inicia servidor de desenvolvimento
- `pnpm run build`: Gera build de produção
- `pnpm run preview`: Visualiza build localmente
- `pnpm run lint`: Executa linting do código

### Estrutura de Componentes

```
components/
├── ui/              # Componentes base (shadcn/ui)
│   ├── button.jsx
│   ├── card.jsx
│   ├── input.jsx
│   └── ...
├── Header.jsx       # Componentes específicos
├── ProductCard.jsx
└── Cart.jsx
```

### Boas Práticas Implementadas

- Componentes funcionais com hooks
- Props tipadas com PropTypes (quando necessário)
- Estado local gerenciado com useState
- Efeitos colaterais com useEffect
- Código limpo e bem documentado

## Performance

### Otimizações Implementadas

- **Lazy Loading**: Carregamento sob demanda de imagens
- **Memoização**: Prevenção de re-renders desnecessários
- **Bundle Splitting**: Divisão do código em chunks
- **Tree Shaking**: Remoção de código não utilizado