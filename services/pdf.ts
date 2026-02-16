
import jsPDF from 'jspdf';
import { Invoice, House } from '../types';

export const generateInvoicePDF = async (invoice: Invoice, house: House) => {
  const doc = new jsPDF();
  const primaryColor = [255, 122, 0]; // Água Mali Orange
  const secondaryColor = [0, 86, 210]; // Água Mali Blue
  const SUPPORT_CONTACT = "843307646";
  const PRICE_PER_M3 = 70;

  // Header
  doc.setFillColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  doc.rect(0, 0, 210, 45, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.text('ÁGUA MALI', 20, 25);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Gestão de Abastecimento - Bairro Santa Isabel, Maputo', 20, 35);

  // Invoice Details
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(`FATURA Nº: ${invoice.invoiceNumber}`, 130, 65);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Data de Emissão: ${new Date().toLocaleDateString('pt-PT')}`, 130, 72);
  doc.text(`Data de Vencimento: ${invoice.dueDate}`, 130, 79);

  // Client Info
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  doc.text('DADOS DO CLIENTE', 20, 65);
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`ID Cliente: ${house.id}`, 20, 72);
  doc.text(`Proprietário: ${house.ownerName}`, 20, 79);
  doc.text(`Contacto: ${house.phoneNumber}`, 20, 86);
  doc.text(`Ref. Localização: ${house.reference}`, 20, 93);

  // Consumption Table
  doc.setFillColor(245, 245, 245);
  doc.rect(20, 110, 170, 10, 'F');
  doc.setFont('helvetica', 'bold');
  doc.text('Descrição do Serviço', 25, 116);
  doc.text('Qtd (m³)', 100, 116);
  doc.text('Preço/m³', 130, 116);
  doc.text('Total (MZN)', 160, 116);

  doc.setFont('helvetica', 'normal');
  doc.text('Consumo Mensal de Água Potável', 25, 130);
  
  const consumptionM3 = invoice.amount / PRICE_PER_M3;
  doc.text(`${consumptionM3.toFixed(2)}`, 100, 130);
  doc.text(`${PRICE_PER_M3.toFixed(2)}`, 130, 130);
  doc.text(`${invoice.amount.toFixed(2)}`, 160, 130);

  // Financial Summary
  doc.setDrawColor(200, 200, 200);
  doc.line(120, 145, 190, 145);
  doc.setFont('helvetica', 'bold');
  doc.text('SUBTOTAL:', 120, 155);
  doc.text(`${invoice.amount.toFixed(2)} MZN`, 160, 155);
  
  doc.setFont('helvetica', 'normal');
  doc.text('TAXAS/SALDOS:', 120, 162);
  doc.text(`${invoice.taxes.toFixed(2)} MZN`, 160, 162);
  
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(120, 170, 70, 12, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('TOTAL:', 125, 178);
  doc.text(`${invoice.total.toFixed(2)} MZN`, 155, 178);

  // Payment Methods
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(11);
  doc.text('MÉTODOS DE PAGAMENTO (DEX EXPRESS):', 20, 205);
  doc.setFontSize(9);
  doc.text('M-PESA / E-MOLA: 84 330 7646', 20, 212);
  doc.text('REFERÊNCIA DE DEPÓSITO: Use o ID Cliente na descrição.', 20, 217);

  // Footer & Support
  doc.setDrawColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  doc.setLineWidth(1);
  doc.line(20, 265, 190, 265);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('APOIO E RECLAMAÇÕES:', 20, 275);
  doc.setTextColor(0, 0, 0);
  doc.text(SUPPORT_CONTACT, 70, 275);
  
  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  doc.text('DIAS EXPRESS - Maputo, Santa Isabel | Sistema Digital Água Mali 2026', 20, 285);

  doc.save(`Fatura_AguaMali_${invoice.invoiceNumber}.pdf`);
};
