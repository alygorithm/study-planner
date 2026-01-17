import { Task } from "./task.model";

export class StudyHoursCalculator {

  private static PRIORITY_MINUTES: { [key: string]: number } = {
    alta: 120,
    media: 90,
    bassa: 60
  };

  private static SUBJECT_MULTIPLIER: { [key: string]: number } = {
    matematica: 1.2,
    fisica: 1.2,
    programmazione: 1.2,
    chimica: 1.15,
    statistica: 1.15
  };

  /**
   * Calcola la durata in minuti di una task
   */
  static calculateTaskMinutes(task: Task): number {
    const priority = task.priority?.toLowerCase() ?? "media";
    const baseMinutes = this.PRIORITY_MINUTES[priority] ?? 90;

    const subject = task.subject?.toLowerCase() ?? "";
    const multiplier = this.SUBJECT_MULTIPLIER[subject] ?? 1;

    return Math.round(baseMinutes * multiplier);
  }

  static formatMinutes(totalMinutes: number): { hours: number; minutes: number } {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return { hours, minutes };
  }
}
