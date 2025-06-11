<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Jmrashed\Zkteco\Lib\ZKTeco;
use Carbon\Carbon;
use App\Models\Employee;
use App\Models\Department;
use Illuminate\Support\Facades\Log;
use App\Models\Attendance;
use Illuminate\Support\Facades\DB;
class ZktecoController extends Controller
{
    
  public function AsynchroniseAttendance(Request $request){
        $ip = $request->input('ip', '192.168.121.210'); 
        $port = $request->input('port', 4370);
        $lastLocalAttendance=Attendance::orderBy('uid','desc')->first();
        Log::error("lastLocalAttendance : " .json_encode( $lastLocalAttendance));
        $zk = new ZKTeco($ip, $port);

            if (!$zk->connect()) {
                return response()->json([
                    'success' => false,
                    'message' => "Unable to connect to device "
                ], 200);
            }
        $attendanceLog = array_values((array) $zk->getAttendance($zk));
        if( $lastLocalAttendance){
          $AttendancetoSynchronise = array_filter( $attendanceLog,function($attendace) use($lastLocalAttendance){
             return ($attendace['uid'] > $lastLocalAttendance['uid']);
          } );
        }
        else{
           $AttendancetoSynchronise =$attendanceLog;
        }
        
       foreach ($AttendancetoSynchronise  as $attandance) {
           $addedAttandance=new Attendance();
           DB::table('attendance')->insert([
            'id' => $attandance['id'],
            'uid'=>$attandance['uid'],
            'type' => $attandance['type'],
            'timestamp' => $attandance['timestamp']
           ]);
     
       };
    
}


    //Attendance list per day
    public function getAllAttendanceOfToday(Request $request){
         $ip = $request->input('ip', '192.168.121.210');
        $port = $request->input('port', 4370);

              try {  
       
            Log::error("connected " .json_encode($ip));
              $attendanceLog =  Attendance::get()->toArray() ;
             $attendanceLog =array_map(   function ($item ) {
                $employe=Employee::find($item['id']);
               if($employe){

                   $department=Department::find($employe->department_id);
       $AddedVaue = [
        'employe_name' => $employe->first_name . ' ' . $employe->last_name,
         'departement_name' => $department->name
      ];
                }
                else{
                     $AddedVaue= [  ];
                }

             return  $item + $AddedVaue;
            },$attendanceLog );




            if($request->input("date")){
               $date = Carbon::parse($request->input("date"))->toDateString();
            }
            else{
                $now = Carbon::now();
                $date = Carbon::now()->toDateString();
            }
            // '2025-05-14'

            // $attendanceLog = collect($attendanceLog)->filter(function ($item) use ($date) {
            //   return Carbon::parse($item->timestamp)->toDateString() === $targetDate;
            // })->values();
          $attendanceLog=  array_filter($attendanceLog, function ($item)use ($date) {
            return Carbon::parse($item['timestamp'])->toDateString() === $date; // Keep only strings
           });

            if($request->has('idUser')){
                $attendanceLog= array_filter($attendanceLog, function ($item) use($request) {
            return $item['id']==$request->input("idUser"); // Keep only strings
            });
            }
             return response()->json([
                'success' => true,
                'logOfToday'=>array_values((array) $attendanceLog)
            ]);

        }
        catch(\Throwable $e){
             return response()->json([
                'success' => false,
                'message' => 'Error: ' . $e->getMessage()
            ], 500);
        }
    }


   public function getWorksHour(Request $request){
         $ip = $request->input('ip', '192.168.121.210'); 
        $port = $request->input('port', 4370);

               try {  
      
            $attendanceLog =  Attendance::get()->toArray() ;
             $attendanceLog =array_map(   function ($item ) {
                $employe=Employee::find($item['id']);
               if($employe){
                  
                   $department=Department::find($employe->department_id);
                   $AddedVaue= ['employe_name'=> $employe->first_name.' '.$employe->last_name, 'departement_name'=> $department->name ];
                }
                else{
                     $AddedVaue= [  ];
                }

             return  $item + $AddedVaue;
            },$attendanceLog );




            if($request->input("date")){
                $date = Carbon::parse($request->input("date"))->toDateString();
            }
            else{
                $date = Carbon::now()->toDateString();
            }
            
            $dayName = Carbon::parse($date)->format('l');
            $parsedDate = Carbon::createFromFormat('Y-m-d', $date);
           
         switch ($dayName) {
            case 'Monday':
              $Mon = $parsedDate->clone();
              $Tue =$parsedDate->clone()->addDays(1);

              $Wed =$parsedDate->clone()->addDays(2);

              $Thu =$parsedDate->clone()->addDays(3);

              $Fri =$parsedDate->clone()->addDays(4);

              $Sat =$parsedDate->clone()->addDays(5);

             $Sun = $parsedDate->clone()->addDays(6);
             break;
            case 'Tuesday':
              $Mon =$parsedDate->clone()->subDays(1);
              $Tue =$parsedDate->clone();

             $Wed =$parsedDate->clone()->addDays(1);

             $Thu =$parsedDate->clone()->addDays(2);

             $Fri =$parsedDate->clone()->addDays(3);

             $Sat =$parsedDate->clone()->addDays(4);

              $Sun = $parsedDate->clone()->addDays(5);
              break;
            case 'Wednesday':
            $Mon =$parsedDate->clone()->subDays(2);
             $Tue =$parsedDate->clone()->subDays(1);

             $Wed =$parsedDate->clone();

             $Thu =$parsedDate->clone()->addDays(1);

             $Fri =$parsedDate->clone()->addDays(2);

             $Sat =$parsedDate->clone()->addDays(3);

            $Sun = $parsedDate->clone()->addDays(4);
            break;
            case 'Thursday':
            $Mon =$parsedDate->clone()->subDays(3);
             $Tue =$parsedDate->clone()->subDays(2);

             $Wed =$parsedDate->clone()->subDays(1);

             $Thu =$parsedDate->clone();

             $Fri =$parsedDate->clone()->addDays(1);

             $Sat =$parsedDate->clone()->addDays(2);

            $Sun = $parsedDate->clone()->addDays(3);
            break;
            case 'Friday':
            $Mon =$parsedDate->clone()->subDays(4);
             $Tue =$parsedDate->clone()->subDays(3);

             $Wed =$parsedDate->clone()->subDays(2);

             $Thu =$parsedDate->clone()->subDays(1);

             $Fri =$parsedDate->clone();

             $Sat =$parsedDate->clone()->addDays(1);

            $Sun = $parsedDate->clone()->addDays(2);
            break;
           

            case 'Saturday':
             $Mon =$parsedDate->clone()->subDays(5);
             $Tue =$parsedDate->clone()->subDays(4);

             $Wed =$parsedDate->clone()->subDays(3);

             $Thu =$parsedDate->clone()->subDays(2);

             $Fri =$parsedDate->clone()->subDays(1);

             $Sat =$parsedDate->clone();

              $Sun = $parsedDate->clone()->addDays(1);
              break;
            case 'Sunday':
            $Mon =$parsedDate->clone()->subDays(6);
             $Tue =$parsedDate->clone()->subDays(5);

             $Wed =$parsedDate->clone()->subDays(4);

             $Thu =$parsedDate->clone()->subDays(3);

             $Fri =$parsedDate->clone()->subDays(2);

             $Sat =$parsedDate->clone()->subDays(1);

            $Sun = $parsedDate->clone();
            break;

            default:
            return 'Invalid day';
         }
             
             // Filter attendance by day
             $MonAttend=array_filter($attendanceLog, function ($item)use ($Mon) {
               return Carbon::parse($item['timestamp'])->toDateString() === $Mon->toDateString();
             });
             $TueAttend=array_filter($attendanceLog, function ($item)use ($Tue) {
              return Carbon::parse($item['timestamp'])->toDateString() === $Tue->toDateString();
             });
            $WedAttend=array_filter($attendanceLog, function ($item)use ($Wed) {
            return Carbon::parse($item['timestamp'])->toDateString() === $Wed->toDateString();
           });
            $ThuAttend=array_filter($attendanceLog, function ($item)use ($Thu) {
            return Carbon::parse($item['timestamp'])->toDateString() === $Thu->toDateString();
           });
            $FriAttend=array_filter($attendanceLog, function ($item)use ($Fri) {
            return Carbon::parse($item['timestamp'])->toDateString() === $Fri->toDateString();
           });
            $SatAttend=array_filter($attendanceLog, function ($item)use ($Sat) {
            return Carbon::parse($item['timestamp'])->toDateString() === $Sat->toDateString();
           });
            $SunAttend=array_filter($attendanceLog, function ($item)use ($Sun) {
            return Carbon::parse($item['timestamp'])->toDateString() === $Sun->toDateString();
           });
         
             // Helper function to calculate work hours for a day
             function calculateWorkHours($dayAttendances, $employeeId = null) {
                 if (empty($dayAttendances)) {
                     return null;
                 }
                 
                 // Filter by employee if specified
                 if ($employeeId) {
                     $dayAttendances = array_filter($dayAttendances, function($item) use ($employeeId) {
                         return $item['id'] == $employeeId;
                     });
                 }
                 
                 if (empty($dayAttendances)) {
                     return null;
                 }
                 
                 // Group by employee ID
                 $groupedAttendances = [];
                 foreach ($dayAttendances as $attendance) {
                     $employeeId = $attendance['id'];
                     if (!isset($groupedAttendances[$employeeId])) {
                         $groupedAttendances[$employeeId] = [];
                     }
                     $groupedAttendances[$employeeId][] = $attendance;
                 }
                 
                 $results = [];
                 foreach ($groupedAttendances as $empId => $attendances) {
                     // Sort by timestamp
                     usort($attendances, function($a, $b) {
                         return strtotime($a['timestamp']) - strtotime($b['timestamp']);
                     });
                     
                     $isCorrect = true;
                     
                     // Check if first attendance is entry (type 0)
                     if (empty($attendances) || $attendances[0]['type'] != 0) {
                         $isCorrect = false;
                     }
                     // Check if last attendance is exit (type 1)
                     elseif (end($attendances)['type'] != 1) {
                         $isCorrect = false;
                     }
                     // Check if number of attendances is even
                     elseif (count($attendances) % 2 != 0) {
                         $isCorrect = false;
                     }
                     else {
                         // Check if alternating types (0,1,0,1...)
                         for ($i = 0; $i < count($attendances); $i++) {
                             if ($attendances[$i]['type'] != ($i % 2)) {
                                 $isCorrect = false;
                                 break;
                             }
                         }
                     }
                     
                     if ($isCorrect) {
                         $totalHours = 0;
                         $totalPause = 0;
                         
                         // Calculate work hours and pauses
                         for ($i = 0; $i < count($attendances) - 1; $i += 2) {
                             $entryTime = Carbon::parse($attendances[$i]['timestamp']);
                             $exitTime = Carbon::parse($attendances[$i + 1]['timestamp']);
                             
                             $totalHours += $entryTime->diffInMinutes($exitTime) / 60;
                             
                             // Calculate pause between this exit and next entry
                             if ($i + 2 < count($attendances)) {
                                 $nextEntryTime = Carbon::parse($attendances[$i + 2]['timestamp']);
                                 $totalPause += $exitTime->diffInMinutes($nextEntryTime);
                             }
                         }
                         
                         $workHour = new \stdClass();
                         $workHour->hours = round($totalHours, 2);
                         $workHour->pause = $totalPause;
                         $workHour->nbPause = count($attendances) / 2 - 1;
                         
                         $results[$empId] = $workHour;
                     } else {
                         $results[$empId] = null;
                     }
                 }
                 
                 return $results;
             }

            if($request->has('idUser')){
               $employe = Employee::select('id', 'first_name','last_name')
               ->where('id',$request->input('idUser'))
               ->get(); 
               
               $employe->map(function ($employe) {
                  $employe->MonHours = null; 
                  $employe->TueHours = null; 
                  $employe->WedHours = null; 
                  $employe->ThuHours = null; 
                  $employe->FriHours = null; 
                  $employe->SatHours = null; 
                  $employe->SunHours = null; 

                  return $employe;
                });
                
                // Calculate work hours for each day
                $monResults = calculateWorkHours($MonAttend, $request->input('idUser'));
                $tueResults = calculateWorkHours($TueAttend, $request->input('idUser'));
                $wedResults = calculateWorkHours($WedAttend, $request->input('idUser'));
                $thuResults = calculateWorkHours($ThuAttend, $request->input('idUser'));
                $friResults = calculateWorkHours($FriAttend, $request->input('idUser'));
                $satResults = calculateWorkHours($SatAttend, $request->input('idUser'));
                $sunResults = calculateWorkHours($SunAttend, $request->input('idUser'));
                
                $employe->map(function ($employe) use ($monResults, $tueResults, $wedResults, $thuResults, $friResults, $satResults, $sunResults) {
                    $employe->MonHours = $monResults[$employe->id] ?? null;
                    $employe->TueHours = $tueResults[$employe->id] ?? null;
                    $employe->WedHours = $wedResults[$employe->id] ?? null;
                    $employe->ThuHours = $thuResults[$employe->id] ?? null;
                    $employe->FriHours = $friResults[$employe->id] ?? null;
                    $employe->SatHours = $satResults[$employe->id] ?? null;
                    $employe->SunHours = $sunResults[$employe->id] ?? null;
                    
                    return $employe;
                });
              }
            else{
              $employe = Employee::select('id', 'first_name','last_name')->get();
               $employe->map(function ($employe) {
                  $employe->MonHours = null; 
                  $employe->TueHours = null; 
                  $employe->WedHours = null; 
                  $employe->ThuHours = null; 
                  $employe->FriHours = null; 
                  $employe->SatHours = null; 
                  $employe->SunHours = null; 

                  return $employe;
                });
                
                // Calculate work hours for each day for all employees
                $monResults = calculateWorkHours($MonAttend);
                $tueResults = calculateWorkHours($TueAttend);
                $wedResults = calculateWorkHours($WedAttend);
                $thuResults = calculateWorkHours($ThuAttend);
                $friResults = calculateWorkHours($FriAttend);
                $satResults = calculateWorkHours($SatAttend);
                $sunResults = calculateWorkHours($SunAttend);
                
                $employe->map(function ($employe) use ($monResults, $tueResults, $wedResults, $thuResults, $friResults, $satResults, $sunResults) {
                    $employe->MonHours = $monResults[$employe->id] ?? null;
                    $employe->TueHours = $tueResults[$employe->id] ?? null;
                    $employe->WedHours = $wedResults[$employe->id] ?? null;
                    $employe->ThuHours = $thuResults[$employe->id] ?? null;
                    $employe->FriHours = $friResults[$employe->id] ?? null;
                    $employe->SatHours = $satResults[$employe->id] ?? null;
                    $employe->SunHours = $sunResults[$employe->id] ?? null;
                    
                    return $employe;
                });
              }
             return response()->json([
                'success' => true,
                'logOfToday'=>array_values((array) $employe)
            ]);

        }
        catch(\Throwable $e){
             return response()->json([
                'success' => false,
                'message' => 'Error: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the type of an attendance record
     */
    public function updateAttendanceType(Request $request)
    {
        try {
            $uid = $request->input('uid');
            $type = $request->input('type');

            Log::info('Updating attendance type', [
                'uid' => $uid,
                'type' => $type,
                'request_data' => $request->all()
            ]);

            if (!isset($uid) || !isset($type)) {
                Log::warning('Missing parameters in updateAttendanceType', [
                    'uid' => $uid,
                    'type' => $type
                ]);
                return response()->json([
                    'success' => false,
                    'message' => 'Missing required parameters'
                ], 400);
            }

            // Validate type value
            if (!in_array($type, [0, 1, 2])) {
                Log::warning('Invalid attendance type', [
                    'type' => $type
                ]);
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid attendance type'
                ], 400);
            }

            $attendance = Attendance::find($uid);
            if (!$attendance) {
                Log::warning('Attendance record not found', [
                    'uid' => $uid
                ]);
                return response()->json([
                    'success' => false,
                    'message' => 'Attendance record not found'
                ], 404);
            }

            Log::info('Found attendance record', [
                'attendance' => $attendance->toArray()
            ]);

            $oldType = $attendance->type;
            $attendance->type = $type;
            $attendance->save();

            Log::info('Successfully updated attendance type', [
                'uid' => $uid,
                'old_type' => $oldType,
                'new_type' => $type
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Attendance type updated successfully',
                'data' => [
                    'uid' => $uid,
                    'old_type' => $oldType,
                    'new_type' => $type
                ]
            ]);

        } catch (\Throwable $e) {
            Log::error('Error updating attendance type', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Error: ' . $e->getMessage()
            ], 500);
        }
    }
}
