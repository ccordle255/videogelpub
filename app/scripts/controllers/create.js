'use strict';

angular.module('videogelApp')
  .controller('CreateCtrl', function ($scope, $http, Createslideshow) {
  	$scope.albums = Createslideshow.albums;
  	$scope.selectedCount = Createslideshow.getSelectedImageCount();

    $scope.itemClicked = function() {
    	this.album.selected = !this.album.selected;
    	$scope.selectedCount = Createslideshow.getSelectedImageCount();
        Createslideshow.saveSelections();
    };

    //All albums have been selected
    $scope.finishedSelecting = function() {
        //save state of selections and go to select by preview screen
        
    };

    $scope.saveSelections = function() {
        Createslideshow.saveSelections();
    };

  });
