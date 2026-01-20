import { Component, Input } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Task } from '../../planner/task.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-focus-select-modal',
  templateUrl: './focus-select-modal.component.html',
  standalone: true,
  styleUrls: ['./focus-select-modal.component.scss'],
  imports: [IonicModule, CommonModule, FormsModule]
})
export class FocusSelectModalComponent {
  @Input() tasks: Task[] = [];
  selectedTask: Task | null = null;

  constructor(private modalCtrl: ModalController) {}

  // Conferma la selezione e chiude il modal restituendo il task selezionato
  confirm() {
    this.modalCtrl.dismiss(this.selectedTask);
  }

  // Chiude il modal senza restituire nulla
  close() {
    this.modalCtrl.dismiss();
  }
}