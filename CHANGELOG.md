# Changelog

Formato baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/). Versionamento semântico.

## [0.1.0] - 2026-10-29

Primeira versão como projeto próprio. Parte do Canis Lite de 23/10/2026.

### Adicionado
- Logo do Laika (cabeça de cachorro com capacete) no cabeçalho e no favicon, em `assets/laika-logo.svg`.
- `docs/regras.md`: todas as regras de detecção agrupadas por severidade (Crítico, Atenção, Info), com ID, exemplo, ferramenta e função do código.
- `docs/formato-sirius.md` e `docs/decisoes.md`.
- `tests/regras.test.cjs`: confere cada regra e que `docs/regras.md` cita todos os tipos de problema e IDs do código.
- Dados fictícios em `tests/dados/` e o script que os gera.

### Alterado
- Renomeado de Canis Lite para Laika: nome, título, favicon, cabeçalho e chaves de armazenamento do navegador (`laika-*`). O Laika não compartilha sessão nem preferências com o Canis Lite.
- `index.html` é o próprio Laika (antes era uma página "em construção").
- Comentários que mandavam rodar `node lite/montar.cjs` agora apontam para `docs/regras.md` e `tests/`.
