<?php

namespace App\Http\Controllers\API\Contract;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Contract;
use App\Models\SIVPContract;
use App\Models\MedysisContract;
use Illuminate\Support\Facades\Validator;

class ContractController extends Controller
{
    public function index()
    {
        try {
            // Fetch contracts from all three tables
            $sivpContracts = SIVPContract::with('employee')->get();
            $medysisContracts = MedysisContract::with('employee')->get();
            $baseContracts = Contract::with('employee')->get();

            // Combine all contracts
            $allContracts = $sivpContracts->concat($medysisContracts)->concat($baseContracts);

            return response()->json([
                'status' => 'success',
                'data' => $allContracts
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to fetch contracts: ' . $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'employee_id' => 'required|exists:employees,id',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'pattern' => 'required|in:full_time,part_time',
            'contract_type' => 'required|in:sivp,medysis'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $contractType = $request->input('contract_type');
            
            // Additional validation based on contract type
            if ($contractType === 'sivp') {
                $sivpValidator = Validator::make($request->all(), [
                    'duration' => 'required|integer',
                    'sign' => 'required|string',
                    'breakup' => 'required|string'
                ]);

                if ($sivpValidator->fails()) {
                    return response()->json([
                        'status' => 'error',
                        'message' => 'SIVP contract validation failed',
                        'errors' => $sivpValidator->errors()
                    ], 422);
                }

                $contract = SIVPContract::create($request->all());
                $message = 'SIVP contract created successfully';
            } else {
                $medysisValidator = Validator::make($request->all(), [
                    'type' => 'required|in:permanent,temporary,internship'
                ]);

                if ($medysisValidator->fails()) {
                    return response()->json([
                        'status' => 'error',
                        'message' => 'Medysis contract validation failed',
                        'errors' => $medysisValidator->errors()
                    ], 422);
                }

                $data = $request->only(['employee_id', 'start_date', 'end_date', 'pattern', 'type']);
                $data['start_date'] = date('Y-m-d', strtotime($data['start_date']));
                $data['end_date'] = date('Y-m-d', strtotime($data['end_date']));
                
                $contract = MedysisContract::create($data);
                $message = 'Medysis contract created successfully';
            }

            return response()->json([
                'status' => 'success',
                'message' => $message,
                'data' => $contract
            ], 201);
        } catch (\Exception $e) {
            \Log::error('Contract Creation Error: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to create contract: ' . $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            // Try to find the contract in each table
            $contract = SIVPContract::with('employee')->find($id);
            if (!$contract) {
                $contract = MedysisContract::with('employee')->find($id);
            }
            if (!$contract) {
                $contract = Contract::with('employee')->find($id);
            }

            if (!$contract) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Contract not found'
                ], 404);
            }

            return response()->json([
                'status' => 'success',
                'data' => $contract
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to fetch contract: ' . $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'employee_id' => 'required|exists:employees,id',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'pattern' => 'required|in:full_time,part_time'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            // Try to find and update the contract in each table
            $contract = SIVPContract::find($id);
            if (!$contract) {
                $contract = MedysisContract::find($id);
            }
            if (!$contract) {
                $contract = Contract::find($id);
            }

            if (!$contract) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Contract not found'
                ], 404);
            }

            $contract->update($request->all());
            return response()->json([
                'status' => 'success',
                'message' => 'Contract updated successfully',
                'data' => $contract
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to update contract: ' . $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            // Try to find and delete the contract in each table
            $contract = SIVPContract::find($id);
            if (!$contract) {
                $contract = MedysisContract::find($id);
            }
            if (!$contract) {
                $contract = Contract::find($id);
            }

            if (!$contract) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Contract not found'
                ], 404);
            }

            $contract->delete();
            return response()->json([
                'status' => 'success',
                'message' => 'Contract deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to delete contract: ' . $e->getMessage()
            ], 500);
        }
    }

    public function getEmployeeContracts($employeeId)
    {
        try {
            // Fetch contracts for the employee from all three tables
            $sivpContracts = SIVPContract::with('employee')->where('employee_id', $employeeId)->get();
            $medysisContracts = MedysisContract::with('employee')->where('employee_id', $employeeId)->get();
            $baseContracts = Contract::with('employee')->where('employee_id', $employeeId)->get();

            // Combine all contracts
            $allContracts = $sivpContracts->concat($medysisContracts)->concat($baseContracts);

            return response()->json([
                'status' => 'success',
                'data' => $allContracts
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to fetch employee contracts: ' . $e->getMessage()
            ], 500);
        }
    }
} 