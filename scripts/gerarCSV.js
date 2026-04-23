function validarCamposObrigatorios() {
    const campos = [
        { id: 'segmento',         nome: 'Segmento' },
        { id: 'projeto',          nome: 'Projeto' },
        { id: 'rdo',              nome: 'RDO' },
        { id: 'responsavel',      nome: 'Responsável Técnico' },
        { id: 'empresa',          nome: 'Empresa Executora' },
        { id: 'periodo',          nome: 'Período' },
        { id: 'ai-inicio',        nome: 'Horário de Início' },
        { id: 'ai-termino',       nome: 'Horário de Término' },
        { id: 'dds-realizado',    nome: 'DDS Realizado?' },
        { id: 'arl',              nome: 'Possui ARL?' },
        { id: 'inspecao',         nome: 'Teve Inspeção?' },
        { id: 'seg-id',           nome: 'ID'},
        { id: 'seg-pa',           nome: 'PA'},
        { id: 'dds-tema',         nome: 'Tema do DDS'},
        { id: 'hospital',         nome: 'Hospital mais próximo (PAE)'},
        { id: 'hospital-end',     nome: 'Endereço do Hospital'},
        { id: 'pocc',             nome: 'POCC'},
        { id: 'pocs',             nome: 'POCS'},
        { id: 'pt',               nome: 'PT'},
        { id: 'spool',            nome: 'Spool Aço'},
        { id: 'solda',            nome: 'Solda em Aço'},
        { id: 'teste',            nome: 'Teste'},
        { id: 'comissionamento',  nome: 'Comissionamento'},
        { id: 'assentamento',     nome: 'Assentamento'},
        { id: 'recomposicao',     nome: 'Recomposição'},
        { id: 'stop-work-select', nome: 'Houve Stop Work?' },
        { id: 'detalhe-atv',      nome: 'Informe os detalhes da atividade'}
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

function validarAtividades() {
    const rows = document.querySelectorAll('#atividade-body tr[data-group-start="true"]');

    if (rows.length === 0) {
        alert('⚠️ Adicione pelo menos uma atividade antes de exportar.');
        return false;
    }

    let valido = true;

    rows.forEach((row, i) => {
        const input1 = row.querySelector('input');
        const input2 = row.nextElementSibling?.querySelector('input');

        [input1, input2].forEach(el => {
            if (!el) return;
            if (!el.value.trim()) {
                el.classList.add('campo-invalido');
                el.addEventListener('input', () => el.classList.remove('campo-invalido'), { once: true });
                valido = false;
            }
        });
    });

    if (!valido) {
        alert('⚠️ Preencha os campos obrigatórios em todas as atividades.');
        document.querySelector('#atividade-body .campo-invalido')
            ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    return valido;
}


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
        'DDS REALIZADO?',
        'POSSUI ARL?',
        'TEVE INSPEÇÃO?',
        'ID',
        'PA',
        'TEMA DO DDS',
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