# Testes

Só com dados fictícios (RN-LGP-009). Precisam só do Node.js, sem instalar nada.

| Arquivo | O que é |
|---|---|
| `regras.test.cjs` | Carrega o bloco `<script id="regras">` de `../index.html` e confere cada regra de [docs/regras.md](../docs/regras.md): um valor que deve disparar e outro que não, com o tipo e o nível esperados. Também falha se o código emitir um tipo de problema, ou citar um ID `RN-*`, que o documento não menciona |
| `gerar-dados.cjs` | Gera os arquivos de `dados/`. O principal é uma réplica do relatório "Vínculos Empresariais" do Sirius (página HTML salva como `.xls`, Windows-1252, 56 colunas, empresa agrupada com `rowspan`, quebras de linha com `<br>`, `-` como vazio), com valores inventados. Gera também um CSV em Windows-1252 |
| `dados/` | Arquivos gerados. Abra no Laika para experimentar |

```sh
node tests/regras.test.cjs     # confere as regras
node tests/gerar-dados.cjs     # recria os arquivos de tests/dados/
```

## O que não é testado automaticamente

As regras que dependem da tela e de um arquivo carregado (`anosValores`, `valorVariante`, `vinculo`, `variantes`, agrupamento de duplicados, aviso da exportação) foram confirmadas lendo o código, não por teste. O Canis Lite tinha um roteiro de navegador (Playwright) para isso; ainda não foi portado para este repositório. Veja a coluna **Teste** em [docs/regras.md](../docs/regras.md).
