<template>
    <v-row>
        <v-col align="center">
            <v-toolbar floating class="toolabar-perso-style">
                <!-- prepend-icon="mdi-magnify" -->
                <v-btn icon density="compact">
                    <v-icon>mdi-crosshairs-gps</v-icon>
                </v-btn>
                <!--<v-text-field hide-details single-line density="compact"></v-text-field> -->
                <ion-searchbar></ion-searchbar>


                <v-btn icon>
                    <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
            </v-toolbar>
        </v-col>
    </v-row>
</template>
<script lang="ts">
import { IonSearchbar } from '@ionic/vue';
import { defineComponent } from 'vue';

export default defineComponent({
    components: { IonSearchbar },
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