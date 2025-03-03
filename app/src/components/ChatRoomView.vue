<template>
  <ion-modal :is-open="isOpen">
    <ion-header>
      <ion-toolbar>
        <div slot="start">Chat Rooms</div>
        <ion-buttons slot="end">
          <ion-button @click="setOpen(false)" class="top-button-cancel-event">
            Close
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div>
        <vue-advanced-chat
          height="calc(90vh - 20px)"
          :current-user-id="currentUserId"
          :rooms="JSON.stringify(rooms)"
          :rooms-loaded="true"
          :messages="JSON.stringify(messages)"
          :messages-loaded="messagesLoaded"
          @send-message="sendMessage($event.detail[0])"
          @fetch-messages="fetchMessages($event.detail[0])"
        />
      </div>
    </ion-content>
  </ion-modal>
</template>

<script lang="js">
import { IonDatetime, IonTextarea, IonContent, IonActionSheet, IonHeader, IonModal, IonItem, IonButton, IonButtons, IonToolbar, IonIcon } from '@ionic/vue';
import { inject, ref } from 'vue';

import { register } from 'vue-advanced-chat'
// import { register } from '../../vue-advanced-chat/dist/vue-advanced-chat.es.js'
register()

export default {
    components: {
        IonDatetime,
        IonTextarea,
        IonContent,
        IonActionSheet,
        IonHeader,
        IonModal,
        IonItem,
        IonButton,
        IonButtons,
        IonToolbar,
        IonIcon
    },

    name: 'ShareEventView',
    props: {
        isOpenChatRoomEvent: Boolean,
        targetEvent: String,
    },
    data() {
        return {
            isOpen: false,
            marker: null,
            location: {},

            currentUserId: '1234',
            rooms: [{
                roomId: '1',
                roomName: 'Room 1',
                avatar: '/assets/img/group.gif',
                users: [
                    { _id: '1234', username: 'John Doe', avatar: '/assets/img/cycling.gif', },
                    { _id: '4321', username: 'John Snow' }
                ]
            }],
            messages: [],
            messagesLoaded: false


        };
    },

    watch: {
        isOpenChatRoomEvent(new_value) {
            console.log("isOpenChatRoomEvent")
            let eventName = this.targetEvent
            let eventLink = eventName
            this.setOpen(new_value)
            if(new_value){
                this.rooms[0]["roomName"]=eventName
            }
        }
    },

    methods: {
        setOpen(open) {
            this.isOpen = open;
            this.$emit('update:isOpenChatRoomEvent', open);

        },

        checkAndClickMarker(event_id) {
            let foundMarker = store.markersDict[event_id];
            if (foundMarker) {
                // this.setOpenToasNoRandomFactFromAi(true); // Your custom function
                foundMarker.fire('click'); // Simulate a click event on the marker
            }
        },
        fetchMessages({ options = {} }) {
            setTimeout(() => {
                if (options.reset) {
                    // this.messages = this.addMessages(false)
                    console.log("add message")
                } else {
                    // this.messages = [...this.addMessages(), ...this.messages]
                    console.log("add message")
                    this.messagesLoaded = true
                }
                // this.addNewMessage()
            })
        },

        addMessages(reset) {
            const messages = []

            for (let i = 0; i < 30; i++) {
                messages.push({
                    _id: reset ? i : this.messages.length + i,
                    content: `${reset ? '' : 'paginated'} message ${i + 1}`,
                    senderId: '4321',
                    username: 'John Doe',
                    date: '13 November',
                    timestamp: '10:20'
                })
            }

            return messages
        },

        sendMessage(message) {
            this.messages = [
                ...this.messages,
                {
                    _id: this.messages.length,
                    content: message.content,
                    senderId: this.currentUserId,
                    timestamp: new Date().toString().substring(16, 21),
                    date: new Date().toDateString()
                }
            ]
        },

        addNewMessage() {
            setTimeout(() => {
                this.messages = [
                    ...this.messages,
                    {
                        _id: this.messages.length,
                        content: 'NEW MESSAGE',
                        senderId: '1234',
                        timestamp: new Date().toString().substring(16, 21),
                        date: new Date().toDateString()
                    }
                ]
            }, 2000)
        }



    }
}
</script>
