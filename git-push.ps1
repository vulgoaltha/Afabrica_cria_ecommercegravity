# Script PowerShell para Git Push
# A Fabrica Cria

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Git Push - A Fabrica Cria" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Atualizar PATH
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

# Verificar status
Write-Host "[1/4] Verificando alteracoes..." -ForegroundColor Yellow
git status
Write-Host ""

# Adicionar todos os arquivos
Write-Host "[2/4] Adicionando arquivos..." -ForegroundColor Yellow
git add .
Write-Host ""

# Solicitar mensagem de commit
$commit_msg = Read-Host "Digite a mensagem do commit"
if ([string]::IsNullOrWhiteSpace($commit_msg)) {
    $commit_msg = "Atualizacao automatica"
}

# Criar commit
Write-Host "[3/4] Criando commit..." -ForegroundColor Yellow
git commit -m "$commit_msg"
Write-Host ""

# Fazer push
Write-Host "[4/4] Enviando para o GitHub..." -ForegroundColor Yellow
git push origin master:main
Write-Host ""

if ($LASTEXITCODE -eq 0) {
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "   SUCESSO! Alteracoes enviadas!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
} else {
    Write-Host "========================================" -ForegroundColor Red
    Write-Host "   ERRO! Verifique as mensagens acima." -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Red
}

Write-Host ""
Write-Host "Pressione qualquer tecla para continuar..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
