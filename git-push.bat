@echo off
echo ========================================
echo   Git Push - A Fabrica Cria
echo ========================================
echo.

REM Atualizar PATH com Git e Node.js
set PATH=%PATH%;C:\Program Files\Git\cmd;C:\Program Files\nodejs

REM Verificar status
echo [1/4] Verificando alteracoes...
git status
echo.

REM Adicionar todos os arquivos
echo [2/4] Adicionando arquivos...
git add .
echo.

REM Solicitar mensagem de commit
set /p commit_msg="Digite a mensagem do commit: "
if "%commit_msg%"=="" set commit_msg=Atualizacao automatica

REM Criar commit
echo [3/4] Criando commit...
git commit -m "%commit_msg%"
echo.

REM Fazer push
echo [4/4] Enviando para o GitHub...
git push origin master:main
echo.

if %errorlevel% equ 0 (
    echo ========================================
    echo   SUCESSO! Alteracoes enviadas!
    echo ========================================
) else (
    echo ========================================
    echo   ERRO! Verifique as mensagens acima.
    echo ========================================
)

echo.
pause
