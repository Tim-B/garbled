'use strict';

angular.module('garbledApp')
    .service('Chatservice', ["$firebase", "config", function Chatservice($firebase, config) {
        return $firebase(config.fb_ref);
    }]);
