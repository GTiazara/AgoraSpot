<template>

    <div id="map" style="height: 100vh; width: 100%;">

        <slot></slot>


    </div>

</template>

<script lang="js">
import { defineComponent, ref } from 'vue';

import L from 'leaflet';
import 'leaflet/dist/leaflet.css'

export default defineComponent({

    name: "MapVIew",

    created() {
        this.$nextTick(() => {
            setTimeout(() => {
                this.initializeMap();
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

                // L.marker([51.505, -0.09])
                //     .addTo(map)
                //     .bindPopup('A sample popup!')
                //     .openPopup();

            } else {
                console.error('Map container not found.');
            }

        },
    }
})
</script>