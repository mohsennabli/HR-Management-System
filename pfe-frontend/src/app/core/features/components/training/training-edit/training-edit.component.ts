import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TrainingProgramService } from 'src/app/core/features/components/training/training-program.service';
import { TrainingParticipantService } from '../training-participant.service';
import { EmployeeService } from 'src/app/core/features/components/employee/employee.service';
@Component({
  selector: 'app-training-edit',
  templateUrl: './training-edit.component.html',
  styleUrls: ['./training-edit.component.scss']
})
export class TrainingEditComponent implements OnInit {
  trainingForm: FormGroup;
  trainingId!: number;
  loading = false;
  errorMessage: string | null = null;
  statusOptions = ['Draft', 'Published', 'Completed', 'Cancelled'];
  participants: any[] = [];
  availableEmployees: any[] = [];
  newEmployeeId: number | null = null;



  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private trainingService: TrainingProgramService,
    private participantService: TrainingParticipantService,
    private employeeService: EmployeeService
  ) {
    this.trainingForm = this.fb.group({
      programName: ['', Validators.required],
      description: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      capacity: ['', [Validators.required, Validators.min(1)]],
      instructor: ['', Validators.required],
      location: ['', Validators.required],
      status: ['Draft', Validators.required] // Added status field
    });
  }

  ngOnInit(): void {
    this.trainingId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.trainingId) {
      this.loadTrainingProgram();
    }
    this.loadParticipants();
    this.employeeService.getAll().subscribe({
      next: (response) => {
        this.availableEmployees = response.data;
      }
    });

  }


  loadParticipants() {
    this.participantService.getAllForProgram(this.trainingId).subscribe({
      next: (response) => {
        this.participants = response.data;
      }
    });
  }

  loadTrainingProgram(): void {
    this.loading = true;
    this.errorMessage = null;
    
    this.trainingService.getById(this.trainingId).subscribe({
      next: (response) => {
        console.log('Full API Response:', response); // Debug log
        
        // Extract data from response (assuming it's in response.data)
        const programData = response.data || response;
        
        if (!programData) {
          this.errorMessage = 'Training program not found';
          this.loading = false;
          return;
        }
  
        // Format dates
        const startDate = programData.start_date ? new Date(programData.start_date).toISOString().split('T')[0] : '';
        const endDate = programData.end_date ? new Date(programData.end_date).toISOString().split('T')[0] : '';
        
        console.log('Form data being set:', { // Debug log
          name: programData.name,
          startDate,
          endDate
        });
        
        this.trainingForm.patchValue({
          programName: programData.name || '',
          description: programData.description || '',
          startDate: startDate,
          endDate: endDate,
          capacity: programData.capacity || '',
          instructor: programData.instructor || '',
          location: programData.location || '',
          status: programData.status || 'Draft'
        });
        this.loading = false;
      },
      error: (error) => {
        console.error('Error details:', error); // Debug log
        this.errorMessage = 'Failed to load training program details';
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.trainingForm.invalid || this.loading) return;

    this.loading = true;
    this.errorMessage = null;

    const formData = {
      name: this.trainingForm.value.programName,
      description: this.trainingForm.value.description,
      start_date: this.trainingForm.value.startDate,
      end_date: this.trainingForm.value.endDate,
      capacity: this.trainingForm.value.capacity,
      instructor: this.trainingForm.value.instructor,
      location: this.trainingForm.value.location,
      status: this.trainingForm.value.status // Include status in submission
    };

    const operation = this.trainingId 
      ? this.trainingService.update(this.trainingId, formData)
      : this.trainingService.create(formData);

    operation.subscribe({
      next: () => {
        this.router.navigate(['/hr/training']);
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Failed to save training program';
        this.loading = false;
        console.error('Error saving training:', error);
      }
    });
  }
  addParticipant(): void {
    if (this.newEmployeeId) {
      this.participantService.create(this.trainingId, { 
        employee_id: this.newEmployeeId 
      }).subscribe({
        next: () => {
          this.loadParticipants();
          this.newEmployeeId = null;
        },
        error: (err) => {
          console.error('Error adding participant:', err);
          alert(err.error?.message || 'Failed to add employee');
        }
      });
    }
  }
  removeParticipant(participantId: number): void {
    if (confirm('Remove this employee from the training?')) {
      this.participantService.delete(this.trainingId, participantId)
        .subscribe({
          next: () => this.loadParticipants()
        });
    }
  }

  onCancel(): void {
    this.router.navigate(['/training']);
  }
}