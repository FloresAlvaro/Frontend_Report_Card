import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

export interface Role {
  id: number;
  name: string;
  status: boolean;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000/roles';

  /**
   * Obtiene todos los roles del sistema
   * @returns Observable con array de roles
   */
  getAllRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(`${this.apiUrl}/all-status`).pipe(
      catchError((error) => {
        // eslint-disable-next-line no-console
        console.error('Error fetching roles:', error);
        return throwError(() => new Error('No se pudieron cargar los roles'));
      }),
    );
  }

  /**
   * Crea un nuevo rol
   * @param role - Datos del rol a crear
   * @returns Observable con el rol creado
   */
  createRole(role: Partial<Role>): Observable<Role> {
    return this.http.post<Role>(this.apiUrl, role).pipe(
      catchError((error) => {
        // eslint-disable-next-line no-console
        console.error('Error creating role:', error);
        return throwError(() => new Error('No se pudo crear el rol'));
      }),
    );
  }

  /**
   * Actualiza un rol existente
   * @param id - ID del rol a actualizar
   * @param role - Datos actualizados del rol
   * @returns Observable con el rol actualizado
   */
  updateRole(id: number, role: Partial<Role>): Observable<Role> {
    return this.http.put<Role>(`${this.apiUrl}/${id}`, role).pipe(
      catchError((error) => {
        // eslint-disable-next-line no-console
        console.error('Error updating role:', error);
        return throwError(() => new Error('No se pudo actualizar el rol'));
      }),
    );
  }

  /**
   * Elimina un rol
   * @param id - ID del rol a eliminar
   * @returns Observable void
   */
  deleteRole(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        // eslint-disable-next-line no-console
        console.error('Error deleting role:', error);
        return throwError(() => new Error('No se pudo eliminar el rol'));
      }),
    );
  }

  /**
   * Obtiene un rol específico por ID
   * @param id - ID del rol
   * @returns Observable con el rol
   */
  getRoleById(id: number): Observable<Role> {
    return this.http.get<Role>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        // eslint-disable-next-line no-console
        console.error('Error fetching role by ID:', error);
        return throwError(() => new Error('No se pudo cargar el rol'));
      }),
    );
  }

  /**
   * Obtiene solo los roles activos
   * @returns Observable con array de roles activos
   */
  getActiveRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(`${this.apiUrl}/active`).pipe(
      catchError((error) => {
        // eslint-disable-next-line no-console
        console.error('Error fetching active roles:', error);
        return throwError(() => new Error('No se pudieron cargar los roles activos'));
      }),
    );
  }
}
