import { Component, Input } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Task } from '../planner.page';

@Component({
    selector: 'app-add-task-modal',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Aggiungi Task</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="close()">Chiudi</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-item>
        <ion-label position="stacked">Titolo</ion-label>
        <ion-input [(ngModel)]="taskTitle"></ion-input>
      </ion-item>

      <ion-item>
        <ion-label position="stacked">Descrizione</ion-label>
        <ion-textarea [(ngModel)]="taskDescription"></ion-textarea>
      </ion-item>

      <ion-item>
        <ion-label position="stacked">Orario</ion-label>
        <ion-datetime display-format="HH:mm" picker-format="HH:mm" [(ngModel)]="taskTime"></ion-datetime>
      </ion-item>

      <ion-button expand="full" class="ion-margin-top" (click)="saveTask()">Salva</ion-button>
    </ion-content>
  `,
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})

export class AddTaskModal {
    @Input() day?: Date;

    taskTitle = '';
    taskDescription = '';
    taskTime = '';

    constructor(private modalCtrl: ModalController){}

    saveTask() {
        if(!this.taskTitle.trim() || !this.day) return;

        const newTask: Task = {
            title: this.taskTitle.trim(),
            description: this.taskDescription.trim(),
            time: this.taskTime
        };

        this.modalCtrl.dismiss(newTask);
    }

    close(){
        this.modalCtrl.dismiss();
    }
}