<template>


  <v-row>
    <v-col align="center">

      <ion-tabs style="z-index: 10000; width:90%;">
        <ion-router-outlet></ion-router-outlet>
        <ion-tab-bar slot="bottom" class="tab-bar-perso-style">

          <ion-button>
            <img src="/img/edit.gif" alt="home icon" style="width: 50px; height: 50px;" />
          </ion-button>
          <!-- 
          <ion-tab-button tab="radio" href="/radio">
            <ion-icon :icon="radio" />
            <ion-label>Radio</ion-label>
          </ion-tab-button> -->

          <ion-button @click="toggleActive" id="locationButton">
            <img src="/img/location.gif" alt="home icon" style="width: 60px; height: 60px;" />
          </ion-button>


          <ion-button @click="setOpen(true)">
            <img src="/img/add-user.gif" alt="home icon" style="width: 60px; height: 60px;" />
          </ion-button>

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
import { IonDatetime, IonContent, IonHeader, IonModal, IonItem, IonButton, IonButtons, IonToolbar, IonTabs, IonRouterOutlet, IonTabBar, IonTabButton, IonLabel, IonIcon } from '@ionic/vue';
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
  margin-bottom: 40px;
  margin-left: 5%;
  border-radius: 30px;
  background: rgba(255, 255, 255, 0.2);
  /* Transparent glass effect */
  backdrop-filter: blur(12px);
  /* Frosted effect */
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  /* Deeper shadow for depth */
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 15px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  /* Border to enhance clarity */
}

ion-button {
  background: transparent;
  /* Ensure background doesn't interfere */
  border: none;
  transition: transform 0.4s ease, box-shadow 0.4s ease;
  padding: 10px;
  position: relative;
}

ion-button img {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  /* Round icons */
  transition: transform 0.3s ease, filter 0.3s ease, box-shadow 0.3s ease;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
  /* Add shadow around icons */
}

ion-button:hover img {
  transform: scale(1.1);
  /* Scale icon on hover */
  filter: drop-shadow(0 0 20px rgba(66, 165, 245, 0.8));
  /* Glow effect */
}

ion-button:hover {
  transform: scale(1.1);
  /* Slightly enlarge button on hover */
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.6);
  /* Subtle glow around button */
}

ion-button:active {
  transform: scale(1);
  /* Shrink slightly when clicked */
  box-shadow: 0 4px 12px rgba(255, 70, 70, 0.6);
  /* Red glow on click */
}

.tab-modal {
  --background: transparent;
  /* Fully transparent modal background */
}

.tab-modal ion-content {
  --background: rgba(255, 255, 255, 0.8);
  /* Frosted white background */
  border-radius: 20px;
  /* Rounded edges */
}

.tab-modal ion-header {
  --background: rgba(0, 0, 0, 0.7);
  /* Dark transparent header */
  color: white;
  /* White text for header */
}

#locationButton img {
  background: linear-gradient(135deg, rgba(58, 123, 213, 0.8), rgba(58, 213, 133, 0.8));
  border: 2px solid rgba(255, 255, 255, 0.4);
  /* Border for added style */
}

/* Glowing animations for buttons */
#locationButton.active img {
  animation: pulseGlow 1.8s infinite;
  /* Pulsating animation */
  filter: drop-shadow(0 0 20px rgba(58, 213, 233, 0.9));
  /* Glow effect */
}

@keyframes pulseGlow {
  0% {
    transform: scale(1);
    filter: drop-shadow(0 0 10px rgba(58, 213, 233, 0.6));
  }

  50% {
    transform: scale(1.05);
    filter: drop-shadow(0 0 25px rgba(58, 213, 233, 1));
  }

  100% {
    transform: scale(1);
    filter: drop-shadow(0 0 10px rgba(58, 213, 233, 0.6));
  }
}

/* Gradient button glow */
ion-button img:hover {
  background: linear-gradient(135deg, rgba(255, 0, 153, 1), rgba(255, 94, 0, 1));
}

ion-button:hover img {
  transition: transform 0.4s, filter 0.4s, border-color 0.4s;
  border: 4px solid rgba(66, 245, 200, 0.8);
  /* Animated border effect */
  transform: rotate(10deg) scale(1.2);
  /* Slight rotation for fun */
}
</style>
