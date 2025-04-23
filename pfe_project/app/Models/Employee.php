<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Employee extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
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
        return $this->belongsTo(User::class);
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
}