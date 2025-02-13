<template>
  <v-row id="row-header-search">
    <v-col align="center">
      <v-toolbar floating class="toolabar-perso-style">
        <!-- prepend-icon="mdi-magnify" -->
        <v-btn icon density="compact" color="orange" @click="geUserNavigatorLocation">
          <v-icon>mdi-crosshairs-gps</v-icon>
        </v-btn>

        <!--<v-text-field hide-details single-line density="compact"></v-text-field> -->
        <!-- <ion-searchbar @ionInput="searchMarkers($event)"></ion-searchbar> -->
        <div
          id="seach_in_map"
          style="width: 100%; background-color: white; height: 50%"
        ></div>

        <v-btn
          id="translate"
          color="orange"
          @click="toggleTranslate"
          icon="mdi-translate"
        ></v-btn>

        <v-btn icon>
          <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>
      </v-toolbar>
    </v-col>
  </v-row>
</template>
<script lang="js">
import { IonSearchbar } from "@ionic/vue";
import { defineComponent } from "vue";

export default defineComponent({
  components: { IonSearchbar },

  data() {
    return {
      isTranslateActive: false
    }
  },

  methods: {
    toggleTranslate() {
      this.isTranslateActive = !this.isTranslateActive;
      if (this.isTranslateActive) {
        document.getElementById('google_translate_element').style.visibility = 'visible';
      } else {
        document.getElementById('google_translate_element').style.visibility = 'hidden';
      }

    },

    // Function to search and zoom to marker
     searchMarkers(event) {
        console.log(event);
        let searchText = event.detail.value.toLowerCase();
        console.log(searchText);
        console.log(window.markerObjects)

        markerObjects.forEach(marker => {
          console.log(marker)
          console.log(Object.getPrototypeOf(Object.getPrototypeOf(marker)))
          console.log(Object.getPrototypeOf(Object.getPrototypeOf(marker)).getPopup.call(marker))
            let popupContent = marker.getPopup().getContent().toLowerCase();
            if (popupContent.includes(searchText) && searchText !== "") {
                // map.setView(marker.getLatLng(), 15); // Zoom to marker
                // marker.openPopup(); // Open popup
                console.log(popupContent)
            }
        });
    },
    geUserNavigatorLocation() {
             // Set view to user's location
             if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition((position) => {
                        const { latitude, longitude } = position.coords;
                        window.leafletMap.setView([latitude, longitude],10); // Adjust zoom level as needed

                        // Add a marker for the user's location using HTML and CSS
                        const userLocationMarker = L.divIcon({
                            className: 'user-location-marker',
                            html: '<div class="user-location-marker-inner"></div>',
                            iconSize: [20, 20],
                            iconAnchor: [10, 10]
                        });
                        L.marker([latitude, longitude], { icon: userLocationMarker }).addTo( window.leafletMap)
                        .bindPopup('You are here!')
                        .openPopup();

                    }, (error) => {
                        console.log("Error getting user's location:", error);
                        // this.map.setView([46.603354, 1.888334], 2)
                    });
                } else {
                    console.log("Geolocation is not supported by this browser.");
                    this.map.setView([latitude, longitude], 1)
                }

    },
  }

});
</script>
<style scoped>
.toolabar-perso-style {
  z-index: 20000;
  width: 90%;
  height: 60px;
  margin: 20px;
  border-style: solid;
  border-width: 1px;
  border-color: rgb(0, 0, 0);
  border-radius: 35px;
}
</style>
