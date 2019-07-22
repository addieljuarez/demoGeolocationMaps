/**
 * File: /Users/addielJuarez/Documents/developer/Appc/geoHW/app/controllers/index.js
 * Project: /Users/addielJuarez
 * Created Date: Tuesday, June 25th 2019, 5:10:34 pm
 * Author: Addiel Juarez
 * -----
 * Last Modified: Sun Jul 21 2019
 * Modified By: Addiel Juarez
 * -----
 * Copyright (c) 2019 Addiel
 * ------------------------------------
 */


var Map = require('ti.map');

var winMapa = Ti.UI.createWindow({
	backgroundColor: 'pink',
});


var mapview = Map.createView({ 
	mapType: Map.NORMAL_TYPE,
	animate: true,
	regionFit: true,
	userLocation: true,
});

winMapa.add(mapview);


if(Ti.App.Properties.getObject('puntos') == null){
	Ti.App.Properties.setObject('puntos', []);
}



$.index.open();






function loadGeo(){
	// setTimeout(function(){
		permissions();
	// }, 2000);
}


/**
 *
 *	Revisa los permisos y los solicita si es necesario. 
 */
function permissions() {
	if (Ti.Geolocation.hasLocationPermissions()) {
			Ti.API.info('=== si hay permisos');
			startGeo();
	} else {
		Ti.Geolocation.requestLocationPermissions(Ti.Geolocation.AUTHORIZATION_ALWAYS, function(e) {
			if (e.success) {
				if (Ti.Geolocation.locationServicesEnabled === true) {
					permissions();
				} else {
					alert("Habilíta tu localización, para acelerar el proceso apaga y prende tu conexión de datos");
				}
			} else {
				alert("Necesitamos permiso para acceder a tu localización");
			}
		});

	}
}






var intervaloGeo;
/**
 *
 *
 */
function startGeo(){
	intervaloGeo = setInterval(sendGeo,  10000);
}




/**
 *
 *
 */
function sendGeo(){


	Ti.API.info('==== entra a sendGeo geo ===');


	var gpsRule = Ti.Geolocation.Android.createLocationRule({
		provider: Ti.Geolocation.PROVIDER_GPS,
		// Updates should be accurate to 100m
		// accuracy: 100,
		// accuracy: Titanium.Geolocation.ACCURACY_HIGH,
		accuracy: 20,
		// Updates should be no older than 5m
		maxAge: 300000,
		// But  no more frequent than once per 10 seconds
		minAge: 10000
	});
	Ti.Geolocation.Android.addLocationRule(gpsRule);


	Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_HIGH;


	var locationCallback = function(e) {
		// Ti.API.info('=== e === ' +  JSON.stringify(e));
		if (!e.success || e.error) {
			Ti.API.info('error:' + JSON.stringify(e.error));
		} else {
			
			$.label.text = $.label.text + '\n' + e.coords.latitude + ',' + e.coords.longitude
			Ti.API.info(e.coords.latitude + ',' + e.coords.longitude);

			var puntos = Ti.App.Properties.getObject('puntos');
			puntos.push({
				'lat': e.coords.latitude,
				'lon': e.coords.longitude,
			});
			
			
			Ti.API.info('puntos: ' + JSON.stringify(puntos));
			Ti.API.info('puntos.length: ' + puntos.length);
			Ti.App.Properties.setObject('puntos', puntos);
			
				
		}
		Titanium.Geolocation.removeEventListener('location', locationCallback);
	};
	Titanium.Geolocation.addEventListener('location', locationCallback);



}






$.mapa.addEventListener('click', function(e){

	if(Ti.App.Properties.getObject('puntos') != null){
		var localizacion = Ti.App.Properties.getObject('puntos');

		var puntosMapa = []
		for(var i=0; i<localizacion.length; i++){
			var newPoint = Map.createAnnotation({
				latitude: localizacion[i].lat,
				longitude: localizacion[i].lon,
				title: 'punto numero ' + i,
				pincolor: Map.ANNOTATION_RED,
			});

			puntosMapa.push(newPoint);
		}

		mapview.annotations = puntosMapa;
	}

	winMapa.open();
});


$.iniciar.addEventListener('click', function(e){
	loadGeo();
});

$.terminar.addEventListener('click', function(e){
	clearInterval(intervaloGeo);
});



