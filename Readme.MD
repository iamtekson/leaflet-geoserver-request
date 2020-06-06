# Documentation L.Geoserver

This is the simple plugin for Geoserver various kind of requests. Using this plugin, we can make WMS, WFS, getLegendGraphic, WMS-Image request.

## Installation and setup

- using NPM:

```js
npm install L.Geoserver
```

- **Quick use** : Add js file to

```html
<script src="[path to js]/L.Geoserver.js"></script>
```

### Web-Map-Service (WMS) Request

```js
var wmsLayer = L.Geoserver.wms("http://localhost:8080/geoserver/wms", {
  layers: "topp:tasmania_roads",
});
wmsLayer.addTo(map);
```

### Web-Feature-Service (WFS) Request

In WFS request, we need to enable the `jsonp` for GeoServer. By default, `jsonp` for GeoServer was desabled. open `$GEOSERVER_HOME\webapps\geoserver\WEB-INF\web.xml` file and uncomment following line,

```xml
<context-param>
    <param-name>ENABLE_JSONP</param-name>
    <param-value>true</param-value>
</context-param>
```

WFS request looks like following,

**Note that wfs request only applicable for vector layer, not for raster**

```js
var wfsLayer = L.Geoserver.wms("http://localhost:8080/geoserver/wms", {
  layers: "topp:tasmania_roads",
});
wfsLayer.addTo(map);
```

### Web-Mapping-Service-Image (WMSImage) request

This is kind a new request. It will generate the image which will zoomed to the desired location. The main different between `wms` and `wmsImage` request is, it can be zoomed to the desired location based on vector layer.

```html
<img src="" id="wmsImage" />
<!-- The id field is required. This id will used in js script option "wmsId"-->
```

```js
L.Geoserver.wmsImage("http://localhost:8080/geoserver/wms", {
  wmsLayers: [
    "workspace:first_layer", //first layer must be vector layer
    "workspace:second_layer",
    "workspace:third_layer",
  ],
  wmsCQL_FILTER: [
    "district=='Syangja'", //The image will be zoomed to the syngja district
    "second filter",
    "INCLUDE", //Include is the default value,
  ],
  wmsStyle: ["style1", "style2", "INCLUDE"],
  format: "image/png",
  wmsId: "wmsImage", //Id of the img tag
  width: 300, //width of the image
  height: 300, //height of image
});
//The image will automatically added to the <img src="" id="wmsImage"> section
```

### Legend Request

```js
layerLegend = L.Geoserver.legend("http://localhost:8080/geoserver/wms", {
  layers: "topp:tasmania_roads",
  style: `stylefile`, //In case of not providing style parameter, it will take the default style
});

a.addTo(map1);
```

### Advance Options for WFS request

```js
var wfsLayerAdvance = L.Geoserver.wms("http://localhost:8080/geoserver/wms", {
  layers: "topp:tasmania_roads",
  style: {
    //wfs request geojson style
    color: "black",
    fillOpacity: "0",
    opacity: "0.5",
  },
  onEachFeature: function (feature, layer) {
    layer.bindPopup("this is popuped");
  },
  CQL_FILTER: "district='Syangja'", //Only this feature will show on a map
});

map.fitBounds(wfsLayerAdvance.getBounds()); //zoomed the map to selected area
wfsLayerAdvance.addTo(map);
```

### #Happy_Coding
