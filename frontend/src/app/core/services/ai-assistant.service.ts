import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, AIChatRequest, ChatResponse } from '../models';

/**
 * AiAssistantService — communicates with Spring Boot CareerAI Assistant API.
 * Endpoint: POST /api/ai-assistant/chat
 */
@Injectable({
  providedIn: 'root'
})
export class AiAssistantService {
  private readonly apiUrl = `${environment.apiUrl}/ai-assistant`;

  constructor(private http: HttpClient) {}

  /**
   * Primary method: Sends chat message to Spring Boot AI Assistant endpoint with JWT authorization.
   * POST /api/ai-assistant/chat
   */
  public chat(message: string): Observable<ApiResponse<ChatResponse>> {
    const payload: AIChatRequest = { message: message.trim() };
    return this.http.post<ApiResponse<ChatResponse>>(`${this.apiUrl}/chat`, payload);
  }

  /**
   * Backwards-compatible answer getter returning observable of string response.
   */
  public getAnswer(question: string): Observable<string> {
    return this.chat(question).pipe(
      map(res => {
        if (res && res.data) {
          return res.data.response || res.data.message || 'I have analyzed your career profile.';
        }
        return 'CareerAI response received.';
      }),
      catchError(err => {
        const errorMsg = err?.error?.message || 'Unable to connect to the CareerAI Mentor service. Please check your network or try again in a moment.';
        return of(`⚠️ ${errorMsg}`);
      })
    );
  }

  /**
   * Generates the initial dynamic welcome message shown when the chat opens.
   */
  public getWelcomeMessage(studentName: string, careerGoal: string, readiness: number): string {
    const name = studentName ? studentName.split(' ')[0] : 'there';
    const goal = careerGoal || 'Java Full Stack Developer';
    const score = readiness !== undefined && readiness !== null ? readiness : 68;

    return `Hi ${name}! 👋 Welcome to your **CareerAI Personal Mentor**.

I am actively tracking your profile for **${goal}**.

**Your Quick Stats:**
• 🎯 Authoritative Readiness: **${score}%**
• 📊 Real-time skill gaps benchmarked
• 🚀 Personalized capstone recommendations & interview prep ready

What would you like to focus on today?`;
  }
}
