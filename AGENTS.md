# Instruções para agentes de IA

Vale para qualquer agente (Claude Code, Codex, Cursor e outros) que for ler ou mudar este repositório. Leia este arquivo inteiro antes de mexer em qualquer coisa.

## O que é

O Laika abre, analisa, limpa e exporta planilhas de contatos (pessoas e empresas) no layout de importação do Canis. É um único arquivo, `index.html`, que funciona sem instalar nada e sem internet, e guarda a sessão no navegador de quem usa.

Faz parte da família do Canis:
- **Sirius:** o CRM atual. O caso principal do Laika é o relatório "Vínculos Empresariais" dele (`docs/formato-sirius.md`).
- **Canis:** o sistema novo. O Laika nasceu como o Canis Lite e compartilha colunas, listas e regras com ele (`docs/decisoes.md`).
- **Vezen:** a ferramenta que estima o investimento em TI de empresas.

Está publicado no GitHub Pages: https://saulossorio.github.io/laika/. O site é o `index.html` da raiz da branch `main`. **Cada push na `main` atualiza o site em poucos minutos.**

## Antes de mudar

1. Leia o `README.md` e este arquivo. Para regras de validação, leia `docs/regras.md`; para o porquê das escolhas, `docs/decisoes.md`.
2. Rode os testes antes de mudar, para saber o estado de partida.
3. Abra a tela com os dados de exemplo (link na tela inicial) e veja o que vai mudar.

## Como o `index.html` está organizado

| Bloco | O que tem |
|---|---|
| Primeiro `<style>` e primeiro `<script>` | O design system Grin, copiado de `dist/grin.inline.css` e `dist/grin.js` de uma release, com as fontes Geist e Geist Mono embutidas. A versão está no comentário do topo do arquivo. Não edite: para mudar de versão, rode `node tools/atualizar-grin.cjs X.Y` (veja “Grin”, abaixo) |
| Segundo `<style>` | O CSS próprio do Laika, só com tokens do Grin |
| `<script id="regras">` | As regras compartilhadas com o Canis: listas, campos, validações, duplicados, gênero e dados financeiros. Não toca na tela; o teste o roda no Node. Cada regra está em `docs/regras.md` |
| Último `<script>` | A ferramenta, em seções numeradas: 1 ícones e utilidades, 2 diferenças de uso do Laika, 3 modelos de colunas, 4 leitura de CSV, XLSX e HTML, 5 escrita de CSV e XLSX, 6 estado, histórico e gravação, 7 análise, 8 telas, 9 ações e eventos, 10 dados de exemplo, tour e início |

## Como a interface funciona

- **Estado e desenho.** `S` é o estado da tela, `P` as tabelas carregadas e `D` a tabela em uso (`P.t[S.ent]`). Toda mudança altera o estado e chama `render()`, que redesenha `#app` inteiro a partir dele (`draw`, `htmlApp`). O foco e a rolagem são devolvidos depois do desenho (`S.foco`, `data-scroll`). Não guarde estado no DOM.
- **Eventos.** Um ouvinte só para cada tipo: cliques procuram `data-a` e chamam `AC[nome]`; mudanças de campo, `data-ch` e `CH[nome]`; digitação, `data-in` e `IN[nome]`. Para um botão novo, acrescente a ação em `AC`, não um `addEventListener`.
- **Edições e histórico.** Toda mudança de dado passa por `mudar(rótulo, lista)`, que grava os valores originais (`r.o`), o histórico (desfazer e refazer) e o registro da tela Histórico (`P.log`). Não altere `r.v` direto.
- **Telas.** `S.tela`: `inicio`, `mapear` (formato e colunas da importação), `tabela`, `revisao`, `duplicados` e `historico`. A linha aberta é uma gaveta (`S.gaveta`); diálogos em `S.dlg` (exportar, ferramentas, mesclar, confirmar); menus em `S.pop`.
- **Tabela.** Colunas Saúde (o problema mais grave), conferida (coluna estreita com o ✓) e, se ligada no menu Colunas, Linha da planilha (`D.verLinha`). O menu Colunas guarda a ordem (`D.cols`, `D.ordem0` para Restaurar), as ocultas (`D.ocultas`) e as fixas à esquerda (`fixasDe(D)`).
- **Filtros.** No máximo duas linhas acima da tabela, como manda o Grin. No celular, a linha dos níveis e os botões de filtro levam `.filters-extra` e se recolhem atrás do botão Filtros (`S.filtrosAbertos`).
- **Correções.** Só sinaliza: nada é corrigido sozinho. As correções em várias linhas ficam em Ferramentas, por coluna e com prévia; não há correção em lote pelos níveis.
- **Gravação.** A sessão vai para o IndexedDB (banco `laika`, chave `sessao`, formato `versao: 2`); `laika-sessao` no `localStorage` é a reserva para navegadores que não abrem o IndexedDB em arquivo local. Preferências: `laika-tema`, `laika-densidade`, `laika-tamanho`, `laika-formato`, `laika-tour`. Se mudar o formato da sessão, adapte `lerSessao()` e `migrarSessao()` para que sessões antigas continuem abrindo.
- **Tour guiado.** `TOUR` (seção 10) lista os passos para o `startTour` do Grin: título, texto, `acao`, alvo (seletores ou funções, em ordem de preferência; o primeiro visível vale), `clique` e `tarefa`. É um exercício com os dados de exemplo; quem age é a pessoa. Feita a ação, o cartão diz "Feito" e espera o Próximo. Abre sozinho uma vez por navegador, menos em navegador automatizado. Ao mudar, renomear ou tirar algo que o tour mostra ou pede, atualize o passo no mesmo commit e refaça o tour no computador e no celular.

## Regras que não podem quebrar

- **Um arquivo só, sem rede.** Nada de CDN, pacote, `fetch` ou recurso externo no `index.html`. O arquivo abre com duplo clique e funciona sem internet.
- **O site depende do `index.html` na raiz.** Não mova nem renomeie esse arquivo.
- **As regras não mexem na tela.** Nada de `document` ou `window` dentro de `<script id="regras">`.
- **Regras do Canis.** Não invente regra de validação nem mude nível de problema por conta própria. Regra nova ou mudada entra também em `docs/regras.md`, com o ID de origem; o teste falha se o código citar um tipo ou ID que o documento não tem.
- **Privacidade.** Nenhum dado real entra no repositório: nem relatórios do Sirius, nem planilhas, nem exportações. O `.gitignore` bloqueia `.xls`, `.xlsx` e `.csv` fora de `tests/dados/`, que só tem dados fictícios (`tests/gerar-dados.cjs`).
- **Sem arquivos avulsos.** Nada de cópias, demos ou páginas de teste soltas. Arquivo novo entra na estrutura (`tests/`, `tools/`, `docs/`).

## Como escrever

- Nomes e comentários do código em português, no estilo do resto do arquivo. Comente pouco, só o porquê.
- Textos da tela em português do Brasil, secos e informativos: sem saudação, exclamação, primeira pessoa nem frase de propaganda. Diga o que a coisa é ou faz.
- Números e datas no formato brasileiro: 1.234; dd/mm/aaaa.
- Não use travessão para unir ou interromper frases. Use vírgula, dois-pontos, parênteses ou frases separadas.

## Grin

O Grin (https://saulossorio.github.io/grin/, repositório `saulossorio/grin`) é a fonte da verdade do desenho, para o Laika e para o Vezen.

- **Primeiro no Grin.** Uma necessidade que serve a qualquer ferramenta (um componente, um estado, uma regra de layout) é decidida e publicada no Grin, numa versão nova, e só depois aplicada aqui. Não resolva no CSS do Laika o que é genérico. Use os componentes, as classes e os atributos ARIA da documentação do Grin, e só os tokens semânticos dele (nunca uma cor fixa). Os quatro temas precisam funcionar: claro e escuro, cada um com e sem alto contraste.
- **Mesma versão.** O Laika e o Vezen usam sempre a mesma versão do Grin. Ao atualizar um, atualize o outro no mesmo dia.
- **Pergunte antes.** Antes de mudar algo além do que foi pedido, confira o que o Grin diz (`docs/patterns.html`, `docs/components.html` e o CSS do componente) e diga ao dono do produto, em uma frase, o que a regra permite. Se o pedido vai contra uma regra do Grin, ou precisa de uma regra que o Grin não tem, pergunte antes de mudar.
- **Atualizar.** `node tools/atualizar-grin.cjs X.Y` baixa `dist/grin.inline.css` e `dist/grin.js` da tag `vX.Y` (ou `node tools/atualizar-grin.cjs X.Y ../grin`, de uma cópia local do repositório), troca os dois blocos inteiros, atualiza a versão no `index.html` e no `README.md` e confere as duas fontes embutidas. Os comentários do código que citam uma versão antiga, como “(Grin 2.41: filtro por nível)”, contam de onde veio uma regra e ficam como estão. Depois, suba a versão do Laika e registre no `CHANGELOG.md` ("Grin X.Y, a mesma versão do Vezen"), como em toda mudança.

## Testes

```sh
node tests/regras.test.cjs     # confere cada regra de docs/regras.md (só Node.js)
```

- Tudo precisa passar antes de dar uma mudança por terminada. Se algo falhar, diga o que falhou; não esconda nem apague o teste.
- A tela não tem teste automático neste repositório (veja `tests/README.md`). Ao mudar a tela, confira no navegador com os dados de exemplo: Tabela, Revisão, Duplicados, Histórico, a gaveta de uma linha, Exportar e o tour inteiro, em 1366, 925 e 390 px de largura, sem erro no console e sem rolagem lateral no celular.

## Ao terminar uma mudança

1. Rode os testes e confira a tela como descrito acima. O dono do produto costuma usar uma janela de uns 925 px.
2. Toda mudança ganha uma versão: suba `VERSAO` no `index.html` e registre a mudança no `CHANGELOG.md`, no formato Keep a Changelog e em português. Se mudar algo que um documento descreve (README, `docs/`, este arquivo, o tour), atualize o documento no mesmo commit.
3. O dono do produto pediu que toda mudança vá ao ar: faça commit e push na `main`. A mensagem de commit vai em português e diz o que mudou e por quê. Nunca use `--no-verify`.
4. Depois do push, espere o GitHub Pages e abra https://saulossorio.github.io/laika/: confira que a versão nova está lá e que a página abre sem erro. Só então diga “publicado como X.Y.Z”.

## Falando com o dono do produto

O dono do produto escreve em espanhol. Responda em espanhol, curto: a conclusão e, se precisar, uma pergunta. Faça uma pergunta de cada vez. Não use siglas, códigos internos nem nomes de função. Antes de mudar uma regra de validação, ou o desenho além do que foi pedido, pergunte (veja “Grin”).

## Pendências conhecidas

Veja “Pendências de decisão” em `docs/decisoes.md` e “O que não é testado automaticamente” em `tests/README.md`.
