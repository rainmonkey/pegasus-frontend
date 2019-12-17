export class SessionEdit {
  LessonId: number;
  LearnerId: number;
  RoomId: number;
  TeacherId: number;
  OrgId: number;
  BeginTime: Date;
  Reason:string;
  constructor(LessonId, LearnerId, RoomId, TeacherId, OrgId, Reason, BeginTime) {
    this.LessonId = LessonId;
    this.LearnerId = LearnerId;
    this.RoomId = RoomId;
    this.TeacherId = TeacherId;
    this.OrgId = OrgId;
    this.BeginTime = BeginTime;
    this.Reason = Reason;
  }
}
