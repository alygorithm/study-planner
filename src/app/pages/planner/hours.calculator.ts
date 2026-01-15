import { Task } from "./task.model";

export class StudyHoursCalculator {

  private static PRIORITY_HOURS: { [key: string]: number } = {
    alta: 2,
    media: 1.5,
    bassa: 1
  };

  /**
   * Calcola le ore di studio di una task
   * Priorità > durata manuale > default
   */
  static calculateTaskHours(task: Task): number {

    // durata manuale ha precedenza
    if (task.duration && task.duration > 0) {
      return task.duration;
    }

    if (!task.priority) return 1;

    const priority = task.priority.toLowerCase();
    return this.PRIORITY_HOURS[priority] ?? 1;
  }

  static formatHours(decimal: number): { hours: number; minutes: number } {
    const hours = Math.floor(decimal);
    const minutes = Math.round((decimal - hours) * 60);
    return { hours, minutes };
  }
}
