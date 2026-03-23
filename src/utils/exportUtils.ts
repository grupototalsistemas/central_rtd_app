import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

type Column = {
  label: string;
  accessor: string;
};

/**
 * Obtém valor aninhado de um objeto usando notação de ponto
 */
function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((acc, key) => acc?.[key], obj);
}

/**
 * Exporta dados para CSV
 * @param columns - Colunas da tabela
 * @param data - Dados a serem exportados
 * @param filename - Nome do arquivo (sem extensão)
 */
export function exportToCSV(
  columns: Column[],
  data: any[],
  filename: string = 'export'
) {
  // Cabeçalhos
  const headers = columns.map((col) => col.label).join(',');

  // Linhas de dados
  const rows = data.map((item) => {
    return columns
      .map((col) => {
        const value = getNestedValue(item, col.accessor);
        // Escapar valores que contenham vírgulas ou aspas
        const stringValue = String(value ?? '');
        if (stringValue.includes(',') || stringValue.includes('"')) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
      })
      .join(',');
  });

  // Combinar cabeçalhos e linhas
  const csv = [headers, ...rows].join('\n');

  // Criar Blob e fazer download
  const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Exporta dados para PDF
 * @param columns - Colunas da tabela
 * @param data - Dados a serem exportados
 * @param filename - Nome do arquivo (sem extensão)
 * @param title - Título do documento
 */
export function exportToPDF(
  columns: Column[],
  data: any[],
  filename: string = 'export',
  title: string = 'Relatório'
) {
  const doc = new jsPDF('l', 'mm', 'a4'); // landscape, milímetros, A4

  // Adicionar título
  doc.setFontSize(16);
  doc.text(title, 14, 15);

  // Adicionar data de geração
  doc.setFontSize(10);
  const dataGeracao = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
  doc.text(`Gerado em: ${dataGeracao}`, 14, 22);

  // Preparar dados da tabela
  const headers = columns.map((col) => col.label);
  const rows = data.map((item) =>
    columns.map((col) => String(getNestedValue(item, col.accessor) ?? ''))
  );

  // Adicionar tabela
  autoTable(doc, {
    head: [headers],
    body: rows,
    startY: 28,
    styles: {
      fontSize: 8,
      cellPadding: 2,
    },
    headStyles: {
      fillColor: [41, 128, 185],
      textColor: 255,
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
    margin: { top: 28, right: 14, bottom: 14, left: 14 },
  });

  // Adicionar número de páginas
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.text(
      `Página ${i} de ${pageCount}`,
      doc.internal.pageSize.getWidth() - 30,
      doc.internal.pageSize.getHeight() - 10
    );
  }

  // Fazer download
  doc.save(`${filename}.pdf`);
}
