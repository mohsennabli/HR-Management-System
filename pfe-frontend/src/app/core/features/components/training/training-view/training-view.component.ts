import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-training-view',
  template: `
    <div class="training-view">
      <div class="page-header">
        <h2>Training Program Details</h2>
        <button class="btn-primary" routerLink="/hr-dashboard/training">Back to List</button>
      </div>
      
      <div class="training-details">
        <div class="details-card">
          <h3>Program Information</h3>
          <div class="info-grid">
            <div class="info-item">
              <label>Program Name</label>
              <p>Technical Skills Workshop</p>
            </div>
            <div class="info-item">
              <label>Description</label>
              <p>Advanced programming workshop covering modern development practices</p>
            </div>
            <div class="info-item">
              <label>Start Date</label>
              <p>March 15, 2024</p>
            </div>
            <div class="info-item">
              <label>End Date</label>
              <p>March 16, 2024</p>
            </div>
            <div class="info-item">
              <label>Capacity</label>
              <p>18/20 participants</p>
            </div>
            <div class="info-item">
              <label>Status</label>
              <span class="status-badge completed">Completed</span>
            </div>
            <div class="info-item">
              <label>Instructor</label>
              <p>Sarah Johnson</p>
            </div>
            <div class="info-item">
              <label>Location</label>
              <p>Training Room B</p>
            </div>
          </div>
        </div>

        <div class="participants-card">
          <h3>Participants</h3>
          <div class="table-container">
            <table class="participants-table text-black">
              <thead>
                <tr>
                  <th>Employee ID</th>
                  <th>Name</th>
                  <th>Department</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>EMP001</td>
                  <td>John Doe</td>
                  <td>IT</td>
                  <td><span class="status-badge completed">Completed</span></td>
                </tr>
                <tr>
                  <td>EMP002</td>
                  <td>Jane Smith</td>
                  <td>IT</td>
                  <td><span class="status-badge completed">Completed</span></td>
                </tr>
                <tr>
                  <td>EMP003</td>
                  <td>Mike Johnson</td>
                  <td>Engineering</td>
                  <td><span class="status-badge completed">Completed</span></td>
                </tr>
                <tr>
                  <td>EMP004</td>
                  <td>Emily Brown</td>
                  <td>IT</td>
                  <td><span class="status-badge completed">Completed</span></td>
                </tr>
                <tr>
                  <td>EMP005</td>
                  <td>David Wilson</td>
                  <td>Engineering</td>
                  <td><span class="status-badge completed">Completed</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .hr-training-view {
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
    .training-details {
      display: grid;
      gap: 20px;
    }
    .details-card, .participants-card {
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .details-card h3, .participants-card h3 {
      margin-top: 0;
      margin-bottom: 20px;
      color: #2c3e50;
    }
    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
    }
    .info-item {
      margin-bottom: 15px;
    }
    .info-item label {
      display: block;
      font-weight: 500;
      color: #7f8c8d;
      margin-bottom: 5px;
    }
    .info-item p {
      margin: 0;
      color: #2c3e50;
    }
    .status-badge {
      display: inline-block;
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
    }
    .status-badge.completed {
      background-color: #2ecc71;
      color: #fff;
    }
    .table-container {
      overflow-x: auto;
    }
    .participants-table {
      width: 100%;
      border-collapse: collapse;
    }
    .participants-table th, .participants-table td {
      padding: 12px 15px;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }
    .participants-table th {
      background-color: #f8f9fa;
      font-weight: 600;
    }
    .participants-table tr:hover {
      background-color: #f5f5f5;
    }
  `]
})
export class TrainingViewComponent implements OnInit {
  trainingId: number | undefined;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.trainingId = Number(this.route.snapshot.paramMap.get('id'));
    // TODO: Load training program details and participants using the ID
  }
} 