<template>
  <v-dialog v-model="isOpen" max-width="250" @afterLeave="setOpen(false)">
    <v-card title="Descpription">
      <v-card-text>
        {{ description }}
      </v-card-text>
      <v-card-actions>
        <!-- <v-spacer></v-spacer> -->
        <v-btn text="Close" @click="setOpen(false)"></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
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

    name: 'EventDescriptionView',
    props: {
        isOpenEventDescription: Boolean,
        targetEvent: Object,
    },
    data() {
        return {
            isOpen: false,
            description:''
        };
    },

    watch: {
        isOpenEventDescription(new_value) {
            this.setOpen(new_value)
            if (new_value) {
                let event=toRaw(this.targetEvent)
                this.description=toRaw(store.events)[event.id].properties.description
            }
        }
    },

    methods: {
        setOpen(open) {
            this.isOpen = open;
            this.$emit('update:isOpenEventDescription', open);
        },
    }
}
</script>
