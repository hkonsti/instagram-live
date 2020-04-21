import fs from "fs";

export interface ReadWrite{
    read(location: string): Promise<string>;
    write(string: string, location?: string):  Promise<string>;     //returns location for read
}

export class SyncFileStorage implements ReadWrite{
    async read(location: string): Promise<string>{
        return fs.readFileSync(location).toString();
    }

    async write(string: string, location?: string): Promise<string>{
        if(location == undefined)
            location = "./temp.txt"
        fs.writeFileSync(location, string);
        return location;
    }
}
