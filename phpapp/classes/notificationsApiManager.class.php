<?php

class NotificationsApiManager {
	private static $mobileServerNotificationsUrl = "https://elivemobileserver.datatel.com:8443/colleague-mobileserver/api/notification/notifications/";
	private static $applicationName = "library";
	private static $applicationApiKey = "secret";

    public static function sendSisIdNotification($to, $mobileHeadline, $headline, $description) {
		error_log("Sending message to: $to");
        $message = array(
            'recipients' => array (
                array (
                    'idType' => 'loginId',
                    'id' => $to
                )
            ),
            'mobileHeadline' => $mobileHeadline,
            'headline' => $headline,
            'description' => $description,
            'push' => true
        );

       return self::sendNotification($message);
    }

	public static function sendNotification($message) {
		$json_message = json_encode($message);
		return self::sendJsonNotification($json_message);
	}

	public static function sendJsonNotification($json_message) {
		error_log("Sending message through: ".self::$mobileServerNotificationsUrl);
		error_log("applicationName: ".self::$applicationName);
		error_log("applicationApiKey: ".self::$applicationApiKey);

		$curl = curl_init();

		curl_setopt($curl, CURLOPT_VERBOSE, true);
		curl_setopt($curl, CURLOPT_URL, self::$mobileServerNotificationsUrl);
		curl_setopt($curl, CURLOPT_POST, true);

		curl_setopt($curl, CURLOPT_POSTFIELDS, $json_message);
		curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
		curl_setopt($curl, CURLOPT_HTTPHEADER, array(
			'Content-Type: application/json',
			'Content-Length: ' . strlen($json_message))
		);
		curl_setopt($curl, CURLOPT_USERPWD, self::$applicationName.':'.self::$applicationApiKey);

		$json_result = curl_exec($curl);
		$status_code = curl_getinfo($curl, CURLINFO_HTTP_CODE);
		error_log("status_code : $status_code");
		curl_close($curl);

        $result = json_decode($json_result);

        return $result;
	}
}
