<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('contracts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained('employees')->onDelete('cascade');
            $table->date('start_date');
            $table->date('end_date');
            $table->string('pattern');
            $table->string('contract_type'); // 'sivp' or 'medysis'
            $table->integer('duration')->nullable(); // For SIVP
            $table->string('sign')->nullable(); // For SIVP
            $table->string('breakup')->nullable(); // For SIVP
            $table->string('type')->nullable(); // For Medysis
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('contracts');
    }
}; 