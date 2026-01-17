import { Task } from "./task.model";
import { StudyHoursCalculator } from "./hours.calculator";

export interface DailyStudyLoad {
  date: Date;
  hours: number;
  minutes: number;
  tasks: Task[];
}

export class StudyLoadCalculator {

  private static MAX_MINUTES_PER_DAY = 4 * 60; // 4 ore

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

      let remainingMinutes = StudyHoursCalculator.calculateTaskMinutes(task);

      for (const day of days) {
        const key = day.toDateString();
        const load = loadMap[key];

        const currentMinutes = load.hours * 60 + load.minutes;
        if (currentMinutes >= this.MAX_MINUTES_PER_DAY) continue;

        const available = this.MAX_MINUTES_PER_DAY - currentMinutes;
        const assigned = Math.min(available, remainingMinutes);

        const formatted = StudyHoursCalculator.formatMinutes(assigned);

        load.hours += formatted.hours;
        load.minutes += formatted.minutes;
        load.tasks.push(task);

        remainingMinutes -= assigned;
        if (remainingMinutes <= 0) break;
      }
    }

    return loadMap;
  }
}
