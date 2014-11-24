// List of Seattle Traffic Cameras
// http://data.seattle.gov/resource/65fc-btcc.json

"use strict";

//put your code here to create the map, fetch the list of traffic cameras
//and add them as markers on the map
//when a user clicks on a marker, you should pan the map so that the marker
//is at the center, and open an InfoWindow that displays the latest camera
//image
//you should also write the code to filter the set of markers when the user
//types a search phrase into the search box

//set Map characteristics
var mapOptions = {
	center: {lat: 47.6, lng: -122.3},
	zoom: 12
}

//obtain the element we want to put the map in and create it
//with the previously set characteristics
var mapElem = document.getElementById('map');
var map = new google.maps.Map(mapElem, mapOptions);
var infoWin = new google.maps.InfoWindow();

//contains a map of a marker's location to its camera object
var markerMap ={};
//contains an array of all the marker objects
var cameras = [];

//centers the screen around the clicked marker and loads a description
//and picture of the camera's feed.
function onMarkerClick() {
    map.panTo(this.getPosition());
    var camera = markerMap[this.getPosition()];
	infoWin.setContent('<p>' + camera.cameralabel + '</p>' + 
		'<img src=' + camera.imageurl.url + " alt=Traffic Camera>");
    infoWin.open(map,this);
}

//filters out cameras that don't match the search criteria
$("#search").bind("search keyup", function() {
	var input = $("#search").val().toLowerCase();
	for(var i = 0; i < cameras.length; i++) {
		var marker = markerMap[cameras[i].getPosition()];
		//if the marker matches, make sure it's on the map.
		//else, remove it
		if(marker.cameralabel.toLowerCase().indexOf(input) != -1) {
			cameras[i].setMap(map);
		} else {
			cameras[i].setMap(null);
		}
	}
});

//create the markers and put them on the screen.
$.getJSON('http://data.seattle.gov/resource/65fc-btcc.json')
.done(function(data) {
    //success
    for(var i = 0; i < data.length; i++) {
    	//get location
    	var myLatlng = new google.maps.LatLng(data[i].location.latitude,data[i].location.longitude);
    	//create marker
    	var newMarker = new google.maps.Marker({
    		position: myLatlng,
    		map: map
    	});
    	//add marker to array for later access
    	cameras[cameras.length]= newMarker;
    	//add relation so that the marker can be associated with its camera object
    	markerMap[myLatlng] = data[i];
    	//add the event to handle the infoWindow and centering
    	google.maps.event.addListener(newMarker, 'click', onMarkerClick);
    }
})
.fail(function(data) {
    //error contains error info
})
.always(function() {
    //called on either success or error cases
})
