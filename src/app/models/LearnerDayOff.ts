export class LearnerDayOff {
  UserId: number;
  LearnerId: number;
  BeginDate: Date;
  EndDate: Date;
  Reason: string;
  InstanceIds: Array<number>;
  IsInvoiceChange: number;
  constructor(UserId, LearnerId, BeginDate, EndDate, Reason, InstanceIds, IsInvoiceChange) {
    this.BeginDate = BeginDate;
    this.EndDate = EndDate;
    this.UserId = UserId;
    this.LearnerId = LearnerId;
    this.Reason = Reason;
    this.InstanceIds = InstanceIds;
    this.IsInvoiceChange = IsInvoiceChange;
  }
}

export interface CancelLessonsModel {
  UserId: number;
  Reason: string;
  LessonIds: Array<number>;
  IsInvoiceChange: number;
}
