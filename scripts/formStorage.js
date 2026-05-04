const idCampo = [
    { secao: 'campo1', nome: 'segmento' },
    { secao: 'campo1', nome: 'projeto' },
    { secao: 'campo1', nome: 'rdo' },
    { secao: 'campo1', nome: 'responsavel' },
    { secao: 'campo1', nome: 'empresa' },
    { secao: 'campo1', nome: 'data' },
    { secao: 'campo1', nome: 'periodo' },
    { secao: 'campo1', nome: 'ai-inicio' },
    { secao: 'campo1', nome: 'ai-termino' },

    { secao: 'campo3', nome: 'dds-realizado' },
    { secao: 'campo3', nome: 'arl' },
    { secao: 'campo3', nome: 'inspecao' },
    { secao: 'campo3', nome: 'seg-id' },
    { secao: 'campo3', nome: 'seg-pa' },
    { secao: 'campo3', nome: 'dds-tema' },
    { secao: 'campo3', nome: 'hospital' },
    { secao: 'campo3', nome: 'hospital-end' },

    { secao: 'campo4', nome: 'pocc' },
    { secao: 'campo4', nome: 'pocs' },
    { secao: 'campo4', nome: 'pt' },
    { secao: 'campo4', nome: 'spool' },
    { secao: 'campo4', nome: 'solda' },
    { secao: 'campo4', nome: 'teste' },
    { secao: 'campo4', nome: 'comissionamento' },
    { secao: 'campo4', nome: 'assentamento' },
    { secao: 'campo4', nome: 'recomposicao' },

    { secao: 'campo5', nome: 'stop-work-select' },
    { secao: 'campo5', nome: 'sw-inicio' },
    { secao: 'campo5', nome: 'sw-termino' },
    { secao: 'campo5', nome: 'sw-motivo' },

    { secao: 'campo6', nome: 'detalhe-atv' },
];


function salvarCampos() {
    idCampo.forEach(({ nome }) => {
        const el = document.getElementById(nome);
        if (el) localStorage.setItem(nome, el.value);
    });
}

function salvarTabelas() {
    ['autorizacao-body', 'atividade-body'].forEach(tbodyId => {
        const body = document.getElementById(tbodyId);
        if (!body) return;

        // ← força o valor digitado de volta no atributo HTML antes de salvar
        body.querySelectorAll('input, textarea').forEach(el => {
            el.setAttribute('value', el.value);
        });

        const chave = tbodyId === 'autorizacao-body' ? 'rdf_autorizacoes' : 'rdf_atividades';
        localStorage.setItem(chave, body.innerHTML);
    });
}

function carregarCampos() {
    idCampo.forEach(({ nome }) => {
        const el = document.getElementById(nome);
        const valor = localStorage.getItem(nome);
        if (el && valor !== null) el.value = valor;
    });

    const sw = document.getElementById('stop-work-select');
    if (sw && sw.value === 'Sim') {
        document.getElementById('stop-work-extra').style.display = 'block';
    }
}

function carregarTabelas() {
    const autorizacao = document.getElementById('autorizacao-body');
    const atividade   = document.getElementById('atividade-body');

    const rawAut = localStorage.getItem('rdf_autorizacoes');
    const rawAtv = localStorage.getItem('rdf_atividades');

    if (autorizacao && rawAut) autorizacao.innerHTML = rawAut;
    if (atividade   && rawAtv) atividade.innerHTML   = rawAtv;
}

function limparCampos() {
    idCampo.forEach(({ nome }) => localStorage.removeItem(nome));
}

function iniciarAutoSave() {
    idCampo.forEach(({ nome }) => {
        const el = document.getElementById(nome);
        if (el) {
            el.addEventListener('input', salvarCampos);
            el.addEventListener('change', salvarCampos);
        }
    });
}


function iniciarAutoSaveTabelas() {
    ['autorizacao-body', 'atividade-body'].forEach(tbodyId => {
        const body = document.getElementById(tbodyId);
        if (!body) return;
        body.addEventListener('input', () => salvarTabelas());
        body.addEventListener('change', () => salvarTabelas());
    });
}

document.addEventListener('DOMContentLoaded', () => {
    carregarCampos();
    carregarTabelas();
    iniciarAutoSave();
    iniciarAutoSaveTabelas();
});

function limparForm() {
    idCampo
        .filter(({ nome }) => nome !== 'data')
        .forEach(({ nome }) => {
            const el = document.getElementById(nome);
            if (el) el.value = '';
            localStorage.removeItem(nome);
        });

    const autorizacao = document.getElementById('autorizacao-body');
    const atividade   = document.getElementById('atividade-body');
    if (autorizacao) autorizacao.innerHTML = '';
    if (atividade)   atividade.innerHTML   = '';

    localStorage.removeItem('rdf_autorizacoes');
    localStorage.removeItem('rdf_atividades');
}