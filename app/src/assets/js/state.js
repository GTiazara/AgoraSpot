import { reactive } from 'vue';

export let state = reactive({
  eventAdded: false,
  isTranslateActive: false,

});

export let store = reactive({
  markersDict: {},
  events:{}
})