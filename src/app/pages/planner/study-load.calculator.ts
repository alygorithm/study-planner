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

  static distributeLoad(
    tasks: Task[],
    days: Date[]
  ): { [key: string]: DailyStudyLoad } {

    const loadMap: { [key: string]: DailyStudyLoad } = {};

    days.forEach(day => {
      loadMap[day.toDateString()] = {
        date: day,
        hours: 0,
        minutes: 0,
        tasks: []
      };
    });

    const sortedTasks = [...tasks].sort(
      (a, b) => new Date(a.day).getTime() - new Date(b.day).getTime()
    );

    for (const task of sortedTasks) {

      let remainingHours = StudyHoursCalculator.calculateTaskHours(task);

      // 1) filtro giorni disponibili fino alla scadenza della task
      const taskDeadline = new Date(task.day).toDateString();
      const availableDays = days.filter(d => d.toDateString() <= taskDeadline);

      for (const day of availableDays) {
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
