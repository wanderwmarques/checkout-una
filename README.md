# 📱 Dízimo Digital - Aplicação Pública

Interface pública para fiéis realizarem dízimos e ofertas.

## 🎯 **Funcionalidades**

- **Home**: Página inicial da paróquia
- **Dízimo**: Interface para pagamento de dízimo
- **Oferta**: Interface para ofertas e contribuições
- **Cadastro de Dizimista**: Formulário de cadastro
- **Campanhas**: Visualização de campanhas ativas
- **Horários de Missa**: Informações sobre horários
- **Checkouts**: Processamento de pagamentos

## 🚀 **Como Executar**

```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Build para produção
npm run build:prod

# Preview do build
npm run preview
```

## 📦 **Scripts Disponíveis**

- `npm run dev` - Servidor de desenvolvimento
- `npm run build` - Build padrão
- `npm run build:prod` - Build otimizado para produção
- `npm run preview` - Preview do build
- `npm run lint` - Verificar código
- `npm run lint:fix` - Corrigir problemas de lint
- `npm run clean` - Limpar pasta dist
- `npm run analyze` - Analisar bundle

## 🌐 **Deploy**

Esta aplicação é otimizada para:
- **Performance**: Bundle menor e carregamento rápido
- **SEO**: Otimizada para motores de busca
- **UX**: Interface focada no usuário final

## 📁 **Estrutura**

```
src/
├── pages/           # Páginas da aplicação
├── components/      # Componentes reutilizáveis
├── contexts/        # Contextos React
├── hooks/           # Hooks customizados
├── lib/             # Utilitários
└── types/           # Definições TypeScript
```

## 🔧 **Tecnologias**

- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS + shadcn/ui
- React Router v6
- React Hook Form + Zod# checkout-una
