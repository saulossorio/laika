# Regras do Laika

Este documento lista todas as regras que o Laika aplica, agrupadas pelo nível de severidade. É a referência para revisar à mão: cada regra diz o que confere, um exemplo que a dispara, a ferramenta que ajuda a resolver e a função de `index.html` onde está o código.

Os IDs (`RN-PES-001`, `D-58`, `Q-20`) vêm da especificação do Canis: o Laika usa as mesmas regras de detecção. O texto de cada regra está aqui, então não é preciso ter a especificação do Canis para entendê-las. Veja [decisoes.md](decisoes.md#de-onde-vêm-os-ids).

Os testes em `tests/regras.test.cjs` rodam as regras deste documento (`node tests/regras.test.cjs`). A coluna **Teste** diz se a regra tem teste automático (**sim**) ou só foi confirmada lendo o código (**leitura**). Veja a [verificação do código](#verificação-do-código).

## Como o Laika classifica

| Nível | O que significa |
|---|---|
| **Crítico** | O Canis recusaria a linha na importação. O Laika deixa a linha passar, mas conta no aviso antes de exportar |
| **Atenção** | O Canis aceita e sinaliza. Vale conferir, mas não bloqueia |
| **Info** | Nota. Não conta como problema |

Na tela, cada nível aparece com cor, ícone e texto juntos (círculo com exclamação, triângulo e i).

- O nível de uma célula ou de uma linha é o **mais grave** entre os problemas dela.
- Nada é corrigido nem mesclado sozinho: o Laika só sinaliza (D-55). As ferramentas de limpeza agem quando a pessoa pede.
- Info não entra na contagem de linhas com problema; Crítico e Atenção entram.
- **Campo vazio não é problema**, com estas exceções, que são Crítico: pessoa sem nome, empresa sem razão social, empresa sem relacionamento e, nos dados financeiros, valor sem ano e sem valor. Os demais obrigatórios do Canis aparecem só no [aviso da exportação](#aviso-da-exportação).
- Só valem as regras das colunas que a tabela tem. Sem a coluna Nome, por exemplo, não há problema de pessoa sem nome.

## Crítico

| Tipo no código | Rótulo na tela | ID | O que confere | Exemplo que dispara | Ferramenta | Função | Teste |
|---|---|---|---|---|---|---|---|
| `email` | E-mail inválido | RN-PES-002 | O e-mail tem formato válido (`algo@dominio.xx`) | `ana.lima` | | `problemasDoValor` | sim |
| `pessoal` | E-mail pessoal | RN-PES-003 | Na tabela Pessoas, o domínio não pode ser de e-mail pessoal: 21 domínios, como gmail, hotmail, outlook, yahoo, icloud, proton, uol e terra. Fora de Pessoas é só [Atenção](#atenção) | `ana@gmail.com` | | `problemasDoValor`, lista `DOMINIOS_PESSOAIS` | sim |
| `nome` | Nome fora da regra | RN-PES-001 | Pelo menos 2 letras; só letras com acento, espaço, apóstrofo e hífen; sem números | `An4`, `A`, `Ana@` | | `problemasDoValor`, `erroNome` | sim |
| `ident` | Identificação inválida | RN-EMP-002 | **CNPJ:** 14 caracteres (12 letras ou números e 2 dígitos), dígitos verificadores em módulo 11; sequência de caracteres iguais é rejeitada. **NIT** e **RUT:** dígito verificador. Sem tipo informado, empresa do Brasil conta como CNPJ e empresa de fora não é validada | CNPJ `48.291.735/0001-49` | Completar zeros à esquerda, quando o Excel tirou os zeros (CNPJ com 11 a 13 dígitos) | `problemasDoValor`, `erroIdent`, `cnpjDV`, `nitDV`, `rutDV` | sim |
| `lista` | Valor fora da lista | 08 §2 | O valor está na lista controlada da coluna, sem diferenciar acentos e maiúsculas. Vale para todas as listas **menos Categoria** (que é [Info](#info)). A mensagem mostra os valores aceitos | Gênero `Masc` | Trocar valores | `problemasDoValor`, `LISTAS` | sim |
| `lista` | Valor fora da lista | RN-EMP-007, RN-PES-012 | Colunas com vários valores (Relacionamento): cada valor precisa estar na lista; vírgula, ponto e vírgula ou quebra de linha separam. Um problema só por célula | `Evento, Pesquisa` | Trocar valores | `problemasDoValor` (tipo `listas`) | sim |
| `semNome` | Pessoa sem nome | RN-PES-007 | A pessoa tem nome | linha com telefone e situação, sem nome | A mensagem orienta a conferir o arquivo de origem ou excluir a linha | `problemasDaPessoa` | sim |
| `relacionamento` | Relacionamento que a empresa não tem | RN-PES-012 | Cada relacionamento da pessoa precisa existir na empresa dela. Empresa sem relacionamento conta como vazia. Pessoa sem relacionamento, ou sem empresa ligada, não é comparada. Não diferencia acentos e maiúsculas | pessoa `Patrocinador` em empresa só de `Evento` | Tirar da pessoa, Acrescentar na empresa | `problemasDoRelacionamento` | sim |
| `semRazaoSocial` | Empresa sem razão social | RN-EMP-001 | A empresa tem razão social | empresa só com nome fantasia | A mensagem orienta a conferir o arquivo de origem | `problemasDaEmpresa` | sim |
| `semRelacionamento` | Empresa sem relacionamento | RN-EMP-007 | A empresa tem pelo menos um relacionamento: Evento, Patrocinador, Fornecedor ou Parceiro | coluna Relacionamento vazia | | `problemasDaEmpresa` | sim |
| `semAno` | Valor sem ano | RN-EMP-008 | Cada valor financeiro tem ano | valor com a coluna Ano vazia | A mensagem orienta a informar o ano ou excluir a linha | `problemasDoFinanceiro` | sim |
| `anoFinanceiro` | Ano inválido | RN-EMP-008 | O ano tem 4 dígitos, de 1990 até o ano atual | `1980`, `abc` | | `problemasDoFinanceiro` | sim |
| `semValor` | Sem valor | RN-EMP-008 | A linha financeira tem valor | ano sem valor | | `problemasDoFinanceiro` | sim |
| `valorFinanceiro` | Valor inválido | RN-EMP-008 | O valor é um número. Aceita `1.200.000,00`, `R$ 1.200.000,00`, `1,2 bi` e `350 mil` | `muito` | | `problemasDoFinanceiro`, `numeroFinanceiro` | sim |
| `dup` | Duplicado: mesmo e-mail | RN-DUP-001 | Outra linha tem o mesmo e-mail, sem diferenciar maiúsculas | `Ana@X.example` e `ana@x.example` | Mesclar, Não é duplicado | `DUPLICIDADE.email`, `duplicados` | sim (critério), leitura (agrupamento) |
| `dup` | Duplicado: mesma identificação | RN-DUP-001 | Outra linha tem a mesma identificação, sem pontuação. Menos de 5 caracteres não compara. Só o valor conta, não país nem tipo | `48.291.735/0001-48` e `48291735000148` | Mesclar, Não é duplicado | `DUPLICIDADE.ident`, `duplicados` | sim (critério), leitura (agrupamento) |
| `dup` | Duplicado: mesma métrica e ano | RN-EMP-008 | Dados financeiros: a empresa só pode ter um valor por métrica e ano | Faturamento 2025 duas vezes | Mesclar, corrigir o ano | `duplicados` | leitura |

## Atenção

| Tipo no código | Rótulo na tela | ID | O que confere | Exemplo que dispara | Ferramenta | Função | Teste |
|---|---|---|---|---|---|---|---|
| `multi` | Mais de um valor | sem ID | Campo de um valor só (nome, e-mail, telefone, identificação, CEP, UF, site, LinkedIn, lista, código, ano) com vários valores na célula, um por linha. O Sirius junta telefones e e-mails assim. Mostra só este aviso, no lugar de "inválido" | célula com dois e-mails | Separar valores: o primeiro fica, os outros vão para uma coluna à parte | `problemasDoValor` | sim |
| `pessoal` | E-mail pessoal | RN-PES-003 | Domínio de e-mail pessoal fora da tabela Pessoas (por exemplo, numa tabela livre) | `ana@gmail.com` em tabela livre | | `problemasDoValor` | sim |
| `funcao` | E-mail de função | RN-PES-004 | O usuário do e-mail é genérico: contato, info, eventos, comercial, marketing, rh, financeiro, suporte, atendimento, noreply, no-reply, vendas, sac, administrativo, faleconosco, ouvidoria | `contato@empresa.example` | | `problemasDoValor`, lista `EMAILS_FUNCAO` | sim |
| `telefone` | Telefone a conferir | RN-FMT-003 | Brasil: 10 ou 11 dígitos, ou 12 a 13 começando com 55. Internacional (começa com `+` ou `00`): 8 a 15 dígitos | `123` | | `problemasDoValor` | sim |
| `cep` | CEP inválido | RN-FMT-002 | CEP do Brasil com 8 dígitos. Com 5 a 7, avisa que o Excel pode ter tirado zeros. Fora do Brasil não valida | `8010000` | | `problemasDoValor` | sim |
| `uf` | UF inválida | RN-FMT-002 | Para o Brasil, sigla (`PR`) ou nome do estado (`Paraná`, `são paulo`). Fora do Brasil não valida | `XX` | | `problemasDoValor`, `UFS`, `UF_NOME` | sim |
| `site` | Site inválido | RN-FMT-005 | Endereço com domínio; aceita sem `https://` | `abc` | | `problemasDoValor`, `erroSite` | sim |
| `linkedin` | LinkedIn fora do padrão | RN-FMT-004 | Pessoa: `linkedin.com/in/<perfil>`. Empresa: `linkedin.com/company/<perfil>`. Aceita `https://`, `www.` e subdomínio de país | `facebook.com/ana` | | `problemasDoValor`, `erroLinkedIn` | sim |
| `dominios` | Domínio inválido | RN-FMT-005 | Domínios de e-mail da empresa, separados por vírgula, no formato `empresa.com.br` | `empresa` | | `problemasDoValor` | sim |
| `ano` | Ano inválido | RN-EMP-009 | Ano de referência do porte da empresa, com 4 dígitos (19xx ou 20xx) | `99` | | `problemasDoValor` | sim |
| `simnao` | Sim ou Não | D-17 | "Não divulga dados financeiros" é Sim ou Não. Aceita também `✗`, `x`, `1`, `true` e `yes` como Sim, e `0`, `false` e `no` como Não | `talvez` | | `problemasDoValor`, `simNaoDe` | sim |
| `codigo` | Código fora do padrão | 08 §2 | Código no formato `PES-000123` (pessoa) ou `EMP-000123` (empresa) | `PES-12` | | `problemasDoValor` | sim |
| `afiliacao` | Afiliação a revisar | RN-VIN-001 | A afiliação é coerente com a empresa informada. Duas situações: Sem empresa com empresa informada; Empresa sem nome, código nem identificação da empresa | Sem empresa + `Acme` | | `problemasDaPessoa` | sim |
| `generoNome` | Gênero diferente do nome | RN-PES-011 | O gênero é o oposto do sexo de 95% ou mais das pessoas com o mesmo primeiro nome no Censo 2010 do IBGE (só nomes com 1.000 pessoas ou mais). Ignora títulos (Dr., Dra., Sr., Sra., Srta., Prof., Profa., Eng.). Não avisa: gênero vazio, Outro, Prefiro não informar, nomes usados pelos dois sexos e nomes raros | `Marina Souza` com `Masculino` | "O gênero está certo": marca e o aviso não volta | `problemasDaPessoa`, `sexoDoNome`, `NOMES_SEXO` | sim |
| `semIdentificacao` | Empresa sem CNPJ, ou Empresa sem identificação | RN-EMP-001, RN-EMP-005 | A empresa tem identificação; sem ela fica mais difícil achar duplicados. "Não disponível" com motivo, **fora do Brasil**, substitui o aviso. No Brasil não substitui | empresa do Brasil sem CNPJ | A mensagem orienta a preencher o número, se tiver | `problemasDaEmpresa`, `identificacaoNaoDisponivel` | sim |
| `moedaPais` | Moeda diferente da do país | Q-20 | A moeda do valor é a do país da empresa (BRL, ARS, CLP, COP, MXN, PEN, USD). País vazio conta como Brasil | `USD` em empresa do Brasil | | `problemasDoFinanceiro`, `moedaDoPais` | sim |
| `anosValores` | Anos e valores não batem | 08 §8 | Na célula do Sirius com vários anos e vários valores, as quantidades são iguais | 3 anos e 2 valores | | `MODELOS.financeiro.linha` | leitura |
| `valorVariante` | Valor diferente no arquivo | 08 §8 | A mesma empresa aparece em mais de uma linha do arquivo com valores diferentes na mesma métrica | duas linhas da empresa com Faturamento diferente | | `MODELOS.financeiro.linha` | leitura |
| `vinculo` | Empresa excluída | sem ID | A empresa ligada a uma pessoa ou a um valor financeiro foi excluída ou mesclada em outra | excluir a empresa de uma pessoa | Trocar a empresa ou marcar Sem empresa | `verificarVinculo` | leitura |
| `variantes` | Escrita diferente no arquivo | sem ID | No relatório com pessoas e empresas juntas, a mesma empresa aparece escrita de formas diferentes em linhas diferentes | `Acme Ltda` e `ACME LTDA.` | Escolher a escrita certa | `verificarVinculo` | leitura |
| `dup` | Possível duplicado: mesmo LinkedIn | RN-DUP-002 | Outra linha tem o mesmo perfil (`in` ou `company` mais o nome), sem diferenciar maiúsculas | `linkedin.com/in/ana-lima` repetido | Mesclar, Não é duplicado | `DUPLICIDADE.linkedin` | sim (critério), leitura (agrupamento) |
| `dup` | Possível duplicado: mesmo site | RN-DUP-002 | Outra linha tem o mesmo site; compara só o domínio, sem `www` | `acme.com.br` e `https://www.acme.com.br/home` | Mesclar, Não é duplicado | `DUPLICIDADE.site` | sim (critério), leitura (agrupamento) |
| `dup` | Possível duplicado: mesmo celular | RN-DUP-002 | Outra linha tem o mesmo celular; compara os 11 últimos dígitos, com 10 ou mais | `(41) 99999-1234` e `+55 41 99999-1234` | Mesclar, Não é duplicado | `DUPLICIDADE.celular` | sim (critério), leitura (agrupamento) |
| `dup` | Possível duplicado: mesmo nome | RN-DUP-002 | Outra linha tem o mesmo nome e sobrenome, sem acentos, maiúsculas nem pontuação. Nome sem sobrenome não compara. **No Laika vale em todo o arquivo**, sem exigir a mesma empresa (D-58) | `Ana Lima` duas vezes | Mesclar, Não é duplicado | `DUPLICIDADE.nome` | sim (critério), leitura (agrupamento) |
| `dup` | Possível duplicado: nome semelhante | RN-DUP-002 | Nomes de empresa com semelhança de trigramas de 0,6 ou mais, depois de tirar Ltda, S.A., ME, EPP, Eireli, Inc, LLC, Corp, Co e Cia. Nomes com menos de 3 caracteres não comparam | `Acme Tecnologia Ltda` e `ACME Tecnologia S.A.` | Mesclar, Não é duplicado | `DUPLICIDADE.empresa`, `semelhantes` | sim (critério), leitura (agrupamento) |

## Info

| Tipo no código | Rótulo na tela | ID | O que confere | Exemplo que dispara | Ferramenta | Função | Teste |
|---|---|---|---|---|---|---|---|
| `espacos` | Espaços extras | RN-GER-003 | Espaços no início ou no fim, repetidos, ou linhas em branco na célula. A quebra de linha entre valores é preservada | `  Diretora ` | | `problemasDoValor`, `semEspacosExtras` | sim |
| `caixa` | Nome em maiúsculas | sem ID | Nome válido escrito todo em maiúsculas | `ANA` | | `problemasDoValor` | sim |
| `lista` | Valor novo na lista | RN-EMP-006 | **Categoria** fora da lista é aceita como valor novo. As outras listas são Crítico | `Utilidades` | Trocar valores | `problemasDoValor`, `LISTAS_ABERTAS` | sim |

## Duplicados

Duplicados formam grupos: se A repete B e B repete C, os três aparecem juntos. O nível do grupo é o mais grave entre os critérios que o ligam.

| Critério | Nível | Compara |
|---|---|---|
| Mesmo e-mail | Crítico | e-mail em minúsculas |
| Mesma identificação | Crítico | só o valor, em maiúsculas e sem pontuação, com 5 ou mais caracteres |
| Mesma métrica e ano | Crítico | empresa, métrica e ano (dados financeiros) |
| Mesmo LinkedIn | Atenção | `in` ou `company` e o nome do perfil |
| Mesmo site | Atenção | domínio sem `www` |
| Mesmo celular | Atenção | 11 últimos dígitos |
| Mesmo nome | Atenção | nome e sobrenome normalizados |
| Nome de empresa semelhante | Atenção | trigramas, semelhança de 0,6 ou mais |

- **Não é duplicado:** a pessoa marca um par e o aviso não volta para ele. A marca fica guardada na sessão salva no navegador (`naoDup`).
- **Limite:** num conjunto de mais de 25 linhas com a mesma chave, cada linha se liga só à primeira, para não gerar milhares de pares.
- **Tabelas livres** (sem modelo de colunas): o critério vem do tipo escolhido para a coluna (e-mail, CNPJ, LinkedIn, site, empresa, nome).
- **Diferença para o Canis:** o Canis só conta o mesmo nome com vínculo atual na mesma empresa e compara país, tipo e valor da identificação (RN-EMP-003). O Laika compara o nome em todo o arquivo e só o valor da identificação (D-58).

## Aviso da exportação

Antes de exportar, o Laika conta quantas linhas **a importação do Canis recusaria** e mostra a contagem por campo. Uma linha é recusada se tem **algum problema Crítico** ou **algum campo obrigatório vazio**. Os obrigatórios vêm de `obrigatoriosVazios`:

| Tabela | Obrigatórios | ID |
|---|---|---|
| Pessoas | nome, sobrenome, e-mail; cargo quando há empresa | RN-PES-007, RN-VIN-003, D-09 |
| Empresas | nome comercial, razão social, país, tipo de relacionamento | RN-EMP-001, D-09 |
| Dados financeiros | empresa (por código, identificação ou nome), métrica, ano, valor, moeda, fonte, confiança | D-17 |

A identificação da empresa **não** é obrigatória (vira a advertência `semIdentificacao`), e a categoria também não (RN-EMP-006). Afiliação vazia não recusa: o Canis a trata como Pendente ou Empresa.

## Ao carregar o arquivo

Estes tratamentos não geram problema, mas mudam como o arquivo é lido:

- **Marcadores de vazio** do Sirius (`-`, `--`, `.`, `..`, `N/A`, `NI`, `N/I`, `–`, `—`) viram célula vazia. O original fica guardado e aparece no painel da linha.
- **Linha só com dado de pessoa** (situação ou telefone), sem nome, e-mail, celular, LinkedIn nem cargo, não vira pessoa: é linha de empresa sem pessoas. O resumo ao carregar conta essas linhas.
- **Estado por extenso** do Sirius (`Paraná`) é aceito como UF.
- **Datas do Excel** (número de série) viram `dd/mm/aaaa` na leitura de planilhas XLSX (RN-GER-002).
- **Vários valores na célula** (um por linha, o `<br>` do Sirius) ficam como linhas dentro da mesma célula. O `multi` sinaliza onde o campo aceita um valor só.

## Regras do Canis que o Laika não aplica

São regras do sistema com banco de dados, histórico e papéis. O Laika trabalha sobre um arquivo, no navegador, sem guardar nada fora dele.

| ID | Regra | Situação no Laika |
|---|---|---|
| RN-PES-010 | Aviso quando o domínio do e-mail é diferente dos domínios da empresa | **Não implementada.** O Laika valida o formato de `dominios_email`, mas não compara com o e-mail da pessoa. Candidata a implementar |
| RN-VIN-005 | Aviso quando outra pessoa da empresa tem o mesmo tipo de cargo e nível | **Não implementada** |
| RN-VIN-003 | Cargo obrigatório quando há empresa | Só no [aviso da exportação](#aviso-da-exportação), não como problema na linha |
| RN-EMP-003 | Empresa única por país, tipo e valor da identificação | Parcial: compara só o valor (D-58) |
| RN-EMP-005 | "Não disponível" só fora do Brasil, com motivo | Parcial: só substitui o aviso de identificação vazia. Não gera problema próprio se o status é usado no Brasil |
| RN-FMT-001 | País como código ISO | Não validada: o país é texto livre. Serve só para decidir se a empresa é do Brasil (vazio conta como Brasil) |
| RN-FMT-003, RN-FMT-004 | Normalizar telefone (E.164) e LinkedIn (https, sem rastreio) | O Laika só **detecta** formato fora do padrão; não normaliza |
| RN-PES-002 | E-mail único, inclusive no histórico | Só dentro do arquivo (`dup`). Não há histórico |
| RN-PES-005, 006, 008, 009; RN-VIN-002, 004, 006, 007, 008; RN-EMP-004, 010, 011; RN-ATU-*; RN-SAU-*; RN-STA-*; RN-ARQ-*; RN-LGP-*; RN-ACE-* | Ciclo de vida, atualidade, saúde do registro, arquivo, acesso e auditoria | Não se aplicam: dependem do banco do Canis. A privacidade (RN-LGP-009) vale no Laika, porque os dados ficam só no navegador |

## Verificação do código

Resultado da conferência de cada regra deste documento contra `index.html`:

- **Com teste automático** (`node tests/regras.test.cjs`): as regras de valor, de pessoa, de empresa e financeiras, os critérios e os níveis dos duplicados e os obrigatórios da exportação. O teste carrega o bloco `<script id="regras">` de `index.html`, roda um valor que deve disparar cada regra e outro que não deve, e confere o tipo e o nível.
- **Só confirmadas lendo o código**, sem teste automático, porque dependem da tela e de um arquivo carregado: `anosValores`, `valorVariante`, `vinculo`, `variantes`, o agrupamento de duplicados (`duplicados`), a regra de mesma métrica e ano, o botão "Não é duplicado" e a contagem do aviso da exportação (`planoExport`). Para revisar à mão, abra `tests/dados/sirius-vinculos-ficticio.xls` no Laika.
- **Consistência deste documento:** o mesmo teste falha se o código emitir um tipo de problema que não está aqui, ou se citar um ID `RN-*` que não aparece aqui.

### Pendências encontradas

1. **Código sem uso:** `verificarLinha` aceita um parâmetro `recusa` ("tolerado no Laika, mas a importação do Canis recusa") e o aviso da exportação o consulta, mas nenhuma regra o envia hoje. Na prática só contam os Críticos e os obrigatórios vazios. Pode ser removido, ou usado quando surgir uma regra tolerada.
2. **Regras não implementadas:** RN-PES-010 e RN-VIN-005 (tabela acima). Falta decidir se entram.
3. **Comentários do código** citam documentos do Canis (`doc 02`, `doc 03`, `doc 08`, `D-09`...) que não estão neste repositório. [decisoes.md](decisoes.md) resume as decisões citadas. Os comentários internos não foram reescritos, exceto os que mandavam rodar um `montar.cjs` que não existe aqui.
4. **Sem ID de regra no código:** `multi`, `caixa`, `vinculo` e `variantes` são comportamentos próprios do Laika, sem uma regra do Canis por trás.
