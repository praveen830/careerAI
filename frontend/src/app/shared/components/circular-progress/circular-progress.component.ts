import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-circular-progress',
  template: `
    <div class="circular-progress-wrap" [style.width.px]="size" [style.height.px]="size">
      <svg [attr.width]="size" [attr.height]="size" viewBox="0 0 100 100">
        <!-- Background circle -->
        <circle
          class="progress-bg"
          cx="50"
          cy="50"
          [attr.r]="radius"
          [attr.stroke-width]="strokeWidth"
        />
        <!-- Animated stroke circle -->
        <circle
          class="progress-bar"
          [ngClass]="colorClass"
          cx="50"
          cy="50"
          [attr.r]="radius"
          [attr.stroke-width]="strokeWidth"
          [attr.stroke-dasharray]="circumference"
          [attr.stroke-dashoffset]="dashOffset"
        />
      </svg>
      <div class="progress-inner-label">
        <span class="value">{{ value }}%</span>
        <span class="subtext" *ngIf="label">{{ label }}</span>
      </div>
    </div>
  `,
  styles: [`
    .circular-progress-wrap {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
    svg {
      transform: rotate(-90deg);
      overflow: visible;
    }
    .progress-bg {
      fill: none;
      stroke: var(--bg-surface-elevated);
    }
    .progress-bar {
      fill: none;
      stroke-linecap: round;
      transition: stroke-dashoffset 1s ease-in-out;
    }
    .primary { stroke: var(--primary); filter: drop-shadow(0 0 6px rgba(99, 102, 241, 0.45)); }
    .success { stroke: var(--success); filter: drop-shadow(0 0 6px rgba(16, 185, 129, 0.45)); }
    .warning { stroke: var(--warning); filter: drop-shadow(0 0 6px rgba(245, 158, 11, 0.45)); }
    .cyan { stroke: var(--accent-cyan); filter: drop-shadow(0 0 6px rgba(6, 182, 212, 0.45)); }

    .progress-inner-label {
      position: absolute;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
    }
    .value {
      font-size: 1.35rem;
      font-weight: 800;
      color: var(--text-primary);
      line-height: 1;
    }
    .subtext {
      font-size: 0.7rem;
      color: var(--text-muted);
      margin-top: 2px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
  `]
})
export class CircularProgressComponent {
  @Input() value: number = 0;
  @Input() size: number = 100;
  @Input() strokeWidth: number = 8;
  @Input() label: string = '';
  @Input() colorClass: string = 'primary';

  get radius(): number {
    return 50 - this.strokeWidth / 2;
  }

  get circumference(): number {
    return 2 * Math.PI * this.radius;
  }

  get dashOffset(): number {
    const clamped = Math.max(0, Math.min(100, this.value));
    return this.circumference - (clamped / 100) * this.circumference;
  }
}
