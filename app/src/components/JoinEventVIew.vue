<template>
    <ion-alert :is-open="isOpen" header="Participant" :inputs="alertInputs" :buttons="alertButtons"
        @didDismiss="setOpen(false)"></ion-alert>
</template>

<script lang="js">
import { IonAlert, IonButton } from "@ionic/vue";
import { inject, ref } from 'vue';
export default {
    components: {
        IonAlert,
        IonButton,
    },

    name: 'JointEventView',
    props: {
        isOpenJoinEventEvent: Boolean,
        targetEvent: String,
    },
    data() {
        return {
            isOpen: false,
            marker: null,
            // Create a custom Leaflet marker using the CSS styles
            customIcon: L.divIcon(this.$customIconhtml),
            location: {},
            isActive: false,
            alertButtons: [{
                text: 'Cancel',
                role: 'cancel',
                handler: () => {
                    console.log('Alert canceled');
                },
            },
            {
                text: 'Join',
                role: 'confirm',
                handler: (event) => {
                    this.updateParticipant(event.name);
                },
            },],
            alertInputs: [
                {
                    name: 'name',
                    type: 'text',
                    placeholder: 'Name',
                },
                // {
                //     placeholder: 'Nickname (max 8 characters)',
                //     attributes: {
                //         maxlength: 8,
                //     },
                // },
                // {
                //     type: 'number',
                //     placeholder: 'Age',
                //     min: 1,
                //     max: 100,
                // },
                // {
                //     type: 'textarea',
                //     placeholder: 'A little about yourself',
                // },
            ]

        };
    },

    watch: {
        isOpenJoinEventEvent(new_value) {
            this.setOpen(new_value)
        }
    },

    methods: {
        setOpen(open) {
            this.isOpen = open;
            this.$emit('update:isOpenJoinEventEvent', open);

        },

        updateParticipant(name) {
            this.setOpen(false);
            fetch(`${this.$backBaseUrl}/agoraback/api/add_participant`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "eventId": this.targetEvent,
                    "participantName": name
                }),
            })
                .then((response) => response.json())
                .then((data) => {
                    console.log('Success:', data);
                })
                .catch((error) => {
                    console.error('Error:', error);
                });


        },
    }
}
</script>
