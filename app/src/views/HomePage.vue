<template>
  <ion-page>
    <ion-header>
      <!-- <ion-toolbar> -->
      <!-- <ion-title>Blank</ion-title> -->
      <!-- </ion-toolbar> -->
    </ion-header>

    <ion-content>
      <MapVIew>
        <ToolbarView></ToolbarView>

        <TabarView></TabarView>

        <TranslationView></TranslationView>
      </MapVIew>
    </ion-content>
  </ion-page>
</template>

<script setup lang="js">
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonTabs, IonRouterOutlet, IonTabBar, IonTabButton, IonLabel, IonIcon } from '@ionic/vue';
import { playCircle, radio, library, search } from 'ionicons/icons';
</script>

<script lang="js">
import ToolbarView from '@/components/ToolbarView.vue';
import MapVIew from '@/components/MapVIew.vue';
import TabarView from '@/components/TabarView.vue';
import TranslationView from '@/components/TranslationView.vue';
import { state } from '@/assets/js/state.js';
export default {
  components: {
    ToolbarView,
    MapVIew,
    TabarView,
    TranslationView,
  },
  data() {
    return {
      playCircle,
      radio,
      library,
      search,
    };
  },

  created() {
    fetch(`${this.$backBaseUrl}/agoraback/api/clean_up_event`).then(res => res.json()).then(json_res => {
      console.log(json_res);
    });
  },
};
</script>

<style scoped>
#container {
  text-align: center;

  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}

#container strong {
  font-size: 20px;
  line-height: 26px;
}

#container p {
  font-size: 16px;
  line-height: 22px;

  color: #8c8c8c;

  margin: 0;
}

#container a {
  text-decoration: none;
}
</style>
