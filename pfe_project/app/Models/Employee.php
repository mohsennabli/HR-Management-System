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
        'department',
        'position',
        'hire_date',
        'salary'
    ];

    protected $casts = [
        'hire_date' => 'date',
        'salary' => 'decimal:2'
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