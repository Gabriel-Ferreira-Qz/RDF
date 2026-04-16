const teste = val(1)
function gerarCSV() {
  const val = (id) => {
    const el = document.getElementById(id);
    if (!el) return '';
    return el.value.trim();
  };

  const seg = document.getElementById('segmento');
  const res = document.getElementById('responsavel');
  const dt = document.getElementById('data').value;
  const valData = dt.replace(/-/g, "");

  function idVal(id) {
    const el = document.getElementById(id);
    const textoId = el.options[el.selectedIndex].text

    return textoId === 'Selecione...' ? '' : textoId;
  }

  const idRDF = seg.value + res.value + valData;

  console.log(idRDF)

  const esc = (v) => `"${String(v).replace(/"/g, '""')}"`;

  const identificacao = [
    ['ID RDF', 'SEGMENTO', 'PROJETO', 'RDO', 'RESPONSÁVEL TÉCNICO', 'EMPRESA EXECUTORA', 'DATA DO RELATÓRIO', 'PERÍODO DA ATIVIDADE', 'INÍCIO DA ATIVIDADE', 'TÉRMINO DA ATIVIDADE', 'VIGÊNCIA DA AUTORIZAÇÃO', 'OBSERVAÇÃO AUTORIZAÇÃO', 'DDS REALIZADO?', 'POSSUI ARL?', 'TEVE INSPEÇÃO?', 'ID', 'PA', 'TEMA DO DDS', 'HOSPITAL MAIS PRÓXIMO (PAE)', 'ENDEREÇO DO HOSPITAL', 'DESCRIÇÃO DA ATIVIDADE', 'ENDEREÇO', 'OBSERVAÇÃO DA ATIVIDADE', 'POCC', 'POCS', 'PT', 'SPOOL AÇO', 'SOLDA EM AÇO', 'TESTE', 'COMISSIONAMENTO', 'ASSENTAMENTO', 'RECOMPOSIÇÃO', 'HOUVE STOP WORK?', 'INÍCIO DO STOP WORK', 'TÉRMINO DO STOP WORK', 'MOTIVO DA PARALISAÇÃO'],
    [idRDF, idVal('segmento'), val('projeto'), val('rdo'), idVal('responsavel'), val('empresa'), val('data'), val('periodo'), val('ai-inicio'), val('ai-termino'), 'AJUSTAR CAMPO AUTORIZACAO 1', 'AJUSTAR CAMPO AUTORIZACAO 2',  val('dds-realizado'), val('arl'), val('inspecao'), val('seg-id'), val('seg-pa'), val('dds-tema'), val('hospital'), val('hospital-end'), 'AJUSTAR CAMPO ATIVIDADE 1', 'AJUSTAR CAMPO ATIVIDADE 2', 'AJUSTAR CAMPO ATIVIDADE 3',  val('pocc'), val('pocs'), val('pt'), val('spool'), val('solda'), val('teste'), val('comissionamento'), val('assentamento'), val('recomposicao'),  val('stop-work-select'), val('sw-inicio'), val('sw-termino'), val('sw-motivo')],
  ];

  const autorizacaoRows = [];
  const autorizacaoBody = document.querySelectorAll('#autorizacao-body tr');


  autorizacaoBody.forEach((row, i) => {
    const inputs = row.querySelectorAll('input');
    const textarea = row.querySelectorAll('textarea');
    inputs.forEach((el) => {
      const label = el.placeholder || el.getAttribute('data-label') || `Campo ${i + 1}`;
      const teste = el.value
      autorizacaoRows.push([el.value.trim()]);
    });
  });


  const atividadeRows = [];
  const atividadeBody = document.querySelectorAll('#atividade-body tr');

  atividadeBody.forEach((row, i) => {
    const inputs = row.querySelectorAll('input, select, textarea');
    inputs.forEach((el) => {
      const label = el.placeholder || el.getAttribute('data-label') || `Campo ${i + 1}`;
      atividadeRows.push(['Atividades', label, el.value.trim()]);
    });
  });

  const todasAsLinhas = [
    ...identificacao,
    ...autorizacaoRows,
    ...atividadeRows,
  ];

  const csvContent = todasAsLinhas
    .map(row => row.map(esc).join(','))
    .join('\r\n');


  const blob = new Blob(['\uFEFF' + csvContent], {
    type: 'text/csv;charset=utf-8;'
  });

  const nomeArquivoCSV = `RDF_${val('data') || 'sem-data'}_${idVal('segmento') || 'sem-segmento'}_${val('projeto') || 'sem-projeto'}.csv`

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = nomeArquivoCSV;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}