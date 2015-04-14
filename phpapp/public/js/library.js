$(document).on('click', 'button.return-book', function(event){
	var $target = $(event.target)
    var book = $target.closest('.book')
    var bookId = book.attr('id')

    var phpReturnBookUrl = 'http://library.bret.edu:8999/api/library/return_book/' + bookId
    $.ajax({
        url:phpReturnBookUrl,
        type: 'POST',
        contentType: "application/json",
        dataType:"json",
    }).done(function (responseJson) {
        // check the status of the json response if present
        var message = 'Returned book: ' + bookId + ' and sent a notification to '
            + responseJson.notifications[0].recipients[0].id
        console.log(message)
        alert(message)
	    $(book).hide()
    }).fail(function (jqXHR, textStatus) {
        var message = 'Returned book failed for: ' + bookId
        console.log(message)
        alert(message)
    })
});
