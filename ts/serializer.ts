import * as PrivateInstagramAPI from "instagram-private-api";

export interface APIClientStore{
    adid: string;
    deviceId: string;
    proxyUrl: string;
    timezoneOffset: string;
    deviceString: string;
    build: string;
    uuid: string;
    phoneId: string;
    cookies: string;
    checkpoint: any;
    challenge: any;
}

/**
 * Extends the IgApiClient class to add the function of saving and loading a state
 */
export class SerializableAPIClient extends PrivateInstagramAPI.IgApiClient{
    constructor(){
        super();
    }

    /**
     * Turns it's state into a APIClientStore JSON Object
     */
    public async serialize(): Promise<APIClientStore>{
        let obj: APIClientStore = {
            adid: this.state.adid,
            deviceId: this.state.deviceId,
            proxyUrl: this.state.proxyUrl,
            
            timezoneOffset: this.state.timezoneOffset,
            deviceString: this.state.deviceString,
            build: this.state.build,
            uuid: this.state.uuid,
            phoneId: this.state.phoneId,

            cookies: JSON.stringify(await this.state.serializeCookieJar()),
            checkpoint: this.state.checkpoint,
            challenge: this.state.challenge
        } 

        return obj;
    }

    /**
     * Takes an APIClientStore JSON Object and copies it into the state
     * @param obj - APIClientStore Object
     */
    public async deserialize(obj: APIClientStore): Promise<void>{
        this.state.adid = obj.adid;
        this.state.deviceId = obj.deviceId;
        this.state.proxyUrl = obj.proxyUrl;
        this.state.timezoneOffset = obj.timezoneOffset;
        this.state.deviceString = obj.deviceString;
        this.state.build = obj.build;
        this.state.uuid = obj.uuid;
        this.state.phoneId = obj.phoneId;
        
        await this.state.deserializeCookieJar(obj.cookies);
        this.state.checkpoint = obj.checkpoint;
        this.state.challenge = this.state.challenge;
    }
}