L.Geoserver = L.FeatureGroup.extend({
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
    popup: true,
    style: "",
  },

  initialize: function (baseLayerUrl, options) {
    this.baseLayerUrl = baseLayerUrl;

    L.setOptions(this, options);

    this._layers = {};

    this.state = {
      exist: "exist",
    };
  },

  wms: function () {
    return L.tileLayer.wms(this.baseLayerUrl, this.options);
  },

  wfs: function () {
    var that = this;

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
        format_options: "callback: getJson",
      },

      dataType: "jsonp",
      jsonpCallback: "getJson",
      success: function (data) {
        var layers = [];

        for (i = 0; i < data.features.length; i++) {
          var layer = L.GeoJSON.geometryToLayer(
            data.features[i],
            that.options || null
          );

          layer.feature = data.features[i];
          layers.push(layer);
        }

        if (typeof that.options.style === "function") {
          for (i = 0; i < layers.length; i++) {
            that.addLayer(layers[i]);
            if (i.setStyle) {
              i.setStyle(that.options.style(element));
            }
          }
        } else {
          for (i = 0; i < layers.length; i++) {
            that.addLayer(layers[i]);
            that.setStyle(that.options.style);
          }
        }
      },
    }).fail(function (jqXHR, textStatus, error) {
      console.log(jqXHR, textStatus, error);
    });

    return that;
  },

  // handleJson: function (data) {
  //   console.log(data);
  //   var layer = this.options.popup
  //     ? L.geoJson(data, {
  //         style: this.options.style,
  //         onEachFeature: function (feature, layer) {
  //           layer.bindPopup(
  //             "<pre>" +
  //               JSON.stringify(feature.properties, null, " ").replace(
  //                 /[\{\}"]/g,
  //                 ""
  //               ) +
  //               "</pre>"
  //           );
  //         },
  //       })
  //     : L.geoJson(data);

  //   console.log(layer);
  //   layer.addTo(map1);
  //   if (this.options.fitlayer) {
  //     map.fitBounds(this.selectedArea.getBounds());
  //   }
  // },
});

L.Geoserver.wms = function (baseLayerUrl, options) {
  var req = new L.Geoserver(baseLayerUrl, options);
  return req.wms();
};

L.Geoserver.wfs = function (baseLayerUrl, options) {
  var req = new L.Geoserver(baseLayerUrl, options);
  return req.wfs();
};
