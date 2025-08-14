import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const exportToCSV = (rows, filename = 'export.csv') => {
  if (!rows || rows.length === 0) return;
  const header = Object.keys(rows[0]);
  const csv = [header.join(',')]
    .concat(rows.map(r => header.map(h => JSON.stringify(r[h] ?? '')).join(',')))
    .join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, filename);
};

export const exportToXLSX = (rows, filename = 'export.xlsx', sheetName = 'Sheet1') => {
  if (!rows || rows.length === 0) return;
  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  saveAs(new Blob([wbout], { type: 'application/octet-stream' }), filename);
};

export const exportToPDF = (rows, columns, filename = 'export.pdf', title = '報告') => {
  const doc = new jsPDF();
  doc.setFontSize(14);
  doc.text(title, 14, 16);

  const head = [columns.map(col => col.header || col.title || col.field)];
  const body = rows.map(row => columns.map(col => {
    const key = col.field || col.key;
    return row[key] ?? '';
  }));

  autoTable(doc, {
    head,
    body,
    startY: 22,
    styles: { fontSize: 10 },
    headStyles: { fillColor: [33, 150, 243] },
  });

  doc.save(filename);
};

export const exportToPDFAdvanced = ({
  title = '報告',
  subtitle,
  columns = [],
  rows = [],
  filename = 'report.pdf',
  meta = {}, // {company, createdBy, dateRange}
}) => {
  const doc = new jsPDF();

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 14;

  // Header
  doc.setFontSize(16);
  doc.text(title, margin, 16);
  doc.setFontSize(11);
  const sub = subtitle || `${meta.company ? meta.company + ' | ' : ''}${meta.dateRange || ''}`.trim();
  if (sub) doc.text(sub, margin, 24);

  // Meta right side
  const createdLine = `匯出時間：${new Date().toLocaleString('zh-TW')}`;
  doc.setFontSize(10);
  doc.text(createdLine, pageWidth - margin, 16, { align: 'right' });
  if (meta.createdBy) doc.text(`匯出者：${meta.createdBy}`, pageWidth - margin, 22, { align: 'right' });

  // Table
  const head = [columns.map(col => col.header || col.title || col.field)];
  const body = rows.map(row => columns.map(col => {
    const key = col.field || col.key;
    const v = row[key];
    return v == null ? '' : String(v);
  }));

  autoTable(doc, {
    head,
    body,
    startY: 30,
    styles: { fontSize: 10, cellPadding: 2 },
    headStyles: { fillColor: [33, 150, 243], halign: 'center' },
    didDrawPage: (data) => {
      // Footer with page number
      const str = `第 ${doc.internal.getNumberOfPages()} 頁`;
      doc.setFontSize(9);
      doc.text(str, pageWidth - margin, doc.internal.pageSize.getHeight() - 6, { align: 'right' });
    },
  });

  doc.save(filename);
};

// --- CJK support ---
const arrayBufferToBase64 = (buffer) => {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const chunkSize = 0x8000; // 32KB
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, i + chunkSize);
    binary += String.fromCharCode.apply(null, chunk);
  }
  return btoa(binary);
};

const ensureCJKFont = async (doc, { fontUrl = '/fonts/NotoSansTC-Regular.ttf', fontName = 'NotoSansTC' } = {}) => {
  try {
    const res = await fetch(fontUrl);
    if (!res.ok) throw new Error('Font fetch failed');
    const buf = await res.arrayBuffer();
    const base64 = arrayBufferToBase64(buf);
    doc.addFileToVFS(`${fontName}.ttf`, base64);
    doc.addFont(`${fontName}.ttf`, fontName, 'normal');
    doc.setFont(fontName, 'normal');
    return fontName;
  } catch (e) {
    console.warn('CJK font load failed, fallback to helvetica. Error:', e);
    // 明確回退到內建字型，避免 widths undefined
    doc.setFont('helvetica', 'normal');
    return null;
  }
};

export const exportToPDFAdvancedCJK = async ({
  title = '報告',
  subtitle,
  columns = [],
  rows = [],
  filename = 'report.pdf',
  meta = {},
  fontUrl = '/fonts/NotoSansTC-Regular.ttf',
  fontName = 'NotoSansTC',
}) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 14;

  const loadedFont = await ensureCJKFont(doc, { fontUrl, fontName });
  // 再次保險，明確設定目前字型
  doc.setFont(loadedFont || 'helvetica', 'normal');

  // Header
  doc.setFontSize(16);
  doc.text(title, margin, 16);
  doc.setFontSize(11);
  const sub = subtitle || `${meta.company ? meta.company + ' | ' : ''}${meta.dateRange || ''}`.trim();
  if (sub) doc.text(sub, margin, 24);

  // Meta right side
  const createdLine = `匯出時間：${new Date().toLocaleString('zh-TW')}`;
  doc.setFontSize(10);
  doc.text(createdLine, pageWidth - margin, 16, { align: 'right' });
  if (meta.createdBy) doc.text(`匯出者：${meta.createdBy}`, pageWidth - margin, 22, { align: 'right' });

  const head = [columns.map(col => col.header || col.title || col.field)];
  const body = rows.map(row => columns.map(col => {
    const key = col.field || col.key;
    const v = row[key];
    return v == null ? '' : String(v);
  }));

  autoTable(doc, {
    head,
    body,
    startY: 30,
    styles: { fontSize: 10, cellPadding: 2, font: loadedFont || 'helvetica', fontStyle: 'normal' },
    headStyles: { fillColor: [33, 150, 243], halign: 'center', font: loadedFont || 'helvetica', fontStyle: 'normal' },
    bodyStyles: { font: loadedFont || 'helvetica', fontStyle: 'normal' },
    didDrawPage: () => {
      const str = `第 ${doc.internal.getNumberOfPages()} 頁`;
      doc.setFontSize(9);
      doc.text(str, pageWidth - margin, doc.internal.pageSize.getHeight() - 6, { align: 'right' });
    },
  });

  doc.save(filename);
};
