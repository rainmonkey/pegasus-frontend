import { Injectable } from '@angular/core';
import * as jsPDF from "jspdf"

@Injectable({
  providedIn: 'root'
})
export class DownloadPDFService {

  constructor() { }

  downloadPDF(learnerName, invoice) {
    let currentHeight: number = 50
    let interval: number = 10
    // Landscape export, 2×4 inches
    let doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: [600, 460]
    });
    // title
    doc.setFontSize(20);
    doc.text(`Able Music Studio`, 75, 20);
    // detail
    doc.setFontSize(12);
    doc.text(`Invoice To: ${learnerName.firstName}  ${learnerName.lastName}`, 30, 30);

    doc.setFontSize(10)
    doc.text(`For`, 30, 40);
    doc.text(`${invoice.LessonQuantity} Lessons of ${invoice.CourseName}`, 35, 46);
    doc.text(`$${invoice.LessonFee}`, 170, 50);
    doc.text(`From the Date ${invoice.BeginDate.slice(0, 10)}`, 35, 50)

    if (invoice.ConcertFee) {
      currentHeight += interval
      doc.text(`${invoice.ConcertFeeName}`, 35, currentHeight);
      doc.text(`$${invoice.ConcertFee}`, 170, currentHeight);
    }

    if (invoice.NoteFee) {
      currentHeight += interval
      doc.text(`${invoice.LessonNoteFeeName}`, 35, currentHeight);
      doc.text(`$${invoice.NoteFee}`, 170, currentHeight);
    }

    if (invoice.Other1Fee) {
      currentHeight += interval
      doc.text(`Others1: ${invoice.Other1FeeName}`, 35, currentHeight)
      doc.text(`$${invoice.Other1Fee}`, 170, currentHeight)
    }

    if (invoice.Other2Fee) {
      currentHeight += interval
      doc.text(`Others2: ${invoice.Other2FeeName}`, 35, currentHeight)
      doc.text(`$${invoice.Other2Fee}`, 170, currentHeight)
    }

    if (invoice.Other3Fee) {
      currentHeight += interval
      doc.text(`Others3: ${invoice.Other3FeeName}`, 35, currentHeight)
      doc.text(`$${invoice.Other3Fee}`, 170, currentHeight)
    }

    doc.setFontSize(16);
    currentHeight += interval * 2
    doc.text(`TOTAL:$ ${invoice.TotalFee}`, 30, currentHeight);

    doc.setFontSize(10);
    currentHeight += interval
    doc.text(`Due Date: ${invoice.DueDate.slice(0, 10)}`, 30, currentHeight);
    doc.save(`${learnerName.firstName}  ${learnerName.lastName}'s invoice`);
  }
}

export interface IInvoiceLearnerName {
  firstName: string
  lastName: string
}

export interface IInvoice {
  LessonQuantity?: number
  CourseName?: string
  LessonFee?: number
  BeginDate?: string
  ConcertFeeName?: string
  ConcertFee?: number
  LessonNoteFeeName?: string
  NoteFee?: number
  Other1FeeName?: string
  Other1Fee?: number
  Other2FeeName?: string
  Other2Fee?: number
  Other3FeeName?: string
  Other3Fee?: number
  TotalFee?: number
  DueDate?: string
  [propName: string]: any;
}
