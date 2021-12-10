# Documentation leaflet-geoserver-request
[![DOI](https://zenodo.org/badge/268555102.svg)](https://zenodo.org/badge/latestdoi/268555102)
[![Build Status](https://travis-ci.org/iamtekson/leaflet-geoserver-request.svg?branch=master)](https://travis-ci.org/iamtekson/leaflet-geoserver-request)
![GitHub release (latest by date)](https://img.shields.io/github/v/release/iamtekson/L.Geoserver)
![GitHub file size in bytes](https://img.shields.io/github/size/iamtekson/L.Geoserver/src/L.Geoserver.js)


This is the plugin for Geoserver various kind of requests. Using this plugin, we can make WMS, WFS, getLegendGraphic, WMS-Image request. 

[<h3>demo</h3>](https://iamtekson.github.io/leaflet-geoserver-request/examples/maps.html)

### Video tutorial

[![Youtube link](http://i3.ytimg.com/vi/fdUpaWd6I_Y/hqdefault.jpg)](https://youtu.be/fdUpaWd6I_Y)

### Installation and setup

- **using NPM**:

```js
npm install leaflet-geoserver-request
```

- **Quick use** :

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
<script src="[path to js]/L.Geoserver.js"></script>
```

### Web-Map-Service (WMS) Request

WMS request will provides georeferenced map image.

```js
var wmsLayer = L.Geoserver.wms("http://localhost:8080/geoserver/wms", {
  layers: "topp:tasmania_roads",
});
wmsLayer.addTo(map);
```

##### WMS options

| Option      | Type    | Default   | Description                                                                                                                                     |
| ----------- | ------- | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| layers      | string  | undefined | This is required filed. If you have multiple layers, you can add them in a comma seperated values: "workspace:layer1,workspace:layer2"          |
| format      | string  | image/png | formate of the wms request. It may be image/jpeg, image/tiff, application/openlayers                                                            |
| transparent | boolean | true      | transparent of the map                                                                                                                          |
| CQL_FILTER  | string  | INCLUDE   | To filter the layer based on their attribute. [read more about this](https://docs.geoserver.org/latest/en/user/tutorials/cql/cql_tutorial.html) |
| zIndex      | integer | 1000      | zIndex of the layer                                                                                                                             |
| attribution | string  | layer     | attribution of the layer. It will be added at the bottom-left cornor of the map                                                                 |
| style       | string  | undefined | style file associated with that layer. If you didn't provide the style field, it will take default style of the layer                           |

### Web-Feature-Service (WFS) Request

In WFS request, you need to enable the `jsonp` for GeoServer. By default, `jsonp` for GeoServer was desabled. open `$GEOSERVER_HOME\webapps\geoserver\WEB-INF\web.xml` file and uncomment following line,

```xml
<context-param>
    <param-name>ENABLE_JSONP</param-name>
    <param-value>true</param-value>
</context-param>
```

**Note:** WFS request only applicable for vector layer, not for raster

```js
var wfsLayer = L.Geoserver.wfs("http://localhost:8080/geoserver/wfs", {
  layers: "topp:tasmania_roads",
});
wfsLayer.addTo(map);
```

##### WFS options

| Options       | Type               | Default   | Description                                                                                                                                     |
| ------------- | ------------------ | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| layers        | string             | undefined | This is required filed. If you have multiple layers, you can add them in a comma seperated values: "workspace:layer1,workspace:layer2"          |
| style         | js object/function | null      | The style file can be in form of javascript oject or function. eg `style = {color: "black",fillOpacity: "0", opacity: "0.5" }                   |
| onEachFeature | function           | null      | Common region to add this feature is to add popup when the layer cicked. [more detail](https://leafletjs.com/examples/geojson/)                 |
| CQL_FILTER    | string             | INCLUDE   | To filter the layer based on their attribute. [read more about this](https://docs.geoserver.org/latest/en/user/tutorials/cql/cql_tutorial.html) |
| fitLayer      | boolean            | true      | The map automatically zoomed into the loaded data region                                                                                        |

### Web-Mapping-Service-Image (WMSImage) request

This is the custom request naming by me. It will generate the image which will zoomed to the desired location. The main different between `wms` and `wmsImage` request is, it can be zoomed to the desired location based on vector layer.

There are certain convention for this request. Please read carefully

- The first layer must be vector layer in option `wmsLayers`. Rest of other layers can be vector or raster

- You need to provide the same number of data list in `wmsLayers`, `wmsCQL_FILTER` & `wmsStyle` fields

- The map will zoomed to the first parameter of `wmsCQL_FILTER` region

- The default value for the style and cql_filter will be include

- The wmsLayers and wmsId fields are required field

```html
<img src="" id="wmsImage" />
<!-- The id field is required. This id will used in js script option "wmsId"-->
```

```js
L.Geoserver.wmsImage("http://localhost:8080/geoserver/wms", {
  wmsLayers: [
    "workspace:first_layer",
    "workspace:second_layer",
    "workspace:third_layer",
  ],
  wmsCQL_FILTER: ["district=='Syangja'", "INCLUDE", "INCLUDE"],
  wmsStyle: ["style1", "style2", "INCLUDE"],
  format: "image/png",
  wmsId: "wmsImage",
  width: 300,
  height: 300,
});
```

### Legend Request

The legend request will provide the crossponding legend of the layer to the bottom-left position of the map. In case of not providing style parameter, it will take the default style from GeoServer.

```js
var layerLegend = L.Geoserver.legend("http://localhost:8080/geoserver/wms", {
  layers: "topp:tasmania_roads",
  style: `stylefile`,
});

layerLegend.addTo(map);
```

### Advance WFS request demo

```js
var wfsLayerAdvance = L.Geoserver.wfs("http://localhost:8080/geoserver/wms", {
  layers: "topp:tasmania_roads",
  style: {
    color: "black",
    fillOpacity: "0",
    opacity: "0.5",
  },
  onEachFeature: function (feature, layer) {
    layer.bindPopup("this is popuped");
  },
  CQL_FILTER: "district='Syangja'",
});

map.fitBounds(wfsLayerAdvance.getBounds());
wfsLayerAdvance.addTo(map);
```
### Contribution:

Would :heart: to see any contributions.

### Appreciate:
If you liked my work, show some :heart: by :star: repo.

Also you can appreciate by

<p>
 <table style="border-spacing: 5px 10px;">

 <tr>
  <td>
<a href="https://www.buymeacoffee.com/iamtekson"><img src="https://cdn.buymeacoffee.com/buttons/default-orange.png" alt="Buy Me A Coffee" style="max-width:90%;" width="200" height="60"></a>
</td>

  <td style="margin: 10px">
<a href="https://paypal.me/iamtekson"><img src="https://www.paypalobjects.com/webstatic/mktg/Logo/pp-logo-200px.png" alt="PayPal Logo"
style="max-width:90%;" width="200" height="60">
 </td>
 </tr>
 </table>
</p> 
