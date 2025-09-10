# 🚀 Sistema de Embed - Módulos Dízimo e Oferta  
*Desenvolvido para integração perfeita com sites da diocese e paróquias*

## 📋 Visão Geral

O sistema de embed permite que os módulos **Dízimo** e **Oferta** sejam integrados em sites externos através de iframes, mantendo toda a funcionalidade de pagamento e validação.

## 🔧 Como Funciona

### **Modo Normal vs. Embed**

| Característica | Modo Normal | Modo Embed |
|----------------|--------------|------------|
| **Background** | Gradiente + padrões abstratos | Apenas fundo sólido |
| **Header** | Padding completo | Padding reduzido |
| **Botão Voltar** | Visível e funcional | Oculto |
| **Tamanhos** | Padrão | Compacto |
| **Navegação** | Completa | Limitada ao módulo |

### **Detecção Automática**
O sistema detecta automaticamente quando está sendo embedado através do parâmetro `embed=true` na URL.

## 🚀 Implementação

### **1. HTML Básico**

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Diocese - Módulo Dízimo</title>
    <style>
        .embed-container {
            max-width: 500px;
            margin: 20px auto;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        
        .embed-container iframe {
            width: 100%;
            height: 800px;
            border: none;
        }
    </style>
</head>
<body>
    <div class="embed-container">
        <iframe 
            src="https://seu-dominio.com/dizimo?embed=true&scope=paroquia&parishId=1&checkoutId=12345" 
            title="Módulo Dízimo"
            allow="payment"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox">
        </iframe>
    </div>
</body>
</html>
```

### **2. HTML Responsivo**

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Diocese - Módulos</title>
    <style>
        .embed-container {
            width: 100%;
            max-width: 600px;
            margin: 20px auto;
            border: 1px solid #e5e7eb;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }
        
        .embed-container iframe {
            width: 100%;
            height: 700px;
            border: none;
        }
        
        @media (max-width: 768px) {
            .embed-container {
                margin: 10px;
                border-radius: 8px;
            }
            
            .embed-container iframe {
                height: 600px;
            }
        }
    </style>
</head>
<body>
    <div class="embed-container">
        <iframe 
            src="https://seu-dominio.com/oferta?embed=true&scope=paroquia&parishId=1&checkoutId=67890" 
            title="Módulo Oferta"
            allow="payment"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox">
        </iframe>
    </div>
</body>
</html>
```

## 📱 Parâmetros Disponíveis

### **Parâmetros Comuns**
| Parâmetro | Descrição | Exemplo |
|-----------|-----------|---------|
| `embed=true` | **OBRIGATÓRIO** - Ativa o modo embed | `embed=true` |
| `scope` | Escopo de acesso | `scope=paroquia` |
| `parishId` | ID da paróquia | `parishId=1` |
| `checkoutId` | ID do checkout (WhatsApp) | `checkoutId=12345` |

### **Parâmetros Específicos - Dízimo**
| Parâmetro | Descrição | Exemplo |
|-----------|-----------|---------|
| `cpf` | CPF pré-preenchido | `cpf=12345678901` |
| `newUser=true` | Indica novo usuário | `newUser=true` |

### **Parâmetros Específicos - Oferta**
| Parâmetro | Descrição | Exemplo |
|-----------|-----------|---------|
| `campanhaId` | ID da campanha | `campanhaId=1` |
| `campanhaNome` | Nome da campanha | `campanhaNome=Campanha%20Especial` |

## 🎯 Casos de Uso

### **1. Site da Diocese**
```html
<!-- Módulo Dízimo para contribuições regulares -->
<iframe src="https://diocese.com/dizimo?embed=true&scope=diocese&parishId=1"></iframe>

<!-- Módulo Oferta para doações gerais -->
<iframe src="https://diocese.com/oferta?embed=true&scope=diocese&parishId=1"></iframe>
```

### **2. Site da Paróquia**
```html
<!-- Módulo Dízimo integrado -->
<iframe src="https://paroquia.com/dizimo?embed=true&scope=paroquia&parishId=2&checkoutId=12345"></iframe>

<!-- Módulo Oferta para campanha específica -->
<iframe src="https://paroquia.com/oferta?embed=true&scope=paroquia&parishId=2&checkoutId=67890&campanhaId=1&campanhaNome=Construção%20da%20Igreja"></iframe>
```

### **3. WhatsApp Business**
```html
<!-- Link direto para pagamento via WhatsApp -->
<a href="https://diocese.com/dizimo?embed=true&scope=paroquia&parishId=1&checkoutId=12345&cpf=12345678901">
    💰 Fazer Dízimo
</a>
```

## 🔒 Segurança e Atributos

### **Atributos Recomendados**
```html
<iframe 
    src="..."
    title="Módulo de Pagamento"
    allow="payment"
    sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
    loading="lazy">
</iframe>
```

### **Explicação dos Atributos**
- **`allow="payment"`**: Permite funcionalidades de pagamento
- **`sandbox`**: Restringe permissões por segurança
- **`loading="lazy"`**: Carregamento otimizado
- **`title`**: Acessibilidade e SEO

## 📱 Responsividade

### **Breakpoints Recomendados**
```css
/* Desktop */
.embed-container iframe {
    height: 700px;
}

/* Tablet */
@media (max-width: 1024px) {
    .embed-container iframe {
        height: 650px;
    }
}

/* Mobile */
@media (max-width: 768px) {
    .embed-container iframe {
        height: 600px;
    }
}
```

## 🧪 URLs de Teste

### **Desenvolvimento Local**
```
# Módulo Dízimo
http://localhost:5173/dizimo?embed=true&scope=paroquia&parishId=1&checkoutId=12345

# Módulo Oferta
http://localhost:5173/oferta?embed=true&scope=paroquia&parishId=1&checkoutId=67890

# Módulo Oferta com Campanha
http://localhost:5173/oferta?embed=true&scope=paroquia&parishId=1&checkoutId=11111&campanhaId=1&campanhaNome=Campanha%20Especial
```

### **Produção**
```
# Substitua pelo seu domínio
https://seu-dominio.com/dizimo?embed=true&scope=paroquia&parishId=1&checkoutId=12345
https://seu-dominio.com/oferta?embed=true&scope=paroquia&parishId=1&checkoutId=67890
```

## 🚨 Solução de Problemas

### **Problemas Comuns**

| Problema | Solução |
|----------|---------|
| **Iframe não carrega** | Verifique se `embed=true` está na URL |
| **Botão voltar visível** | Confirme parâmetro `embed=true` |
| **Layout quebrado** | Ajuste altura do iframe |
| **Erro de CORS** | Verifique domínio de origem |

### **Debug**
```javascript
// Verificar parâmetros na URL
const urlParams = new URLSearchParams(window.location.search);
console.log('Embed:', urlParams.get('embed'));
console.log('Scope:', urlParams.get('scope'));
```

## 🎨 Personalização

### **Estilos CSS Customizados**
```css
.embed-container {
    /* Bordas personalizadas */
    border: 2px solid #3b82f6;
    border-radius: 16px;
    
    /* Sombras personalizadas */
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
    
    /* Animações */
    transition: all 0.3s ease;
}

.embed-container:hover {
    transform: translateY(-2px);
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}
```

## 📊 Analytics e Tracking

### **Google Analytics**
```javascript
// Rastrear cliques no iframe
document.querySelector('.embed-container iframe').addEventListener('load', function() {
    gtag('event', 'iframe_loaded', {
        'event_category': 'embed',
        'event_label': 'dizimo_module'
    });
});
```

### **Facebook Pixel**
```javascript
// Rastrear visualizações do módulo
fbq('track', 'ViewContent', {
    content_name: 'Dízimo Module',
    content_category: 'Religious Donation'
});
```

## 🔄 Atualizações e Manutenção

### **Versionamento**
- **v1.0**: Sistema básico de embed
- **v1.1**: Suporte ao módulo Oferta
- **v1.2**: Parâmetros de campanha
- **v1.3**: Otimizações de performance

### **Compatibilidade**
- ✅ **Chrome** 90+
- ✅ **Firefox** 88+
- ✅ **Safari** 14+
- ✅ **Edge** 90+

## 📞 Suporte

Para dúvidas técnicas ou implementação:
- **Email**: suporte@diocese.com
- **Documentação**: docs.diocese.com/embed
- **GitHub**: github.com/diocese/embed-system

---

**🎯 Sistema de Embed - Módulos Dízimo e Oferta**  
*Integração perfeita para sites da diocese e paróquias*
