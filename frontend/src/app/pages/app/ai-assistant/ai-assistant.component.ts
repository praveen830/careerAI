import { Component, OnInit, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { AiAssistantService } from '../../../core/services/ai-assistant.service';
import { StudentService } from '../../../core/services/student.service';
import { AuthService } from '../../../core/services/auth.service';
import { ChatMessage, StudentProfile } from '../../../core/models';

@Component({
  selector: 'app-ai-assistant',
  template: `
    <div class="ai-assistant-page">
      <!-- Top Title Header -->
      <section class="assistant-header glass-card">
        <div class="assistant-branding">
          <div class="ai-avatar-badge">
            <app-icon name="sparkles" [size]="24"></app-icon>
          </div>
          <div>
            <div class="title-status-row">
              <h1>AI Career Assistant</h1>
              <span class="badge badge-success">● Active Mentor</span>
            </div>
            <p class="text-secondary text-sm">
              Your 24/7 personal guide to becoming job-ready. Context-aware of your profile ({{ profile?.careerGoal || 'Career Goal' }}).
            </p>
          </div>
        </div>

        <button class="btn btn-ghost btn-sm" (click)="resetChat()">
          Clear Conversation
        </button>
      </section>

      <!-- Quick Action Prompt Chips -->
      <section class="prompts-bar">
        <span class="text-xs text-muted font-semibold">QUICK PROMPTS:</span>
        <div class="prompt-chips">
          <button
            class="prompt-btn"
            *ngFor="let p of quickPrompts"
            (click)="selectPrompt(p)"
            [disabled]="isTyping"
          >
            {{ p }}
          </button>
        </div>
      </section>

      <!-- Main Chat Area -->
      <section class="chat-container glass-card">
        <div class="messages-scroll" #messagesContainer>
          <div
            class="message-bubble-wrapper"
            *ngFor="let msg of messages"
            [class.user-align]="msg.sender === 'user'"
            [class.assistant-align]="msg.sender === 'assistant'"
          >
            <!-- Avatar icon -->
            <div class="sender-avatar" [class.user]="msg.sender === 'user'" [class.ai]="msg.sender === 'assistant'">
              <span *ngIf="msg.sender === 'user'">{{ (profile?.fullName || 'You').charAt(0) }}</span>
              <app-icon *ngIf="msg.sender === 'assistant'" name="sparkles" [size]="16"></app-icon>
            </div>

            <!-- Message bubble -->
            <div class="message-bubble" [class.user-bubble]="msg.sender === 'user'" [class.ai-bubble]="msg.sender === 'assistant'">
              <div class="bubble-header">
                <span class="sender-name font-semibold text-xs">
                  {{ msg.sender === 'user' ? (profile?.fullName || 'You') : 'CareerAI Mentor' }}
                </span>
                <span class="timestamp text-xs text-muted">
                  {{ msg.timestamp | date:'shortTime' }}
                </span>
              </div>

              <!-- Message body with simple line formatting -->
              <div class="message-body" [innerHTML]="formatMessage(msg.text)"></div>

              <!-- Copy action button for Assistant -->
              <div class="bubble-actions" *ngIf="msg.sender === 'assistant'">
                <button class="action-icon-btn" (click)="copyText(msg.text)" title="Copy message">
                  <app-icon name="copy" [size]="13"></app-icon>
                  <span class="text-xs">Copy</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Typing Indicator -->
          <div class="message-bubble-wrapper assistant-align" *ngIf="isTyping">
            <div class="sender-avatar ai">
              <app-icon name="sparkles" [size]="16"></app-icon>
            </div>
            <div class="message-bubble ai-bubble typing-bubble">
              <div class="typing-dots">
                <span class="dot"></span>
                <span class="dot"></span>
                <span class="dot"></span>
              </div>
              <span class="text-xs text-muted" style="margin-left: 0.5rem;">Analyzing career profile & preparing guidance...</span>
            </div>
          </div>
        </div>

        <!-- Chat Input Bar -->
        <div class="chat-input-area">
          <form (ngSubmit)="sendMessage()" class="input-form">
            <input
              type="text"
              class="form-control chat-input"
              [(ngModel)]="userInput"
              name="chatMessage"
              placeholder="Ask anything about your career, interview prep, or code..."
              [disabled]="isTyping"
              autocomplete="off"
            />
            <button type="submit" class="btn btn-primary send-btn" [disabled]="!userInput.trim() || isTyping">
              <app-icon name="send" [size]="16"></app-icon>
              <span>Send</span>
            </button>
          </form>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .ai-assistant-page {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      max-width: 1080px;
      margin: 0 auto;
      height: calc(100vh - 120px);
    }
    .assistant-header {
      padding: 1.25rem 2rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-shrink: 0;
    }
    .assistant-branding {
      display: flex;
      align-items: center;
      gap: 1.25rem;
    }
    .ai-avatar-badge {
      width: 44px;
      height: 44px;
      border-radius: var(--radius-md);
      background: var(--gradient-primary);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      box-shadow: 0 0 15px rgba(99, 102, 241, 0.5);
    }
    .title-status-row {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .title-status-row h1 {
      font-size: 1.45rem;
      margin: 0;
    }

    /* Prompt Chips */
    .prompts-bar {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      flex-shrink: 0;
      overflow-x: auto;
      padding-bottom: 0.25rem;
    }
    .prompt-chips {
      display: flex;
      gap: 0.5rem;
      flex-wrap: nowrap;
    }
    .prompt-btn {
      padding: 0.4rem 0.85rem;
      border-radius: var(--radius-full);
      font-size: 0.8125rem;
      background: var(--bg-surface);
      border: 1px solid var(--border-color);
      color: var(--text-secondary);
      white-space: nowrap;
      transition: all var(--transition-fast);
      cursor: pointer;
    }
    .prompt-btn:hover:not(:disabled) {
      background: var(--primary-light);
      border-color: var(--primary);
      color: var(--primary);
    }

    /* Chat Container */
    .chat-container {
      flex: 1;
      display: flex;
      flex-direction: column;
      background: var(--bg-surface);
      border: 1px solid var(--border-color);
      overflow: hidden;
      min-height: 0;
    }
    .messages-scroll {
      flex: 1;
      overflow-y: auto;
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }
    .message-bubble-wrapper {
      display: flex;
      gap: 0.85rem;
      max-width: 80%;
    }
    .message-bubble-wrapper.user-align {
      margin-left: auto;
      flex-direction: row-reverse;
    }
    .message-bubble-wrapper.assistant-align {
      margin-right: auto;
    }
    .sender-avatar {
      width: 34px;
      height: 34px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      font-weight: 700;
      font-size: 0.85rem;
    }
    .sender-avatar.user {
      background: var(--accent-cyan-light);
      color: var(--accent-cyan);
      border: 1px solid var(--accent-cyan);
    }
    .sender-avatar.ai {
      background: var(--gradient-primary);
      color: #fff;
      box-shadow: 0 0 10px rgba(99, 102, 241, 0.4);
    }
    .message-bubble {
      padding: 1rem 1.25rem;
      border-radius: var(--radius-lg);
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      line-height: 1.55;
      font-size: 0.925rem;
    }
    .message-bubble.user-bubble {
      background: var(--primary);
      color: #fff;
      border-bottom-right-radius: 4px;
    }
    .message-bubble.ai-bubble {
      background: var(--bg-surface-elevated);
      color: var(--text-primary);
      border: 1px solid var(--border-color);
      border-bottom-left-radius: 4px;
    }
    .bubble-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      padding-bottom: 0.25rem;
      margin-bottom: 0.25rem;
    }
    .message-body {
      word-break: break-word;
    }
    .message-body p {
      margin-bottom: 0.5rem;
    }
    .bubble-actions {
      display: flex;
      justify-content: flex-end;
      margin-top: 0.25rem;
    }
    .action-icon-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      padding: 0.2rem 0.5rem;
      border-radius: var(--radius-sm);
      color: var(--text-muted);
      cursor: pointer;
      font-size: 0.75rem;
    }
    .action-icon-btn:hover {
      color: var(--primary);
      background: var(--primary-light);
    }

    /* Typing Dots */
    .typing-bubble {
      display: flex;
      flex-direction: row;
      align-items: center;
    }
    .typing-dots {
      display: flex;
      gap: 4px;
    }
    .dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: var(--primary);
      animation: typingPulse 1.4s infinite;
    }
    .dot:nth-child(2) { animation-delay: 0.2s; }
    .dot:nth-child(3) { animation-delay: 0.4s; }

    @keyframes typingPulse {
      0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
      30% { transform: translateY(-4px); opacity: 1; }
    }

    /* Chat Input Area */
    .chat-input-area {
      padding: 1rem 1.5rem;
      border-top: 1px solid var(--border-subtle);
      background: var(--bg-surface);
    }
    .input-form {
      display: flex;
      gap: 0.75rem;
    }
    .chat-input {
      flex: 1;
      padding: 0.85rem 1.25rem;
      font-size: 0.95rem;
    }
    .send-btn {
      padding: 0.85rem 1.5rem;
    }

    @media (max-width: 768px) {
      .message-bubble-wrapper { max-width: 92%; }
    }
  `]
})
export class AiAssistantComponent implements OnInit, AfterViewChecked {
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;

  public profile: StudentProfile | null = null;
  public messages: ChatMessage[] = [];
  public userInput: string = '';
  public isTyping: boolean = false;

  public quickPrompts: string[] = [
    'What should I learn next?',
    'Explain my skill gaps',
    'Am I ready for my career goal?',
    'Give me a 7 day learning plan',
    'Suggest a project',
    'Prepare me for interviews'
  ];

  constructor(
    private aiService: AiAssistantService,
    private studentService: StudentService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // If not authenticated, ensure active demo session so AI Assistant chat is immediately functional
    if (!this.authService.isAuthenticated()) {
      this.authService.login('praveen.dev@college.edu', 'CareerPass2026!').subscribe({
        next: () => {
          this.profile = this.studentService.currentProfile;
        },
        error: () => {}
      });
    }

    this.profile = this.studentService.currentProfile;
    const name = this.profile?.fullName || 'Student';
    const goal = this.profile?.careerGoal || 'Java Full Stack Developer';
    const readiness = this.profile?.readinessScore !== undefined && this.profile?.readinessScore !== null
      ? this.profile.readinessScore
      : 68;

    this.messages = [
      {
        id: 'm-0',
        sender: 'assistant',
        text: this.aiService.getWelcomeMessage(name, goal, readiness),
        timestamp: new Date()
      }
    ];
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  public selectPrompt(prompt: string): void {
    if (this.isTyping) return;
    this.userInput = prompt;
    this.sendMessage();
  }

  public sendMessage(): void {
    const text = this.userInput.trim();
    if (!text || this.isTyping) return;

    // Add user message
    this.messages.push({
      id: 'm-' + Date.now(),
      sender: 'user',
      text,
      timestamp: new Date()
    });

    this.userInput = '';
    this.isTyping = true;

    // Ensure user is authenticated before sending
    if (!this.authService.isAuthenticated()) {
      this.authService.login('praveen.dev@college.edu', 'CareerPass2026!').subscribe({
        next: () => this.executeChat(text),
        error: () => this.executeChat(text)
      });
    } else {
      this.executeChat(text);
    }
  }

  private executeChat(text: string): void {
    // Call real Spring Boot AI Assistant service (POST /api/ai-assistant/chat)
    this.aiService.chat(text).subscribe({
      next: (res) => {
        const reply = res.data?.response || res.data?.message || 'I have analyzed your career path.';
        this.messages.push({
          id: 'm-' + Date.now(),
          sender: 'assistant',
          text: reply,
          timestamp: new Date()
        });

        if (res.data?.suggestedPrompts && res.data.suggestedPrompts.length > 0) {
          this.quickPrompts = res.data.suggestedPrompts;
        }
        this.isTyping = false;
      },
      error: (err) => {
        console.error('CareerAI Assistant error:', err);
        let errorReply = 'I encountered an issue analyzing your career profile. Please try again in a moment.';

        if (err.status === 401) {
          errorReply = 'Please log in to your student account to get personalized AI mentoring.';
        } else if (err.status === 400) {
          errorReply = 'Invalid message format. Please ask a clear career question.';
        } else if (err.status === 403) {
          errorReply = 'Access denied. You do not have permission to access this resource.';
        } else if (err.error?.message) {
          errorReply = err.error.message;
        }

        this.messages.push({
          id: 'm-' + Date.now(),
          sender: 'assistant',
          text: `⚠️ **Notice:** ${errorReply}`,
          timestamp: new Date()
        });
        this.isTyping = false;
      }
    });
  }

  public formatMessage(rawText: string): string {
    if (!rawText) return '';
    let formatted = rawText
      .replace(/### (.*?)(?:\n|$)/g, '<h4 style="margin: 0.6rem 0 0.25rem; color: var(--primary); font-weight: 600;">$1</h4>')
      .replace(/## (.*?)(?:\n|$)/g, '<h3 style="margin: 0.75rem 0 0.35rem; font-weight: 700;">$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/`([^`]+)`/g, '<code style="background: rgba(255,255,255,0.08); padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 0.85em;">$1</code>')
      .replace(/\n/g, '<br/>');
    return formatted;
  }

  public copyText(text: string): void {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(text);
    }
  }

  public resetChat(): void {
    this.ngOnInit();
  }

  private scrollToBottom(): void {
    try {
      if (this.messagesContainer?.nativeElement) {
        this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
      }
    } catch (err) {}
  }
}
