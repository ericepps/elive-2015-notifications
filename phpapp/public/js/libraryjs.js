// Initialize EllucianMobileNotifications, which injects the needed hidden iframe
$(function() {
    var options = {
        applicationUrl: window.location.href,
        mobileserverBaseUrl: "https://elivemobileserver.datatel.com:8443/colleague-mobileserver"
    }
    EllucianMobileNotifications.initialize(options)
})

$(document).on('click', 'button.return-book', function(event){
    var $target = $(event.target)
    var book = $target.closest('.book')
    var bookId = book.attr('id')
    var onHoldUser = 'mx2awilson'
    var headline = 'Library book on hold is available'
    var description = 'A book you have on hold is now available ISBN: ' + bookId

    var notificationMessage = {
        recipients: [
            { idType: 'loginId', id: onHoldUser }
        ],
        mobileHeadline: headline,
        headline: headline,
        description: description,
        push: true
    }

    var promise = EllucianMobileNotifications.sendNotification(notificationMessage)

    promise.done(function(result) {
        // successfully sent
        var message = 'Returned book: ' + bookId + ' and sent a notification to ' + onHoldUser
        console.log(message)
        alert(message)
        $(book).hide()
    }).fail(function(result) {
        var message = 'Return book failed'
        console.log(message)
        alert(message)
    })

})
