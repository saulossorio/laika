# Laika

Ferramenta para abrir, analisar, limpar e exportar planilhas de contatos (pessoas e empresas) no layout de importação do Canis. É um único arquivo HTML: abre no navegador, funciona sem internet e **os dados não saem do seu computador**.

O caso principal é o relatório "Vínculos Empresariais" do Sirius, que vem com pessoas e empresas juntas e vira duas tabelas ligadas, Pessoas e Empresas, mais uma tabela de Dados financeiros quando o arquivo tem valores.

## Como usar

1. Abra `index.html` no navegador (duplo clique). Não há nada para instalar.
2. Carregue o arquivo: CSV, TXT, TSV, XLSX ou o `.xls` do Sirius (que na verdade é uma página HTML salva com essa extensão). Planilhas `.xls` binárias antigas não abrem: salve como `.xlsx` ou CSV.
3. Escolha o formato da planilha (Pessoas e Empresas, Pessoas, Empresas ou Livre). O Laika já marca o provável e liga as colunas que reconhece pelo nome. A tela de mapear colunas só aparece se sobrar coluna sem campo, ou se você pedir para conferir. Os dados de exemplo abrem direto na tabela.
4. Revise os problemas, do mais grave ao mais leve: **Crítico**, **Atenção**, **Informação**. Nada é corrigido sozinho: use as ferramentas de limpeza (separar valores, trocar valores, completar zeros, mesclar duplicados) ou edite a célula.
5. Exporte. Antes de gerar o arquivo, o Laika avisa quantas linhas o Canis recusaria.

Para experimentar sem dados reais, use o link "abra os dados de exemplo" na tela inicial ou abra `tests/dados/sirius-vinculos-ficticio.xls`.

## Na tela

- **Tour guiado:** abre sozinho na primeira visita e fica na barra lateral. É um exercício com os dados de exemplo: abrir uma linha com problema, corrigir, marcar como conferida, ver a Revisão, os Duplicados e a exportação. Feita cada ação, o tour espera o Próximo.
- **Tabela:** a coluna Saúde mostra o problema mais grave da linha; a coluna estreita ao lado marca as linhas conferidas. O número da linha na planilha original fica escondido e se liga em Colunas, "Linha da planilha".
- **Colunas:** o menu mostra ou esconde cada coluna, muda a ordem (arrastar pela alça ou Alt e setas) e fixa colunas à esquerda. "Restaurar" volta à ordem da importação. Tudo fica salvo com a sessão.
- **Revisão:** só as linhas com problema, com os filtros em até duas linhas: as tabelas em ícones (o nome no tooltip) e os níveis Crítico, Atenção e Informação, cada um com o menu dos tipos de problema.
- **Ferramentas de limpeza:** um botão só com ícone, ao lado de Colunas. As correções em várias linhas são feitas por coluna e com prévia; não há correção em lote pelos níveis.
- **Duplicados**, **Histórico** (com o resumo da limpeza) e **Exportar**, que avisa quantas linhas o Canis recusaria.

## O que o Laika confere

Cada problema tem um nível de severidade. A lista completa, com exemplos e a função do código de cada regra, está em [docs/regras.md](docs/regras.md).

| Nível | Significado |
|---|---|
| Crítico | O Canis recusaria a linha. Por exemplo: e-mail inválido, CNPJ com dígito errado, valor fora da lista, pessoa sem nome, e-mail ou identificação duplicados |
| Atenção | O Canis aceita, mas vale conferir. Por exemplo: e-mail de função, telefone ou CEP fora do padrão, gênero diferente do nome, possível duplicado |
| Informação | Nota. Por exemplo: espaços extras, nome em maiúsculas |

## Privacidade

- O arquivo não faz chamadas de rede e não carrega nada de fora.
- A sessão fica salva só no navegador de quem usa (armazenamento local).
- Não guarde neste repositório relatórios nem exportações com dados reais. O `.gitignore` bloqueia `.xls`, `.xlsx` e `.csv` fora de `tests/dados/`, que só tem dados fictícios.

## Onde está cada coisa

| Caminho | O que é |
|---|---|
| `index.html` | O Laika inteiro: o Grin 2.50 (estilos e scripts, copiados da release), as regras (`<script id="regras">`) e a tela |
| `docs/regras.md` | Todas as regras, agrupadas por severidade |
| `docs/formato-sirius.md` | Como é o relatório do Sirius e como o Laika o lê |
| `docs/decisoes.md` | Por que o Laika é assim, e de onde vêm os IDs (`RN-*`, `D-*`) |
| `tests/` | Testes das regras e dados fictícios. Veja [tests/README.md](tests/README.md) |
| `assets/laika-logo.svg` | Logo |
| `assets/OFL.txt` | Licença das fontes Geist e Geist Mono, que vêm com o Grin |
| `CHANGELOG.md` | Histórico de versões |

## Testes

Precisa só do Node.js:

```sh
node tests/regras.test.cjs
```

## Origem

O Laika nasceu como o Canis Lite, a versão em arquivo único do Canis. Usa as mesmas colunas, listas e regras de detecção, mas é um projeto à parte. Veja [docs/decisoes.md](docs/decisoes.md#laika-e-canis).
