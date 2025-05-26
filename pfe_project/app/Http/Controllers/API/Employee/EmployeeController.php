<?php

namespace App\Http\Controllers\API\Employee;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Mail;
use Jmrashed\Zkteco\Lib\ZKTeco;


class EmployeeController extends Controller
{
    public function index(Request $request)
    {
        $query = Employee::with('user');

        // Filter by search term
        if ($request->has('search') && !empty($request->search)) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                  ->orWhere('last_name', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        // Filter by department
        if ($request->has('department_id')) {
            $query->where('department_id', $request->department_id);
        }
        

        $employees = $query->get()->map(function ($employee) {
            $employeeData = $employee->toArray();
            $employeeData['email'] = $employee->user ? $employee->user->email : null;
            $employeeData['department'] = $employee->department ? $employee->department->name : null;

            return $employeeData;
        });

        return response()->json(['data' => $employees], 200);
    }

    public function store(Request $request)
    {
        Log::info('Incoming request:', $request->all());

        // Validate the request
        $validator = Validator::make($request->all(), [
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'department_id' => 'required|exists:departments,id',
            'position' => 'required|string|max:255',
            'hire_date' => 'required|date',
            'salary' => 'required|numeric|min:0',
            'birth_date' => 'nullable|date',
            'birth_location' => 'nullable|string|max:255',
            'marital_status' => 'nullable|string|in:single,married,divorced,widowed',
            'has_disabled_child' => 'nullable|boolean',
            'address' => 'nullable|string',
            'diploma' => 'nullable|string|max:255',
            'cin_number' => 'nullable|string|max:255',
            'cin_issue_date' => 'nullable|date',
            'cin_issue_location' => 'nullable|string|max:255',
            'cnss_number' => 'nullable|string|max:255',
            'bank_agency' => 'nullable|string|max:255',
            'bank_rib' => 'nullable|string|max:255',
            'is_user' => 'boolean',
            'email' => 'required_if:is_user,true|email|unique:users,email',
            'role_id' => 'required_if:is_user,true|exists:roles,id'
        ]);

        if ($validator->fails()) {
            Log::error('Validation failed:', $validator->errors()->toArray());
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            // Create the employee record
            $employeeData = $request->only([
                'first_name', 'last_name', 'phone', 'department_id', 'position', 
                'hire_date', 'salary', 'birth_date', 'birth_location', 'marital_status',
                'has_disabled_child', 'address', 'diploma', 'cin_number', 'cin_issue_date',
                'cin_issue_location', 'cnss_number', 'bank_agency', 'bank_rib', 'pin'
            ]);

            Log::info('Creating employee with data:', $employeeData);
            $employee = Employee::create($employeeData);
            $PIN = $this->AddUser($employee, "192.168.121.210", 4370);
            $employee->pin = $PIN;
            $employee->save();
            Log::info('Employee created successfully:', ['employee_id' => $employee->id]);

            // If is_user is true, create a user account
            if ($request->is_user) {
                if (!$request->email || !$request->role_id) {
                    Log::error('Missing email or role_id for user creation');
                    return response()->json(['error' => 'Email and role are required when creating a user account'], 422);
                }

                try {
                    // Generate a secure random password
                    $password = Str::random(12);
                    Log::info('Creating user account for employee', [
                        'employee_id' => $employee->id,
                        'email' => $request->email,
                        'role_id' => $request->role_id
                    ]);

                    $user = \App\Models\User::create([
                        'name' => $employee->first_name . ' ' . $employee->last_name,
                        'email' => $request->email,
                        'password' => \Illuminate\Support\Facades\Hash::make($password),
                        'employee_id' => $employee->id,
                        'role_id' => $request->role_id
                    ]);

                    Log::info('User account created successfully', ['user_id' => $user->id]);

                    // Send email with credentials
                    try {
                        Log::info('Attempting to send email to: ' . $user->email);
                        Log::info('Mail configuration:', [
                            'driver' => config('mail.default'),
                            'host' => config('mail.mailers.smtp.host'),
                            'port' => config('mail.mailers.smtp.port'),
                            'from_address' => config('mail.from.address'),
                            'from_name' => config('mail.from.name')
                        ]);
                        
                        // Test email configuration
                        if (config('mail.mailers.smtp.host') !== 'smtp.mailtrap.io') {
                            Log::warning('Mail configuration might not be using Mailtrap');
                        }
                        
                        Mail::to($user->email)->send(new \App\Mail\UserCredentialsMail($user->email, $password));
                        Log::info('Credentials email sent successfully', ['email' => $user->email]);
                        $emailSent = true;
                    } catch (\Exception $e) {
                        Log::error('Failed to send credentials email: ' . $e->getMessage(), [
                            'trace' => $e->getTraceAsString(),
                            'mail_config' => [
                                'driver' => config('mail.default'),
                                'host' => config('mail.mailers.smtp.host'),
                                'port' => config('mail.mailers.smtp.port')
                            ]
                        ]);
                        $emailSent = false;
                    }
                } catch (\Exception $e) {
                    Log::error('Failed to create user account: ' . $e->getMessage());
                    // Delete the employee if user creation fails
                    $employee->delete();
                    throw $e;
                }
            }

            $response = [
                'data' => $employee->fresh(['user']),
                'email_status' => $request->is_user ? [
                    'sent' => $emailSent ?? false,
                    'email' => $request->email
                ] : null
            ];

            return response()->json($response, 201);

        } catch (\Exception $e) {
            Log::error('Employee creation failed: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
                'request_data' => $request->all()
            ]);
            return response()->json(['error' => 'Employee creation failed: ' . $e->getMessage()], 500);
        }
    }

    public function show($id)
    {
        $employee = Employee::findOrFail($id);
        return response()->json(['data' => $employee], 200);
    }

    public function update(Request $request, $id)
    {
        $employee = Employee::with('user')->findOrFail($id);

        // Validate the request
        $validator = Validator::make($request->all(), [
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'department_id' => 'required|exists:departments,id',
            'position' => 'required|string|max:255',
            'hire_date' => 'required|date',
            'salary' => 'required|numeric|min:0',
            'birth_date' => 'nullable|date',
            'birth_location' => 'nullable|string|max:255',
            'marital_status' => 'nullable|string|in:single,married,divorced,widowed',
            'has_disabled_child' => 'nullable|boolean',
            'address' => 'nullable|string',
            'diploma' => 'nullable|string|max:255',
            'cin_number' => 'nullable|string|max:255',
            'cin_issue_date' => 'nullable|date',
            'cin_issue_location' => 'nullable|string|max:255',
            'cnss_number' => 'nullable|string|max:255',
            'bank_agency' => 'nullable|string|max:255',
            'bank_rib' => 'nullable|string|max:255',
            'email' => 'nullable|email|unique:users,email,' . ($employee->user ? $employee->user->id : 'NULL') . ',id',
            'role_id' => 'nullable|exists:roles,id'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            // Update the employee data
            $employeeData = $request->only([
                'first_name', 'last_name', 'phone', 'department_id', 'position', 
                'hire_date', 'salary', 'birth_date', 'birth_location', 'marital_status',
                'has_disabled_child', 'address', 'diploma', 'cin_number', 'cin_issue_date',
                'cin_issue_location', 'cnss_number', 'bank_agency', 'bank_rib'
            ]);
            $employee->update($employeeData);

            // Handle user account update
            if ($request->has('email')) {
                if ($employee->user) {
                    // Update existing user
                    $userData = [
                        'name' => $employee->first_name . ' ' . $employee->last_name,
                        'email' => $request->email
                    ];
                    if ($request->has('role_id')) {
                        $userData['role_id'] = $request->role_id;
                    }
                    $employee->user->update($userData);
                } else {
                    // Create new user account
                    $user = \App\Models\User::create([
                        'name' => $employee->first_name . ' ' . $employee->last_name,
                        'email' => $request->email,
                        'password' => bcrypt($request->password ?? 'password'),
                        'employee_id' => $employee->id,
                        'role_id' => $request->role_id
                    ]);
                }
            }

            return response()->json(['data' => $employee->fresh(['user'])], 200);

        } catch (\Exception $e) {
            Log::error('Employee update failed: ' . $e->getMessage());
            return response()->json(['error' => 'Employee update failed'], 500);
        }
    }

    public function destroy($id)
    {
        $employee = Employee::findOrFail($id);

        try {
            $employee->delete();

            return response()->json(null, 204);

        } catch (\Exception $e) {
            Log::error('Employee deletion failed: ' . $e->getMessage());
            return response()->json(['error' => 'Deletion failed'], 500);
        }
    }

    public function getRoles()
    {
        $roles = \App\Models\Role::all();
        return response()->json(['data' => $roles], 200);
    }

    public function AddUser(Employee $emp, string $ip, int $port){
        try {
            $zk = new ZKTeco($ip, $port);

            if (!$zk->connect()) {
                return response()->json([
                    'success' => false,
                    'message' => "Unable to connect to device at $ip:$port"
                ], 500);
            }
            $PIN = random_int(100000, 999999);
            $zk->setUser($emp->id, $emp->id, $emp->first_name . ' ' . $emp->last_name, $PIN, 0, 0);
            return $PIN;
        } catch (\Throwable $e) {
            return 0;
        }
    }
}