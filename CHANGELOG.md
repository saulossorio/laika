# Changelog

Formato baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/). Versionamento semântico.

## [1.0.1] - 2026-11-21

### Alterado
- Grin 2.26. A tela inicial usa a largura do padrão Tela inicial do Grin (`--size-start`, 680 px), a mesma do Vezen. Visualmente não muda.

## [1.0.0] - 2026-11-21

Primeira versão estável do Laika, aprovada pelo dono do produto em 21/11/2026. Não há mudança de funcionamento em relação à 0.3.4.
- Visual e partes obrigatórias do Grin 2.25: barra lateral do Grin, versão no logo, tema claro e escuro com sol e lua, painel Aparência e assinatura na tela inicial.
- Regras de detecção, importação, mapeamento, duplicados com mescla manual, histórico e exportação no formato do Canis, conferidas por `tests/regras.test.cjs`.

## [0.3.4] - 2026-11-21

### Alterado
- Tela inicial: o conteúdo fica centralizado na vertical, com o mesmo espaço acima e abaixo, e a assinatura no fim da janela.

## [0.3.3] - 2026-11-21

### Alterado
- Tela inicial cabe numa janela de notebook (1346 × 734) sem rolar, com ou sem sessão guardada.
- Sem barra superior na tela inicial, onde não há tabela aberta.
- Com uma sessão guardada, "Continuar" é o botão principal e "Escolher arquivo" passa a secundário. "Continuar de onde parei" virou "Continuar", e a data da sessão fica numa linha própria.
- Textos mais curtos na apresentação, na área de arrastar e no aviso sobre os dados.

## [0.3.2] - 2026-11-21

### Alterado
- Grin 2.25. Na tela inicial, a assinatura fica no fim da janela, com 20 px de espaço embaixo, como no Vezen.

## [0.3.1] - 2026-11-21

### Alterado
- Grin 2.23. A assinatura aparece só na tela inicial, no fim do conteúdo, e rola com ele. Antes era uma faixa fixa embaixo de todas as telas.
- O logo cabe num quadrado de 24 px, como os do Grin e do Vezen. O desenho, mais largo que alto, fica centralizado nesse quadrado.

## [0.3.0] - 2026-11-21

### Adicionado
- Versão ao lado do nome, no logo da barra lateral.
- **Painel Aparência do Grin** no pé da barra lateral, logo abaixo do botão de tema, com tema, alto contraste, densidade e tamanho da fonte. O tema e a densidade escolhidos ali e os dos botões do Laika ficam sempre iguais.
- **Assinatura** embaixo de cada tela: "Laika 0.3.0 · por Saúl Ossorio", com a versão do Grin usada.

### Alterado
- Grin 2.22 (https://github.com/saulossorio/grin/releases/tag/v2.22).

### Não mudou
- Regras de detecção, importação, mapeamento, duplicados, histórico e exportação.

## [0.2.0] - 2026-11-21

### Alterado
- Visual do Laika trocado pelo Grin 2.19 (https://github.com/saulossorio/grin/releases/tag/v2.19). O `index.html` traz `dist/grin.inline.css` e `dist/grin.js` copiados dessa versão.
- Fontes Geist e Geist Mono no lugar de Public Sans e JetBrains Mono. A licença SIL OFL 1.1 das fontes está em `assets/OFL.txt`.
- Barra lateral, cabeçalho, botões, tabela, gaveta, diálogos, menus, avisos, filtros e campos usam as classes do Grin. O CSS próprio do Laika ficou só com o que é desta ferramenta (tabela de largura fixa, mapeamento, duplicados, histórico), sempre com tokens do Grin.
- A densidade Compacta e Confortável muda também a altura dos controles, como no Grin.
- No celular, a barra lateral abre pelo botão de menu no canto superior esquerdo.
- Logo novo: três triângulos equiláteros verdes do mesmo tamanho, duas orelhas e o rosto, na barra lateral, no favicon e em `assets/laika-logo.svg`.

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
