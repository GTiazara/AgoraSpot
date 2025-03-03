<template>
  <ion-modal
    :is-open="isOpen"
    :initial-breakpoint="0.25"
    :breakpoints="[0, 0.25, 0.5, 0.75]"
  >
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="end">
          <ion-button @click="setOpen(false)" class="top-button-cancel-event">
            cancel

            <ion-icon :icon="close" />
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content> </ion-content>
  </ion-modal>
</template>

<script lang="js">
import { IonDatetime, IonTextarea, IonContent, IonActionSheet, IonHeader, IonModal, IonItem, IonButton, IonButtons, IonToolbar, IonIcon } from '@ionic/vue';
import { inject, ref } from 'vue';
import { close, add } from 'ionicons/icons';
export default {
    components: {
        IonDatetime,
        IonTextarea,
        IonContent,
        IonActionSheet,
        IonHeader,
        IonModal,
        IonItem,
        IonButton,
        IonButtons,
        IonToolbar,
        IonIcon
    },

    name: 'ShareEventView',
    props: {
        isOpenShareEventEvent: Boolean,
        targetEvent: String,
    },
    data() {
        return {
            isOpen: false,
            marker: null,
            location: {},

        };
    },

    watch: {
        isOpenShareEventEvent(new_value) {
            console.log("isOpenShareEventEvent")

            let eventName = this.targetEvent
            let eventLink=eventName

            if (new_value) {
                if (navigator.share) {
                    navigator.share({
                        title: `Check out this event: ${eventName}`,
                        url: eventLink
                    }).catch(err => console.error('Sharing failed:', err));
                } else {
                    navigator.clipboard.writeText(eventLink);
                    alert('Event link copied to clipboard!');
                    this.setOpen(new_value)
                }
            }


        }
    },

    methods: {
        setOpen(open) {
            this.isOpen = open;
            this.$emit('update:isOpenShareEventEvent', open);

        },

        checkAndClickMarker(event_id) {
            let foundMarker = store.markersDict[event_id];
            if (foundMarker) {
                // this.setOpenToasNoRandomFactFromAi(true); // Your custom function
                foundMarker.fire('click'); // Simulate a click event on the marker
            }
        }


    }
}
</script>
