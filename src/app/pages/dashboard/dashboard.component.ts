import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { LoginResponse } from '../../models/auth.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  usuario: LoginResponse | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.usuarioActual$.subscribe(u => this.usuario = u);
  }
}
