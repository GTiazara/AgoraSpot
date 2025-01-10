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

  <ion-action-sheet :is-open="isOpenLocationActionSheet" class="my-custom-class" header="Add event here"
    :buttons="actionSheetButtons" @didDismiss="actionOnCloseAddLocationSheet($event)"></ion-action-sheet>

  <ion-modal :is-open="isOpen" id="add-event" class="tab-modal">
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button shape="round" size="large" expand="block"
            style="background-color: orange;border-style: solid; border-radius: 15px;margin-left: 15px;">
            add event
          </ion-button>
        </ion-buttons>

        <ion-buttons slot="end">
          <ion-button @click="setOpen(false)" style="background-color: red;border-style: solid;border-radius: 15px">
            <ion-icon :icon="close" />
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">

      <ion-item :button="true" :detail="false" id="select-catégorie" @click="setOpenModalCatégorie(true)">
        <ion-button aria-label="Show/hide password">
          <p>Select event tag: </p> {{ selectedCategorieEventText }}
          <ion-icon slot="icon-only" :icon="add" aria-hidden="true"></ion-icon>
        </ion-button>
        <!-- <ion-select label-placement="floating" fill="outline" label="Select catégories" placeholder="Select catégories">
        </ion-select> -->
      </ion-item>

      <ion-modal :is-open="isOpenModalCatégorie" ref="modalSelectEventCategorie">
        <app-typeahead title="Event tag" :items="eventCategories" :selectedItems="selectedCategorieEvent"
          @selection-change="categorieSelectionChanged($event)"
          @selection-cancel="setOpenModalCatégorie(false)"></app-typeahead>
      </ion-modal>



      <!-- Single Calendar for Date Range -->
      <ion-item>
        <!-- <ion-label>Select Dates</ion-label> -->
        <ion-datetime locale="fr-FR" presentation="date" :multiple="true" :value="selectedDates"
          @ionChange="handleDateSelection">
          <span slot="title">
            <!-- Display Selected Dates -->
            <div class="date-display">
              <p>Select Event Start and End Dates</p>
              <p>
                Start Date: <strong>{{ startDate ? formatDate(startDate) : "Not selected" }}</strong>
              </p>
              <p>
                End Date: <strong>{{ endDate ? formatDate(endDate) : "Not selected" }}</strong>
              </p>
            </div>
          </span>
        </ion-datetime>



      </ion-item>




      <ion-item>
        <v-row>
          <v-col align="left">
            <ion-datetime presentation="time" locale="en-GB-u-hc-h24" @ionChange="handleTimeStartSelection"> <span
                slot="title">Début:{{ startTime }}</span></ion-datetime>
          </v-col align="right">
          <v-col>
            <ion-datetime presentation="time" locale="en-GB-u-hc-h24" @ionChange="handleTimeEndSelection"><span
                slot="title">Fin:{{ endTime }}</span></ion-datetime>
          </v-col>
        </v-row>
      </ion-item>



    </ion-content>
  </ion-modal>








</template>
<script setup lang="js">
import { IonDatetime, IonSelect, IonContent, IonActionSheet, IonTab, IonHeader, IonModal, IonItem, IonButton, IonButtons, IonToolbar, IonTabs, IonRouterOutlet, IonTabBar, IonTabButton, IonLabel, IonIcon } from '@ionic/vue';
import { playCircle, radio, library, search, close } from 'ionicons/icons';
import AppTypeahead from './AppTypeahead.vue';
import { eye, add } from 'ionicons/icons';
</script>

<script lang="js">
import { inject, ref } from 'vue';
export default {

  data() {
    return {
      isOpen: false,
      isOpenLocationActionSheet: false,
      marker: null,
      selectedDates: "", // Holds the selected dates as a range or individual
      startDate: "", // Start date
      endDate: "", // End date

      startTime: "", // Start date
      endTime: "", // End date



      fist_click: true,
      actionSheetButtons: [

        {
          text: 'Yes',
          data: {
            action: 'add_event',
          },
        },
        {
          text: 'No',
          role: 'cancel',
          data: {
            action: 'cancel',
          },
        },
      ],
      // Create a custom Leaflet marker using the CSS styles
      customIcon: L.divIcon({
        className: 'leaflet-marker-icon',
        html: '<span>📍</span>', // Can use text or a small HTML icon for the marker
        iconSize: [40, 40], // Size of the custom icon
        iconAnchor: [20, 40], // Position the icon on the map
        popupAnchor: [0, -40] // Position the popup when the marker is clicked
      }),
      modalSelectEventCategorie: ref(),
      selectedCategorieEvent: [],
      isOpenModalCatégorie: false,

      eventCategories: [
        { text: 'Sport', value: 'sport' },
        { text: 'Cyclist', value: 'cyclist' },
        { text: 'Party', value: 'party' },
        { text: 'Concert', value: 'concert' },
        { text: 'Theater', value: 'theater' },
        { text: 'Festival', value: 'festival' },
        { text: 'Food & Drink', value: 'food-drink' },
        { text: 'Art Exhibition', value: 'art-exhibition' },
        { text: 'Workshop', value: 'workshop' },
        { text: 'Networking Event', value: 'networking-event' },
        { text: 'Conference', value: 'conference' },
        { text: 'Charity', value: 'charity' },
        { text: 'Concert', value: 'concert' },
        { text: 'Outdoor Adventure', value: 'outdoor-adventure' },
        { text: 'Technology', value: 'technology' },
        { text: 'Dance', value: 'dance' },
        { text: 'Live Show', value: 'live-show' },
        { text: 'Comedy', value: 'comedy' },
        { text: 'Business', value: 'business' },
        { text: 'Networking', value: 'networking' },
        { text: 'Wellness', value: 'wellness' },
        { text: 'Market', value: 'market' },
        { text: 'Yoga', value: 'yoga' },
        { text: 'Education', value: 'education' },
        { text: 'Fitness', value: 'fitness' },
        { text: 'Race', value: 'race' },
      ]

    };
  },

  setup() {
    this.map = inject('map'); // Get the map instance
  },

  methods: {
    setOpenModalCatégorie(open) { console.log(this.modalSelectEventCategorie); this.isOpenModalCatégorie = open },

    categorieSelectionChanged(fruits) {
      this.selectedCategorieEvent = fruits;
      this.selectedCategorieEventText = this.formatDataCategorieSearch(this.selectedCategorieEvent);
      // this.modalSelectEventCategorie.$el.dismiss();
      console.log(this.selectedCategorieEvent)

      this.setOpenModalCatégorie(false)
    },

    formatDataCategorieSearch(data) {
      if (data.length === 1) {
        const fruit = this.eventCategories.find((fruit) => fruit.value === data[0]);
        return fruit.text;
      }

      return `${data.length} items`;
    },


    handleDateSelection(event) {
      // Parse the selected dates (start and end) from the event
      console.log(this.selectedDates)
      const dateValue = event.detail.value;
      if (dateValue.length === 2) {
        console.log("change date")
        this.startDate = dateValue[0]; // First date as start
        this.endDate = dateValue[1]; // Second date as end
      } else if (Array.isArray(dateValue) && dateValue.length > 2) {
        this.selectedDates = [dateValue[0], dateValue[2]]
        console.log("Please select both a start and end date.");
      }
    },

    handleTimeStartSelection(event) {
      console.log(event.detail)
      let time_with_sec = event.detail.value.slice(-8)
      this.startTime = time_with_sec.substring(0, 5);

    },

    handleTimeEndSelection(event) {
      console.log(event.detail)
      let time_with_sec = event.detail.value.slice(-8)
      this.endTime = time_with_sec.substring(0, 5);

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
    setOpenLocationActionSheet(open) {
      this.isOpenLocationActionSheet = open

    },
    actionOnCloseAddLocationSheet(event) {
      console.log(JSON.stringify(event.detail, null, 2));
      console.log(event.detail.data.action)

      this.setOpenLocationActionSheet(false)

      if (event.detail.data.action == "add_event") {
        this.setOpen(true)
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
        this.setOpenLocationActionSheet(false)
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

        this.setOpenLocationActionSheet(true)

        // this.setOpen(true)
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
  background: rgba(0, 253, 99, 0.57);
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
  border: 2px solid #e97223;
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
  background: linear-gradient(135deg, #e97223, #e98441);
  box-shadow: 0 4px 12px rgba(66, 165, 245, 0.5);
}

/* ion-tab-button.active { */
/* border-image-source: linear-gradient(135deg, #2196f3, #90caf9, #2196f3); */
/* Gradient for active state */
/* } */

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


.tab-modal {
  --background: transparent;
  /* Fully transparent modal background */
}

.tab-modal ion-content {
  --background: rgba(255, 255, 255, 0);
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
</style>



<style>
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

/* Define the CSS icon */
.leaflet-marker-icon {
  width: 40px;
  height: 40px;
  background-color: #ff7043;
  /* Bright orange */
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.3);
  /* Subtle shadow for depth */
  border: 2px solid #ff5722;
  /* Darker orange for a refined border */
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.leaflet-marker-icon:hover {
  transform: scale(1.1);
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.4);
  /* Increase the shadow on hover */
}

/* Inner icon (such as an event location pin) */
.leaflet-marker-icon::after {
  content: "";
  width: 20px;
  height: 20px;
  background-color: white;
  border-radius: 50%;
  display: block;
  position: absolute;
  background: url('/path/to/your/icon.png') no-repeat center center;
  background-size: cover;
  /* Adjust to fit your icon */
  z-index: 2;
}

.leaflet-marker-icon span {
  position: absolute;
  font-size: 18px;
  color: #fff;
  font-weight: bold;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
}
</style>