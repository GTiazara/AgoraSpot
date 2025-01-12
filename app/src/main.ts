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



const vuetify = createVuetify({
  components,
  directives,
})

const app = createApp(App)
  .use(IonicVue)
  .use(router)
  .use(vuetify);


app.config.globalProperties.$customIconhtml = {
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
          <img src="/img/group.gif" alt="home icon" style="width: 36px; height: 36px; border-radius: 50%;" />
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