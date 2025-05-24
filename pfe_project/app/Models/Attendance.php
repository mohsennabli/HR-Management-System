<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Attendance extends Model
{
    use HasFactory;

    protected $table = 'attendance'; // explicitly set the table name

    protected $primaryKey = 'uid';
    public $incrementing = false; // 'uid' is not auto-incrementing
    protected $keyType = 'int';   // 'uid' is of integer type

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
