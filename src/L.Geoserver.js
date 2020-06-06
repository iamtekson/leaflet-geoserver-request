L.Geoserver = L.FeatureGroup.extend({
  //Some of the default options
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
    wmsLayers: [],
    wmsCQL_FILTER: [],
    wmsStyle: [],
    width: 500,
    height: 500,
  },

  // constructor function
  initialize: function (baseLayerUrl, options) {
    this.baseLayerUrl = baseLayerUrl;

    L.setOptions(this, options);

    this._layers = {};

    this.state = {
      exist: "exist",
    };
  },

  //wms layer function
  wms: function () {
    return L.tileLayer.wms(this.baseLayerUrl, this.options);
  },

  //wfs layer fetching function
  //Note this function will work only for vector layer
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
      url: `${that.baseLayerUrl}/ows?service=WFS&version=1.0.0&request=GetFeature&cql_filter=${that.options.wmsCQL_FILTER[0]}&typeName=${that.options.wmsLayers[0]}&srsName=EPSG:4326&maxFeatures=50&outputFormat=text%2Fjavascript`,
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

        var otherLayers = "";
        var otherStyle = "";
        for (var i = 1; i < that.options.wmsLayers.length; i++) {
          otherLayers += that.options.wmsLayers[i];
          // console.log(otherLayers);
          otherStyle += that.options.wmsStyle[i];
          console.log(that.options.wmsLayers.length);
          if (i != that.options.wmsLayers.length - 1) {
            otherLayers += ",";
            otherStyle += ",";
          }
        }

        var wmsLayerURL = `http://203.159.29.40:8080/geoserver/tajikistan/wms?service=WMS&version=1.1.0&request=GetMap&\
layers=${otherLayers}&\
bbox=${(bboxX1 + bboxX2) * 0.5 - maxValue - bufferBbox},${
          (bboxY1 + bboxY2) * 0.5 - maxValue - bufferBbox
        },${(bboxX1 + bboxX2) * 0.5 + maxValue + bufferBbox},${
          (bboxY1 + bboxY2) * 0.5 + maxValue + bufferBbox
        }&\
width=${that.options.width}&\
height=${that.options.height}&\
srs=EPSG%3A4326&\
format=image/png`;
        $(`#${that.options.wmsId}`).attr("src", wmsLayerURL);
        return that;
      },
    });
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
