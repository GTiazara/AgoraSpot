<template>
  <ion-alert
    :is-open="isOpenJoinEventNoEvent"
    header="Join event"
    sub-header="Select an event first to be able to join it."
    message="You have not selected an event."
    :buttons="alertButtons"
    @didDismiss="setOpenJoinEventNoEvent(false)"
  ></ion-alert>
</template>

<script lang="js" setup>
import { IonAlert, IonButton } from "@ionic/vue";
</script>
<script lang="js">
export default {
  name: "EditEventVIew",

  props: {
    isOpenJoinEventNoEvent: Boolean,
  },

  data() {
    return {
      isOpen: false,
      alertButtons: [{
      text: 'Cancel',
      role: 'cancel',
      handler: () => {
        console.log('Alert canceled');
        this.setOpenJoinEventNoEvent(false);

      },
    },],
    };
  },
  methods: {
    setOpenJoinEventNoEvent(open) {
      //   this.isOpen = open;
      this.$emit("update:isOpenJoinEventNoEvent", open);
    },
  },
};
</script>
