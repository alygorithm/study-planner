import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from './task.model';

export interface FocusSession {
  subject: string;
  minutes: number;
  completed: boolean;
  day?: string;
  taskId?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  // URL del backend per le tasks
  private baseUrl = 'https://study-planner-github-io.onrender.com/api/tasks';

  // URL del backend per le sessioni di focus
  private focusUrl = 'https://study-planner-github-io.onrender.com/api/focus-sessions';

  constructor(private http: HttpClient) {}

  // Recupera tutte le task dal backend
  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.baseUrl);
  }

  // Aggiunge una nuova task
  addTask(task: Task): Observable<Task> {
    return this.http.post<Task>(this.baseUrl, task);
  }

  // Elimina una task tramite ID
  deleteTask(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  // Aggiorna una task esistente
  updateTask(task: Task): Observable<Task> {
    return this.http.put<Task>(`${this.baseUrl}/${task._id}`, task);
  }

  // Aggiunge una sessione di studio al backend
  addFocusSession(session: FocusSession): Observable<FocusSession> {
    return this.http.post<FocusSession>(this.focusUrl, session);
  }

  // Recupera tutte le sessioni di studio
  getFocusSessions(): Observable<FocusSession[]> {
    return this.http.get<FocusSession[]>(this.focusUrl);
  }
}