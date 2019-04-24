export interface ILearnerPay {
  StaffId: number;
  LearnerId: number;
  InvoiceId: number;
  PaymentMethod: string;
  Amount: number;
}
export interface IOtherPay {
  StaffId: number;
  LearnerId: number;
  title: string;
  amount: number;
}
