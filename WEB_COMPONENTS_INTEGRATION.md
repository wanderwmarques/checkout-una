# Web Components - Integração em Sites de Terceiros

Os Web Components permitem integrar o checkout de dízimo e oferta em qualquer site de forma nativa, sem as limitações de iframe.

## 🚀 Instalação Rápida

### 1. Incluir o Script

```html
<!-- No <head> do seu site -->
<script src="https://seu-dominio.com/dizimo-web-components.js"></script>
```

### 2. Usar os Componentes

```html
<!-- Checkout de Dízimo -->
<dizimo-checkout
  checkout-id="123"
  amount="100.00"
  theme="light"
  api-url="https://seu-dominio.com"
  paroquia-id="1"
  tipo-recebimento-id="1"
  tipo-recebimento-nome="Dízimo Digital">
</dizimo-checkout>

<!-- Checkout de Oferta -->
<oferta-checkout
  checkout-id="456"
  amount="50.00"
  theme="dark"
  api-url="https://seu-dominio.com"
  paroquia-id="1"
  tipo-oferta-id="2"
  tipo-oferta-nome="Oferta Especial"
  comunidade-id="1"
  comunidade-nome="Comunidade Central"
  conta-pix-id="1"
  conta-pix-nome="Conta PIX Principal">
</oferta-checkout>
```

> **Nota**: O `api-url` deve apontar para o domínio onde sua aplicação está hospedada. Os Web Components usam hash router (`/#/`) internamente.

## 📋 Atributos Disponíveis

### Dízimo Checkout

| Atributo | Tipo | Obrigatório | Descrição |
|----------|------|-------------|-----------|
| `checkout-id` | string | ✅ | ID único do checkout |
| `amount` | string | ❌ | Valor pré-definido (formato: "100.00") |
| `theme` | string | ❌ | Tema visual: "light" ou "dark" (padrão: "light") |
| `api-url` | string | ❌ | URL da API (padrão: origem atual) |
| `environment` | string | ❌ | Ambiente: "development", "staging", "production" |
| `paroquia-id` | string | ❌ | ID da paróquia |
| `tipo-recebimento-id` | string | ❌ | ID do tipo de recebimento |
| `tipo-recebimento-nome` | string | ❌ | Nome do tipo de recebimento |

### Oferta Checkout

| Atributo | Tipo | Obrigatório | Descrição |
|----------|------|-------------|-----------|
| `checkout-id` | string | ✅ | ID único do checkout |
| `amount` | string | ❌ | Valor pré-definido (formato: "100.00") |
| `theme` | string | ❌ | Tema visual: "light" ou "dark" (padrão: "light") |
| `api-url` | string | ❌ | URL da API (padrão: origem atual) |
| `environment` | string | ❌ | Ambiente: "development", "staging", "production" |
| `paroquia-id` | string | ❌ | ID da paróquia |
| `tipo-oferta-id` | string | ❌ | ID do tipo de oferta |
| `tipo-oferta-nome` | string | ❌ | Nome do tipo de oferta |
| `comunidade-id` | string | ❌ | ID da comunidade |
| `comunidade-nome` | string | ❌ | Nome da comunidade |
| `conta-pix-id` | string | ❌ | ID da conta PIX |
| `conta-pix-nome` | string | ❌ | Nome da conta PIX |

## 🎨 Personalização Visual

### CSS Customizado

```css
/* Personalizar aparência do checkout */
dizimo-checkout, oferta-checkout {
  border-radius: 12px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  border: 2px solid #e2e8f0;
}

/* Tema personalizado */
dizimo-checkout--custom {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}
```

### Tamanhos Responsivos

```css
/* Mobile */
@media (max-width: 768px) {
  dizimo-checkout, oferta-checkout {
    min-height: 500px;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  dizimo-checkout, oferta-checkout {
    min-height: 600px;
  }
}
```

## 🔧 Interação via JavaScript

### Métodos Disponíveis

```javascript
// Obter referência ao componente
const checkout = document.querySelector('dizimo-checkout');

// Alterar valor
checkout.setAmount('150.00');

// Alterar tema
checkout.setTheme('dark');

// Obter ID do checkout
const checkoutId = checkout.getCheckoutId();
```

### Eventos Customizados

```javascript
// Escutar eventos do checkout
checkout.addEventListener('payment-success', (event) => {
  console.log('Pagamento realizado!', event.detail);
  // event.detail contém dados do pagamento
});

checkout.addEventListener('payment-error', (event) => {
  console.log('Erro no pagamento:', event.detail);
});

checkout.addEventListener('checkout-loaded', (event) => {
  console.log('Checkout carregado!');
});
```

## 📱 Exemplos de Integração

### WordPress

```php
// No template do WordPress
function add_dizimo_checkout() {
    ?>
    <script src="https://seu-dominio.com/dizimo-web-components.js"></script>
    <dizimo-checkout
        checkout-id="<?php echo get_option('dizimo_checkout_id'); ?>"
        theme="light"
        api-url="<?php echo get_option('dizimo_api_url'); ?>">
    </dizimo-checkout>
    <?php
}
add_shortcode('dizimo_checkout', 'add_dizimo_checkout');
```

### React

```jsx
import React, { useEffect, useRef } from 'react';

function CheckoutPage() {
  const checkoutRef = useRef(null);

  useEffect(() => {
    const checkout = checkoutRef.current;
    
    const handleSuccess = (event) => {
      console.log('Pagamento realizado!', event.detail);
    };

    checkout.addEventListener('payment-success', handleSuccess);
    
    return () => {
      checkout.removeEventListener('payment-success', handleSuccess);
    };
  }, []);

  return (
    <div>
      <h1>Faça sua Contribuição</h1>
      <dizimo-checkout
        ref={checkoutRef}
        checkout-id="123"
        theme="light"
        amount="100.00"
      />
    </div>
  );
}
```

### Vue.js

```vue
<template>
  <div>
    <h1>Contribua com Nossa Paróquia</h1>
    <oferta-checkout
      ref="checkout"
      checkout-id="456"
      theme="dark"
      :amount="valorOferta"
      @payment-success="onPaymentSuccess"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      valorOferta: '50.00'
    };
  },
  methods: {
    onPaymentSuccess(event) {
      console.log('Oferta realizada!', event.detail);
      this.$emit('payment-completed', event.detail);
    }
  }
};
</script>
```

## 🔒 Segurança

### Sandbox do Iframe

Os Web Components usam iframe com sandbox restritivo:

```html
sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
```

### CORS

Certifique-se de que sua API permite requisições do domínio onde o Web Component será usado.

## 🚀 Build e Deploy

### 1. Build dos Web Components

```bash
# Build específico para Web Components
npm run build:web-components
```

### 2. Deploy

```bash
# Os arquivos serão gerados em dist/web-components/
# Faça upload para seu CDN ou servidor
```

### 3. CDN

```html
<!-- Exemplo de uso via CDN -->
<script src="https://cdn.dizimo.com/v1/dizimo-web-components.js"></script>
```

## 🐛 Troubleshooting

### Problema: Componente não carrega

**Solução**: Verifique se o script está sendo carregado corretamente e se não há erros no console.

### Problema: Estilos não aplicam

**Solução**: Certifique-se de que não há conflitos de CSS. Use `!important` se necessário.

### Problema: Eventos não funcionam

**Solução**: Verifique se está escutando os eventos após o componente estar carregado.

## 📞 Suporte

Para dúvidas ou problemas:

- 📧 Email: suporte@dizimo.com
- 📱 WhatsApp: (11) 99999-9999
- 🌐 Site: https://dizimo.com/suporte

---

**Versão**: 1.0.0  
**Última atualização**: Janeiro 2025
