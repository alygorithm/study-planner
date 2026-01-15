import { Task } from "./task.model";
import { StudyHoursCalculator } from "./hours.calculator";

export interface DailyStudyLoad {
  date: Date;
  hours: number;
  minutes: number;
  tasks: Task[];
}

export class StudyLoadCalculator {

  private static MAX_HOURS_PER_DAY = 4;

  /**
   * Distribuisce le ore di studio sulle giornate disponibili
   */
  static distributeLoad(
    tasks: Task[],
    days: Date[]
  ): { [key: string]: DailyStudyLoad } {

    const loadMap: { [key: string]: DailyStudyLoad } = {};

    // inizializza i giorni
    days.forEach(day => {
      loadMap[day.toDateString()] = {
        date: day,
        hours: 0,
        minutes: 0,
        tasks: []
      };
    });

    // task ordinate per scadenza
    const sortedTasks = [...tasks].sort(
      (a, b) => new Date(a.day).getTime() - new Date(b.day).getTime()
    );

    for (const task of sortedTasks) {

      let remainingHours = StudyHoursCalculator.calculateTaskHours(task);

      for (const day of days) {
        const key = day.toDateString();
        const load = loadMap[key];

        const currentLoad = load.hours + load.minutes / 60;
        if (currentLoad >= this.MAX_HOURS_PER_DAY) continue;

        const available = this.MAX_HOURS_PER_DAY - currentLoad;
        const assigned = Math.min(available, remainingHours);

        const formatted = StudyHoursCalculator.formatHours(assigned);

        load.hours += formatted.hours;
        load.minutes += formatted.minutes;
        load.tasks.push(task);

        remainingHours -= assigned;
        if (remainingHours <= 0) break;
      }
    }

    return loadMap;
  }
}
