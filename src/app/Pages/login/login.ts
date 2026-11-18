
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  private fb = inject(FormBuilder);
  private auth = inject(Auth);
  private router = inject(Router);

  error = signal('');
  loading = signal(false);

  formulario = this.fb.nonNullable.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(3)]]
  });

  iniciarSesion() {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.error.set('');
    this.loading.set(true);

    const { username, password } = this.formulario.getRawValue();

    this.auth.login(username, password).subscribe({
      next: (res) => {
        this.auth.guardarToken(res.token);
        this.loading.set(false);
        this.router.navigate(['/post']);
      },
     error: (error) => {
  console.error('Error del login:', error);
  this.loading.set(false);
  this.error.set('Usuario o contraseña incorrectos');
}
    });
  }
}
