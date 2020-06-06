L.Geoserver = L.FeatureGroup.extend({
  options: {
    layers: "",
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
    onEachFeature: function (feature, layer) {},
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

        console.log(that.options.onEachFeature);
        for (i = 0; i < data.features.length; i++) {
          var layer = L.GeoJSON.geometryToLayer(
            data.features[i],
            that.options || null
          );

          layer.feature = data.features[i];
          layer.options.onEachFeature = that.options.onEachFeature(
            layer.feature,
            layer
          );

          layers.push(layer);
        }
        console.log(that.options.onEachFeature);

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

  legend: function () {
    var that = this;
    var legend = L.control({ position: "bottomleft" });
    legend.onAdd = function (map) {
      var div = L.DomUtil.create("div", "info Legend");
      var url = `${that.baseLayerUrl}/wms?REQUEST=GetLegendGraphic&VERSION=1.1.0&FORMAT=image/png&LAYER=${that.options.layers}&style=${that.options.style}`;
      div.innerHTML +=
        "<img src=" +
        url +
        ' alt="legend" data-toggle="tooltip" title="Map legend">';
      return div;
    };
    return legend;
  },

  wmsImage: function () {
    var that = this;
    $.ajax({
      url: `${that.baseLayerUrl}/ows?service=WFS&version=1.0.0&request=GetFeature&cql_filter=${that.options.CQL_FILTER}&typeName=${that.options.layers}&srsName=EPSG:4326&maxFeatures=50&outputFormat=text%2Fjavascript`,
      dataType: "jsonp",
      jsonpCallback: "parseResponse",
      success: function (data) {
        selectedArea = L.geoJson(data);
        bboxX1 = selectedArea.getBounds()._southWest.lng;
        bboxX2 = selectedArea.getBounds()._northEast.lng;
        bboxY1 = selectedArea.getBounds()._southWest.lat;
        bboxY2 = selectedArea.getBounds()._northEast.lat;
        bboxList = [bboxX1, bboxX2, bboxY1, bboxY2];
        bufferBbox = Math.min((bboxX2 - bboxX1) * 0.1, (bboxY2 - bboxY1) * 0.1);
        maxValue = Math.max(bboxX2 - bboxX1, bboxY2 - bboxY1) / 2.0;

        var a = L.tileLayer.wms(that.baseLayerUrl, {
          ...that.options,

          bbox: [
            (bboxX1 + bboxX2) * 0.5 - maxValue - bufferBbox,
            (bboxY1 + bboxY2) * 0.5 - maxValue - bufferBbox,
            (bboxX1 + bboxX2) * 0.5 + maxValue + bufferBbox,
            (bboxY1 + bboxY2) * 0.5 + maxValue + bufferBbox,
          ],
        });
        console.log(a);
        that.addLayer(a);
        console.log(that.addLayer(a));
      },
    });
    for (var layer in that._layers) {
      console.log(layer);
    }
    console.log(that);
    return that;
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

L.Geoserver.legend = function (baseLayerUrl, options) {
  var req = new L.Geoserver(baseLayerUrl, options);
  return req.legend();
};

L.Geoserver.wmsImage = function (baseLayerUrl, options) {
  var req = new L.Geoserver(baseLayerUrl, options);
  return req.wmsImage();
};
