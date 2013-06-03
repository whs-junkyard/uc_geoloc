# uc_geoloc
Ubercart HTML5 geolocation address filling proof of concept module.

This module was written during NLC11 competition and was only tested to the Sirinthorn Science Home's address and specific address form configuration. Don't expect it to work.

## Installation
Put this in sites/all/modules and enable it. Requires ubercart.

## Usage
On checkout address form, there will be a new button if the application detects that the browser supports HTML5 Geolocation API.

Note that during NLC11, a certain Firefox version does indicate support for Geolocation, but in fact does not work.

## How it works
The uc_geoloc module injects autoloc.js into checkout form.

autoloc.js detects browser support for geolocation and add the button.
When the user clicks on the button, permission request and geolocation request will be called.
After latlng was acquired (typically the browser use WiFi location, along with other metrics)
the module will send request to Google's Reverse Geocoding API using uc_geoloc's
server side proxy as the API does not allow JSONP. It will then fill out the forms
using data returned from the API and display the map with Google Static Maps.

## License
(C) 2010 Manatsawin Hanmongkolchai

Licensed under the MIT license.

(original file modification timestamp was 12/9/2010 2:36PM +0700 - 12/10/2010 8:53AM +0700)
