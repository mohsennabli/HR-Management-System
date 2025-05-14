import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { UserService } from '../user.service';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  providers: [ConfirmationService, MessageService]
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  loading = false;

  constructor(
    private userService: UserService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;

    this.userService.getUsers().subscribe({
      next: (response: any) => {
        if (response.data) {
          this.users = response.data.map((user: any) => ({
            id: user.id,
            name: user.name,
            email: user.email,
            role_id: user.role_id,
            role: user.role
          }));
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Unexpected API response' });
        }
        this.loading = false;
      },
      error: (error: any) => {
        this.loading = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load users.' });
        console.error('Error fetching users:', error);
      }
    });
  }

  confirmDeleteUser(id: number | undefined): void {
    if (!id) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Invalid user ID' });
      return;
    }

    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this user?',
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteUser(id);
      }
    });
  }

  private deleteUser(id: number): void {
    this.userService.deleteUser(id).subscribe({
      next: () => {
        this.users = this.users.filter(user => user.id !== id);
        this.messageService.add({ severity: 'success', summary: 'Deleted', detail: 'User deleted successfully' });
      },
      error: (error: any) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete user.' });
        console.error('Error deleting user:', error);
      }
    });
  }

  getRoleName(user: User): string {
    return user.role?.name || 'No role assigned';
  }
}
