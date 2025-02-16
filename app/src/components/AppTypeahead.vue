<template>
  <ion-header>
    <ion-toolbar>
      <ion-buttons slot="end">
        <ion-button @click="cancelChanges()" class="top-button-cancel">Cancel</ion-button>
      </ion-buttons>
      <div style="text-align: center; font-size: 20px; font-weight: bold">
        {{ $props.title }}
      </div>
      <ion-buttons slot="start">
        <ion-button @click="confirmChanges()" class="top-button-confirm"
          >Confirm</ion-button
        >
      </ion-buttons>
    </ion-toolbar>
    <ion-toolbar>
      <ion-searchbar @ionInput="searchbarInput($event)"></ion-searchbar>
    </ion-toolbar>
  </ion-header>

  <ion-content color="light" class="ion-padding">
    <ion-list id="modal-list" :inset="true">
      <ion-item v-for="item in filteredItems" :key="item.value">
        <ion-checkbox
          :value="item.value"
          :checked="isChecked(item.value)"
          @ionChange="checkboxChange($event)"
          >{{ item.text }}</ion-checkbox
        >
      </ion-item>
    </ion-list>
  </ion-content>
</template>

<script lang="js">
import {
    IonButton,
    IonButtons,
    IonCheckbox,
    IonContent,
    IonHeader,
    IonItem,
    IonList,
    IonTitle,
    IonSearchbar,
    IonToolbar,
} from '@ionic/vue';

import { defineComponent, ref } from 'vue';

export default defineComponent({
    props: {
        items: Array,
        selectedItems: Array,
        title: {
            type: String,
            default: 'Select Items',
        },
    },
    emits: ['selection-cancel', 'selection-change'],
    components: {
        IonButton,
        IonButtons,
        IonCheckbox,
        IonContent,
        IonHeader,
        IonItem,
        IonList,
        IonTitle,
        IonSearchbar,
        IonToolbar,
    },
    setup(props, { emit }) {
        const filteredItems = ref([...props.items]);
        const workingSelectedValues = ref([...props.selectedItems]);

        const isChecked = (value) => {
            return workingSelectedValues.value.find((item) => item === value) !== undefined;
        };

        const cancelChanges = () => {
            emit('selection-cancel');
        };

        const confirmChanges = () => {
            emit('selection-change', workingSelectedValues.value);
        };

        const searchbarInput = (event) => {
            filterList(event.target.value);
        };

        /**
         * Update the rendered view with
         * the provided search query. If no
         * query is provided, all data
         * will be rendered.
         */
        const filterList = (searchQuery) => {
            /**
             * If no search query is defined,
             * return all options.
             */
            if (searchQuery === undefined) {
                filteredItems.value = [...props.items];
            } else {
                /**
                 * Otherwise, normalize the search
                 * query and check to see which items
                 * contain the search query as a substring.
                 */
                const normalizedQuery = searchQuery.toLowerCase();
                filteredItems.value = props.items.filter((item) => {
                    return item.text.toLowerCase().includes(normalizedQuery);
                });
            }
        };

        const checkboxChange = (event) => {
            const { checked, value } = event.detail;

            if (checked) {
                workingSelectedValues.value = [...workingSelectedValues.value, value];
            } else {
                workingSelectedValues.value = workingSelectedValues.value.filter((item) => item !== value);
            }
        };

        return {
            filteredItems,
            workingSelectedValues,
            isChecked,
            cancelChanges,
            confirmChanges,
            searchbarInput,
            checkboxChange,
        };
    },
});
</script>

<style scoped>
.top-button-cancel {
  color: #fff;
  /* padding: 15px 25px; */
  border-radius: 10px;
  background-color: #d62506;
  /* background-image: radial-gradient(93% 87% at 87% 89%, rgba(0, 0, 0, 0.23) 0%, transparent 86.18%), radial-gradient(66% 87% at 26% 20%, rgba(255, 255, 255, 0.41) 0%, rgba(255, 255, 255, 0) 69.79%, rgba(255, 255, 255, 0) 100%); */
  box-shadow: 2px 19px 31px rgba(0, 0, 0, 0.2);
  font-weight: bold;
  font-size: 16px;
  border: 0;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  cursor: pointer;
  margin-right: 15px;
}

.top-button-confirm {
  color: #fff;
  /* padding: 15px 25px; */
  border-radius: 10px;
  background-color: #50cc1f;
  /* background-image: radial-gradient(93% 87% at 87% 89%, rgba(0, 0, 0, 0.23) 0%, transparent 86.18%), radial-gradient(66% 87% at 26% 20%, rgba(255, 255, 255, 0.41) 0%, rgba(255, 255, 255, 0) 69.79%, rgba(255, 255, 255, 0) 100%); */
  box-shadow: 2px 19px 31px rgba(0, 0, 0, 0.2);
  font-weight: bold;
  font-size: 16px;
  border: 0;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  cursor: pointer;
  margin-left: 15px;
}
</style>
