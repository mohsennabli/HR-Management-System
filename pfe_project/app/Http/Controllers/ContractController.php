<?php

namespace App\Http\Controllers;

use App\Models\Contract;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ContractController extends Controller
{
    public function index()
    {
        $contracts = Contract::with('employee')->get();
        return response()->json($contracts);
    }

    public function show($id)
    {
        $contract = Contract::with('employee')->findOrFail($id);
        return response()->json($contract);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'employee_id' => 'required|exists:employees,id',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'pattern' => 'required|in:full_time,part_time',
            'contract_type' => 'required|in:sivp,medysis',
            'duration' => 'required_if:contract_type,sivp|integer|min:1',
            'sign' => 'required_if:contract_type,sivp|string',
            'breakup' => 'required_if:contract_type,sivp|string',
            'type' => 'required_if:contract_type,medysis|in:permanent,temporary,internship'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $contract = Contract::create($request->all());
        return response()->json($contract, 201);
    }

    public function update(Request $request, $id)
    {
        $contract = Contract::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'employee_id' => 'exists:employees,id',
            'start_date' => 'date',
            'end_date' => 'date|after:start_date',
            'pattern' => 'in:full_time,part_time',
            'contract_type' => 'in:sivp,medysis',
            'duration' => 'required_if:contract_type,sivp|integer|min:1',
            'sign' => 'required_if:contract_type,sivp|string',
            'breakup' => 'required_if:contract_type,sivp|string',
            'type' => 'required_if:contract_type,medysis|in:permanent,temporary,internship'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $contract->update($request->all());
        return response()->json($contract);
    }

    public function destroy($id)
    {
        $contract = Contract::findOrFail($id);
        $contract->delete();
        return response()->json(null, 204);
    }

    public function getEmployeeContracts($employeeId)
    {
        $contracts = Contract::where('employee_id', $employeeId)
            ->with('employee')
            ->get();
        return response()->json($contracts);
    }
} 