'use strict';

angular.module('videogelApp')
  .controller('ThumbnailsCtrl', function ($scope, $http, $routeParams, Createslideshow) {
    //get the data for the album
    //fetch the images for the album
    var albumID = parseInt($routeParams.albumid);
  	$scope.albums = Createslideshow.albums;

    //must do this in case Createslideshow.albums is not populated yet
    //will populate the images array once an album is avialable
    getAlbumImages();
    $scope.$watch('albums', function(newVal, oldVal) {
        getAlbumImages();
    }, true);

    $scope.selectedCount = Createslideshow.getSelectedImageCount();

    $scope.thumbClicked = function() {
    	this.image.selected = !this.image.selected;
    	$scope.selectedCount = Createslideshow.getSelectedImageCount();
        Createslideshow.saveSelections();
    };

    //All albums have been selected
    $scope.finishedSelecting = function() {
        //save state of selections and go to select by preview screen

    };

    function getAlbumImages() {
        //get the album that the user has navigated to
        $scope.album = _.find($scope.albums, function(album) {
            return album.id === albumID;
        });

        if($scope.album)
            $scope.images = $scope.album.Images;
    }

});
