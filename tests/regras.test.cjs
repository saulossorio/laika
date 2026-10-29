/* Testes das regras do Laika, sem bibliotecas e sem navegador.
   Uso, na raiz do repositório: node tests/regras.test.cjs
   Lê o bloco <script id="regras"> de index.html, roda cada regra com um valor que deve gerar o problema e
   outro que não deve, e confere o tipo e o nível. Também confere que docs/regras.md cita todos os tipos de
   problema que o código emite. Só dados fictícios. */
'use strict';
const fs = require('fs');
const path = require('path');

const RAIZ = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(RAIZ, 'index.html'), 'utf8');
const bloco = /<script id="regras">([\s\S]*?)<\/script>/.exec(html);
if (!bloco) { console.error('Bloco <script id="regras"> não encontrado em index.html'); process.exit(1); }
const mod = { exports: {} };
new Function('module', bloco[1])(mod);
const R = mod.exports;

let total = 0, falhas = 0;
function ok(cond, nome, detalhe) {
  total++;
  if (cond) console.log('  ✓ ' + nome);
  else { falhas++; console.log('  ✗ ' + nome + (detalhe !== undefined ? '  →  ' + JSON.stringify(detalhe).slice(0, 300) : '')); }
}
const secao = t => console.log('\n' + t);
const campo = (ent, k) => R.CAMPOS[ent].find(f => f.key === k);
/* Problemas de um valor, como "tipo:nivel" */
const val = (ent, k, v, ctx) => R.problemasDoValor(campo(ent, k), v, ctx).map(p => p.tipo + ':' + p.nivel);
const tem = (lista, x) => lista.includes(x);
const vazia = lista => lista.length === 0;
const tipos = ps => ps.map(p => p.tipo + ':' + p.nivel);

/* CNPJ alfanumérico válido, montado com o próprio cálculo do dígito verificador */
const base = '12ABC34501DE', dv = R.cnpjDV(base), cnpjAlfa = base + dv;

secao('Texto e valores vazios');
ok(tem(val('pessoas', 'cargo', '  Diretora '), 'espacos:info'), 'RN-GER-003: espaços extras → Info');
ok(vazia(val('pessoas', 'cargo', 'Diretora')), 'RN-GER-003: texto limpo não gera problema');
ok(vazia(val('empresas', 'nome_comercial', '')), 'valor vazio não gera problema (obrigatório é regra de exportação)');
ok(R.ehMarcador('-') && R.ehMarcador('N/A') && R.ehMarcador('—') && !R.ehMarcador('Ana'), 'marcadores de vazio do Sirius');
ok(tem(val('pessoas', 'email', 'a@x.example\nb@x.example'), 'multi:atencao'), 'vários valores na célula → Atenção (ferramenta Separar valores)');
ok(R.problemasDoValor(campo('pessoas', 'email'), 'a@x.example\nb@x.example')[0].acao === 'separar', 'multi indica a ação separar');

secao('Crítico: o que a importação do Canis recusa');
ok(tem(val('pessoas', 'email', 'sem-arroba'), 'email:critico'), 'RN-PES-002: e-mail com formato inválido');
ok(vazia(val('pessoas', 'email', 'ana.lima@empresa.example')), 'e-mail válido de empresa não gera problema');
ok(tem(val('pessoas', 'email', 'ana.lima@gmail.com', { emPessoas: true }), 'pessoal:critico'), 'RN-PES-003: e-mail pessoal em Pessoas');
ok(tem(val('pessoas', 'email', 'ana.lima@proton.me', { emPessoas: true }), 'pessoal:critico'), 'RN-PES-003: lista inclui proton.me');
ok(tem(val('pessoas', 'nome', 'An4'), 'nome:critico'), 'RN-PES-001: nome com número');
ok(tem(val('pessoas', 'nome', 'A'), 'nome:critico'), 'RN-PES-001: nome com menos de 2 letras');
ok(tem(val('pessoas', 'nome', 'Ana@'), 'nome:critico'), 'RN-PES-001: caractere fora de letra, espaço, apóstrofo e hífen');
ok(vazia(val('pessoas', 'nome', "D'Ávila-Souza")), 'RN-PES-001: acento, apóstrofo e hífen são aceitos');
ok(!R.erroIdent('CNPJ', '48.291.735/0001-48'), 'RN-EMP-002: CNPJ numérico válido');
ok(!R.erroIdent('CNPJ', cnpjAlfa), 'RN-EMP-002: CNPJ alfanumérico válido');
ok(/dígito verificador/.test(R.erroIdent('CNPJ', '48.291.735/0001-49')), 'RN-EMP-002: dígito verificador errado');
ok(/inválido/.test(R.erroIdent('CNPJ', '11111111111111')), 'RN-EMP-002: sequência de caracteres iguais');
ok(/inválido/.test(R.erroIdent('CNPJ', '1234')), 'RN-EMP-002: tamanho errado');
ok(R.problemasDoValor(campo('empresas', 'identificacao'), '8291735000148').some(p => p.tipo === 'ident' && p.nivel === 'critico' && p.acao === 'zeros'), 'RN-EMP-002: zeros à esquerda perdidos → Crítico com ação zeros');
ok(/NIT inválido/.test(R.erroIdent('NIT', '1234567890')), 'RN-EMP-002: NIT com dígito verificador errado');
ok(/RUT inválido/.test(R.erroIdent('RUT', '12345678K')) || /RUT inválido/.test(R.erroIdent('RUT', '12345678-0')), 'RN-EMP-002: RUT com dígito verificador errado');
ok(vazia(val('empresas', 'identificacao', '123', { tipoIdent: '', brasil: false })), 'RN-EMP-002: empresa de fora sem tipo não é validada como CNPJ');
ok(tem(val('pessoas', 'genero', 'Masc'), 'lista:critico'), '08 §2: valor fora da lista → Crítico');
ok(vazia(val('pessoas', 'genero', 'feminino')), '08 §2: lista compara sem diferenciar acento e maiúscula');
ok(tem(val('empresas', 'tipo_relacionamento', 'Evento\nPesquisa'), 'lista:critico') && val('empresas', 'tipo_relacionamento', 'Evento\nPesquisa').length === 1, 'RN-EMP-007: relacionamento fora da lista → Crítico, um problema por célula');
ok(vazia(val('empresas', 'tipo_relacionamento', 'Evento, Patrocinador')), 'RN-EMP-007: vários relacionamentos separados por vírgula');

secao('Crítico: regras que comparam campos');
ok(tipos(R.problemasDaPessoa({ nome: '' })).includes('semNome:critico'), 'RN-PES-007: pessoa sem nome');
ok(!tipos(R.problemasDaPessoa({ nome: '' }, [], null, k => k !== 'nome')).includes('semNome:critico'), 'RN-PES-007: sem a coluna Nome na tabela, não há problema');
const rel = (p, e) => R.problemasDaPessoa({ nome: 'Ana', relacionamento: p }, [], { tipo_relacionamento: e });
ok(tipos(rel('Patrocinador', 'Evento')).includes('relacionamento:critico'), 'RN-PES-012: relacionamento da pessoa que a empresa não tem');
ok(vazia(rel('Evento', 'Evento, Patrocinador')) && vazia(rel('evento', 'EVENTO')), 'RN-PES-012: contido na empresa, sem diferenciar maiúsculas');
ok(rel('Evento', '').some(p => /vazio/.test(p.texto)), 'RN-PES-012: empresa sem relacionamento conta como vazia');
ok(vazia(rel('', 'Evento')) && vazia(R.problemasDaPessoa({ nome: 'Ana', relacionamento: 'Patrocinador' })), 'RN-PES-012: pessoa sem relacionamento, ou sem empresa ligada, não é comparada');
ok(tipos(R.problemasDaEmpresa({ razao_social: '', tipo_relacionamento: 'Evento' })).includes('semRazaoSocial:critico'), 'RN-EMP-001: empresa sem razão social');
ok(tipos(R.problemasDaEmpresa({ razao_social: 'Acme Ltda', tipo_relacionamento: '' })).includes('semRelacionamento:critico'), 'RN-EMP-007: empresa sem relacionamento');
ok(vazia(R.problemasDaEmpresa({ razao_social: '', tipo_relacionamento: '' }, k => false)), 'RN-EMP-001/007: sem a coluna na tabela, não há problema');
ok(tipos(R.problemasDoFinanceiro({ ano: '', valor: '100' })).includes('semAno:critico'), 'RN-EMP-008: valor sem ano');
ok(tipos(R.problemasDoFinanceiro({ ano: '1980', valor: '100' })).includes('anoFinanceiro:critico') && tipos(R.problemasDoFinanceiro({ ano: 'abc', valor: '100' })).includes('anoFinanceiro:critico'), 'RN-EMP-008: ano fora de 1990 até o ano atual, ou que não é número');
ok(tipos(R.problemasDoFinanceiro({ ano: '2024', valor: '' })).includes('semValor:critico'), 'RN-EMP-008: ano sem valor');
ok(tipos(R.problemasDoFinanceiro({ ano: '2024', valor: 'muito' })).includes('valorFinanceiro:critico'), 'RN-EMP-008: valor que não é número');
ok(vazia(R.problemasDoFinanceiro({ ano: '2024', valor: 'R$ 1.200.000,00', moeda: 'BRL', empresa_pais: 'Brasil' })), 'RN-EMP-008: valor, ano e moeda corretos não geram problema');

secao('Atenção: avisos que conferem, mas não recusam');
ok(tem(val('pessoas', 'email', 'contato@empresa.example'), 'funcao:atencao'), 'RN-PES-004: e-mail de função');
ok(tem(val('pessoas', 'email', 'ana@gmail.com', { emPessoas: false }), 'pessoal:atencao'), 'RN-PES-003: e-mail pessoal fora de Pessoas é só Atenção');
ok(tem(val('pessoas', 'telefone_comercial', '123'), 'telefone:atencao'), 'RN-FMT-003: telefone com dígitos a menos');
ok(vazia(val('pessoas', 'telefone_comercial', '(41) 99999-1234')) && vazia(val('pessoas', 'telefone_comercial', '+54 11 4567 8901')), 'RN-FMT-003: celular do Brasil e telefone internacional');
ok(tem(val('empresas', 'cep', '123'), 'cep:atencao') && vazia(val('empresas', 'cep', '80010-000')), 'RN-FMT-002: CEP do Brasil com 8 dígitos');
ok(tem(val('empresas', 'cep', '8010000'), 'cep:atencao') && /zeros/.test(R.problemasDoValor(campo('empresas', 'cep'), '8010000')[0].texto), 'RN-FMT-002: CEP sem zero à esquerda');
ok(vazia(val('empresas', 'cep', '123', { brasil: false })), 'RN-FMT-002: CEP de fora do Brasil não é validado');
ok(tem(val('empresas', 'uf_estado', 'XX'), 'uf:atencao') && vazia(val('empresas', 'uf_estado', 'PR')) && vazia(val('empresas', 'uf_estado', 'Paraná')) && vazia(val('empresas', 'uf_estado', 'são paulo')), 'RN-FMT-002: UF pela sigla ou pelo nome');
ok(vazia(val('empresas', 'uf_estado', 'Ontario', { brasil: false })), 'RN-FMT-002: estado de fora do Brasil não é validado');
ok(tem(val('empresas', 'site', 'abc'), 'site:atencao') && vazia(val('empresas', 'site', 'www.empresa.com.br')), 'RN-FMT-005: site');
ok(tem(val('pessoas', 'linkedin', 'facebook.com/ana'), 'linkedin:atencao') && vazia(val('pessoas', 'linkedin', 'https://www.linkedin.com/in/ana-lima')), 'RN-FMT-004: LinkedIn de pessoa com /in/');
ok(tem(val('empresas', 'linkedin', 'linkedin.com/in/ana'), 'linkedin:atencao') && vazia(val('empresas', 'linkedin', 'linkedin.com/company/acme')), 'RN-FMT-004: LinkedIn de empresa com /company/');
ok(tem(val('empresas', 'dominios_email', 'empresa'), 'dominios:atencao') && vazia(val('empresas', 'dominios_email', 'empresa.com.br, empresa.com')), 'RN-FMT-005: domínios de e-mail da empresa');
ok(tem(val('empresas', 'porte_ano', '99'), 'ano:atencao') && vazia(val('empresas', 'porte_ano', '2025')), 'RN-EMP-009: ano do porte com 4 dígitos');
ok(tem(val('empresas', 'nao_divulga_financeiro', 'talvez'), 'simnao:atencao') && vazia(val('empresas', 'nao_divulga_financeiro', '✗')) && vazia(val('empresas', 'nao_divulga_financeiro', 'Não')), 'D-17: Sim ou Não, com “✗” do Sirius valendo Sim');
ok(tem(val('pessoas', 'codigo', 'PES-12'), 'codigo:atencao') && vazia(val('pessoas', 'codigo', 'PES-000123')), '08 §2: código no formato PES-000123');
ok(tipos(R.problemasDaPessoa({ nome: 'Ana', afiliacao: 'Sem empresa', empresa_nome: 'Acme' })).includes('afiliacao:atencao'), 'RN-VIN-001: Sem empresa, mas com empresa informada');
ok(tipos(R.problemasDaPessoa({ nome: 'Ana', afiliacao: 'Empresa' })).includes('afiliacao:atencao'), 'RN-VIN-001: Empresa, mas sem dados da empresa');
const gen = R.problemasDaPessoa({ nome: 'Marina Souza', genero: 'Masculino' });
ok(gen.length === 1 && gen[0].tipo === 'generoNome' && gen[0].nivel === 'atencao' && gen[0].acao === 'generoCerto', 'RN-PES-011: Marina com Masculino');
ok(vazia(R.problemasDaPessoa({ nome: 'Íris Costa', genero: 'Masculino' })) && vazia(R.problemasDaPessoa({ nome: 'Marina Souza', genero: 'Outro' })), 'RN-PES-011: nome dos dois sexos, e gênero Outro, não avisam');
ok(vazia(R.problemasDaPessoa({ nome: 'Marina Souza', genero: 'Masculino' }, ['genero'])), 'RN-PES-011: gênero conferido não avisa de novo');
ok(R.sexoDoNome('Dra. Marina Souza').sexo === 'F', 'RN-PES-011: título antes do nome é ignorado');
ok(tipos(R.problemasDaEmpresa({ razao_social: 'Acme', tipo_relacionamento: 'Evento', identificacao: '', pais: 'Brasil' })).includes('semIdentificacao:atencao'), 'RN-EMP-001: empresa sem identificação é Atenção');
ok(vazia(R.problemasDaEmpresa({ razao_social: 'Acme', tipo_relacionamento: 'Evento', identificacao: '', pais: 'Chile', identificacao_status: 'Não disponível', motivo_sem_identificacao: 'Sem registro' })), 'RN-EMP-005: “Não disponível” com motivo, fora do Brasil, substitui o aviso');
ok(tipos(R.problemasDaEmpresa({ razao_social: 'Acme', tipo_relacionamento: 'Evento', identificacao: '', pais: 'Brasil', identificacao_status: 'Não disponível', motivo_sem_identificacao: 'Sem registro' })).includes('semIdentificacao:atencao'), 'RN-EMP-005: no Brasil, “Não disponível” não substitui o aviso');
ok(tipos(R.problemasDoFinanceiro({ ano: '2024', valor: '100', moeda: 'USD', empresa_pais: 'Brasil' })).includes('moedaPais:atencao'), 'Q-20: moeda diferente da do país');

secao('Info: notas que não contam como problema');
ok(tem(val('pessoas', 'nome', 'ANA'), 'caixa:info'), 'nome todo em maiúsculas');
ok(tem(val('empresas', 'categoria', 'Utilidades'), 'lista:info') && val('empresas', 'categoria', 'Utilidades').length === 1, 'RN-EMP-006: categoria fora da lista é valor novo');
ok(vazia(val('empresas', 'categoria', 'Governo')), 'RN-EMP-006: Governo está na lista');

secao('Duplicados (RN-DUP-001 e RN-DUP-002): critérios e níveis');
const D = R.DUPLICIDADE;
ok(D.email.nivel === 'critico' && D.ident.nivel === 'critico', 'RN-DUP-001: e-mail e identificação repetidos → Crítico');
ok(['linkedin', 'site', 'celular', 'nome', 'empresa'].every(k => D[k].nivel === 'atencao'), 'RN-DUP-002: LinkedIn, site, celular, nome e empresa semelhante → Atenção');
ok(D.email.chave('Ana@X.example') === D.email.chave('ana@x.example'), 'mesmo e-mail sem diferenciar maiúsculas');
ok(D.ident.chave('48.291.735/0001-48') === D.ident.chave('48291735000148') && D.ident.chave('123') === '', 'mesma identificação sem pontuação; menos de 5 caracteres não compara');
ok(D.linkedin.chave('https://br.linkedin.com/in/Ana-Lima/') === D.linkedin.chave('linkedin.com/in/ana-lima'), 'mesmo LinkedIn');
ok(D.site.chave('https://www.acme.com.br/home') === D.site.chave('acme.com.br'), 'mesmo site, sem www');
ok(D.celular.chave('(41) 99999-1234') === D.celular.chave('+55 41 99999-1234') && D.celular.chave('1234') === '', 'mesmo celular, pelos 11 últimos dígitos');
ok(D.nome.chave('Ana Lima') === D.nome.chave('ANA  lima') && D.nome.chave('Ana') === '', 'mesmo nome e sobrenome; nome sem sobrenome não compara');
const sim = (a, b) => R.semelhanca(R.trigramas(D.empresa.chave(a)), R.trigramas(D.empresa.chave(b)));
ok(sim('Acme Tecnologia Ltda', 'ACME Tecnologia S.A.') >= D.empresa.semelhancaMinima, 'RN-DUP-002: nomes de empresa semelhantes, sem Ltda e S.A.');
ok(sim('Acme Tecnologia', 'Banco do Brasil') < D.empresa.semelhancaMinima, 'RN-DUP-002: nomes diferentes não são duplicados');

secao('Obrigatórios que o Canis exige (aviso da exportação)');
ok(R.obrigatoriosVazios('pessoas', {}).join() === 'nome,sobrenome,email', 'RN-PES-007: pessoa → nome, sobrenome e e-mail');
ok(R.obrigatoriosVazios('pessoas', { nome: 'Ana', sobrenome: 'Lima', email: 'a@x.example', empresa_nome: 'Acme' }).join() === 'cargo', 'RN-VIN-003: cargo quando há empresa');
ok(R.obrigatoriosVazios('empresas', {}).join() === 'nome_comercial,razao_social,pais,tipo_relacionamento', 'RN-EMP-001: empresa → nome comercial, razão social, país e relacionamento');
ok(R.obrigatoriosVazios('financeiro', {}).join() === 'empresa_nome,metrica,ano,valor,moeda,fonte,confianca', 'D-17: financeiro → empresa, métrica, ano, valor, moeda, fonte e confiança');

secao('Leitura de valores financeiros e utilidades');
ok(R.numeroFinanceiro('R$ 1.200.000,00') === 1200000 && R.numeroFinanceiro('1,2 bi') === 1.2e9 && R.numeroFinanceiro('350 mil') === 350000 && R.numeroFinanceiro('abc') === null, 'valor à brasileira, com “mil” e “bi”');
ok(R.moedaDoPais('') === 'BRL' && R.moedaDoPais('Chile') === 'CLP', 'Q-20: moeda padrão é a do país; país vazio conta como Brasil');
ok(R.valoresDeLista('Evento; Patrocinador,\nParceiro').length === 3, 'valores de lista separados por ; , ou quebra de linha');

/* Cada tipo de problema que o código emite, e cada ID RN-* que ele cita, precisa estar em docs/regras.md */
secao('Documentação');
const doc = fs.readFileSync(path.join(RAIZ, 'docs', 'regras.md'), 'utf8');
const emitidos = new Set();
for (const m of html.matchAll(/(?:\badd\(|\{ tipo: )'([a-zA-Z]+)', (?:nivel|'|ctx|g\.)/g)) emitidos.add(m[1]);
const semDoc = [...emitidos].filter(t => !doc.includes('`' + t + '`'));
ok(emitidos.size >= 30, 'o teste encontrou os tipos de problema do código (' + emitidos.size + ')');
ok(semDoc.length === 0, 'todo tipo de problema emitido pelo código está em docs/regras.md', semDoc);
const idsCitados = new Set([...html.matchAll(/\bRN-[A-Z]{3}-\d{3}\b/g)].map(m => m[0]));
const idsSemDoc = [...idsCitados].filter(id => !doc.includes(id));
ok(idsSemDoc.length === 0, 'todo ID RN-* citado no código aparece em docs/regras.md', idsSemDoc);

console.log('\n' + (total - falhas) + ' de ' + total + ' verificações passaram.');
process.exit(falhas ? 1 : 0);
