
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IPost } from '../models/post.models';

@Injectable({
  providedIn: 'root'
})
export class Posts {

  private http = inject(HttpClient);

  private readonly URL = 'https://jsonplaceholder.typicode.com/posts';

  obtenerPosts() {
    return this.http.get<IPost[]>(this.URL);
  }

  crearPost(post: IPost) {
    return this.http.post<IPost>(this.URL, post);
  }

  actualizarPost(id: number, post: IPost) {
    return this.http.put<IPost>(`${this.URL}/${id}`, post);
  }

  eliminarPost(id: number) {
    return this.http.delete(`${this.URL}/${id}`);
  }
}
