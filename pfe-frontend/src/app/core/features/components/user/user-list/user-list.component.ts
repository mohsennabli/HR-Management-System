import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { UserService } from '../user.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RoleService } from '../../roles/role.service';
import { Role } from 'src/app/models/role.model';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  providers: [ConfirmationService, MessageService]
})
export class UserListComponent implements OnInit, OnDestroy {
  users: User[] = [];
  loading = false;
  visible = false;
  editForm: FormGroup;
  selectedUser: User | null = null;
  roles: Role[] = [];
  private destroy$ = new Subject<void>();

  constructor(
    private userService: UserService,
    private roleService: RoleService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private fb: FormBuilder
  ) {
    this.editForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role_id: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadUsers();
    this.loadRoles();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadUsers(): void {
    this.loading = true;
    this.userService.getUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.data) {
            this.users = response.data;
          }
          this.loading = false;
        },
        error: (error) => {
          this.loading = false;
          this.messageService.add({ 
            severity: 'error', 
            summary: 'Error', 
            detail: 'Failed to load users' 
          });
          console.error('Error fetching users:', error);
        }
      });
  }

  loadRoles(): void {
    this.roleService.getRoles()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.data) {
            this.roles = response.data;
          }
        },
        error: (error) => {
          this.messageService.add({ 
            severity: 'error', 
            summary: 'Error', 
            detail: 'Failed to load roles' 
          });
          console.error('Error loading roles:', error);
        }
      });
  }

  confirmDeleteUser(id: number | undefined): void {
    if (!id) {
      this.messageService.add({ 
        severity: 'error', 
        summary: 'Error', 
        detail: 'Invalid user ID' 
      });
      return;
    }

    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this user?',
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => this.deleteUser(id)
    });
  }

  private deleteUser(id: number): void {
    this.userService.deleteUser(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.users = this.users.filter(user => user.id !== id);
          this.messageService.add({ 
            severity: 'success', 
            summary: 'Success', 
            detail: 'User deleted successfully' 
          });
        },
        error: (error) => {
          this.messageService.add({ 
            severity: 'error', 
            summary: 'Error', 
            detail: 'Failed to delete user' 
          });
          console.error('Error deleting user:', error);
        }
      });
  }

  showEditDialog(user: User): void {
    this.selectedUser = user;
    this.editForm.patchValue({
      name: user.name,
      email: user.email,
      role_id: user.role_id
    });
    this.visible = true;
  }

  hideDialog(): void {
    this.visible = false;
    this.selectedUser = null;
    this.editForm.reset();
  }

  saveUser(): void {
    if (this.editForm.valid && this.selectedUser) {
      const updatedUser: User = {
        ...this.selectedUser,
        ...this.editForm.value
      };

      this.userService.updateUser(this.selectedUser.id!, updatedUser)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.messageService.add({ 
              severity: 'success', 
              summary: 'Success', 
              detail: 'User updated successfully' 
            });
            this.hideDialog();
            this.loadUsers();
          },
          error: (error) => {
            this.messageService.add({ 
              severity: 'error', 
              summary: 'Error', 
              detail: 'Failed to update user' 
            });
            console.error('Error updating user:', error);
          }
        });
    }
  }

  getRoleName(user: User): string {
    return user.role?.name || 'No role assigned';
  }
}
