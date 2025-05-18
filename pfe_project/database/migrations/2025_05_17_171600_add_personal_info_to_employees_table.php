<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('employees', function (Blueprint $table) {
            $table->date('birth_date')->nullable();
            $table->string('birth_location')->nullable();
            $table->string('marital_status')->nullable();
            $table->boolean('has_disabled_child')->default(false);
            $table->text('address')->nullable();
            $table->string('diploma')->nullable();
            $table->string('cin_number')->nullable();
            $table->date('cin_issue_date')->nullable();
            $table->string('cin_issue_location')->nullable();
            $table->string('cnss_number')->nullable();
            $table->string('bank_agency')->nullable();
            $table->string('bank_rib')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('employees', function (Blueprint $table) {
            $table->dropColumn([
                'birth_date',
                'birth_location',
                'marital_status',
                'has_disabled_child',
                'address',
                'diploma',
                'cin_number',
                'cin_issue_date',
                'cin_issue_location',
                'cnss_number',
                'bank_agency',
                'bank_rib'
            ]);
        });
    }
}; 