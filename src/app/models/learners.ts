export interface ILearnerPay {
  StaffId: number;
  OrgId:number;
  LearnerId: number;
  InvoiceId: number;
  PaymentMethod: number;
  Amount: number;
  UseCredit:boolean;
}
export interface IOtherPay {
  StaffId: number;
  title: string;
  amount: number;
}
export interface IcatData {
  Data: Array<any>;
}
