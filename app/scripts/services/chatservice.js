'use strict';

angular.module('garbledApp')
    .service('Chatservice', ["$firebase", "$rootScope", function Chatservice($firebase, $rootScope) {
        this.fb = null;
        return {
            getChat: function(contact) {
                return {
                    contact: contact,
                    messages: contact.$child('messages'),
                    inbox: $firebase(new Firebase(contact.inbox))
                };
            }
        };
    }]);
