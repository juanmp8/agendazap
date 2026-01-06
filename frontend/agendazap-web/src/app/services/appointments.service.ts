import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Appointment {
    id: string;
    date: string;
    durationMinutes: number;
    customerName: string;
}

@Injectable({
    providedIn: 'root'
})
export class AppointmentsService {

    private readonly apiUrl = 'http://localhost:5000';

    constructor(private http: HttpClient) { }

    getByDate(date: string): Observable<Appointment[]> {
        return this.http.get<Appointment[]>(
            `${this.apiUrl}/appointments?date=${date}`
        );
    }
}
