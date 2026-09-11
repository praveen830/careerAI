import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  icon: string;
  duration: number;
}

/**
 * ToastService — centralized notification system.
 *
 * Usage in any component:
 *   constructor(private toast: ToastService) {}
 *   this.toast.success('Profile saved!');
 *   this.toast.error('Failed to load data.');
 *   this.toast.info('Skill added to roadmap.');
 */
@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastsSubject = new BehaviorSubject<Toast[]>([]);
  public toasts$ = this.toastsSubject.asObservable();

  private getIcon(type: ToastType): string {
    const icons: Record<ToastType, string> = {
      success: '✓',
      error: '✕',
      info: 'ℹ',
      warning: '⚠'
    };
    return icons[type];
  }

  private show(message: string, type: ToastType, duration = 3500): void {
    const toast: Toast = {
      id: Date.now().toString(),
      message,
      type,
      icon: this.getIcon(type),
      duration
    };

    const current = this.toastsSubject.value;
    this.toastsSubject.next([...current, toast]);

    setTimeout(() => this.remove(toast.id), duration);
  }

  public success(message: string, duration?: number): void {
    this.show(message, 'success', duration);
  }

  public error(message: string, duration?: number): void {
    this.show(message, 'error', duration ?? 5000);
  }

  public info(message: string, duration?: number): void {
    this.show(message, 'info', duration);
  }

  public warning(message: string, duration?: number): void {
    this.show(message, 'warning', duration);
  }

  public remove(id: string): void {
    this.toastsSubject.next(
      this.toastsSubject.value.filter(t => t.id !== id)
    );
  }

  public clear(): void {
    this.toastsSubject.next([]);
  }
}
