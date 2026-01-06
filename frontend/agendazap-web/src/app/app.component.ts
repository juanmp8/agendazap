import { Component } from '@angular/core';
import { DailyAgendaComponent } from './pages/daily-agenda/daily-agenda.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [DailyAgendaComponent],
  template: `<app-daily-agenda />`
})
export class AppComponent { }