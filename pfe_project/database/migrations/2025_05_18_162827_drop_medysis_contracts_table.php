<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class DropMedysisContractsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::dropIfExists('medysis_contracts');

    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::create('medysis_contracts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained();
            $table->dateTime('start_date');
            $table->dateTime('end_date');
            $table->string('pattern', 20); // Old format (might have caused the error)
            $table->string('type', 20);
            $table->timestamps();
        });
    }
}
