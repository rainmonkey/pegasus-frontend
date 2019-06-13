export class PeriodCourseDurationChange {
  UserId: number;
  LearnerId: number;
  BeginDate: Date;
  EndDate: Date;
  Reason: string;
  InstanceId: number;
  OrgId: number
  DayOfWeek: number;
  BeginTime: string;
  EndTime: string;
  RoomId: number;
  IsTemporary: number;
  CourseScheduleId: number;
  constructor(UserId, LearnerId, BeginDate, EndDate, Reason, InstanceId, OrgId, DayOfWeek, BeginTime,
              EndTime, RoomId, IsTemporary, CourseScheduleId) {
    this.UserId = UserId;
    this.LearnerId = LearnerId;
    this.BeginDate = BeginDate;
    this.EndDate = EndDate;
    this.Reason = Reason;
    this.InstanceId = InstanceId;
    this.OrgId = OrgId;
    this.DayOfWeek = DayOfWeek;
    this.BeginTime = BeginTime;
    this.EndTime = EndTime;
    this.RoomId = RoomId;
    this.IsTemporary = IsTemporary;
    this.CourseScheduleId = CourseScheduleId;
  }
}
