export class LearnerDayOff {
  UserId: number;
  LearnerId: number;
  BeginDate: Date;
  EndDate: Date;
  Reason: string;
  InstanceIds: Array<number>;
  constructor(UserId, LearnerId, BeginDate, EndDate, Reason, InstanceIds){
    this.BeginDate = BeginDate;
    this.EndDate = EndDate;
    this.UserId = UserId;
    this.LearnerId = LearnerId;
    this.Reason = Reason;
    this.InstanceIds = InstanceIds;
  }
}
