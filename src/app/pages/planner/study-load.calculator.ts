import { Task } from "./task.model";
import { StudyHoursCalculator } from "./hours.calculator";

export interface DailyStudyLoad {
  date: Date;
  hours: number;
  minutes: number;
  tasks: Task[];
}

export class StudyLoadCalculator {

  private static MAX_MINUTES_PER_DAY = 240; // 4 ore

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

    const sortedTasks = [...tasks].sort(
      (a, b) => new Date(a.day).getTime() - new Date(b.day).getTime()
    );

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (const task of sortedTasks) {

      let remainingMinutes = StudyHoursCalculator.calculateTaskMinutes(task);

      const taskDay = new Date(task.day);
      taskDay.setHours(0, 0, 0, 0);

      // se la scadenza è passata -> assegna solo oggi
      const endDay = taskDay < today ? today : taskDay;

      // prendo solo i giorni tra oggi e la scadenza
      const availableDays = days.filter(d => {
        const dd = new Date(d);
        dd.setHours(0, 0, 0, 0);
        return dd.getTime() <= endDay.getTime();
      });

      for (const day of availableDays) {
        const key = day.toDateString();
        const load = loadMap[key];

        const currentMinutes = load.hours * 60 + load.minutes;
        if (currentMinutes >= this.MAX_MINUTES_PER_DAY) continue;

        const available = this.MAX_MINUTES_PER_DAY - currentMinutes;
        const assigned = Math.min(available, remainingMinutes);

        load.hours = Math.floor((currentMinutes + assigned) / 60);
        load.minutes = (currentMinutes + assigned) % 60;

        // aggiunge la task solo se contribuisce a quel giorno
        load.tasks.push(task);

        remainingMinutes -= assigned;
        if (remainingMinutes <= 0) break;
      }
    }

    return loadMap;
  }
}
