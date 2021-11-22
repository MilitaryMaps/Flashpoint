function addConflictMarker(conflict) {

  let conflict_marker = new L.marker(conflict.center, { opacity: 0});
  conflict_marker.bindTooltip(conflict.title, {permanent: true, interactive: true, opacity: 1, className: "conflict_label_"+conflict.severity_scale_status, direction: 'center', offset: [0, 0]});
  conflict_marker.addTo(flashpoint_map);

  conflict_marker.on("click", function (e) {
      $(".information_container .severity_scale_status").css({"background-color": "var(--severity_scale_status_"+conflict.severity_scale_status+"_fill_color)"});
      $(".information_container .top_bar").css({"box-shadow": "var(--severity_scale_status_"+conflict.severity_scale_status+"_fill_color_step_1) 0 5px,var(--severity_scale_status_"+conflict.severity_scale_status+"_fill_color_step_2) 0 10px, var(--severity_scale_status_"+conflict.severity_scale_status+"_fill_color_step_3) 0 15px, var(--severity_scale_status_"+conflict.severity_scale_status+"_fill_color_step_4) 0 20px, var(--severity_scale_status_"+conflict.severity_scale_status+"_fill_color_step_5) 0 25px"});
      $(".information_container").css({"width": "100%"});
      $(".information_container .conflict_type").html(conflict.conflict_type);
      $(".information_container .severity_scale_status").html(conflict_types[conflict.severity_scale_status]);
      $(".information_container .title").html(conflict.title);

      $(".information_container .situation_summary").html("<article>"+conflict.situation_summary+"</article>");

      let situation_reports_list = ""
      for (situation_report in conflict.situation_reports){
        situation_reports_list += "<article>"+conflict.situation_reports[situation_report]+"</article>";
      };
      $(".information_container .situation_reports").html(situation_reports_list);

      let belligerent_list = "";
      belligerent_list += "<ol>";
      for (belligerent in conflict.belligerents){
        belligerent_list += "<li>" + conflict.belligerents[belligerent] + "</li>";
      };
      belligerent_list += "<ol>";
      $(".information_container .belligerents").html(belligerent_list);


      let sources_list = "";
      sources_list += "<ol>";
      for (source in conflict.sources){
        sources_list += "<li><a target=\"_blank\" href=\"" + conflict.sources[source] + "\">" + conflict.sources[source] + "</a></li>";
      };
      sources_list += "<ol>";
      $(".information_container .sources").html(sources_list);

      // const zoom = conflict.zoom,
      //       center = conflict.center;
      // flashpoint_map.flyTo(center, zoom, {animate: true, duration: 1.0});
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
    if (region.properties.id in conflict_regions){
      return {
              className: "severity_scale_status_" + conflicts[conflict_regions[region.properties.id]].severity_scale_status, // Class based on the code on the severity scale, derived from conflicts dataset
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
