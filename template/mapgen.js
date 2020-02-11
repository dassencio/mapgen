const mapgen = {
  // User-defined map settings.
  mapSettings: __MAPGEN__MAP_SETTINGS__,

  // List of unique marker icons represented as data URIs.
  markerIcons: __MAPGEN__MARKER_ICONS__,

  // List containing the data for all markers.
  markers: __MAPGEN__MARKERS__,

  // Reference to Leaflet map instance.
  map: null,

  // List of markers drawn on the map.
  mapMarkers: [],

  // Marker on the map which is currently selected.
  selectedMapMarker: null,

  /**
   * Deselects the currently selected marker on the map.
   */
  deselectSelectedMapMarker: function() {
    if (this.selectedMapMarker) {
      this.selectedMapMarker.setIcon(
        this.selectedMapMarker.mapgenIcons.iconNormal
      );
      this.selectedMapMarker = null;
    }
  },

  /**
   * Callback function invoked when the user clicks on the map.
   */
  onMapClick: function() {
    this.deselectSelectedMapMarker();
  },

  /**
   * Callback function invoked when the user clicks on a marker on the map.
   *
   * @param event Click event data.
   */
  onMapMarkerClick: function(event) {
    const mapMarker = event.target;
    const mapMarkerAlreadySelected = mapMarker === this.selectedMapMarker;
    this.deselectSelectedMapMarker();
    if (!mapMarkerAlreadySelected) {
      mapMarker.setIcon(mapMarker.mapgenIcons.iconSelected);
      this.selectedMapMarker = mapMarker;
    }
    L.DomEvent.stopPropagation(event);
  },

  /**
   * Callback function invoked when the web browser window is resized.
   */
  onResize: function() {
    this.redrawMarkerPopups();
  },

  /**
   * Redraws all marker popups based on the current viewport dimensions.
   */
  redrawMarkerPopups: function() {
    for (const mapMarker of this.mapMarkers) {
      const popup = mapMarker.getPopup();
      if (popup) {
        popup.options.maxWidth = Math.min(
          document.documentElement.clientWidth - 16,
          640
        );
        popup.update();
      }
    }
  },

  /**
   * Draws the map (and all markers).
   */
  drawMap: function() {
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
    this.mapMarkers = [];
    this.selectedMapMarker = null;

    document.title = this.mapSettings["title"];

    this.map = L.map("map", {
      center: this.markers.length > 0 ? undefined : [18, 0],
      layers: L.tileLayer.provider(this.mapSettings["tile provider"]),
      maxBounds: [[-120, -225], [120, 225]],
      maxBoundsViscosity: 1.0,
      zoom: this.markers.length > 0 ? undefined : 3,
      zoomControl: false
    });

    if (this.mapSettings["show zoom control"] === "yes") {
      L.control
        .zoom({ position: this.mapSettings["zoom control position"] })
        .addTo(this.map);
    }

    window.addEventListener("resize", this.onResize.bind(this));

    for (const marker of this.markers) {
      const [normalIconWidth, normalIconHeight] = marker[
        "normal icon dimensions"
      ];
      const [selectedIconWidth, selectedIconHeight] = marker[
        "selected icon dimensions"
      ];
      const iconNormal = L.icon({
        iconUrl: this.markerIcons[marker["normal icon index"]],
        iconSize: [normalIconWidth, normalIconHeight],
        iconAnchor: [normalIconWidth / 2, normalIconHeight],
        popupAnchor: [0, -(selectedIconHeight + 2)]
      });
      const iconSelected = L.icon({
        iconUrl: this.markerIcons[marker["selected icon index"]],
        iconSize: [selectedIconWidth, selectedIconHeight],
        iconAnchor: [selectedIconWidth / 2, selectedIconHeight],
        popupAnchor: [0, -(selectedIconHeight + 2)]
      });

      const mapMarker = L.marker(marker.coordinates, {
        icon: iconNormal
      });
      mapMarker.mapgenIcons = {
        iconNormal: iconNormal,
        iconSelected: iconSelected
      };

      if (marker["popup contents"]) {
        mapMarker.bindPopup(marker["popup contents"], { autoPan: true });
      }

      mapMarker.addTo(this.map);
      this.mapMarkers.push(mapMarker);

      mapMarker.on("click", this.onMapMarkerClick.bind(this));
    }

    this.redrawMarkerPopups();

    if (this.mapMarkers.length > 0) {
      this.map.fitBounds(new L.featureGroup(this.mapMarkers).getBounds());
    }
    this.map.on("click", this.onMapClick.bind(this));
  }
};

mapgen.drawMap();
