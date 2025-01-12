<template>
  <ion-toolbar class="footer-perso-style">
    <v-row style="margin-bottom: 10">
      <v-col align="center" style="padding-left: 1px; padding-right: 1px">
        <v-btn icon="" @click="toggleActive">
          <img src="/assets/img/edit_orange.png" alt="home icon" />
        </v-btn>
      </v-col>
      <v-col align="center" style="padding-left: 1px; padding-right: 1px">
        <!-- <ion-button fill="solid" size="small" color="dark" @click="toggleActive" id="locationButton">
          <img src="/img/location.gif" alt="home icon" style="width: 50px; height: 50px;" />
        </ion-button> -->
        <!-- <v-badge color="info" content="+" class="custom-badge" style="position:relative;top:15px;"> -->
        <v-btn icon="" id="locationButton" @click="toggleActive">
          <img src="/assets/img/orange-marker.png" alt="home icon" />
        </v-btn>
        <!-- </v-badge> -->
      </v-col>
      <v-col align="center" style="padding-left: 1px; padding-right: 1px">
        <v-btn icon="" id="JoinEventButton" @click="toggleActiveJointEvent">
          <img src="/assets/img/add-user.png" alt="home icon" />
        </v-btn>
      </v-col>
    </v-row>
    <AddEventVIew :isOpenLocationActionSheet="isOpenLocationActionSheet2" :location="location"
      @update:isOpenLocationActionSheet="isOpenLocationActionSheet2 = $event"></AddEventVIew>

    <EditEventView :isOpenJoinEventNoEvent="isOpenJoinEventNoEvent"
      @update:isOpenJoinEventNoEvent="setOpenJoinEventNoEvent($event)"></EditEventView>
  </ion-toolbar>
</template>
<script setup lang="js">
import { IonButton, IonToolbar, } from '@ionic/vue';

import AddEventVIew from './AddEventVIew.vue';
import EditEventView from './EditEventView.vue';
</script>

<script lang="js">
import { inject, ref } from 'vue';
export default {

  data() {
    return {
      isOpenLocationActionSheet2: false,
      isOpenJoinEventNoEvent: false,
      marker: null,
      // Create a custom Leaflet marker using the CSS styles
      customIcon: L.divIcon(this.$customIconhtml),
      location: {},
      isActive: false,

    };
  },

  setup() {
    this.map = inject('map'); // Get the map instance
  },

  methods: {


    setOpenLocationActionSheet2(open) {
      this.isOpenLocationActionSheet2 = open

    },
    setOpenJoinEventNoEvent(open) {
      this.isOpenJoinEventNoEvent = open
      const button = document.getElementById('JoinEventButton');
      this.isActive = false;

      if (this.isOpenJoinEventNoEvent) {
        button.classList.add('active'); // Add the 'active' class


      } else {
        button.classList.remove('active'); // Remove the 'active' class
      }
    },
    toggleActive() {
      this.isActive = !this.isActive; // Toggle the state
      const button = document.getElementById('locationButton');

      if (this.isActive) {
        button.classList.add('active'); // Add the 'active' class

        // Add a marker on map click if active
        console.log(window.leafletMap)
        window.leafletMap.on('click', this.addMarker);

      } else {
        button.classList.remove('active'); // Remove the 'active' class
        window.leafletMap.off("click", this.addMarker); // Disable map click
        this.marker = null
        this.fist_click = true
        this.setOpenLocationActionSheet2(false)
      }
    },
    toggleActiveJointEvent() {
      this.isOpenJoinEventNoEvent = true
      this.isActive = !this.isActive; // Toggle the state
      const button = document.getElementById('JoinEventButton');

      if (this.isActive) {
        button.classList.add('active'); // Add the 'active' class


      } else {
        button.classList.remove('active'); // Remove the 'active' class
        this.marker = null
        this.fist_click = true
        this.isOpenJoinEventNoEvent = false
      }

    },

    addMarker(event) {
      const { lat, lng } = event.latlng; // Get the latitude and longitude from the map click event
      if (!this.fist_click) {
        if (this.marker) {
          // Update marker location if it already exists
          this.marker.setLatLng([lat, lng]).update();
        } else {
          // Create a new marker if none exists
          this.marker = L.marker([lat, lng], { draggable: true, icon: this.customIcon }).addTo(window.leafletMap);

          // Optionally bind a popup to the marker
          // this.marker.bindPopup('You clicked here!').openPopup();
        }

        this.location = event.latlng

        this.setOpenLocationActionSheet2(true)

        // this.setOpen(true)
      } else { this.fist_click = false }
    },

  }
};
</script>
<style scoped>
.footer-perso-style {
  z-index: 10000;
  position: fixed;
  bottom: 25px;
  border-style: dotted;
  width: 80%;
  margin-left: auto;
  margin-right: auto;
  margin-left: 10%;
  height: 80px;
  align-content: center;
  border-radius: 20px;
  border-color: rgba(255, 102, 0, 0.8);
  border-width: 2px;
}

button {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 60px;
  height: 60px;
  border-radius: 10px;
  /* Fully rounded buttons */
  /* background: #f28645; */
  border-color: #e97223;
  border-width: 5px;
  border-radius: 30px;
  border-image-slice: 1;
  /* border-image-source: linear-gradient(135deg, #42a5f5, #64b5f6); */
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 4px 8px rgba(66, 165, 245, 0.2);
  overflow: hidden;
  padding-inline-start: 0;
  padding-inline-end: 0;
  /* Ensures proper containment of child elements */
}

#locationButton:hover {
  transform: scale(1.2);
  box-shadow: 0 6px 16px rgba(42, 98, 215, 0.3);
  /* Glow to enhance border effect */
}

.active {
  border-style: solid;
  border-color: green;
  border-width: 5px;
  border-radius: 30px;
  animation: pulse-animation 1.5s infinite ease-in-out;
  /* box-shadow: 0 4px 12px rgba(66, 165, 245, 0.5); */
}

/* ion-tab-button.active { */
/* border-image-source: linear-gradient(135deg, #2196f3, #90caf9, #2196f3); */
/* Gradient for active state */
/* } */

ion-button img {
  /* width: 55px;
  height: 55px; */
  border-radius: 5px;
  z-index: 10;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
  transition: transform 0.3s ease, filter 0.3s ease;
}

ion-button img:hover {
  transform: scale(1.1);
  filter: drop-shadow(0 0 15px rgba(200, 200, 200, 0.8));
}

ion-button:active {
  transform: scale(1);
  box-shadow: 0 4px 10px rgba(50, 50, 50, 0.2);
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
