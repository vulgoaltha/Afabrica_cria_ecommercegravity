# 🚀 Guia de Configuração do GitHub

## ✅ O que já foi feito:

1. ✅ Git instalado (versão 2.52.0)
2. ✅ Repositório Git inicializado
3. ✅ Configuração do usuário Git
4. ✅ Todos os arquivos adicionados ao staging
5. ✅ Commit criado com a mensagem: "feat: adicionar botão WhatsApp e atualizar informações de contato"

## 📋 Próximos Passos:

### 1. Conectar ao Repositório GitHub Existente

Se você já tem um repositório no GitHub, execute:

```powershell
# Atualizar PATH
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

# Adicionar o repositório remoto (SUBSTITUA A URL)
git remote add origin https://github.com/vulgoaltha/Afabrica_cria_ecommercegravity.git

# Verificar se foi adicionado
git remote -v

# Enviar as alterações para o GitHub
git push -u origin master
```

### 2. Se o Repositório Ainda Não Existe no GitHub

1. Acesse: https://github.com/new
2. Crie um novo repositório com o nome desejado
3. **NÃO** inicialize com README, .gitignore ou licença
4. Copie a URL do repositório
5. Execute os comandos acima com a URL copiada

### 3. Autenticação no GitHub

Quando você executar `git push`, o GitHub pedirá autenticação. Você tem duas opções:

#### Opção A: Personal Access Token (Recomendado)
1. Acesse: https://github.com/settings/tokens
2. Clique em "Generate new token (classic)"
3. Dê um nome ao token (ex: "A Fabrica Cria - Desktop")
4. Selecione os escopos: `repo` (todos)
5. Clique em "Generate token"
6. **COPIE O TOKEN** (você só verá uma vez!)
7. Use o token como senha quando o Git pedir

#### Opção B: GitHub CLI
```powershell
# Instalar GitHub CLI
winget install GitHub.cli

# Fazer login
gh auth login
```

## 🔄 Comandos Úteis para o Futuro

### Verificar status
```powershell
git status
```

### Adicionar alterações
```powershell
git add .
```

### Criar commit
```powershell
git commit -m "Descrição das alterações"
```

### Enviar para o GitHub
```powershell
git push
```

### Atualizar do GitHub
```powershell
git pull
```

### Ver histórico de commits
```powershell
git log --oneline
```

## 📞 Informações Configuradas

- **Nome**: A Fabrica Cria
- **Email**: sac@afabricahcria.com.br
- **Branch**: master

## 🎯 Alterações no Commit Atual

- ✨ Novo componente: WhatsAppButton.jsx
- 📝 Atualização do Footer.jsx com novos contatos
- 🔧 Integração do botão WhatsApp no App.jsx
- 📦 Todos os arquivos do projeto

---

**Próximo passo**: Me forneça a URL do repositório GitHub para eu conectar e fazer o push! 🚀
