import { Component, OnDestroy, OnInit } from '@angular/core';
import { IonicModule, AlertController, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TaskService } from '../planner/task.service';
import { Task } from '../planner/task.model';
import { FocusSelectModalComponent } from './modals/focus-select-modal.component';

@Component({
  selector: 'app-focus',
  templateUrl: './focus.page.html',
  styleUrls: ['./focus.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class FocusPage implements OnInit, OnDestroy {

  readonly INITIAL_MINUTES = 25;

  timerMinutes: number = this.INITIAL_MINUTES;
  timerSeconds: number = 0;
  isRunning: boolean = false;
  private intervalId: any;

  tasks: Task[] = [];
  selectedTask: Task | null = null;

  constructor(
    private router: Router,
    private alertCtrl: AlertController,
    private taskService: TaskService,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    this.loadTasks();
  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
  }

  // ---- TASK ----
  loadTasks() {
    this.taskService.getTasks().subscribe({
      next: tasks => {
        this.tasks = tasks;
        console.log('Tasks caricate', tasks);
      },
      error: err => console.error('Errore caricamento tasks:', err)
    });
  }

  async openTaskModal() {
    const modal = await this.modalCtrl.create({
      component: FocusSelectModalComponent,
      componentProps: { tasks: this.tasks }
    });

    modal.onDidDismiss().then(result => {
      if (result.data) {
        this.selectedTask = result.data;
        this.startTimer();
      }
    });

    await modal.present();
  }

  // ---- TIMER ----
  startTimer() {
    if (!this.selectedTask || this.isRunning) return;

    this.isRunning = true;
    this.intervalId = setInterval(() => {
      if (this.timerSeconds === 0) {
        if (this.timerMinutes === 0) {
          this.onTimerCompleted();
          return;
        }
        this.timerMinutes--;
        this.timerSeconds = 59;
      } else {
        this.timerSeconds--;
      }
    }, 1000);
  }

  pauseTimer() {
    this.isRunning = false;
    clearInterval(this.intervalId);
  }

  resetTimer() {
    this.pauseTimer();
    this.timerMinutes = this.INITIAL_MINUTES;
    this.timerSeconds = 0;
  }

  private onTimerCompleted() {
    this.pauseTimer();
    this.saveSession(true);
    this.showTimeFinishedAlert();
    this.resetTimer();
  }

  private saveSession(completed: boolean) {
    if (!this.selectedTask) return;

    const minutesStudied = this.INITIAL_MINUTES - (this.timerMinutes + this.timerSeconds / 60);
    if (minutesStudied <= 0) return;

    this.taskService.addFocusSession({
      subject: this.selectedTask.title,
      minutes: Math.round(minutesStudied),
      completed,
      day: new Date()
    }).subscribe();
  }

  // ---- ALERT ----
  async showTimeFinishedAlert() {
    const alert = await this.alertCtrl.create({
      header: 'Tempo finito!',
      message: 'Sessione completata :)',
      buttons: ['OK']
    });
    await alert.present();
  }

  async closeFocus() {
    if (this.isRunning) {
      const alert = await this.alertCtrl.create({
        header: 'Timer attivo!',
        message: 'Vuoi uscire e salvare i minuti fatti finora?',
        cssClass: 'custom-alert',
        buttons: [
          { text: 'Annulla', role: 'cancel', cssClass: 'cancel-btn' },
          { text: 'Esci', role: 'destructive', cssClass: 'exit-btn', handler: () => {
              this.pauseTimer();
              this.saveSession(false);
              this.router.navigate(['/planner']);
            } 
          }
        ]
      });
      await alert.present();

    } else {
      this.router.navigate(['/planner']);
    }
  }
}
