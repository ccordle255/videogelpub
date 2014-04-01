'use strict';

angular.module('videogelApp')
  .controller('ImagesCtrl', function ($scope, $http) {
    $http.get('/api/images').success(function (images) {
      $scope.images = images;
    });
  });
