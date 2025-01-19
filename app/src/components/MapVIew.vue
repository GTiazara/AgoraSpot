<template>
  <div id="map" style="height: 100vh; width: 100%">
    <slot></slot>
  </div>
  <JoinEventVIew :isOpenJoinEventEvent="isOpenJoinEventEvent"
    @update:isOpenJoinEventEvent="isOpenJoinEventEvent = $event" :targetEvent="selectedEvent"></JoinEventVIew>
</template>

<script lang="js">
import { defineComponent, ref } from 'vue';

import L from 'leaflet';
import 'leaflet/dist/leaflet.css'
import JoinEventVIew from './JoinEventVIew.vue';

export default defineComponent({

  name: "MapVIew",
  components: {
    JoinEventVIew,
  },

  data() {
    return {
      map: "",
      isOpenJoinEventEvent: false,
      selectedEvent: {},
      tileLayers: {
        street: null,
        dark: null,
        satellite: null,
      },
      currentLayer: null,
    }
  },

  created() {
    this.$nextTick(() => {
      setTimeout(() => {
        this.initializeMap();
        this.fetchEvents();
      }, 100); // Adjust the delay as needed
    });
  },


  methods: {
    initializeMap() {
      const mapContainer = document.getElementById('map');
      console.log(mapContainer)

      if (mapContainer) {

        let maxZoom = 19;

        // var map = L.map('map').fitWorld();
        let map = L.map('map', {
          maxZoom: maxZoom,
          zoomControl: false, // Disable zoom control
        })

        // Define tile layers
        this.tileLayers.street = L.tileLayer(
          "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
          {
            maxZoom: maxZoom,
            attribution: "© OpenStreetMap contributors",
          }
        );

        this.tileLayers.dark = L.tileLayer(
          // "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
          // "https://tiles.stadiamaps.com/tiles/stamen_watercolor/{z}/{x}/{y}.jpg",
          // { maxZoom: maxZoom, attribution: "© stadiamaps" }
          "https://data.geopf.fr/wmts?layer=GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2&style=normal&tilematrixset=PM&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fpng&TileMatrix={z}&TileCol={x}&TileRow={y}",
          {
            attribution: "© IGN - GeoPF",
            tileSize: 256,
            minZoom: 0,
            maxZoom: 18,
            noWrap: true,
          }
        );

        this.tileLayers.satellite = L.tileLayer(
          "https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
          {
            maxZoom: maxZoom,
            attribution: "© Google Maps",
            subdomains: ["mt0", "mt1", "mt2", "mt3"],
          }
        );

        // Set default layer

        this.tileLayers.dark.addTo(map);
        this.currentLayer = this.tileLayers.dark;


        // Attach zoom event
        map.on("zoomend", this.handleZoom);




        // L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        //   maxZoom: 19,
        //   attribution: '© OpenStreetMap'
        // }).addTo(map);

        window.leafletMap = map
        this.map = map

        // Set view to user's location
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords;
            this.map.setView([latitude, longitude], 3); // Adjust zoom level as needed

            // Add a marker for the user's location using HTML and CSS
            const userLocationMarker = L.divIcon({
              className: 'user-location-marker',
              html: '<div class="user-location-marker-inner"></div>',
              iconSize: [20, 20],
              iconAnchor: [10, 10]
            });
            // L.marker([latitude, longitude], { icon: userLocationMarker }).addTo(this.map)
            // .bindPopup('You are here!')
            // .openPopup();

          }, (error) => {
            console.log("Error getting user's location:", error);
            this.map.setView([46.603354, 1.888334], 2)
          });
        } else {
          console.log("Geolocation is not supported by this browser.");
          this.map.setView([latitude, longitude], 1)
        }

      } else {
        console.error('Map container not found.');
      }

    },

    handleZoom() {
      const zoom = this.map.getZoom();

      // Determine which tile layer to display
      let newLayer;
      if (zoom <= 3) {
        newLayer = this.tileLayers.dark; // Dark for low zoom
      } else if (zoom <= 17) {
        newLayer = this.tileLayers.street; // Satellite for medium zoom
      } else {
        newLayer = this.tileLayers.satellite; // Street for high zoom
      }

      // Switch layers if the new layer is different
      if (newLayer !== this.currentLayer) {
        if (this.currentLayer) {
          this.map.removeLayer(this.currentLayer);
        }
        this.map.addLayer(newLayer);
        this.currentLayer = newLayer;
      }
    },

    // Fetch events from the backend API
    async fetchEvents() {
      try {
        const response = await fetch(`${this.$backBaseUrl}/agoraback/api/get_events`); // Adjust URL as needed
        console.log(response)
        let events = await response.json();
        console.log(events)

        // Loop over the events and create markers
        events.events.forEach((event) => {
          console.log(event)
          const { coordinates } = event.geometry; // GeoJSON format
          const [longitude, latitude] = coordinates; // Fetch coordinates in (lng, lat)

          const marker = L.marker([latitude, longitude], { icon: L.divIcon(this.$customIconhtml) }).addTo(this.map); // Add marker to map

          // Create a popup content
          // Create a popup content
          const popupContent = `
  <div style="
    font-family: Arial, sans-serif;
    text-align: center;
    margin: auto;
    padding: 15px;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    background-color: white;
    width: calc(100% - 20px);
    max-width: 400px;
    overflow: hidden;
  ">
    <div style="
      padding: 10px;
      text-align: left;
      max-height: 150px;
      overflow-y: auto;
      word-wrap: break-word;
      font-size: 14px;
      color: #444;
      line-height: 1.5;
    ">

      <div style="margin-bottom: 10px;">
        <strong>Dates:</strong> ${event.properties.startDate} to ${event.properties.endDate}
      </div>
      <div style="margin-bottom: 10px;">
        <strong>Time:</strong> ${event.properties.startTime} to ${event.properties.endTime}
      </div>
      <div style="margin-bottom: 10px;">
        <strong>Participants:</strong> ${event.properties.participants && event.properties.participants.length > 0
              ? event.properties.participants.map((participant) => `<span>${participant}</span>`).join(", ")
              : "No participants yet"
            }
      </div>
      <div style="margin-bottom: 10px;">
        <strong>Tags:</strong> ${event.properties.tags.join(", ")}
      </div>


      <div style="margin-bottom: 10px;">
        <strong>Description:</strong> ${event.properties.description || "No description available"}
      </div>


    </div>
    <div style="padding: 10px; text-align: center;">
      <button
        onclick="window.openJoinModal('${event.id}')"
        style="
          background-color: #4CAF50;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 5px;
          cursor: pointer;
          font-size: 14px;
          width: 50%;
        ">
        Join Now
      </button>
    </div>
  </div>
`;



          // Bind the popup to the marker
          // marker.bindPopup(popupContent);


          // Store event details globally for the "Join" button click
          window.openJoinModal = (selectedEvent) => {
            console.log("Join event:", selectedEvent);
            this.selectedEvent = selectedEvent;
            this.isOpenJoinEventEvent = true;
          };

          //
          marker.on("click", () => {
            // Fly to the marker's location
            this.map.flyTo([latitude, longitude], 15, {
              animate: true,
              duration: 1.2, // Smooth animation duration in seconds
            });

            // After the map has moved, adjust the view to set the marker at 3/4 screen height
            this.map.once("moveend", () => {
              const mapHeight = document.getElementById('map').offsetHeight;
              const offsetY = -(mapHeight / 4); // Pan 1/4 of the map's height upward

              // Pan the map
              this.map.panBy([0, offsetY], { animate: true });

              // Add another "moveend" listener for when the panning animation is completed
              // Add another "moveend" listener for when the panning animation is completed
              const deviceMaxWidth = Math.min(window.innerWidth * 0.8, 400);
              this.map.once("moveend", () => {
                setTimeout(() => {
                  // Open the popup manually after the pan animation ends
                  L.popup({
                    maxWidth: deviceMaxWidth,
                    closeButton: true,
                    autoClose: true,
                    closeOnClick: false,
                    offset: [0, -50],
                  })
                    .setLatLng([latitude, longitude])
                    .setContent(popupContent)
                    .openOn(window.leafletMap);
                }, 200); // Adjust the delay as needed to match the animation timing
              });
            });

          });

        });
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    },



  }
})
</script>

<style>
ion-textarea {
  font-size: 16px;
  /* padding: 8px; */
  border: 1px solid #ccc;
  border-radius: 5px;
}

ion-action-sheet.my-custom-class .action-sheet-group {
  background: #f58840;
}

ion-action-sheet.my-custom-class .action-sheet-title {
  color: #fff;
}

ion-action-sheet.my-custom-class .action-sheet-cancel::after {
  background: #e97223;
}

ion-action-sheet.my-custom-class .action-sheet-button,
ion-action-sheet.my-custom-class .action-sheet-button.ion-focused {
  color: #000000;
}

@media (any-hover: hover) {
  ion-action-sheet.my-custom-class .action-sheet-button:hover {
    color: #000000;
  }
}

ion-action-sheet.my-custom-class ion-backdrop {
  opacity: 0.6;
}

/* Style the icon container */

#map {
  height: 100vh;
  width: 100%;
  position: relative;
}

/* Add this CSS to your stylesheet */
@keyframes blink {
  0% {
    opacity: 1;
  }

  50% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

.user-location-marker {
  position: relative;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: blue;
  border: 2px solid white;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  animation: blink 1s infinite;
}

.user-location-marker-inner {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 10px;
  height: 10px;
  margin-left: -5px;
  margin-top: -5px;
  border-radius: 50%;
  background-color: white;
}
</style>
