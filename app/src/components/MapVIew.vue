<template>
  <div id="map" style="height: 100vh; width: 100%">
    <slot></slot>
  </div>

  <JoinEventVIew
    :isOpenJoinEventEvent="isOpenJoinEventEvent"
    @update:isOpenJoinEventEvent="isOpenJoinEventEvent = $event"
    :targetEvent="selectedEvent"
  ></JoinEventVIew>

  <EditEventView
    :isOpenEditModal="isOpenEditEventEvent"
    :objectToEdit="objectToEdit"
  ></EditEventView>
</template>

<script lang="js">
import { defineComponent, ref } from 'vue';

import L from 'leaflet';
import 'leaflet/dist/leaflet.css'
import JoinEventVIew from './JoinEventVIew.vue';
import { reload } from 'ionicons/icons';
import { state } from '@/assets/js/state.js';
import EditEventView from './EditEventView.vue';

import 'leaflet-search/dist/leaflet-search.min.css'
import 'leaflet-search'

export default defineComponent({

    name: "MapVIew",
    components: {
        JoinEventVIew,
        EditEventView,
    },

    data() {
        return {
            map: "",
            isOpenJoinEventEvent: false,
            isOpenEditEventEvent: false,
            selectedEvent: {},
            objectToEdit: {},
            tileLayers: {
                street: null,
                dark: null,
                satellite: null,
            },
            currentLayer: null,
            state: state
        }
    },

    created() {
        this.$nextTick(() => {
            setTimeout(() => {
                this.initializeMap();
                this.fetchEvents();
                const browserLanguage = navigator.language || navigator.languages[0];
                function translateToBrowserLanguage(lang) {
                    const selectElement = document.querySelector(".goog-te-combo");
                    const translate_button = document.getElementById('translate');
                    if (selectElement) {
                        selectElement.value = lang; // Set dropdown to browser language
                        selectElement.dispatchEvent(new Event("change")); // Simulate selection
                    }

                    selectElement.addEventListener("change", (event) => {
                        console.log("Language changed:", event.target.value);
                        document.getElementById('google_translate_element').style.visibility = 'hidden';
                        translate_button.classList.remove('active');
                        window.isTranslateActive = false;

                    });
                }

                translateToBrowserLanguage(browserLanguage)

            }, 100); // Adjust the delay as needed
        });
    },

    watch: {
        state: {
            handler() {
                console.log('State changed:', state);
                if (state.eventAdded) {
                    this.fetchEvents();
                    state.eventAdded = false;
                }
            },
            deep: true,
        },
    },
    methods: {

        reloadMap() {
            // Call the refresh method on the MapView component
            console.log('reloadMap');
        },
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
                    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                        maxZoom: maxZoom,
                        attribution: "© OpenStreetMap contributors",
                    }
                );

                this.tileLayers.dark = L.tileLayer(
                    // "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
                    // "https://tiles.stadiamaps.com/tiles/stamen_watercolor/{z}/{x}/{y}.jpg",
                    // { maxZoom: maxZoom, attribution: "© stadiamaps" }
                    "https://data.geopf.fr/wmts?layer=GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2&style=normal&tilematrixset=PM&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fpng&TileMatrix={z}&TileCol={x}&TileRow={y}", {
                        attribution: "© IGN - GeoPF",
                        tileSize: 256,
                        minZoom: 0,
                        maxZoom: 18,
                        noWrap: true,
                    }
                );

                this.tileLayers.satellite = L.tileLayer(
                    "https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}", {
                        maxZoom: maxZoom,
                        attribution: "© Google Maps",
                        subdomains: ["mt0", "mt1", "mt2", "mt3"],
                    }
                );

                // Set default layer

                this.tileLayers.street.addTo(map);
                this.currentLayer = this.tileLayers.street;


                // Attach zoom event
                map.on("zoomend", this.handleZoom);




                // L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                //   maxZoom: 19,
                //   attribution: '© OpenStreetMap'
                // }).addTo(map);

                window.leafletMap = map
                this.map = map
                window.markerObjects = new L.LayerGroup();

                // Set view to user's location
                this.map.setView([46.603354, 1.888334], 3)


            } else {
                console.error('Map container not found.');
            }

        },

        handleZoom() {
            const zoom = this.map.getZoom();

            // Determine which tile layer to display
            let newLayer;
            if (zoom <= 3) {
                newLayer = this.tileLayers.street; // Dark for low zoom
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

        formatLocalDate(dateString, locale = navigator.language) {
            const date = new Date(dateString);
            return date.toLocaleDateString(locale, {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        },

        // Fetch events from the backend API
        async fetchEvents() {
            try {
                const response = await fetch(`${this.$backBaseUrl}/agoraback/api/get_events`); // Adjust URL as needed
                console.log(response)
                let events = await response.json();
                console.log(events)

                this.map.on("popupclose", function(e) {
                    console.log("Popup closed!", e);
                    document.getElementById("row-header-search").style.visibility = "visible"

                    if (e.popup._source instanceof L.Marker) {
                        console.log("The popup was attached to a marker.");
                    }
                });



                // Loop over the events and create markers
                events.events.forEach((event) => {
                    console.log(event)
                    const { coordinates } = event.geometry; // GeoJSON format
                    const [longitude, latitude] = coordinates; // Fetch coordinates in (lng, lat)

                    let custonIcon = this.$customIconhtml
                    if (event.properties.tags.includes("race")) {
                        custonIcon = this.$customIconhtmlCar
                    } else if (event.properties.tags.includes("cycling") || event.properties.tags.includes("cyclist")) {
                        custonIcon = this.$customIconhtmlCycling
                    } else if (event.properties.tags.includes("party")) {
                        custonIcon = this.$customIconhtmlParty
                    } else if (event.properties.tags.includes("concert")) {
                        custonIcon = this.$customIconhtmlConcert
                    } else if (event.properties.tags.includes("market")) {
                        custonIcon = this.$customIconhtmlMarket
                    }
                    // else if (event.properties.tags.includes("food")) {
                    //     custonIcon = this.$customIconhtmlFood
                    // } else if (event.properties.tags.includes("art")) {
                    //     custonIcon = this.$customIconhtmlArt
                    // } else if (event.properties.tags.includes("tech")) {
                    //     custonIcon = this.$customIconhtmlTech
                    // } else if (event.properties.tags.includes("education")) {
                    //     custonIcon = this.$customIconhtmlEducation
                    // } else if (event.properties.tags.includes("business")) {
                    //     custonIcon = this.$customIconhtmlBusiness
                    // } else if (event.properties.tags.includes("health")) {
                    //     custonIcon = this.$customIconhtmlHealth
                    // } else if (event.properties.tags.includes("social")) {
                    //     custonIcon = this.$customIconhtmlSocial
                    // } else if (event.properties.tags.includes("other")) {
                    //     custonIcon = this.$customIconhtmlOther
                    // }

                    const marker = L.marker([latitude, longitude], { icon: L.divIcon(custonIcon), title: `${event.properties.description} ${event.properties.tags}` }) // Add marker to map

                    window.markerObjects.addLayer(marker)

                    marker.addTo(this.map);

                    if (!event.properties.participants) {
                        event.properties.participants = {}
                    }

                    const eventJson = encodeURIComponent(JSON.stringify({
                        description: event.properties.description,
                        startDate: event.properties.startDate,
                        endDate: event.properties.endDate,
                        startTime: event.properties.startTime,
                        endTime: event.properties.endTime,
                        tags: event.properties.tags
                    }));

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



    <div style="
      padding: 10px;
      text-align: left;
      max-height: 150px;
      overflow-y: scroll;
      word-wrap: break-word;
      font-size: 14px;
      color: #444;
      line-height: 1.5;
    ">

      <div style="margin-bottom: 10px;">
        <strong>Participants:</strong> ${Object.keys(event.properties.participants) && Object.keys(event.properties.participants).length > 0
              ? Object.keys(event.properties.participants).map((participant) => `<span>${participant}: ${event.properties.participants[participant]['comments']}</span>`).join(", ")
              : "No participants yet"
            }
      </div>


      <div style="margin-bottom: 10px;">
        <strong>Description:</strong> ${event.properties.description || "No description available"}
      </div>

      <div style="margin-bottom: 10px;">
        <strong>Dates:</strong> ${this.formatLocalDate(event.properties.startDate.split("T")[0])} to ${this.formatLocalDate(event.properties.endDate.split("T")[0])}
      </div>
      <div style="margin-bottom: 10px;">
        <strong>Time:</strong> ${event.properties.startTime} to ${event.properties.endTime}
      </div>

      <div style="margin-bottom: 10px;">
        <strong>Tags:</strong> ${event.properties.tags.join(", ")}
      </div>

    </div>

  </div>
`;

                    // <button
                    //         onclick="window.openEditModal('${event.id}', '${eventJson}')"
                    //         style="
                    //           background-color: #FFC107;
                    //           color: white;
                    //           border: none;
                    //           padding: 10px 20px;
                    //           border-radius: 5px;
                    //           cursor: pointer;
                    //           font-size: 14px;
                    //           width: 50%;
                    //           margin-top: 10px;
                    //         ">
                    //         <i class="mdi mdi-pencil"></i> Edit
                    //       </button>

                    // Bind the popup to the marker
                    // marker.bindPopup(popupContent);


                    // Store event details globally for the "Join" button click
                    window.openJoinModal = (selectedEvent) => {
                        console.log("Join event:", selectedEvent);
                        this.selectedEvent = selectedEvent;
                        this.isOpenJoinEventEvent = true;
                    };

                    // Store event details globally for the "Join" button click
                    window.openEditModal = (selectedEventId, selectedEventData) => {
                        console.log("Edit event:", selectedEventId, decodeURIComponent(selectedEventData), selectedEventData);
                        this.objectToEdit = JSON.parse(decodeURIComponent(selectedEventData));
                        console.log(this.objectToEdit, "this.objectToEdit");
                        this.isOpenEditEventEvent = true;


                    };


                    //
                    marker.on("click", () => {
                        // Fly to the marker's location
                        document.getElementById("row-header-search").style.visibility = "hidden"
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

                let searchControl = new L.Control.Search({
                    layer: window.markerObjects, // Use stored markers
                    // propertyName: "title",  // Search in popup content
                    marker: false,
                    container: "seach_in_map",
                    textPlaceholder: "Search in description",
                    collapsed: false,
                    moveToLocation: (latlng, title, map) => {
                        map.flyTo(latlng, 12, { animate: true, duration: 1.2 });
                    },
                    filterData: function(text, records) {
                        console.log("Search text:", text);
                        console.log("Original records:", records);

                        // Convert search text to lowercase for case-insensitive search
                        let searchText = text.toLowerCase();

                        // Filter the dictionary: Keep only entries where the key includes the search text
                        let filteredRecords = Object.fromEntries(
                            Object.entries(records).filter(([key, value]) => key.toLowerCase().includes(searchText))
                        );

                        console.log("Filtered records:", filteredRecords);
                        return filteredRecords;
                    }
                });

                this.map.addControl(searchControl);

                document.querySelector(".leaflet-control-search").style.marginTop = "0px";
                document.querySelector(".leaflet-control-search").style.marginLeft = "0px";
                document.querySelector(".leaflet-control-search").style.width = "100%";
                document.querySelector(".leaflet-control-search").style.display = "flex";
                document.querySelector(".leaflet-control-search").style.flexDirection = "row";
                document.querySelector(".leaflet-control-search").style.justifyContent = "space-evenly";

                document.querySelector(".search-tooltip").style.position = "fixed";
                document.querySelector(".search-tooltip").style.top = "10%";
                document.querySelector(".search-tooltip").style.left = "10%";

                // document.querySelector(".search-input").style.width = "85%";




                function adjustSearchWidth() {
                    let searchBox = document.querySelector(`input[id*="searchtext"]`);
                    // searchBox.style.width = "85%";
                    if (!searchBox) return;


                    if (window.innerWidth < 290) {
                        // Mobile devices
                        searchBox.style.width = "30%";
                    } else {
                        // Desktop or larger screens
                        searchBox.style.width = "85%";
                    }



                }
                // Run on page load
                adjustSearchWidth();

                // Update on window resize
                window.addEventListener("resize", adjustSearchWidth);



            } catch (error) {
                console.error("Error fetching events:", error);
            }
        },



    }
})
</script>

<style>
.leaflet-container a.leaflet-popup-close-button {
  width: 40px;
  background-color: #e97223;
  color: white;
}
</style>

<style scoped>
/* .leaflet-control-search {
  margin-top: 0px;
  margin-left: 0px;
  width: 100%;
} */

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
