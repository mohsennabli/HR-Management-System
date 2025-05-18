<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('sivp_contracts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained('employees')->onDelete('cascade');
            $table->date('start_date');
            $table->date('end_date');
            $table->enum('pattern', ['full_time', 'part_time']);
            $table->integer('duration');
            $table->string('sign');
            $table->string('breakup');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('sivp_contracts');
    }
}; 