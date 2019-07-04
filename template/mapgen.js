// User-defined map settings.
const mapSettings = __MAPGEN__MAP_SETTINGS__;

// List of unique marker icons represented as data URIs.
const markerIcons = __MAPGEN__MARKER_ICONS__;

// List containing the data for all markers.
const markers = __MAPGEN__MARKERS__;

document.title = mapSettings["title"];

// Map tile provider.
const mapProvider =
  "https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png?lang=" +
  mapSettings["language"];

// Attribution shown on the bottom-right corner of the map.
const mapAttribution =
  "&copy; <a href='https://wikimediafoundation.org/wiki/Maps_Terms_of_Use'>" +
  "Wikimedia</a> © <a href='https://www.openstreetmap.org/copyright'>" +
  "OpenStreetMap</a>";

const map = L.map("map", {
  center: markers.length > 0 ? undefined : [18, 0],
  layers: [
    L.tileLayer(mapProvider, {
      attribution: mapAttribution,
      minZoom: 2,
      maxZoom: 19
    })
  ],
  maxBounds: [[-120, -225], [120, 225]],
  maxBoundsViscosity: 1.0,
  zoom: markers.length > 0 ? undefined : 3,
  zoomControl: false
});

if (mapSettings["show zoom control"] === "yes") {
  L.control.zoom({ position: mapSettings["zoom control position"] }).addTo(map);
}

/**
 * Sets the widths of marker popups based on the viewport dimensions.
 *
 * @param markers List of markers whose popups should be processed.
 */
function setMarkerPopupWidths(markers) {
  for (let marker of markers) {
    const popup = marker.getPopup();
    if (popup) {
      popup.options.maxWidth = Math.min(
        document.documentElement.clientWidth - 16,
        640
      );
      popup.update();
    }
  }
}

window.addEventListener("resize", () => setMarkerPopupWidths(allDrawnMarkers));

// Callback function which deselects the currently selected marker.
let deselectSelectedMarker = () => null;
let allDrawnMarkers = [];
for (let marker of markers) {
  const [normalIconWidth, normalIconHeight] = marker["normal icon dimensions"];
  const [selectedIconWidth, selectedIconHeight] = marker[
    "selected icon dimensions"
  ];
  const iconNormal = L.icon({
    iconUrl: markerIcons[marker["normal icon index"]],
    iconSize: [normalIconWidth, normalIconHeight],
    iconAnchor: [normalIconWidth / 2, normalIconHeight],
    popupAnchor: [0, -(selectedIconHeight + 2)]
  });
  const iconSelected = L.icon({
    iconUrl: markerIcons[marker["selected icon index"]],
    iconSize: [selectedIconWidth, selectedIconHeight],
    iconAnchor: [selectedIconWidth / 2, selectedIconHeight],
    popupAnchor: [0, -(selectedIconHeight + 2)]
  });

  const drawnMarker = L.marker(marker.coordinates, {
    icon: iconNormal
  });
  if (marker["popup contents"]) {
    drawnMarker.bindPopup(marker["popup contents"], { autoPan: true });
  }
  drawnMarker.addTo(map);
  allDrawnMarkers.push(drawnMarker);

  drawnMarker.on("click", function(event) {
    deselectSelectedMarker();
    deselectSelectedMarker = () => drawnMarker.setIcon(iconNormal);
    /*
     * The marker's popup is opened/closed before the "click" callback function
     * is invoked. By checking if its popup is currently open, we can determine
     * if the user clicked on a marker which was not already selected (otherwise
     * the popup would be closed at this point).
     */
    if (drawnMarker.getPopup() && drawnMarker.getPopup().isOpen()) {
      event.target.setIcon(iconSelected);
    }
    L.DomEvent.stopPropagation(event);
  });
}

setMarkerPopupWidths(allDrawnMarkers);

if (allDrawnMarkers.length > 0) {
  map.fitBounds(new L.featureGroup(allDrawnMarkers).getBounds());
}
map.on("click", function(event) {
  deselectSelectedMarker();
  deselectSelectedMarker = () => null;
});
