<?php

class LibraryApi {
	public function return_book($rest_of_path) {
		// Return the book and send a notification to first person in the hold list

		$book_id = $rest_of_path;

		$next_person = 'mx2awilson';
		$headline = "Library book on hold is available";
		$description = "A book you have on hold is now available ISBN: $book_id";
        $result = NotificationsApiManager::sendSisIdNotification($next_person, $headline, $headline, $description);

        header('Content-Type: application/json');
        echo json_encode($result);
	}
}
