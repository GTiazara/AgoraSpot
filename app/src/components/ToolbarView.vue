<template>
  <v-row id="row-header-search">
    <v-col align="center">
      <v-toolbar floating class="toolabar-perso-style">
        <!-- prepend-icon="mdi-magnify" -->
        <v-btn icon density="compact" color="orange">
          <v-icon>mdi-crosshairs-gps</v-icon>
        </v-btn>

        <!--<v-text-field hide-details single-line density="compact"></v-text-field> -->
        <ion-searchbar></ion-searchbar>

        <v-btn
          id="translate"
          color="orange"
          @click="toggleTranslate"
          icon="mdi-translate"
        ></v-btn>

        <v-btn icon>
          <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>
      </v-toolbar>
    </v-col>
  </v-row>
</template>
<script lang="js">
import { IonSearchbar } from "@ionic/vue";
import { defineComponent } from "vue";

export default defineComponent({
  components: { IonSearchbar },

  data() {
    return {
      isTranslateActive: false
    }
  },

  methods: {
    toggleTranslate() {
      this.isTranslateActive = !this.isTranslateActive;
      if (this.isTranslateActive) {
        document.getElementById('google_translate_element').style.visibility = 'visible';
      } else {
        document.getElementById('google_translate_element').style.visibility = 'hidden';
      }

    }
  }

});
</script>
<style scoped>
.toolabar-perso-style {
  z-index: 20000;
  width: 90%;
  height: 60px;
  margin: 20px;
  border-style: solid;
  border-width: 1px;
  border-color: rgb(0, 0, 0);
  border-radius: 35px;
}
</style>
