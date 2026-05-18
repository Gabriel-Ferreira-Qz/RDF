function validarCamposObrigatorios() {
    const campos = [
        { id: 'segmento', nome: 'Segmento' },
        { id: 'projeto', nome: 'Projeto' },
        { id: 'rdo', nome: 'RDO' },
        { id: 'responsavel', nome: 'Responsável Técnico' },
        { id: 'empresa', nome: 'Empresa Executora' },
        { id: 'periodo', nome: 'Período' },
        { id: 'ai-inicio', nome: 'Horário de Início' },
        { id: 'ai-termino', nome: 'Horário de Término' },
        { id: 'dds-realizado', nome: 'DDS Realizado?' },
        { id: 'arl', nome: 'Possui ARL?' },
        { id: 'inspecao', nome: 'Teve Inspeção?' },
        { id: 'seg-id', nome: 'ID' },
        { id: 'seg-pa', nome: 'PA' },
        { id: 'dds-tema', nome: 'Tema do DDS' },
        { id: 'regiao', nome: 'Qual a Região?' },
        { id: 'hospital', nome: 'Hospital mais próximo (PAE)' },
        { id: 'hospital-end', nome: 'Endereço do Hospital' },
        { id: 'spool', nome: 'Spool Aço' },
        { id: 'solda', nome: 'Solda em Aço' },
        { id: 'teste', nome: 'Teste' },
        { id: 'comissionamento', nome: 'Comissionamento' },
        { id: 'assentamento', nome: 'Assentamento' },
        { id: 'recomposicao', nome: 'Recomposição' },
        { id: 'stop-work-select', nome: 'Houve Stop Work?' },
        { id: 'detalhe-atv', nome: 'Informe os detalhes da atividade' }
    ];

    const vazios = [];

    campos.forEach(({ id, nome }) => {
        const el = g(id);
        if (!el) return;
        const vazio = !el.value.trim();
        if (vazio) {
            vazios.push(nome);
            el.classList.add('campo-invalido');
            el.addEventListener('input', () => el.classList.remove('campo-invalido'), { once: true });
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

const g = id => document.getElementById(id);
const val = id => (g(id)?.value?.trim()) || ''

function idVal(id) {
    const el = document.getElementById(id);
    const textoId = el.options[el.selectedIndex].text;
    return textoId === 'Selecione...' ? '' : textoId;
}


const responsavel = document.getElementById('responsavel');

const opcoesOriginais = [...responsavel.options].map(opt => ({
    value: opt.value,
    text: opt.text,
    className: opt.className
}));

const idTST = [
    {
        divID: 'segVisitado',
        inputID: 'segmento-visitado',
        label: 'Segmento a Ser Visitado'
    },
    {
        divID: 'engComgas',
        inputID: 'engenheiro-resposavel',
        label: 'Segmento a Ser Visitado'

    },
    {
        divID: 'engFrentes',
        inputID: 'qtd-frentes-eng',
        label: 'Segmento a Ser Visitado'

    }
]

function limpaCamposTST(divID, inputID) {
    g(divID).style.display = 'none';
    g(inputID).value = ''
    g('div-rdo').style.display = 'block';
    g('rdo').selectedIndex = 0;
    g('engenheiro-resposavel').value = 'N/A'
    g('qtd-frentes-eng').value = '0'
}

function addCampoTST(divID) {
    g(divID).style.display = 'block';
    g('div-rdo').style.display = 'none';
    g('rdo').selectedIndex = 1;
    g('engenheiro-resposavel').value = ''
    g('qtd-frentes-eng').value = ''
}

function trocaDeSegmento(e) {
    const isSeguranca = e === '5';

    responsavel.innerHTML = '';

    opcoesOriginais.forEach(opt => {
        const ehPadrao = opt.value === '';
        const ehTecGas = opt.className === 'tecGas';
        const ehTecSeguranca = opt.className === 'tecSeguranca';

        if (
            ehPadrao ||
            (isSeguranca && ehTecSeguranca) ||
            (!isSeguranca && ehTecGas)
        ) {
            responsavel.add(new Option(opt.text, opt.value));
        }
    });
    responsavel.value = '';

    idTST.forEach(({ divID, inputID }) => {
        if (isSeguranca) {
            return addCampoTST(divID);
        } return limpaCamposTST(divID, inputID);
    })
}


function validaInspencao() {
    const inspecao = g('inspecao').value;

    if (inspecao == 'Não') {
        document.getElementById('seg-id').value = 'N/A'
        document.getElementById('seg-pa').value = 'N/A'
    } else {
        document.getElementById('seg-id').value = ''
        document.getElementById('seg-pa').value = ''
    }
}

const dataInput = g('data');
const hoje = new Date();
hoje.setMinutes(hoje.getMinutes() - hoje.getTimezoneOffset());
dataInput.value = hoje.toISOString().slice(0, 10);

function alternarStopWork(v) {
    const stopId = g('stop-work-extra')
    if (v == '' || v == 'Não') {
        stopId.style.display = 'none'
    } else {
        stopId.style.display = 'block'
    }
}

function makeRow(cells, onDel) {
    const tr = document.createElement('tr');
    tr.innerHTML = cells.map(c => `<td>${c}</td>`).join('');
    if (onDel) {
        const td = document.createElement('td');
        td.style.cssText = 'display:flex;align-items:flex-start;padding:4px;';
        const btn = document.createElement('button');
        btn.className = 'row-del'; btn.innerHTML = '×'; btn.title = 'Remover'; btn.onclick = onDel;
        td.appendChild(btn); tr.appendChild(td);
    }
    return tr;
}

function addGroup(tbodyId, labels) {
    const body = g(tbodyId);
    const rows = labels.map((lbl, i) => {
        const inp = i < labels.length - 1
            ? `<input type="text" placeholder="${lbl.ph || ''}" id="${lbl.id || ''}" style="width:100%" >`
            : `<textarea placeholder="${lbl.ph || ''}" id="${lbl.id}" style="width:100% ; height: 350px"></textarea>`;
        return makeRow([`<label class="${lbl.class}">${lbl.label}</label>${inp}`], null);
    });

    rows[0].dataset.groupStart = 'true';
    rows[0].dataset.groupSize = rows.length;

    const btn = document.createElement('button');
    btn.className = 'row-del'; btn.innerHTML = '×'; btn.title = 'Remover';
    btn.onclick = () => {
        rows.forEach(r => r.remove());
        salvarTabelas(); // ← salva ao remover
    };
    const td = document.createElement('td'); td.style.cssText = 'display:flex;align-items:flex-start;padding:4px;';
    td.appendChild(btn); rows[0].appendChild(td);
    rows.forEach(r => body.appendChild(r));

    salvarTabelas();
}

function addAutorizacao() {
    addGroup('autorizacao-body', [
        { label: 'Vigência da Autorização', ph: 'Ex.: 01/01/2025 a 31/01/2025', id: 'vigencia' },
        { label: 'Observação', ph: '...', id: 'obs-vigencia' }
    ]);
}

function addAtiv() {
    addGroup('atividade-body', [
        { label: 'Descrição da Atividade', ph: 'Ex.: Concretagem da laje', id: 'descricao', class: 'ast-obrigatorio' },
        { label: 'Endereço', ph: 'Ex.: Pav. 3', id: 'endereco', class: 'ast-obrigatorio' },
        { label: 'Observação', ph: '...', id: 'obs-atividade' }
    ]);
}

let photos = [];
const dropArea = g('drop-area'), fileInput = g('file-input'), photoGrid = g('photo-grid');
dropArea.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', e => { handleFiles(e.target.files); fileInput.value = ''; });
dropArea.addEventListener('dragover', e => { e.preventDefault(); dropArea.classList.add('drag-over'); });
dropArea.addEventListener('dragleave', () => dropArea.classList.remove('drag-over'));
dropArea.addEventListener('drop', e => { e.preventDefault(); dropArea.classList.remove('drag-over'); handleFiles(e.dataTransfer.files); });

function handleFiles(files) {
    [...files].forEach(file => {
        if (!file.type.startsWith('image/')) return;
        const reader = new FileReader();
        reader.onload = ev => {
            const obj = { src: ev.target.result, caption: '', id: `${Date.now()}_${Math.floor(Math.random() * 1e6)}` };
            photos.push(obj); renderPhotoCard(obj);
        };
        reader.readAsDataURL(file);
    });
}
function renderPhotoCard(obj) {
    const card = document.createElement('div');
    card.className = 'photo-card'; card.dataset.id = obj.id;
    card.innerHTML = `<img src="${obj.src}" alt="foto"><div class="photo-caption"><input type="text" placeholder="Legenda..." value="${obj.caption}" oninput="updateCaption('${obj.id}',this.value)"></div><button class="photo-del" onclick="removePhoto('${obj.id}')">×</button>`;
    photoGrid.appendChild(card);
}

function updateCaption(id, v) {
    const p = photos.find(p => p.id === id);
    if (p) p.caption = v;
}

function removePhoto(id) {
    photos = photos.filter(p => p.id !== id);
    const el = photoGrid.querySelector(`[data-id="${id}"]`);
    if (el) el.remove();
}