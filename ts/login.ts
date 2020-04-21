import { SerializableAPIClient } from "./serializer";
import { ReadWrite, SyncFileStorage } from "./storage";
import { CL } from "./console";

class Login {
    ig: SerializableAPIClient;
    username: string;
    checkpoint = false;
    readwrite: ReadWrite;

    constructor(username: string, readwrite: ReadWrite){
        this.username = username;
        this.ig = new SerializableAPIClient();
        this.ig.state.generateDevice(username);
        this.readwrite = readwrite;
    }

    async login(password: string){
        try{
            await this.ig.account.login(this.username, password);
        }catch(e){
            if(this.ig.state.checkpoint != undefined){
                await this.ig.challenge.auto(true);
                this.checkpoint = true;
            }else{
                throw(e);
            }
        }
    }

    async solveChallenge(code: string){
        await this.ig.challenge.sendSecurityCode(code);
    }

    async store(location: string){
        await this.readwrite.write(JSON.stringify(await this.ig.serialize()), location);
    }
}

let run = async function(){
    // ask for username and password
    let username = await CL.getInput("Whats your username?");
    let password = await CL.getInput("Whats your password?");

    // try to log in
    console.log("OK. Trying to log in...");
    let login = new Login(username, new SyncFileStorage);
    await login.login(password);

    // if required ask for challenge code
    if(login.checkpoint){
        let code = await CL.getInput("Challenge required. Please input the six digit code you received via email or sms.");
        await login.solveChallenge(code);
    }

    // write everything to file specified
    let location = await CL.getInput("Where do you want to store this information?");
    await login.store(location);
}

run();