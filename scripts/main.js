const g = id => document.getElementById(id);
const val = id => (g(id)?.value?.trim()) || ''

// Responsavel
const segmento = document.getElementById('segmento');
const responsavel = document.getElementById('responsavel');

const opcoesOriginais = [...responsavel.options].map(opt => ({
  value: opt.value,
  text: opt.text,
  className: opt.className
}));

function filtrarResponsavel() {
  const isSeguranca = segmento.value === '5';

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

}

segmento.addEventListener('change', filtrarResponsavel);

// Data
const dataInput = g('data');
const hoje = new Date();
hoje.setMinutes(hoje.getMinutes() - hoje.getTimezoneOffset());
dataInput.value = hoje.toISOString().slice(0, 10);

// Stop Work
function alternarStopWork(v) { g('stop-work-extra').style.display = v === 'Sim' ? 'block' : 'none'; }

//Segurança do trabalho

// makeRow helper
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
            ? `<input type="text" placeholder="${lbl.ph || ''}" id="${lbl.id || ''}" style="width:100%">`
            : `<textarea placeholder="${lbl.ph || ''}" id="${lbl.id}" style="width:100% ; height: 350px"></textarea>`;
        return makeRow([`<label>${lbl.label}</label>${inp}`], null);
    });

    rows[0].dataset.groupStart = 'true';
    rows[0].dataset.groupSize = rows.length;

    const btn = document.createElement('button');
    btn.className = 'row-del'; btn.innerHTML = '×'; btn.title = 'Remover';
    btn.onclick = () => rows.forEach(r => r.remove());
    const td = document.createElement('td'); td.style.cssText = 'display:flex;align-items:flex-start;padding:4px;';
    td.appendChild(btn); rows[0].appendChild(td);
    rows.forEach(r => body.appendChild(r));
}

function addAutorizacao() {
    addGroup('autorizacao-body', [
        { label: 'Vigência da Autorização', ph: 'Ex.: 01/01/2025 a 31/01/2025', id: 'vigencia' },
        { label: 'Observação', ph: '...', id: 'obs-vigencia' }
    ]);
}

function addAtiv() {
    addGroup('atividade-body', [
        { label: 'Descrição da Atividade', ph: 'Ex.: Concretagem da laje', id: 'descricao' },
        { label: 'Endereço', ph: 'Ex.: Pav. 3', id: 'endereco' },
        { label: 'Observação', ph: '...', id: 'obs-atividade' }
    ]);
}

// Fotos
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
function updateCaption(id, v) { const p = photos.find(p => p.id === id); if (p) p.caption = v; }
function removePhoto(id) { photos = photos.filter(p => p.id !== id); const el = photoGrid.querySelector(`[data-id="${id}"]`); if (el) el.remove(); }
