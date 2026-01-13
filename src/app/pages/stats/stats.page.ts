import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TaskService, FocusSession } from '../planner/task.service';

interface DayStat {
  label: string;
  hours: number;
  percentage: number; // altezza barra %
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
  totalMinutes: number = 0;
  todayMinutes: number = 0;
  todayTarget: number = 50;
  todayProgress: number = 0;

  weekStats: DayStat[] = [];

  constructor(private router: Router, private taskService: TaskService) {}

  ngOnInit() {
    this.loadFocusSessions();
  }

  navigate(page: string) {
    this.activeTab = page;
    this.router.navigate(['/' + page]);
  }

  loadFocusSessions() {
    this.taskService.getFocusSessions().subscribe({
      next: (sessions: FocusSession[]) => {
        this.focusSessions = sessions;

        // Totale minuti
        this.totalMinutes = sessions.reduce((sum, s) => sum + s.minutes, 0);

        // Minuti completati oggi
        const today = new Date().toDateString();
        this.todayMinutes = sessions
          .filter(s => s.completed && new Date(s.day || '').toDateString() === today)
          .reduce((sum, s) => sum + s.minutes, 0);
        this.todayProgress = Math.min(this.todayMinutes / this.todayTarget, 1);

        // Grafico settimanale
        this.calculateWeekStats();
      },
      error: (err) => console.error('Errore caricamento sessioni:', err)
    });
  }

  private calculateWeekStats() {
    const weekDays = ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'];
    const todayDate = new Date();
    const startOfWeek = new Date(todayDate);
    startOfWeek.setDate(todayDate.getDate() - todayDate.getDay()); // domenica come inizio settimana

    this.weekStats = weekDays.map((label, index) => {
      const dayDate = new Date(startOfWeek);
      dayDate.setDate(startOfWeek.getDate() + index);

      const minutes = this.focusSessions
        .filter(s => s.completed && new Date(s.day || '').toDateString() === dayDate.toDateString())
        .reduce((sum, s) => sum + s.minutes, 0);

      return {
        label,
        hours: +(minutes / 60).toFixed(1),
        percentage: Math.min((minutes / 60) / 3 * 100, 100) // massimo 3h visualizzate
      };
    });
  }
}
