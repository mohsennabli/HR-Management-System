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
        $ip = $request->input('ip', '192.168.121.210'); // Default IP, replace or pass from Angular
        $port = $request->input('port', 4370);
        $lastLocalAttendance=Attendance::orderBy('uid','desc')->first();
        Log::error("lastLocalAttendance : " .json_encode( $lastLocalAttendance));
        $zk = new ZKTeco($ip, $port);

            if (!$zk->connect()) {
                return response()->json([
                    'success' => false,
                    'message' => "Unable to connect to device "
                ], 500);
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






    
    //liste pointage par jour
    public function getAllAttendanceOfToday(Request $request){
         $ip = $request->input('ip', '192.168.121.210'); // Default IP, replace or pass from Angular
        $port = $request->input('port', 4370);

              try {  
        $zk = new ZKTeco($ip, $port);

            if (!$zk->connect()) {
                return response()->json([
                    'success' => false,
                    'message' => "Unable to connect to device "
                ], 500);
            }
            Log::error("connected " .json_encode($ip));
              $attendanceLog =  Attendance::get()->toArray() ;
             $attendanceLog =array_map(   function ($item ) {
                $employe=Employee::find($item['id']);
               if($employe){

                   $department=Department::find($employe->departement_id);
                   $AddedVaue= ['employe_name'=> $employe->first_name+' '+$employe->last_name , 'departement_name'=> $department->name];
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
                $attendanceLog= array_filter($attendanceLog, function ($item) {
            return $item['id']==2; // Keep only strings
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
         $ip = $request->input('ip', '192.168.121.210'); // Default IP, replace or pass from Angular
        $port = $request->input('port', 4370);

               try {  
        $zk = new ZKTeco($ip, $port);

            if (!$zk->connect()) {
                return response()->json([
                    'success' => false,
                    'message' => "Unable to connect to device "
                ], 500);
            }
            $attendanceLog =  Attendance::get()->toArray() ;
             $attendanceLog =array_map(   function ($item ) {
                $employe=Employee::find($item['id']);
               if($employe){
                  
                   $department=Department::find($employe->departement_id);
                   $AddedVaue= ['employe_name'=> $employe->first_name+' '+$employe->last_name, 'departement_name'=> $department->name ];
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
             $MonAttend=array_filter($attendanceLog, function ($item)use ($Mon) {
               return Carbon::parse($item['timestamp'])->toDateString() === $Mon->toDateString(); // Keep only strings
             });
             $TueAttend=array_filter($attendanceLog, function ($item)use ($Tue) {
              return Carbon::parse($item['timestamp'])->toDateString() === $Tue->toDateString(); // Keep only strings
             });
            $WedAttend=array_filter($attendanceLog, function ($item)use ($Wed) {
            return Carbon::parse($item['timestamp'])->toDateString() === $Wed->toDateString(); // Keep only strings
           });
            $ThuAttend=array_filter($attendanceLog, function ($item)use ($Thu) {
            return Carbon::parse($item['timestamp'])->toDateString() === $Thu->toDateString(); // Keep only strings
           });
            $FriAttend=array_filter($attendanceLog, function ($item)use ($Fri) {
            return Carbon::parse($item['timestamp'])->toDateString() === $Fri->toDateString(); // Keep only strings
           });
            $SatAttend=array_filter($attendanceLog, function ($item)use ($Sat) {
            return Carbon::parse($item['timestamp'])->toDateString() === $Sat->toDateString(); // Keep only strings
           });
            $SunAttend=array_filter($attendanceLog, function ($item)use ($Sun) {
            return Carbon::parse($item['timestamp'])->toDateString() === $Sun->toDateString(); // Keep only strings
           });
         

            if($request->input('idUser')){
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
              $MonAttend= array_filter($MonAttend, function ($item) {
              return $item['id']==$request->input('idUser'); // Keep only strings
              });
              $TueAttend= array_filter($TueAttend, function ($item) {
              return $item['id']==$request->input('idUser'); // Keep only strings
              });
              $WedAttend= array_filter($WedAttend, function ($item) {
              return $item['id']==$request->input('idUser'); // Keep only strings
              });
              $ThuAttend= array_filter($ThuAttend, function ($item) {
              return $item['id']==$request->input('idUser'); // Keep only strings
              });
              $FriAttend= array_filter($FriAttend, function ($item) {
              return $item['id']==$request->input('idUser'); // Keep only strings
              });
              $SatAttend= array_filter($SatAttend, function ($item) {
              return $item['id']==$request->input('idUser'); // Keep only strings
              });
              $SunAttend= array_filter($SunAttend, function ($item) {
              return $item['id']==$request->input('idUser'); // Keep only strings
              });
                $employe->map(function ($employe) use ($MonAttend,$TueAttend,$WedAttend,$ThuAttend,$FriAttend,$SatAttend,$SunAttend) {
                          
                       if ($MonAttend->has($employe->id)) {
                          
                         
                            $value=array_values((array) $MonAttend[$employe->id])[0];
                            Log::error("mon : " .json_encode(($value)));
                           
                            $isCorrect=true;
                            //first Pointage Must be Enter
                            
                            if($value[0]['type']!=0){
                               Log::error("mon false : " .json_encode(count($value)));

                              $isCorrect=false;
                              $employe->MonHours=null;
                            }
                            else{

                            
                            // Last pointage must be Quit
                              if($value[count($value)-1]['type']!=1){
                                $isCorrect=false;
                               $employe->MonHours=null;
                              }
                              else{

                            
                            //number of pointage must be pair
                              if(count($value)%2!=0){
                                $isCorrect=false;
                               $employe->MonHours=null;
                              }
                              else{

                            
                            $hour=0;
                            $pause=0;
                            //each two related pointage must have different type
                            for ($i = count($value)-1; $i >0; $i -= 2) {
                                if($value[$i]['type']==$value[$i-1]['type']){
                                   $isCorrect=false;
                                   $employe->MonHours=null;
                                   break;
                                }
                             //   $hour+=(($value[$i]['timestamp'])->diffInMinutes(($value[$i-1]['timestamp'])))/60;

                                $hour+=(Carbon::parse($value[$i]['timestamp'])->diffInMinutes(Carbon::parse($value[$i-1]['timestamp'])))/60;
                                if($i==1){
                                   continue;
                                }
                                $pause+=(Carbon::parse($value[$i-1]['timestamp'])->diffInMinutes(Carbon::parse($value[$i-2]['timestamp'])));
                            }
                            $NbPause=count($value)/2-1;

                            $workHour = new \stdClass();
                            $workHour->hours = $hour;
                            $workHour->pause = $pause;
                            $workHour->nbPause = $NbPause;
                            $employe->MonHours =$isCorrect?$workHour:null ;
                            }
                            }
                            }
                       } 
                       if ($TueAttend->has($employe->id)) {
                                $value=array_values((array) $TueAttend[$employe->id])[0];
                            Log::error("tue : " .json_encode(($value[0])));
                           
                            $isCorrect=true;
                            //first Pointage Must be Enter
                            
                            if($value[0]['type']!=0){
                               Log::error("tue false : " .json_encode(count($value)));

                              $isCorrect=false;
                              $employe->TueHours=null;
                            }
                            else{

                            
                            // Last pointage must be Quit
                              if($value[count($value)-1]['type']!=1){
                                $isCorrect=false;
                               $employe->TueHours=null;
                              }
                              else{

                            
                            //number of pointage must be pair
                              if(count($value)%2!=0){
                                $isCorrect=false;
                               $employe->TueHours=null;
                              }
                              else{

                            
                            $hour=0;
                            $pause=0;
                            //each two related pointage must have different type
                            for ($i = count($value)-1; $i >0; $i-=2) {
                                if($value[$i]['type']==$value[$i-1]['type']){
                                   $isCorrect=false;
                                   $employe->TueHours=null;
                                   break;
                                }
                                 $hour+=(Carbon::parse($value[$i]['timestamp'])->diffInMinutes(Carbon::parse($value[$i-1]['timestamp'])))/60;
                                if($i==1){
                                   continue;
                                }
                                $pause+=(Carbon::parse($value[$i-1]['timestamp'])->diffInMinutes(Carbon::parse($value[$i-2]['timestamp'])));
                            }
                            $NbPause=count($value)/2-1;

                            $workHour = new \stdClass();
                            $workHour->hours = $hour;
                            $workHour->pause = $pause;
                            $workHour->nbPause = $NbPause;
                            $employe->TueHours =$isCorrect?$workHour:null ;
                            }
                            }
                            }
                       } 
                       if ($WedAttend->has($employe->id)) {
                               $value=array_values((array) $WedAttend[$employe->id])[0];
                            Log::error("wed : " .json_encode(($value)));
                           
                            $isCorrect=true;
                            //first Pointage Must be Enter
                            
                            if($value[0]['type']!=0){
                               Log::error("wed false : " .json_encode(count($value)));

                              $isCorrect=false;
                              $employe->WedHours=null;
                            }
                            else{

                            
                            // Last pointage must be Quit
                              if($value[count($value)-1]['type']!=1){
                                $isCorrect=false;
                               $employe->WedHours=null;
                              }
                              else{

                            
                            //number of pointage must be pair
                              if(count($value)%2!=0){
                                $isCorrect=false;
                               $employe->WedHours=null;
                              }
                              else{

                            
                            $hour=0;
                            $pause=0;
                            //each two related pointage must have different type
                            for ($i = count($value)-1; $i >0; $i-=2) {
                                if($value[$i]['type']==$value[$i-1]['type']){
                                   $isCorrect=false;
                                   $employe->WedHours=null;
                                   break;
                                }
                                $hour+=(Carbon::parse($value[$i]['timestamp'])->diffInMinutes(Carbon::parse($value[$i-1]['timestamp'])))/60;
                                if($i==1){
                                   continue;
                                }
                                $pause+=(Carbon::parse($value[$i-1]['timestamp'])->diffInMinutes(Carbon::parse($value[$i-2]['timestamp'])));
                            }
                            $NbPause=count($value)/2-1;

                            $workHour = new \stdClass();
                            $workHour->hours = $hour;
                            $workHour->pause = $pause;
                            $workHour->nbPause = $NbPause;
                            $employe->WedHours =$isCorrect?$workHour:null ;
                            }
                            }
                            }
                       } 
                       if ($ThuAttend->has($employe->id)) {
                               $value=array_values((array) $ThuAttend[$employe->id])[0];
                            Log::error("thu : " .json_encode(($value[0])));
                           
                            $isCorrect=true;
                            //first Pointage Must be Enter
                            
                            if($value[0]['type']!=0){
                               Log::error("thu false : " .json_encode(count($value)));

                              $isCorrect=false;
                              $employe->ThuHours=null;
                            }
                            else{

                            
                            // Last pointage must be Quit
                              if($value[count($value)-1]['type']!=1){
                                $isCorrect=false;
                               $employe->ThuHours=null;
                              }
                              else{

                            
                            //number of pointage must be pair
                              if(count($value)%2!=0){
                                $isCorrect=false;
                               $employe->ThuHours=null;
                              }
                              else{

                            
                            $hour=0;
                            $pause=0;
                            //each two related pointage must have different type
                            for ($i = count($value)-1; $i >0; $i-=2) {
                                if($value[$i]['type']==$value[$i-1]['type']){
                                   $isCorrect=false;
                                   $employe->ThuHours=null;
                                   break;
                                }
                                $hour+=(Carbon::parse($value[$i]['timestamp'])->diffInMinutes(Carbon::parse($value[$i-1]['timestamp'])))/60;
                                if($i==1){
                                   continue;
                                }
                                $pause+=(Carbon::parse($value[$i-1]['timestamp'])->diffInMinutes(Carbon::parse($value[$i-2]['timestamp'])));
                            }
                            $NbPause=count($value)/2-1;

                            $workHour = new \stdClass();
                            $workHour->hours = $hour;
                            $workHour->pause = $pause;
                            $workHour->nbPause = $NbPause;
                            $employe->ThuHours =$isCorrect?$workHour:null ;
                            }
                            }
                            }
                       } 
                       if ($FriAttend->has($employe->id)) {
                                $value=array_values((array) $FriAttend[$employe->id])[0];
                            Log::error("fri : " .json_encode(($value[0])));
                           
                            $isCorrect=true;
                            //first Pointage Must be Enter
                            
                            if($value[0]['type']!=0){
                               Log::error("fri false : " .json_encode(count($value)));

                              $isCorrect=false;
                              $employe->FriHours=null;
                            }
                            else{

                            
                            // Last pointage must be Quit
                              if($value[count($value)-1]['type']!=1){
                                $isCorrect=false;
                               $employe->FriHours=null;
                              }
                              else{

                            
                            //number of pointage must be pair
                              if(count($value)%2!=0){
                                $isCorrect=false;
                               $employe->FriHours=null;
                              }
                              else{

                            
                            $hour=0;
                            $pause=0;
                            //each two related pointage must have different type
                            for ($i = count($value)-1; $i >0; $i-=2) {
                                if($value[$i]['type']==$value[$i-1]['type']){
                                   $isCorrect=false;
                                   $employe->FriHours=null;
                                   break;
                                }
                                $hour+=(Carbon::parse($value[$i]['timestamp'])->diffInMinutes(Carbon::parse($value[$i-1]['timestamp'])))/60;
                                if($i==1){
                                   continue;
                                }
                                $pause+=(Carbon::parse($value[$i-1]['timestamp'])->diffInMinutes(Carbon::parse($value[$i-2]['timestamp'])));
                            }
                            $NbPause=count($value)/2-1;

                            $workHour = new \stdClass();
                            $workHour->hours = $hour;
                            $workHour->pause = $pause;
                            $workHour->nbPause = $NbPause;
                            $employe->FriHours =$isCorrect?$workHour:null ;
                            }
                            }
                            }
                       } 
                       if ($SatAttend->has($employe->id)) {
                               $value=array_values((array) $SatAttend[$employe->id])[0];
                            Log::error("sat : " .json_encode(($value[0])));
                           
                            $isCorrect=true;
                            //first Pointage Must be Enter
                            
                            if($value[0]['type']!=0){
                               Log::error("sat false : " .json_encode(count($value)));

                              $isCorrect=false;
                              $employe->SatHours=null;
                            }
                            else{

                            
                            // Last pointage must be Quit
                              if($value[count($value)-1]['type']!=1){
                                $isCorrect=false;
                               $employe->SatHours=null;
                              }
                              else{

                            
                            //number of pointage must be pair
                              if(count($value)%2!=0){
                                $isCorrect=false;
                               $employe->SatHours=null;
                              }
                              else{

                            
                            $hour=0;
                            $pause=0;
                            //each two related pointage must have different type
                            for ($i = count($value)-1; $i >0; $i-=2) {
                                if($value[$i]['type']==$value[$i-1]['type']){
                                   $isCorrect=false;
                                   $employe->SatHours=null;
                                   break;
                                }
                                 $hour+=(Carbon::parse($value[$i]['timestamp'])->diffInMinutes(Carbon::parse($value[$i-1]['timestamp'])))/60;
                                if($i==1){
                                   continue;
                                }
                                $pause+=(Carbon::parse($value[$i-1]['timestamp'])->diffInMinutes(Carbon::parse($value[$i-2]['timestamp'])));
                            }
                            $NbPause=count($value)/2-1;

                            $workHour = new \stdClass();
                            $workHour->hours = $hour;
                            $workHour->pause = $pause;
                            $workHour->nbPause = $NbPause;
                            $employe->SatHours =$isCorrect?$workHour:null ;
                            }
                            }
                            }
                       } 
                       if ($SunAttend->has($employe->id)) {
                               $value=array_values((array) $SunAttend[$employe->id])[0];
                            Log::error("sun : " .json_encode(($value[0])));
                           
                            $isCorrect=true;
                            //first Pointage Must be Enter
                            
                            if($value[0]['type']!=0){
                               Log::error("sun false : " .json_encode(count($value)));

                              $isCorrect=false;
                              $employe->SunHours=null;
                            }
                            else{

                            
                            // Last pointage must be Quit
                              if($value[count($value)-1]['type']!=1){
                                $isCorrect=false;
                               $employe->SunHours=null;
                              }
                              else{

                            
                            //number of pointage must be pair
                              if(count($value)%2!=0){
                                $isCorrect=false;
                               $employe->SunHours=null;
                              }
                              else{

                            
                            $hour=0;
                            $pause=0;
                            //each two related pointage must have different type
                            for ($i = count($value)-1; $i >0; $i-=2) {
                                if($value[$i]['type']==$value[$i-1]['type']){
                                   $isCorrect=false;
                                   $employe->SunHours=null;
                                   break;
                                }
                            $hour+=(Carbon::parse($value[$i]['timestamp'])->diffInMinutes(Carbon::parse($value[$i-1]['timestamp'])))/60;
                                if($i==1){
                                   continue;
                                }
                                $pause+=(Carbon::parse($value[$i-1]['timestamp'])->diffInMinutes(Carbon::parse($value[$i-2]['timestamp'])));
                            }
                            $NbPause=count($value)/2-1;

                            $workHour = new \stdClass();
                            $workHour->hours = $hour;
                            $workHour->pause = $pause;
                            $workHour->nbPause = $NbPause;
                            $employe->SunHours =$isCorrect?$workHour:null ;
                            }
                            }
                            }
                       } 
                       return $employe;
                       });
              }
            else{
               $employe = Employee::select('id', 'nom')->get();
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
              $MonAttend=collect($MonAttend)->groupBy("id");
              $TueAttend=collect($TueAttend)->groupBy("id");
              $WedAttend=collect($WedAttend)->groupBy("id");
              $ThuAttend=collect($ThuAttend)->groupBy("id");
              $FriAttend=collect($FriAttend)->groupBy("id");
              $SatAttend=collect($SatAttend)->groupBy("id");
              $SunAttend=collect($SunAttend)->groupBy("id");
              
            
              $employe->map(function ($employe) use ($MonAttend,$TueAttend,$WedAttend,$ThuAttend,$FriAttend,$SatAttend,$SunAttend) {
                          
                       if ($MonAttend->has($employe->id)) {
                          
                         
                            $value=array_values((array) $MonAttend[$employe->id])[0];
                            Log::error("mon : " .json_encode(($value)));
                           
                            $isCorrect=true;
                            //first Pointage Must be Enter
                            
                            if($value[0]['type']!=0){
                               Log::error("mon false : " .json_encode(count($value)));

                              $isCorrect=false;
                              $employe->MonHours=null;
                            }
                            else{

                            
                            // Last pointage must be Quit
                              if($value[count($value)-1]['type']!=1){
                                $isCorrect=false;
                               $employe->MonHours=null;
                              }
                              else{

                            
                            //number of pointage must be pair
                              if(count($value)%2!=0){
                                $isCorrect=false;
                               $employe->MonHours=null;
                              }
                              else{

                            
                            $hour=0;
                            $pause=0;
                            //each two related pointage must have different type
                            for ($i = count($value)-1; $i >0; $i -= 2) {
                                if($value[$i]['type']==$value[$i-1]['type']){
                                   $isCorrect=false;
                                   $employe->MonHours=null;
                                   break;
                                }
                             //   $hour+=(($value[$i]['timestamp'])->diffInMinutes(($value[$i-1]['timestamp'])))/60;

                                $hour+=(Carbon::parse($value[$i]['timestamp'])->diffInMinutes(Carbon::parse($value[$i-1]['timestamp'])))/60;
                                if($i==1){
                                   continue;
                                }
                                $pause+=(Carbon::parse($value[$i-1]['timestamp'])->diffInMinutes(Carbon::parse($value[$i-2]['timestamp'])));
                            }
                            $NbPause=count($value)/2-1;

                            $workHour = new \stdClass();
                            $workHour->hours = $hour;
                            $workHour->pause = $pause;
                            $workHour->nbPause = $NbPause;
                            $employe->MonHours =$isCorrect?$workHour:null ;
                            }
                            }
                            }
                       } 
                       if ($TueAttend->has($employe->id)) {
                                $value=array_values((array) $TueAttend[$employe->id])[0];
                            Log::error("tue : " .json_encode(($value[0])));
                           
                            $isCorrect=true;
                            //first Pointage Must be Enter
                            
                            if($value[0]['type']!=0){
                               Log::error("tue false : " .json_encode(count($value)));

                              $isCorrect=false;
                              $employe->TueHours=null;
                            }
                            else{

                            
                            // Last pointage must be Quit
                              if($value[count($value)-1]['type']!=1){
                                $isCorrect=false;
                               $employe->TueHours=null;
                              }
                              else{

                            
                            //number of pointage must be pair
                              if(count($value)%2!=0){
                                $isCorrect=false;
                               $employe->TueHours=null;
                              }
                              else{

                            
                            $hour=0;
                            $pause=0;
                            //each two related pointage must have different type
                            for ($i = count($value)-1; $i >0; $i-=2) {
                                if($value[$i]['type']==$value[$i-1]['type']){
                                   $isCorrect=false;
                                   $employe->TueHours=null;
                                   break;
                                }
                                 $hour+=(Carbon::parse($value[$i]['timestamp'])->diffInMinutes(Carbon::parse($value[$i-1]['timestamp'])))/60;
                                if($i==1){
                                   continue;
                                }
                                $pause+=(Carbon::parse($value[$i-1]['timestamp'])->diffInMinutes(Carbon::parse($value[$i-2]['timestamp'])));
                            }
                            $NbPause=count($value)/2-1;

                            $workHour = new \stdClass();
                            $workHour->hours = $hour;
                            $workHour->pause = $pause;
                            $workHour->nbPause = $NbPause;
                            $employe->TueHours =$isCorrect?$workHour:null ;
                            }
                            }
                            }
                       } 
                       if ($WedAttend->has($employe->id)) {
                               $value=array_values((array) $WedAttend[$employe->id])[0];
                            Log::error("wed : " .json_encode(($value)));
                           
                            $isCorrect=true;
                            //first Pointage Must be Enter
                            
                            if($value[0]['type']!=0){
                              

                              $isCorrect=false;
                              $employe->WedHours=null;
                            }
                            else{

                            
                            // Last pointage must be Quit
                              if($value[count($value)-1]['type']!=1){
                                $isCorrect=false;
                               $employe->WedHours=null;
                              }
                              else{
                               
                            
                            //number of pointage must be pair
                              if(count($value)%2!=0){
                                $isCorrect=false;
                               $employe->WedHours=null;
                              }
                              else{
                           
                            
                            $hour=0;
                            $pause=0;
                            //each two related pointage must have different type
                            for ($i = count($value)-1; $i >0; $i-=2) {
                                if($value[$i]['type']==$value[$i-1]['type']){
                                   $isCorrect=false;
                                   $employe->WedHours=null;
                                   
                                   Log::error("wed true : " .json_encode(count($value))); 
                                   break;
                                }
                                $hour+=(Carbon::parse($value[$i]['timestamp'])->diffInMinutes(Carbon::parse($value[$i-1]['timestamp'])))/60;
                                if($i==1){
                                   continue;
                                }
                                $pause+=(Carbon::parse($value[$i-1]['timestamp'])->diffInMinutes(Carbon::parse($value[$i-2]['timestamp'])));
                            }
                            $NbPause=count($value)/2-1;
                            $workHour = new \stdClass();
                            $workHour->hours = $hour;
                            $workHour->pause = $pause;
                            $workHour->nbPause = $NbPause;
                            $employe->WedHours =$isCorrect?$workHour:null ;
                            }
                            }
                            }
                       } 
                       if ($ThuAttend->has($employe->id)) {
                               $value=array_values((array) $ThuAttend[$employe->id])[0];
                            Log::error("thu : " .json_encode(($value[0])));
                           
                            $isCorrect=true;
                            //first Pointage Must be Enter
                            
                            if($value[0]['type']!=0){
                               Log::error("thu false : " .json_encode(count($value)));

                              $isCorrect=false;
                              $employe->ThuHours=null;
                            }
                            else{

                            
                            // Last pointage must be Quit
                              if($value[count($value)-1]['type']!=1){
                                $isCorrect=false;
                               $employe->ThuHours=null;
                              }
                              else{

                            
                            //number of pointage must be pair
                              if(count($value)%2!=0){
                                $isCorrect=false;
                               $employe->ThuHours=null;
                              }
                              else{

                            
                            $hour=0;
                            $pause=0;
                            //each two related pointage must have different type
                            for ($i = count($value)-1; $i >0; $i-=2) {
                                if($value[$i]['type']==$value[$i-1]['type']){
                                   $isCorrect=false;
                                   $employe->ThuHours=null;
                                   break;
                                }
                                $hour+=(Carbon::parse($value[$i]['timestamp'])->diffInMinutes(Carbon::parse($value[$i-1]['timestamp'])))/60;
                                if($i==1){
                                   continue;
                                }
                                $pause+=(Carbon::parse($value[$i-1]['timestamp'])->diffInMinutes(Carbon::parse($value[$i-2]['timestamp'])));
                            }
                            $NbPause=count($value)/2-1;

                            $workHour = new \stdClass();
                            $workHour->hours = $hour;
                            $workHour->pause = $pause;
                            $workHour->nbPause = $NbPause;
                            $employe->ThuHours =$isCorrect?$workHour:null ;
                            }
                            }
                            }
                       } 
                       if ($FriAttend->has($employe->id)) {
                                $value=array_values((array) $FriAttend[$employe->id])[0];
                            Log::error("fri : " .json_encode(($value[0])));
                           
                            $isCorrect=true;
                            //first Pointage Must be Enter
                            
                            if($value[0]['type']!=0){
                               Log::error("fri false : " .json_encode(count($value)));

                              $isCorrect=false;
                              $employe->FriHours=null;
                            }
                            else{

                            
                            // Last pointage must be Quit
                              if($value[count($value)-1]['type']!=1){
                                $isCorrect=false;
                               $employe->FriHours=null;
                              }
                              else{

                            
                            //number of pointage must be pair
                              if(count($value)%2!=0){
                                $isCorrect=false;
                               $employe->FriHours=null;
                              }
                              else{

                            
                            $hour=0;
                            $pause=0;
                            //each two related pointage must have different type
                            for ($i = count($value)-1; $i >0; $i-=2) {
                                if($value[$i]['type']==$value[$i-1]['type']){
                                   $isCorrect=false;
                                   $employe->FriHours=null;
                                   break;
                                }
                                $hour+=(Carbon::parse($value[$i]['timestamp'])->diffInMinutes(Carbon::parse($value[$i-1]['timestamp'])))/60;
                                if($i==1){
                                   continue;
                                }
                                $pause+=(Carbon::parse($value[$i-1]['timestamp'])->diffInMinutes(Carbon::parse($value[$i-2]['timestamp'])));
                            }
                            $NbPause=count($value)/2-1;

                            $workHour = new \stdClass();
                            $workHour->hours = $hour;
                            $workHour->pause = $pause;
                            $workHour->nbPause = $NbPause;
                            $employe->FriHours =$isCorrect?$workHour:null ;
                            }
                            }
                            }
                       } 
                       if ($SatAttend->has($employe->id)) {
                               $value=array_values((array) $SatAttend[$employe->id])[0];
                            Log::error("sat : " .json_encode(($value[0])));
                           
                            $isCorrect=true;
                            //first Pointage Must be Enter
                            
                            if($value[0]['type']!=0){
                               Log::error("sat false : " .json_encode(count($value)));

                              $isCorrect=false;
                              $employe->SatHours=null;
                            }
                            else{

                            
                            // Last pointage must be Quit
                              if($value[count($value)-1]['type']!=1){
                                $isCorrect=false;
                               $employe->SatHours=null;
                              }
                              else{

                            
                            //number of pointage must be pair
                              if(count($value)%2!=0){
                                $isCorrect=false;
                               $employe->SatHours=null;
                              }
                              else{

                            
                            $hour=0;
                            $pause=0;
                            //each two related pointage must have different type
                            for ($i = count($value)-1; $i >0; $i-=2) {
                                if($value[$i]['type']==$value[$i-1]['type']){
                                   $isCorrect=false;
                                   $employe->SatHours=null;
                                   break;
                                }
                                 $hour+=(Carbon::parse($value[$i]['timestamp'])->diffInMinutes(Carbon::parse($value[$i-1]['timestamp'])))/60;
                                if($i==1){
                                   continue;
                                }
                                $pause+=(Carbon::parse($value[$i-1]['timestamp'])->diffInMinutes(Carbon::parse($value[$i-2]['timestamp'])));
                            }
                            $NbPause=count($value)/2-1;

                            $workHour = new \stdClass();
                            $workHour->hours = $hour;
                            $workHour->pause = $pause;
                            $workHour->nbPause = $NbPause;
                            $employe->SatHours =$isCorrect?$workHour:null ;
                            }
                            }
                            }
                       } 
                       if ($SunAttend->has($employe->id)) {
                               $value=array_values((array) $SunAttend[$employe->id])[0];
                            Log::error("sun : " .json_encode(($value[0])));
                           
                            $isCorrect=true;
                            //first Pointage Must be Enter
                            
                            if($value[0]['type']!=0){
                               Log::error("sun false : " .json_encode(count($value)));

                              $isCorrect=false;
                              $employe->SunHours=null;
                            }
                            else{

                            
                            // Last pointage must be Quit
                              if($value[count($value)-1]['type']!=1){
                                $isCorrect=false;
                               $employe->SunHours=null;
                              }
                              else{

                            
                            //number of pointage must be pair
                              if(count($value)%2!=0){
                                $isCorrect=false;
                               $employe->SunHours=null;
                              }
                              else{

                            
                            $hour=0;
                            $pause=0;
                            //each two related pointage must have different type
                            for ($i = count($value)-1; $i >0; $i-=2) {
                                if($value[$i]['type']==$value[$i-1]['type']){
                                   $isCorrect=false;
                                   $employe->SunHours=null;
                                   break;
                                }
                            $hour+=(Carbon::parse($value[$i]['timestamp'])->diffInMinutes(Carbon::parse($value[$i-1]['timestamp'])))/60;
                                if($i==1){
                                   continue;
                                }
                                $pause+=(Carbon::parse($value[$i-1]['timestamp'])->diffInMinutes(Carbon::parse($value[$i-2]['timestamp'])));
                            }
                            $NbPause=count($value)/2-1;

                            $workHour = new \stdClass();
                            $workHour->hours = $hour;
                            $workHour->pause = $pause;
                            $workHour->nbPause = $NbPause;
                            $employe->SunHours =$isCorrect?$workHour:null ;
                            }
                            }
                            }
                       } 
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
}
