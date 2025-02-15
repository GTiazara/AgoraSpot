import { registerSW } from 'virtual:pwa-register'

const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm('New content available. Reload?')) {
      updateSW()
    }
  },
  onOfflineReady() {
    console.log('App is ready to work offline.')
  }
})



// /* eslint-disable no-console */

// import { register } from 'register-service-worker'
// // console.log(process.env.NODE_ENV)
// // console.log(process)
// // if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'development') {
// //   register(`${process.env.BASE_URL}service-worker.js`, {
// console.log(import.meta.env.MODE)
// console.log(import.meta.env.BASE_URL)
// if (import.meta.env.MODE === 'production' || import.meta.env.MODE === 'development') {
//   register(`${import.meta.env.BASE_URL}service-worker.js`, {

//     ready() {
//       console.log(
//         'App is being served from cache by a service worker.\n' +
//         'For more details, visit https://goo.gl/AFskqB'
//       )
//     },
//     registered() {
//       console.log('Service worker has been registered.')
//     },
//     cached() {
//       console.log('Content has been cached for offline use.')
//     },
//     updatefound() {
//       console.log('New content is downloading.')
//     },
//     updated() {
//       console.log('New content is available; please refresh.')
//     },
//     offline() {
//       console.log('No internet connection found. App is running in offline mode.')
//     },
//     error(error) {
//       console.error('Error during service worker registration:', error)
//     }
//   })
// }
