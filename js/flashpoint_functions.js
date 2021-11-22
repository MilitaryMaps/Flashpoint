function addConflictMarker(conflict) {

  let conflict_marker = new L.marker(conflict.center, { opacity: 0});
  conflict_marker.bindTooltip(conflict.title, {permanent: true, interactive: true, opacity: 1, className: "conflict_label_"+conflict.code, direction: 'center', offset: [0, 0]});
  conflict_marker.addTo(flashpoint_map);

  conflict_marker.on("click", function (e) {
      $("#flashpoint_information .code").css({"background-color": "var(--severity_scale_code_"+conflict.code+"_fill_color)"});
      $("#flashpoint_information .top_bar").css({"box-shadow": "var(--severity_scale_code_"+conflict.code+"_fill_color_step_1) 0 5px,var(--severity_scale_code_"+conflict.code+"_fill_color_step_2) 0 10px, var(--severity_scale_code_"+conflict.code+"_fill_color_step_3) 0 15px, var(--severity_scale_code_"+conflict.code+"_fill_color_step_4) 0 20px, var(--severity_scale_code_"+conflict.code+"_fill_color_step_5) 0 25px"});
      $("#flashpoint_information").css({"width": "100%"});
      $("#flashpoint_information .type").html(conflict.type);
      $("#flashpoint_information .code").html(codes[conflict.code]);
      $("#flashpoint_information .title").html(conflict.title);
      $("#flashpoint_information .description").html(conflict.description);

      let belligerent_list = "";
      belligerent_list += "<ol>";
      for (belligerent in conflict.belligerents){
        belligerent_list += "<li>" + conflict.belligerents[belligerent] + "</li>";
      };
      belligerent_list += "<ol>";
      $("#flashpoint_information .belligerents_list").html(belligerent_list);

      const zoom = conflict.zoom,
            center = conflict.center;
      flashpoint_map.flyTo(center, zoom, {animate: true, duration: 1.0});
  });

};

// Functions for each feature on the map
function FeaturesConflictMap(region, layer) {
  if (region.properties.id in conflict_regions){
    let conflict = conflicts[conflict_regions[region.properties.id]];

    // Onclick fly to zoom function for each feature
    // Data for zoom and center derived from the conflicts dataset
    layer.on("click", function (e) {
      const zoom = conflict.zoom,
            center = conflict.center;
    flashpoint_map.flyTo(center, zoom, {animate: true, duration: 1.0});
    });

  };

  if (debug){
    layer.on("click", function (e) {
        console.log(region.properties.id, region.properties.name, [e.latlng['lat'], e.latlng['lng']]);
    });
  };


};

// Giving custom styling to each feature on the map
function StyleConflictMap(region) {

    console.log(region, conflict_regions);
    if (region.properties.id in conflict_regions){
      return {
              className: "severity_scale_code_" + conflicts[conflict_regions[region.properties.id]].code, // Class based on the code on the severity scale, derived from conflicts dataset
              interactive: false // Currently disabled, which makes the onclick fly to function in FeaturesConflictMap() useless.
             }
    } else{
      if (debug){
        // Give every region a custom styling - only available in debug mode
        return {
                className: "region_debug",
                interactive: true
               }
      }
    };
};
