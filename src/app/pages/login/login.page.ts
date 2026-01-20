import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule]
})
export class LoginPage {
  email = '';
  password = '';

  constructor(private router: Router) {}

  // Esegue un login "simulato": se email e password sono presenti, naviga al planner
  login() {
    if(this.email && this.password) {
      console.log('Login effettuato con: ', this.email, this.password);
      this.router.navigate(['/planner']);
    } else {
      console.log('Dati mancanti!');
    }
  }
}