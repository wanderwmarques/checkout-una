# 📁 Estrutura Organizada do Projeto

## 🎯 Objetivo
Reorganizar a estrutura do projeto seguindo boas práticas para facilitar manutenção e escalabilidade conforme o produto cresce.

## 📂 Nova Estrutura

### **Pages** (organizadas por domínio)
```
src/pages/
├── home/
│   ├── Home.tsx
│   └── index.ts
├── dizimo/
│   ├── Dizimo.tsx
│   ├── CheckoutDizimo.tsx
│   ├── CadastroDizimista.tsx
│   └── index.ts
├── oferta/
│   ├── Oferta.tsx
│   ├── CheckoutOferta.tsx
│   └── index.ts
├── campanha/
│   ├── Campanha.tsx
│   └── index.ts
├── institucional/
│   ├── HorarioMissa.tsx
│   └── index.ts
├── simulacao/
│   ├── SimulacaoWebComponentes.tsx
│   ├── EclesialTest.tsx
│   └── index.ts
├── agradecimento/
│   ├── Agradecimento.tsx
│   └── index.ts
├── common/
│   ├── NotFound.tsx
│   └── index.ts
└── index.ts (barrel export)
```

### **Components** (organizadas por funcionalidade)
```
src/components/
├── ui/ (componentes base - mantidos como estavam)
├── dizimo/
│   ├── ComprovanteDizimo.tsx
│   ├── ParametrizacaoDizimo.tsx
│   ├── DizimoTest.tsx
│   └── index.ts
├── oferta/
│   ├── ComprovanteOferta.tsx
│   ├── ParametrizacaoOferta.tsx
│   ├── OfertaTest.tsx
│   └── index.ts
├── eclesial/
│   ├── EclesialLogin.tsx
│   ├── ParoquiaSwitcher.tsx
│   └── index.ts
├── shared/
│   ├── GlobalLoader.tsx
│   ├── EnvironmentSelector.tsx
│   ├── TestExport.tsx
│   └── index.ts
└── index.ts (barrel export)
```

## 🔧 Melhorias Implementadas

### 1. **Organização por Domínio**
- **Pages**: Agrupadas por funcionalidade (dizimo, oferta, campanha, etc.)
- **Components**: Separados por contexto de uso (dizimo, oferta, eclesial, shared)

### 2. **Barrel Exports**
- Arquivos `index.ts` em cada pasta para facilitar imports
- Import centralizado: `import { Home, Dizimo } from '@/pages'`

### 3. **Imports Limpos**
- Todos os imports relativos convertidos para alias `@/`
- Imports mais legíveis e menos propensos a erros

### 4. **Estrutura Escalável**
- Fácil adição de novas funcionalidades
- Separação clara de responsabilidades
- Manutenção simplificada

## 📋 Benefícios

✅ **Manutenibilidade**: Código mais fácil de encontrar e modificar  
✅ **Escalabilidade**: Estrutura preparada para crescimento  
✅ **Legibilidade**: Imports mais claros e organizados  
✅ **Colaboração**: Estrutura intuitiva para novos desenvolvedores  
✅ **Performance**: Imports otimizados com barrel exports  

## 🚀 Como Usar

### Importar Pages
```typescript
import { Home, Dizimo, Oferta } from '@/pages';
```

### Importar Components
```typescript
import { ComprovanteDizimo, EclesialLogin } from '@/components';
```

### Importar UI Components
```typescript
import { Button, Card } from '@/components/ui/button';
```

## 📝 Próximos Passos Recomendados

1. **Adicionar testes** organizados por domínio
2. **Criar hooks customizados** em `src/hooks/`
3. **Organizar utilitários** em `src/utils/`
4. **Implementar lazy loading** para pages grandes
5. **Adicionar documentação** de componentes

---
*Estrutura reorganizada em: $(date)*
