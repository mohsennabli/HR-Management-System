<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class ChangeMedysisDatesToDate extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('medysis_contracts', function (Blueprint $table) {
            // Change datetime columns to date
            $table->date('start_date')->change();
            $table->date('end_date')->change();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('medysis_contracts', function (Blueprint $table) {
            // For rollback - change back to datetime
            $table->dateTime('start_date')->change();
            $table->dateTime('end_date')->change();
        });
    }
}
