import { Injectable } from '@angular/core';
import * as jsPDF from "jspdf"
import 'jspdf-autotable';
@Injectable({
  providedIn: 'root'
})
export class DownloadPDFService {
  // logo='../../../assets/images/loginpage/logo.png'
  constructor() { }

  downloadPDF(learnerName: IInvoiceLearnerName, invoice: IInvoice) {
    let table_header=[['Description',"Quantity",'Fee','others']]
    let body=[]
    let currentHeight: number = 60
    let interval: number = 10


    // Landscape export, 2×4 inches
    // let doc = new jsPDF({
    //   orientation: 'landscape',
    //   unit: 'mm',
    //   format: [600, 460]
    // });
    // // title
    // doc.setFontSize(20);
    // doc.text(`Able Music Studio`, 75, 20);
    // // detail
    // doc.setFontSize(12);
    // doc.text(`Invoice To: ${learnerName.firstName}  ${learnerName.lastName}`, 30, 30);

    // doc.setFontSize(10)
    // doc.text(`For`, 30, 40);

    // doc.text(`${invoice.LessonQuantity} Lessons of ${invoice.CourseName}`, 35, 46);
    // doc.text(`$${invoice.LessonFee}`, 170, 50);
    // doc.text(`From the Date ${invoice.BeginDate.slice(0, 10)}`, 35, 50)


    // winnie做的
    let doc = new jsPDF({
      unit: 'mm',
    })

    // title
    doc.setFontSize(20);
    // logo等着
    // doc.addImage(this.logo,75, 20);
    // detail
    doc.setFontSize(12);
    doc.text(`Invoice To: ${learnerName.firstName}  ${learnerName.lastName}`, 20, 30);
    doc.text(`From the Date ${invoice.BeginDate.slice(0, 10)}`, 140, 30)
    if (invoice.DueDate) {
      doc.text(`Due Date: ${invoice.DueDate.split("T")[0]}`, 140, 40);
    }

    // doc.line(10, 42, 190, 42);

    // doc.setFontSize(12)
    // doc.text(`Description`, 30, 50);
    // doc.setFontSize(10)
    // doc.text(`${invoice.LessonQuantity} Lessons of ${invoice.CourseName}`, 20, 60);

    // doc.setFontSize(12)
    // doc.text(`Fee`, 90, 50);
    // doc.setFontSize(10)
    // doc.text(`$${invoice.LessonFee}`, 90, 60);

    // doc.setFontSize(12)
    // doc.text(`Others`, 140, 50);
    // doc.setFontSize(10)
    // doc.text(`From the Date ${invoice.BeginDate.slice(0, 10)}`, 130, 60)


    body.push([invoice.CourseName,invoice.LessonQuantity,invoice.LessonFee,invoice.BeginDate.slice(0, 10)])

    if (invoice.ConcertFee) {
      currentHeight += interval
      doc.text(`${invoice.ConcertFeeName}`, 20, currentHeight);
      doc.text(`$${invoice.ConcertFee}`, 90, currentHeight);

    }

    if (invoice.NoteFee) {
      currentHeight += interval
      doc.text(`${invoice.LessonNoteFeeName}`, 20, currentHeight);
      doc.text(`$${invoice.NoteFee}`, 90, currentHeight);
    }

    if (invoice.Other1Fee) {
      currentHeight += interval
      doc.text(`${invoice.Other1FeeName}`, 20, currentHeight)
      doc.text(`$${invoice.Other1Fee}`, 90, currentHeight)
    }

    if (invoice.Other2Fee) {
      currentHeight += interval
      doc.text(`${invoice.Other2FeeName}`, 20, currentHeight)
      doc.text(`$${invoice.Other2Fee}`, 90, currentHeight)
    }

    if (invoice.Other3Fee) {
      currentHeight += interval
      doc.text(`${invoice.Other3FeeName}`, 20, currentHeight)
      doc.text(`$${invoice.Other3Fee}`, 90, currentHeight)
    }


    doc.setFontSize(16);
    doc.autoTable({head: table_header,body,
      // body: [
      //   ['','David', 'david@example.com', 'Sweden'],
      //   ['','Castille', 'castille@example.com', 'Norway']
      // ],
      startY: 50
    });
    currentHeight += interval * 2
    doc.text(`TOTAL:$ ${invoice.TotalFee}`, 20, currentHeight);




    doc.save(`${learnerName.firstName}  ${learnerName.lastName}'s invoice`);
  }
}

export interface IInvoiceLearnerName {
  firstName: string
  lastName: string
}

export interface IInvoice {
  LessonQuantity?: number
  CourseName: string
  LessonFee: number
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
  TotalFee: number
  DueDate?: string
  [propName: string]: any;
}
