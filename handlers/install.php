<?php
    $queryUrl = 'http://balezin.usb.ru:4500/bot/install';
    $ch = curl_init($queryUrl);
    curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type:application/json'));
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($_REQUEST, JSON_UNESCAPED_UNICODE));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HEADER, false);
    $result = curl_exec($ch);
    print_r($result);
    if ($result === false) {
        echo 'Ошибка cURL: ' . curl_error($ch);
    } else {
        print($result);
        echo $result;
    }

    curl_close($ch)
?>