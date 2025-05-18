<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Employee extends Model
{
    use HasFactory;

    protected $fillable = [
        'first_name',
        'last_name',
        'phone',
        'department_id',
        'position',
        'hire_date',
        'salary',
        'birth_date',
        'birth_location',
        'marital_status',
        'has_disabled_child',
        'address',
        'diploma',
        'cin_number',
        'cin_issue_date',
        'cin_issue_location',
        'cnss_number',
        'bank_agency',
        'bank_rib'
    ];

    protected $casts = [
        'hire_date' => 'date',
        'salary' => 'decimal:2',
        'birth_date' => 'date',
        'cin_issue_date' => 'date',
        'has_disabled_child' => 'boolean'
    ];

    public function user()
    {
        return $this->hasOne(User::class, 'employee_id');
    }

    public function leaveRequests()
    {
        return $this->hasMany(LeaveRequest::class);
    }

    public function trainingParticipants()
    {
        return $this->hasMany(TrainingParticipant::class);
    }

    public function disciplinaryActions()
    {
        return $this->hasMany(DisciplinaryAction::class);
    }
    public function department()
{
    return $this->belongsTo(Department::class);
}
}