<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Attendance extends Model
{
    use HasFactory;

    protected $table = 'attendance'; 

    protected $primaryKey = 'uid';
    public $incrementing = false; 
    protected $keyType = 'int';   

    protected $fillable = [
        'uid',
        'id',
        'timestamp',
        'type',
    ];

    public function employee()
    {
        return $this->belongsTo(Employee::class, 'id'); // 'id' refers to the employee foreign key
    }
}
