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
    
    
    
                <vue-advanced-chat height="calc(90vh - 20px)" :current-user-id="currentUserId" :rooms="JSON.stringify(rooms)" :rooms-loaded="true" :messages="JSON.stringify(messages)" :messages-loaded="messagesLoaded" @send-message="sendMessage($event.detail[0])" @fetch-messages="fetchMessages($event.detail[0])"
    
                    :show-search="false" :show-add-room="false" :show-audio="false" :show-emojis="false" :show-files="false" />
    
    
    
            </div>
    
    
    
        </ion-content>
    
    
    
    </ion-modal>
</template>

<script lang="js">
import { IonDatetime, IonTextarea, IonContent, IonActionSheet, IonHeader, IonModal, IonItem, IonButton, IonButtons, IonToolbar, IonIcon } from '@ionic/vue';
import { inject, ref, toRaw } from 'vue';
import { state, store } from '@/assets/js/state.js';

import { register } from 'vue-advanced-chat'
// import { register } from '../../vue-advanced-chat/dist/vue-advanced-chat.es.js'
import { generateFromEmail, generateUsername } from "unique-username-generator";
// import io from 'socket.io-client';
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
        targetEvent: Object,
    },
    data() {
        return {
            isOpen: false,
            marker: null,
            location: {},

            currentUserId: new Date().getTime().toString(),
            currentUserName: generateUsername(),
            rooms: [{
                roomId: '1',
                roomName: 'Room_1',
                avatar: '/assets/img/group.gif',
                users: [
                    { _id: this.currentUserId, username: this.currentUserName }, //avatar: '/assets/img/cycling.gif',
                ]
            }],
            messages: [],
            messagesLoaded: false,
            event_chat_host: {},
            // socket : io(this.$backBaseUrl, { transports: ["websocket", "polling"] })
            eventSource: null,

        };
    },

    mounted() {
        // this.socket.on('MESSAGE', (data) => {
        //     console.log("reveile message from server", data)
        //     // this.messages = [...this.messages, data.message];
        //     this.addNewMessage(data.message)
        //     // you can also do this.messages.push(data)
        // });

        this.eventSource = new EventSource(this.$backBaseUrl + '/stream');

        this.eventSource.onmessage = (event) => {
            console.log(event)
            try {
                console.log(event)
                this.addNewMessage(JSON.parse(event.data));
            } catch (e) {
                // messages.value.push(event.data);
                console.log(e)
            }
        };

        this.eventSource.onerror = (error) => {
            console.error('SSE error:', error);
            // Optionally, you can implement reconnection logic here.
        };
    },


    watch: {
        isOpenChatRoomEvent(new_value) {
            console.log("isOpenChatRoomEvent", toRaw(this.targetEvent))
            this.event_chat_host = store.events[this.targetEvent.event_id]
            console.log("chat targ event", this.event_chat_host)
            let eventName = this.targetEvent["event_descr"]
            let eventLink = eventName

            if (this.event_chat_host.properties.eventChat && this.event_chat_host.properties.eventChat.length > 0) {
                this.messages = this.event_chat_host.properties.eventChat
            } else {
                console.log('mo messages')
                this.messages.push({
                    _id: 0,
                    // content: `${reset ? '' : 'paginated'} message ${i + 1}`,
                    content: "No conversation stared yet. Start the conv if you have info or question...",
                    senderId: this.currentUserId,
                    username: this.currentUserName,
                    date: new Date().toISOString(),
                    timestamp: `${new Date().getHours().toString()}:${new Date().getMinutes().toString()}`
                })

                console.log(this.messages)
            }


            this.setOpen(new_value)
            if (new_value) {
                this.rooms[0]["roomName"] = ` ${eventName}`
            }
        }
    },

    methods: {
        setOpen(open) {
            this.isOpen = open;
            this.$emit('update:isOpenChatRoomEvent', open);

        },

        fetchMessages({ options = {} }) {


            setTimeout(() => {
     
                this.messagesLoaded = true
                // this.addNewMessage(this.messages)
            })
        },

        sendMessage(message) {
            console.log(message)
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

            let message_to_send = {
                event_id: this.targetEvent.event_id,
                message: this.messages[this.messages.length - 1]
            }

            console.log(message_to_send)

            // this.socket.emit('SEND_MESSAGE', message_to_send);

            fetch(this.$backBaseUrl + '/send', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(message_to_send)
                })
                .then(response => response.json())
                .then(data => console.log('Message sent:', data))
                .catch(err => console.error('Error sending message:', err));


        },

        addNewMessage(message) {
            console.log(message)
            if(message.senderId != this.currentUserId){
                setTimeout(() => {
                this.messages = [
                    ...this.messages,message
                ]
            }, 2000)
            }
            
        }



    }
}
</script>
