// hr-discipline-list.component.ts
import { Component, OnInit } from '@angular/core';
import { HrDisciplineService } from 'src/app/services/hr/discipline.service';

@Component({
  selector: 'app-hr-discipline-list',
  template: `
    <div class="discipline-container">
      <div class="page-header">
        <h2>Disciplinary Management</h2>
      </div>

      <div class="discipline-lists">
        <!-- Employees List -->
        <div class="employee-list">
          <h3>All Employees</h3>
          <div class="table-container">
            <table class="employee-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Position</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let employee of employees">
                  <td>{{ employee.first_name }} {{ employee.last_name }}</td>
                  <td>{{ employee.position }}</td>
                  <td>
                    <button class="btn-primary" (click)="openDisciplineForm(employee)">Add Discipline</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Disciplinary Actions List -->
        <div class="actions-list">
          <h3>Disciplinary Actions</h3>
          <div class="table-container">
            <table class="actions-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Type</th>
                  <th>Reason</th>
                  <th>Date</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let action of disciplinaryActions">
                  <td>{{ action.employee.first_name }} {{ action.employee.last_name }}</td>
                  <td>{{ action.type | titlecase }}</td>
                  <td>{{ action.reason }}</td>
                  <td>{{ action.action_date | date }}</td>
                  <td>{{ action.notes || 'N/A' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Discipline Form Modal -->
      <div class="modal" [class.active]="showForm">
        <div class="modal-content">
          <h3>Add Disciplinary Action</h3>
          <form (ngSubmit)="submitDiscipline()">
            <div class="form-group">
              <label>Employee</label>
              <input type="text" [value]="selectedEmployee?.first_name + ' ' + selectedEmployee?.last_name" disabled>
            </div>

            <div class="form-group">
              <label>Type</label>
              <select [(ngModel)]="newAction.type" name="type" required>
                <option value="verbal_warning">Verbal Warning</option>
                <option value="written_warning">Written Warning</option>
                <option value="suspension">Suspension</option>
                <option value="termination">Termination</option>
              </select>
            </div>

            <div class="form-group">
              <label>Reason</label>
              <textarea [(ngModel)]="newAction.reason" name="reason" required></textarea>
            </div>

            <div class="form-group">
              <label>Action Date</label>
              <input type="date" [(ngModel)]="newAction.action_date" name="action_date" required>
            </div>

            <div class="form-group">
              <label>Notes</label>
              <textarea [(ngModel)]="newAction.notes" name="notes"></textarea>
            </div>

            <div class="form-actions">
              <button type="button" class="btn-cancel" (click)="closeForm()">Cancel</button>
              <button type="submit" class="btn-submit">Submit</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* Add appropriate styling */
    .discipline-lists {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }
    .modal {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.5);
    }
    .modal.active {
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .modal-content {
      background: white;
      padding: 20px;
      border-radius: 8px;
      width: 500px;
    }
  `]
})
export class HrDisciplineListComponent implements OnInit {
  employees: any[] = [];
  disciplinaryActions: any[] = [];
  showForm = false;
  selectedEmployee: any;
  newAction: any = {};

  constructor(private disciplineService: HrDisciplineService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.disciplineService.getEmployees().subscribe({
      next: (employees) => this.employees = employees,
      error: (err) => console.error('Error loading employees:', err)
    });
  
    this.disciplineService.getAllActions().subscribe({
      next: (actions) => this.disciplinaryActions = actions,
      error: (err) => console.error('Error loading actions:', err)
    });
  }

  openDisciplineForm(employee: any): void {
    this.selectedEmployee = employee;
    this.newAction = {
      employee_id: employee.id,
      action_date: new Date().toISOString().split('T')[0]
    };
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
    this.selectedEmployee = null;
    this.newAction = {};
  }

  submitDiscipline(): void {
    this.disciplineService.createAction(this.newAction).subscribe({
      next: () => {
        this.loadData();
        this.closeForm();
      },
      error: (err) => console.error('Error submitting action:', err)
    });
  }
}