import { SerializableAPIClient } from "./serializer";
import { ReadWrite, SyncFileStorage } from "./storage";
import { LiveEntity } from "instagram-private-api";

let startButton = document.getElementById("start");
let stopButton = document.getElementById("stop");

let url_element = document.getElementById("url");
let key_element = document.getElementById("key");

let ig: SerializableAPIClient | undefined = undefined;
let broadcast_id: string | undefined;

//load file

//start stream
startButton!.onclick = async function(){
    if(ig != undefined && broadcast_id == undefined){
        const { broadcast_id, upload_url } = await ig.live.create({
            previewWidth: 720,
            previewHeight: 1280,

        })

        let { stream_key, stream_url } = await LiveEntity.getUrlAndKey({ broadcast_id, upload_url });

        url_element!.innerText = stream_url;
        key_element!.innerText = stream_key;
    }
}

//stop stream
stopButton!.onclick = async function () {
    if(ig != undefined && broadcast_id != undefined){
        await ig.live.endBroadcast(broadcast_id);
    }
}

//update chat
