import * as readline from 'readline';

export class CL {
    static async getInput(query: string): Promise<string>{
        let rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        })

        return new Promise((resolve, reject) => {
            rl.question(query+"\n", (answer) => {
                rl.close();
                resolve(answer);
            })
        });
    }
}