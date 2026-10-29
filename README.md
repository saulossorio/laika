# Laika

Ferramenta para abrir, analisar, limpar e exportar planilhas de contatos (pessoas e empresas) no layout de importação do Canis. É um único arquivo HTML: abre no navegador, funciona sem internet e **os dados não saem do seu computador**.

O caso principal é o relatório "Vínculos Empresariais" do Sirius, que vem com pessoas e empresas juntas e vira duas tabelas ligadas, Pessoas e Empresas, mais uma tabela de Dados financeiros quando o arquivo tem valores.

## Como usar

1. Abra `index.html` no navegador (duplo clique). Não há nada para instalar.
2. Carregue o arquivo: CSV, TXT, TSV, XLSX ou o `.xls` do Sirius (que na verdade é uma página HTML salva com essa extensão). Planilhas `.xls` binárias antigas não abrem: salve como `.xlsx` ou CSV.
3. Confira o mapeamento das colunas. O Laika reconhece os cabeçalhos mais comuns, e você pode ajustar.
4. Revise os problemas, do mais grave ao mais leve: **Crítico**, **Atenção**, **Info**. Nada é corrigido sozinho: use as ferramentas de limpeza (separar valores, trocar valores, completar zeros, mesclar duplicados) ou edite a célula.
5. Exporte. Antes de gerar o arquivo, o Laika avisa quantas linhas o Canis recusaria.

Para experimentar sem dados reais, abra `tests/dados/sirius-vinculos-ficticio.xls`.

## O que o Laika confere

Cada problema tem um nível de severidade. A lista completa, com exemplos e a função do código de cada regra, está em [docs/regras.md](docs/regras.md).

| Nível | Significado |
|---|---|
| Crítico | O Canis recusaria a linha. Por exemplo: e-mail inválido, CNPJ com dígito errado, valor fora da lista, pessoa sem nome, e-mail ou identificação duplicados |
| Atenção | O Canis aceita, mas vale conferir. Por exemplo: e-mail de função, telefone ou CEP fora do padrão, gênero diferente do nome, possível duplicado |
| Info | Nota. Por exemplo: espaços extras, nome em maiúsculas |

## Privacidade

- O arquivo não faz chamadas de rede e não carrega nada de fora.
- A sessão fica salva só no navegador de quem usa (armazenamento local).
- Não guarde neste repositório relatórios nem exportações com dados reais. O `.gitignore` bloqueia `.xls`, `.xlsx` e `.csv` fora de `tests/dados/`, que só tem dados fictícios.

## Onde está cada coisa

| Caminho | O que é |
|---|---|
| `index.html` | O Laika inteiro: estilos, regras (`<script id="regras">`) e a tela |
| `docs/regras.md` | Todas as regras, agrupadas por severidade |
| `docs/formato-sirius.md` | Como é o relatório do Sirius e como o Laika o lê |
| `docs/decisoes.md` | Por que o Laika é assim, e de onde vêm os IDs (`RN-*`, `D-*`) |
| `tests/` | Testes das regras e dados fictícios. Veja [tests/README.md](tests/README.md) |
| `assets/laika-logo.svg` | Logo |
| `CHANGELOG.md` | Histórico de versões |

## Testes

Precisa só do Node.js:

```sh
node tests/regras.test.cjs
```

## Origem

O Laika nasceu como o Canis Lite, a versão em arquivo único do Canis. Usa as mesmas colunas, listas e regras de detecção, mas é um projeto à parte. Veja [docs/decisoes.md](docs/decisoes.md#laika-e-canis).
