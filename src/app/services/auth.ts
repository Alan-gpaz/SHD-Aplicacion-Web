
import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class Auth {

  private http = inject(HttpClient);

  private readonly URL = 'https://fakestoreapi.com/auth/login';

  private token = signal<string | null>(
    localStorage.getItem('fakestore_token')
  );

  isAuthenticated = computed(() => !!this.token());

  login(username: string, password: string) {
    return this.http.post<{ token: string }>(this.URL, {
      username,
      password
    });
  }

  guardarToken(token: string) {
    localStorage.setItem('fakestore_token', token);
    this.token.set(token);
  }

  logout() {
    localStorage.removeItem('fakestore_token');
    this.token.set(null);
  }
}
