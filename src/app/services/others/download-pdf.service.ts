import { Injectable } from '@angular/core';
import * as jsPDF from "jspdf"

@Injectable({
  providedIn: 'root'
})
export class DownloadPDFService {

  constructor() { }

  // downloadPDF(index, learner, invoice) {
  //   //FirstName LastName LessonQuantity CourseName LessonFee BeginDate
  //   //ConcertFeeName? ConcertFee? LessonNoteFeeName? NoteFee?
  //   //Other1FeeName? Other1Fee? Other2FeeName? Other2Fee? Other3FeeName? Other3Fee?
  //   //TotalFee DueDate
  //   learner = this.myArray[index]
  //   let invDetail = learner.Invoice;
  //   let currentHeight: number = 50
  //   let interval: number = 10
  //   // Landscape export, 2×4 inches
  //   let doc = new jsPDF({
  //     orientation: 'landscape',
  //     unit: 'mm',
  //     format: [600, 460]
  //   });
  //   // title
  //   doc.setFontSize(20);
  //   doc.text(`Able Music Studio`, 75, 20);
  //   // detail
  //   doc.setFontSize(12);
  //   doc.text(`Invoice To: ${learner.FirstName}  ${learner.LastName}`, 30, 30);
  //
  //   doc.setFontSize(10)
  //   doc.text(`For`, 30, 40);
  //   doc.text(`${invDetail.LessonQuantity} Lessons of ${invDetail.CourseName}`, 35, 46);
  //   doc.text(`$${invDetail.LessonFee}`, 170, 50);
  //   doc.text(`From the Date ${invDetail.BeginDate.slice(0, 10)}`, 35, 50)
  //
  //   if (invDetail.ConcertFee) {
  //     currentHeight += interval
  //     doc.text(`${invDetail.ConcertFeeName}`, 35, currentHeight);
  //     doc.text(`$${invDetail.ConcertFee}`, 170, currentHeight);
  //   }
  //
  //   if (invDetail.NoteFee) {
  //     currentHeight += interval
  //     doc.text(`${invDetail.LessonNoteFeeName}`, 35, currentHeight);
  //     doc.text(`$${invDetail.NoteFee}`, 170, currentHeight);
  //   }
  //
  //   if (invDetail.Other1Fee) {
  //     currentHeight += interval
  //     doc.text(`Others: ${invDetail.Other1FeeName}`, 35, currentHeight)
  //     doc.text(`$${invDetail.Other1Fee}`, 170, currentHeight)
  //   }
  //
  //   if (invDetail.Other2Fee) {
  //     currentHeight += interval
  //     doc.text(`${invDetail.Other2FeeName}`, 35, currentHeight)
  //     doc.text(`$${invDetail.Other2Fee}`, 170, currentHeight)
  //   }
  //
  //   if (invDetail.Other3Fee) {
  //     currentHeight += interval
  //     doc.text(`${invDetail.Other3FeeName}`, 35, currentHeight)
  //     doc.text(`$${invDetail.Other3Fee}`, 170, currentHeight)
  //   }
  //
  //   doc.setFontSize(16);
  //   currentHeight += interval * 2
  //   doc.text(`TOTAL:$ ${invDetail.TotalFee}`, 30, currentHeight);
  //
  //   doc.setFontSize(10);
  //   currentHeight += interval
  //   doc.text(`Due Date: ${invDetail.DueDate.slice(0, 10)}`, 30, currentHeight);
  //   doc.save(`${learner.FirstName}  ${learner.LastName}'s invoice`);
  // }
}
