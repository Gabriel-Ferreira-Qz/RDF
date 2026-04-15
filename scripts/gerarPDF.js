async function gerarPDF() {
    const btn = g('btn-exportar-pdf');
    btn.disabled = true; btn.textContent = 'Gerando...';
    try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({ unit: 'mm', format: 'a4' });
        const PW = 210, PH = 297, ML = 14, MR = 14, CW = 210 - 14 - 14;
        const CA = [70, 104, 47], CAL = [206, 227, 179], YE = [71, 71, 73];
        const TX = [26, 25, 23], MU = [107, 104, 96], BO = [214, 211, 203];
        const WH = [255, 255, 255], SF = [250, 250, 248];
        let y = 0;

        function newPageIfNeeded(n) { if (y + n > PH - 14) { doc.addPage(); y = 14; } }

        // Cabeçalho pág 1
        doc.setFillColor(...CA); doc.rect(0, 0, PW, 18, 'F');
        doc.setFillColor(...YE); doc.rect(0, 18, PW, 1.5, 'F');
        doc.setFont('helvetica', 'bold'); doc.setFontSize(11); doc.setTextColor(...WH);
        doc.addImage('assets/Logo-Branco2.png', 'PNG', 14, 4, 10, 10);
        doc.addImage('assets/Simbolo-Comgas.png', 'PNG', PW - 25, 4, 10, 10);
        doc.text('RELATÓRIO DIÁRIO DE FISCALIZAÇÃO', 105, 11.5, null, null, "center");
        doc.setFont('helvetica', 'normal'); doc.setFontSize(8); doc.setTextColor(170, 195, 220);
        y = 26;

        function secHeader(num, title) {
            newPageIfNeeded(14);
            doc.setFillColor(...CAL); doc.roundedRect(ML, y, CW, 9, 1, 1, 'F');
            doc.setFillColor(...CA); doc.roundedRect(ML, y + 1, 7, 7, 1, 1, 'F');
            doc.setFont('helvetica', 'bold'); doc.setFontSize(8); doc.setTextColor(...WH);
            doc.text(String(num), ML + 3.5, y + 5.8, { align: 'center' });
            doc.setTextColor(...CA); doc.setFontSize(8.5);
            doc.text(title.toUpperCase(), ML + 10, y + 6);
            y += 12;
        }

        function fld(label, value, fh) {
            fh = fh || 9; newPageIfNeeded(fh + 2);
            doc.setFillColor(...SF); doc.roundedRect(ML, y, CW, fh, 0.5, 0.5, 'F');
            doc.setDrawColor(...BO); doc.roundedRect(ML, y, CW, fh, 0.5, 0.5, 'S');
            doc.setFont('helvetica', 'bold'); doc.setFontSize(6.5); doc.setTextColor(...MU);
            doc.text(label.toUpperCase(), ML + 3, y + 4);
            doc.setFont('helvetica', 'normal'); doc.setFontSize(9); doc.setTextColor(...TX);
            doc.text(doc.splitTextToSize(value || '—', CW - 6)[0], ML + 3, y + fh - 2.5);
            y += fh + 1;
        }

        function fld2(l1, v1, l2, v2) {
            newPageIfNeeded(11);
            const hw = (CW - 3) / 2;
            [[l1, v1, ML], [l2, v2, ML + hw + 3]].forEach(([l, v, x]) => {
                doc.setFillColor(...SF); doc.roundedRect(x, y, hw, 9, 0.5, 0.5, 'F');
                doc.setDrawColor(...BO); doc.roundedRect(x, y, hw, 9, 0.5, 0.5, 'S');
                doc.setFont('helvetica', 'bold'); doc.setFontSize(6.5); doc.setTextColor(...MU);
                doc.text(l.toUpperCase(), x + 3, y + 4);
                doc.setFont('helvetica', 'normal'); doc.setFontSize(9); doc.setTextColor(...TX);
                doc.text(doc.splitTextToSize(v || '—', hw - 6)[0], x + 3, y + 7.2);
            });
            y += 10;
        }

        function fldM(label, value) {
            const lines = doc.splitTextToSize(value || '—', CW - 6);
            const fh = Math.max(12, lines.length * 5 + 7);
            newPageIfNeeded(fh + 2);
            doc.setFillColor(...SF); doc.roundedRect(ML, y, CW, fh, 0.5, 0.5, 'F');
            doc.setDrawColor(...BO); doc.roundedRect(ML, y, CW, fh, 0.5, 0.5, 'S');
            doc.setFont('helvetica', 'bold'); doc.setFontSize(6.5); doc.setTextColor(...MU);
            doc.text(label.toUpperCase(), ML + 3, y + 4);
            doc.setFont('helvetica', 'normal'); doc.setFontSize(9); doc.setTextColor(...TX);
            doc.text(lines, ML + 3, y + 9);
            y += fh + 1;
        }

        function collectGroups(tbodyId) {
            const body = g(tbodyId); if (!body) return [];
            const rows = [...body.querySelectorAll('tr')];
            const groups = [];

            let i = 0;
            while (i < rows.length) {
                if (rows[i].dataset.groupStart === 'true') {
                    const size = parseInt(rows[i].dataset.groupSize) || 1;
                    const slice = rows.slice(i, i + size);
                    const els = slice.flatMap(r => [...r.querySelectorAll('input, textarea')]);
                    groups.push(els.map(e => e.value.trim()));
                    i += size;
                } else {
                    i++;
                }
            }
            return groups;
        }

        function safe(v) {
            return String(v ?? '').trim() || 'N/A';
        }

        const segmento = document.getElementById('segmento');
        const responsavel = document.getElementById('responsavel')

        var textoSeg = segmento.options[segmento.selectedIndex].text;
        var textoRes = responsavel.options[responsavel.selectedIndex].text;

        // ── Seção 1
        secHeader(1, 'Identificação da Atividade');
        fld('Segmento', safe(val('segmento')));
        fld('Projeto', safe(val('projeto')));
        fld2('RDO', safe(val('rdo')), 'Responsável Técnico', safe(val('responsavel')));
        fld2('Empresa Executora', safe(val('empresa')), 'Data do Relatório', safe(val('data')));
        fld('Período', safe(val('periodo')));
        fld2('Início', safe(val('ai-inicio')), 'Término', safe(val('ai-termino')));
        y += 4;

        // ── Seção 2
        secHeader(2, 'Autorização');
        const auths = collectGroups('autorizacao-body');
        if (!auths.length) {
            doc.setFont('helvetica', 'italic'); doc.setFontSize(8.5); doc.setTextColor(...MU);
            doc.text('Nenhuma autorização registrada.', ML + 3, y + 4); y += 10;
        } else {
            auths.forEach((gr, i) => {
                newPageIfNeeded(8);
                doc.setFont('helvetica', 'bold'); doc.setFontSize(7.5); doc.setTextColor(...CA);
                doc.text(`Autorização ${i + 1}`, ML, y + 4); y += 7;
                fld('Vigência da Autorização', gr[0]);
                fldM('Observação', gr[1]);
                y += 2;
            });
        }
        y += 4;

        // ── Seção 3
        secHeader(3, 'Segurança do Trabalho');
        fld2('DDS Realizado?', safe(val('dds-realizado')), 'Possui ARL?', safe(val('arl')));
        fld2('Teve Inspeção?', safe(val('inspecao')), 'ID', safe(val('seg-id')));
        fld2('PA', safe(val('seg-pa')), 'Tema do DDS', safe(val('dds-tema')));
        fld('Hospital mais próximo (PAE)', safe(val('hospital')));
        fld('Endereço do Hospital', safe(val('hospital-end')));
        y += 4;

        // ── Seção 4
        secHeader(4, 'Atividades Executadas');
        const ativs = collectGroups('atividade-body');
        if (!ativs.length) {
            doc.setFont('helvetica', 'italic'); doc.setFontSize(8.5); doc.setTextColor(...MU);
            doc.text('Nenhuma atividade registrada.', ML + 3, y + 4); y += 10;
        } else {
            ativs.forEach((gr, i) => {
                newPageIfNeeded(8);
                doc.setFont('helvetica', 'bold'); doc.setFontSize(7.5); doc.setTextColor(...CA);
                doc.text(`Atividade ${i + 1}`, ML, y + 4); y += 7;
                fld('Descrição da Atividade', gr[0]);
                fld('Endereço', gr[1]);
                fldM('Observação', gr[2]);
                y += 2;
            });
        }
        fld2('POCC', safe(val('pocc')), 'POCS', safe(val('pocs')));
        fld2('PT', safe(val('pt')), 'Spool Aço', safe(val('spool')));
        fld2('Solda em Aço', safe(val('solda')), 'Teste', safe(val('teste')));
        fld2('Comissionamento', safe(val('comissionamento')), 'Assentamento', safe(val('assentamento')));
        fld('Recomposição', safe(val('recomposicao')));
        y += 4;

        // ── Seção 5
        secHeader(5, 'Stop Work');
        const sw = val('stop-work-select');
        fld('Houve Stop Work?', safe(sw));
        if (sw === 'Sim') {
            fld2('Início', val('sw-inicio'), 'Término', val('sw-termino'));
            fldM('Motivo da Paralização', val('sw-motivo'));
        }
        y += 4;

        // ── Seção 6 — Fotos
        secHeader(6, 'Registro Fotográfico');
        if (!photos.length) {
            doc.setFont('helvetica', 'italic'); doc.setFontSize(8.5); doc.setTextColor(...MU);
            doc.text('Nenhuma foto registrada.', ML + 3, y + 4); y += 10;
        } else {
            const PW2 = (CW - 4) / 2, PH2 = PW2 * 0.75, CAP = 7, BLK = PH2 + CAP + 2;
            for (let i = 0; i < photos.length; i++) {
                const col = i % 2;
                if (col === 0) newPageIfNeeded(BLK + 4);
                const xPos = ML + col * (PW2 + 4);
                const yPos = col === 0 ? y : y - BLK - 2;
                try {
                    const src = photos[i].src;
                    const fmt = src.startsWith('data:image/png') ? 'PNG' : 'JPEG';
                    doc.addImage(src, fmt, xPos, yPos, PW2, PH2);
                } catch (e) {
                    doc.setFillColor(220, 218, 213); doc.rect(xPos, yPos, PW2, PH2, 'F');
                    doc.setFont('helvetica', 'italic'); doc.setFontSize(7); doc.setTextColor(...MU);
                    doc.text('Imagem indisponível', xPos + PW2 / 2, yPos + PH2 / 2, { align: 'center' });
                }
                doc.setFillColor(...SF); doc.rect(xPos, yPos + PH2, PW2, CAP, 'F');
                doc.setDrawColor(...BO); doc.rect(xPos, yPos, PW2, PH2 + CAP, 'S');
                doc.setFont('helvetica', 'normal'); doc.setFontSize(7.5); doc.setTextColor(...TX);
                const cap = doc.splitTextToSize(photos[i].caption || '', PW2 - 4);
                if (cap[0]) doc.text(cap[0], xPos + 2, yPos + PH2 + 5);
                doc.setFillColor(...CA); doc.roundedRect(xPos + 2, yPos + 2, 7, 5, 1, 1, 'F');
                doc.setFont('helvetica', 'bold'); doc.setFontSize(6.5); doc.setTextColor(...WH);
                doc.text(`${i + 1}`, xPos + 5.5, yPos + 5.8, { align: 'center' });
                if (col === 0) y += BLK + 2;
            }
            if (photos.length % 2 !== 0) y += 2;
        }

        const total = doc.internal.getNumberOfPages();
        for (let p = 1; p <= total; p++) {
            doc.setPage(p);
            doc.setFillColor(...CA); doc.rect(0, PH - 10, PW, 10, 'F');
            doc.setFont('helvetica', 'normal'); doc.setFontSize(7); doc.setTextColor(160, 190, 215);
            doc.text('RDF — Relatório Diário de Fiscalização', ML, PH - 3.5);
            doc.text(`Página ${p} / ${total}`, PW - MR, PH - 3.5, { align: 'right' });
        }

        const nomeArquivoPDF = `RDF_${val('data') || 'sem-data'}_${val('segmento') || 'sem-segmeto'}_${val('projeto') || 'sem-projeto'}`
        doc.save(`${nomeArquivoPDF}.pdf`);
    } catch (err) {
        console.error(err); alert('Erro ao gerar PDF: ' + err.message);
    }

    btn.disabled = false;
    btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 11v1.5a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5V11M7 1v8M4 6l3 3 3-3" stroke="#1A1917" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg> Exportar PDF`;
}