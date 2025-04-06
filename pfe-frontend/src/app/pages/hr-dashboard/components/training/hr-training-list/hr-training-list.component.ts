import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-hr-training-list',
  template: `
    <div class="hr-training-list">
      <div class="page-header">
        <h2>Training Programs</h2>
        <button class="btn-primary" routerLink="create">Add New Training</button>
      </div>
      
      <div class="table-container">
        <table class="training-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Program Name</th>
              <th>Description</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Capacity</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <!-- Sample data - replace with actual data from service -->
            <tr>
              <td>1</td>
              <td>Leadership Development</td>
              <td>Advanced leadership skills training</td>
              <td>2024-04-01</td>
              <td>2024-04-05</td>
              <td>20/25</td>
              <td><span class="status-badge upcoming">Upcoming</span></td>
              <td class="actions">
                <button class="btn-edit" routerLink="edit/1">Edit</button>
                <button class="btn-delete">Delete</button>
              </td>
            </tr>
            <tr>
              <td>2</td>
              <td>Project Management</td>
              <td>PM fundamentals and best practices</td>
              <td>2024-03-25</td>
              <td>2024-03-27</td>
              <td>15/20</td>
              <td><span class="status-badge ongoing">Ongoing</span></td>
              <td class="actions">
                <button class="btn-edit" routerLink="edit/2">Edit</button>
                <button class="btn-delete">Delete</button>
              </td>
            </tr>
            <tr>
              <td>3</td>
              <td>Technical Skills</td>
              <td>Advanced programming workshop</td>
              <td>2024-03-15</td>
              <td>2024-03-16</td>
              <td>18/20</td>
              <td><span class="status-badge completed">Completed</span></td>
              <td class="actions">
                <button class="btn-view" routerLink="view/3">View</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .hr-training-list {
      padding: 20px;
    }
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    .page-header h2 {
      margin: 0;
    }
    .btn-primary {
      background-color: #3498db;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 4px;
      cursor: pointer;
    }
    .btn-primary:hover {
      background-color: #2980b9;
    }
    .table-container {
      overflow-x: auto;
    }
    .training-table {
      width: 100%;
      border-collapse: collapse;
    }
    .training-table th, .training-table td {
      padding: 12px 15px;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }
    .training-table th {
      background-color: #f8f9fa;
      font-weight: 600;
    }
    .training-table tr:hover {
      background-color: #f5f5f5;
    }
    .status-badge {
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
    }
    .status-badge.upcoming {
      background-color: #3498db;
      color: #fff;
    }
    .status-badge.ongoing {
      background-color: #f1c40f;
      color: #fff;
    }
    .status-badge.completed {
      background-color: #2ecc71;
      color: #fff;
    }
    .actions {
      display: flex;
      gap: 8px;
    }
    .btn-edit, .btn-delete, .btn-view {
      padding: 6px 12px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 12px;
    }
    .btn-edit {
      background-color: #2ecc71;
      color: white;
    }
    .btn-edit:hover {
      background-color: #27ae60;
    }
    .btn-delete {
      background-color: #e74c3c;
      color: white;
    }
    .btn-delete:hover {
      background-color: #c0392b;
    }
    .btn-view {
      background-color: #3498db;
      color: white;
    }
    .btn-view:hover {
      background-color: #2980b9;
    }
  `]
})
export class HrTrainingListComponent implements OnInit {
  constructor() { }

  ngOnInit(): void {
    // Initialize component - load training programs from service
  }
} 