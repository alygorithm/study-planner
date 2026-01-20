import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TaskService, FocusSession } from '../planner/task.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [IonicModule, CommonModule],
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss']
})
export class ProfilePage implements OnInit {
  activeTab: string = 'profile';

  sessions: FocusSession[] = [];
  isLoadingSessions = true;

  constructor(
    private router: Router,
    private taskService: TaskService
  ) {}

  navigate(page: string) {
    this.activeTab = page;
    this.router.navigate(['/' + page]);
  }

  user = {
    name: 'Alina Rosi',
    email: 'alina@example.com'
  };

  stats = {
    completedTasks: 42,
    studyHours: 120,
    completionPercent: 85
  };

  ngOnInit() {
    this.loadSessions();
  }

  loadSessions() {
    this.taskService.getFocusSessions().subscribe({
      next: sessions => {
        this.sessions = sessions.sort((a, b) => new Date(b.day || '').getTime() - new Date(a.day || '').getTime());
        this.isLoadingSessions = false;
      },
      error: err => {
        console.error(err);
        this.isLoadingSessions = false;
      }
    });
  }
}
