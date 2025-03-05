export function setYouTubeVideoFrame(video_src, deviceMaxWidth){
    return `
        <iframe width="${deviceMaxWidth * 0.98}" 
        height="315"
        src="${video_src}"
        frameborder="0" allowfullscreen>
        </iframe>`
}


export function setJointButton(event_id) {
    // 📤
 return ` 
        <div style="padding: 10px; text-align: center;">
            <button
            onclick="window.openJoinModal('${event_id}')"
            style="
                background-color: #4CAF50;
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 5px;
                cursor: pointer;
                font-size: 14px;
                width: 50%;
            ">
            Join Now
            </button>
        </div>`
}

export function setShareButton(event_id) {
     // 📤
  return ` <div style="padding: 1px; text-align: center;">
                <button onclick="window.shareEvent('${event_id}')"
                    style="
                    background-color: #007BFF;
                    color: white;
                    border: none;
                    padding: 5px 25px;
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 12px;
                    width: 50%;
                    ">
                   <i class="mdi mdi-share" "></i> Share
                </button>
            </div>`

}

export const setChatButton = function (event_id, event_description) {
  return ` <div style="padding: 1px; text-align: center;">
                            <button onclick="window.ChatRoomEvent('${event_id}', '${event_description}')"
                              style="
                                background-color: #007BFF;
                                color: white;
                                border: none;
                                padding: 5px 25px;
                                border-radius: 5px;
                                cursor: pointer;
                                font-size: 12px;
                                width: 50%;
                              ">
                               <i class="mdi mdi-chat" "></i> Chat
                            </button>
                          </div>`
};


export function setParticipantsOfEventButton(event) {
    // 📤
 return ` <div style="padding: 1px; text-align: center; width:70%">
               <button onclick="window.participantsOfEvent('${event}')"
                   style="
                   background-color: #007BFF;
                   color: white;
                   border: none;
                   padding: 5px 25px;
                   border-radius: 5px;
                   cursor: pointer;
                   font-size: 12px;
                   width: 50%;
                   ">
                   Show participants
               </button>
           </div>`
}

export function setEventDescriptionButton(event) {
    // 📤
 return ` <div style="padding: 1px; text-align: center; width:70%">
               <button onclick="window.getEventDescription('${event}')"
                   style="
                   background-color: #007BFF;
                   color: white;
                   border: none;
                   padding: 5px 25px;
                   border-radius: 5px;
                   cursor: pointer;
                   font-size: 12px;
                   width: 50%;
                   ">
                   show event description
               </button>
           </div>`
}

