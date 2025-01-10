<template>


  <v-row>
    <v-col align="center">



      <ion-tabs style="z-index: 10000; width:90%;">
        <!-- <ion-router-outlet></ion-router-outlet> -->

        <ion-tab tab="test">

        </ion-tab>

        <ion-tab-bar slot="bottom" class="tab-bar-perso-style">

          <ion-tab-button tab="test">
            <img src="/img/edit.gif" alt="home icon" style="width: 50px; height: 50px;" />
          </ion-tab-button>
          <!-- 
          <ion-tab-button tab="radio" href="/radio">
            <ion-icon :icon="radio" />
            <ion-label>Radio</ion-label>
          </ion-tab-button> -->

          <ion-tab-button @click="toggleActive" id="locationButton" tab="test">
            <img src="/img/location.gif" alt="home icon" style="width: 50px; height: 50px;" />
          </ion-tab-button>


          <ion-tab-button @click="setOpen(true)" tab="test">
            <img src="/img/add-user.gif" alt="home icon" style="width: 50px; height: 50px;" />
          </ion-tab-button>

          <!-- <ion-tab-button tab="search" href="/search">
            <ion-icon :icon="search" />
            <ion-label>Search</ion-label>
          </ion-tab-button> -->
        </ion-tab-bar>
      </ion-tabs>
    </v-col>
  </v-row>



  <ion-modal :is-open="isOpen" id="add-event" class="tab-modal">
    <ion-header>
      <ion-toolbar>
        <div>Add Event</div>
        <ion-buttons slot="end">
          <ion-button @click="setOpen(false)">
            <ion-icon :icon="close" />
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <p>Select Event Start and End Dates</p>

      <!-- Single Calendar for Date Range -->
      <ion-item>
        <!-- <ion-label>Select Dates</ion-label> -->
        <ion-datetime locale="fr-FR" presentation="date" :multiple="true" :value="selectedDates"
          @ionChange="handleDateSelection"></ion-datetime>
      </ion-item>

      <!-- Display Selected Dates -->
      <div class="date-display">
        <p>
          Start Date: <strong>{{ startDate ? formatDate(startDate) : "Not selected" }}</strong>
        </p>
        <p>
          End Date: <strong>{{ endDate ? formatDate(endDate) : "Not selected" }}</strong>
        </p>
      </div>

    </ion-content>
  </ion-modal>




</template>
<script setup lang="js">
import { IonDatetime, IonContent, IonTab, IonHeader, IonModal, IonItem, IonButton, IonButtons, IonToolbar, IonTabs, IonRouterOutlet, IonTabBar, IonTabButton, IonLabel, IonIcon } from '@ionic/vue';
import { playCircle, radio, library, search, close } from 'ionicons/icons';
</script>

<script lang="js">
import { inject } from 'vue';
export default {

  data() {
    return {
      isOpen: false,
      marker: null,
      selectedDates: "", // Holds the selected dates as a range or individual
      startDate: "", // Start date
      endDate: "", // End date
      fist_click: true
    };
  },

  setup() {
    this.map = inject('map'); // Get the map instance
  },

  methods: {

    handleDateSelection(event) {
      // Parse the selected dates (start and end) from the event
      console.log(this.selectedDates)
      const dateValue = event.detail.value;
      if (Array.isArray(dateValue) && dateValue.length === 2) {
        this.startDate = dateValue[0]; // First date as start
        this.endDate = dateValue[1]; // Second date as end
      } else if (Array.isArray(dateValue) && dateValue.length > 2) {
        this.selectedDates = [dateValue[0], dateValue[2]]
        console.log("Please select both a start and end date.");
      }
    },
    formatDate(date) {
      // Format date for display (e.g., DD/MM/YYYY)
      return new Date(date).toLocaleDateString("fr-FR", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    },
    setOpen(open) {
      this.isOpen = open
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
          this.marker = L.marker([lat, lng], { draggable: true }).addTo(window.leafletMap);

          // Optionally bind a popup to the marker
          // this.marker.bindPopup('You clicked here!').openPopup();
        }

        this.setOpen(true)
      } else { this.fist_click = false }
    },

  }
};

</script>
<style scoped>
.tab-bar-perso-style {
  z-index: 10000;
  margin-bottom: 30px;
  margin-left: 5%;
  border-radius: 20px;
  background: rgba(240, 240, 240, 0.8);
  /* Neutral background */
  backdrop-filter: blur(8px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 25px;
  border: 1px solid rgba(200, 200, 200, 0.5);
}

ion-tab-button {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 60px;
  height: 60px;
  border-radius: 30px;
  /* Fully rounded buttons */
  background: linear-gradient(135deg, #e8e8e8, #fafafa);
  border: 2px solid rgb(71, 230, 222);
  border-image-slice: 1;
  /* border-image-source: linear-gradient(135deg, #42a5f5, #64b5f6); */
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 4px 8px rgba(66, 165, 245, 0.2);
  overflow: hidden;
  /* Ensures proper containment of child elements */
}

ion-tab-button+ion-tab-button {
  margin-left: 20px;
}

ion-tab-button:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 16px rgba(42, 98, 215, 0.3);
  /* Glow to enhance border effect */
}

ion-tab-button.active {
  background: linear-gradient(135deg, #42a5f5, #64b5f6);
  box-shadow: 0 4px 12px rgba(66, 165, 245, 0.5);
}

ion-tab-button.active {
  /* border-image-source: linear-gradient(135deg, #2196f3, #90caf9, #2196f3); */
  /* Gradient for active state */
}

ion-tab-button img {
  width: 55px;
  height: 55px;
  border-radius: 15px;
  z-index: 10;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
  transition: transform 0.3s ease, filter 0.3s ease;
}

ion-tab-button img:hover {
  transform: scale(1.1);
  filter: drop-shadow(0 0 15px rgba(200, 200, 200, 0.8));
}

ion-tab-button:active {
  transform: scale(1);
  box-shadow: 0 4px 10px rgba(50, 50, 50, 0.2);
}
</style>
