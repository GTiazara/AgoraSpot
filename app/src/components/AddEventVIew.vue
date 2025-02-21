<template>
    <ion-action-sheet :is-open="isOpenLocationActionSheet" class="my-custom-class" header="Add event here" :buttons="actionSheetButtons" @didDismiss="actionOnCloseAddLocationSheet($event)">
    
    
    
    </ion-action-sheet>
    
    
    
    <ion-modal :is-open="isOpen" id="add-event" class="tab-modal">
    
        <ion-header>
    
            <ion-toolbar>
    
    
    
    
    
                <ion-buttons slot="start">
    
                    <ion-button class="top-button-post-event" @click="handleAddEvent">
    
                        Create
    
                        <ion-icon :icon="add" />
    
                    </ion-button>
    
                </ion-buttons>
    
                <ion-buttons slot="end">
    
                    <ion-button @click="setOpen(false)" class="top-button-cancel-event">
    
                        cancel
    
                        <ion-icon :icon="close" />
    
                    </ion-button>
    
                </ion-buttons>
    
    
    
            </ion-toolbar>
    
        </ion-header>
    
        <ion-content>
    
    
    
    
    
            <ion-item style="margin-top: 10px;">
    
                <v-row>
    
                    <v-col align="center">
    
                        <ion-button class="top-button-select-tags" @click="setOpenModalCatégorie(true)">
    
    
    
                            <div style="padding:10px;">
    
                                Optional: Select event tag {{ selectedCategorieEventText }}
    
                                <ion-icon slot="icon-only" :icon="add" aria-hidden="true"></ion-icon>
    
                            </div>
    
                        </ion-button>
    
                        <!-- <ion-select label-placement="floating" fill="outline" label="Select catégories" placeholder="Select catégories">
        
                </ion-select> -->
    
                    </v-col>
    
                </v-row>
    
            </ion-item>
    
    
    
            <ion-item style="margin-bottom: 10px;">
    
                <ion-textarea class="top-button-select-tags" rows="2" maxlength="200" minlenght="4" @ionInput="getDescription" :auto-grow="true" placeholder="Enter event description">
    
                </ion-textarea>
    
            </ion-item>
    
    
    
            <ion-modal :is-open="isOpenModalCatégorie" ref="modalSelectEventCategorie">
    
                <app-typeahead title="Event tag" :items="eventCategories" :selectedItems="selectedCategorieEvent" @selection-change="categorieSelectionChanged($event)" @selection-cancel="setOpenModalCatégorie(false)"></app-typeahead>
    
            </ion-modal>
    
    
    
    
    
    
    
            <ion-item>
    
    
    
                <div style="display: flex; flex-direction: column; background-color: white; border-radius: 10px; border-style: solid; border-width: 1px; border-color: blue;  color: white;border-radius: 5px 5px 0px 0px;width: 100%; padding:5px; color:black">
    
    
    
    
    
                    <p>Select dates</p>
    
                    <p>
    
                        Start Date: <strong>{{ startDate ? formatDate(startDate) : "Not selected" }}</strong>
    
                    </p>
    
                    <p>
    
                        End Date: <strong>{{ endDate ? formatDate(endDate) : "Not selected" }}</strong>
    
                    </p>
    
                </div>
    
    
    
    
    
    
    
            </ion-item>
    
    
    
    
    
            <!-- Single Calendar for Date Range -->
    
            <ion-item>
    
                <!-- <ion-label>Select Dates</ion-label> -->
    
                <v-row>
    
                    <v-col align="center">
    
                        <ion-datetime presentation="date" :multiple="true" :value="selectedDates" @ionChange="handleDateSelection">
    
    
                        </ion-datetime>
    
    
    
                    </v-col>
    
                </v-row>
    
            </ion-item>
    
            <ion-item>
    
                <v-row>
    
                    <v-col align="left">
    
    
    
                        <ion-datetime presentation="time" locale="en-GB-u-hc-h24" @ionChange="handleTimeStartSelection">
    
                            <span slot="title">Début:{{ startTime }}</span></ion-datetime>
    
                    </v-col align="right">
    
                    <v-col>
    
    
    
    
    
                        <ion-datetime presentation="time" locale="en-GB-u-hc-h24" @ionChange="handleTimeEndSelection"><span slot="title">Fin:{{ endTime
    
                                    }}</span></ion-datetime>
    
                    </v-col>
    
                </v-row>
    
            </ion-item>
    
    
    
            <ion-item>
    
                <v-row>
    
                    <v-col align="center">
    
                        <p>Optional : Event image link</p>
    
                        <ion-textarea class="top-button-select-tags" rows="2" maxlength="500" minlenght="4" @ionInput="getImage" :auto-grow="true" placeholder="Enter image link like https://www.example.com/image.jpg">
    
                        </ion-textarea>
    
                        <p>Optional: information source</p>
    
                        <ion-textarea class="top-button-select-tags" rows="2" maxlength="500" minlenght="4" @ionInput="getInfoSource" :auto-grow="true" placeholder="Enter sources of information">
    
                        </ion-textarea>
    
                    </v-col>
    
                </v-row>
    
            </ion-item>
    
    
        </ion-content>
    
    </ion-modal>
</template>

<script setup lang="js">
import { IonDatetime, IonTextarea, IonContent, IonActionSheet, IonHeader, IonModal, IonItem, IonButton, IonButtons, IonToolbar, IonIcon } from '@ionic/vue';
import { close, add } from 'ionicons/icons';
import AppTypeahead from './AppTypeahead.vue';
</script>

<script lang="js">
import { inject, ref } from 'vue';
export default {

    name: 'AddEventVIew',


    props: {
        isOpenLocationActionSheet: Boolean,
        location: Object,
        marker: Object,
    },

    data() {
        return {
            isOpen: false,
            // isOpenLocationActionSheet: false,
            selectedDates: [], // Holds the selected dates as a range or individual
            startDate: "", // Start date
            endDate: "", // End date

            startTime: "", // Start date
            endTime: "", // End date


            selectedCategorieEventText: "",
            eventDescription: "",
            first_click: true,
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
            customIcon: L.divIcon(this.$customIconhtml),
            modalSelectEventCategorie: ref(),
            selectedCategorieEvent: [],
            isOpenModalCatégorie: false,

            eventCategories: [
                { text: 'Sport', value: 'sport' },
                { text: 'Cycling', value: 'cycling' },
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
            ],

            eventImage: "",
            eventInfoSource: ""

        };
    },

    setup() {
        this.map = inject('map'); // Get the map instance
    },

    methods: {

        getDescription(event) {
            console.log(event.detail.value)
            this.eventDescription = event.detail.value

        },

        getImage(event) {
            console.log(event.detail.value)
            this.eventImage = event.detail.value
        },

        getInfoSource(event) {
            console.log(event.detail.value)
            this.eventInfoSource = event.detail.value
        },

        async handleAddEvent() {
            const eventData = {
                tags: this.selectedCategorieEvent,
                startDate: this.startDate,
                endDate: this.endDate,
                startTime: this.startTime,
                endTime: this.endTime,
                location: this.location,
                description: this.eventDescription,
                eventImage: this.eventImage,
                infoSource: this.eventInfoSource
            };

            // https://sweetalert2.github.io/#

            if (this.eventDescription == "" || this.eventDescription == null) {
                this.$swal.fire({
                    html: `
                          Description required!
                        `,
                    showConfirmButton: false,
                    showCancelButton: true,
                    cancelButtonText: "Cancel",

                });
                return
            }

            if (this.startDate == "" || this.startDate == null) {
                this.$swal.fire({
                    html: `
                          Start date required!
                        `,
                    showConfirmButton: false,
                    showCancelButton: true,
                    cancelButtonText: "Cancel",

                });
                return
            }

            

            if (this.endDate == "" || this.endDate == null) {
                this.$swal.fire({
                    html: `
                          End date required!
                        `,
                    showConfirmButton: false,
                    showCancelButton: true,
                    cancelButtonText: "Cancel",

                });
                return
            }

            if (this.startTime == "" || this.startTime == null) {
                this.$swal.fire({
                    html: `
                          Start time required!
                        `,
                    showConfirmButton: false,
                    showCancelButton: true,
                    cancelButtonText: "Cancel",

                });
                return
            }

            if (this.endTime == "" || this.endTime == null) {
                this.$swal.fire({
                    html: `
                          Start time required!
                        `,
                    showConfirmButton: false,
                    showCancelButton: true,
                    cancelButtonText: "Cancel",

                });
                return
            }

            console.log(eventData)

            try {
                const response = await fetch(`${this.$backBaseUrl}/agoraback/api/add_event`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(eventData),
                });

                if (!response.ok) {
                    const errorMessage = await response.text();
                    console.error('Server error:', errorMessage);
                    alert('Failed to add the event. Please try again.');
                    return;
                }

                const result = await response.json();
                console.log('Event added successfully:', result);
                // alert('Event added successfully!'); 
                this.setOpen(false);
                // Emit the event to notify the parent component
                this.$emit('event-added');

            } catch (error) {
                console.error('Error sending event data:', error);
                alert('Error adding the event. Please check your connection or server.');
            }
        },

        setOpenModalCatégorie(open) {
            console.log(this.modalSelectEventCategorie);
            this.isOpenModalCatégorie = open
        },

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
            if (Array.isArray(dateValue) && dateValue.length === 2) {
                console.log("change date")
                this.startDate = dateValue[0]; // First date as start
                this.endDate = dateValue[1]; // Second date as end
                this.selectedDates = [dateValue[0], dateValue[1]]
                console.log(document.getElementsByClassName("datetime-selected-date"))
                // document.querySelector(".datetime-selected-date").innerHTML = "Updated Content";

            } else if (Array.isArray(dateValue) && dateValue.length > 2) {
                this.selectedDates = [dateValue[0], dateValue[2]]
                this.startDate = dateValue[0]; // First date as start
                this.endDate = dateValue[2]; // Second date as end

            } else if (Array.isArray(dateValue) && dateValue.length == 1) {
                this.selectedDates = [dateValue[0]]
                this.startDate = dateValue[0]; // First date as start
                this.endDate = dateValue[0]; // Second date as end

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

            // Emit the state change from the child
            this.$emit('update:isOpenLocationActionSheet', false);


            // this.setOpenLocationActionSheet(false)

            try {
                if (event.detail.data.action == "add_event") {
                    this.setOpen(true)
                } else if (event.detail.data.action == "cancel") {
                    // if (this.marker) {
                    // window.leafletMap.removeLayer(this.marker);
                    // this.marker = null
                    // this.first_click = true

                    // }
                }
            } catch (error) {
                console.log(error)
            }


        },


    }
};
</script>

<style scoped>
.top-button-post-event {
    color: #fff;
    /* padding: 15px 25px; */
    border-radius: 10px;
    background-color: #50cc1f;
    /* background-image: radial-gradient(93% 87% at 87% 89%, rgba(0, 0, 0, 0.23) 0%, transparent 86.18%), radial-gradient(66% 87% at 26% 20%, rgba(255, 255, 255, 0.41) 0%, rgba(255, 255, 255, 0) 69.79%, rgba(255, 255, 255, 0) 100%); */
    box-shadow: 2px 19px 31px rgba(0, 0, 0, 0.2);
    font-weight: bold;
    font-size: 16px;
    border: 0;
    user-select: none;
    -webkit-user-select: none;
    touch-action: manipulation;
    cursor: pointer;
    margin-left: 15px;
}

.top-button-cancel-event {
    color: #fff;
    /* padding: 15px 25px; */
    border-radius: 10px;
    background-color: #d62506;
    /* background-image: radial-gradient(93% 87% at 87% 89%, rgba(0, 0, 0, 0.23) 0%, transparent 86.18%), radial-gradient(66% 87% at 26% 20%, rgba(255, 255, 255, 0.41) 0%, rgba(255, 255, 255, 0) 69.79%, rgba(255, 255, 255, 0) 100%); */
    box-shadow: 2px 19px 31px rgba(0, 0, 0, 0.2);
    font-weight: bold;
    font-size: 16px;
    border: 0;
    user-select: none;
    -webkit-user-select: none;
    touch-action: manipulation;
    cursor: pointer;
    margin-right: 15px;
}

.top-button-select-tags {
    background-color: white;
    border: 0;
    margin-bottom: 10px;
    border-radius: 10px;
    padding: 10px;
    border-style: solid;
    border-width: 2px;
    border-color: #0842ff;
}
</style>