<?php
date_default_timezone_set('Asia/Kolkata');

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Load PHPMailer classes
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';
require 'PHPMailer/src/Exception.php';

$env = parse_ini_file(__DIR__ . '/.env');
$smtpHost = $env['SMTP_HOST'];
$smtpPort = $env['SMTP_PORT'];
$smtpUser = $env['SMTP_USER'];
$smtpPass = $env['SMTP_PASS'];
$mailFrom = $env['MAIL_FROM'];
$mailTo   = $env['MAIL_TO'];

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // --- Collect and sanitize form data ---
    $fname = htmlspecialchars($_POST['fname'] ?? '');
    $lname = htmlspecialchars($_POST['lname'] ?? '');  
    $email = htmlspecialchars($_POST['email'] ?? '');
    $message = htmlspecialchars($_POST['message'] ?? '');
    

    // --- File upload logic ---
    $upload_dir = __DIR__ . '/uploads';
    if (!is_dir($upload_dir)) {
        mkdir($upload_dir, 0777, true);
    }

    $resume_path = "Not uploaded"; // default
    $file = $_FILES['resume'] ?? null;

    if ($file && $file['error'] == 0) {
        $file_type = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));

        if (in_array($file_type, ['pdf', 'doc', 'docx'])) {
            // Sanitize the first name for use in a filename
            $safe_fname = preg_replace('/[^A-Za-z0-9_-]/', '', strtolower($fname));

            // Create a unique filename
            $target = $upload_dir . DIRECTORY_SEPARATOR . $safe_fname . '_' . time() . '.' . $file_type;

            if (move_uploaded_file($file['tmp_name'], $target)) {
                $resume_path = $target;

                // ===== PHPMailer Code =====
                $mail = new PHPMailer(true);
                try {
                    // Server settings
                    $mail->isSMTP();
                    $mail->Host       = $smtpHost ;
                    $mail->SMTPAuth   = true;
                    $mail->Username   = $smtpUser ;
                    $mail->Password   = $smtpPass ; // Gmail App Password
                    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
                    $mail->Port       = $smtpPort;

                    // Recipients
                    $mail->setFrom($mailFrom, 'CADAmps');
                    $mail->addAddress($mailTo, 'HR Department');
                    $mail->addReplyTo($email, $fname . ' ' . $lname);

                    // Attachment
                    $mail->addAttachment($resume_path);

                    // Content
                    $mail->isHTML(true);
                    $mail->Subject = 'New Application Submitted';
                    $mail->Body    = "
                        <h3>New Applicant Details</h3>
                        <p><strong>First Name:</strong> {$fname}</p>
                        <p><strong>Last Name:</strong> {$lname}</p>
                        <p><strong>Email:</strong> {$email}</p>
                        <p><strong>Phone:</strong> {$message}</p>
                        
                    ";

                    $mail->send();
                } catch (Exception $e) {
                    error_log("PHPMailer Error: {$mail->ErrorInfo}");
                }
            } else {
                $resume_path = "Not uploaded (move failed)";
            }
        } else {
            $resume_path = "Not uploaded (invalid type)";
        }
    } else {
        $resume_path = "Not uploaded (upload error: " . ($file['error'] ?? 'no file') . ")";
    }

    // --- Save submission to a text file ---
    $data = "--- New Submission ---\n"
        . "Date: " . date("Y-m-d H:i:s") . "\n"
        . "First Name: $name"
        . "Email: $email"
        . "Message: $message"
       

    file_put_contents(__DIR__ . '/submissions.txt', $data, FILE_APPEND | LOCK_EX);

    // --- Redirect to thank you page ---
    header("Location: thank_you.html");
    exit();
} else {
    echo "Invalid request method.";
}
?>
