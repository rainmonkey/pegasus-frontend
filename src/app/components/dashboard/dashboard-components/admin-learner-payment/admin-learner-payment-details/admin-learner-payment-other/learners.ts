export interface ILearnerPay {
  StaffId: number;
  LearnerId: number;
  InvoiceId: number;
  PaymentMethod: number;
  Amount: number;
}
export interface IOtherPay {
  StaffId: number;
  title: string;
  amount: number;
}
export interface IcatData {
  Data: Array<any>;
}
