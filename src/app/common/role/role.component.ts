import { Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { RoleService, Role } from './role.service';

@Component({
  selector: 'app-role',
  standalone: true,
  imports: [TableModule],
  templateUrl: './role.component.html',
  styleUrl: './role.component.scss',
})
export class RoleComponent implements OnInit {
  roles: Role[] = [];
  constructor(private roleServices: RoleService) {}
  ngOnInit(): void {
    this.roleServices.getAllRoles().subscribe({
      next: (data) => {
        this.roles = data;
      },
      error: (err) => {
        // eslint-disable-next-line no-console
        console.error('Error al cargar roles', err);
      },
    });
  }
}
