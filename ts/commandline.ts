import { SerializableAPIClient } from "./serializer";
import { ReadWrite, SyncFileStorage } from "./storage";
import { LiveEntity } from "instagram-private-api";
import { CL } from "./console";

let run = async function(){
    //load login from memory
    let igdata = await (new SyncFileStorage()).read("./public.txt");
    let ig = new SerializableAPIClient();
    await ig.deserialize(JSON.parse(igdata));

    //create a live stream
    const { broadcast_id, upload_url } = await ig.live.create({
        previewWidth: 720,
        previewHeight: 1280,

    })

    let { stream_key, stream_url } = await LiveEntity.getUrlAndKey({ broadcast_id, upload_url });
    console.log(`Stream Key: ${stream_key}`)
    console.log(`Stream Url: ${stream_url}`)

    //pause and wait for user to start streaming to stream url
    await CL.getInput("Press Enter when stream is set up.");

    //start streaming
    let startinfo = await ig.live.start(broadcast_id);
    console.log(`Stream Started: ${startinfo}`);

    //stop streaming
    await CL.getInput("Press Enter when you want to stop.");
    await ig.live.endBroadcast(broadcast_id);
}

run();