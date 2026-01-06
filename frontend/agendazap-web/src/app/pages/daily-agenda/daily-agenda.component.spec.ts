import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyAgendaComponent } from './daily-agenda.component';

describe('DailyAgendaComponent', () => {
  let component: DailyAgendaComponent;
  let fixture: ComponentFixture<DailyAgendaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DailyAgendaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DailyAgendaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
