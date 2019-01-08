jQuery(document).ready(function($) {
    var map             = null;
    var vector          = null;
    var popup           = null;
    var current_marker  = null;
    var points          = [];
    var clusterFeatures = [];
    var zoom            = 7;

    var base_lat = 48.8394505, base_lng = 2.6276102;

    var points_min = getRandomInRange(100, 300, 0);
    for (var i = 0; i < points_min; i++) {
        var rand_lat = getRandomInRange(base_lat - 1, base_lat + 1, 5);
        var rand_lng = getRandomInRange(base_lng - 1, base_lng + 1, 5);
        points.push({lat: rand_lat, lng: rand_lng});
    }
    points.push({lat: 48.139307, lng: -2.529808});

    /* Init Map */
    map = new OpenLayers.Map("map"); // To remove map theme, call Map({ div: "map", theme: null })
    map.addLayer(new OpenLayers.Layer.OSM());

    /* Set map location */
    var lonLat = new OpenLayers.LonLat( base_lng , base_lat ).transform(
        new OpenLayers.Projection("EPSG:4326"), // transform from WGS 1984
        map.getProjectionObject() // to Spherical Mercator Projection
    );
    map.setCenter (lonLat, zoom);

    /* Create cluster style */

    var colors = {
      low: "rgb(247, 49, 67)",
      middle: "rgb(163, 32, 44)",
      high: "rgb(125, 25, 34)"
    };

    // Define three rules to style the cluster features.
    var lowRule = new OpenLayers.Rule({
      filter: new OpenLayers.Filter.Comparison({
          type: OpenLayers.Filter.Comparison.LESS_THAN,
          property: "count",
          value: 15
      }),
      symbolizer: {
          fillColor: colors.low,
          fillOpacity: 0.9,
          strokeColor: colors.low,
          strokeOpacity: 0.5,
          strokeWidth: 12,
          pointRadius: 10,
          label: "${count}",
          labelOutlineWidth: 1,
          fontColor: "#ffffff",
          fontOpacity: 0.8,
          fontSize: "12px"
      }
    });
    var middleRule = new OpenLayers.Rule({
      filter: new OpenLayers.Filter.Comparison({
          type: OpenLayers.Filter.Comparison.BETWEEN,
          property: "count",
          lowerBoundary: 15,
          upperBoundary: 40
      }),
      symbolizer: {
          fillColor: colors.middle,
          fillOpacity: 0.9,
          strokeColor: colors.middle,
          strokeOpacity: 0.5,
          strokeWidth: 12,
          pointRadius: 15,
          label: "${count}",
          labelOutlineWidth: 1,
          fontColor: "#ffffff",
          fontOpacity: 0.8,
          fontSize: "12px"
      }
    });
    var highRule = new OpenLayers.Rule({
      filter: new OpenLayers.Filter.Comparison({
          type: OpenLayers.Filter.Comparison.GREATER_THAN,
          property: "count",
          value: 50
      }),
      symbolizer: {
          fillColor: colors.high,
          fillOpacity: 0.9,
          strokeColor: colors.high,
          strokeOpacity: 0.5,
          strokeWidth: 12,
          pointRadius: 20,
          label: "${count}",
          labelOutlineWidth: 1,
          fontColor: "#ffffff",
          fontOpacity: 0.8,
          fontSize: "12px"
      }
    });

    // Create a Style that uses the three previous rules
    var style = new OpenLayers.Style(null, {
      rules: [lowRule, middleRule, highRule]
    });

    /* Create cluster vector */

    vector = new OpenLayers.Layer.Vector("Features", {
        renderers: ['Canvas','SVG'],
        strategies: [
            // new OpenLayers.Strategy.Fixed(),
            new OpenLayers.Strategy.AnimatedCluster({
                distance: 120, // Distance in pixels to separate points
                animationMethod: OpenLayers.Easing.Expo.inAndOut,
                animationDuration: 50,
                threshold: 2
            })
        ],
        styleMap:  new OpenLayers.StyleMap(style),
    });
    map.addLayer(vector); // Vector is ready for cluster !

    /* Prepare markers */
    var icon_path = 'images/marker.png';
    var stylesMarkerImage = {
        externalGraphic : icon_path,
        graphicHeight : 32,
        graphicWidth : 32,
        graphicYOffset : -32,
        graphicXOffset : -16
    };

    for (var index in points) {
      var popup_details = "<div class='map-popup-inner'><div class='title'>Point n°" + index + "</div><p class='text'><strong>Latitude : </strong>" + points[index].lat + "<br><strong>Longitude : </strong>" + points[index].lng + "</p></div>";

      var flonlat = new OpenLayers.LonLat(points[index].lng, points[index].lat);
      flonlat.transform(new OpenLayers.Projection("EPSG:4326"), new OpenLayers.Projection("EPSG:900913"));

      var f = new OpenLayers.Feature.Vector( new OpenLayers.Geometry.Point(flonlat.lon, flonlat.lat), {
        id: index,
        lon: points[index].lng,
        lat: points[index].lat,
        desc: popup_details,
      }, stylesMarkerImage);
      f.attributes = { icon: icon_path, label: "myVector", importance: 10 };
      clusterFeatures.push(f);
    }
    vector.addFeatures(clusterFeatures);

    /* Open popup on feature click */
    map.events.register("featureclick", map, function(e) {
      popupClear();
      var refresh_vector = false;
      if( typeof e.feature.cluster !== 'undefined' && e.feature.cluster.length > 0 ) {
        popup = null;
      }else {
        var default_icon_path = 'images/marker.png';
        var current_icon_path = 'images/marker-selected.png';
        var stylesMarkerImage = {
          externalGraphic : current_icon_path,
          graphicHeight : 32,
          graphicWidth : 32,
          graphicYOffset : -32,
          graphicXOffset : -16
        };
        var stylesMarkerImageDefault = {
          externalGraphic : default_icon_path,
          graphicHeight : 32,
          graphicWidth : 32,
          graphicYOffset : -32,
          graphicXOffset : -16
        };

        var current_feature = vector.getFeatureById(e.feature.id);
        if( current_marker == null || current_feature.id !== current_marker.id  ) {
          if( current_marker !== null ) {
            current_marker.attributes = { icon: default_icon_path, label: "myVector", importance: 10 };
            current_marker.style = stylesMarkerImageDefault;
            vector.drawFeature(current_marker);
          }
          current_marker = current_feature;
          current_marker.attributes = { icon: current_icon_path, label: "myVector", importance: 10 };
          current_marker.style = stylesMarkerImage;
          vector.drawFeature(current_marker);
          refresh_vector = true;
        }

        var fdata = e.feature.data;
        var current_zoom = map.getZoom();
        var lonLat = new OpenLayers.LonLat( fdata.lon , fdata.lat ).transform(
          new OpenLayers.Projection("EPSG:4326"),
          map.getProjectionObject()
        );

        popup = new OpenLayers.Popup("mappopup",
          lonLat,
          new OpenLayers.Size(200,200),
          fdata.desc,
          true);
        map.addPopup(popup);
      }
      if(refresh_vector) {
        vector.refresh({force: true});
      }
    });


    /* --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- */

    /* Tool functions */

    function getRandomInRange(from, to, fixed) {
        return (Math.random() * (to - from) + from).toFixed(fixed) * 1;
    }

    function popupClear() {
      popup = null;
      while( map.popups.length ) {
        map.removePopup(map.popups[0]);
      }
    }

});
