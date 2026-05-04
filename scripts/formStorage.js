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


document.addEventListener('DOMContentLoaded', () => {
    carregarCampos();
    iniciarAutoSave();
});

