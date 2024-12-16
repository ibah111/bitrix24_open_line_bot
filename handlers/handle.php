<?php
# test
# $url = $_GET["url"];
$url = "on_message_add";
echo $url."\n";

$serverUrl = 'http://balezin.usb.ru:4500/bot/';

if (filter_var($serverUrl, FILTER_VALIDATE_URL)) {
    echo "URL good!\n";
} else {
    echo "URL wrong!\n";
}

$requestUrl = $serverUrl . $url;
echo $requestUrl;

$ch = curl_init($requestUrl);
curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type:application/json'));
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($_REQUEST, JSON_UNESCAPED_UNICODE));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_HEADER, false);

$result = curl_exec($ch);

if (curl_errno($ch)) {
    echo 'Error: ' . curl_error($ch) . "\n";
} else {
    echo 'Server responce: ' . $response . "\n";
}
echo $result . "\n";

curl_close($ch);

?>
