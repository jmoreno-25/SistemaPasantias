import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-docente-rubricas',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-header">
      <h1>Rúbricas de Evaluación</h1>
      <p>Crear y gestionar rúbricas para evaluar desempeño</p>
    </div>
    <div class="placeholder-card">
      <span class="material-icons">grading</span>
      <p>Módulo de rúbricas en desarrollo</p>
    </div>
  `,
  styles: [`
    .page-header { margin-bottom: 24px; }
    .page-header h1 { font-size: 1.6rem; color: #1a3050; margin: 0; }
    .page-header p { color: #666; margin: 4px 0 0; }
    .placeholder-card {
      background: #fff; border-radius: 12px; padding: 48px; text-align: center;
      box-shadow: 0 2px 8px rgba(0,0,0,0.06);
    }
    .placeholder-card .material-icons { font-size: 48px; color: #ccc; }
    .placeholder-card p { color: #888; margin-top: 12px; }
  `]
})
export class DocenteRubricasComponent {}
