# Decisões

Por que o Laika é como é, e de onde vêm os IDs citados no código e nos outros documentos.

## Laika e Canis

O **Canis** é o sistema da equipe, com banco de dados, login, papéis e auditoria. O **Laika** nasceu como o **Canis Lite**: um arquivo HTML único que abre no navegador, sem internet e sem instalar nada, para analisar, limpar e exportar planilhas no layout de importação do Canis. Em 29/10/2026 virou um projeto à parte, com este repositório (a versão de partida é a de 23/10/2026).

Os dois compartilham colunas, listas e detecção de erros, e diferem no uso, na portabilidade e na implantação (D-58 do Canis, 18/10/2026).

| | Canis | Laika |
|---|---|---|
| O que é | Sistema com banco, login, papéis e auditoria | Arquivo HTML único, no navegador |
| Dados | No servidor | Só no navegador de quem usa |
| Campo obrigatório | Bloqueia ao salvar e na importação | Nenhum bloqueia; os obrigatórios do Canis entram na contagem do aviso da exportação |
| Problema Crítico | Impede salvar e importar | Sinaliza e conta no aviso da exportação |
| Linha só de empresa ou só de pessoa | Exige os campos obrigatórios | Aceita: uma linha pode ter só a empresa ou só a pessoa |
| Mesmo nome (duplicado) | Só com vínculo atual na mesma empresa | Em todo o arquivo |
| Identificação repetida | Compara país, tipo e valor | Compara só o valor |
| Ferramentas de limpeza | Não tem | Separar valores, trocar valores, completar zeros, mesclar, conferência de linhas, histórico com resumo da limpeza |
| Categoria fora da lista | Entra como categoria nova | Nota Info, o valor fica |

## Decisões que valem para o Laika

| Decisão | O que decidiu | Onde se vê no Laika |
|---|---|---|
| Arquivo HTML único, sem bibliotecas e sem etapa de build | Abre com duplo clique, funciona sem internet e qualquer pessoa pode ler o código. O código é JavaScript puro | `index.html` |
| Dados só no navegador | Nada é enviado a servidor. A sessão fica salva no armazenamento local do navegador | Não há `fetch`, XHR nem recurso externo |
| Só sinaliza (D-55) | A análise não corrige nem mescla sozinha: quem limpa decide | Ferramentas de limpeza e botão "Não é duplicado" |
| Campo vazio não é problema (D-58, 15/10/2026) | Uma linha pode ter só a empresa ou só a pessoa, como no relatório do Sirius. Exceções, que são Crítico desde 20/10/2026: pessoa sem nome, empresa sem razão social, empresa sem relacionamento | [docs/regras.md](regras.md) |
| Campos obrigatórios do Canis (D-09, 20/10/2026) | Pessoa: nome, sobrenome, e-mail, e cargo quando há empresa. Empresa: nome comercial, razão social, país e relacionamento. Categoria é opcional (RN-EMP-006). Em 21/10/2026 a identificação da empresa deixou de ser obrigatória: vira advertência | Aviso da exportação |
| Identificação sem tipo (D-10, 20/10/2026) | Empresa do Brasil, ou sem país, sem tipo de identificação é tratada como CNPJ. CNPJ aceita letras (formato alfanumérico de 2026) e usa módulo 11 | `erroIdent`, `cnpjDV` |
| Dados financeiros (D-17, 21 e 22/10/2026) | Um valor por empresa, métrica e ano, com moeda, fonte e confiança. A moeda padrão é a do país da empresa (Q-20). "Não divulga dados financeiros" é campo da empresa. A porcentagem de investimento em TI não é guardada | Tabela Dados financeiros |
| Detecção compartilhada (D-58, 18/10/2026) | Aviso de gênero diferente do nome (RN-PES-011), listas ampliadas de e-mail pessoal e de função, e avisos de mesmo site, celular e LinkedIn | [docs/regras.md](regras.md) |
| Layout de exportação | Um arquivo por tabela, nas colunas de importação do Canis, nomeado `canis_<tabela>_<data>.xlsx` | [docs/formato-sirius.md](formato-sirius.md) |

## De onde vêm os IDs

Os códigos que aparecem no código e nos documentos vêm da especificação do Canis. Cada regra que o Laika usa está explicada em [regras.md](regras.md).

| Prefixo | O que é |
|---|---|
| `RN-GER` | Regra de negócio geral (texto, datas) |
| `RN-PES` | Pessoas |
| `RN-VIN` | Vínculos entre pessoa e empresa |
| `RN-EMP` | Empresas (campos obrigatórios, identificação, categoria, relacionamento, dados financeiros) |
| `RN-DUP` | Duplicidade |
| `RN-FMT` | Formatos (endereço, telefone, LinkedIn, site) |
| `RN-ATU`, `RN-SAU`, `RN-STA`, `RN-ARQ`, `RN-LGP`, `RN-ACE` | Atualidade, saúde do registro, ciclo de vida, arquivo, privacidade e acesso. Não se aplicam ao Laika, exceto `RN-LGP-009` (não guardar exportações com dados reais fora do ambiente) |
| `D-nn` | Decisão registrada no Canis (D-09, D-10, D-17, D-55, D-58) |
| `Q-nn` | Questão aberta respondida pelo dono do produto (Q-20: moeda padrão) |
| `08 §2`, `08 §8` | Seções do documento de importação e exportação do Canis: layout de colunas e arquivos do Canis Lite |
| `SIR-nn` | Chamado do Sirius |

## Pendências de decisão

- **Prefixo dos arquivos exportados:** hoje saem como `canis_pessoas_…`, porque são o layout de importação do Canis. Se o Laika passar a servir a outros destinos, o prefixo e o nome do histórico (`canis_historico_…`) podem mudar.
- **Regras do Canis sem equivalente no Laika:** RN-PES-010 e RN-VIN-005. Veja a tabela em [regras.md](regras.md#regras-do-canis-que-o-laika-não-aplica).
- **Código-fonte separado do HTML gerado:** hoje as regras, o CSS e a tela vivem juntos em `index.html` (cerca de 2.850 linhas, algumas muito longas). Separar em arquivos de fonte mais um passo que monta o HTML único melhora os diffs no GitHub, mas muda como o arquivo é editado. Fica para quando houver necessidade.
