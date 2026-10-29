/* Gera a réplica fictícia do "Relatório de Vínculos Empresariais" do Sirius usada nos testes do Canis Lite.
   Mesmo formato do arquivo real (página HTML salva como .xls, Windows-1252, 56 colunas, empresa agrupada
   com rowspan, quebras de linha com <br>, "-" como vazio), com valores inventados (RN-LGP-009).
   Uso: node lite/testes/gerar-dados.cjs */
const fs = require('fs');
const path = require('path');

const CABECALHO = [
  'Razão Social', 'Nome Fantasia', 'CNPJ/ <br />Identificador <br />Equivalente', 'Situação <br />(Empresa)', 'Tipo da<br />Empresa',
  'Segmento', 'Segmento<br />Pesquisa', 'Setor', 'Relacionamento<br />Empresa',
  'País<br />Empresa</br>(Dados Gerais)', // o Sirius escreve </br> aqui; o navegador lê como quebra de linha
  'País<br />Empresa<br />(Endereço)', 'Estado<br />Empresa<br />(Endereço)', 'Cidade<br />Empresa<br />(Endereço)', 'Cep<br />Empresa<br />(Endereço)',
  'Logradouro<br />Empresa<br />(Endereço)', 'Telefone<br />Empresarial', 'E-mail<br />Empresarial', 'Moeda', 'Porcentagem de<br />Investimento em TI',
  'Não Divulga Dados<br />Financeiros', 'Investimento<br />em TI Anual<br />(Ano)', 'Investimento<br />em TI Anual<br />(Valor)', 'Receita Líquida<br />(Ano)',
  'Receita Líquida<br />(Valor)', 'Valor Empenhado<br />(Ano)', 'Valor Empenhado<br />(Valor)', 'Valor Orçado<br />(Ano)', 'Valor Orçado<br />(Valor)',
  'Valor Licitado<br />(Ano)', 'Valor Licitado<br />(Valor)', 'Faturamento<br />(Ano)', 'Faturamento<br />(Valor)',
  'Pesquisa<br />(Valor Investimento TI)<br />(Ano)', 'Pesquisa<br />(Valor Investimento TI)<br />(Valor)', 'Pesquisa<br />(Valor Faturamento)<br />(Ano)',
  'Pesquisa<br />(Valor Faturamento)<br />(Valor)', 'Pesquisa<br />(Valor OPEX)<br />(Ano)', 'Pesquisa<br />(Valor OPEX)<br />(Valor)',
  'Pesquisa<br />(Valor CAPEX)<br />(Ano)', 'Pesquisa<br />(Valor CAPEX)<br />(Valor)', 'N° de<br />Funcionários<br />Global', 'N° de<br />Funcionários<br />de TI',
  'Observações<br />Empresa', 'Ultima<br />Atualização',
  'Nome Pessoa', 'Cargo Pessoa', 'Nível de<br />Alcance<br />Pessoa', 'Grau de<br />Importância', 'Situação<br />Pessoa', 'Telefone<br />Pessoa',
  'Telefone Principal', 'Celular<br />Pessoa', 'E-mail<br />Pessoa', 'Relacionamento<br />Pessoa', 'Sexo<br />Pessoa', 'Observações<br/>Pessoa',
];

// CNPJ com dígito verificador (RN-EMP-002), a partir de 12 dígitos
function cnpj(base, errado) {
  const v = [...base].map(c => c.charCodeAt(0) - 48);
  const dv = (ns, pesos) => { const r = ns.reduce((t, x, i) => t + x * pesos[i], 0) % 11; return r < 2 ? 0 : 11 - r; };
  const d1 = dv(v, [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]), d2 = dv([...v, d1], [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
  const c = base + d1 + (errado ? (d2 + 1) % 10 : d2);
  return c.slice(0, 2) + '.' + c.slice(2, 5) + '.' + c.slice(5, 8) + '/' + c.slice(8, 12) + '-' + c.slice(12);
}

// Empresas inventadas. pessoas: quantas linhas de pessoa o bloco tem (0 = empresa sem pessoas no relatório)
const EMPRESAS = [
  { razao: 'Agência Estadual de Testes do Paraná', fantasia: 'AETP', cnpj: cnpj('701234560001'), tipo: 'Estatal', seg: 'Governo', segp: 'Estadual', setor: 'Administração Direta', rel: 'Evento', uf: 'Paraná', pessoas: 3 },
  { razao: 'Companhia de Saneamento Fictícia', fantasia: 'CSF', cnpj: cnpj('702345670001'), tipo: 'Estatal', seg: 'Utilidades', segp: 'Saneamento', setor: 'SANEAMENTO', rel: 'Evento<br>Pesquisa', uf: 'Paraná', pessoas: 2 },
  { razao: 'Instituto de Dados Imaginários', fantasia: 'IDI', cnpj: cnpj('703456780001'), tipo: 'Privada', seg: 'Diversos', segp: 'Outros', setor: 'Diversos', rel: 'Evento', uf: 'Paraná', pessoas: 1 },
  { razao: 'Banco Exemplo do Sul S.A.', fantasia: 'BES', cnpj: cnpj('704567890001'), tipo: 'Privada', seg: 'Finanças', segp: 'Outros', setor: 'Financeiro', rel: 'Evento', uf: 'Paraná', pessoas: 30 },
  { razao: 'Tribunal Regional Inventado', fantasia: 'TRI', cnpj: cnpj('705678900001'), tipo: 'Estatal', seg: 'Governo', segp: 'Federal', setor: 'Judiciário', rel: 'Evento<br>Portal', uf: 'Paraná', pessoas: 4 },
  { razao: 'Prestadora Modelo Ltda', fantasia: 'Prestadora Modelo', cnpj: cnpj('706789010001'), tipo: 'Privada', seg: 'Prestação de Serviços', segp: 'Outros', setor: 'Tecnologia', rel: 'Evento', uf: 'Paraná', pessoas: 2 },
  { razao: 'Secretaria Municipal de Testes', fantasia: 'SMT', cnpj: cnpj('707890120001'), tipo: 'Estatal', seg: 'Governo', segp: 'Municipal', setor: 'Administração Direta', rel: 'Evento', uf: 'Paraná', pessoas: 0 },
  { razao: 'Fundação Amostra', fantasia: 'FA', cnpj: cnpj('708901230001', true), tipo: 'Privada', seg: 'Diversos', segp: 'Educação', setor: 'EDUCAÇÃO E CULTURA', rel: 'Evento', uf: 'Paraná', pessoas: 2 },
  // o mesmo tribunal de novo, sem CNPJ: deve juntar com o bloco que tem CNPJ
  { razao: 'Tribunal Regional Inventado', fantasia: 'TRI', cnpj: '-', tipo: 'Estatal', seg: 'Governo', segp: 'Federal', setor: 'Judiciário', rel: 'Evento', uf: 'Paraná', pessoas: 2 },
  // linha de pessoa sem empresa: dados de empresa todos "-"
  { semEmpresa: true, pessoas: 1 },
  { razao: 'Empresa Paranaense de Gás', fantasia: 'EPG', cnpj: cnpj('709012340001'), tipo: 'Estatal', seg: 'Utilidades', segp: 'Gás', setor: 'GÁS', rel: 'Evento', uf: 'PR', pessoas: 2 },
  { razao: 'Câmara Municipal Fictícia', fantasia: 'CMF', cnpj: cnpj('710123450001'), tipo: 'Estatal', seg: 'Governo', segp: 'Municipal', setor: 'Administração Direta', rel: 'Evento', uf: 'Paraná', pessoas: 5 },
];

const NOMES = ['Ana', 'Bruno', 'Carla', 'Diego', 'Elisa', 'Fábio', 'Gabriela', 'Hugo', 'Íris', 'João', 'Karina', 'Lucas', 'Marina', 'Nelson', 'Olívia', 'Paulo', 'Quésia', 'Rafael', 'Sílvia', 'Tiago'];
const SOBRENOMES = ['Almeida Prado', 'Barros', 'Cardoso Lima', 'Duarte', 'Esteves', 'Fontes da Silva', 'Guimarães', 'Henriques', 'Ivo Teixeira', 'Jardim'];
const CARGOS = ['Diretor de Tecnologia', 'Gerente de Infraestrutura', 'Coordenadora de Sistemas', 'Diretora Financeira', 'Analista de TI', 'Presidente'];
const GRAUS = ['CIO - Nível 2', 'CIO - Nível 1', 'CFO - Nível 1', 'CHRO - Nível 1', 'CIO - Nível 5', 'CIO - Nível 2<br>CSO - Nível 1', '-'];
const sem = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

function linhaEmpresa(e, n, k) {
  const td = (v, extra = '') => `<td class='listGridTd' style='text-align:center; vertical-align: top; background-color:#F2F2F2;'${extra} rowspan='${Math.max(n, 1)}'>${v}</td>`;
  if (e.semEmpresa) {
    const vs = Array(43).fill('-'); // 44 colunas de empresa, com a do país ocupando duas
    return vs.map((v, i) => td(v, i === 9 ? ' colspan=2' : '')).join('');
  }
  const sigla = sem(e.fantasia).replace(/[^a-z]/g, '');
  const ano = k % 3 === 0 ? '2025<br>2026' : k % 3 === 1 ? '2025' : '-';
  const valor = k % 3 === 0 ? 'R$ 1.200.000,00<br>R$ 1.350.000,00' : k % 3 === 1 ? 'R$ 980.000,00' : '-';
  const vs = [
    e.razao, e.fantasia, e.cnpj, 'Ativo', e.tipo, e.seg, e.segp, e.setor, e.rel,
    'Brasil', // colspan=2: cobre País (Dados Gerais) e País (Endereço)
    e.uf, 'Curitiba', '8' + String(1000 + k).padStart(4, '0') + '-' + String(100 + k).slice(-3), 'Rua dos Testes, ' + (100 + k),
    k % 2 ? '(41) 3200-' + String(1000 + k) : '(41) 3200-' + String(1000 + k) + '<br>(41) 3200-' + String(2000 + k),
    k % 4 === 0 ? '-' : 'contato@' + sigla + '.example', 'Real', k % 2 ? '-' : '2,5%', k === 3 ? '&#10007;' : '-',
    ano, valor, 'N/A', 'N/A', ano, valor, ano, valor, ano, valor, '-', k % 2 ? '-' : 'R$ 5.000.000,00',
    ano, valor, ano, valor, ano, valor, ano, valor, k % 5 === 0 ? '-' : String(120 * (k + 1)), k % 5 === 0 ? '-' : String(8 * (k + 1)),
    k % 2 ? 'Observação de teste<br>segunda linha' : '-', '1' + (k % 9) + '/10/2026 14:3' + (k % 10) + ':00',
  ];
  return vs.map((v, i) => td(v, i === 9 ? ' colspan=2' : '')).join('');
}

let contador = 0;
function linhaPessoa(e, j, vazia) {
  const td = v => `<td class='listGridTd' style='text-align:center; vertical-align:center; background-color:#fff;'>${v}</td>`;
  if (vazia) return Array(12).fill('-').map(td).join('');
  const i = contador++;
  const nome = NOMES[i % NOMES.length], sob = SOBRENOMES[Math.floor(i / NOMES.length) % SOBRENOMES.length]; // nomes completos únicos
  const dominio = e.semEmpresa ? 'consultoria-autonoma.example' : sem(e.fantasia).replace(/[^a-z]/g, '') + '.example';
  const usuario = sem(nome) + '.' + sem(sob.split(' ')[0]) + i;
  let email = usuario + '@' + dominio;
  if (i % 9 === 4) email += '<br>' + sem(nome) + i + '@' + dominio; // dois e-mails na célula
  if (i === 7) email = sem(nome) + '.pessoal' + i + '@gmail.com'; // e-mail pessoal
  if (i === 11) email = 'contato@' + dominio; // e-mail de função
  if (i === 13) email = usuario + '.sem-arroba.' + dominio; // e-mail inválido
  if (i === 20) email = 'repetido@bes.example';
  if (i === 21) email = 'repetido@bes.example'; // mesmo e-mail em duas pessoas
  const tel = '(41) 3300-' + String(1000 + i), tel2 = '(41) 3300-' + String(5000 + i);
  // gênero: alterna com os nomes (Ana Feminino, Bruno Masculino...), menos dois casos de teste do aviso de gênero
  let sexo = i % 8 === 6 ? '-' : i % 2 ? 'Masculino' : 'Feminino';
  if (i === 32) sexo = 'Masculino'; // Marina: quase sempre feminino no Censo 2010, deve gerar aviso
  if (i === 28) sexo = 'Masculino'; // Íris: nome dos dois sexos no Censo 2010, não deve gerar aviso
  return [
    nome + ' ' + sob, CARGOS[i % CARGOS.length], i % 10 === 3 ? '-' : i % 7 === 0 ? 'Internacional' : 'Nacional', GRAUS[i % GRAUS.length], 'Ativo',
    i % 6 === 5 ? '-' : i % 2 ? tel : tel + '<br>' + tel2, i % 6 === 5 ? '-' : tel, i % 4 === 0 ? '(41) 99000-' + String(1000 + i) : '-',
    email, i % 3 ? 'Evento' : 'Evento<br>Pesquisa', sexo, i % 5 ? '-' : 'Contato de teste',
  ].map(td).join('');
}

const linhas = [];
EMPRESAS.forEach((e, k) => {
  const n = e.pessoas;
  if (n === 0) { linhas.push('<tr>' + linhaEmpresa(e, 1, k) + linhaPessoa(e, 0, true) + '</tr>'); return; }
  for (let j = 0; j < n; j++) linhas.push('<tr>' + (j === 0 ? linhaEmpresa(e, n, k) : '') + linhaPessoa(e, j, false) + '</tr>');
});

const html = `

                    <style>
                        .listGridTd{
                            border: 1px solid #7a7a7a;
                        }
                    </style>
    <div style='width:5500px'>
        <script>
            function gerarExcel() { return false; }
        </script>
        <p><b>Arquivo fictício para testes do Canis Lite</b></p>
<table width="100%" class="listGrid" cellpadding='1' cellspacing='1'>
            <tr class="ui-state-active">
                <th colspan="100%" style="height: 20px !important">Relatório de Vínculos Empresariais</th>
            </tr>

            <tr class="ui-widget-header">
${CABECALHO.map(h => `                <td nowrap="nowrap" style='width:100px; text-align:center'>${h}</td>`).join('\n')}
            </tr>
${linhas.join('\n')}
</table></div>`;

// Windows-1252: os caracteres usados aqui são todos do Latin-1; o resto vai como entidade HTML
if (/[^\x00-\xff]/.test(html)) throw new Error('caractere fora do Latin-1 no arquivo gerado');
const destino = path.join(__dirname, 'dados', 'sirius-vinculos-ficticio.xls');
fs.mkdirSync(path.dirname(destino), { recursive: true });
fs.writeFileSync(destino, Buffer.from(html, 'latin1'));
console.log('Gerado ' + path.relative(process.cwd(), destino) + ': ' + linhas.length + ' linhas de dados, ' + EMPRESAS.length + ' blocos de empresa.');

// CSV salvo pelo Excel antigo em português: Windows-1252, ponto e vírgula, aspas com quebra de linha dentro
const csv = ['Nome;Sobrenome;E-mail;Empresa;Observações', 'Conceição;Araújo;conceicao.araujo@empresa-ficticia.example;Indústria Fictícia;"Primeira linha', 'segunda linha"', 'João;Gonçalves;-;Indústria Fictícia;N/A'].join('\r\n');
const destinoCsv = path.join(__dirname, 'dados', 'pessoas-windows-1252.csv');
fs.writeFileSync(destinoCsv, Buffer.from(csv, 'latin1'));
console.log('Gerado ' + path.relative(process.cwd(), destinoCsv) + '.');
