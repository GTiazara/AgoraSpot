<template>
    <ion-alert
    :is-open="isOpenShareAlert"
    message="Event link copied to clipboard!"
    :buttons="alertButtons"
    @didDismiss="setOpen(false)"
  ></ion-alert>
</template>

<script lang="js">
import { IonAlert } from '@ionic/vue';
import { inject, ref } from 'vue';
import { close, add } from 'ionicons/icons';
export default {
    components: {
        IonAlert
    },

    name: 'ShareEventView',
    props: {
        isOpenShareEventEvent: Boolean,
        targetEvent: String,
    },
    data() {
        return {
            isOpenShareAlert: false,
            marker: null,
            location: {},
            alertButtons:['Close']

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

                    this.$emit('update:isOpenShareEventEvent', !new_value);
                } else {
                    navigator.clipboard.writeText(eventLink);
                    // alert('');
                    this.setOpen(new_value);
                }
            }


        }
    },

    methods: {
        setOpen(open) {
            this.isOpenShareAlert = open;
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
