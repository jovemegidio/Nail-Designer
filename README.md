# 💅 Betina Nails Studio

<div align="center">

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

**Sistema completo de gestão e agendamento para nail designers, inspirado no Notion.**

Dashboard profissional com agenda, clientes, galeria, serviços, notas e tendências — tudo rodando no navegador com LocalStorage.

[Reportar Bug](https://github.com/jovemegidio/Nail-Designer/issues)

</div>

---

## 📋 Sobre o Projeto

Aplicação web single-page (SPA) desenvolvida para a **Betina Nails Studio**, oferecendo uma solução completa de gestão para profissionais de nail design. O sistema funciona inteiramente no navegador, sem necessidade de backend, utilizando LocalStorage para persistência dos dados.

A interface é inspirada no **Notion**, com sidebar de navegação, páginas modulares, modais para formulários e um design clean e profissional.

---

## ✨ Funcionalidades

### 📊 Dashboard
- **Cards de estatísticas** — Agendamentos do dia, total de clientes, receita do mês, serviços realizados
- **Próximos agendamentos** — Lista com os atendimentos futuros
- **Notas recentes** — Acesso rápido às últimas anotações
- **Tendências 2025/2026** — Cores e estilos em alta na estação, atualizados automaticamente

### 📅 Agenda
- **Calendário mensal interativo** — Navegação entre meses com indicadores visuais
- **Agendamentos por dia** — Visualização detalhada ao clicar na data
- **Novo agendamento** — Modal com seleção de cliente, serviço, data, horário e observações
- **Integração com Google Calendar e ICS** — Exportar compromissos

### 👥 Gestão de Clientes
- **Cadastro completo** — Nome, telefone, e-mail, data de nascimento, observações
- **Ficha detalhada** — Informações pessoais, histórico de atendimentos, notas e galeria individual
- **Busca rápida** — Campo de pesquisa no header

### 📸 Galeria de Trabalhos
- **Portfólio fotográfico** — Upload de imagens dos trabalhos realizados
- **Filtros por categoria** — Gel, Acrigel, Fibra de Vidro, Nail Art, Manicure
- **Vínculo com clientes** — Fotos associadas ao perfil do cliente
- **Descrição** — Detalhes de cada trabalho

### 💅 Catálogo de Serviços
- **Cadastro de serviços** — Nome, preço, duração e descrição
- **Categorias** — Gel, Acrigel, Fibra de Vidro, Nail Art, Manicure, Pedicure
- **Seleção no agendamento** — Serviços vinculados automaticamente aos atendimentos

### 📝 Notas e Observações
- **Notas gerais ou por cliente** — Organização flexível
- **Cores personalizáveis** — 5 opções de cor para cada nota
- **Anexo de fotos** — Upload de imagens dentro das notas
- **Visualização em grid** — Layout tipo Notion com cards

### ⚙️ Configurações
- **Editar Perfil** — Nome, e-mail, telefone, foto de perfil personalizada
- **Configurações do Estúdio** — Nome, slogan, endereço, horários de funcionamento, Instagram
- **Aparência** — 8 temas de cores (Roxo Vibrante, Ametista, Roxo Profundo, Lilás Suave, Lavanda, Violeta Elétrico, Magenta, Pink Neon)
- **Exportar Dados** — Backup completo dos dados

### 🔔 Sistema de Notificações
- **Dropdown de notificações** — Badge com contador no header
- **Limpar todas** — Gerenciamento rápido

### 🔍 Busca Global
- Pesquisa de clientes e agendamentos direto no header

---

## 🛠️ Tecnologias

| Tecnologia | Uso |
|------------|-----|
| HTML5 | Estrutura semântica da SPA |
| CSS3 (Custom Properties) | Design responsivo, temas dinâmicos e animações |
| JavaScript ES6+ (Vanilla) | Lógica completa sem frameworks |
| LocalStorage | Persistência de dados no navegador |
| Font Awesome 6.4 | Ícones vetoriais |
| Google Fonts (Poppins) | Tipografia moderna |
| UI Avatars API | Geração automática de avatares |

---

## 📁 Estrutura do Projeto

```
Nail-Designer/
├── index.html                   # SPA completa (todas as páginas e modais)
├── styles.css                   # Estilos, temas, responsividade
├── app.js                       # Lógica completa da aplicação
├── Favicon.ico                  # Ícone do site
├── Logo - Betina (Icone).png    # Logo ícone (sidebar)
├── Logo - Betina (Lateral).png  # Logo lateral
├── .gitignore                   # Arquivos ignorados pelo Git
└── .nojekyll                    # Configuração para GitHub Pages
```

---

## 🎨 Temas Disponíveis

| Tema | Cor | Código |
|------|-----|--------|
| 💜 Roxo Vibrante | ██ | `#6c5ce7` |
| 💎 Ametista | ██ | `#9b59b6` |
| 🔮 Roxo Profundo | ██ | `#8e44ad` |
| 🪻 Lilás Suave | ██ | `#a29bfe` |
| 💐 Lavanda | ██ | `#b388ff` |
| ⚡ Violeta Elétrico | ██ | `#7c4dff` |
| 🌺 Magenta | ██ | `#d63384` |
| 🩷 Pink Neon | ██ | `#e040fb` |

---

## 🚀 Como Usar

### 1. Clone o repositório

```bash
git clone https://github.com/jovemegidio/Nail-Designer.git
cd Nail-Designer
```

### 2. Abra no navegador

```bash
# Simplesmente abra o index.html
start index.html

# Ou com servidor local (Python):
python -m http.server 8000

# Ou com Node.js:
npx serve .
```

### 3. Deploy no GitHub Pages

1. Vá em **Settings** → **Pages**
2. Em Source, selecione **Deploy from a branch**
3. Escolha **main** e **/ (root)**
4. Clique em **Save**

> O arquivo `.nojekyll` já está configurado para compatibilidade com GitHub Pages.

---

## 📱 Responsividade

| Plataforma | Status |
|------------|--------|
| 💻 Desktop | ✅ Completo |
| 📊 Tablet | ✅ Completo |
| 📱 Mobile | ✅ Completo |
| 🌐 Chrome, Firefox, Safari, Edge | ✅ Suportados |

> Melhoria de responsividade implementada com suporte completo para PC, tablet e mobile.

---

## 💾 Armazenamento de Dados

Todos os dados são salvos localmente no navegador via **LocalStorage**:

- ✅ Agendamentos
- ✅ Clientes
- ✅ Serviços
- ✅ Galeria de fotos
- ✅ Notas
- ✅ Configurações do estúdio e perfil
- ✅ Tema selecionado

> ⚠️ Os dados ficam salvos no navegador. Use a função **Exportar Dados** para fazer backup.

---

## 📄 Licença

Este projeto está sob a licença MIT. Sinta-se livre para usar e modificar.

---

<div align="center">

Desenvolvido com 💜 por [jovemegidio](https://github.com/jovemegidio) para **Betina Nails Studio**

</div>
