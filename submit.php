<?php
date_default_timezone_set('Asia/Kolkata');

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Load PHPMailer classes
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';
require 'PHPMailer/src/Exception.php';

// Load .env file
$env = parse_ini_file(__DIR__ . '/.env');

$smtpHost = $env['SMTP_HOST'];
$smtpPort = $env['SMTP_PORT'];
$smtpUser = $env['SMTP_USER'];
$smtpPass = $env['SMTP_PASS'];
$mailFrom = $env['MAIL_FROM'];
$mailTo   = $env['MAIL_TO'];   // multiple emails allowed: email1,email2,email3

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // Collect form data
    $name    = htmlspecialchars($_POST['name'] ?? '');
    $email   = htmlspecialchars($_POST['email'] ?? '');
    $message = htmlspecialchars($_POST['message'] ?? '');

    // Create upload directory
    $upload_dir = __DIR__ . '/uploads';
    if (!is_dir($upload_dir)) {
        mkdir($upload_dir, 0777, true);
    }

    $resume_path = null;
    $file = $_FILES['resume'] ?? null;

    // Handle file upload
    if ($file && $file['error'] == 0) {

        $file_type = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));

        if (in_array($file_type, ['pdf', 'doc', 'docx'])) {

            // Clean name for filename
            $safe_name = preg_replace('/[^A-Za-z0-9_-]/', '', strtolower($name));

            // Target file name
            $target = $upload_dir . '/' . $safe_name . '_' . time() . '.' . $file_type;

            if (move_uploaded_file($file['tmp_name'], $target)) {
                $resume_path = $target;
            }
        }
    }

    // Send Email
    $mail = new PHPMailer(true);

    try {
        // SMTP Setup
        $mail->isSMTP();
        $mail->Host       = $smtpHost;
        $mail->SMTPAuth   = true;
        $mail->Username   = $smtpUser;
        $mail->Password   = $smtpPass;
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port       = $smtpPort;

        // Email headers
        $mail->setFrom($mailFrom, 'Website Form');

        // 🔥 Add multiple recipients
        $emails = array_map('trim', explode(',', $mailTo));
        foreach ($emails as $e) {
            if (!empty($e)) {
                $mail->addAddress($e);
            }
        }

        // Reply-To
        if ($email) {
            $mail->addReplyTo($email, $name);
        }

        // Add attachment if exists
        if ($resume_path) {
            $mail->addAttachment($resume_path);
        }

        // Email Body
        $mail->isHTML(true);
        $mail->Subject = "New Form Submission";

        $mail->Body = "
            <h2>Orezilla - New Form Submission</h2>
            <p><strong>Name:</strong> $name</p>
            <p><strong>Email:</strong> $email</p>
            <p><strong>Message:</strong> $message</p>
        ";

        $mail->send();

    } catch (Exception $e) {
        error_log("Mailer Error: " . $mail->ErrorInfo);
    }

    // Save log entry
    $data =
        "--- New Submission ---\n" .
        "Date: " . date("Y-m-d H:i:s") . "\n" .
        "Name: $name\n" .
        "Email: $email\n" .
        "Message: $message\n\n";

    file_put_contents(__DIR__ . '/submissions.txt', $data, FILE_APPEND | LOCK_EX);

    // Redirect
    header("Location: thank_you.html");
    exit();

} else {
    echo "Invalid request method.";
}
?>
