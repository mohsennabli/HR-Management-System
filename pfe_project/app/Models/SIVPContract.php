<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SIVPContract extends Contract
{
    protected $table = 'sivp_contracts';

    protected $fillable = [
        'employee_id',
        'start_date',
        'end_date',
        'pattern',
        'duration',
        'sign',
        'breakup'
    ];

    protected $casts = [
        'start_date' => 'datetime',
        'end_date' => 'datetime',
        'duration' => 'integer'
    ];
} 