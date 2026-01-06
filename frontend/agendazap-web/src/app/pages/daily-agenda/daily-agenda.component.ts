import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppointmentsService, Appointment } from '../../services/appointments.service';

@Component({
  selector: 'app-daily-agenda',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './daily-agenda.component.html'
})
export class DailyAgendaComponent implements OnInit {

  appointments: Appointment[] = [];
  loading = true;

  constructor(private appointmentsService: AppointmentsService) { }

  ngOnInit(): void {
    const today = new Date().toLocaleDateString('en-CA');

    this.appointmentsService
      .getByDate(today)
      .subscribe({
        next: data => {
          this.appointments = data;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        }
      });
  }

  formatTime(utcDate: string): string {
    const date = new Date(utcDate);
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
