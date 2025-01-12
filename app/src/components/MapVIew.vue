<template>
  <div id="map" style="height: 100vh; width: 100%">
    <slot></slot>
  </div>
</template>

<script lang="js">
import { defineComponent, ref } from 'vue';

import L from 'leaflet';
import 'leaflet/dist/leaflet.css'

export default defineComponent({

    name: "MapVIew",

    data() {
        return {
            map: "",
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

                // var map = L.map('map').fitWorld();
                let map = L.map('map', {
                    zoomControl: false, // Disable zoom control
                }).setView([51.505, -0.09], 10);

                L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    maxZoom: 19,
                    attribution: '© OpenStreetMap'
                }).addTo(map);

                window.leafletMap = map
                this.map = map


            } else {
                console.error('Map container not found.');
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
                    const { coordinates } = event.geometry; // GeoJSON format
                    const [longitude, latitude] = coordinates; // Fetch coordinates in (lng, lat)

                    const marker = L.marker([latitude, longitude], { icon: L.divIcon(this.$customIconhtml) }).addTo(this.map); // Add marker to map

                    // Create a popup content
                    const popupContent = `
            <strong>Description:</strong> ${event.properties.description || "No description available"}<br>
            <strong>Dates:</strong> ${event.properties.startDate} to ${event.properties.endDate}<br>
            <strong>Time:</strong> ${event.properties.startTime} to ${event.properties.endTime}<br>
            <strong>Tags:</strong> ${event.properties.tags.join(', ')}
          `;

                    // Bind the popup to the marker
                    marker.bindPopup(popupContent);
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
</style>
