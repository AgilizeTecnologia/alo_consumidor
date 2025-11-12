# Alô Consumidor - Versão Estática

Este repositório contém o código-fonte estático do site **Alô Consumidor**, extraído da URL de demonstração. O projeto foi desenvolvido com foco em ser uma aplicação de página única (SPA) ou um site estático.

## Estrutura do Projeto

```
.
├── index.html
├── assets/
│   ├── index-PwrSWkGA.js
│   └── index-ZY2wJBBP.css
├── .gitignore
├── .vercelignore
└── vercel.json
```

## Configuração e Deploy

### 1. GitHub

1. Crie um novo repositório no GitHub.
2. Faça o upload de todos os arquivos e pastas (index.html, assets/, .gitignore, .vercelignore, vercel.json) para o repositório.

### 2. Vercel

O Vercel é a plataforma recomendada para o deploy deste projeto estático.

1. Acesse o Vercel e faça login.
2. Clique em **New Project**.
3. Importe o repositório do GitHub que você acabou de criar.
4. O Vercel detectará automaticamente que se trata de um projeto estático e usará o arquivo `index.html` como ponto de entrada.
5. Nas configurações de deploy, certifique-se de que o **Root Directory** está configurado para `/` (raiz do projeto).
6. Clique em **Deploy**.

O arquivo `vercel.json` já está configurado com uma regra de `rewrite` para garantir que todas as rotas (como `/denuncias`) sejam direcionadas para o `index.html`, o que é essencial para o funcionamento de Single Page Applications (SPAs) em hospedagens estáticas.

## Contexto do Projeto (Sistematização de Solicitações)

O documento anexo (`Sistematização_das_Solicitações_para_o_Site_Alô_Consumidor.pdf`) detalha as funcionalidades que devem ser implementadas no futuro, incluindo:

*   **Fluxo de Login/Cadastro** (com envio de código de ativação por e-mail).
*   **Novos Menus e Submenus** (`Início`, `Atendimento`, `Portal de Cursos`).
*   **Adição de Campos de Anexo** na seção de denúncias (Fotos, Notas Fiscais, Áudio).
*   **Ranking de Empresas Reclamadas** (com busca de dados no Procon-DF e exibição de gráfico).

**Observação:** O código-fonte atual é a base estática. A implementação das funcionalidades dinâmicas descritas no documento exigirá o desenvolvimento de um backend (servidor, banco de dados e APIs) e a conversão do projeto para uma aplicação full-stack (por exemplo, usando React, Vue ou Angular com um backend em Node.js, Python, etc.).
