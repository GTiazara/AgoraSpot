<template>

    <ion-action-sheet :is-open="isOpenLocationActionSheet" class="my-custom-class" header="Add event here"
        :buttons="actionSheetButtons" @didDismiss="actionOnCloseAddLocationSheet($event)"></ion-action-sheet>

    <ion-modal :is-open="isOpen" id="add-event" class="tab-modal">
        <ion-header>
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-button shape="round" size="large" @click="handleAddEvent" expand="block"
                        style="background-color: orange;border-style: solid; border-radius: 15px;margin-left: 15px;">
                        add event
                    </ion-button>
                </ion-buttons>

                <ion-buttons slot="end">
                    <ion-button @click="setOpen(false)"
                        style="background-color: red;border-style: solid;border-radius: 15px">
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
            <ion-item>
                <ion-textarea rows="2" maxlength="200" minlenght="4" @ionInput="getDescription" :auto-grow="true"
                    placeholder="Saisir un déscription de l'événement">
                </ion-textarea>
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
                        <ion-datetime presentation="time" locale="en-GB-u-hc-h24" @ionChange="handleTimeStartSelection">
                            <span slot="title">Début:{{ startTime }}</span></ion-datetime>
                    </v-col align="right">
                    <v-col>
                        <ion-datetime presentation="time" locale="en-GB-u-hc-h24"
                            @ionChange="handleTimeEndSelection"><span slot="title">Fin:{{ endTime
                                }}</span></ion-datetime>
                    </v-col>
                </v-row>
            </ion-item>

        </ion-content>
    </ion-modal>

</template>
<script setup lang="js">
import { IonDatetime, IonFooter, IonTextarea, IonContent, IonActionSheet, IonTab, IonHeader, IonModal, IonItem, IonButton, IonButtons, IonToolbar, IonTabs, IonRouterOutlet, IonTabBar, IonTabButton, IonLabel, IonIcon } from '@ionic/vue';
import { playCircle, radio, library, search, close } from 'ionicons/icons';
import AppTypeahead from './AppTypeahead.vue';
import { eye, add } from 'ionicons/icons';
</script>

<script lang="js">
import { inject, ref } from 'vue';
export default {

    name: 'AddEventVIew',


    props: {
        isOpenLocationActionSheet: Boolean,
        location: Object,
    },

    data() {
        return {
            isOpen: false,
            // isOpenLocationActionSheet: false,
            marker: null,
            selectedDates: "", // Holds the selected dates as a range or individual
            startDate: "", // Start date
            endDate: "", // End date

            startTime: "", // Start date
            endTime: "", // End date


            selectedCategorieEventText: "",
            eventDescription: "",
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
            customIcon: L.divIcon(this.$customIconhtml),
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

        getDescription(event) {
            console.log(event.detail.value)
            this.eventDescription = event.detail.value

        },

        async handleAddEvent() {
            const eventData = {
                tags: this.selectedCategorieEvent,
                startDate: this.startDate,
                endDate: this.endDate,
                startTime: this.startTime,
                endTime: this.endTime,
                location: this.location,
                description: this.eventDescription
            };

            console.log(eventData)

            try {
                const response = await fetch('http://localhost:3000/agoraback/api/add_event', {
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
                alert('Event added successfully!');
            } catch (error) {
                console.error('Error sending event data:', error);
                alert('Error adding the event. Please check your connection or server.');
            }
        },

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

            // Emit the state change from the child
            this.$emit('update:isOpenLocationActionSheet', false);


            // this.setOpenLocationActionSheet(false)

            try {
                if (event.detail.data.action == "add_event") {
                    this.setOpen(true)
                }
            } catch (error) {
                console.log(error)
            }


        },


    }
};

</script>