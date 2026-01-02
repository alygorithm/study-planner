import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-planner',
  templateUrl: './planner.page.html',
  styleUrls: ['./planner.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})

export class PlannerPage implements OnInit {

  days: { date: Date, isToday: boolean }[] = [];
  selectedDay: { date: Date, isToday: boolean } | null = null;

  // Tab 'attiva' nella barra di navigazione 
  activeTab: string = 'planner';
  
  // Ogni giorno ha un array di task (esempio)
  tasks: { [key: string]: string[] } = {
    [new Date().toDateString()]: ['Compito matematica', 'Lezione storia', 'Progetto informatica']
  };

  constructor(private router: Router) {}

  ngOnInit() {
    this.generateDays();
  }

  generateDays() {
    const today = new Date();
    const totalDays = 30; // 30 giorni da mostrare
    for (let i = 0; i < totalDays; i++) {
      const date = new Date();
      date.setDate(today.getDate() + i);
      this.days.push({ date, isToday: date.toDateString() === today.toDateString() });
    }

    // Seleziona giorno corrente di default
    this.selectedDay = this.days.find(d => d.isToday) || this.days[0];
  }

  selectDay(day: { date: Date, isToday: boolean }) {
    this.selectedDay = day;
  }

  // Per la barra di navigazione
  navigate(page: string){
    console.log('Naviga verso:', page);
    if(page == 'planner') this.router.navigate(['/planner']);
  } 
}
