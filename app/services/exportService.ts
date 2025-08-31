import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import type { HistoryRecord, ExportFormat } from '../types';

export class ExportService {
  /**
   * 导出为 JSON 格式
   */
  exportToJSON(data: HistoryRecord[]): Blob {
    const jsonString = JSON.stringify(data, null, 2);
    return new Blob([jsonString], { type: 'application/json' });
  }

  /**
   * 导出为 CSV 格式
   */
  exportToCSV(data: HistoryRecord[]): Blob {
    const headers = [
      'ID',
      'First Name',
      'Last Name', 
      'Phone',
      'ID Type',
      'ID Value',
      'Birthday',
      'Blood Type',
      'Occupation',
      'Education',
      'Credit Card',
      'Road',
      'City',
      'State',
      'Postcode',
      'Country',
      'Latitude',
      'Longitude',
      'IP',
      'Timestamp',
      'Starred'
    ];

    const csvRows = [headers.join(',')];

    data.forEach(record => {
      const row = [
        record.id,
        record.user.name.first,
        record.user.name.last,
        record.user.phone,
        record.user.id.name,
        record.user.id.value,
        record.user.birthday || '',
        record.user.bloodType || '',
        record.user.occupation || '',
        record.user.education || '',
        record.user.creditCard || '',
        record.address.road || '',
        record.address.city || '',
        record.address.state || '',
        record.address.postcode || '',
        record.address.country || '',
        record.address.coordinates?.latitude || '',
        record.address.coordinates?.longitude || '',
        record.ip,
        new Date(record.timestamp).toISOString(),
        record.isStarred ? 'Yes' : 'No'
      ];

      // 处理包含逗号的字段
      const escapedRow = row.map(field => {
        const fieldStr = String(field);
        if (fieldStr.includes(',') || fieldStr.includes('"') || fieldStr.includes('\n')) {
          return `"${fieldStr.replace(/"/g, '""')}"`;
        }
        return fieldStr;
      });

      csvRows.push(escapedRow.join(','));
    });

    const csvString = csvRows.join('\n');
    return new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  }

  /**
   * 导出为 PDF 格式
   */
  exportToPDF(data: HistoryRecord[]): Blob {
    const pdf = new jsPDF();
    
    // 设置字体和标题
    pdf.setFontSize(16);
    pdf.text('Address Generation Report', 20, 20);
    
    pdf.setFontSize(10);
    pdf.text(`Generated on: ${new Date().toLocaleString()}`, 20, 30);
    pdf.text(`Total Records: ${data.length}`, 20, 35);

    let yPosition = 50;
    const pageHeight = pdf.internal.pageSize.height;

    data.forEach((record, index) => {
      // 检查是否需要新页面
      if (yPosition > pageHeight - 60) {
        pdf.addPage();
        yPosition = 20;
      }

      // 记录标题
      pdf.setFontSize(12);
      pdf.text(`Record ${index + 1}`, 20, yPosition);
      yPosition += 10;

      // 用户信息
      pdf.setFontSize(9);
      pdf.text(`Name: ${record.user.name.first} ${record.user.name.last}`, 25, yPosition);
      yPosition += 5;
      pdf.text(`Phone: ${record.user.phone}`, 25, yPosition);
      yPosition += 5;
      pdf.text(`${record.user.id.name}: ${record.user.id.value}`, 25, yPosition);
      yPosition += 5;

      // 新增字段
      if (record.user.birthday) {
        pdf.text(`Birthday: ${record.user.birthday}`, 25, yPosition);
        yPosition += 5;
      }
      if (record.user.bloodType) {
        pdf.text(`Blood Type: ${record.user.bloodType}`, 25, yPosition);
        yPosition += 5;
      }
      if (record.user.occupation) {
        pdf.text(`Occupation: ${record.user.occupation}`, 25, yPosition);
        yPosition += 5;
      }

      // 地址信息
      const addressParts = [
        record.address.road,
        record.address.city,
        record.address.state,
        record.address.postcode,
        record.address.country
      ].filter(Boolean);
      
      if (addressParts.length > 0) {
        pdf.text(`Address: ${addressParts.join(', ')}`, 25, yPosition);
        yPosition += 5;
      }

      pdf.text(`IP: ${record.ip}`, 25, yPosition);
      yPosition += 5;
      pdf.text(`Date: ${new Date(record.timestamp).toLocaleString()}`, 25, yPosition);
      yPosition += 10;
    });

    return new Blob([pdf.output('blob')], { type: 'application/pdf' });
  }

  /**
   * 导出为 Excel 格式
   */
  exportToExcel(data: HistoryRecord[]): Blob {
    const worksheet = XLSX.utils.json_to_sheet(
      data.map(record => ({
        'ID': record.id,
        'First Name': record.user.name.first,
        'Last Name': record.user.name.last,
        'Phone': record.user.phone,
        'ID Type': record.user.id.name,
        'ID Value': record.user.id.value,
        'Birthday': record.user.birthday || '',
        'Blood Type': record.user.bloodType || '',
        'Occupation': record.user.occupation || '',
        'Education': record.user.education || '',
        'Credit Card': record.user.creditCard || '',
        'Road': record.address.road || '',
        'City': record.address.city || '',
        'State': record.address.state || '',
        'Postcode': record.address.postcode || '',
        'Country': record.address.country || '',
        'Latitude': record.address.coordinates?.latitude || '',
        'Longitude': record.address.coordinates?.longitude || '',
        'IP': record.ip,
        'Timestamp': new Date(record.timestamp).toISOString(),
        'Starred': record.isStarred ? 'Yes' : 'No'
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Address Records');

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    return new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  }

  /**
   * 根据格式导出数据
   */
  exportData(data: HistoryRecord[], format: ExportFormat): Blob {
    switch (format) {
      case 'json':
        return this.exportToJSON(data);
      case 'csv':
        return this.exportToCSV(data);
      case 'pdf':
        return this.exportToPDF(data);
      case 'excel':
        return this.exportToExcel(data);
      default:
        throw new Error(`Unsupported export format: ${format}`);
    }
  }

  /**
   * 获取导出文件名
   */
  getExportFileName(format: ExportFormat): string {
    const date = new Date().toISOString().split('T')[0];
    const extensions = {
      json: 'json',
      csv: 'csv',
      pdf: 'pdf',
      excel: 'xlsx'
    };
    
    return `address-history-${date}.${extensions[format]}`;
  }

  /**
   * 下载文件
   */
  downloadFile(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}
