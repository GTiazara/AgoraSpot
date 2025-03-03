<template>
  <div id="map" style="height: 100vh; width: 100%">
    <slot></slot>
  </div>

  <SpeedialView></SpeedialView>

  <JoinEventVIew
    :isOpenJoinEventEvent="isOpenJoinEventEvent"
    @update:isOpenJoinEventEvent="isOpenJoinEventEvent = $event"
    :targetEvent="selectedEvent"
  ></JoinEventVIew>

  <ShareEventView
    :isOpenShareEventEvent="isOpenShareEventEvent"
    @update:isOpenShareEventEvent="isOpenShareEventEvent = $event"
    :targetEvent="selectedEvent"
  ></ShareEventView>

  <ChatRoomView
    :isOpenChatRoomEvent="isOpenChatRoomEvent"
    @update:isOpenChatRoomEvent="isOpenChatRoomEvent = $event"
    :targetEvent="selectedEventChatRoom"
  ></ChatRoomView>

  <EditEventView
    :isOpenEditModal="isOpenEditEventEvent"
    :objectToEdit="objectToEdit"
  ></EditEventView>
</template>

<script lang="js">
import { defineComponent } from 'vue';

import L from 'leaflet';
import 'leaflet/dist/leaflet.css'
import JoinEventVIew from './JoinEventVIew.vue';
import ShareEventView from './ShareEventView.vue'
import ChatRoomView from './ChatRoomView.vue'
import { state, store } from '@/assets/js/state.js';
import EditEventView from './EditEventView.vue';
import SpeedialView from './SpeedialView.vue';

import 'leaflet-search/dist/leaflet-search.min.css'
import 'leaflet-search'
import 'leaflet.markercluster/dist/leaflet.markercluster.js'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import { IonToast } from "@ionic/vue";
// import { useRoute } from 'vue-router';

export default defineComponent({

    name: "MapVIew",
    components: {
        JoinEventVIew,
        ShareEventView,
        EditEventView,
        IonToast,
        SpeedialView,
        ChatRoomView
    },

    data() {
        return {
            map: "",
            isOpenJoinEventEvent: false,
            isOpenShareEventEvent: false,
            isOpenEditEventEvent: false,
            isOpenChatRoomEvent: false,
            selectedEvent: "",
            selectedEventChatRoom:{},
            objectToEdit: {},
            tileLayers: {
                street: null,
                dark: null,
                satellite: null,
            },
            currentLayer: null,
            state: state,
            markers: null,
            overlayOnMap:null,
        }
    },

    created() {
        setTimeout(() => {
            this.initializeMap();

            window.shareEvent = (selectedEventid) => {
                console.log("window.shareEvent ")
                this.selectedEvent = selectedEventid
                this.isOpenShareEventEvent = true;
            }

            window.ChatRoomEvent = (selectedEventid, selectedEventDescr) => {
                console.log("window.chat room ")
                this.selectedEventChatRoom = {"event_id":selectedEventid, "event_descr":selectedEventDescr}
                this.isOpenChatRoomEvent = true;
            }

            this.fetchEvents();
            const browserLanguage = navigator.language || navigator.languages[0];
            this.translateToBrowserLanguage(browserLanguage)

            this.map.on("popupclose", function(e) {
                try {
                    console.log("Popup closed!", e);
                    document.getElementById("row-header-search").style.visibility = "visible"
                    document.querySelector(".leaflet-control-layers").style.visibility = "visible"
                    if (e.popup._source instanceof L.Marker) {
                        console.log("The popup was attached to a marker.");
                    }
                } catch (error) {
                    console.log("Error closing popup:", error);
                }
            });

            this.map.on("popupopen", function(e) {
                document.getElementById("row-header-search").style.visibility = "hidden"
                document.querySelector(".leaflet-control-layers").style.visibility = "hidden"
            });

            this.map.on('zoomstart', () => {
                window.leafletMap.closePopup()
            })





        }, 500);
    },

    watch: {
        state: {
            handler() {
                console.log("state changeed")
                if (state.eventAdded) {
                    this.fetchEvents();
                    state.eventAdded = false;
                }
            },
            deep: true,
        },
    },
    methods: {
        translateToBrowserLanguage(lang) {
            const selectElement = document.querySelector(".goog-te-combo");
            const translate_button = document.getElementById('translate');
            if (selectElement) {
                selectElement.value = lang; // Set dropdown to browser language
                selectElement.dispatchEvent(new Event("change")); // Simulate selection

                selectElement.addEventListener("change", (event) => {
                    console.log("Language changed:", event.target.value);
                    document.getElementById('google_translate_element').style.visibility = 'hidden';
                    translate_button.classList.remove('active');
                    state.isTranslateActive = true;

                });

            }


        },



        initializeMap() {
            const mapContainer = document.getElementById('map');
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
                        attribution: "© OpenStreetMap",
                    }
                );
                this.tileLayers.cartocdn = L.tileLayer(
                    "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
                        maxZoom: maxZoom,
                        attribution: "© cartocdn",
                    }
                );
                this.tileLayers.ign = L.tileLayer(
                    "https://data.geopf.fr/wmts?layer=GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2&style=normal&tilematrixset=PM&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fpng&TileMatrix={z}&TileCol={x}&TileRow={y}", {
                        attribution: "© IGN - GeoPF",
                        tileSize: 256,
                        minZoom: 0,
                        maxZoom: 18,
                        noWrap: true,
                    }
                );
                this.tileLayers.satellite = L.tileLayer(
                    'http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', {
                        maxZoom: maxZoom,
                        attribution: "© Google Maps",
                        subdomains: ["mt0", "mt1", "mt2", "mt3"],
                    }
                );
                this.tileLayers.opentopomap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
                    attribution: '© OpenTopoMap'
                });
                // Set default layer
                this.tileLayers.street.addTo(map);
                window.leafletMap = map
                store.map = map
                this.map = map
                window.markerObjects = new L.LayerGroup();
                this.popupObjects = new L.LayerGroup();
                this.markers = new L.markerClusterGroup({});

                // Set view to user's location
                this.map.setView([46.603354, 1.888334], 3)
                // this.map.addLayer(this.markers);
                window.markerObjects.addTo(this.map);
                store.randomFactMarkerClusterLayer = this.markers
                map.addLayer(this.popupObjects);

                //overlay
                // this.overlayOnMap={
                //   "RandomFact": store.randomFactMarkerClusterLayer
                // }

                // Layer Control (Basemap Switcher)
                let layerControl = L.control.layers({
                    "OpenStreetMap": this.tileLayers.street,
                    "Satellite": this.tileLayers.satellite,
                    "OpenTopo": this.tileLayers.opentopomap,
                    "IGN": this.tileLayers.ign,
                    "Dark catocdn": this.tileLayers.cartocdn,
                }, {}, { collapsed: true });

                layerControl.addTo(map);

                layerControl.addOverlay(window.markerObjects, "Event")
                layerControl.addOverlay(store.randomFactMarkerClusterLayer, "RandomFact")

                layerControl.expand()

            } else {
                console.error('Map container not found.');
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
        fetchEvents() {
            fetch(`${this.$backBaseUrl}/agoraback/api/get_events`).then(reponse => reponse.json()).then(events => {
                // Loop over the events and create markers
                events.events.forEach((event) => {
                    const { coordinates } = event.geometry; // GeoJSON format
                    const [longitude, latitude] = coordinates; // Fetch coordinates in (lng, lat)

                    let shareButton = ` <div style="padding: 1px; text-align: center;">
                            <button onclick="window.shareEvent('${event.id}')"
                              style="
                                background-color: #007BFF;
                                color: white;
                                border: none;
                                padding: 5px 25px;
                                border-radius: 5px;
                                cursor: pointer;
                                font-size: 12px;
                                width: 50%;
                              ">
                               Share
                            </button>
                          </div>`
                          // 📤

                      let chatRoomButton = ` <div style="padding: 1px; text-align: center;">
                            <button onclick="window.ChatRoomEvent('${event.id}', '${event.properties.description}')"
                              style="
                                background-color: #007BFF;
                                color: white;
                                border: none;
                                padding: 5px 25px;
                                border-radius: 5px;
                                cursor: pointer;
                                font-size: 12px;
                                width: 50%;
                              ">
                               Chat
                            </button>
                          </div>`

                    let custonIcon = this.$customIconhtml.cutomIcon
                    let custonImage = this.$customIconhtml.customImage
                    if (event.properties.tags.includes("race")) {
                        custonIcon = this.$customIconhtmlCar.cutomIcon
                        custonImage = this.$customIconhtmlCar.customImage
                    } else if (event.properties.tags.includes("cycling") || event.properties.tags.includes("cyclist")) {
                        custonIcon = this.$customIconhtmlCycling.cutomIcon
                        custonImage = this.$customIconhtmlCycling.customImage
                    } else if (event.properties.tags.includes("party")) {
                        custonIcon = this.$customIconhtmlParty.cutomIcon
                        custonImage = this.$customIconhtmlParty.customImage
                    } else if (event.properties.tags.includes("concert")) {
                        custonIcon = this.$customIconhtmlConcert.cutomIcon
                        custonImage = this.$customIconhtmlConcert.customImage
                    } else if (event.properties.tags.includes("market")) {
                        custonIcon = this.$customIconhtmlMarket.cutomIcon
                        custonImage = this.$customIconhtmlMarket.customImage
                    } else if (event.properties.tags.includes("location_random_fact")) {
                        custonIcon = this.$customIconhtmlRandomFact
                        let marker = L.marker([latitude, longitude], { icon: L.divIcon(this.$customIconhtmlRandomFact) }) // Add marker to map
                        store.markersDict[event.id] = marker
                        const deviceMaxWidth = Math.min(window.innerWidth * 0.8, 400);

                        store.randomFactMarkerClusterLayer.addLayer(marker);
                        // marker.bindPopup(event.properties.description)
                        marker.on("click", () => {
                            this.map.flyTo([latitude, longitude], 13, {
                                animate: true,
                                duration: 1.2, // Smooth animation duration in seconds
                            });

                            // After the map has moved, adjust the view to set the marker at 3/4 screen height
                            this.map.once("moveend", () => {
                                const mapHeight = document.getElementById('map').offsetHeight;
                                const offsetY = -(mapHeight / 4); // Pan 1/4 of the map's height upward

                                // Pan the map
                                this.map.panBy([0, offsetY], { animate: true });

                                let video = `<iframe width="${deviceMaxWidth*0.98}" height="315"
                                src="${event.properties.eventImage}"
                                frameborder="0" allowfullscreen>
                            </iframe>`


                                this.map.once("moveend", () => {
                                    setTimeout(() => {
                                        // Open the popup manually after the pan animation ends
                                        let popup = L.popup({
                                                maxWidth: deviceMaxWidth,
                                                closeButton: true,
                                                autoClose: true,
                                                closeOnClick: false,
                                                offset: [0, -50],
                                            })
                                            .setLatLng([latitude, longitude])
                                            .setContent(`${video} <br>${shareButton}</br> <br>${event.properties.description}</br>`)
                                        // <iframe width="260" height="315" src="https://www.youtube.com/embed/mPc8LdEwHZQ?si=bb9C59iQJNl9FROa" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>>`
                                        // .openOn(thisObj.popupObjects);

                                        window.leafletMap.openPopup(popup)
                                    }, 200); // Adjust the delay as needed to match the animation timing
                                });
                            });
                        })


                        return
                    }


                    const marker = L.marker([latitude, longitude], { icon: L.divIcon(custonIcon), title: `${event.properties.description} ${event.properties.tags}` }) // Add marker to map
                    store.markersDict[event.id] = marker

                    window.markerObjects.addLayer(marker)

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

     <!-- Event Image -->
    <img src="${event.properties.eventImage || custonImage}"
         alt="Event Image"
         style="width: 100%; border-radius: 10px 10px 0 0; object-fit: contain; max-height: 150px;" />



  <a href="${event.properties.infoSource || '#'}"
           target="_blank"
           style="color: #007BFF; text-decoration: none; font-weight: bold;">
          🔗 View Source
  </a>


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

    <div style="display:flex; flex-direction:column; justify-content: center;">

    ${shareButton}

    ${chatRoomButton}
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


                    //         <i class="mdi mdi-pencil"></i> Edit


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
                            const deviceMaxWidth = Math.min(window.innerWidth * 0.8, 400);
                            this.map.once("moveend", () => {
                                setTimeout(() => {
                                    // Open the popup manually after the pan animation ends
                                    let popup = L.popup({
                                            maxWidth: deviceMaxWidth,
                                            closeButton: true,
                                            autoClose: true,
                                            closeOnClick: false,
                                            offset: [0, -50],
                                        })
                                        .setLatLng([latitude, longitude])
                                        .setContent(popupContent);
                                    // .openOn(thisObj.popupObjects);
                                    window.leafletMap.openPopup(popup)
                                }, 200); // Adjust the delay as needed to match the animation timing
                            });
                        });

                    });



                });

                // const route = useRoute();
                const route = this.$route
                console.log("route", route, this.$route)
                this.optionParam = route.params.optionParam || null;


                if (this.optionParam && route.name == "HomeWithParam") {
                    console.log("Optional Parameter Exists from map comp:", this.optionParam);


                    this.checkAndClickMarker(this.optionParam)
                    // Do something if the parameter exists
                }


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


            })

        },

        checkAndClickMarker(event_id) {
            let foundMarker = store.markersDict[event_id];
            if (foundMarker) {
                // this.setOpenToasNoRandomFactFromAi(true); // Your custom function
                foundMarker.fire('click'); // Simulate a click event on the marker
            }
        }




    }
})
</script>

<style>
.leaflet-container a.leaflet-popup-close-button {
  width: 40px;
  background-color: #e97223;
  color: white;
}

.leaflet-control-layers {
  position: fixed;
  z-index: 10000;
  top: 13%;
  right: 7%;
}
</style>

<style scoped>
/* .leaflet-control-search {
  margin-top: 0px;
  margin-left: 0px;
  width: 100%;
} */

.inactive {
  border-style: solid;
  border-color: grey;
  border-width: 5px;
  border-radius: 30px;
  /* animation: pulse-animation 1.5s infinite ease-in-out; */
  /* box-shadow: 0 4px 12px rgba(66, 165, 245, 0.5); */
}

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

@keyframes pulse-animation {
  0% {
    transform: scale(1);
    box-shadow: 0 0 16px rgba(255, 102, 0, 0.6);
  }
  50% {
    transform: scale(1.1);
    box-shadow: 0 0 24px rgba(255, 102, 0, 0.8);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 16px rgba(255, 102, 0, 0.6);
  }
}
</style>
