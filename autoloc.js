function uc_geoloc_set_combo(box, country){
	theID = null;
	$("option", box).each(function(){
		if($(this).text().toLowerCase() == country.toLowerCase()){
			theID = $(this).val();
			return false;
		}
		return true;
	});
	if(!theID) return false;
	else
		$(box).val(theID).change();
	
	return $(box).val() == theID;
}
var ucGeolocTMP = [];
function uc_geoloc_wait_ajax_change(box, cb){
	ucGeolocTMP[box] = setInterval(function(box, html, cb){
		if($(box).html() != html){
			clearTimeout(ucGeolocTMP[box]);
			cb();
		}
	}, 50, box, $(box).html(), cb);
}
Drupal.behaviors.uc_geoloc = function (context) {
	if(!navigator.geolocation) return;
	if($("#html5geoloc").length > 0) return;
	butHTML = "<p id='html5geoloc'><button>"+Drupal.t('ค้นหาตำแหน่งอัตโนมัติ')+"</button></p>";
	but = $(butHTML);
	but.appendTo("#delivery-pane .description");
	but.click(function(){
		 var pb = new Drupal.progressBar('uc_geoloc');
		 pb.setProgress(0, Drupal.t('Loading'));
		 but.html(pb.element);
		 navigator.geolocation.getCurrentPosition(function(position) {
		 	if(!position.coords.latitude){
		 		but.html("<div class='message error'>"+Drupal.t('ไม่สามารถค้นหาตำแหน่งได้ คลิกเพื่อลองใหม่')+"</div>");
		 		return;
		 	}
		 	pb.setProgress(50, Drupal.t('Loading'));
		 	lat = position.coords.latitude;
		 	lon = position.coords.longitude;
		 	if($("#geobox_map").length)
		 		theIMG = $("#geobox_map");
		 	else
				theIMG = $("<img style='margin:auto; border: black solid 1px;' id='geobox_map' />").insertAfter(but);
		 	theIMG.attr("src", "http://maps.google.com/maps/api/staticmap?center="+lat+","+lon+"&zoom=14&size=800x250&sensor=true&markers="+lat+","+lon);
		 	$.getJSON(Drupal.settings.basePath+"geocode?sensor=true&language=th&latlng="+lat+","+lon, function(out){
		 		pb.setProgress(90, Drupal.t('Loading'));
				console.log(out.results[0]);
		 		adr = out.results[0].address_components;
 				$("#edit-panes-delivery-delivery-city").val("");
		 		adr.forEach(function(x){
		 			if(x.types[0] == "route"){
		 				$("#edit-panes-delivery-delivery-street1").val(x.long_name);
		 			}else if(x.types[0] == "locality" || x.types[0] == "administrative_area_level_3" || x.types[0] == "administrative_area_level_2"){
		 				ov = $("#edit-panes-delivery-delivery-city").val();
		 				if(ov) ov=ov+" ";
		 				$("#edit-panes-delivery-delivery-city").val(ov+x.long_name);
		 			}else if(x.types[0] == "administrative_area_level_1"){
		 				setTimeout(function(x){
			 				if(!uc_geoloc_set_combo("#edit-panes-delivery-delivery-zone", x.long_name.replace(/^จ\./, ""))){
				 				uc_geoloc_wait_ajax_change("#edit-panes-delivery-delivery-zone", function(){
									uc_geoloc_set_combo("#edit-panes-delivery-delivery-zone", x.long_name.replace(/^จ\./, ""));
								});
							}
						}, 250, x);
		 			}else if(x.types[0] == "country"){
		 				if(x.short_name == "TH"){
				 			uc_geoloc_set_combo("#edit-panes-delivery-delivery-country", "Thailand");
				 		}else{
				 			uc_geoloc_set_combo("#edit-panes-delivery-delivery-country", x.long_name);
				 		}
		 			}else if(x.types[0] == "postal_code"){
		 				$("#edit-panes-delivery-delivery-postal-code").val(x.long_name);
		 			}
		 		});
		 		/*// country
		 		country = adr.pop();
		 		if(country.short_name == "TH"){
		 			uc_geoloc_set_combo("#edit-panes-delivery-delivery-country", "Thailand");
		 		}else{
		 			uc_geoloc_set_combo("#edit-panes-delivery-delivery-country", country.long_name);
		 		}
		 		// province
		 		prov = adr.pop();
		 		if(prov.long_name.match(/^จ./)){
			 		console.log(prov.long_name.replace(/^จ\./, ""));
					uc_geoloc_wait_ajax_change("#edit-panes-delivery-delivery-zone", function(){
						uc_geoloc_set_combo("#edit-panes-delivery-delivery-zone", prov.long_name.replace(/^จ\./, ""));
					});
				}
				// city
				city = adr.pop();
				$("#edit-panes-delivery-delivery-city").val(city.long_name);
				// rest!!
				adr = adr.map(function(x){return x.long_name});
				theAddr = adr.join(" ");
				$("#edit-panes-delivery-delivery-street1").val(theAddr);*/
				but.html(butHTML);
		 	});
		 });
	});
};
