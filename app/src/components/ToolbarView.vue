<template>
  <v-row id="row-header-search">
    <v-col align="center">
      <v-toolbar floating class="toolabar-perso-style">
        <!-- prepend-icon="mdi-magnify" -->

        <v-btn density="compact" icon="" color="white" @click="geUserNavigatorLocation">
          <v-icon color="orange">mdi-crosshairs-gps</v-icon>
        </v-btn>
        <v-btn density="compact" icon="" color="white" @click="setOpenInfoModal(true)">
          <v-icon color="orange">mdi-information-variant-circle-outline</v-icon>
        </v-btn>

        <!--<v-text-field hide-details single-line density="compact"></v-text-field> -->
        <!-- <ion-searchbar @ionInput="searchMarkers($event)"></ion-searchbar> -->
        <div
          id="seach_in_map"
          style="
            width: 100%;
            background-color: transparent;
            height: 50%;
            margin-bottom: 1%;
          "
        ></div>

        <v-btn
          style="margin-left: 5px"
          density="compact"
          id="translate"
          color="orange"
          @click="toggleTranslate"
          icon="mdi-translate"
        ></v-btn>

        <v-btn density="compact" icon color="white" @click="reloadPage()">
          <v-icon color="orange">mdi-reload</v-icon>
        </v-btn>
      </v-toolbar>
    </v-col>
  </v-row>

  <ion-modal
    :is-open="isInfoOpenModal"
    :initial-breakpoint="0.5"
    :breakpoints="[0, 0.25, 0.5, 0.75]"
    @didDismiss="setOpenInfoModal(false)"
  >
    <ion-header>
      <ion-toolbar>
        <ion-title>Info</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="setOpenInfoModal(false)">Close</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding" style="overflow: scroll">
      <div style="text-align: center; font-weight: bold">
        Create or joint events, activities anywhere.
      </div>

      <p>
        This app aims to encorage people to go out and meet new people or just organise
        activities with your friends.
      </p>

      <p>
        This app let you create and joing fleeting event. The event will be delete
        automaticaly when the end date is reached
      </p>
      <p>
        Don't hesitate to contribute poste your next groupe activity and hopefully peopele
        will join you on your activities like cycling, runnig, hiking or event like party,
        concert, festival,...
      </p>
      <p>
        I you have any suggestion or feedback, don't heistate to contact the developer.
      </p>
    </ion-content>
  </ion-modal>
</template>

<script lang="js">
import { IonSearchbar, alertController, IonTitle, IonButton, IonModal, IonButtons, IonHeader, IonToolbar, IonContent} from "@ionic/vue";
import { defineComponent } from "vue";

import { state } from '@/assets/js/state.js';

export default defineComponent({
    components: { IonSearchbar , alertController, IonTitle, IonButton, IonModal, IonButtons, IonHeader, IonToolbar, IonContent},

    data() {
        return {
            isTranslateActive: false,
            isInfoOpenModal: false,
        }
    },

    created() {
      state.isTranslateActive = this.isTranslateActive;
    },

    methods: {
        toggleTranslate() {
            this.isTranslateActive = !state.isTranslateActive;
            state.isTranslateActive = this.isTranslateActive;
            const translate_button = document.getElementById('translate');
            if (this.isTranslateActive) {
                document.getElementById('google_translate_element').style.visibility = 'visible';
                translate_button.classList.add('active');
            } else {
                document.getElementById('google_translate_element').style.visibility = 'hidden';
                translate_button.classList.remove('active');
            }

            // setTimeout(() => {
            //   this.isTranslateActive = false;
            //   document.getElementById('google_translate_element').style.visibility = 'hidden';
            //   translate_button.classList.remove('active');
            // }, 20000 )

        },

        reloadPage() {
            window.location.reload();
        },

        setOpenInfoModal(open) {
            this.isInfoOpenModal = open;

        },

        presentAlert: async () => {
            const alert = await alertController.create({
                header: `Agora spot`,
                subHeader: 'Créez ou rejoignez des sortie, evenements, activités, ...',
                message: `Objectif: `,
                buttons: ['Close'],
            })

            await alert.present();
        },

        // Function to search and zoom to marker
        searchMarkers(event) {
            console.log(event);
            let searchText = event.detail.value.toLowerCase();
            console.log(searchText);
            console.log(window.eventsLayerGroup)

            eventsLayerGroup.forEach(marker => {
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
                    window.leafletMap.setView([latitude, longitude], 10); // Adjust zoom level as needed

                    // Add a marker for the user's location using HTML and CSS
                    let customIcon= L.divIcon(this.$customIconhtmlUserLocation)

                    L.marker([latitude, longitude], { icon: customIcon }).addTo(window.leafletMap)
                        .bindPopup('You are here!')
                        .openPopup();

                }, (error) => {
                    console.log("Error getting user's location:", error);
                    // this.map.setView([46.603354, 1.888334], 2)
                });
            } else {
                console.log("Geolocation is not supported by this browser.");
                alert("Geolocation is not supported by this browser.");
                this.map.setView([latitude, longitude], 1)
            }

        },
    }

});
</script>

<style scoped>
.toolabar-perso-style {
  z-index: 20000;
  width: 95%;
  height: 60px;
  margin: 2.5%;
  border-style: solid;
  border-width: 2px;
  border-color: #ff6600b2;
  border-radius: 35px;
  background-color: #e972237e; /*#fafafa83; #0ff;;*/
  /* background-image: linear-gradient(#e9722379, #e9722379); */
}

.active {
  border-style: solid;
  border-color: rgb(248, 12, 12);
  border-width: 2px;
  border-radius: 40px;
  animation: pulse-animation 1.5s infinite ease-in-out;
  /* box-shadow: 0 4px 12px rgba(66, 165, 245, 0.5); */
}
</style>
