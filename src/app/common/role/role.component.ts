import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { RoleService, Role } from './role.service';

@Component({
  selector: 'app-role',
  standalone: true,
  imports: [
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    TagModule,
    ConfirmDialogModule,
    ToastModule,
    ReactiveFormsModule,
  ],
  templateUrl: './role.component.html',
  styleUrl: './role.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConfirmationService, MessageService],
})
export class RoleComponent implements OnInit {
  private readonly roleService = inject(RoleService);
  private readonly fb = inject(FormBuilder);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly messageService = inject(MessageService);

  // Signals for reactive state management
  readonly roles = signal<Role[]>([]);
  readonly loading = signal<boolean>(false);
  readonly showCreateDialog = signal<boolean>(false);
  readonly showEditDialog = signal<boolean>(false);
  readonly selectedRole = signal<Role | null>(null);

  // Form for editing (includes name and status)
  roleForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    status: [true, Validators.required],
  });

  // Form for creating (only name field - status defaults to true)
  createRoleForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
  });

  // Status options for dropdown
  readonly statusOptions = [
    { label: 'Activo', value: true },
    { label: 'Inactivo', value: false },
  ];

  ngOnInit(): void {
    this.loadRoles();
  }

  private loadRoles(): void {
    this.loading.set(true);
    this.roleService.getAllRoles().subscribe({
      next: (data) => {
        this.roles.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar roles',
        });
        this.loading.set(false);
        // eslint-disable-next-line no-console
        console.error('Error al cargar roles', err);
      },
    });
  }

  openCreateDialog(): void {
    this.createRoleForm.reset({ name: '' });
    this.showCreateDialog.set(true);
  }

  openEditDialog(role: Role): void {
    this.selectedRole.set(role);
    this.roleForm.patchValue({
      name: role.name,
      status: role.status,
    });
    this.showEditDialog.set(true);
  }

  closeCreateDialog(): void {
    this.showCreateDialog.set(false);
    this.createRoleForm.reset();
  }

  closeEditDialog(): void {
    this.showEditDialog.set(false);
    this.selectedRole.set(null);
    this.roleForm.reset();
  }

  createRole(): void {
    if (this.createRoleForm.valid) {
      const newRole: Partial<Role> = {
        name: this.createRoleForm.value.name,
        status: true, // Always create with status true
      };
      this.roleService.createRole(newRole).subscribe({
        next: (data) => {
          this.roles.update((current) => [...current, data]);
          this.closeCreateDialog();
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Rol creado correctamente',
          });
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al crear el rol',
          });
          // eslint-disable-next-line no-console
          console.error('Error al crear rol', err);
        },
      });
    }
  }

  updateRole(): void {
    const selectedRole = this.selectedRole();
    if (this.roleForm.valid && selectedRole) {
      const updatedRole: Partial<Role> = this.roleForm.value;
      this.roleService.updateRole(selectedRole.id, updatedRole).subscribe({
        next: (data) => {
          this.roles.update((current) =>
            current.map((role) => (role.id === selectedRole.id ? data : role)),
          );
          this.closeEditDialog();
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Rol actualizado correctamente',
          });
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al actualizar el rol',
          });
          // eslint-disable-next-line no-console
          console.error('Error al actualizar rol', err);
        },
      });
    }
  }

  confirmDelete(role: Role): void {
    this.confirmationService.confirm({
      message: `¿Está seguro de que desea eliminar el rol "${role.name}"?`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.deleteRole(role.id);
      },
    });
  }

  private deleteRole(id: number): void {
    this.roleService.deleteRole(id).subscribe({
      next: () => {
        this.roles.update((current) => current.filter((role) => role.id !== id));
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Rol eliminado correctamente',
        });
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al eliminar el rol',
        });
        // eslint-disable-next-line no-console
        console.error('Error al eliminar rol', err);
      },
    });
  }

  getStatusSeverity(status: boolean): 'success' | 'danger' {
    return status ? 'success' : 'danger';
  }

  getStatusLabel(status: boolean): string {
    return status ? 'Activo' : 'Inactivo';
  }
}
