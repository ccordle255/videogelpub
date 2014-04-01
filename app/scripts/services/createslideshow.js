'use strict';

angular.module('videogelApp')
  .service('Createslideshow', function Createslideshow($http) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    var self = this;

    self.albums = [];

    //fetch albums
    $http.get('/api/smugmug/albums').success(function (albums) {
    	console.log('got albums');
    	_.each(albums, function(album) {
    		album.selected = false;

    		var params = {
    			albumID: album.id,
    			albumKey: album.Key
    		};

    		var baseURL = '/api/smugmug/images/?';

    		var getImagesURL = baseURL + querystring.stringify(params); 

    		//get the list of images for this album
    		$http.get(getImagesURL).success(function (images) {
    			console.log("got images for album: " + album.id);
    			_.each(images, function(image) {
    				image.selected = false;
    			});

    			album.Images = images;
	    		self.albums.push(album);

	    		//run get selections
	    		self.getSelections(album);
    		});
    	});
    });

    self.getSelections = function(album) {
    	var getSelectionsURL = '/api/smugmug/selections';

    	//get the selection data and apply it to the album and its images
    	$http.get(getSelectionsURL).success(function (selections) {
    		var selection = _.find(selections, function(selection) {
    			return selection.id === album.id;
    		});
    		if(selection) {
    			album.selected = selection.selected;
    			_.each(album.Images, function(albumImage) {
    				var selectionImage = _.find(selection.Images, function(selectionImage) {
    					return albumImage.id === selectionImage.id;
    				});
    				if(selectionImage)
    					albumImage.selected = true;
    			});
    		}
    	});
    };

    self.saveSelections = function() {
    	//build a stripped down albums array including only album & image ids, keys, and selected properties
	    var albums = self.albums;
	    var selections = [];

	    _.each(albums, function(album, index) {
	    	var albumSelect = {};
	    	albumSelect.id = album.id;
	    	albumSelect.Key = album.Key;
	    	albumSelect.selected = album.selected;
	    	albumSelect.Images = [];

	    	var selectedImages = _.filter(album.Images, function(image) {
	    		return image.selected;
	    	});

	    	//store only the key and id of each selected image
	    	_.each(selectedImages, function(image) {
	    		var image = _.pick(image, 'id', 'Key');
	    		albumSelect.Images.push(image);
	    	});

	    	selections.push(albumSelect);
	    });

	    //save the selections to the db
	    $http.post("/api/slideshows/selections/", { selections: selections });

    };

    self.getSelectedImageCount = function() {
    	var albums = self.albums;
    	var selectedAlbums = _.filter(albums, function(album){ 
    		return album.selected;
    	});
    	var selectedImageCounts = _.pluck(selectedAlbums, 'ImageCount');
    	if(selectedImageCounts.length > 0) {
	    	return _.reduce(selectedImageCounts, function(memo, num) {
	    		return memo + num;
	    	});
    	}
    	return 0;
    };



  });
