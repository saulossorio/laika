# Relatório de Vínculos Empresariais do Sirius

O Laika foi criado para limpar este relatório antes de importá-lo no Canis. Este documento descreve como ele é e como o Laika o lê. O arquivo de exemplo, com dados inventados, é `tests/dados/sirius-vinculos-ficticio.xls`. Nunca coloque neste repositório um relatório real.

## Como o arquivo vem

| Característica | Detalhe |
|---|---|
| Extensão | `.xls`, mas **não é uma planilha**: é uma página HTML com uma tabela, salva com essa extensão. O Excel abre, mas o conteúdo é HTML |
| Codificação | Windows-1252. O Laika detecta: marca BOM, senão UTF-8, senão Windows-1252 |
| Título | A primeira linha tem só o título "Relatório de Vínculos Empresariais" |
| Colunas | 56: 44 da empresa e 12 da pessoa |
| Agrupamento | Cada empresa aparece uma vez, com as colunas da empresa ocupando várias linhas (`rowspan`), e uma linha por pessoa ligada a ela. As linhas seguintes da mesma empresa trazem só as 12 colunas da pessoa |
| Vários valores | Telefones, e-mails, anos e valores de uma célula vêm separados por quebra de linha (`<br>`) |
| Vazio | `-` ou `N/A`, no lugar de célula vazia |
| Cabeçalho | Quebrado em várias linhas (`<br>`); o Laika junta com espaço |

## Colunas

**Empresa (44):** Razão Social, Nome Fantasia, CNPJ/Identificador Equivalente, Situação (Empresa), Tipo da Empresa, Segmento, Segmento Pesquisa, Setor, Relacionamento Empresa, País Empresa (Dados Gerais), País Empresa (Endereço), Estado, Cidade, Cep e Logradouro da empresa (Endereço), Telefone Empresarial, E-mail Empresarial, Moeda, Porcentagem de Investimento em TI, Não Divulga Dados Financeiros, os pares Ano e Valor de cada métrica financeira, N° de Funcionários Global e de TI, Observações Empresa e Última Atualização.

**Pessoa (12):** Nome Pessoa, Cargo Pessoa, Nível de Alcance Pessoa, Grau de Importância, Situação Pessoa, Telefone Pessoa, Telefone Principal, Celular Pessoa, E-mail Pessoa, Relacionamento Pessoa, Sexo Pessoa, Observações Pessoa.

## Como o Laika lê

- **Pessoas e Empresas juntas:** o Laika cria duas tabelas ligadas. Cada pessoa aponta para a empresa dela, e as colunas `empresa_*` da pessoa são copiadas da empresa (só a coluna Empresa aparece na tela; as outras saem na exportação). A tabela Empresas ganha a coluna Pessoas, com quantas pessoas estão ligadas, que é calculada e não sai na exportação.
- **Mapeamento:** automático pelo cabeçalho, com sinônimos (por exemplo "Nome Fantasia" e "Fantasia" para nome comercial), e editável na tela. Coluna sem correspondência fica de fora até você mapear.
- **Marcadores de vazio** (`-`, `N/A` e parecidos) viram célula vazia, e o original fica guardado no painel da linha.
- **Linha só com dado de pessoa** (situação, telefone), sem nome, e-mail, celular, LinkedIn nem cargo, não vira pessoa: é uma linha de empresa sem pessoas.
- **Estado por extenso** (`Paraná`) é aceito como UF.
- **Cabeçalho em várias linhas** vira um nome de coluna só.

## Dados financeiros

Cada par de colunas **Ano** e **Valor** de uma métrica vira linhas da tabela Dados financeiros: uma linha por empresa, métrica e ano.

| Métrica no Laika | Colunas do Sirius |
|---|---|
| Faturamento | Faturamento (Ano) e (Valor) |
| Investimento em TI | Investimento em TI Anual (Ano) e (Valor) |
| Receita líquida, Valor empenhado, Valor orçado, Valor licitado | par Ano e Valor de cada uma |
| Faturamento (pesquisa) | Pesquisa (Valor Faturamento) |
| Investimento em TI (pesquisa) | Pesquisa (Valor Investimento TI) |
| OPEX, CAPEX | Pesquisa (Valor OPEX) e (Valor CAPEX) |

- **Vários anos na mesma célula** (um por linha) se ligam ao valor da mesma posição. Quantidades diferentes de anos e valores geram o aviso `anosValores`.
- **Valor:** o Laika entende `R$ 1.200.000,00`, ponto decimal, moeda antes do número e `mil`, `mi` e `bi`, e grava no formato brasileiro com duas casas (`1.200.000,00`).
- **Moeda:** vem do símbolo do valor (R$), senão da coluna Moeda, senão do país da empresa. País vazio conta como Brasil.
- **Fonte e confiança:** a fonte é "Migração Sirius" e a confiança, Baixa. O texto original do arquivo fica no painel da linha.
- **Não divulga dados financeiros:** o `✗` da coluna vale Sim.
- **Porcentagem de Investimento em TI** não entra: o Canis calcula (investimento em TI dividido pelo faturamento do mesmo ano).
- A mesma empresa com valores diferentes em outra linha do arquivo gera `valorVariante`; a mesma métrica e o mesmo ano repetidos aparecem em Duplicados.

As regras de cada problema estão em [regras.md](regras.md).

## O que sai na exportação

Um arquivo por tabela, no layout de importação do Canis: `canis_empresas_…`, `canis_pessoas_…` e, quando o arquivo de origem tem colunas financeiras, `canis_financeiro_…`. Na importação do Canis, as empresas vêm primeiro. O prefixo `canis_` é do layout de importação do Canis, não do Laika.

- As colunas `situacao`, `conferida` e `avisos` são opções da exportação do Laika, desligadas por padrão, e não fazem parte do layout do Canis.
- Se a planilha de origem não tem o tipo da identificação, o arquivo de empresas sai sem `identificacao_tipo`. A importação do Canis trata como CNPJ a identificação de empresa do Brasil.
- O histórico (resumo da limpeza e cada alteração) é exportado à parte, sempre em XLSX, com as abas Resumo e Alterações.
