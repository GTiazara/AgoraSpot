<template> <v-row>
    <v-col align="center">
      <ion-tabs style="z-index: 10000; width:90%;">
        <ion-router-outlet></ion-router-outlet>
        <ion-tab-bar slot="bottom" class="tab-bar-perso-style">
          <ion-tab-button tab="home" href="/home">
            <ion-icon :icon="playCircle" />
            <ion-label>Listen now</ion-label>
          </ion-tab-button>
          <!-- 
          <ion-tab-button tab="radio" href="/radio">
            <ion-icon :icon="radio" />
            <ion-label>Radio</ion-label>
          </ion-tab-button> -->

          <ion-tab-button @click="toggleActive" id="locationButton">
            <img src="/img/location.gif" alt="home icon" style="width: 60px; height: 60px;" />
          </ion-tab-button>


          <ion-tab-button @click="setOpen(true)">
            <img src="/img/add-user.gif" alt="home icon" style="width: 60px; height: 60px;" />
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
        <ion-subtitle>Add Event</ion-subtitle>
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
import { IonDatetime, IonContent, IonHeader, IonModal, IonTitle, IonButton, IonButtons, IonToolbar, IonTabs, IonRouterOutlet, IonTabBar, IonTabButton, IonLabel, IonIcon } from '@ionic/vue';
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
      }
    },

    addMarker(event) {
      const { lat, lng } = event.latlng; // Get the latitude and longitude from the map click event

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
    },

  }
};

</script>

<style scoped>
.tab-bar-perso-style {
  z-index: 10000;
  margin-bottom: 40px;
  margin-left: 40px;
  border-style: solid;
  border-width: 1px;
  border-color: rgb(0, 0, 0);
  border-radius: 40px;
}

.tab-modal {
  margin: 10px;
}

/* Normal State */
#locationButton {
  transition: all 0.3s ease-in-out;
  transform: scale(1);
  opacity: 1;
  /* Fully visible */
  border: none;
  /* No borders */
  background: transparent;
  /* Ensure transparency */
}

/* Make the image blend without a visible white background */
#locationButton img {
  filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.2));
  /* Soft shadow around the image */
  border-radius: 50%;
  /* Rounded edges */
  width: 60px;
  height: 60px;
  background: transparent;
  /* Remove any white background */
  transition: filter 0.3s ease-in-out, transform 0.3s ease-in-out;
  /* Smooth interactions */
}

/* Active State */
#locationButton.active {
  transform: scale(1.2);
  /* Slight zoom-in effect */
  background: transparent;
  /* Ensure full transparency */
  box-shadow: 0px 0px 25px rgba(66, 164, 245, 0.904);
  /* Beautiful glowing shadow effect */
}

/* Image Animation for Active State */
#locationButton.active img {
  filter: drop-shadow(0 0 15px rgba(66, 165, 245, 1));
  /* Glowing light on the image */
  animation: pulseGlow 1.5s infinite;
  /* Pulsating glow effect */
}

/* Keyframes for Glowing Pulse */
@keyframes pulseGlow {
  0% {
    transform: scale(1);
    /* Normal size */
    filter: drop-shadow(0 0 10px rgba(66, 245, 215, 0.959));
  }

  50% {
    transform: scale(1);
    /* Slightly larger */
    filter: drop-shadow(0 0 20px rgb(66, 245, 200));
  }

  100% {
    transform: scale(1);
    /* Back to normal */
    filter: drop-shadow(0 0 10px rgba(66, 165, 245, 0.8));
  }
}

.tab-modal {
  --background: transparent;
  /* Make the overall modal transparent */
}

.tab-modal ion-content {
  --background: rgba(255, 255, 255, 0.6);
  /* 40% transparency for the modal content */
}

.tab-modal ion-header {
  --background: white;
  /* Fully opaque for the header */
}
</style>