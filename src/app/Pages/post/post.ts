
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Posts as PostService } from '../../services/posts';
import { Auth } from '../../services/auth';
import { IPost } from '../../models/post.models';

@Component({
  selector: 'app-post',
  imports: [FormsModule],
  templateUrl: './post.html',
  styleUrl: './post.css'
})
export class Post implements OnInit {

  private postsService = inject(PostService);
  private auth = inject(Auth);
  private router = inject(Router);

  posts: IPost[] = [];

  titulo = '';
  contenido = '';
  idEditar = 0;
  editando = false;
  cargando = true;

  ngOnInit() {
    this.obtenerPosts();
  }

  obtenerPosts() {
    this.cargando = true;

    this.postsService.obtenerPosts().subscribe({
      next: (data) => {
        this.posts = data;
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al cargar posts:', error);
        this.cargando = false;
      }
    });
  }

  crearPost() {

    if (this.titulo.trim() === '' || this.contenido.trim() === '') {
      alert('Completa todos los campos');
      return;
    }

    const nuevoPost: IPost = {
      id: 0,
      userId: 1,
      title: this.titulo,
      body: this.contenido
    };

    this.postsService.crearPost(nuevoPost).subscribe({
      next: (data) => {
        // Usamos un ID local diferente para cada post nuevo
        data.id = -1;

        for (const post of this.posts) {
          if (post.id <= data.id) {
            data.id = post.id - 1;
          }
        }

        this.posts.unshift(data);
        this.cancelar();
        alert('Publicación creada correctamente');
      },
      error: (error) => {
        console.error('Error al crear post:', error);
        alert('No se pudo crear la publicación');
      }
    });
  }

  editarPost(post: IPost) {
    this.idEditar = post.id;
    this.titulo = post.title;
    this.contenido = post.body;
    this.editando = true;
  }

  actualizarPost() {

    if (this.titulo.trim() === '' || this.contenido.trim() === '') {
      alert('Completa todos los campos');
      return;
    }

    const postActualizado: IPost = {
      id: this.idEditar,
      userId: 1,
      title: this.titulo,
      body: this.contenido
    };

    // Los posts nuevos solo existen en nuestra lista
    if (this.idEditar < 0) {
      this.guardarCambios(postActualizado);
      return;
    }

    this.postsService.actualizarPost(this.idEditar, postActualizado).subscribe({
      next: () => {
        this.guardarCambios(postActualizado);
      },
      error: (error) => {
        console.error('Error al actualizar post:', error);
        alert('No se pudo actualizar la publicación');
      }
    });
  }

  guardarCambios(postActualizado: IPost) {
    for (const post of this.posts) {
      if (post.id === this.idEditar) {
        post.title = postActualizado.title;
        post.body = postActualizado.body;
      }
    }

    this.cancelar();
    alert('Publicación actualizada correctamente');
  }

  eliminarPost(id: number) {

    if (confirm('¿Estás seguro de que deseas eliminar esta publicación?')) {

      // Los posts nuevos solo existen en nuestra lista
      if (id < 0) {
        this.quitarPost(id);
        return;
      }

      this.postsService.eliminarPost(id).subscribe({
        next: () => {
          this.quitarPost(id);
        },
        error: (error) => {
          console.error('Error al eliminar post:', error);
          alert('No se pudo eliminar la publicación');
        }
      });
    }
  }

  quitarPost(id: number) {
    this.posts = this.posts.filter(post => post.id !== id);

    if (this.editando && this.idEditar === id) {
      this.cancelar();
    }

    alert('Publicación eliminada correctamente');
  }

  cancelar() {
    this.titulo = '';
    this.contenido = '';
    this.idEditar = 0;
    this.editando = false;
  }

  cerrarSesion() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
