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

  // Durata iniziale del timer (Pomodoro classico)
  readonly INITIAL_MINUTES = 25;

  timerMinutes: number = this.INITIAL_MINUTES;
  timerSeconds: number = 0;
  isRunning: boolean = false;
  private intervalId: any;

  tasks: Task[] = [];
  selectedTask: Task | null = null;

  // Contatore reale dei secondi trascorsi (serve per evitare errori quando si mette in pausa)
  elapsedSeconds: number = 0;

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

  // Carica le tasks dal backend
  loadTasks() {
    this.taskService.getTasks().subscribe({
      next: tasks => {
        this.tasks = tasks;
      },
      error: err => console.error('Errore caricamento tasks:', err)
    });
  }

  // Apre il modal per selezionare una task su cui lavorare
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

    // Parte un timer reale (countdown basato su elapsedSeconds)
    this.intervalId = setInterval(() => {
      this.elapsedSeconds++;

      const totalSeconds = this.INITIAL_MINUTES * 60;
      const remainingSeconds = Math.max(0, totalSeconds - this.elapsedSeconds);

      this.timerMinutes = Math.floor(remainingSeconds / 60);
      this.timerSeconds = remainingSeconds % 60;

      // Se il timer finisce, esegue la logica di completamento
      if (remainingSeconds === 0) {
        this.onTimerCompleted();
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
    this.elapsedSeconds = 0;
  }

  private onTimerCompleted() {
    this.pauseTimer();
    this.saveSession(true);
    this.showTimeFinishedAlert();
    this.resetTimer();
  }

  // Salva la sessione di studio nel backend
  private saveSession(completed: boolean) {
    if (!this.selectedTask) return;

    // Calcola i minuti reali studiati
    const minutesStudied = Math.round(this.elapsedSeconds / 60);

    /* IMPORTANTE:
       Salva la sessione SOLO se l'utente ha studiato almeno 5 minuti
       (evita salvataggi accidentali se si apre e chiude subito il timer) */
    if (minutesStudied < 5) return;

    this.taskService.addFocusSession({
      subject: this.selectedTask.subject || this.selectedTask.title,
      taskId: this.selectedTask._id,
      minutes: minutesStudied,
      completed,
      day: new Date().toISOString() // <-- day come stringa ISO
    }).subscribe();
  }

  // Mostra un alert quando il timer termina
  async showTimeFinishedAlert() {
    const alert = await this.alertCtrl.create({
      header: 'Tempo finito!',
      message: 'Sessione completata :)',
      buttons: ['OK']
    });
    await alert.present();
  }

  // Chiude la pagina focus; se il timer è attivo chiede conferma
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