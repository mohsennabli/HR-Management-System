<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MedysisContract extends Contract
{
    protected $table = 'medysis_contracts';

    protected $fillable = [
        'employee_id',
        'start_date',
        'end_date',
        'pattern',
        'type'
    ];

    protected $casts = [
        'start_date' => 'datetime',
        'end_date' => 'datetime'
    ];

    // Validation rules
    public static $rules = [
        'employee_id' => 'required|exists:employees,id',
        'start_date' => 'required|date',
        'end_date' => 'required|date|after:start_date',
        'pattern' => 'required|in:full-time,part-time',
        'type' => 'required|in:permanent,temporary,internship'
    ];
} 