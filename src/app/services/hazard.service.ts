import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface HazardReport {
  id?: number;
  reporterName?: string;
  dangerType: string;
  description: string;
  location: string;
  mediaLink?: string;
  mediaPath?: string;
  status?: string;
  createdAt?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class HazardService {
  private apiUrl = 'http://localhost:3000/api/hazards';

  constructor(private http: HttpClient) { }

  submitReport(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/report`, formData);
  }

  getAllReports(): Observable<HazardReport[]> {
    return this.http.get<HazardReport[]>(`${this.apiUrl}/all`);
  }

  updateStatus(id: number, status: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/status`, { status });
  }
}
