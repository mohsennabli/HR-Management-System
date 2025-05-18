<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Contract extends Model
{
    use HasFactory;

    protected $fillable = [
        'employee_id',
        'start_date',
        'end_date',
        'pattern',
        'contract_type',
        'duration',
        'sign',
        'breakup',
        'type'
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'duration' => 'integer'
    ];

    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }

    public function isSIVP()
    {
        return $this->contract_type === 'sivp';
    }

    public function isMedysis()
    {
        return $this->contract_type === 'medysis';
    }
} 