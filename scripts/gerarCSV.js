const teste = val(1)
function gerarCSV() {
  const val = (id) => {
    const el = document.getElementById(id);
    if (!el) return '';
    return el.value.trim();
  };

  const seg = document.getElementById('segmento');

  const teste = seg.options[seg.selectedIndex].text;
  //const dt = document.getElementById('data').value;
  //var idSeg = seg.charCodeAt(seg.length-5);
  //var idData = dt.replace(/-/g, "");

  //const idRDF = idSeg + idData;


  //console.log(seg.options[seg.selectedIndex].text)


  const esc = (v) => `"${String(v).replace(/"/g, '""')}"`;

  const identificacao = [
    ['SEÇÃO', 'CAMPO', 'VALOR'],
    ['Identificação', 'Segmento', val('segmento')],
    ['Identificação', 'Projeto', val('projeto')],
    ['Identificação', 'RDO', val('rdo')],
    ['Identificação', 'Responsável Técnico', val('responsavel')],
    ['Identificação', 'Empresa Executora', val('empresa')],
    ['Identificação', 'Data do Relatório', val('data')],
    ['Identificação', 'Período', val('periodo')],
    ['Identificação', 'Início', val('ai-inicio')],
    ['Identificação', 'Término', val('ai-termino')],
  ];


  const autorizacaoRows = [];
  const autorizacaoBody = document.querySelectorAll('#autorizacao-body tr');

  autorizacaoBody.forEach((row, i) => {
    const inputs = row.querySelectorAll('input, select, textarea');
    inputs.forEach((el) => {
      const label = el.placeholder || el.getAttribute('data-label') || `Campo ${i + 1}`;
      autorizacaoRows.push(['Autorização', label, el.value.trim()]);
    });
  });


  const seguranca = [
    ['Segurança', 'DDS Realizado', val('dds-realizado')],
    ['Segurança', 'Possui ARL', val('arl')],
    ['Segurança', 'Teve Inspeção', val('inspecao')],
    ['Segurança', 'ID', val('seg-id')],
    ['Segurança', 'PA', val('seg-pa')],
    ['Segurança', 'Tema do DDS', val('dds-tema')],
    ['Segurança', 'Hospital mais próximo', val('hospital')],
    ['Segurança', 'Endereço do Hospital', val('hospital-end')],
  ];


  const atividadeRows = [];
  const atividadeBody = document.querySelectorAll('#atividade-body tr');

  atividadeBody.forEach((row, i) => {
    const inputs = row.querySelectorAll('input, select, textarea');
    inputs.forEach((el) => {
      const label = el.placeholder || el.getAttribute('data-label') || `Campo ${i + 1}`;
      atividadeRows.push(['Atividades', label, el.value.trim()]);
    });
  });

  const atividades = [
    ['Atividades', 'POCC', val('pocc')],
    ['Atividades', 'POCS', val('pocs')],
    ['Atividades', 'PT', val('pt')],
    ['Atividades', 'Spool Aço', val('spool')],
    ['Atividades', 'Solda em Aço', val('solda')],
    ['Atividades', 'Teste', val('teste')],
    ['Atividades', 'Comissionamento', val('comissionamento')],
    ['Atividades', 'Assentamento', val('assentamento')],
    ['Atividades', 'Recomposição', val('recomposicao')],
  ];

  const stopWork = [
    ['Stop Work', 'Houve Stop Work', val('stop-work-select')],
    ['Stop Work', 'Início', val('sw-inicio')],
    ['Stop Work', 'Término', val('sw-termino')],
    ['Stop Work', 'Motivo', val('sw-motivo')],
  ];


  const todasAsLinhas = [
    ...identificacao,
    ...autorizacaoRows,
    ...seguranca,
    ...atividadeRows,
    ...atividades,
    ...stopWork,
  ];

  const csvContent = todasAsLinhas
    .map(row => row.map(esc).join(','))
    .join('\r\n');


  const blob = new Blob(['\uFEFF' + csvContent], {
    type: 'text/csv;charset=utf-8;'
  });

  const nomeArquivoCSV = `RDF_${val('data') || 'sem-data'}_${val('segmento') || 'sem-segmento'}_${val('projeto') || 'sem-projeto'}.csv`

  //const url = URL.createObjectURL(blob);
  //const link = document.createElement('a');
  //link.href = url;
  //link.download = nomeArquivoCSV;
  //document.body.appendChild(link);
  //link.click();
  //document.body.removeChild(link);
  //URL.revokeObjectURL(url);
}