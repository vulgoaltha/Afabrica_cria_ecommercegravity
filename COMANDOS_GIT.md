# 📘 Comandos Git para Atualizar o GitHub

## 🚀 Método 1: Script Automático (Mais Fácil)

Basta executar o arquivo `git-push.bat`:

1. Dê duplo clique no arquivo **git-push.bat**
2. Digite a mensagem do commit quando solicitado
3. Pressione Enter
4. Pronto! As alterações serão enviadas automaticamente

---

## 💻 Método 2: Comandos Manuais no Terminal

Abra o PowerShell ou CMD na pasta do projeto e execute:

### Passo 1: Verificar alterações
```bash
git status
```

### Passo 2: Adicionar todos os arquivos modificados
```bash
git add .
```

### Passo 3: Criar um commit com mensagem
```bash
git commit -m "Descrição das alterações"
```

**Exemplos de mensagens:**
- `git commit -m "fix: corrigir email no footer"`
- `git commit -m "feat: adicionar nova funcionalidade"`
- `git commit -m "update: atualizar informações de contato"`

### Passo 4: Enviar para o GitHub
```bash
git push origin master:main
```

---

## 📋 Comandos Úteis Adicionais

### Ver histórico de commits
```bash
git log --oneline
```

### Ver diferenças antes de commitar
```bash
git diff
```

### Desfazer alterações em um arquivo (antes do commit)
```bash
git checkout -- nome-do-arquivo
```

### Atualizar do GitHub (baixar alterações)
```bash
git pull origin main
```

### Ver repositórios remotos configurados
```bash
git remote -v
```

---

## 🔄 Fluxo Completo Resumido

```bash
# 1. Ver o que mudou
git status

# 2. Adicionar tudo
git add .

# 3. Commitar com mensagem
git commit -m "Sua mensagem aqui"

# 4. Enviar para o GitHub
git push origin master:main
```

---

## ⚡ Atalho Rápido (Tudo de uma vez)

```bash
git add . && git commit -m "Atualização rápida" && git push origin master:main
```

---

## 🆘 Solução de Problemas

### Erro de autenticação
Se pedir usuário e senha, use:
- **Usuário**: seu username do GitHub
- **Senha**: Personal Access Token (não a senha da conta)

Para criar um token: https://github.com/settings/tokens

### Conflitos ao fazer push
```bash
# Baixar alterações primeiro
git pull origin main --allow-unrelated-histories

# Resolver conflitos manualmente nos arquivos

# Adicionar arquivos resolvidos
git add .

# Commitar o merge
git commit -m "Merge: resolver conflitos"

# Enviar
git push origin master:main
```

---

## 📞 Configuração Atual

- **Repositório**: https://github.com/vulgoaltha/Afabrica_cria_ecommercegravity.git
- **Branch Local**: master
- **Branch Remota**: main
- **Usuário Git**: A Fabrica Cria
- **Email Git**: sac@afabricahcria.com.br

---

**Dica**: Sempre faça commit das alterações antes de fechar o computador ou fazer grandes mudanças! 💡
