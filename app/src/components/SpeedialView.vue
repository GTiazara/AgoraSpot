<template>
  <v-fab
    id="my_fab_button"
    class="ms-4 my_fab_button"
    color="#e97223"
    icon=""
    location="bottom right"
    size="55"
    style="position: fixed; top: 80%; left: 90%; z-index: 3000000000"
    absolute
    offset
  >
    <v-tooltip v-model="show" activator="parent" left>Agora +</v-tooltip>
    <img
      id="random_fact_btn_img"
      src="/assets/img/globe.gif"
      alt="home icon"
      width="85%"
      style="border-radius: 40px"
    />

    <v-speed-dial
      location="top center"
      transition="scale-transition"
      activator="parent"
      @update:modelValue="showLabel"
    >
      <v-btn key="1" color="success" icon @click="fetchRandomAILocation">
        <v-tooltip v-model="show" activator="parent" style="position: sticky" left
          >Agora Random Fact</v-tooltip
        >
        <img
          id="random_fact_btn_img"
          src="/assets/img/groundhog-day.gif"
          alt="home icon"
          width="85%"
          style="border-radius: 40px"
        />
      </v-btn>

      <!-- <v-btn key="2" color="info" icon>
        <img
          id="random_fact_btn_img"
          src="/assets/img/placeholder.gif"
          alt="home icon"
          width="85%"
          style="border-radius: 40px"
        />
      </v-btn> -->
    </v-speed-dial>
  </v-fab>

  <ion-toast
    color="warning"
    style="z-index: 1000000000000000"
    :is-open="isRandomFactToastFromAiOpen"
    message="Unfrotunately, a random fact about a location was generated less than 1 minutes ago. Let's fly to latest."
    :duration="5000"
    @didDismiss="setOpenToasNoRandomFactFromAi(false)"
  ></ion-toast>
</template>

<script lang="js">
import { defineComponent } from 'vue';

import L from 'leaflet';
import 'leaflet/dist/leaflet.css'
import { store } from '@/assets/js/state.js';
import 'leaflet-search/dist/leaflet-search.min.css'
import 'leaflet-search'
import 'leaflet.markercluster/dist/leaflet.markercluster.js'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import { IonToast } from "@ionic/vue";

export default defineComponent({
    name: 'SpeedialView',
    components: {
        IonToast
    },
    data() {
        return {
            show:true,
            isRandomFactToastFromAiOpen: false,
        }
    },

    created(){
        setTimeout(()=>{this.show=false}, 2000)

    },

    methods: {
        showLabel(e){
            if(e){
                this.show=true
                setTimeout(()=>{this.show=!this.show}, 3000)
            }

        },
        setOpenToasNoRandomFactFromAi(open) {
            this.isRandomFactToastFromAiOpen = open
        },

        fetchRandomAILocation() {
            // fetch("https://api.aidungeon.io/locations/random")
            fetch(`${this.$backBaseUrl}/agoraback/api/random_location_fact_api`).then(res => res.json()).then(data => {
                console.log("gemini", data)
                const deviceMaxWidth = Math.min(window.innerWidth * 0.8, 400);
                if (data.code == "cant_add_new_fact") {
                    document.getElementById("random_fact_btn_img").classList.add('inactive');
                    this.setOpenToasNoRandomFactFromAi(true)
                    // store.map.flyTo([data.events[0].geometry.coordinates[1], data.events[0].geometry.coordinates[0]], 12, {
                    //     animate: true,
                    //     duration: 0.2,
                    // });
                    this.checkAndClickMarker(data.events[0].id)

                } else {
                    document.getElementById("random_fact_btn_img").classList.remove('inactive');
                    const marker = L.marker([data.ai_response.geometry.coordinates[1], data.ai_response.geometry.coordinates[0]], { icon: L.divIcon(this.$customIconhtmlRandomFact) })
                    store.randomFactMarkerClusterLayer.addLayer(marker);

                    let video = `<iframe width="${deviceMaxWidth*0.98}" height="315"
                                src="${data.ai_response.properties.eventImage}"
                                frameborder="0" allowfullscreen>
                            </iframe>`


                    marker.on("click", () => {
                        store.map.flyTo([data.ai_response.geometry.coordinates[1], data.ai_response.geometry.coordinates[0]], 13, {
                            animate: true,
                            duration: 1.2, // Smooth animation duration in seconds
                        });

                        // After the map has moved, adjust the view to set the marker at 3/4 screen height
                        store.map.once("moveend", () => {
                            const mapHeight = document.getElementById('map').offsetHeight;
                            const offsetY = -(mapHeight / 4); // Pan 1/4 of the map's height upward

                            // Pan the map
                            store.map.panBy([0, offsetY], { animate: true });

                            store.map.once("moveend", () => {
                                setTimeout(() => {
                                    // Open the popup manually after the pan animation ends
                                    let popup = L.popup({
                                            maxWidth: deviceMaxWidth,
                                            closeButton: true,
                                            autoClose: true,
                                            closeOnClick: false,
                                            offset: [0, -50],
                                        })
                                        .setLatLng([data.ai_response.geometry.coordinates[1], data.ai_response.geometry.coordinates[0]])
                                        .setContent(`${video} <br>${data.ai_response.properties.fact}</br> <br>${data.ai_response.properties.address}</br>`)
                                    // .openOn(this.popupObjects);
                                    store.map.openPopup(popup)
                                }, 200); // Adjust the delay as needed to match the animation timing
                            });
                        });
                    })


                    marker.fire('click');


                }

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
});
</script>
