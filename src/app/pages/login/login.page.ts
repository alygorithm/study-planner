import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  standalone: true,
  imports: [IonicModule, FormsModule]
})
export class LoginPage {
  username = '';
  password = '';

  constructor(private router: Router) {}

  login() {
    // Per ora login "fittizio", accetta qualsiasi username/password
    console.log('Login:', this.username, this.password);
    this.router.navigate(['/planner']);
  }
}
