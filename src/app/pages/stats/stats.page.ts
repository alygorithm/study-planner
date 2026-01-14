import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TaskService, FocusSession } from '../planner/task.service';
import { Task } from '../planner/task.model';

interface DayStat {
  label: string;
  hours: number;
  percentage: number;
}

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [IonicModule, CommonModule],
  templateUrl: './stats.page.html',
  styleUrls: ['./stats.page.scss']
})
export class StatsPage implements OnInit {

  activeTab: string = 'stats';

  focusSessions: FocusSession[] = [];
  tasks: Task[] = [];

  totalMinutes = 0;
  todayMinutes = 0;
  todayTarget = 50;
  todayProgress = 0;

  completedTasks = 0;
  totalTasks = 0;
  completionPercent = 0;

  weekStats: DayStat[] = [];

  constructor(
    private router: Router,
    private taskService: TaskService
  ) {}

  ngOnInit() {
    this.loadFocusSessions();
    this.loadTasks();
  }

  navigate(page: string) {
    this.activeTab = page;
    this.router.navigate(['/' + page]);
  }

  loadFocusSessions() {
    this.taskService.getFocusSessions().subscribe({
      next: sessions => {
        this.focusSessions = sessions;

        this.totalMinutes = sessions.reduce(
          (sum, s) => sum + s.minutes,
          0
        );

        const today = new Date().toDateString();
        this.todayMinutes = sessions
          .filter(s => new Date(s.day || '').toDateString() === today)
          .reduce((sum, s) => sum + s.minutes, 0);

        this.todayProgress = Math.min(
          this.todayMinutes / this.todayTarget,
          1
        );

        this.calculateWeekStats();
      },
      error: err => console.error('Errore statistiche:', err)
    });
  }

  loadTasks() {
    this.taskService.getTasks().subscribe({
      next: tasks => {
        this.tasks = tasks;
        this.totalTasks = tasks.length;
        this.completedTasks = tasks.filter(t => t.completed).length;
        this.completionPercent = this.totalTasks
          ? Math.round((this.completedTasks / this.totalTasks) * 100)
          : 0;
      },
      error: err => console.error('Errore caricamento tasks:', err)
    });
  }

  private calculateWeekStats() {
    const weekDays = ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'];
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());

    this.weekStats = weekDays.map((label, index) => {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + index);

      const minutes = this.focusSessions
        .filter(s => new Date(s.day || '').toDateString() === day.toDateString())
        .reduce((sum, s) => sum + s.minutes, 0);

      return {
        label,
        hours: +(minutes / 60).toFixed(1),
        percentage: Math.min((minutes / 60) / 3 * 100, 100)
      };
    });
  }
}
