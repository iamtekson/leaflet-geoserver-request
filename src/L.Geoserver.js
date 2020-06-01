L.Geoserver = L.Class.extend({
  options: {
    layers: `tajikistan:EAR_Agriculture`,
    format: "image/png",
    transparent: true,
    CQL_FILTER: "INCLUDE",
    zIndex: 1000,
    version: "1.1.0",
    srsname: "EPSG:4326",
    attribution: `layer`,
    fitlayer: true,
  },

  initialize: function (baseLayerUrl, options) {
    this.baseLayerUrl = baseLayerUrl;
    L.Util.setOptions(this, options);
  },

  wms: function () {
    return L.tileLayer.wms(this.baseLayerUrl, this.options);
  },

  wfs: function () {
    //Geoserver Web Feature Service
    $.ajax(this.baseLayerUrl, {
      type: "GET",
      data: {
        service: "WFS",
        version: "1.1.0",
        request: "GetFeature",
        typename: this.options.layers,
        CQL_FILTER: this.options.CQL_FILTER,
        srsname: this.options.srsname,
        outputFormat: "text/javascript",
      },
      dataType: "jsonp",
      jsonpCallback: "callback:handleJson",
      jsonp: "format_options",
    });
  },

  handleJson: function (data) {
    selectedArea = L.geoJson(data, {
      onEachFeature: function (feature, layer) {
        layer;
      },
    }).addTo(map);

    if (this.fitlayer) {
      map.fitBounds(selectedArea.getBounds());
    }
  },
});

L.Geoserver.wms = function (baseLayerUrl, options) {
  var req = new L.Geoserver(baseLayerUrl, options);
  return req.wms();
};

L.Geoserver.wfs = function (baseLayerUrl, options) {
  var req = new L.Geoserver(baseLayerUrl, options);
  return req.wfs();
};

function handleJson(data) {
  selectedArea = L.geoJson(data, {
    onEachFeature: function (feature, layer) {
      layer;
    },
  }).addTo(map);
  if (this.fitlayer) {
    map.fitBounds(selectedArea.getBounds());
  }
}

// // ajax request handler
// function handleAjax(column, value, adminUnit = "jamoat") {
//   //Geoserver Web Feature Service
//   $.ajax("http://203.159.29.40:8080/geoserver/wfs", {
//     type: "GET",
//     data: {
//       service: "WFS",
//       version: "1.1.0",
//       request: "GetFeature",
//       typename: `tajikistan:${adminUnit}`,
//       CQL_FILTER: `${column}='${value}'`,
//       srsname: "EPSG:4326",
//       outputFormat: "text/javascript",
//     },
//     dataType: "jsonp",
//     jsonpCallback: "callback:handleJson",
//     jsonp: "format_options",
//   });
// }

// // the ajax callback function
// function handleJson(data) {
//   selectedArea = L.geoJson(data, {
//     style: geoJsonStyle,
//     onEachFeature: function (feature, layer) {
//       population = feature.properties.population;
//       shapeLength = feature.properties.shape_leng;
//       layer.bindPopup(
//         `Region: ${feature.properties.name_rg} </br>District: ${feature.properties.district_eng} </br> Jamoat: ${feature.properties.jamoat_eng} <br/> Population: ${feature.properties.population}`
//       );
//     },
//   }).addTo(map);
//   map.fitBounds(selectedArea.getBounds());
//   // tryChart(population, shapeLength);
// }

// class Geoserver {
//   defaultValues = {
//     format: "image/png",
//     transparent: true,
//     zIndex: 1000,
//     attribution: `${this.layers} layer`,
//   };

//   constructor(baseLayerUrl, options) {
//     Object.assign(this, defaultValues, options);
//     this.baseLayerUrl = baseLayerUrl;
//     this.layers = options.layer;
//     this.format = options.format;
//     this.transparent = options.transparent;
//     this.zIndex = options.zIndex;
//     this.attribution = options.attribution;
//   }

//   wms() {
//     return L.tileLayer.wms(this.baseLayerUrl, options);
//   }
// }

// class MyMap {

//     // constructor(props) {
//     //  ...
//     // }

//     // getMapElement(){
//     //  ...
//     // }

//     // getBaseLayer(){
//     //  ...
//     // }

//     initMap( mapOptions ){
//         if ( ! this.map  ) {
//             this.map = L.map( this.getMapElement(), mapOptions );
//             this.getBaseLayer().addTo( this.map );
//         }
//     }

//     setMapOptions( newMapOptions ){
//         // loop newMapOptions object
//         for ( let newMapOptionKey in newMapOptions ) {
//             if( newMapOptions.hasOwnProperty(newMapOptionKey)) {
//                 this.setMapOption( newMapOptionKey, newMapOptions[newMapOptionKey] );
//             }
//         }
//     }

//     setMapOption( newMapOptionKey, newMapOptionVal ){
//         // set map option
//         L.Util.setOptions( this.map, {[newMapOptionKey]: newMapOptionVal});
//         // apply option to handler
//         if ( this.map[newMapOptionKey] instanceof L.Handler ) {
//             if ( newMapOptionVal ) {
//                 this.map[newMapOptionKey].enable();
//             } else {
//                 this.map[newMapOptionKey].disable();
//             }
//         }
//     }

// }
