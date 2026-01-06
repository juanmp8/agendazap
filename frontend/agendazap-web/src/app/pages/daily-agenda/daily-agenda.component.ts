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
  editingId: string | null = null;
  loading = true;
  submitting = false;
  errorMessage = '';
  form!: FormGroup;
  appointmentToDelete: Appointment | null = null;

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


  saveAppointment(): void {
    if (this.form.invalid) return;

    this.submitting = true;
    this.errorMessage = '';

    const { date, time, durationMinutes, customerName, customerPhone } =
      this.form.value;

    const localDateTime = new Date(`${date}T${time}`);
    const payload = {
      date: localDateTime.toISOString(),
      durationMinutes,
      customerName,
      customerPhone
    };

    const request$ = this.editingId
      ? this.appointmentsService.update(this.editingId, payload)
      : this.appointmentsService.create(payload);

    request$.subscribe({
      next: () => {
        this.form.reset({ durationMinutes: 30 });
        this.editingId = null;
        this.loadToday();
        this.submitting = false;
      },
      error: err => {
        this.errorMessage =
          err.status === 409
            ? 'Horário já ocupado.'
            : 'Erro ao salvar agendamento.';
        this.submitting = false;
      }
    });
  }


  editAppointment(a: Appointment): void {
    this.editingId = a.id;

    const localDate = new Date(a.date);

    this.form.patchValue({
      date: localDate.toLocaleDateString('en-CA'),
      time: localDate.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit'
      }),
      durationMinutes: a.durationMinutes,
      customerName: a.customerName,
      customerPhone: a.customerPhone
    });
  }

  deleteAppointment(id: string): void {
    if (!confirm('Deseja cancelar este agendamento?')) return;

    this.appointmentsService.delete(id).subscribe(() => {
      this.loadToday();
    });
  }

  formatTime(utcDate: string): string {
    const date = new Date(utcDate);
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  openDeleteModal(a: Appointment): void {
    this.appointmentToDelete = a;
  }

  closeDeleteModal(): void {
    this.appointmentToDelete = null;
  }

  confirmDelete(): void {
    if (!this.appointmentToDelete) return;

    this.appointmentsService
      .delete(this.appointmentToDelete.id)
      .subscribe(() => {
        this.closeDeleteModal();
        this.loadToday();
      });
  }


}
