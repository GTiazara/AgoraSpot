<template>
  <v-dialog v-model="isOpen" max-width="250" @afterLeave="setOpen(false)">
    <v-card title="Participats">
      <v-virtual-scroll :items="alertInputs" height="320" item-height="48">
        <template v-slot:default="{ item }">
          <v-list-item :subtitle="item.comment" :title="item.name">
            <template v-slot:prepend>
              <v-icon class="bg-primary">mdi-account</v-icon>
            </template>

            <!-- <template v-slot:append>
              <v-btn icon="mdi-pencil" size="x-small" variant="tonal"></v-btn>
            </template> -->
          </v-list-item>
        </template>
      </v-virtual-scroll>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn text="Close" @click="setOpen(false)"></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <!-- <ion-alert
    :is-open="isOpen"
    header="Participants"
    :inputs="alertInputs"
    :buttons="alertButtons"
    @didDismiss="setOpen(false)"
  >
  </ion-alert> -->
</template>

<script lang="js">
import { IonAlert, IonButton } from "@ionic/vue";
import { inject, ref, toRaw } from 'vue';
import { state, store } from '@/assets/js/state.js';
export default {
    components: {
        IonAlert,
        IonButton,
    },

    name: 'ParticipantsOfEventView',
    props: {
        isOpenJoinParticipatsOfEvent: Boolean,
        targetEvent: Object,
    },
    data() {
        return {
            isOpen: false,
            marker: null,
            // Create a custom Leaflet marker using the CSS styles
            customIcon: L.divIcon(this.$customIconhtml),
            location: {},
            alertInputs: []

        };
    },

    watch: {
        isOpenJoinParticipatsOfEvent(new_value) {
            this.setOpen(new_value)
            if (new_value) {
                let event=toRaw(this.targetEvent)
                if (event.participants.length>0) {
                    this.alertInputs = event.participants.map((name) =>
                    {
                        // console.log(name);
                        // console.log(toRaw(store.events)[event.id].properties.participants[name])
                        return { "name": name, "comment":toRaw(store.events)[event.id].properties.participants[name]["comments"] }
                    })

                }
                else{
                    this.alertInputs = [{"name": "no participants", "comment": "no comment" }]
                }
            }
        }
    },

    methods: {
        setOpen(open) {
            this.isOpen = open;
            this.$emit('update:isOpenJoinParticipatsOfEvent', open);
        },
    }
}
</script>
