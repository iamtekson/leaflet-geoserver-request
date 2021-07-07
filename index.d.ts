/// <reference types="leaflet" />

import * as L from 'leaflet';

declare module 'leaflet' {
    namespace Geoserver {
      export function wms(baseLayerUrl: any, options?: any): any;
      export function wfs(baseLayerUrl: any, options?: any): any;
      export function legend(baseLayerUrl: any, options?: any): any;
      export function wmsImage(baseLayerUrl: any, options?: any): any;
    }
}
