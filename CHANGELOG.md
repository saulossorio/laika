# Changelog

Formato baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/). Versionamento semântico.

## [1.1.14] - 2026-11-25

### Adicionado
- Menu Colunas com a ordem e as colunas fixas, como em Configurar colunas do Grin 2.47. Cada coluna tem uma alça para arrastar (ou Alt e setas), a caixa que mostra ou esconde e um alfinete que fixa a coluna à esquerda. As fixas ficam num grupo no topo. "Restaurar" volta à ordem e às colunas da importação. Com mais de 12 colunas, o menu tem busca. A ordem e as fixas ficam salvas com a sessão.

## [1.1.13] - 2026-11-25

### Alterado
- Grin 2.46. Na Revisão saiu o botão Correções em lote; as mesmas correções (espaços, maiúsculas, separar valores, valores fora da lista) ficam em Ferramentas, por coluna e com prévia. O botão Ferramentas mostra só o ícone, com o nome no tooltip.

## [1.1.12] - 2026-11-25

### Alterado
- Grin 2.45. Na tela inicial, a área do arquivo ocupa a altura livre até a assinatura, com o botão no meio; o título continua no lugar de sempre.

## [1.1.11] - 2026-11-25

### Alterado
- Grin 2.44.
- Tela inicial só com o título e a área do arquivo. Saíram a descrição, o aviso sobre o navegador e a lista de formatos; o link para os dados de exemplo fica dentro da área do arquivo, centralizado com o resto.
- Revisão com duas linhas de filtros. A primeira junta a tabela (só ícone e contagem, com o nome no tooltip), os níveis e as correções em lote; a segunda é a busca. No celular, os botões com ícone mostram só o ícone e a contagem. Em Duplicados, a tabela e os motivos ficam na mesma linha.
- Busca com o texto "Buscar na tabela"; a busca diminui para a barra caber numa linha.
- Histórico › Resumo da limpeza em seções na largura da página, no lugar de um cartão estreito por tabela. Conferidas em indicadores, problemas numa tabela só com um bloco por tabela do arquivo, alterações numa tabela com uma coluna por tabela, células alteradas por coluna e ações registradas. Saíram os parágrafos explicativos do topo.

## [1.1.10] - 2026-11-24

### Alterado
- Grin 2.43, a mesma versão do Vezen.

## [1.1.9] - 2026-11-24

### Alterado
- Importação em passos, como no padrão Importar arquivo do Grin 2.42. Depois do arquivo, a tela Formato da planilha pergunta só o formato, já com o provável marcado, e diz quantas colunas foram reconhecidas. As colunas reconhecidas já vêm ligadas aos campos. Mapear colunas só é a ação principal quando sobra coluna sem campo, e mostra só essas colunas (com "Mostrar as N colunas"). Separador, codificação e cabeçalho ficam em "Opções do arquivo".
- Os dados de exemplo abrem direto na tabela.

## [1.1.8] - 2026-11-24

### Alterado
- Mapear colunas: a explicação longa do modelo fica fechada em "Como as colunas são usadas". A tabela de colunas sobe e aparece sem rolar.

## [1.1.7] - 2026-11-24

### Alterado
- Revisão: os tipos de problema saem da área de cima. Crítico, Atenção e Informação abrem um menu com caixas de seleção ("Todos" e cada tipo), e dá para combinar tipos de níveis diferentes. As correções em lote ficam num só botão de menu. A tabela começa logo abaixo.
- "Info" passa a "Informação", como no Grin.
- Celular: a página inteira rola e a tabela cresce com as linhas, em vez de ficar numa janela pequena embaixo do cabeçalho.
- Grin 2.41.

## [1.1.6] - 2026-11-24

### Alterado
- Grin 2.40. Os níveis atenção e informação usam o Grin: `.cell-info` na tabela e `.field-message.info` na gaveta. O campo com atenção mantém a borda normal; só o erro muda a borda.
- Barra de ações em massa com os botões `.btn.xs` do Grin, e Excluir em vermelho (`.btn.xs.danger`).
- O botão Confortável/Compacta sai da barra da tabela: a densidade se muda no painel Aparência. A barra cabe numa linha.
- O rodapé da gaveta tem só botões. As dicas de teclado saem dali; os atalhos estão no texto de ajuda de cada botão.

## [1.1.5] - 2026-11-24

### Alterado
- Grin 2.39. Diálogos e gaveta seguem a regra do diálogo desenhado: `.dialog-veil` do Grin no lugar do véu próprio, e o resto da tela fica `inert` enquanto estão abertos, para o foco não sair deles com Tab.
- Diálogo novo sem foco definido (Exportar, Mesclar) começa no primeiro campo, como pede o Grin.

## [1.1.4] - 2026-11-24

### Alterado
- Grin 2.38, a mesma versão do Vezen.

## [1.1.3] - 2026-11-24

### Alterado
- Grin 2.37.
- Diálogos pela regra do modal do Grin. Na confirmação, o foco começa em Cancelar, e não mais na ação (por exemplo, "Fechar tabela"). O rodapé tem só os botões: a dica "Ctrl+Enter confirma · Esc fecha" saiu, porque empurrava o botão principal para outra linha. Os atalhos continuam funcionando.

## [1.1.2] - 2026-11-24

### Alterado
- Grin 2.35.
- Largura do Grin: em telas largas, o cabeçalho e o conteúdo crescem até 1440 px e depois ficam centralizados. Só a tabela da Planilha vai de borda a borda, como no tipo Planilha do Grin. Antes o cabeçalho, os cartões de Duplicados e o Histórico iam até a borda da janela.
- As ações do cabeçalho ficam alinhadas pelo topo com o título, pela regra do Grin (antes uma regra própria do Laika fazia o mesmo).

## [1.1.1] - 2026-11-24

### Alterado
- Grin 2.32, a mesma versão do Vezen. O tooltip some com um clique e com a rolagem.

## [1.1.0] - 2026-11-24

### Alterado
- Grin 2.30.
- Sem barra superior, como pede o Grin. O nome do arquivo e o aviso de salvo ficam acima do título, e desfazer e refazer ficam ao lado de Exportar. O título fica no mesmo lugar em todas as telas e no mesmo lugar do Vezen.
- A barra lateral usa o `sidebar.js` do Grin para recolher, expandir e abrir no celular. A escolha de recolher fica guardada pelo Grin, e no celular a barra fecha ao escolher uma tela.
- O botão de tema é o do Grin (`data-theme-toggle`).
- Todos os ícones vêm do Grin. Antes 18 eram desenhos próprios do Laika.
- O logo usa `.app-logo-mark`, o quadrado de 24 px do Grin.

### Removido
- O botão "Recolher barra superior", que não tem mais função.

## [1.0.2] - 2026-11-21

### Alterado
- Grin 2.27. A tela inicial tem a mesma estrutura das outras telas: barra superior, cabeçalho no mesmo lugar e conteúdo na largura da página, com a assinatura no fim da janela. A coluna centralizada mudava a posição do título ao abrir uma tabela.
- Margem lateral de 32 px em todas as telas, a mesma do Grin e do Vezen (antes 24 px). No celular, 16 px.

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
