<!DOCTYPE html>
<html>
<head>
    <title>Password Reset</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background-color: #4a90e2;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 5px 5px 0 0;
        }
        .content {
            background-color: #f9f9f9;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 0 0 5px 5px;
        }
        .credentials {
            background-color: #fff;
            border: 1px solid #ddd;
            padding: 15px;
            margin: 20px 0;
            border-radius: 5px;
        }
        .warning {
            color: #e74c3c;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Password Reset</h1>
    </div>
    
    <div class="content">
        <p>Hello,</p>
        
        <p>Your password has been reset. Here are your new login credentials:</p>
        
        <div class="credentials">
            <p><strong>Email:</strong> {{ $email }}</p>
            <p><strong>New Password:</strong> {{ $password }}</p>
        </div>
        
        <p class="warning">For security reasons, please change your password after logging in.</p>
        
        <p>If you did not request this password reset, please contact your system administrator immediately.</p>
        
        <p>Best regards,<br>HR Management System</p>
    </div>
</body>
</html> 