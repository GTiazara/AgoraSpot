import { createApp } from 'vue'
import App from './App.vue'
import router from './router';

import { IonicVue } from '@ionic/vue';

/* Core CSS required for Ionic components to work properly */
import '@ionic/vue/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/vue/css/padding.css';
import '@ionic/vue/css/float-elements.css';
import '@ionic/vue/css/text-alignment.css';
import '@ionic/vue/css/text-transformation.css';
import '@ionic/vue/css/flex-utils.css';
import '@ionic/vue/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* @import '@ionic/vue/css/palettes/dark.always.css'; */
/* @import '@ionic/vue/css/palettes/dark.class.css'; */
// import '@ionic/vue/css/palettes/dark.system.css';
// import '@ionic/vue/css/palettes/high-contrast.always.css'
/* Theme variables */
import './theme/variables.css';

// personnal 
// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
// mdi icon with vue
import '@mdi/font/css/materialdesignicons.css'
import './registerServiceWorker'

import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css'


const vuetify = createVuetify({
  components,
  directives,
})

const app = createApp(App)
  .use(IonicVue)
  .use(router)
  .use(vuetify)
  .use(VueSweetalert2);

app.config.globalProperties.$backBaseUrl = "https://agora-spot.vercel.app"
// app.config.globalProperties.$backBaseUrl = "http://localhost:3000"
app.config.globalProperties.$customIconhtml = {
  customImage: "/assets/img/group.gif",
  cutomIcon: {
    className: 'leaflet-marker-icon',
    html: `
      <div style="
          width: 60px; 
          height: 60px; 
          background: radial-gradient(circle at center, #ffa726, #fb8c00, #e65100);
          border-radius: 50%; 
          display: flex; 
          justify-content: center; 
          align-items: center; 
          box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.3); 
          animation: pulse-animation 1.5s infinite ease-in-out;
      ">
          <img src="/assets/img/group.gif" alt=" icon" style="width: 36px; height: 36px; border-radius: 50%;" />
      </div>
    `,
    iconSize: [60, 60], // Size of the custom icon
    iconAnchor: [30, 60], // Position the icon on the map
    popupAnchor: [0, -60], // Position the popup when the marker is clicked}
  }
};

app.config.globalProperties.$customIconhtmlCar = {
  customImage: "/assets/img/championship.gif",
  cutomIcon: {
    className: 'leaflet-marker-icon',
    html: `
      <div style="
          width: 60px; 
          height: 60px; 
          background: radial-gradient(circle at center, #ffa726, #fb8c00, #e65100);
          border-radius: 50%; 
          display: flex; 
          justify-content: center; 
          align-items: center; 
          box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.3); 
          animation: pulse-animation 1.5s infinite ease-in-out;
      ">
          <img src="/assets/img/championship.gif" alt=" icon" style="width: 36px; height: 36px; border-radius: 50%;" />
      </div>
    `,
    iconSize: [60, 60], // Size of the custom icon
    iconAnchor: [30, 60], // Position the icon on the map
    popupAnchor: [0, -60], // Position the popup when the marker is clicked
  }
};

app.config.globalProperties.$customIconhtmlCycling = {
  customImage: "/assets/img/cycling.gif",
  cutomIcon: {
    className: 'leaflet-marker-icon',
    html: `
      <div style="
          width: 60px; 
          height: 60px; 
          background: radial-gradient(circle at center, #ffa726, #fb8c00, #e65100);
          border-radius: 50%; 
          display: flex; 
          justify-content: center; 
          align-items: center; 
          box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.3); 
          animation: pulse-animation 1.5s infinite ease-in-out;
      ">
          <img src="/assets/img/cycling.gif" alt=" icon" style="width: 36px; height: 36px; border-radius: 50%;" />
      </div>
    `,
    iconSize: [60, 60], // Size of the custom icon
    iconAnchor: [30, 60], // Position the icon on the map
    popupAnchor: [0, -60], // Position the popup when the marker is clicked
  }
};

app.config.globalProperties.$customIconhtmlParty = {
  customImage: "/assets/img/party.gif",
  cutomIcon: {
    className: 'leaflet-marker-icon',
    html: `
      <div style="
          width: 60px; 
          height: 60px; 
          background: radial-gradient(circle at center, #ffa726, #fb8c00, #e65100);
          border-radius: 50%; 
          display: flex; 
          justify-content: center; 
          align-items: center; 
          box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.3); 
          animation: pulse-animation 1.5s infinite ease-in-out;
      ">
          <img src="/assets/img/party.gif" alt=" icon" style="width: 36px; height: 36px; border-radius: 50%;" />
      </div>
    `,
    iconSize: [60, 60], // Size of the custom icon
    iconAnchor: [30, 60], // Position the icon on the map
    popupAnchor: [0, -60], // Position the popup when the marker is clicked
  }
};

app.config.globalProperties.$customIconhtmlConcert = {
  customImage: "/assets/img/performance.gif",
  cutomIcon: {
    className: 'leaflet-marker-icon',
    html: `
      <div style="
          width: 60px; 
          height: 60px; 
          background: radial-gradient(circle at center, #ffa726, #fb8c00, #e65100);
          border-radius: 50%; 
          display: flex; 
          justify-content: center; 
          align-items: center; 
          box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.3); 
          animation: pulse-animation 1.5s infinite ease-in-out;
      ">
          <img src="/assets/img/performance.gif" alt=" icon" style="width: 36px; height: 36px; border-radius: 50%;" />
      </div>
    `,
    iconSize: [60, 60], // Size of the custom icon
    iconAnchor: [30, 60], // Position the icon on the map
    popupAnchor: [0, -60], // Position the popup when the marker is clicked
  }

};

app.config.globalProperties.$customIconhtmlMarket = {
  customImage: "/assets/img/stall.gif",
  cutomIcon: {
    className: 'leaflet-marker-icon',
    html: `
      <div style="
          width: 60px; 
          height: 60px; 
          background: radial-gradient(circle at center, #ffa726, #fb8c00, #e65100);
          border-radius: 50%; 
          display: flex; 
          justify-content: center; 
          align-items: center; 
          box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.3); 
          animation: pulse-animation 1.5s infinite ease-in-out;
      ">
          <img src="/assets/img/stall.gif" alt=" icon" style="width: 36px; height: 36px; border-radius: 50%;" />
      </div>
    `,
    iconSize: [60, 60], // Size of the custom icon
    iconAnchor: [30, 60], // Position the icon on the map
    popupAnchor: [0, -60], // Position the popup when the marker is clicked
  }
};

app.config.globalProperties.$customIconhtmlAddLocation = {
  className: 'leaflet-marker-icon',
  html: `
      <div style="
          width: 60px; 
          height: 60px; 
          background: radial-gradient(circle at center, #ffa726, #fb8c00, #e65100);
          border-radius: 50%; 
          display: flex; 
          justify-content: center; 
          align-items: center; 
          box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.3); 
          animation: pulse-animation 1.5s infinite ease-in-out;
      ">
          <img src="/assets/img/add-location.png" alt=" icon" style="width: 36px; height: 36px; border-radius: 50%;" />
      </div>
    `,
  iconSize: [60, 60], // Size of the custom icon
  iconAnchor: [30, 60], // Position the icon on the map
  popupAnchor: [0, -60], // Position the popup when the marker is clicked
};

app.config.globalProperties.$customIconhtmlUserLocation = {
  className: 'leaflet-marker-icon',
  html: `
      <div style="
          width: 60px; 
          height: 60px; 
          background: radial-gradient(circle at center, #ffa726, #fb8c00, #e65100);
          border-radius: 50%; 
          display: flex; 
          justify-content: center; 
          align-items: center; 
          box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.3); 
          animation: pulse-animation 1.5s infinite ease-in-out;
      ">
          <img src="/assets/img/user_1.png" alt=" icon" style="width: 36px; height: 36px; border-radius: 50%;" />
      </div>
    `,
  iconSize: [60, 60], // Size of the custom icon
  iconAnchor: [30, 60], // Position the icon on the map
  popupAnchor: [0, -60], // Position the popup when the marker is clicked
};

app.config.globalProperties.$customIconhtmlRandomFact = {
  className: 'leaflet-marker-icon',
  html: `
      <div style="
          width: 60px; 
          height: 60px; 
          background: radial-gradient(circle at center,rgb(125, 255, 38),rgb(29, 251, 0),rgb(111, 230, 0));
          border-radius: 50%; 
          display: flex; 
          justify-content: center; 
          align-items: center; 
          box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.3); 
          animation: pulse-animation 1.5s infinite ease-in-out;
      ">
          <img src="/assets/img/groundhog-day.gif" alt=" icon" style="width: 36px; height: 36px; border-radius: 50%;" />
      </div>
    `,
  iconSize: [60, 60], // Size of the custom icon
  iconAnchor: [30, 60], // Position the icon on the map
  popupAnchor: [0, -60], // Position the popup when the marker is clicked
};






// Apply styles globally using CSS animation for pulsing effect
const styleElement = document.createElement("style");
styleElement.innerHTML = `
    @keyframes pulse-animation {
      0% {
        transform: scale(1);
        box-shadow: 0 0 16px rgba(255, 102, 0, 0.6);
      }
      50% {
        transform: scale(1.1);
        box-shadow: 0 0 24px rgba(255, 102, 0, 0.8);
      }
      100% {
        transform: scale(1);
        box-shadow: 0 0 16px rgba(255, 102, 0, 0.6);
      }
    }
  `;
document.head.appendChild(styleElement);

// Mount the Vue application after the router is ready
router.isReady().then(() => {
  app.mount('#app');
});