//  Copyright (c) 2012-2014 Ellucian. All rights reserved.

window.notificationScriptUrl = document.currentScript.src

window.EllucianMobileNotificationsIframe = (function() {
    internal = {
        _applicationUrl: null,
        _notificationAPIPath: '/api/notification/notifications',
        _mobileServerBaseUrl: 'https://elivemobileserver.datatel.com:8443/colleague-mobileserver',
        _applicationName: 'library',
        _apiKey: 'secret'
    }

    public = {
        sendResult: function(deferredId, status, result) {
            var resultMessage = {
                deferredId: deferredId,
                status: status,
                result: result
            }

            window.parent.postMessage(resultMessage, internal._applicationUrl)
        },
        sendNotification: function(data) {
            internal._applicationUrl = data.applicationUrl
            var deferredId = data.deferredId
            var message = data.message

            var result = null

            // verify required message attributes are in the message
            if (!internal._mobileServerBaseUrl) {
                result = {
                    status: "failed",
                    error: "MissingAttribute",
                    message: "Missing mobileServerBaseUrl"
                }
            } else if (!internal._applicationName) {
                result = {
                    status: "failed",
                    error: "MissingAttribute",
                    message: "Missing applicationName"
                }
            } else if (!internal._apiKey) {
                result = {
                    status: "failed",
                    error: "MissingAttribute",
                    message: "Missing apiKey"
                }
            } else if (!("recipients" in message) ||
                       Object.keys(message.recipients).length == 0 ){
                result = {
                    status: "failed",
                    error: "MissingAttribute",
                    message: "Missing recipients"
                }
            } else if (!("mobileHeadline" in message)) {
                result = {
                    status: "failed",
                    error: "MissingAttribute",
                    message: "Missing mobileHeadline"
                }
            } else if (!window.jQuery) {
                result = {
                    status: "failed",
                    error: "MissingDependency",
                    message: "JQuery missing - EllucianMobileNotification depends on JQuery"
                }
            } else {
                // send the notification
                var notificationUrl = internal._mobileServerBaseUrl + internal._notificationAPIPath
                var userPassEncoded = btoa(internal._applicationName + ":" + internal._apiKey)
                var ellucianMobileNotificationsIframe = this // need a handle to call sendResult
                console.log('Sending notification via ajax "' + JSON.stringify(message) + '"')
                $.ajax({
                    url:notificationUrl,
                    type: 'POST',
                    data: JSON.stringify(message),
                    contentType: "application/json",
                    dataType:"json",
                    username: internal._applicationName,
                    password: internal._apiKey,
                    headers: {
                        "Authorization": "Basic " + userPassEncoded
                    }
                }).done(function (responseJson) {
                    // check the status of the json response if present
                    if (responseJson.status == "NotAuthorized") {
                        result = {
                            status: "failed",
                            error: "NotAuthorized",
                            message: "Not Authorized"
                        }
                        ellucianMobileNotificationsIframe.sendResult(deferredId, result.status, result)
                        console.log('Send notification failed "' + result.message + '"')
                    } else {
                        result = {
                            status: "success"
                        }
                        ellucianMobileNotificationsIframe.sendResult(deferredId, result.status, result)
                        console.log('Send notification succeeded - ' + JSON.stringify(responseJson))
                    }
                }).fail(function (jqXHR, textStatus) {
                    result = {
                        status: "failed",
                        error: "RequestFailed",
                        message: textStatus
                    }
                    ellucianMobileNotificationsIframe.sendResult(deferredId, result.status, result)
                    console.log('Send notification failed "' + result.message + '"')
                })
            }

            if (result && result.status === "failed") {
                ellucianMobileNotificationsIframe.sendResult(deferredId, result.status, result)
                console.log('Send notification failed "' + result.message + '"')
            }

            return result
        }
    }

    return public
})();

$(window).on("message", function(event) {
    var data = event.originalEvent.data

    switch(data.operation) {
        case 'sendNotification':
            EllucianMobileNotificationsIframe.sendNotification(data)
            break;
    }
});
