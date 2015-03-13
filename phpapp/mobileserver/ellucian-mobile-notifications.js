//  Copyright (c) 2012-2014 Ellucian. All rights reserved.

window.notificationScriptUrl = document.currentScript.src

window.EllucianMobileNotifications = (function() {
    internal = {
        _loaded: false,
        _initialized: false,
        _iframe: null,
        _applicationUrl: null,
        _mobileserverBaseUrl: null,
        _initialize: function(options){
            this._applicationUrl = options.applicationUrl
            this._mobileserverBaseUrl = options.mobileserverBaseUrl

            this._initialized = !!this._applicationUrl && !!this._mobileserverBaseUrl

            // insert hidden iframe to use to make connections to notification API
            var frameUrl = notificationScriptUrl.match(/(^.+)\.js$/)[1] + "-iframe.html"
            $('body').append( '<iframe id="notificationIframe" src="' + frameUrl + '" style="display: none; height: 0px; width: 0px;"></iframe>')
            this._iframe = $('iframe#notificationIframe')[0]
        },
        _sendNotification: function(message) {
            var deferred = $.Deferred()
            var deferredId = new Date().valueOf()
            window.deferreds = window.results || {}
            deferreds[deferredId] = deferred

            if (!this._initialized) {
                result = {
                    status: 'failed',
                    error: 'NotInitialized',
                    message: 'EllucianMobileNotification has not been initialized - call initialize({applicationUrl: "<application URL>, mobileserverBaseUrl: "<mobileserver base URL>"})'
                }
                console.log('Send failed "' + result.message + '"')
                deferred.reject(result)
            } else {
                // send postmessage to iframe
                var data = {
                    applicationUrl: this._applicationUrl,
                    operation: "sendNotification",
                    deferredId: deferredId,
                    message: message }
                this._iframe.contentWindow.postMessage(data, this._mobileserverBaseUrl)
                console.log("Posted notification message to iframe")
            }

            return deferred.promise()
        }
    }

    public = {
        initialize: function(options) {
            return internal._initialize(options)
        },
        sendNotification: function(message) {
            return internal._sendNotification(message)
        }
    }

    return public
})();

$(window).on("message", function(event) {
    var data = event.originalEvent.data

    var deferredId = data.deferredId
    var status = data.status
    var result = data.result

    var deferred = (window.deferreds || {})[deferredId]
    if (deferred) {
        if (status === "success") {
            deferred.resolve(result)
        } else {
            deferred.reject(result)
        }
    }
});
