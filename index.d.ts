/// <reference types="leaflet" />

import * as L from 'leaflet';

declare module 'leaflet' {
  interface GeoserverOptions {
    layers?: string;
    format?: string;
    transparent?: boolean;
    CQL_FILTER?: string;
    zIndex?: number;
    version?: string;
    srsname?: string;
    attribution?: string;
    fitLayer?: boolean;
    style?: string;
    onEachFeature?: (feature: any, layer?: Layer) => void;
    width?: number;
    height?: number;
  }
  
  namespace Geoserver {
    export function wms(baseLayerUrl: string, options?: GeoserverOptions): L.TileLayer.WMS;
    export function wfs(baseLayerUrl: string, options?: GeoserverOptions): any;
    export function legend(baseLayerUrl: string, options?: GeoserverOptions): L.Control;
    export function wmsImage(baseLayerUrl: string, options?: GeoserverOptions): any;
  }
}
