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

  const esc = (v) => `"${String(v).replace(/"/g, '""')}"`;

  const identificacao = [
    ['ID RDF', 'SEGMENTO', 'PROJETO', 'RDO', 'RESPOSÁVEL TÉCNICO', 'EMPRESA EXECUTORA', 'DATA DO RELATÓRIO', 'PERÍODO DA ATIVIDADE', 'INÍCIO DA ATIVIDADE', 'TÉRMINO DA ATIVIDADE', 'VIGÊNCIA DA AUTORIZAÇÃO', 'OBS AUTORIZAÇÃO', 'DDS REALIZADO?', 'POSSUI ARL?', 'TEVE INSPEÇÃO', 'ID', 'PA', 'TEMA DO DDS', 'HOSPITAL MAIS PRÓXIMO (PAE)', 'ENDEREÇO DO HOSPITAL', 'DESCRIÇÃO DA ATIVIDADE', 'ENDEREÇO', 'OBSERVAÇÃO DA ATIVIDADE', 'POCC', 'POCS', 'PT', 'SPOOL AÇO', 'SOLDA EM AÇO', 'TESTE', 'COMISSIONAMENTO', 'ASSENTAMENTO', 'RECOMPOSIÇÃO', 'HOUVE STOP WORK?', 'INÍCIO', 'TÉMINO', 'MOTIVO DA PARALIZAÇÃO'],
    [idRDF, idVal('segmento'), val('projeto'), val('rdo'), idVal('responsavel'), val('empresa'), val('data'), val('periodo'), val('ai-inicio'), val('ai-termino')], 
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
      console.log(teste)
    });
  });


  const seguranca = [
    []
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
    []
  ];

  const stopWork = [
    []
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