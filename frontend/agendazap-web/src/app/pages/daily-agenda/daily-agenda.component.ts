import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppointmentsService, Appointment } from '../../services/appointments.service';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-daily-agenda',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './daily-agenda.component.html'
})
export class DailyAgendaComponent implements OnInit {

  appointments: Appointment[] = [];
  loading = true;
  submitting = false;
  errorMessage = '';
  form!: FormGroup;

  constructor(private appointmentsService: AppointmentsService, private fb: FormBuilder) { }

  ngOnInit(): void {
    const today = new Date().toLocaleDateString('en-CA');

    this.form = this.fb.group({
      date: ['', Validators.required],
      time: ['', Validators.required],
      durationMinutes: [30, [Validators.required, Validators.min(1)]],
      customerName: ['', Validators.required],
      customerPhone: ['', Validators.required]
    });

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

    this.loadToday();
  }

  loadToday(): void {
    const today = new Date().toLocaleDateString('en-CA');

    this.appointmentsService
      .getByDate(today)
      .subscribe(data => {
        this.appointments = data;
        this.loading = false;
      });
  }


  createAppointment(): void {
    if (this.form.invalid) return;

    this.submitting = true;
    this.errorMessage = '';

    const { date, time, durationMinutes, customerName, customerPhone } =
      this.form.value;

    // Combinar data + hora (local)
    const localDateTime = new Date(`${date}T${time}`);

    const payload = {
      date: localDateTime.toISOString(), // envia UTC
      durationMinutes,
      customerName,
      customerPhone
    };

    this.appointmentsService.create(payload).subscribe({
      next: () => {
        this.form.reset({ durationMinutes: 30 });
        this.loadToday(); // recarrega agenda
        this.submitting = false;
      },
      error: err => {
        if (err.status === 409) {
          this.errorMessage = 'Horário já ocupado.';
        } else {
          this.errorMessage = 'Erro ao criar agendamento.';
        }
        this.submitting = false;
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
