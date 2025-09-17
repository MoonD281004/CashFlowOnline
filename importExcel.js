// importExcel.js

// Helper function to generate unique IDs
function uid() {
  return Math.random().toString(36).slice(2, 9);
}

// Import Excel button creation and event handler
function setupImportExcel(entries, saveEntries, render) {
  const importXlsxBtn = document.createElement('button');
  importXlsxBtn.id = 'importXlsx';
  importXlsxBtn.textContent = 'Impor Excel';
  importXlsxBtn.className = 'bg-amber-400 text-white p-2 rounded-lg ml-2';

  const exportBtn = document.getElementById('exportXlsx');
  if (exportBtn && exportBtn.parentNode) {
    exportBtn.parentNode.appendChild(importXlsxBtn);
  }

  importXlsxBtn.addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.xlsx,.xls';
    input.addEventListener('change', async () => {
      const file = input.files[0];
      if (!file) return;
      const data = await file.arrayBuffer();
      const wb = XLSX.read(data, { type: 'array' });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(ws, { defval: '' });
      for (const r of json) {
        entries.push({
          id: uid(),
          date: r.Tanggal || r.date || r.tanggal || new Date().toISOString().slice(0, 10),
          type: r.Tipe || r.type || 'expense',
          category: r.Kategori || r.category || '',
          note: r.Catatan || r.note || '',
          amount: Number(r.Jumlah || r.jumlah || r.Amount || r.amount || 0)
        });
      }
      saveEntries();
      alert('Import Excel selesai');
      render();
    });
    input.click();
  });
}

// Sorting enhancement: add category and amount sorting options
function setupSorting(sortSelect, render, entries) {
  // Add new options if not already present
  if (!Array.from(sortSelect.options).some(o => o.value === 'category_asc')) {
    sortSelect.add(new Option('Kategori A-Z', 'category_asc'));
    sortSelect.add(new Option('Kategori Z-A', 'category_desc'));
    sortSelect.add(new Option('Jumlah Ascending', 'amount_asc'));
    sortSelect.add(new Option('Jumlah Descending', 'amount_desc'));
  }

  sortSelect.addEventListener('change', () => {
    const val = sortSelect.value;
    entries.sort((a, b) => {
      switch (val) {
        case 'date_asc':
          return new Date(a.date) - new Date(b.date);
        case 'date_desc':
          return new Date(b.date) - new Date(a.date);
        case 'category_asc':
          return (a.category || '').localeCompare(b.category || '');
        case 'category_desc':
          return (b.category || '').localeCompare(a.category || '');
        case 'amount_asc':
          return (a.amount || 0) - (b.amount || 0);
        case 'amount_desc':
          return (b.amount || 0) - (a.amount || 0);
        default:
          return 0;
      }
    });
    render();
  });
}

export { setupImportExcel, setupSorting };
