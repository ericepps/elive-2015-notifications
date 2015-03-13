<?php

class NotificationsApi {
	public function send($rest_of_path) {
		$json_message = file_get_contents('php://input');

        $result = NotificationsApiManager::sendJsonNotification($json_message);

        header('Content-Type: application/json');
        echo json_encode($result);
	}
}
