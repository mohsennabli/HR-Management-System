import { Component, OnInit } from '@angular/core';
import { HrDisciplineService } from 'src/app/core/features/components/discipline/discipline.service';

@Component({
  selector: 'app-discipline-list', // Updated selector
  templateUrl: './discipline-list.component.html', // Updated template URL
  styleUrls: ['./discipline-list.component.scss'] // Updated style URL
})
export class DisciplineListComponent implements OnInit {
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
  deleteAction(actionId: number): void {
    if (confirm('Are you sure you want to delete this disciplinary action?')) {
      this.disciplineService.deleteAction(actionId).subscribe({
        next: () => {
          this.disciplinaryActions = this.disciplinaryActions.filter(
            action => action.id !== actionId
          );
          // Optional: Show success message
        },
        error: (err) => {
          console.error('Full error:', err);
          // Show user-friendly error message
          alert('Failed to delete action. Please try again.');
        }
      });
    }
  }
}