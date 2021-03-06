<?php

require dirname(__DIR__) . '/vendor/autoload.php';

if (function_exists('mb_internal_encoding') && ((int) ini_get('mbstring.func_overload')) & 2) {
    $mbEncoding = mb_internal_encoding();
    mb_internal_encoding('ASCII');
}

$params = $_POST;
if (!isset($params['name']) || empty($params['name'])) {
    die('please fill your name');
}
if (!isset($params['email']) || !filter_var($params['email'], FILTER_VALIDATE_EMAIL)) {
    die('please enter a valid email');
}
if (!isset($params['message']) || empty($params['message'])) {
    die('please fill your message');
}

$body = sprintf(
    '<html><body><h2>%s</h2><h4>%s</h4><p>%s</p></body></html>',
    $params['name'],
    $params['email'],
    $params['message']
);
$bodyPlain = sprintf(
    "## %s\n ### %s\n%s",
    $params['name'],
    $params['email'],
    $params['message']
);

$message = Swift_Message::newInstance('New juliangut.com contact')
    ->setFrom(array('no-reply@juliangut.com' => 'juliangut.com'))
    ->setTo(array('juliangut@gmail.com'))
    ->setBody($body, 'text/html')
    ->addPart($bodyPlain, 'text/plain');

try {
    $transport = Swift_MailTransport::newInstance();
    $mailer = Swift_Mailer::newInstance($transport);

    if ($mailer->send($message, $failures)) {
        echo 'sent';
    } else {
        die('please try again');
    }
} catch (\Swift_TransportException $e) {
    die($e->getMessage());
}

if (isset($mbEncoding)) {
    mb_internal_encoding($mbEncoding);
}
