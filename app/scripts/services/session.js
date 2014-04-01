'use strict';

angular.module('videogelApp')
  .factory('Session', function ($resource) {
    return $resource('/api/session/');
  });
