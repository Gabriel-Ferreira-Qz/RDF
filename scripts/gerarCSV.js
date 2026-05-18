document.getElementById('btn-exportar').addEventListener('click', function () {
    if (!validarCamposObrigatorios()) return;
    if (!validarAtividades()) return;
    gerarXLSX();
});


function montarDados() {
    const val = (id) => {
        const el = document.getElementById(id);
        if (!el) return '';
        return el.value.trim();
    }

    const seg = document.getElementById('segmento');
    const res = document.getElementById('responsavel');
    const dt = document.getElementById('data').value;
    const valData = dt.replace(/[-0]/g, "");

    const idRDF = seg.value + res.value + valData;

    function campoNa(v) {
        return String(v ?? '').trim() || 'N/A';
    } 

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
        'SEGMENTO A SER VISITADO',
        'PROJETO',
        'RDO',
        'RESPONSÁVEL TÉCNICO',
        'EMPRESA CONTRATADA',
        'ENGENHEIRO COMGÁS RESPONSÁVEL',
        'QUANTAS FRENTES HAVIA DESSE ENGENHEIRO',
        'DATA DO RELATÓRIO',
        'PERÍODO DA ATIVIDADE',
        'INÍCIO DA ATIVIDADE',
        'TÉRMINO DA ATIVIDADE',
        'DDS REALIZADO?',
        'POSSUI ARL?',
        'TEVE INSPEÇÃO?',
        'ID',
        'PA',
        'TEMA DO DDS',
        'QUAL A REGIÃO',
        'HOSPITAL MAIS PRÓXIMO (PAE)',
        'ENDEREÇO DO HOSPITAL',
        'ID ATIVIDADE',
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
            campoNa(idVal('segmento-visitado')),
            campoNa(val('projeto')),
            campoNa(val('rdo')),
            campoNa(idVal('responsavel')),
            campoNa(val('empresa')),
            campoNa(val('engenheiro-resposavel')),
            campoNa(val('qtd-frentes-eng')),
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
            campoNa(idVal('regiao')),
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
    return { todasAsLinhas, val, idVal };
}


function gerarCSV() {
    const { todasAsLinhas, val, idVal } = montarDados();

    const esc = (v) => `"${String(v).replace(/"/g, '""')}"`;

    const csvContent = todasAsLinhas
        .map(row => row.map(esc).join(','))
        .join('\r\n');

    const blob = new Blob(['\uFEFF' + csvContent], {
        type: 'text/csv;charset=utf-8;'
    });

    const nomeArquivo = `RDF_${val('data') || 'sem-data'}_${idVal('segmento') || 'sem-segmento'}_${idVal('responsavel') || 'sem-responsavel'}.csv`;

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = nomeArquivo;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}


function gerarXLSX() {
    const { todasAsLinhas, val, idVal } = montarDados();

    const ws = XLSX.utils.aoa_to_sheet(todasAsLinhas);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'RDF');

    const nomeArquivo = `RDF_${val('data') || 'sem-data'}_${idVal('segmento') || 'sem-segmento'}_${idVal('responsavel') || 'sem-responsavel'}.xlsx`;

    XLSX.writeFile(wb, nomeArquivo);
}
