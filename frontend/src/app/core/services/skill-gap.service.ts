import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, SkillGapRequest, SkillGapResponse } from '../models';

@Injectable({
  providedIn: 'root'
})
export class SkillGapService {
  private readonly apiUrl = `${environment.apiUrl}/skill-gap`;

  constructor(private http: HttpClient) {}

  /**
   * GET /api/skill-gap
   * Fetches the current authenticated student's skill gap analysis
   */
  public getSkillGap(): Observable<ApiResponse<SkillGapResponse>> {
    return this.http.get<ApiResponse<SkillGapResponse>>(this.apiUrl);
  }

  /**
   * POST /api/skill-gap/analyze
   * Triggers algorithmic re-analysis for the current authenticated student
   */
  public analyzeSkillGap(careerGoal?: string): Observable<ApiResponse<SkillGapResponse>> {
    const payload: SkillGapRequest = careerGoal ? { careerGoal } : {};
    return this.http.post<ApiResponse<SkillGapResponse>>(`${this.apiUrl}/analyze`, payload);
  }
}
