import * as electron from "electron";

import { SerializableAPIClient } from "./serializer";
import { SyncFileStorage } from "./storage";
import { LiveEntity } from "instagram-private-api";

let startButton = document.getElementById("start");
let stopButton = document.getElementById("stop");
let loadButton = document.getElementById("load");

let url_element = document.getElementById("url");
let key_element = document.getElementById("key");
let chatlist = document.getElementById("chatlist");

let ig: SerializableAPIClient | undefined = undefined;
let broadcast_id: string | undefined;

//load file
let dialog = electron.remote.dialog
loadButton!.onclick = async function () {
    let path = await dialog.showOpenDialog({});
    if(path.filePaths == undefined)
        return;

    // this is blocking -> needs to be changed to asynchronous
    let info = await (new SyncFileStorage()).read(path.filePaths[0]);
    ig = new SerializableAPIClient();
    await ig.deserialize(JSON.parse(info));
}

//start stream
startButton!.onclick = async function(){
    if(ig != undefined && broadcast_id == undefined){
        const live = await ig.live.create({
            previewWidth: 720,
            previewHeight: 1280,

        })

        broadcast_id = live.broadcast_id;

        let { stream_key, stream_url } = await LiveEntity.getUrlAndKey({ broadcast_id, upload_url: live.upload_url });

        url_element!.innerText = stream_url;
        key_element!.innerText = stream_key;

        //start update loop asynchronously
        updateComments();
    }
}

//stop stream
stopButton!.onclick = async function () {
    if(ig != undefined && broadcast_id != undefined){
        await ig.live.endBroadcast(broadcast_id);
        broadcast_id = undefined;
    }
}

//update chat
let updateComments = async function(){
    while(broadcast_id != undefined){
        let lastCommentTs = 0;
        let { comments } = await ig!.live.getComment({broadcastId: broadcast_id, lastCommentTs});
        if(comments.length > 0){
            lastCommentTs = comments[comments.length - 1].created_at

            // render comments onto screen
            comments.forEach((element) => {
                let node = document.createElement("li");
                let text = document.createTextNode(`<b>${element.user.username}<b>: ${element.text}`);
                node.appendChild(text);
                chatlist!.appendChild(node);
            })
        }

        //wait for 2 seconds
        await wait(2000);
    }
}

// async/ await wrapper around setTimeout
let wait = async function(ms: number){
    return new Promise((resolve, reject) => {
        setTimeout(resolve, ms);
    });
}