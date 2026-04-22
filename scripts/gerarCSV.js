// ─────────────────────────────────────────────
// VALIDAÇÃO DE CAMPOS OBRIGATÓRIOS
// ─────────────────────────────────────────────
function validarCamposObrigatorios() {
    const campos = [
        { id: 'segmento',         nome: 'Segmento' },
        { id: 'projeto',          nome: 'Projeto' },
        { id: 'rdo',              nome: 'RDO' },
        { id: 'responsavel',      nome: 'Responsável Técnico' },
        { id: 'empresa',          nome: 'Empresa Executora' },
        { id: 'data',             nome: 'Data do Relatório' },
        { id: 'periodo',          nome: 'Período' },
        { id: 'ai-inicio',        nome: 'Horário de Início' },
        { id: 'ai-termino',       nome: 'Horário de Término' },
        { id: 'dds-realizado',    nome: 'DDS Realizado?' },
        { id: 'arl',              nome: 'Possui ARL?' },
        { id: 'inspecao',         nome: 'Teve Inspeção?' },
        { id: 'stop-work-select', nome: 'Houve Stop Work?' },
    ];
 
    const vazios = [];
 
    campos.forEach(({ id, nome }) => {
        const el = g(id);
        if (!el) return;
        const vazio = !el.value.trim();
        if (vazio) {
            vazios.push(nome);
            el.classList.add('campo-invalido');
            el.addEventListener('input',  () => el.classList.remove('campo-invalido'), { once: true });
            el.addEventListener('change', () => el.classList.remove('campo-invalido'), { once: true });
        } else {
            el.classList.remove('campo-invalido');
        }
    });
 
    if (vazios.length > 0) {
        alert(`⚠️ Preencha os campos obrigatórios antes de exportar:\n\n• ${vazios.join('\n• ')}`);
        const primeiro = document.querySelector('.campo-invalido');
        if (primeiro) primeiro.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return false;
    }
 
    return true;
}
 
// ─────────────────────────────────────────────
// BOTÃO EXPORTAR CSV (com validação)
// ─────────────────────────────────────────────
document.getElementById('btn-exportar').addEventListener('click', function () {
    if (!validarCamposObrigatorios()) return;
    gerarCSV();
});
 
// ─────────────────────────────────────────────
// EXPORTAR CSV
// ─────────────────────────────────────────────
function gerarCSV() {
  const val = (id) => {
    const el = document.getElementById(id);
    if (!el) return '';
    return el.value.trim();
  };
 
  const seg = document.getElementById('segmento');
  const res = document.getElementById('responsavel');
  const dt = document.getElementById('data').value;
  const valData = dt.replace(/[-0]/g, "");
 
  const idRDF = seg.value + res.value + valData;
 
  function campoNa(v) {
    return String(v ?? '').trim() || 'N/A';
  }
 
  function idVal(id) {
    const el = document.getElementById(id);
    const textoId = el.options[el.selectedIndex].text;
    return textoId === 'Selecione...' ? '' : textoId;
  }
 
  const esc = (v) => `"${String(v).replace(/"/g, '""')}"`;
 
  const atividades = [];
  const atividadeBody = document.querySelectorAll('#atividade-body tr');
 
  atividadeBody.forEach((row, i) => {
    if (row.dataset.groupStart === 'true') {
      const input1 = row.querySelector('input');
      const input2 = row.nextElementSibling?.querySelector('input');
      const textarea = row.nextElementSibling?.nextElementSibling?.querySelector('textarea');
 
      atividades.push({
        descricao: input1?.value.trim() || 'N/A',
        endereco: input2?.value.trim() || 'N/A',
        observacao: textarea?.value.trim() || 'N/A',
        idAtividade: idRDF + (i),
      });
    }
  });
 
  const cabecalho = [
    'ID RDF',
    'SEGMENTO',
    'PROJETO',
    'RDO',
    'RESPONSÁVEL TÉCNICO',
    'EMPRESA EXECUTORA',
    'DATA DO RELATÓRIO',
    'PERÍODO DA ATIVIDADE',
    'INÍCIO DA ATIVIDADE',
    'TÉRMINO DA ATIVIDADE',
    'VIGÊNCIA DA AUTORIZAÇÃO',
    'OBSERVAÇÃO AUTORIZAÇÃO',
    'DDS REALIZADO?',
    'POSSUI ARL?',
    'TEVE INSPEÇÃO?',
    'ID',
    'PA',
    'TEMA DO DDS',
    'HOSPITAL MAIS PRÓXIMO (PAE)',
    'ENDEREÇO DO HOSPITAL',
    'DESCRIÇÃO DA ATIVIDADE',
    'ENDEREÇO DA ATIVIDADE',
    'OBSERVAÇÃO DA ATIVIDADE',
    'POCC',
    'POCS',
    'PT',
    'SPOOL AÇO',
    'SOLDA EM AÇO',
    'TESTE',
    'COMISSIONAMENTO',
    'ASSENTAMENTO',
    'RECOMPOSIÇÃO',
    'HOUVE STOP WORK?',
    'INÍCIO DO STOP WORK',
    'TÉRMINO DO STOP WORK',
    'MOTIVO DA PARALISAÇÃO'
  ];
 
  const todasAsLinhas = [
    cabecalho,
    ...atividades.map(({ descricao, endereco, observacao, idAtividade }) => [
      idRDF,
      campoNa(idVal('segmento')),
      campoNa(val('projeto')),
      campoNa(val('rdo')),
      campoNa(idVal('responsavel')),
      campoNa(val('empresa')),
      campoNa(val('data')),
      campoNa(val('periodo')),
      campoNa(val('ai-inicio')),
      campoNa(val('ai-termino')),
      campoNa(val('dds-realizado')),
      campoNa(val('arl')),
      campoNa(val('inspecao')),
      campoNa(val('seg-id')),
      campoNa(val('seg-pa')),
      campoNa(val('dds-tema')),
      campoNa(val('hospital')),
      campoNa(val('hospital-end')),
      idAtividade,
      descricao,
      endereco,
      observacao,
      campoNa(val('pocc')),
      campoNa(val('pocs')),
      campoNa(val('pt')),
      campoNa(val('spool')),
      campoNa(val('solda')),
      campoNa(val('teste')),
      campoNa(val('comissionamento')),
      campoNa(val('assentamento')),
      campoNa(val('recomposicao')),
      campoNa(val('stop-work-select')),
      campoNa(val('sw-inicio')),
      campoNa(val('sw-termino')),
      campoNa(val('sw-motivo'))
    ])
  ];
 
  const csvContent = todasAsLinhas
    .map(row => row.map(esc).join(','))
    .join('\r\n');
 
  const blob = new Blob(['\uFEFF' + csvContent], {
    type: 'text/csv;charset=utf-8;'
  });
 
  const nomeArquivoCSV = `RDF_${val('data') || 'sem-data'}_${idVal('segmento') || 'sem-segmento'}_${idVal('responsavel') || 'sem-responsavel'}.csv`;
 
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = nomeArquivoCSV;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}